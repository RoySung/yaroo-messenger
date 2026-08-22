import { HTMLAttributes, forwardRef } from 'react';

export type PresenceStatus = 'available' | 'busy' | 'away' | 'offline' | 'invisible';

export interface StatusBadgeProps extends HTMLAttributes<HTMLDivElement> {
  status: PresenceStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge = forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ status, size = 'md', className = '', ...props }, ref) => {
    const bgMap = {
      available: 'bg-yr-status-available',
      busy: 'bg-yr-status-busy',
      away: 'bg-yr-status-away',
      offline: 'bg-yr-status-offline',
      invisible: 'bg-yr-status-offline' // invisible uses offline color
    };

    const sizeMap = {
      sm: 'w-[10px] h-[10px]',
      md: 'w-[14px] h-[14px]',
      lg: 'w-[20px] h-[20px]'
    };

    return (
      <div
        ref={ref}
        className={`rounded-full border border-white shadow-[0_1px_2px_rgba(0,0,0,0.3)] ${bgMap[status]} ${sizeMap[size]} ${className}`}
        {...props}
      />
    );
  }
);

StatusBadge.displayName = 'StatusBadge';
