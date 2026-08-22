import React, { ButtonHTMLAttributes, forwardRef } from 'react';

export interface XpButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'close';
  children: React.ReactNode;
}

export const XpButton = forwardRef<HTMLButtonElement, XpButtonProps>(
  ({ variant = 'default', children, className = '', style, ...props }, ref) => {
    
    let buttonClass = 'px-yr-4 py-[3px] rounded-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.15)] flex items-center justify-center active:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)] focus:outline-none focus:ring-1 focus:ring-black ';
    let gradient = '';

    if (variant === 'close') {
      buttonClass += 'border border-white/40 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.7)] text-white font-bold hover:brightness-110 active:brightness-90 text-[10px] ';
      gradient = 'var(--yr-gradient-button-close)';
    } else {
      // XP style button outline
      if (variant === 'primary') {
        buttonClass += 'border-[2px] border-[#003C74] shadow-[inset_0_0_0_1px_#E3E3E3,inset_0_1px_0_1px_#FFFFFF] ';
      } else {
        buttonClass += 'border border-[#707070] shadow-[inset_0_0_0_1px_#E3E3E3,inset_0_1px_0_1px_#FFFFFF] ';
      }
      buttonClass += 'text-black hover:shadow-[inset_0_0_0_1px_#E3E3E3,inset_0_1px_0_1px_#FFFFFF,0_0_2px_rgba(0,0,0,0.3)] active:bg-[#EBEBEB] active:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)] ';
      gradient = 'var(--yr-gradient-button)';
    }

    return (
      <button
        ref={ref}
        className={`${buttonClass} ${className}`}
        style={{
          background: gradient,
          ...style
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

XpButton.displayName = 'XpButton';
