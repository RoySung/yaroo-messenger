import { useState } from 'react';
import { User, UserStatus, contacts as initialContacts } from '../mockData';
import { Window, WindowHeader, Avatar, StatusBadge, Toolbar, MenuBar, Select, useDraggable } from '@yaroo/ui';

interface MainMessengerProps {
  user: User;
  onOpenChat: (contact: User) => void;
  onRequestBuzz: (contact: User) => void;
  onUpdateUser: (updatedData: Partial<User>) => void;
  isPhonePortrait: boolean;
  zIndex?: number;
  onFocus: () => void;
  initialPosition?: { x: number; y: number };
}

const presenceLabels: Record<UserStatus, string> = {
  available: '線上',
  busy: '忙碌',
  away: '馬上回來',
  offline: '離線',
  invisible: '隱藏'
};

export const MainMessenger = ({ user, onOpenChat, onRequestBuzz, onUpdateUser, isPhonePortrait, zIndex = 10, onFocus, initialPosition }: MainMessengerProps) => {
  const defaultInitialPos = typeof window !== 'undefined'
    ? { x: Math.max(20, window.innerWidth - 340), y: 40 }
    : { x: 800, y: 40 };

  const { position, handleMouseDown } = useDraggable({
    initialPosition: initialPosition || defaultInitialPos,
    onFocus
  });

  const [contacts] = useState(initialContacts);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    initialContacts.reduce((acc, group) => ({ ...acc, [group.group]: true }), {})
  );
  const [currentPresence, setCurrentPresence] = useState<UserStatus>(user.status || 'available');
  const [customStatus, setCustomStatus] = useState(user.customStatus || '你在做什麼？');
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [statusInput, setStatusInput] = useState(user.customStatus || '');

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const handlePresenceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as UserStatus;
    setCurrentPresence(newStatus);
    if (onUpdateUser) {
      onUpdateUser({ status: newStatus });
    }
  };

  const handleSaveStatus = () => {
    const trimmed = statusInput.trim() || '你在做什麼？';
    setCustomStatus(trimmed);
    setIsEditingStatus(false);
    if (onUpdateUser) {
      onUpdateUser({ customStatus: trimmed });
    }
  };

  const handleStatusKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveStatus();
    } else if (e.key === 'Escape') {
      setStatusInput(customStatus);
      setIsEditingStatus(false);
    }
  };

  const startEditStatus = () => {
    setStatusInput(customStatus);
    setIsEditingStatus(true);
  };

  // Count online users
  const totalContacts = contacts.reduce((sum, g) => sum + g.users.length, 0);
  const onlineContacts = contacts.reduce((sum, g) => 
    sum + g.users.filter(u => u.status === 'available' || u.status === 'busy').length, 0
  );

  return (
    <Window 
      className="demo-window demo-main-window w-[300px] h-[560px] min-w-0 min-h-0 max-w-full bg-yr-bg flex flex-col absolute overflow-hidden"
      style={isPhonePortrait
        ? { zIndex }
        : { left: `${position.x}px`, top: `${position.y}px`, zIndex }}
      onMouseDown={isPhonePortrait ? undefined : onFocus}
    >
      <WindowHeader 
        title="Yaroo! 即時通" 
        logoSrc="/yaroo-logo.svg" 
        onMouseDown={isPhonePortrait ? undefined : handleMouseDown}
        onMinimize={isPhonePortrait ? undefined : () => {}}
        onMaximize={isPhonePortrait ? undefined : () => {}}
        onClose={isPhonePortrait ? undefined : () => {}}
      />

      <MenuBar 
        items={[
          {
            label: '即時通(M)',
            items: [
              { label: '線上 (Available)', icon: '🟢', onClick: () => { setCurrentPresence('available'); onUpdateUser?.({ status: 'available' }); } },
              { label: '忙碌 (Busy)', icon: '🔴', onClick: () => { setCurrentPresence('busy'); onUpdateUser?.({ status: 'busy' }); } },
              { label: '馬上回來 (Be Right Back)', icon: '🟡', onClick: () => { setCurrentPresence('away'); onUpdateUser?.({ status: 'away' }); } },
              { label: '隱藏 (Invisible)', icon: '⚪', onClick: () => { setCurrentPresence('invisible'); onUpdateUser?.({ status: 'invisible' }); } },
              { divider: true },
              { label: '變更顯示圖片...', disabled: true },
              { label: '個人喜好設定(P)...', disabled: true }
            ]
          },
          {
            label: '聯絡人(C)',
            items: [
              { label: '新增聯絡人(A)...', icon: '➕', disabled: true },
              { label: '搜尋聯絡人(S)...', icon: '🔍', disabled: true },
              { divider: true },
              { label: '顯示離線聯絡人', disabled: true }
            ]
          },
          {
            label: '動作(A)',
            items: [
              {
                label: '傳送叮咚 (Buzz)',
                icon: '🔔',
                shortcut: 'Ctrl+G',
                onClick: () => {
                  const firstOnline = contacts.flatMap(g => g.users).find(u => u.status === 'available');
                  if (firstOnline) {
                    onRequestBuzz(firstOnline);
                  }
                }
              },
              {
                label: '傳送即時訊息(M)...',
                icon: '✉️',
                onClick: () => {
                  const firstOnline = contacts.flatMap(g => g.users).find(u => u.status === 'available');
                  if (firstOnline) {
                    onOpenChat(firstOnline);
                  }
                }
              },
              { label: '傳送檔案(F)...', icon: '📁', disabled: true }
            ]
          },
          {
            label: '說明(H)',
            items: [
              { label: 'Yaroo! 即時通說明(H)', disabled: true },
              { divider: true },
              { label: '關於 Yaroo! 即時通(A)', disabled: true }
            ]
          }
        ]}
      />

      {/* User Profile Card */}
      <div className="demo-main-profile px-yr-3 py-yr-2.5 flex min-w-0 shrink-0 items-start gap-yr-2.5 overflow-hidden border-b border-yr-border bg-[linear-gradient(to_bottom,#FFFFFF_0%,#F5F3EC_100%)] shadow-[inset_0_1px_0_#FFF]">
        <div className="relative w-[52px] h-[52px] shrink-0">
          <Avatar size="md" src={user.avatar || '/avatars/cat_roy.svg'} alt={user.nickname} />
          <StatusBadge
            status={currentPresence}
            size="sm"
            className="absolute -bottom-[2px] -right-[2px]"
            role="img"
            aria-label={`目前狀態：${presenceLabels[currentPresence]}`}
          />
        </div>

        <div className="flex flex-col gap-[3px] flex-1 min-w-0">
          <div className="flex items-center gap-yr-1">
            <span className="font-bold text-yr-md text-yr-purple-dark whitespace-nowrap overflow-hidden text-ellipsis" title={user.nickname}>
              {user.nickname}
            </span>
          </div>

          {/* Editable Custom Status */}
          <div className="min-h-[22px] flex items-center">
            {isEditingStatus ? (
              <div className="flex items-center gap-[3px] w-full">
                <input
                  type="text"
                  className="flex-1 text-yr-sm px-[4px] py-[2px] border border-yr-purple rounded-yr-sm outline-none bg-white text-[#111] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]"
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  onKeyDown={handleStatusKeyDown}
                  onBlur={handleSaveStatus}
                  autoFocus
                  placeholder="輸入自訂狀態訊息..."
                  maxLength={40}
                />
                <button 
                  className="bg-yr-purple text-white border border-yr-purple-dark rounded-yr-sm px-[6px] py-[2px] text-yr-xs font-bold" 
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSaveStatus();
                  }}
                  onClick={handleSaveStatus}
                  title="儲存"
                >
                  ✓
                </button>
              </div>
            ) : (
              <div 
                className="flex items-center gap-[4px] text-yr-sm text-[#555] cursor-pointer px-[4px] py-[1px] rounded-yr-sm border border-transparent w-full bg-white/60 transition-all duration-150 hover:bg-[#FFFDE0] hover:border-[#D4C060] hover:text-[#111]" 
                onClick={startEditStatus} 
                title="點擊修改狀態訊息"
              >
                <span className="text-[10px]">💬</span>
                <span className="whitespace-nowrap overflow-hidden text-ellipsis flex-1">{customStatus}</span>
                <span className="text-[10px] opacity-60">✏️</span>
              </div>
            )}
          </div>

          {/* Presence Dropdown */}
          <div className="mt-[2px]">
            <Select 
              className="w-full text-yr-sm" 
              value={currentPresence}
              onChange={handlePresenceChange}
              aria-label="目前狀態"
              options={[
                { value: 'available', label: '🟢 線上 (Available)' },
                { value: 'busy', label: '🔴 忙碌 (Busy)' },
                { value: 'away', label: '🟡 馬上回來 (Be Right Back)' },
                { value: 'invisible', label: '⚪ 隱藏 (Invisible)' }
              ]}
            />
          </div>
        </div>
      </div>

      <Toolbar className="max-w-full shrink-0 gap-[4px] overflow-x-auto">
        {['➕', '✉️', '📞', '🔍', '👤'].map((icon, i) => (
          <button key={i} className="w-[26px] h-[24px] bg-transparent border border-transparent rounded-[3px] flex justify-center items-center text-[14px] transition-all duration-100 hover:bg-[linear-gradient(to_bottom,#FFFFFF_0%,#E8E4D8_100%)] hover:border-[#707070] hover:shadow-[0_1px_2px_rgba(0,0,0,0.1)] active:bg-[#D4D0C8] active:border-[#555] active:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)]">
            {icon}
          </button>
        ))}
      </Toolbar>

      {/* Contacts List */}
      <div className="demo-contact-list min-w-0 min-h-0 flex-1 overflow-x-hidden overflow-y-auto bg-white border-b border-yr-border">
        {contacts.map(group => (
          <div key={group.group} className="mb-[2px]">
            <div 
              className="px-yr-2 py-[5px] text-yr-sm font-bold bg-[linear-gradient(to_bottom,#F4F1E6_0%,#E8E4D6_100%)] border-b border-[#D8D4C8] border-t border-white cursor-pointer flex items-center gap-[6px] select-none text-[#333] hover:bg-[linear-gradient(to_bottom,#FFF_0%,#EDE9DC_100%)]" 
              onClick={() => toggleGroup(group.group)}
            >
              <span className="text-[10px] text-[#666]">{expandedGroups[group.group] ? '▾' : '▸'}</span>
              <span className="text-yr-purple-dark">☆ {group.group} ☆</span>
            </div>
            
            {expandedGroups[group.group] && (
              <div className="bg-white">
                {group.users.map(contact => (
                  <button
                    type="button"
                    key={contact.id} 
                    className={`demo-contact-row flex w-full min-w-0 items-center px-yr-2 py-yr-1 text-left cursor-pointer gap-[7px] border-0 border-b border-[#F3F3F3] bg-white transition-colors duration-100 hover:bg-yr-hover-bg active:bg-[#FFE680] ${isPhonePortrait ? 'min-h-[44px]' : ''} ${contact.status === 'offline' ? 'opacity-65 hover:opacity-95' : ''}`}
                    onClick={() => onOpenChat(contact)}
                    title={`點擊與 ${contact.nickname} 聊天`}
                    aria-label={`${contact.nickname}，${presenceLabels[contact.status]}${contact.message ? `，${contact.message}` : ''}`}
                  >
                    <StatusBadge status={contact.status} size="sm" className="shrink-0" aria-hidden="true" />
                    <Avatar size="sm" src={contact.avatar} alt={contact.nickname} />
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-yr-base font-semibold text-[#222] whitespace-nowrap overflow-hidden text-ellipsis">{contact.nickname}</span>
                      {contact.message && (
                        <span className="text-yr-sm text-[#666] whitespace-nowrap overflow-hidden text-ellipsis" title={contact.message}>
                          {contact.message}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Messenger Status Footer */}
      <div className="px-yr-2 py-[3px] bg-yr-bg flex min-w-0 shrink-0 justify-between items-center gap-yr-2 overflow-hidden text-[10px] text-[#666] border-t border-[#D4D0C8]">
        <span>線上人數：{onlineContacts} / {totalContacts}</span>
        <span className="font-bold text-yr-purple">Yaroo! 台灣</span>
      </div>
    </Window>
  );
};

export default MainMessenger;
