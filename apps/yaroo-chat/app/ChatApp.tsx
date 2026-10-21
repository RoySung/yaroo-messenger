'use client';

import { useEffect, useRef, useState } from 'react';
import LoginScreen from './components/LoginScreen';
import type { LoginRequest } from './components/LoginScreen';
import MainMessenger from './components/MainMessenger';
import ChatWindow from './components/ChatWindow';
import {
  AVATAR_IDS,
  type Ack,
  type BuzzEvent,
  type BuzzSendPayload,
  type ChatMessage,
  type MessageSendPayload,
  type OnlineUser,
  type PresenceUpdatePayload,
} from '@yaroo/chat-protocol';
import { getChatClient, type ChatClient } from './chatClient';
import { usePhonePortrait } from './hooks/usePhonePortrait';
import {
  appendTimelineItem as appendBoundedTimelineItem,
  type ChatTimelineItem,
} from './types/chatTypes';
import type { User } from './types/userTypes';

interface BuzzRequest {
  id: number;
  contactId: string;
}

const avatarIds: ReadonlySet<string> = new Set(AVATAR_IDS);
const fallbackAvatarSource = '/avatars/cat_roy.svg';

const toAvatarSource = (avatarId: unknown): string =>
  typeof avatarId === 'string' && avatarIds.has(avatarId)
    ? `/avatars/${avatarId}`
    : fallbackAvatarSource;

const toDisplayUser = (user: OnlineUser): User => ({
  id: user.sessionId,
  nickname: user.nickname,
  status: user.presence,
  customStatus: user.customStatus,
  avatar: toAvatarSource(user.avatarId),
  message: user.customStatus,
});

const latestIncomingBuzz = (
  timeline: ChatTimelineItem[],
  ownSessionId: string,
): BuzzEvent | undefined => {
  for (let index = timeline.length - 1; index >= 0; index -= 1) {
    const item = timeline[index];
    if (item.kind === 'buzz' && item.data.toSessionId === ownSessionId) {
      return item.data;
    }
  }
  return undefined;
};

function App() {
  const isPhonePortrait = usePhonePortrait();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [visibleUsers, setVisibleUsers] = useState<OnlineUser[]>([]);
  const [activeChats, setActiveChats] = useState<User[]>([]);
  const [timelineByPeer, setTimelineByPeer] = useState<Record<string, ChatTimelineItem[]>>({});
  const [zIndices, setZIndices] = useState<Record<string, number>>({ main: 10 });
  const [, setTopZIndex] = useState(10);
  const [activeWindowId, setActiveWindowId] = useState('main');
  const activeWindowIdRef = useRef(activeWindowId);
  const isPhonePortraitRef = useRef(isPhonePortrait);
  const [buzzRequest, setBuzzRequest] = useState<BuzzRequest | null>(null);
  const buzzRequestId = useRef(0);
  const chatClientRef = useRef<ChatClient | null>(null);
  const currentUserRef = useRef<User | null>(null);
  const visibleUsersRef = useRef<OnlineUser[]>([]);
  const [viewport, setViewport] = useState({ width: 1_140, height: 900 });

  useEffect(() => {
    activeWindowIdRef.current = activeWindowId;
  }, [activeWindowId]);

  useEffect(() => {
    isPhonePortraitRef.current = isPhonePortrait;
  }, [isPhonePortrait]);

  const appendTimelineItem = (peerSessionId: string, item: ChatTimelineItem) => {
    setTimelineByPeer(current => {
      const timeline = current[peerSessionId] ?? [];
      const nextTimeline = appendBoundedTimelineItem(timeline, item);
      if (nextTimeline === timeline) {
        return current;
      }
      return { ...current, [peerSessionId]: nextTimeline };
    });
  };

  const ensureInboundChat = (sessionId: string, nickname: string) => {
    setActiveChats(chats => {
      if (chats.some(chat => chat.id === sessionId)) {
        return chats;
      }
      const visibleUser = visibleUsersRef.current.find(user => user.sessionId === sessionId);
      return [
        ...chats,
        visibleUser ? toDisplayUser(visibleUser) : {
          id: sessionId,
          nickname,
          status: 'available',
          customStatus: '',
          message: '',
          avatar: fallbackAvatarSource,
        },
      ];
    });
  };

  const bringToFront = (windowId: string) => {
    setActiveWindowId(windowId);
    setTopZIndex(prev => {
      const nextZ = prev + 1;
      setZIndices(current => ({
        ...current,
        [windowId]: nextZ
      }));
      return nextZ;
    });
  };

  const handleLogin = async (request: LoginRequest): Promise<Ack<OnlineUser>> => {
    const client = chatClientRef.current ?? getChatClient();
    chatClientRef.current = client;
    const acknowledgment = await client.join(request);
    if (acknowledgment.ok) {
      setLoginError(null);
      const joinedUser = toDisplayUser(acknowledgment.data);
      currentUserRef.current = joinedUser;
      setCurrentUser(joinedUser);
      bringToFront('main');
    }

    return acknowledgment;
  };

  const handleBackToContacts = () => {
    setActiveWindowId('main');
  };

  const handleCloseChat = (contactId: string) => {
    setActiveChats(prev => prev.filter(c => c.id !== contactId));
    setBuzzRequest(request => request?.contactId === contactId ? null : request);
    setActiveWindowId(current => current === `chat-${contactId}` ? 'main' : current);
  };

  useEffect(() => {
    const client = getChatClient();
    chatClientRef.current = client;
    const stopListeningForSuccess = client.onRejoinSuccess(user => {
      const rejoinedUser = toDisplayUser(user);
      currentUserRef.current = rejoinedUser;
      setCurrentUser(rejoinedUser);
      setLoginError(null);
    });
    const stopListeningForFailure = client.onRejoinFailure(message => {
      setCurrentUser(null);
      currentUserRef.current = null;
      setVisibleUsers([]);
      visibleUsersRef.current = [];
      setActiveChats([]);
      setTimelineByPeer({});
      setLoginError(message);
    });
    const stopListeningForPresence = client.onPresenceSnapshot(users => {
      setVisibleUsers(users);
      visibleUsersRef.current = users;
      setActiveChats(chats => chats.map(chat => {
        const updatedUser = users.find(user => user.sessionId === chat.id);
        return updatedUser ? toDisplayUser(updatedUser) : chat;
      }));
    });
    const stopListeningForMessages = client.onMessageReceived(message => {
      const ownSessionId = currentUserRef.current?.id;
      if (!ownSessionId) return;

      const peerSessionId = message.fromSessionId === ownSessionId
        ? message.toSessionId
        : message.fromSessionId;
      appendTimelineItem(peerSessionId, { kind: 'message', data: message });
      if (message.fromSessionId !== ownSessionId) {
        ensureInboundChat(message.fromSessionId, message.fromNickname);
        const currentActive = activeWindowIdRef.current;
        const isPhone = isPhonePortraitRef.current;
        if (!isPhone || currentActive === 'main' || currentActive === `chat-${message.fromSessionId}`) {
          bringToFront(`chat-${message.fromSessionId}`);
        }
      }
    });
    const stopListeningForBuzz = client.onBuzzReceived(buzz => {
      appendTimelineItem(buzz.fromSessionId, { kind: 'buzz', data: buzz });
      ensureInboundChat(buzz.fromSessionId, buzz.fromNickname);
      const currentActive = activeWindowIdRef.current;
      const isPhone = isPhonePortraitRef.current;
      if (!isPhone || currentActive === 'main' || currentActive === `chat-${buzz.fromSessionId}`) {
        bringToFront(`chat-${buzz.fromSessionId}`);
      }
    });

    return () => {
      stopListeningForSuccess();
      stopListeningForFailure();
      stopListeningForPresence();
      stopListeningForMessages();
      stopListeningForBuzz();
    };
  }, []);

  useEffect(() => {
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const handlePresenceUpdate = async (payload: PresenceUpdatePayload): Promise<Ack<OnlineUser>> => {
    const acknowledgment = await getChatClient().updatePresence(payload);
    if (acknowledgment.ok) {
      const updatedUser = toDisplayUser(acknowledgment.data);
      currentUserRef.current = updatedUser;
      setCurrentUser(updatedUser);
    }
    return acknowledgment;
  };

  const handleSendMessage = (payload: MessageSendPayload): Promise<Ack<ChatMessage>> =>
    getChatClient().sendMessage(payload);

  const handleSendBuzz = async (payload: BuzzSendPayload): Promise<Ack<BuzzEvent>> => {
    const acknowledgment = await getChatClient().sendBuzz(payload);
    if (acknowledgment.ok) {
      appendTimelineItem(payload.toSessionId, { kind: 'buzz', data: acknowledgment.data });
    }
    return acknowledgment;
  };

  const handleOpenChat = (contact: User) => {
    setActiveChats(chats => chats.some(chat => chat.id === contact.id) ? chats : [...chats, contact]);
    bringToFront(`chat-${contact.id}`);
  };

  const handleRequestBuzz = (contact: User) => {
    handleOpenChat(contact);
    setBuzzRequest({ contactId: contact.id, id: ++buzzRequestId.current });
  };

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'g') return;

      const activeChatId = activeWindowId.startsWith('chat-')
        ? activeWindowId.slice('chat-'.length)
        : null;
      const activeChat = activeChats.find(chat => chat.id === activeChatId);

      if (activeChat) {
        event.preventDefault();
        handleRequestBuzz(activeChat);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [activeChats, activeWindowId]);

  return (
    <div
      className="chat-app-shell"
      data-layout={isPhonePortrait ? 'phone-portrait' : 'desktop'}
    >
      {!currentUser ? (
        <LoginScreen onLogin={handleLogin} initialError={loginError} isPhonePortrait={isPhonePortrait} />
      ) : (
        <>
          <div
            aria-hidden={isPhonePortrait && activeWindowId !== 'main'}
            style={{ display: isPhonePortrait && activeWindowId !== 'main' ? 'none' : 'contents' }}
          >
            <MainMessenger 
              key={currentUser.id}
              user={currentUser} 
              contacts={visibleUsers.map(toDisplayUser)}
              onOpenChat={handleOpenChat}
              onRequestBuzz={handleRequestBuzz}
              onUpdatePresence={handlePresenceUpdate}
              initialPosition={{ x: Math.max(20, viewport.width - 340), y: 40 }}
              zIndex={zIndices['main'] || 10}
              onFocus={() => bringToFront('main')}
              isPhonePortrait={isPhonePortrait}
            />
          </div>
          {activeChats.map((contact, index) => {
            const chatWindowId = `chat-${contact.id}`;
            const isHiddenOnPhone = isPhonePortrait && activeWindowId !== chatWindowId;

            const messengerX = Math.max(20, viewport.width - 340);
            const defaultChatX = Math.max(20, messengerX - 560 + (index % 5) * 30);
            const defaultChatY = Math.min(viewport.height - 500, 40 + (index % 5) * 30);

            return (
              <div
                key={contact.id}
                aria-hidden={isHiddenOnPhone}
                style={{ display: isHiddenOnPhone ? 'none' : 'contents' }}
              >
                <ChatWindow 
                  contact={contact} 
                  user={currentUser}
                  messages={timelineByPeer[contact.id] ?? []}
                  onSendMessage={handleSendMessage}
                  onSendBuzz={handleSendBuzz}
                  incomingBuzz={latestIncomingBuzz(timelineByPeer[contact.id] ?? [], currentUser.id)}
                  onClose={() => handleCloseChat(contact.id)} 
                  onBack={handleBackToContacts}
                  isPhonePortrait={isPhonePortrait}
                  zIndex={zIndices[chatWindowId] || (11 + index)}
                  onFocus={() => bringToFront(chatWindowId)}
                  buzzRequest={buzzRequest?.contactId === contact.id ? buzzRequest : null}
                  onBuzzHandled={(requestId) => {
                    setBuzzRequest(request => request?.id === requestId ? null : request);
                  }}
                  initialPosition={{
                    x: defaultChatX,
                    y: defaultChatY
                  }}
                />
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default App;
