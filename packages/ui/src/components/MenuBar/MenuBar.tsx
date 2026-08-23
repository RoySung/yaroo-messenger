import { HTMLAttributes, forwardRef, useState, useRef, useEffect } from 'react';

export interface MenuItem {
  label?: string;
  icon?: string;
  onClick?: () => void;
  disabled?: boolean;
  divider?: boolean;
  shortcut?: string;
}

export interface MenuBarItem {
  label: string;
  onClick?: () => void;
  items?: MenuItem[];
}

export interface MenuBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  items: MenuBarItem[];
}

export const MenuBar = forwardRef<HTMLDivElement, MenuBarProps>(
  ({ items, className = '', ...props }, ref) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setOpenIndex(null);
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setOpenIndex(null);
        }
      };

      if (openIndex !== null) {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [openIndex]);

    const handleMenuClick = (index: number, item: MenuBarItem) => {
      if (item.items && item.items.length > 0) {
        setOpenIndex(prev => (prev === index ? null : index));
      } else {
        setOpenIndex(null);
        item.onClick?.();
      }
    };

    const handleMenuHover = (index: number) => {
      if (openIndex !== null) {
        setOpenIndex(index);
      }
    };

    const handleItemClick = (subItem: MenuItem) => {
      if (subItem.disabled || subItem.divider) return;
      setOpenIndex(null);
      subItem.onClick?.();
    };

    return (
      <div
        ref={(node) => {
          (menuRef as any).current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            (ref as any).current = node;
          }
        }}
        className={`flex bg-yr-panel-bg border-b border-white px-yr-1 text-yr-dark text-yr-sm relative select-none z-20 ${className}`}
        {...props}
      >
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="relative">
              <button
                onClick={() => handleMenuClick(index, item)}
                onMouseEnter={() => handleMenuHover(index)}
                className={`px-[6px] py-[2px] cursor-default focus:outline-none transition-colors ${
                  isOpen
                    ? 'bg-yr-highlight text-white'
                    : 'hover:bg-yr-highlight hover:text-white'
                }`}
              >
                {item.label}
              </button>

              {isOpen && item.items && item.items.length > 0 && (
                <div
                  className="absolute top-full left-0 min-w-[170px] bg-[#F5F4EA] border border-[#716F64] shadow-[2px_2px_5px_rgba(0,0,0,0.35)] py-[2px] z-50 text-yr-sm text-[#111]"
                >
                  {item.items.map((subItem, subIdx) => {
                    if (subItem.divider) {
                      return (
                        <div key={subIdx} className="my-[3px] mx-[2px] border-t border-[#A0A0A0] border-b border-white" />
                      );
                    }

                    return (
                      <div
                        key={subIdx}
                        aria-disabled={subItem.disabled || undefined}
                        onClick={subItem.disabled ? undefined : () => handleItemClick(subItem)}
                        className={`flex items-center justify-between px-[10px] py-[3px] cursor-default ${
                          subItem.disabled
                            ? 'text-[#888] cursor-not-allowed'
                            : 'hover:bg-yr-highlight hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-[6px]">
                          {subItem.icon && <span className="text-[13px] w-[16px] text-center">{subItem.icon}</span>}
                          <span>{subItem.label}</span>
                        </div>
                        {subItem.shortcut && (
                          <span className="text-[10px] ml-[16px] opacity-70">{subItem.shortcut}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }
);

MenuBar.displayName = 'MenuBar';
