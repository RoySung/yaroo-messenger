import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import type { Ack, OnlineUser, SessionJoinPayload } from '@yaroo/chat-protocol';
import { Window, WindowHeader, TextInput, XpButton, useDraggable } from '@yaroo/ui';

export type LoginRequest = SessionJoinPayload;

interface LoginScreenProps {
  onLogin: (request: LoginRequest) => Promise<Ack<OnlineUser>>;
  initialError?: string | null;
  isPhonePortrait?: boolean;
}

export const LoginScreen = ({ onLogin, initialError = null, isPhonePortrait = false }: LoginScreenProps) => {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(initialError);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { position, setPosition, handleMouseDown } = useDraggable({
    initialPosition: { x: 100, y: 80 },
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setPosition({
      x: Math.max(20, Math.floor((window.innerWidth - 300) / 2)),
      y: Math.max(20, Math.floor((window.innerHeight - 520) / 2)),
    });
  }, [setPosition]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const acknowledgment = await onLogin({
        nickname,
        initialPresence: 'available',
      });

      if (!acknowledgment.ok) {
        setErrorMessage(acknowledgment.error.message);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '無法連線至聊天室，請稍後再試。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Window 
      className="chat-window chat-login-window w-[300px] h-[520px] bg-yr-bg flex flex-col absolute"
      style={isPhonePortrait ? undefined : { left: `${position.x}px`, top: `${position.y}px` }}
    >
      <WindowHeader 
        title="Yaroo! 即時通 - 登入" 
        logoSrc="/yaroo-logo.svg" 
        onMouseDown={isPhonePortrait ? undefined : handleMouseDown}
        onMinimize={isPhonePortrait ? undefined : () => {}}
        onMaximize={isPhonePortrait ? undefined : () => {}}
        onClose={isPhonePortrait ? undefined : () => {}}
      />
      
      <div className={isPhonePortrait
        ? 'chat-login-content px-[16px] py-[12px] flex flex-col items-center flex-1 min-h-0 overflow-y-auto overscroll-contain'
        : 'chat-login-content px-[20px] py-[24px] flex flex-col items-center flex-1'}>
        <div className={isPhonePortrait
          ? 'flex justify-center items-center my-[4px] mb-[12px] w-full shrink-0'
          : 'flex justify-center items-center my-[10px] mb-[24px] w-full'}>
          <img 
            src="/yaroo-logo.svg" 
            alt="Yaroo! Messenger" 
            className={isPhonePortrait
              ? 'w-[180px] h-auto max-h-[76px] drop-shadow-[0_3px_6px_rgba(0,0,0,0.2)]'
              : 'w-[220px] h-auto max-h-[110px] drop-shadow-[0_3px_6px_rgba(0,0,0,0.2)] hover:scale-[1.03] transition-transform duration-200'} 
          />
        </div>

        <form className={isPhonePortrait
          ? 'chat-login-form w-full flex flex-col gap-[8px] pb-[4px]'
          : 'chat-login-form w-full flex flex-col gap-yr-3'} onSubmit={handleSignIn}>
          <div className="flex flex-col gap-[4px]">
            <label htmlFor="nicknameInput" className="text-yr-base font-bold text-yr-text-dark">暱稱：</label>
            <TextInput 
              id="nicknameInput"
              type="text" 
              value={nickname}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)}
              placeholder="請輸入聊天室暱稱"
              autoComplete="off"
              className={isPhonePortrait
                ? 'chat-login-input w-full min-w-0 min-h-[44px] px-[8px] text-[16px] text-[#111] focus:ring-2 focus:ring-yr-purple focus:ring-offset-1'
                : 'chat-login-input text-[13px] text-[#111]'}
            />
            <p className="text-[11px] leading-[1.35] text-[#555]">不需註冊帳號，輸入暱稱即可匿名加入。</p>
          </div>
          <div className="flex flex-col gap-[4px]">
            <label htmlFor="passwordInput" className="text-yr-base font-bold text-yr-text-dark">密碼（示意）：</label>
            <TextInput 
              id="passwordInput"
              type="password" 
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="可留空或輸入任意內容"
              autoComplete="off"
              className={isPhonePortrait
                ? 'chat-login-input w-full min-w-0 min-h-[44px] px-[8px] text-[16px] text-[#111] focus:ring-2 focus:ring-yr-purple focus:ring-offset-1'
                : 'chat-login-input text-[13px] text-[#111]'}
            />
            <p className="text-[11px] leading-[1.35] text-[#555]">此欄僅供介面展示，不會記錄、傳送或用於登入。</p>
          </div>

          {errorMessage && (
            <p role="alert" className="border border-[#B00020] bg-[#FFF1F2] px-yr-2 py-yr-1 text-[11px] leading-[1.35] text-[#8B0017]">
              {errorMessage}
            </p>
          )}

          <div className={isPhonePortrait ? 'flex justify-center' : 'flex justify-center mt-yr-2'}>
            <XpButton
              type="submit"
              disabled={isSubmitting}
              variant={isPhonePortrait ? 'primary' : 'default'}
              className={isPhonePortrait
                ? 'chat-login-submit px-[28px] py-[6px] min-h-[44px] min-w-[44px] text-[14px] text-yr-purple-dark font-bold focus-visible:ring-2 focus-visible:ring-yr-purple focus-visible:ring-offset-1 disabled:cursor-wait disabled:opacity-60'
                : 'chat-login-submit px-[28px] py-[6px] text-[13px] text-yr-purple-dark font-bold disabled:cursor-wait disabled:opacity-60'}
            >
              {isSubmitting ? '連線中…' : '登 入 (Sign In)'}
            </XpButton>
          </div>
        </form>
      </div>
    </Window>
  );
};

export default LoginScreen;
