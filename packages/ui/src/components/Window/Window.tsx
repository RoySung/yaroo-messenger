import React, { forwardRef, HTMLAttributes } from 'react';

export interface WindowProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Window = forwardRef<HTMLDivElement, WindowProps>(
  ({ children, className = '', style, onMouseDown, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`absolute bg-yr-bg border border-yr-purple-dark rounded-t-yr-xl rounded-b-[4px] shadow-yr-window flex flex-col overflow-hidden select-auto ${className}`}
        style={style}
        onMouseDown={onMouseDown}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Window.displayName = 'Window';
