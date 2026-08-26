import {
  CHAT_EVENTS,
  type Ack,
  type BuzzEvent,
  type BuzzSendPayload,
  type ChatMessage,
  type ClientToServerEvents,
  type OnlineUser,
  type MessageSendPayload,
  type PresenceUpdatePayload,
  type ServerToClientEvents,
  type SessionJoinPayload,
} from '@yaroo/chat-protocol';
import { io, type Socket } from 'socket.io-client';

const JOIN_ACK_TIMEOUT_MS = 10_000;

type ChatSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
type RejoinSuccessListener = (user: OnlineUser) => void;
type RejoinFailureListener = (message: string) => void;
type PresenceSnapshotListener = (users: OnlineUser[]) => void;
type MessageListener = (message: ChatMessage) => void;
type BuzzListener = (buzz: BuzzEvent) => void;

const connectionErrorMessage = '無法連線至聊天室，請稍後再試。';

export class ChatClient {
  private readonly socket: ChatSocket;
  private readonly rejoinSuccessListeners = new Set<RejoinSuccessListener>();
  private readonly rejoinFailureListeners = new Set<RejoinFailureListener>();
  private connectionPromise: Promise<void> | null = null;
  private resumePayload: SessionJoinPayload | null = null;
  private rejoinInFlight = false;

  constructor() {
    this.socket = io({
      autoConnect: false,
      reconnection: true,
    });

    this.socket.on('connect', () => {
      if (this.resumePayload) {
        void this.rejoin(this.resumePayload);
      }
    });
  }

  async join(payload: SessionJoinPayload): Promise<Ack<OnlineUser>> {
    await this.ensureConnected();
    const acknowledgment = await this.emitJoin(payload);

    if (acknowledgment.ok) {
      this.resumePayload = {
        ...payload,
        resumeAvatarId: acknowledgment.data.avatarId,
      };
    }

    return acknowledgment;
  }

  updatePresence(payload: PresenceUpdatePayload): Promise<Ack<OnlineUser>> {
    return new Promise(resolve => {
      this.socket.emit(CHAT_EVENTS.presenceUpdate, payload, acknowledgment => {
        if (acknowledgment.ok && this.resumePayload) {
          this.resumePayload = {
            ...this.resumePayload,
            initialPresence: acknowledgment.data.presence,
          };
        }
        resolve(acknowledgment);
      });
    });
  }

  sendMessage(payload: MessageSendPayload): Promise<Ack<ChatMessage>> {
    return new Promise(resolve => {
      this.socket.emit(CHAT_EVENTS.messageSend, payload, resolve);
    });
  }

  sendBuzz(payload: BuzzSendPayload): Promise<Ack<BuzzEvent>> {
    return new Promise(resolve => {
      this.socket.emit(CHAT_EVENTS.buzzSend, payload, resolve);
    });
  }

  onPresenceSnapshot(listener: PresenceSnapshotListener): () => void {
    this.socket.on(CHAT_EVENTS.presenceSnapshot, listener);
    return () => this.socket.off(CHAT_EVENTS.presenceSnapshot, listener);
  }

  onMessageReceived(listener: MessageListener): () => void {
    this.socket.on(CHAT_EVENTS.messageReceived, listener);
    return () => this.socket.off(CHAT_EVENTS.messageReceived, listener);
  }

  onBuzzReceived(listener: BuzzListener): () => void {
    this.socket.on(CHAT_EVENTS.buzzReceived, listener);
    return () => this.socket.off(CHAT_EVENTS.buzzReceived, listener);
  }

  onRejoinSuccess(listener: RejoinSuccessListener): () => void {
    this.rejoinSuccessListeners.add(listener);
    return () => this.rejoinSuccessListeners.delete(listener);
  }

  onRejoinFailure(listener: RejoinFailureListener): () => void {
    this.rejoinFailureListeners.add(listener);
    return () => this.rejoinFailureListeners.delete(listener);
  }

  private ensureConnected(): Promise<void> {
    if (this.socket.connected) {
      return Promise.resolve();
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise<void>((resolve, reject) => {
      const handleConnect = () => {
        cleanup();
        resolve();
      };
      const handleConnectError = () => {
        cleanup();
        this.socket.disconnect();
        reject(new Error(connectionErrorMessage));
      };
      const cleanup = () => {
        this.socket.off('connect', handleConnect);
        this.socket.off('connect_error', handleConnectError);
      };

      this.socket.once('connect', handleConnect);
      this.socket.once('connect_error', handleConnectError);
      this.socket.connect();
    }).finally(() => {
      this.connectionPromise = null;
    });

    return this.connectionPromise;
  }

  private emitJoin(payload: SessionJoinPayload): Promise<Ack<OnlineUser>> {
    return new Promise((resolve, reject) => {
      const timeoutId = globalThis.setTimeout(() => {
        this.socket.disconnect();
        reject(new Error(connectionErrorMessage));
      }, JOIN_ACK_TIMEOUT_MS);

      this.socket.emit(CHAT_EVENTS.sessionJoin, payload, acknowledgment => {
        globalThis.clearTimeout(timeoutId);
        resolve(acknowledgment);
      });
    });
  }

  private async rejoin(payload: SessionJoinPayload): Promise<void> {
    if (this.rejoinInFlight) {
      return;
    }

    this.rejoinInFlight = true;
    try {
      const acknowledgment = await this.emitJoin(payload);
      if (acknowledgment.ok) {
        this.rejoinSuccessListeners.forEach(listener => listener(acknowledgment.data));
        return;
      }

      this.resumePayload = null;
      this.rejoinFailureListeners.forEach(listener => listener(acknowledgment.error.message));
    } catch (error) {
      this.resumePayload = null;
      const message = error instanceof Error ? error.message : connectionErrorMessage;
      this.rejoinFailureListeners.forEach(listener => listener(message));
    } finally {
      this.rejoinInFlight = false;
    }
  }
}

let chatClient: ChatClient | null = null;

export const getChatClient = (): ChatClient => {
  if (typeof window === 'undefined') {
    throw new Error('ChatClient can only be created in the browser.');
  }

  chatClient ??= new ChatClient();
  return chatClient;
};
