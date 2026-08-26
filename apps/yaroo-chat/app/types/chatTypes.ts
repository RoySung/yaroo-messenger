import type { BuzzEvent, ChatMessage } from '@yaroo/chat-protocol';

export type ChatTimelineItem =
  | { kind: 'message'; data: ChatMessage }
  | { kind: 'buzz'; data: BuzzEvent };
