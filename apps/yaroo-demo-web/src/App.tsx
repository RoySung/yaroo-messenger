import { useEffect, useRef, useState } from 'react';
import LoginScreen from './components/LoginScreen';
import MainMessenger from './components/MainMessenger';
import ChatWindow from './components/ChatWindow';
import { User, currentUser as defaultUser } from './mockData';

interface BuzzRequest {
  id: number;
  contactId: string;
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeChats, setActiveChats] = useState<User[]>([]);
  const [zIndices, setZIndices] = useState<Record<string, number>>({ main: 10 });
  const [, setTopZIndex] = useState(10);
  const [activeWindowId, setActiveWindowId] = useState('main');
  const [buzzRequest, setBuzzRequest] = useState<BuzzRequest | null>(null);
  const buzzRequestId = useRef(0);

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

  const handleLogin = (user: User) => {
    setCurrentUser(user || defaultUser);
    bringToFront('main');
  };

  const handleUpdateUser = (updatedUserData: Partial<User>) => {
    setCurrentUser(prev => prev ? {
      ...prev,
      ...updatedUserData
    } : null);
  };

  const handleOpenChat = (contact: User) => {
    setActiveChats(chats => chats.some(chat => chat.id === contact.id) ? chats : [...chats, contact]);
    bringToFront(`chat-${contact.id}`);
  };

  const handleRequestBuzz = (contact: User) => {
    handleOpenChat(contact);
    setBuzzRequest({ contactId: contact.id, id: ++buzzRequestId.current });
  };

  const handleCloseChat = (contactId: string) => {
    setActiveChats(prev => prev.filter(c => c.id !== contactId));
    setBuzzRequest(request => request?.contactId === contactId ? null : request);
    if (activeWindowId === `chat-${contactId}`) {
      setActiveWindowId('main');
    }
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
    <div className="w-full h-full relative overflow-hidden">
      {!currentUser ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <>
          <MainMessenger 
            user={currentUser} 
            onOpenChat={handleOpenChat}
            onRequestBuzz={handleRequestBuzz}
            onUpdateUser={handleUpdateUser}
            zIndex={zIndices['main'] || 10}
            onFocus={() => bringToFront('main')}
          />
          {activeChats.map((contact, index) => {
            const messengerX = typeof window !== 'undefined' ? Math.max(20, window.innerWidth - 340) : 800;
            const defaultChatX = Math.max(20, messengerX - 560 + (index % 5) * 30);
            const defaultChatY = Math.min(typeof window !== 'undefined' ? window.innerHeight - 500 : 400, 40 + (index % 5) * 30);

            return (
              <ChatWindow 
                key={contact.id} 
                contact={contact} 
                user={currentUser}
                onClose={() => handleCloseChat(contact.id)} 
                zIndex={zIndices[`chat-${contact.id}`] || (11 + index)}
                onFocus={() => bringToFront(`chat-${contact.id}`)}
                buzzRequest={buzzRequest?.contactId === contact.id ? buzzRequest : null}
                onBuzzHandled={(requestId) => {
                  setBuzzRequest(request => request?.id === requestId ? null : request);
                }}
                initialPosition={{
                  x: defaultChatX,
                  y: defaultChatY
                }}
              />
            );
          })}
        </>
      )}
    </div>
  );
}

export default App;
