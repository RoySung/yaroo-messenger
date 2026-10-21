import assert from 'node:assert/strict';
import test from 'node:test';

import type { ChatMessage } from '@yaroo/chat-protocol';

import {
  MAX_TIMELINE_ITEMS_PER_PEER,
  appendTimelineItem,
  type ChatTimelineItem,
} from './chatTypes.js';

const messageItem = (id: string): ChatTimelineItem => ({
  kind: 'message',
  data: {
    id,
    fromSessionId: 'sender',
    toSessionId: 'recipient',
    fromNickname: 'Sender',
    text: id,
    sentAt: '2026-10-21T00:00:00.000Z',
  } satisfies ChatMessage,
});

test('timeline keeps the newest bounded items and ignores duplicates', () => {
  let timeline: ChatTimelineItem[] = [];
  for (let index = 0; index <= MAX_TIMELINE_ITEMS_PER_PEER; index += 1) {
    timeline = appendTimelineItem(timeline, messageItem(String(index)));
  }

  assert.equal(timeline.length, MAX_TIMELINE_ITEMS_PER_PEER);
  assert.equal(timeline[0]?.data.id, '1');
  assert.equal(appendTimelineItem(timeline, messageItem('1')), timeline);
});
