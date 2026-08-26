export const PRESENCE_STATES = [
  'available',
  'busy',
  'away',
  'invisible',
] as const;

export type PresenceState = (typeof PRESENCE_STATES)[number];

export const AVATAR_IDS = [
  'cat_ann.svg',
  'cat_candy.svg',
  'cat_golden.svg',
  'cat_hsuan.svg',
  'cat_kai.svg',
  'cat_meatball.svg',
  'cat_nine.svg',
  'cat_patrick.svg',
  'cat_roy.svg',
] as const;

export type AvatarId = (typeof AVATAR_IDS)[number];

export const CHAT_LIMITS = {
  nickname: { min: 1, max: 24 },
  customStatus: { min: 0, max: 40 },
  message: { min: 1, max: 1_000 },
  buzzCooldownMs: 3_000,
} as const;

export const CHAT_EVENTS = {
  sessionJoin: 'session:join',
  presenceUpdate: 'presence:update',
  messageSend: 'message:send',
  buzzSend: 'buzz:send',
  presenceSnapshot: 'presence:snapshot',
  messageReceived: 'message:received',
  buzzReceived: 'buzz:received',
} as const;

export const CHAT_ERROR_CODES = [
  'NOT_JOINED',
  'INVALID_NICKNAME',
  'NICKNAME_TAKEN',
  'INVALID_AVATAR',
  'INVALID_PRESENCE',
  'STATUS_TOO_LONG',
  'INVALID_MESSAGE',
  'RECIPIENT_OFFLINE',
  'BUZZ_COOLDOWN',
] as const;

export type ChatErrorCode = (typeof CHAT_ERROR_CODES)[number];

export const CHAT_ERROR_MESSAGES: Readonly<Record<ChatErrorCode, string>> = {
  NOT_JOINED: '請先加入聊天室。',
  INVALID_NICKNAME: '暱稱必須為 1 至 24 個字元。',
  NICKNAME_TAKEN: '這個暱稱目前正在使用中。',
  INVALID_AVATAR: '無效的頭貼。',
  INVALID_PRESENCE: '無效的上線狀態。',
  STATUS_TOO_LONG: '自訂狀態不可超過 40 個字元。',
  INVALID_MESSAGE: '訊息必須為 1 至 1000 個字元。',
  RECIPIENT_OFFLINE: '對方目前不在線上。',
  BUZZ_COOLDOWN: '請稍候再傳送 Buzz。',
};

export interface ChatError {
  code: ChatErrorCode;
  message: string;
  retryAfterMs?: number;
}

export type Ack<T> =
  | { ok: true; data: T }
  | { ok: false; error: ChatError };

export interface OnlineUser {
  sessionId: string;
  nickname: string;
  presence: PresenceState;
  customStatus: string;
  avatarId: AvatarId;
}

export interface ChatMessage {
  id: string;
  fromSessionId: string;
  toSessionId: string;
  fromNickname: string;
  text: string;
  sentAt: string;
}

export interface BuzzEvent {
  id: string;
  fromSessionId: string;
  toSessionId: string;
  fromNickname: string;
  sentAt: string;
}

export interface SessionJoinPayload {
  nickname: string;
  initialPresence: PresenceState;
  resumeAvatarId?: AvatarId;
}

export interface PresenceUpdatePayload {
  presence: PresenceState;
  customStatus: string;
}

export interface MessageSendPayload {
  toSessionId: string;
  text: string;
}

export interface BuzzSendPayload {
  toSessionId: string;
}

export type Acknowledge<T> = (acknowledgment: Ack<T>) => void;

export interface ClientToServerEvents {
  'session:join': (
    payload: SessionJoinPayload,
    acknowledge: Acknowledge<OnlineUser>,
  ) => void;
  'presence:update': (
    payload: PresenceUpdatePayload,
    acknowledge: Acknowledge<OnlineUser>,
  ) => void;
  'message:send': (
    payload: MessageSendPayload,
    acknowledge: Acknowledge<ChatMessage>,
  ) => void;
  'buzz:send': (
    payload: BuzzSendPayload,
    acknowledge: Acknowledge<BuzzEvent>,
  ) => void;
}

export interface ServerToClientEvents {
  'presence:snapshot': (users: OnlineUser[]) => void;
  'message:received': (message: ChatMessage) => void;
  'buzz:received': (buzz: BuzzEvent) => void;
}
