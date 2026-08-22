import { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import MainMessenger from './components/MainMessenger';
import ChatWindow from './components/ChatWindow';
import { User, currentUser as defaultUser } from './mockData';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeChats, setActiveChats] = useState<User[]>([]);
  const [zIndices, setZIndices] = useState<Record<string, number>>({ main: 10 });
  const [, setTopZIndex] = useState(10);

  const bringToFront = (windowId: string) => {
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
    if (!activeChats.find(c => c.id === contact.id)) {
      setActiveChats(prev => [...prev, contact]);
    }
    bringToFront(`chat-${contact.id}`);
  };

  const handleCloseChat = (contactId: string) => {
    setActiveChats(prev => prev.filter(c => c.id !== contactId));
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      {!currentUser ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <>
          <MainMessenger 
            user={currentUser} 
            onOpenChat={handleOpenChat}
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
