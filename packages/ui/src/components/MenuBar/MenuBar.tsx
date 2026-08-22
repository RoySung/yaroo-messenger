import { HTMLAttributes, forwardRef } from 'react';

export interface MenuBarItem {
  label: string;
  onClick?: () => void;
}

export interface MenuBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  items: MenuBarItem[];
}

export const MenuBar = forwardRef<HTMLDivElement, MenuBarProps>(
  ({ items, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex bg-yr-panel-bg border-b border-white px-yr-1 text-yr-dark text-yr-sm ${className}`}
        {...props}
      >
        {items.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="px-[6px] py-[2px] cursor-default focus:outline-none hover:bg-yr-highlight hover:text-white"
          >
            {item.label}
          </button>
        ))}
      </div>
    );
  }
);

MenuBar.displayName = 'MenuBar';
