import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import test from 'node:test';

import {
  AVATAR_IDS,
  CHAT_LIMITS,
  type Ack,
  type BuzzEvent,
  type ChatMessage,
  type ClientToServerEvents,
  type OnlineUser,
  type PresenceUpdatePayload,
  type ServerToClientEvents,
  type SessionJoinPayload,
} from '@yaroo/chat-protocol';
import { io as createClient, type Socket } from 'socket.io-client';

import {
  attachChatServer,
  createChatServer,
  readChatServerConfig,
  type ChatServer,
  type ChatServerOptions,
} from './chatServer.js';

type ChatClient = Socket<ServerToClientEvents, ClientToServerEvents>;

interface TestServer {
  server: ChatServer;
  url: string;
  clients: ChatClient[];
  connect(): Promise<ChatClient>;
  close(): Promise<void>;
}

const startServer = async (
  options: ChatServerOptions = {},
): Promise<TestServer> => {
  const server = createChatServer(options);
  const address = await server.listen();
  const url = `http://127.0.0.1:${address.port}`;
  const clients: ChatClient[] = [];

  return {
    server,
    url,
    clients,
    connect: () =>
      new Promise<ChatClient>((resolve, reject) => {
        const client = createClient(url, {
          forceNew: true,
          reconnection: false,
          transports: ['websocket'],
        }) as ChatClient;
        const timeout = setTimeout(() => {
          client.close();
          reject(new Error('Timed out connecting test client.'));
        }, 1_000);
        client.once('connect', () => {
          clearTimeout(timeout);
          clients.push(client);
          resolve(client);
        });
        client.once('connect_error', (error) => {
          clearTimeout(timeout);
          client.close();
          reject(error);
        });
      }),
    close: async () => {
      for (const client of clients) {
        client.close();
      }
      await server.close();
    },
  };
};

const emitRaw = (
  client: ChatClient,
  event: string,
  payload: unknown,
  callback?: (ack: unknown) => void,
): void => {
  const emit = client.emit.bind(client) as (
    eventName: string,
    eventPayload: unknown,
    acknowledge?: (ack: unknown) => void,
  ) => void;
  emit(event, payload, callback);
};

const join = (
  client: ChatClient,
  payload: SessionJoinPayload,
): Promise<Ack<OnlineUser>> =>
  new Promise((resolve) => client.emit('session:join', payload, resolve));

const updatePresence = (
  client: ChatClient,
  payload: PresenceUpdatePayload,
): Promise<Ack<OnlineUser>> =>
  new Promise((resolve) => client.emit('presence:update', payload, resolve));

const sendMessage = (
  client: ChatClient,
  payload: { toSessionId: string; text: string },
): Promise<Ack<ChatMessage>> =>
  new Promise((resolve) => client.emit('message:send', payload, resolve));

const sendBuzz = (
  client: ChatClient,
  toSessionId: string,
): Promise<Ack<BuzzEvent>> =>
  new Promise((resolve) =>
    client.emit('buzz:send', { toSessionId }, resolve),
  );

const waitForSnapshot = (
  client: ChatClient,
  predicate: (users: OnlineUser[]) => boolean = () => true,
): Promise<OnlineUser[]> =>
  new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      client.off('presence:snapshot', handleSnapshot);
      reject(new Error('Timed out waiting for presence snapshot.'));
    }, 1_000);
    const handleSnapshot = (users: OnlineUser[]): void => {
      if (!predicate(users)) {
        return;
      }
      clearTimeout(timeout);
      client.off('presence:snapshot', handleSnapshot);
      resolve(users);
    };
    client.on('presence:snapshot', handleSnapshot);
  });

const waitForMessage = (client: ChatClient): Promise<ChatMessage> =>
  new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      client.off('message:received', handleMessage);
      reject(new Error('Timed out waiting for direct message.'));
    }, 1_000);
    const handleMessage = (message: ChatMessage): void => {
      clearTimeout(timeout);
      client.off('message:received', handleMessage);
      resolve(message);
    };
    client.on('message:received', handleMessage);
  });

const waitForBuzz = (client: ChatClient): Promise<BuzzEvent> =>
  new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      client.off('buzz:received', handleBuzz);
      reject(new Error('Timed out waiting for Buzz.'));
    }, 1_000);
    const handleBuzz = (buzz: BuzzEvent): void => {
      clearTimeout(timeout);
      client.off('buzz:received', handleBuzz);
      resolve(buzz);
    };
    client.on('buzz:received', handleBuzz);
  });

const pause = (milliseconds = 40): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const successfulData = <T>(ack: Ack<T>): T => {
  assert.equal(ack.ok, true);
  return ack.data;
};

const assertError = <T>(ack: Ack<T>, code: string): void => {
  assert.equal(ack.ok, false);
  if (!ack.ok) {
    assert.equal(ack.error.code, code);
    assert.match(ack.error.message, /[\u3400-\u9fff]/u);
  }
};

test('configuration uses safe host defaults and rejects invalid values', () => {
  assert.deepEqual(readChatServerConfig({}), {
    port: 3_000,
    hostname: '127.0.0.1',
  });
  assert.deepEqual(
    readChatServerConfig({ PORT: ' 4100 ', HOST: ' 0.0.0.0 ' }),
    { port: 4_100, hostname: '0.0.0.0' },
  );
  assert.deepEqual(readChatServerConfig({}, '0.0.0.0'), {
    port: 3_000,
    hostname: '0.0.0.0',
  });

  for (const port of ['', '0', '-1', '3.14', '65536', 'not-a-port']) {
    assert.throws(
      () => readChatServerConfig({ PORT: port }),
      /PORT must be an integer/,
    );
  }

  for (const hostname of ['', 'https://example.test', 'host/path', 'host name']) {
    assert.throws(
      () => readChatServerConfig({ HOST: hostname }),
      /HOST must be a hostname or IP address without a URL scheme or path/,
    );
  }
});

test('one HTTP server serves requests and exactly one attached Socket.IO runtime', async () => {
  const httpServer = createServer((_request, response) => {
    response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('next-handler');
  });
  const attachedServer = attachChatServer(httpServer, {
    selectAvatar: () => 'cat_roy.svg',
  });
  assert.throws(
    () => attachChatServer(httpServer),
    /already attached/,
  );

  const address = await new Promise<AddressInfo>((resolve, reject) => {
    httpServer.once('error', reject);
    httpServer.listen(0, '127.0.0.1', () => {
      httpServer.off('error', reject);
      const boundAddress = httpServer.address();
      if (!boundAddress || typeof boundAddress === 'string') {
        reject(new Error('Unified test server did not bind to TCP.'));
        return;
      }
      resolve(boundAddress);
    });
  });
  const url = `http://127.0.0.1:${address.port}`;
  const clients: ChatClient[] = [];
  const connect = (): Promise<ChatClient> =>
    new Promise((resolve, reject) => {
      const client = createClient(url, {
        forceNew: true,
        reconnection: false,
        transports: ['websocket'],
      }) as ChatClient;
      const timeout = setTimeout(() => {
        client.close();
        reject(new Error('Timed out connecting unified test client.'));
      }, 1_000);
      client.once('connect', () => {
        clearTimeout(timeout);
        clients.push(client);
        resolve(client);
      });
      client.once('connect_error', (error) => {
        clearTimeout(timeout);
        client.close();
        reject(error);
      });
    });

  try {
    const response = await fetch(url);
    assert.equal(response.status, 200);
    assert.equal(await response.text(), 'next-handler');

    const roy = await connect();
    const bei = await connect();
    const royUser = successfulData(
      await join(roy, { nickname: 'Roy', initialPresence: 'available' }),
    );
    const beiUser = successfulData(
      await join(bei, { nickname: 'Bei', initialPresence: 'available' }),
    );

    let recipientEventCount = 0;
    const recipientMessage = new Promise<ChatMessage>((resolve) => {
      bei.on('message:received', (message) => {
        recipientEventCount += 1;
        resolve(message);
      });
    });
    let acknowledgmentCount = 0;
    const acknowledgment = await new Promise<Ack<ChatMessage>>((resolve) => {
      roy.emit(
        'message:send',
        { toSessionId: beiUser.sessionId, text: 'one event' },
        (value) => {
          acknowledgmentCount += 1;
          resolve(value);
        },
      );
    });
    const delivered = await recipientMessage;
    await pause();

    assert.equal(successfulData(acknowledgment).fromSessionId, royUser.sessionId);
    assert.equal(delivered.text, 'one event');
    assert.equal(acknowledgmentCount, 1);
    assert.equal(recipientEventCount, 1);
  } finally {
    for (const client of clients) {
      client.close();
    }
    await attachedServer.close();
  }
});

test('join trims and reserves a Unicode-bounded nickname case-insensitively', async () => {
  const context = await startServer();
  try {
    const roy = await context.connect();
    const duplicate = await context.connect();
    const invalid = await context.connect();

    const royUser = successfulData(
      await join(roy, { nickname: '  Roy  ', initialPresence: 'available' }),
    );
    const { avatarId, ...royIdentity } = royUser;
    assert.ok(AVATAR_IDS.includes(avatarId));
    assert.deepEqual(royIdentity, {
      sessionId: roy.id,
      nickname: 'Roy',
      presence: 'available',
      customStatus: '',
    });

    assertError(
      await join(duplicate, {
        nickname: 'roy',
        initialPresence: 'invisible',
      }),
      'NICKNAME_TAKEN',
    );
    assertError(
      await join(invalid, { nickname: '   ', initialPresence: 'available' }),
      'INVALID_NICKNAME',
    );
    assertError(
      await join(invalid, {
        nickname: '😺'.repeat(CHAT_LIMITS.nickname.max + 1),
        initialPresence: 'available',
      }),
      'INVALID_NICKNAME',
    );

    const invalidPresence = await new Promise<Ack<OnlineUser>>((resolve) => {
      emitRaw(
        invalid,
        'session:join',
        { nickname: 'Bei', initialPresence: 'online' },
        (ack) => resolve(ack as Ack<OnlineUser>),
      );
    });
    assertError(invalidPresence, 'INVALID_PRESENCE');

    const maxNickname = '😺'.repeat(CHAT_LIMITS.nickname.max);
    assert.equal(
      successfulData(
        await join(invalid, {
          nickname: maxNickname,
          initialPresence: 'invisible',
        }),
      ).nickname,
      maxNickname,
    );

    assertError(
      await join(roy, { nickname: 'Other', initialPresence: 'available' }),
      'NICKNAME_TAKEN',
    );
  } finally {
    await context.close();
  }
});

test('avatar catalog contains exactly the nine supported cat SVG identifiers', () => {
  assert.deepEqual(AVATAR_IDS, [
    'cat_ann.svg',
    'cat_candy.svg',
    'cat_golden.svg',
    'cat_hsuan.svg',
    'cat_kai.svg',
    'cat_meatball.svg',
    'cat_nine.svg',
    'cat_patrick.svg',
    'cat_roy.svg',
  ]);
});

test('avatar selection allows duplicates and remains stable in public user records', async () => {
  const context = await startServer({ selectAvatar: () => 'cat_ann.svg' });
  try {
    const roy = await context.connect();
    const bei = await context.connect();
    const royUser = successfulData(
      await join(roy, { nickname: 'Roy', initialPresence: 'available' }),
    );

    const roySeesBei = waitForSnapshot(
      roy,
      (users) => users[0]?.nickname === 'Bei',
    );
    const beiSeesRoy = waitForSnapshot(
      bei,
      (users) => users[0]?.nickname === 'Roy',
    );
    const beiUser = successfulData(
      await join(bei, { nickname: 'Bei', initialPresence: 'busy' }),
    );

    assert.equal(royUser.avatarId, 'cat_ann.svg');
    assert.equal(beiUser.avatarId, 'cat_ann.svg');
    assert.equal((await roySeesBei)[0]?.avatarId, 'cat_ann.svg');
    assert.equal((await beiSeesRoy)[0]?.avatarId, 'cat_ann.svg');

    const updatedSnapshot = waitForSnapshot(
      bei,
      (users) => users[0]?.presence === 'away',
    );
    const updatedRoy = successfulData(
      await updatePresence(roy, {
        presence: 'away',
        customStatus: 'Stepped out',
      }),
    );
    assert.equal(updatedRoy.avatarId, 'cat_ann.svg');
    assert.equal((await updatedSnapshot)[0]?.avatarId, 'cat_ann.svg');
  } finally {
    await context.close();
  }
});

test('resume avatar validation rejects unsafe values without reserving a nickname', async () => {
  let selections = 0;
  const context = await startServer({
    selectAvatar: () => {
      selections += 1;
      return 'cat_roy.svg';
    },
  });
  try {
    const observer = await context.connect();
    successfulData(
      await join(observer, {
        nickname: 'Observer',
        initialPresence: 'available',
      }),
    );
    await pause();

    let snapshots = 0;
    observer.on('presence:snapshot', () => snapshots++);

    const invalid = await context.connect();
    const rawJoin = (payload: unknown): Promise<Ack<OnlineUser>> =>
      new Promise((resolve) => {
        emitRaw(invalid, 'session:join', payload, (ack) => {
          resolve(ack as Ack<OnlineUser>);
        });
      });

    assertError(
      await rawJoin({
        nickname: 'Roy',
        initialPresence: 'available',
        resumeAvatarId: 'https://example.test/avatar.png',
      }),
      'INVALID_AVATAR',
    );
    assertError(
      await rawJoin({
        nickname: 'Roy',
        initialPresence: 'available',
        resumeAvatarId: 7,
      }),
      'INVALID_AVATAR',
    );
    assertError(
      await rawJoin({
        nickname: 'Roy',
        initialPresence: 'available',
        resumeAvatarId: 'guy_blond.jpg',
      }),
      'INVALID_AVATAR',
    );
    await pause();
    assert.equal(snapshots, 0);

    const resumed = successfulData(
      await join(invalid, {
        nickname: 'Roy',
        initialPresence: 'away',
      }),
    );
    assert.equal(resumed.avatarId, 'cat_roy.svg');
    assert.equal(selections, 2);
  } finally {
    await context.close();
  }
});

test('unjoined and malformed mutations fail without broadcasts or state changes', async () => {
  const context = await startServer();
  try {
    const roy = await context.connect();
    const outsider = await context.connect();
    successfulData(
      await join(roy, { nickname: 'Roy', initialPresence: 'available' }),
    );
    await pause();

    let snapshots = 0;
    let messages = 0;
    let buzzes = 0;
    roy.on('presence:snapshot', () => snapshots++);
    roy.on('message:received', () => messages++);
    roy.on('buzz:received', () => buzzes++);

    assertError(
      await updatePresence(outsider, {
        presence: 'busy',
        customStatus: 'intrusion',
      }),
      'NOT_JOINED',
    );
    assertError(
      await sendMessage(outsider, { toSessionId: roy.id!, text: 'hello' }),
      'NOT_JOINED',
    );
    assertError(await sendBuzz(outsider, roy.id!), 'NOT_JOINED');

    emitRaw(outsider, 'presence:update', null);
    emitRaw(outsider, 'message:send', { text: 7 });
    emitRaw(outsider, 'buzz:send', []);
    await pause();
    assert.equal(snapshots, 0);
    assert.equal(messages, 0);
    assert.equal(buzzes, 0);

    assert.equal(
      successfulData(
        await join(outsider, {
          nickname: 'Bei',
          initialPresence: 'available',
        }),
      ).nickname,
      'Bei',
    );
  } finally {
    await context.close();
  }
});

test('presence snapshots are recipient-specific, authoritative, and preserve invisible sessions', async () => {
  const context = await startServer();
  try {
    const roy = await context.connect();
    const bei = await context.connect();
    const royUser = successfulData(
      await join(roy, { nickname: 'Roy', initialPresence: 'available' }),
    );

    const roySeesBei = waitForSnapshot(
      roy,
      (users) => users.length === 1 && users[0]?.nickname === 'Bei',
    );
    const beiSeesRoy = waitForSnapshot(
      bei,
      (users) => users.length === 1 && users[0]?.nickname === 'Roy',
    );
    const beiUser = successfulData(
      await join(bei, { nickname: 'Bei', initialPresence: 'busy' }),
    );
    assert.deepEqual(await roySeesBei, [beiUser]);
    assert.deepEqual(await beiSeesRoy, [royUser]);

    const updatedRoySnapshot = waitForSnapshot(
      bei,
      (users) => users[0]?.customStatus === 'Deep work',
    );
    const updatedRoy = successfulData(
      await updatePresence(roy, {
        presence: 'busy',
        customStatus: '  Deep work  ',
      }),
    );
    assert.equal(updatedRoy.customStatus, 'Deep work');
    assert.deepEqual(await updatedRoySnapshot, [updatedRoy]);

    const maxStatus = '😺'.repeat(CHAT_LIMITS.customStatus.max);
    const maxStatusSnapshot = waitForSnapshot(
      bei,
      (users) => users[0]?.customStatus === maxStatus,
    );
    assert.equal(
      successfulData(
        await updatePresence(roy, {
          presence: 'away',
          customStatus: maxStatus,
        }),
      ).customStatus,
      maxStatus,
    );
    await maxStatusSnapshot;

    const restoredRoySnapshot = waitForSnapshot(
      bei,
      (users) => users[0]?.customStatus === 'Deep work',
    );
    successfulData(
      await updatePresence(roy, {
        presence: 'busy',
        customStatus: 'Deep work',
      }),
    );
    await restoredRoySnapshot;

    let changedSnapshots = 0;
    bei.on('presence:snapshot', () => changedSnapshots++);
    const invalidPresence = await new Promise<Ack<OnlineUser>>((resolve) => {
      emitRaw(
        roy,
        'presence:update',
        { presence: 'online', customStatus: 'bad' },
        (ack) => resolve(ack as Ack<OnlineUser>),
      );
    });
    assertError(invalidPresence, 'INVALID_PRESENCE');
    assertError(
      await updatePresence(roy, {
        presence: 'away',
        customStatus: '😺'.repeat(CHAT_LIMITS.customStatus.max + 1),
      }),
      'STATUS_TOO_LONG',
    );
    await pause();
    assert.equal(changedSnapshots, 0);

    const hiddenFromRoy = waitForSnapshot(roy, (users) => users.length === 0);
    const visibleToBei = waitForSnapshot(
      bei,
      (users) => users.length === 1 && users[0]?.nickname === 'Roy',
    );
    successfulData(
      await updatePresence(bei, {
        presence: 'invisible',
        customStatus: 'hidden',
      }),
    );
    assert.deepEqual(await hiddenFromRoy, []);
    assert.equal((await visibleToBei)[0]?.nickname, 'Roy');

    const inbound = waitForMessage(bei);
    const sent = successfulData(
      await sendMessage(roy, {
        toSessionId: beiUser.sessionId,
        text: 'still connected',
      }),
    );
    assert.deepEqual(await inbound, sent);
  } finally {
    await context.close();
  }
});

test('disconnect removes presence, releases the nickname, and makes stale sessions offline', async () => {
  const context = await startServer();
  try {
    const roy = await context.connect();
    const bei = await context.connect();
    successfulData(
      await join(roy, { nickname: 'Roy', initialPresence: 'available' }),
    );
    const roySeesBei = waitForSnapshot(roy, (users) => users.length === 1);
    const beiUser = successfulData(
      await join(bei, { nickname: 'Bei', initialPresence: 'available' }),
    );
    await roySeesBei;

    const removed = waitForSnapshot(roy, (users) => users.length === 0);
    bei.disconnect();
    assert.deepEqual(await removed, []);
    assertError(
      await sendMessage(roy, {
        toSessionId: beiUser.sessionId,
        text: 'are you there?',
      }),
      'RECIPIENT_OFFLINE',
    );
    assertError(await sendBuzz(roy, beiUser.sessionId), 'RECIPIENT_OFFLINE');

    const replacement = await context.connect();
    assert.equal(
      successfulData(
        await join(replacement, {
          nickname: 'bEi',
          initialPresence: 'away',
        }),
      ).nickname,
      'bEi',
    );
  } finally {
    await context.close();
  }
});

test('direct messages are bounded, server-authored, and delivered only to both participants', async () => {
  const context = await startServer({ now: () => 1_777_777_777_777 });
  try {
    const roy = await context.connect();
    const bei = await context.connect();
    const tom = await context.connect();
    const royUser = successfulData(
      await join(roy, { nickname: 'Roy', initialPresence: 'available' }),
    );
    const beiUser = successfulData(
      await join(bei, { nickname: 'Bei', initialPresence: 'available' }),
    );
    successfulData(
      await join(tom, { nickname: 'Tom', initialPresence: 'available' }),
    );

    let tomMessages = 0;
    tom.on('message:received', () => tomMessages++);
    const royMessage = waitForMessage(roy);
    const beiMessage = waitForMessage(bei);
    const acknowledgment = await new Promise<Ack<ChatMessage>>((resolve) => {
      emitRaw(
        roy,
        'message:send',
        {
          toSessionId: beiUser.sessionId,
          text: '  hello  ',
          fromSessionId: beiUser.sessionId,
          fromNickname: 'Impostor',
        },
        (ack) => resolve(ack as Ack<ChatMessage>),
      );
    });
    const delivered = successfulData(acknowledgment);
    assert.deepEqual(await royMessage, delivered);
    assert.deepEqual(await beiMessage, delivered);
    assert.equal(delivered.fromSessionId, royUser.sessionId);
    assert.equal(delivered.fromNickname, 'Roy');
    assert.equal(delivered.toSessionId, beiUser.sessionId);
    assert.equal(delivered.text, 'hello');
    assert.match(
      delivered.id,
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u,
    );
    assert.equal(delivered.sentAt, new Date(1_777_777_777_777).toISOString());
    await pause();
    assert.equal(tomMessages, 0);

    let rejectedEvents = 0;
    bei.on('message:received', () => rejectedEvents++);
    assertError(
      await sendMessage(roy, { toSessionId: beiUser.sessionId, text: '   ' }),
      'INVALID_MESSAGE',
    );
    assertError(
      await sendMessage(roy, {
        toSessionId: beiUser.sessionId,
        text: '😺'.repeat(CHAT_LIMITS.message.max + 1),
      }),
      'INVALID_MESSAGE',
    );
    const malformed = await new Promise<Ack<ChatMessage>>((resolve) => {
      emitRaw(
        roy,
        'message:send',
        { toSessionId: beiUser.sessionId, text: 42 },
        (ack) => resolve(ack as Ack<ChatMessage>),
      );
    });
    assertError(malformed, 'INVALID_MESSAGE');
    await pause();
    assert.equal(rejectedEvents, 0);

    const maxTextReceived = waitForMessage(bei);
    const maxText = '😺'.repeat(CHAT_LIMITS.message.max);
    assert.equal(
      successfulData(
        await sendMessage(roy, {
          toSessionId: beiUser.sessionId,
          text: maxText,
        }),
      ).text,
      maxText,
    );
    assert.equal((await maxTextReceived).text, maxText);
  } finally {
    await context.close();
  }
});

test('Buzz is recipient-only, directed-pair rate limited, and accepted after 3000 ms', async () => {
  let currentTime = 10_000;
  const context = await startServer({ now: () => currentTime });
  try {
    const roy = await context.connect();
    const bei = await context.connect();
    const tom = await context.connect();
    const royUser = successfulData(
      await join(roy, { nickname: 'Roy', initialPresence: 'available' }),
    );
    const beiUser = successfulData(
      await join(bei, { nickname: 'Bei', initialPresence: 'available' }),
    );
    const tomUser = successfulData(
      await join(tom, { nickname: 'Tom', initialPresence: 'available' }),
    );

    let senderBuzzes = 0;
    roy.on('buzz:received', () => senderBuzzes++);
    const beiBuzz = waitForBuzz(bei);
    const first = successfulData(await sendBuzz(roy, beiUser.sessionId));
    assert.deepEqual(await beiBuzz, first);
    assert.equal(first.fromSessionId, royUser.sessionId);
    assert.equal(first.fromNickname, 'Roy');
    assert.equal(first.toSessionId, beiUser.sessionId);
    assert.equal(first.sentAt, new Date(currentTime).toISOString());
    await pause();
    assert.equal(senderBuzzes, 0);

    let repeatedEvents = 0;
    bei.on('buzz:received', () => repeatedEvents++);
    const cooldown = await sendBuzz(roy, beiUser.sessionId);
    assertError(cooldown, 'BUZZ_COOLDOWN');
    assert.equal(cooldown.ok ? undefined : cooldown.error.retryAfterMs, 3_000);

    const tomBuzz = waitForBuzz(tom);
    const sentToTom = successfulData(await sendBuzz(roy, tomUser.sessionId));
    assert.deepEqual(await tomBuzz, sentToTom);
    const reverseBuzz = waitForBuzz(roy);
    const sentToRoy = successfulData(await sendBuzz(bei, royUser.sessionId));
    assert.deepEqual(await reverseBuzz, sentToRoy);

    currentTime += CHAT_LIMITS.buzzCooldownMs - 1;
    const almostReady = await sendBuzz(roy, beiUser.sessionId);
    assertError(almostReady, 'BUZZ_COOLDOWN');
    assert.equal(
      almostReady.ok ? undefined : almostReady.error.retryAfterMs,
      1,
    );
    currentTime += 1;
    const acceptedAgainEvent = waitForBuzz(bei);
    const acceptedAgain = successfulData(
      await sendBuzz(roy, beiUser.sessionId),
    );
    assert.deepEqual(await acceptedAgainEvent, acceptedAgain);
    await pause();
    assert.equal(repeatedEvents, 1);

    const malformed = await new Promise<Ack<BuzzEvent>>((resolve) => {
      emitRaw(roy, 'buzz:send', { toSessionId: 42 }, (ack) =>
        resolve(ack as Ack<BuzzEvent>),
      );
    });
    assertError(malformed, 'RECIPIENT_OFFLINE');
  } finally {
    await context.close();
  }
});

test('a fresh server has no sessions, nickname reservations, or Buzz cooldowns', async () => {
  const currentTime = 50_000;
  const first = await startServer({ now: () => currentTime });
  try {
    const roy = await first.connect();
    const bei = await first.connect();
    const beiUser = successfulData(
      await join(bei, { nickname: 'Bei', initialPresence: 'available' }),
    );
    successfulData(
      await join(roy, { nickname: 'Roy', initialPresence: 'available' }),
    );
    successfulData(await sendBuzz(roy, beiUser.sessionId));
  } finally {
    await first.close();
  }

  const restarted = await startServer({ now: () => currentTime });
  try {
    const roy = await restarted.connect();
    const bei = await restarted.connect();
    successfulData(
      await join(roy, { nickname: 'Roy', initialPresence: 'available' }),
    );
    const beiUser = successfulData(
      await join(bei, { nickname: 'Bei', initialPresence: 'available' }),
    );
    const delivered = waitForBuzz(bei);
    const sent = successfulData(await sendBuzz(roy, beiUser.sessionId));
    assert.deepEqual(await delivered, sent);
  } finally {
    await restarted.close();
  }
});
