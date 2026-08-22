import { HTMLAttributes, forwardRef } from 'react';

export interface ToolbarProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(
  ({ children, className = '', style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-center p-yr-1 border-b border-[#D4D0C8] shadow-[0_1px_0_white] ${className}`}
        style={{
          background: 'var(--yr-gradient-toolbar)',
          ...style
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Toolbar.displayName = 'Toolbar';
