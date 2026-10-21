import { randomInt, randomUUID } from 'node:crypto';
import { createServer, type Server as HttpServer } from 'node:http';
import type { AddressInfo } from 'node:net';

import {
  AVATAR_IDS,
  CHAT_ERROR_MESSAGES,
  CHAT_LIMITS,
  PRESENCE_STATES,
  type Ack,
  type AvatarId,
  type BuzzEvent,
  type ChatErrorCode,
  type ChatMessage,
  type ClientToServerEvents,
  type OnlineUser,
  type PresenceState,
  type ServerToClientEvents,
} from '@yaroo/chat-protocol';
import { Server } from 'socket.io';

const DEFAULT_PORT = 3_000;
const DEFAULT_HOSTNAME = '127.0.0.1';
const attachedHttpServers = new WeakSet<HttpServer>();

type Clock = () => number;
type AvatarSelector = () => AvatarId;

interface JoinedSession extends OnlineUser {
  normalizedNickname: string;
}

export interface ChatServerConfig {
  port: number;
  hostname: string;
}

interface ChatServerEnvironment {
  readonly HOST?: string;
  readonly PORT?: string;
  readonly [key: string]: string | undefined;
}

export interface ChatServerOptions {
  now?: Clock;
  selectAvatar?: AvatarSelector;
}

export interface AttachedChatServer {
  io: Server<ClientToServerEvents, ServerToClientEvents>;
  close(): Promise<void>;
}

export interface ChatServer {
  httpServer: HttpServer;
  io: Server<ClientToServerEvents, ServerToClientEvents>;
  listen(port?: number, hostname?: string): Promise<AddressInfo>;
  close(): Promise<void>;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const codePointLength = (value: string): number => Array.from(value).length;

const isPresenceState = (value: unknown): value is PresenceState =>
  typeof value === 'string' &&
  (PRESENCE_STATES as readonly string[]).includes(value);

const isAvatarId = (value: unknown): value is AvatarId =>
  typeof value === 'string' &&
  (AVATAR_IDS as readonly string[]).includes(value);

const failure = <T>(
  code: ChatErrorCode,
  details?: Pick<Extract<Ack<T>, { ok: false }>['error'], 'retryAfterMs'>,
): Ack<T> => ({
  ok: false,
  error: {
    code,
    message: CHAT_ERROR_MESSAGES[code],
    ...details,
  },
});

const acknowledge = <T>(callback: unknown, value: Ack<T>): void => {
  if (typeof callback === 'function') {
    callback(value);
  }
};

const parsePort = (configuredPort: string | undefined): number => {
  if (configuredPort === undefined) {
    return DEFAULT_PORT;
  }

  const value = configuredPort.trim();
  if (!/^\d+$/.test(value)) {
    throw new Error('PORT must be an integer from 1 through 65535.');
  }

  const port = Number(value);
  if (!Number.isSafeInteger(port) || port < 1 || port > 65_535) {
    throw new Error('PORT must be an integer from 1 through 65535.');
  }

  return port;
};

const parseHostname = (
  configuredHostname: string | undefined,
  defaultHostname: string,
): string => {
  const hostname = (configuredHostname ?? defaultHostname).trim();
  if (
    hostname.length === 0 ||
    hostname.length > 253 ||
    hostname.includes('://') ||
    /[\s/?#]/u.test(hostname)
  ) {
    throw new Error(
      'HOST must be a hostname or IP address without a URL scheme or path.',
    );
  }

  return hostname;
};

export const readChatServerConfig = (
  environment: ChatServerEnvironment = process.env,
  defaultHostname = DEFAULT_HOSTNAME,
): ChatServerConfig => ({
  port: parsePort(environment.PORT),
  hostname: parseHostname(environment.HOST, defaultHostname),
});

export const attachChatServer = (
  httpServer: HttpServer,
  options: ChatServerOptions = {},
): AttachedChatServer => {
  if (attachedHttpServers.has(httpServer)) {
    throw new Error('Socket.IO is already attached to this HTTP server.');
  }
  attachedHttpServers.add(httpServer);

  const now = options.now ?? Date.now;
  const selectAvatar =
    options.selectAvatar ?? (() => AVATAR_IDS[randomInt(AVATAR_IDS.length)]);
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer);

  const sessionsBySocketId = new Map<string, JoinedSession>();
  const socketIdByNickname = new Map<string, string>();
  const buzzCooldowns = new Map<string, Map<string, number>>();

  const publicUser = (session: JoinedSession): OnlineUser => ({
    sessionId: session.sessionId,
    nickname: session.nickname,
    presence: session.presence,
    customStatus: session.customStatus,
    avatarId: session.avatarId,
  });

  const broadcastPresence = (): void => {
    for (const recipient of sessionsBySocketId.values()) {
      const snapshot = [...sessionsBySocketId.values()]
        .filter(
          (candidate) =>
            candidate.sessionId !== recipient.sessionId &&
            candidate.presence !== 'invisible',
        )
        .map(publicUser);
      io.to(recipient.sessionId).emit('presence:snapshot', snapshot);
    }
  };

  const joinedSession = (socketId: string): JoinedSession | undefined =>
    sessionsBySocketId.get(socketId);

  io.on('connection', (socket) => {
    socket.on('session:join', (payload, callback) => {
      if (joinedSession(socket.id)) {
        acknowledge(callback, failure('NICKNAME_TAKEN'));
        return;
      }

      if (!isRecord(payload) || typeof payload.nickname !== 'string') {
        acknowledge(callback, failure('INVALID_NICKNAME'));
        return;
      }

      const nickname = payload.nickname.trim();
      if (
        codePointLength(nickname) < CHAT_LIMITS.nickname.min ||
        codePointLength(nickname) > CHAT_LIMITS.nickname.max
      ) {
        acknowledge(callback, failure('INVALID_NICKNAME'));
        return;
      }

      if (!isPresenceState(payload.initialPresence)) {
        acknowledge(callback, failure('INVALID_PRESENCE'));
        return;
      }

      const resumeAvatarId = payload.resumeAvatarId;
      if (resumeAvatarId !== undefined && !isAvatarId(resumeAvatarId)) {
        acknowledge(callback, failure('INVALID_AVATAR'));
        return;
      }

      const normalizedNickname = nickname.toLowerCase();
      if (socketIdByNickname.has(normalizedNickname)) {
        acknowledge(callback, failure('NICKNAME_TAKEN'));
        return;
      }

      const avatarId = resumeAvatarId ?? selectAvatar();
      if (!isAvatarId(avatarId)) {
        acknowledge(callback, failure('INVALID_AVATAR'));
        return;
      }

      const session: JoinedSession = {
        sessionId: socket.id,
        nickname,
        normalizedNickname,
        presence: payload.initialPresence,
        customStatus: '',
        avatarId,
      };
      sessionsBySocketId.set(socket.id, session);
      socketIdByNickname.set(normalizedNickname, socket.id);

      acknowledge(callback, { ok: true, data: publicUser(session) });
      broadcastPresence();
    });

    socket.on('presence:update', (payload, callback) => {
      const session = joinedSession(socket.id);
      if (!session) {
        acknowledge(callback, failure('NOT_JOINED'));
        return;
      }

      if (!isRecord(payload) || !isPresenceState(payload.presence)) {
        acknowledge(callback, failure('INVALID_PRESENCE'));
        return;
      }

      if (typeof payload.customStatus !== 'string') {
        acknowledge(callback, failure('STATUS_TOO_LONG'));
        return;
      }

      const customStatus = payload.customStatus.trim();
      if (codePointLength(customStatus) > CHAT_LIMITS.customStatus.max) {
        acknowledge(callback, failure('STATUS_TOO_LONG'));
        return;
      }

      session.presence = payload.presence;
      session.customStatus = customStatus;
      acknowledge(callback, { ok: true, data: publicUser(session) });
      broadcastPresence();
    });

    socket.on('message:send', (payload, callback) => {
      const sender = joinedSession(socket.id);
      if (!sender) {
        acknowledge(callback, failure('NOT_JOINED'));
        return;
      }

      if (!isRecord(payload) || typeof payload.text !== 'string') {
        acknowledge(callback, failure('INVALID_MESSAGE'));
        return;
      }

      const text = payload.text.trim();
      if (
        codePointLength(text) < CHAT_LIMITS.message.min ||
        codePointLength(text) > CHAT_LIMITS.message.max
      ) {
        acknowledge(callback, failure('INVALID_MESSAGE'));
        return;
      }

      if (typeof payload.toSessionId !== 'string') {
        acknowledge(callback, failure('RECIPIENT_OFFLINE'));
        return;
      }
      const recipient = joinedSession(payload.toSessionId);
      if (!recipient) {
        acknowledge(callback, failure('RECIPIENT_OFFLINE'));
        return;
      }

      const message: ChatMessage = {
        id: randomUUID(),
        fromSessionId: sender.sessionId,
        toSessionId: recipient.sessionId,
        fromNickname: sender.nickname,
        text,
        sentAt: new Date(now()).toISOString(),
      };
      io.to([sender.sessionId, recipient.sessionId]).emit(
        'message:received',
        message,
      );
      acknowledge(callback, { ok: true, data: message });
    });

    socket.on('buzz:send', (payload, callback) => {
      const sender = joinedSession(socket.id);
      if (!sender) {
        acknowledge(callback, failure('NOT_JOINED'));
        return;
      }

      if (!isRecord(payload) || typeof payload.toSessionId !== 'string') {
        acknowledge(callback, failure('RECIPIENT_OFFLINE'));
        return;
      }
      const recipient = joinedSession(payload.toSessionId);
      if (!recipient) {
        acknowledge(callback, failure('RECIPIENT_OFFLINE'));
        return;
      }

      const acceptedAt = now();
      const recipientCooldowns = buzzCooldowns.get(sender.sessionId);
      const lastAcceptedAt = recipientCooldowns?.get(recipient.sessionId);
      if (lastAcceptedAt !== undefined) {
        const elapsed = Math.max(0, acceptedAt - lastAcceptedAt);
        if (elapsed < CHAT_LIMITS.buzzCooldownMs) {
          acknowledge(
            callback,
            failure('BUZZ_COOLDOWN', {
              retryAfterMs: CHAT_LIMITS.buzzCooldownMs - elapsed,
            }),
          );
          return;
        }
      }

      const senderCooldowns = recipientCooldowns ?? new Map<string, number>();
      senderCooldowns.set(recipient.sessionId, acceptedAt);
      buzzCooldowns.set(sender.sessionId, senderCooldowns);

      const buzz: BuzzEvent = {
        id: randomUUID(),
        fromSessionId: sender.sessionId,
        toSessionId: recipient.sessionId,
        fromNickname: sender.nickname,
        sentAt: new Date(acceptedAt).toISOString(),
      };
      io.to(recipient.sessionId).emit('buzz:received', buzz);
      acknowledge(callback, { ok: true, data: buzz });
    });

    socket.on('disconnect', () => {
      const session = sessionsBySocketId.get(socket.id);
      if (!session) {
        return;
      }

      sessionsBySocketId.delete(socket.id);
      socketIdByNickname.delete(session.normalizedNickname);
      buzzCooldowns.delete(socket.id);
      for (const recipientCooldowns of buzzCooldowns.values()) {
        recipientCooldowns.delete(socket.id);
      }
      broadcastPresence();
    });
  });

  return {
    io,
    close: () =>
      new Promise<void>((resolve) => {
        io.close(() => {
          attachedHttpServers.delete(httpServer);
          resolve();
        });
      }),
  };
};

export const createChatServer = (
  options: ChatServerOptions = {},
): ChatServer => {
  const httpServer = createServer((_request, response) => {
    response.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ status: 'ok' }));
  });
  const attachedServer = attachChatServer(httpServer, options);

  return {
    httpServer,
    io: attachedServer.io,
    listen: (port = 0, hostname = '127.0.0.1') =>
      new Promise<AddressInfo>((resolve, reject) => {
        const handleError = (error: Error): void => {
          httpServer.off('listening', handleListening);
          reject(error);
        };
        const handleListening = (): void => {
          httpServer.off('error', handleError);
          const address = httpServer.address();
          if (!address || typeof address === 'string') {
            reject(new Error('Chat server did not bind to a TCP address.'));
            return;
          }
          resolve(address);
        };
        httpServer.once('error', handleError);
        httpServer.once('listening', handleListening);
        httpServer.listen(port, hostname);
      }),
    close: attachedServer.close,
  };
};
