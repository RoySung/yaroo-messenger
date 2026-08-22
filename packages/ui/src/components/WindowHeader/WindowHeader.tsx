import React, { forwardRef, HTMLAttributes } from 'react';

export interface WindowHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  logoSrc?: string;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  children?: React.ReactNode;
}

export const WindowHeader = forwardRef<HTMLDivElement, WindowHeaderProps>(
  ({ title, logoSrc, onClose, onMinimize, onMaximize, onMouseDown, children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex justify-between items-center px-yr-2 py-yr-1 select-none text-white rounded-t-yr-xl rounded-tr-yr-md border-b border-[#30004A] ${className}`}
        style={{ background: 'var(--yr-gradient-titlebar)' }}
        onMouseDown={onMouseDown}
        {...props}
      >
        <div className="flex items-center gap-yr-1.5 flex-1 min-w-0 font-bold text-yr-md drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]">
          {logoSrc && (
            <img src={logoSrc} alt="Logo" className="w-[16px] h-[16px]" draggable="false" />
          )}
          {title && <span className="truncate">{title}</span>}
        </div>
        
        <div className="flex items-center gap-[2px]">
          {onMinimize && (
            <button
              onClick={onMinimize}
              className="w-[21px] h-[21px] rounded-[3px] border border-white/40 shadow-yr-control text-white flex items-center justify-center hover:brightness-110 active:brightness-90 active:shadow-yr-inset"
              style={{ background: 'var(--yr-gradient-button)' }}
              title="縮小"
            >
              <div className="w-[8px] h-[2px] bg-black mt-[8px]"></div>
            </button>
          )}
          
          {onMaximize && (
            <button
              onClick={onMaximize}
              className="w-[21px] h-[21px] rounded-[3px] border border-white/40 shadow-yr-control text-white flex items-center justify-center hover:brightness-110 active:brightness-90 active:shadow-yr-inset"
              style={{ background: 'var(--yr-gradient-button)' }}
              title="最大化"
            >
              <div className="w-[10px] h-[8px] border-[2px] border-black border-t-[3px]"></div>
            </button>
          )}
          
          {onClose && (
            <button
              onClick={onClose}
              className="w-[21px] h-[21px] rounded-[3px] border border-white/40 shadow-yr-control text-white flex items-center justify-center hover:brightness-110 active:brightness-90 active:shadow-yr-inset"
              style={{ background: 'var(--yr-gradient-button-close)' }}
              title="關閉"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M2 2L8 8M8 2L2 8" />
              </svg>
            </button>
          )}
        </div>
        
        {children}
      </div>
    );
  }
);

WindowHeader.displayName = 'WindowHeader';
