import { useState } from 'react';
import { User, currentUser } from '../mockData';
import { Window, WindowHeader, TextInput, Checkbox, XpButton, useDraggable } from '@yaroo/ui';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  isPhonePortrait: boolean;
}

export const LoginScreen = ({ onLogin, isPhonePortrait }: LoginScreenProps) => {
  const [userId, setUserId] = useState(currentUser.id);
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [autoSignIn, setAutoSignIn] = useState(false);
  const [invisible, setInvisible] = useState(false);

  const { position, handleMouseDown } = useDraggable({
    initialPosition: {
      x: typeof window !== 'undefined' ? Math.max(20, Math.floor((window.innerWidth - 300) / 2)) : 100,
      y: typeof window !== 'undefined' ? Math.max(20, Math.floor((window.innerHeight - 520) / 2)) : 80
    }
  });

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      ...currentUser,
      status: invisible ? 'invisible' : 'available'
    });
  };

  return (
    <Window 
      className="demo-window demo-login-window w-[300px] h-[520px] bg-yr-bg flex flex-col absolute"
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
        ? 'demo-login-content px-[16px] py-[12px] flex flex-col items-center flex-1 min-h-0 overflow-y-auto overscroll-contain'
        : 'demo-login-content px-[20px] py-[24px] flex flex-col items-center flex-1'}>
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
          ? 'demo-login-form w-full flex flex-col gap-[8px] pb-[4px]'
          : 'demo-login-form w-full flex flex-col gap-yr-3'} onSubmit={handleSignIn}>
          <div className="flex flex-col gap-[4px]">
            <label htmlFor="userIdInput" className="text-yr-base font-bold text-yr-text-dark">Yaroo! 帳號：</label>
            <TextInput 
              id="userIdInput"
              type="text" 
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="請輸入 Yaroo! ID"
              autoComplete="username"
              className={isPhonePortrait
                ? 'demo-login-input w-full min-w-0 min-h-[44px] px-[8px] text-[16px] text-[#111] focus:ring-2 focus:ring-yr-purple focus:ring-offset-1'
                : 'demo-login-input text-[13px] text-[#111]'}
            />
          </div>
          <div className="flex flex-col gap-[4px]">
            <label htmlFor="passwordInput" className="text-yr-base font-bold text-yr-text-dark">密碼：</label>
            <TextInput 
              id="passwordInput"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="請輸入密碼"
              autoComplete="current-password"
              className={isPhonePortrait
                ? 'demo-login-input w-full min-w-0 min-h-[44px] px-[8px] text-[16px] text-[#111] focus:ring-2 focus:ring-yr-purple focus:ring-offset-1'
                : 'demo-login-input text-[13px] text-[#111]'}
            />
          </div>

          <div className={isPhonePortrait ? 'flex flex-col gap-0 mt-yr-1' : 'flex flex-col gap-yr-2 mt-yr-1 py-yr-1'}>
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className={isPhonePortrait ? "demo-login-checkbox min-h-[44px] w-full [&>input]:shrink-0 [&>input:focus-visible]:outline-2 [&>input:focus-visible]:outline-offset-2 [&>input:focus-visible]:outline-yr-purple [&>span]:text-[14px]" : ''}
            >
              記住我的帳號與密碼
            </Checkbox>
            <Checkbox
              checked={autoSignIn}
              onChange={(e) => setAutoSignIn(e.target.checked)}
              className={isPhonePortrait ? "demo-login-checkbox min-h-[44px] w-full [&>input]:shrink-0 [&>input:focus-visible]:outline-2 [&>input:focus-visible]:outline-offset-2 [&>input:focus-visible]:outline-yr-purple [&>span]:text-[14px]" : ''}
            >
              自動登入
            </Checkbox>
            <Checkbox
              checked={invisible}
              onChange={(e) => setInvisible(e.target.checked)}
              className={isPhonePortrait ? "demo-login-checkbox min-h-[44px] w-full [&>input]:shrink-0 [&>input:focus-visible]:outline-2 [&>input:focus-visible]:outline-offset-2 [&>input:focus-visible]:outline-yr-purple [&>span]:text-[14px]" : ''}
            >
              以隱藏模式登入
            </Checkbox>
          </div>

          <div className={isPhonePortrait ? 'flex justify-center' : 'flex justify-center mt-yr-2'}>
            <XpButton
              type="submit"
              variant={isPhonePortrait ? 'primary' : 'default'}
              className={isPhonePortrait
                ? 'demo-login-submit px-[28px] py-[6px] min-h-[44px] min-w-[44px] text-[14px] text-yr-purple-dark font-bold focus-visible:ring-2 focus-visible:ring-yr-purple focus-visible:ring-offset-1'
                : 'demo-login-submit px-[28px] py-[6px] text-[13px] text-yr-purple-dark font-bold'}
            >
              登 入 (Sign In)
            </XpButton>
          </div>
          
          <div className={isPhonePortrait
            ? 'demo-login-links flex justify-center items-center gap-yr-2 min-h-[44px] text-[13px]'
            : 'demo-login-links flex justify-center items-center gap-yr-2 mt-[10px] text-[11px]'}>
            <a href="#help" onClick={(e) => e.preventDefault()} className={`demo-login-link text-yr-text-link no-underline hover:underline ${isPhonePortrait ? 'inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-[4px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yr-purple' : ''}`}>忘記密碼？</a>
            <span className="text-[#AAA]">|</span>
            <a href="#register" onClick={(e) => e.preventDefault()} className={`demo-login-link text-yr-text-link no-underline hover:underline ${isPhonePortrait ? 'inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-[4px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yr-purple' : ''}`}>申請新帳號</a>
          </div>
        </form>
      </div>
    </Window>
  );
};

export default LoginScreen;
