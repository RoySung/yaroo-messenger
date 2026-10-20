import { useState, useRef, useEffect, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import type { Ack, BuzzEvent, ChatMessage } from '@yaroo/chat-protocol';
import type { ChatTimelineItem } from '../types/chatTypes';
import type { User } from '../types/userTypes';
import { Window, WindowHeader, Avatar, Toolbar, MenuBar, XpButton, TextArea, useDraggable } from '@yaroo/ui';

interface ChatWindowProps {
  contact: User;
  user: User;
  messages: ChatTimelineItem[];
  onSendMessage: (payload: { toSessionId: string; text: string }) => Promise<Ack<ChatMessage>>;
  onSendBuzz: (payload: { toSessionId: string }) => Promise<Ack<BuzzEvent>>;
  incomingBuzz?: BuzzEvent;
  onClose: () => void;
  onBack?: () => void;
  isPhonePortrait?: boolean;
  zIndex?: number;
  onFocus: () => void;
  initialPosition?: { x: number; y: number };
  buzzRequest?: { id: number; contactId: string } | null;
  onBuzzHandled?: (requestId: number) => void;
}

// Module-level shared AudioContext singleton
let sharedAudioCtx: AudioContext | null = null;
const getAudioContext = (): AudioContext | null => {
  try {
    if (!sharedAudioCtx) {
      const browserWindow = window as Window & typeof globalThis & {
        webkitAudioContext?: typeof AudioContext;
      };
      const AudioCtxClass = browserWindow.AudioContext || browserWindow.webkitAudioContext;
      if (AudioCtxClass) {
        sharedAudioCtx = new AudioCtxClass();
      }
    }
    if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume();
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
};

interface ActionBtnProps {
  icon: string;
  text: string;
  onClick?: () => void;
  isBuzz?: boolean;
  disabled?: boolean;
  className?: string;
}

// Keep this component stable across ChatWindow re-renders. The window focuses on
// mouse down, so declaring it inside ChatWindow would remount the button before
// its click event is dispatched.
const ActionBtn = ({ icon, text, onClick, isBuzz = false, disabled = false, className = '' }: ActionBtnProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`bg-transparent border border-transparent flex shrink-0 items-center gap-[4px] px-[7px] py-[3px] text-yr-sm rounded-[3px] transition-all duration-100 hover:bg-[linear-gradient(to_bottom,#FFFFFF_0%,#E8E4D8_100%)] hover:border-[#707070] hover:shadow-[0_1px_2px_rgba(0,0,0,0.1)] active:bg-[#D4D0C8] active:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed ${isBuzz ? 'text-[#B00000] font-bold' : 'text-yr-text-dark'} ${className}`}
  >
    <span className="text-[14px]">{icon}</span>
    <span className="font-medium">{text}</span>
  </button>
);

export const ChatWindow = ({
  contact,
  user,
  messages,
  onSendMessage,
  onSendBuzz,
  incomingBuzz,
  onClose,
  onBack,
  isPhonePortrait = false,
  zIndex = 11,
  onFocus,
  initialPosition,
  buzzRequest,
  onBuzzHandled
}: ChatWindowProps) => {
  const { position, handleMouseDown } = useDraggable({
    initialPosition: initialPosition || { x: 370, y: 40 },
    onFocus
  });

  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);

  const statusLabel = {
    available: '線上',
    busy: '忙碌',
    away: '離開',
    invisible: '隱形',
    offline: '離線'
  }[contact.status] || contact.status;

  const quickEmojis = [
    '(｡･ω･｡)', '(≧∇≦)', '(◕‿◕✿)', '(´;ω;`)',
    '(¬‿¬)', 'ฅ^•ﻌ•^ฅ', '(*^▽^*)', '(¬_¬)',
    '(ง •̀_•́)ง', '(つД`)', '(*´∀`)~♥', '٩(◕‿◕｡)۶',
    '(｡ŏ_ŏ)', '(・∀・)', '(=ﾟωﾟ)ﾉ', '╮(╯_╰)╭'
  ];

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [messages]);

  const windowRef = useRef<HTMLDivElement>(null);

  // Play retro authentic chime + buzzer sound with Web Audio API for buzz
  const playDingDong = useCallback(() => {
    try {
      const audioCtx = getAudioContext();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;

      // Master Gain
      const masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.7, now);
      masterGain.connect(audioCtx.destination);

      // Helper to create chime note
      const playTone = (freq: number, startTime: number, duration: number) => {
        // Fundamental
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.4, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        
        osc.connect(gain);
        gain.connect(masterGain);
        
        osc.start(startTime);
        osc.stop(startTime + duration);

        // Harmonic overtone (metallic bell shimmer)
        const overtone = audioCtx.createOscillator();
        const overtoneGain = audioCtx.createGain();
        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(freq * 2.02, startTime);
        
        overtoneGain.gain.setValueAtTime(0, startTime);
        overtoneGain.gain.linearRampToValueAtTime(0.18, startTime + 0.008);
        overtoneGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.7);
        
        overtone.connect(overtoneGain);
        overtoneGain.connect(masterGain);
        
        overtone.start(startTime);
        overtone.stop(startTime + duration * 0.7);
      };

      // Buzzer vibration sound
      const buzzOsc = audioCtx.createOscillator();
      const buzzGain = audioCtx.createGain();
      buzzOsc.type = 'sawtooth';
      buzzOsc.frequency.setValueAtTime(130, now);
      buzzGain.gain.setValueAtTime(0, now);
      buzzGain.gain.linearRampToValueAtTime(0.15, now + 0.02);
      buzzGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      buzzOsc.connect(buzzGain);
      buzzGain.connect(masterGain);
      buzzOsc.start(now);
      buzzOsc.stop(now + 0.35);

      // Ding (High chime)
      playTone(880, now, 0.6); // A5

      // Dong (Low chime)
      playTone(659.25, now + 0.22, 0.9); // E5
    } catch {
      // Audio context might fail on un-interacted policy, fail silently
    }
  }, []);

  const triggerVibration = useCallback(() => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function') {
        navigator.vibrate([120, 60, 120, 60, 200]);
      }
    } catch {
      // Vibration might fail on un-supported devices, fail silently
    }
  }, []);

  const triggerShake = useCallback(() => {
    const el = windowRef.current || document.getElementById(`chat-window-${contact.id}`);
    if (!el) return;

    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animationTarget = isPhonePortrait
      ? el.querySelector<HTMLElement>('.chat-body') || el
      : el;

    if (prefersReducedMotion) {
      animationTarget.animate([
        { filter: 'brightness(1)', boxShadow: 'inset 0 0 0 0 rgba(255, 212, 0, 0)' },
        { filter: 'brightness(1.08)', boxShadow: 'inset 0 0 0 4px rgba(255, 212, 0, 0.85)' },
        { filter: 'brightness(1)', boxShadow: 'inset 0 0 0 0 rgba(255, 212, 0, 0)' }
      ], {
        duration: 300,
        easing: 'ease-out'
      });
      return;
    }

    const xDist = isPhonePortrait ? 8 : 12;
    const yDist = isPhonePortrait ? 6 : 8;
    const rot = isPhonePortrait ? 1.5 : 2;
    animationTarget.animate([
      { transform: 'translate(0px, 0px) rotate(0deg)' },
      { transform: `translate(${-xDist}px, ${-yDist}px) rotate(${-rot}deg)` },
      { transform: `translate(${xDist}px, ${yDist}px) rotate(${rot}deg)` },
      { transform: `translate(${-xDist}px, ${yDist}px) rotate(${-rot}deg)` },
      { transform: `translate(${xDist}px, ${-yDist}px) rotate(${rot}deg)` },
      { transform: `translate(${-xDist * 0.7}px, ${-yDist * 0.7}px) rotate(${-rot * 0.7}deg)` },
      { transform: `translate(${xDist * 0.7}px, ${yDist * 0.7}px) rotate(${rot * 0.7}deg)` },
      { transform: `translate(${-xDist * 0.4}px, ${yDist * 0.4}px) rotate(${-rot * 0.4}deg)` },
      { transform: `translate(${xDist * 0.4}px, ${-yDist * 0.4}px) rotate(${rot * 0.4}deg)` },
      { transform: `translate(${-xDist * 0.2}px, ${-yDist * 0.2}px) rotate(0deg)` },
      { transform: `translate(${xDist * 0.2}px, ${yDist * 0.2}px) rotate(0deg)` },
      { transform: 'translate(0px, 0px) rotate(0deg)' }
    ], {
      duration: 500,
      easing: 'ease-in-out'
    });
  }, [contact.id, isPhonePortrait]);

  const handleSend = async () => {
    if (!inputText.trim() || isSending) return;

    setIsSending(true);
    const acknowledgment = await onSendMessage({
      toSessionId: contact.id,
      text: inputText,
    });
    setIsSending(false);

    if (!acknowledgment.ok) {
      setOperationError(acknowledgment.error.message);
      return;
    }

    setOperationError(null);
    setInputText('');
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const handleBuzz = useCallback(async () => {
    const acknowledgment = await onSendBuzz({ toSessionId: contact.id });
    if (!acknowledgment.ok) {
      const retry = acknowledgment.error.retryAfterMs;
      setOperationError(
        retry === undefined
          ? acknowledgment.error.message
          : `${acknowledgment.error.message}（${Math.ceil(retry / 1_000)} 秒）`,
      );
      return;
    }

    setOperationError(null);
    playDingDong();
    triggerShake();
    triggerVibration();
  }, [contact.id, onSendBuzz, playDingDong, triggerShake, triggerVibration]);

  const handledIncomingBuzzIds = useRef(new Set<string>());
  useEffect(() => {
    if (!incomingBuzz || handledIncomingBuzzIds.current.has(incomingBuzz.id)) return;

    handledIncomingBuzzIds.current.add(incomingBuzz.id);
    playDingDong();
    triggerShake();
    triggerVibration();
  }, [incomingBuzz, playDingDong, triggerShake, triggerVibration]);

  useEffect(() => {
    if (!buzzRequest || buzzRequest.contactId !== contact.id) return;

    // This effect deliberately consumes App's one-shot keyboard/menu request.
    // oxlint-disable-next-line react/set-state-in-effect
    void handleBuzz();
    onBuzzHandled?.(buzzRequest.id);
  }, [buzzRequest, contact.id, handleBuzz, onBuzzHandled]);

  const handleInsertEmoji = (emoji: string) => {
    setInputText(prev => prev + ' ' + emoji + ' ');
    setShowEmojiPicker(false);
  };

  return (
    <Window 
      ref={windowRef}
      className="chat-window chat-chat-window w-[540px] h-[480px] flex flex-col bg-yr-bg absolute" 
      id={`chat-window-${contact.id}`}
      style={{
        left: isPhonePortrait ? undefined : `${position.x}px`,
        top: isPhonePortrait ? undefined : `${position.y}px`,
        zIndex
      }}
      onMouseDown={isPhonePortrait ? undefined : onFocus}
    >
      {/* Window Header */}
      <WindowHeader 
        title={`${contact.nickname} (${contact.id}) - Yaroo! 即時通`}
        logoSrc="/yaroo-logo.svg" 
        onMouseDown={isPhonePortrait ? undefined : handleMouseDown}
        onMinimize={isPhonePortrait ? undefined : () => {}}
        onMaximize={isPhonePortrait ? undefined : () => {}}
        onClose={onClose}
      />

      {isPhonePortrait && (
        <button
          type="button"
          className="chat-back phone-only min-h-[44px] w-full shrink-0 items-center gap-[8px] border-b border-[#B9B29C] bg-[linear-gradient(to_bottom,#FFFFFF_0%,#E8E4D8_100%)] px-[10px] text-left text-[14px] font-bold text-yr-purple-dark hover:brightness-105 active:shadow-yr-inset"
          onClick={onBack}
          aria-label={`返回聯絡人列表，保留與 ${contact.nickname} 的對話`}
        >
          <span aria-hidden="true" className="text-[20px] leading-none">←</span>
          <span>返回聯絡人</span>
        </button>
      )}

      {/* Menu Bar */}
      <MenuBar
        className={`chat-menu min-w-0 shrink-0 ${isPhonePortrait ? 'flex-wrap' : ''}`}
        items={[
          {
            label: '交談(C)',
            items: [
              { label: '儲存交談記錄(S)...', disabled: true },
              { divider: true },
              { label: '關閉(C)', onClick: onClose, shortcut: 'Alt+F4' }
            ]
          },
          {
            label: '動作(A)',
            items: [
              { label: '傳送叮咚 (Buzz)', icon: '🔔', onClick: () => { void handleBuzz(); }, shortcut: 'Ctrl+G' },
              { divider: true },
              { label: '語音通話', icon: '📞', disabled: true },
              { label: '視訊通話', icon: '📹', disabled: true },
              { label: '傳送檔案...', icon: '📁', disabled: true },
              { label: '傳送照片...', icon: '🖼️', disabled: true }
            ]
          },
          {
            label: '檢視(V)',
            items: [
              { label: '即時通狀態資訊', disabled: true },
              { label: '顯示聯絡人資訊', disabled: true }
            ]
          },
          {
            label: '說明(H)',
            items: [
              { label: '交談說明(H)', disabled: true }
            ]
          }
        ]}
      />

      {/* Action Toolbar */}
      <Toolbar className="chat-toolbar gap-[4px] px-yr-2 py-yr-1 overflow-x-auto">
        {isPhonePortrait && (
          <ActionBtn icon="🔔" text="叮咚 (Buzz)" onClick={() => { void handleBuzz(); }} isBuzz className="chat-buzz min-h-[44px]" />
        )}
        <ActionBtn icon="📞" text="通話" disabled={isPhonePortrait} />
        <ActionBtn icon="📹" text="視訊" disabled={isPhonePortrait} />
        <ActionBtn icon="📁" text="傳送檔案" disabled={isPhonePortrait} />
        <ActionBtn icon="🖼️" text="照片" disabled={isPhonePortrait} />
        {!isPhonePortrait && <ActionBtn icon="🔔" text="叮咚 (Buzz)" onClick={() => { void handleBuzz(); }} isBuzz />}
      </Toolbar>

      {/* Main Chat Body */}
      <div className={`chat-body flex flex-1 bg-[#ECE9D8] min-h-0 ${isPhonePortrait ? 'flex-col' : ''}`}>
        {isPhonePortrait && (
          <div className="chat-mobile-identity flex shrink-0 items-center gap-[10px] border-b border-yr-border bg-[linear-gradient(to_bottom,#FFFFFF_0%,#F5F3EC_100%)] px-[10px] py-[6px]">
            <Avatar size="sm" src={contact.avatar} alt={contact.nickname} className="shrink-0 border-2" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[16px] font-bold text-yr-purple-dark">{contact.nickname}</div>
              <div className="flex min-w-0 items-center gap-[6px] text-[12px] text-[#555]">
                <span
                  className={`h-[8px] w-[8px] shrink-0 rounded-full ${contact.status === 'available' ? 'bg-[#2E7D32]' : contact.status === 'busy' ? 'bg-[#C62828]' : 'bg-[#757575]'}`}
                  aria-hidden="true"
                />
                <span className="shrink-0" aria-label={`目前狀態：${statusLabel}`}>{statusLabel}</span>
                {contact.message && <span className="truncate text-[#777]">· {contact.message}</span>}
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col border-r border-yr-border min-w-0">
          {/* History Message List */}
          <div 
            className={`chat-history flex-1 bg-white m-[6px] border border-[#7F9DB9] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.12)] px-[10px] py-[8px] overflow-y-auto text-yr-base flex flex-col gap-[5px] ${isPhonePortrait ? 'text-[16px]' : ''}`} 
            ref={historyRef}
          >
            <div className="text-[#888888] text-[10px] text-center my-[4px] mb-[8px] select-none">
              ──── 本次連線的交談內容 ────
            </div>
            {messages.map(item => {
              const event = item.data;
              const isMe = event.fromSessionId === user.id;
              const isBuzz = item.kind === 'buzz';
              const text = item.kind === 'buzz'
                ? `💥 ${event.fromNickname} 發出叮咚！`
                : item.data.text;
              const time = new Date(event.sentAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });
              return (
                <div 
                  key={event.id}
                  className={`leading-[1.4] break-words ${isBuzz ? 'bg-[#FFF3CD] border-l-[3px] border-[#FFC107] px-[6px] py-[2px] font-bold text-[#856404] rounded-[2px]' : ''}`}
                >
                  {!isBuzz && (
                    <span className={`font-bold mr-[6px] ${isMe ? 'text-[#0033CC]' : 'text-[#CC0033]'}`}>
                      {event.fromNickname}:
                    </span>
                  )}
                  <span className="text-[#111111]">{text}</span>
                  <span className="text-[9px] text-[#999] ml-[8px]">{time}</span>
                </div>
              );
            })}
          </div>

          {/* Chat Input Area */}
          <div className="chat-composer h-[130px] flex flex-col bg-yr-bg border-t border-[#D4D0C8]">
            <div className="chat-composer-toolbar flex px-[6px] py-[3px] gap-[5px] bg-[linear-gradient(to_bottom,#ECE9D8_0%,#E0DCD0_100%)] border-b border-yr-border relative items-center overflow-x-auto">
              <button 
                className={`chat-emoji shrink-0 bg-transparent border border-transparent text-yr-sm px-[6px] py-[2px] rounded-[2px] flex items-center gap-[3px] text-[#333] hover:bg-[linear-gradient(to_bottom,#FFF_0%,#E8E4D8_100%)] hover:border-[#888] ${isPhonePortrait ? 'min-h-[44px] text-[14px]' : ''}`}
                title="顏文字與表情符號"
                aria-expanded={showEmojiPicker}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                😊 顏文字
              </button>
              <button className={`bg-transparent border border-transparent text-yr-sm px-[6px] py-[2px] rounded-[2px] items-center gap-[3px] text-[#333] hover:bg-[linear-gradient(to_bottom,#FFF_0%,#E8E4D8_100%)] hover:border-[#888] ${isPhonePortrait ? 'hidden' : 'flex'}`} title="文字色彩與字型">
                <b className="text-yr-text-link">A</b> 格式
              </button>
              <button className={`chat-buzz shrink-0 bg-transparent border border-transparent text-yr-sm px-[6px] py-[2px] rounded-[2px] flex items-center gap-[3px] text-[#333] hover:bg-[linear-gradient(to_bottom,#FFF_0%,#E8E4D8_100%)] hover:border-[#888] ${isPhonePortrait ? 'min-h-[44px] text-[14px]' : ''}`} onClick={() => { void handleBuzz(); }} title="傳送叮咚聲！">
                🔔 叮咚
              </button>
              
              {showEmojiPicker && (
                <div className="absolute bottom-[28px] left-[6px] bg-white border border-yr-purple shadow-[0_4px_12px_rgba(0,0,0,0.2)] p-[6px] grid grid-cols-2 gap-[4px] z-10 rounded-yr-lg">
                  {quickEmojis.map((em, idx) => (
                    <button 
                      key={idx} 
                      className={`bg-[#F5F3EC] border border-[#D4D0C8] px-[6px] py-[3px] text-yr-sm rounded-[2px] text-center cursor-pointer whitespace-nowrap hover:bg-yr-hover-bg hover:border-[#D4C060] ${isPhonePortrait ? 'min-h-[44px]' : ''}`}
                      onClick={() => handleInsertEmoji(em)}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-1 p-[6px] gap-[6px]">
              <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                {operationError && (
                  <div role="alert" className="border border-[#B00020] bg-[#FFF1F2] px-[5px] py-[2px] text-[10px] text-[#8B0017]">
                    {operationError}
                  </div>
                )}
                <TextArea
                  className={`chat-message-input flex-1 p-[6px] text-yr-base ${isPhonePortrait ? 'min-w-0 text-[16px]' : ''}`}
                  value={inputText}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="輸入訊息，按 Enter 鍵發送..."
                />
              </div>
              <XpButton disabled={isSending} className={`chat-send w-[70px] h-full flex flex-col justify-center items-center leading-[1.1] text-yr-purple-dark text-yr-base disabled:cursor-wait disabled:opacity-60 ${isPhonePortrait ? 'min-h-[44px] shrink-0 text-[16px]' : ''}`} onClick={() => { void handleSend(); }}>
                {isSending ? '傳送中…' : <>發 送<br/><span className="text-[10px] font-normal">(Send)</span></>}
              </XpButton>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        {!isPhonePortrait && (
          <div className="w-[145px] bg-[linear-gradient(to_bottom,#FFFFFF_0%,#F5F3EC_100%)] flex flex-col items-center py-[12px] px-[10px] gap-[10px]">
            <div className="flex flex-col items-center gap-[6px] w-full">
              <Avatar size="lg" src={contact.avatar} alt={contact.nickname} className="border-2" />
              <div className="text-yr-base font-bold text-center text-yr-purple-dark break-words w-full">{contact.nickname}</div>
              
              {contact.status === 'available' && (
                <div className="text-[10px] px-[8px] py-[1px] rounded-[8px] font-medium bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]">
                  線上
                </div>
              )}
              {contact.status === 'busy' && (
                <div className="text-[10px] px-[8px] py-[1px] rounded-[8px] font-medium bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2]">
                  忙碌
                </div>
              )}
              {contact.status === 'offline' && (
                <div className="text-[10px] px-[8px] py-[1px] rounded-[8px] font-medium bg-[#EEEEEE] text-[#757575] border border-[#E0E0E0]">
                  離線
                </div>
              )}
            </div>

            {contact.message && (
              <div className="w-full bg-white border border-[#D4D0C8] rounded-[3px] p-[6px] text-[10px]">
                <div className="text-[#888] mb-[2px]">狀態訊息：</div>
                <div className="text-[#333] leading-[1.3] break-words">{contact.message}</div>
              </div>
            )}

            <div className="mt-auto opacity-80">
              <img src="/yaroo-logo.svg" alt="Yaroo!" style={{ width: '64px' }} />
            </div>
          </div>
        )}
      </div>
    </Window>
  );
};

export default ChatWindow;
