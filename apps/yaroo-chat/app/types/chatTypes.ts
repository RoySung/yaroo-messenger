import type { BuzzEvent, ChatMessage } from '@yaroo/chat-protocol';

export type ChatTimelineItem =
  | { kind: 'message'; data: ChatMessage }
  | { kind: 'buzz'; data: BuzzEvent };

export const MAX_TIMELINE_ITEMS_PER_PEER = 500;

export const appendTimelineItem = (
  timeline: ChatTimelineItem[],
  item: ChatTimelineItem,
): ChatTimelineItem[] => {
  if (timeline.some((existing) => existing.data.id === item.data.id)) {
    return timeline;
  }

  const nextTimeline = [...timeline, item];
  return nextTimeline.length > MAX_TIMELINE_ITEMS_PER_PEER
    ? nextTimeline.slice(-MAX_TIMELINE_ITEMS_PER_PEER)
    : nextTimeline;
};
