import { ImgHTMLAttributes, forwardRef } from 'react';

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: 'sm' | 'md' | 'lg';
  pixelated?: boolean;
}

export const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({ size = 'md', pixelated = false, className = '', style, ...props }, ref) => {
    
    // Map size to pixel values based on the spec
    const sizeMap = {
      sm: '26px',
      md: '52px',
      lg: '90px'
    };
    
    const sizePx = sizeMap[size];

    return (
      <img
        ref={ref}
        className={`border border-[#B3B3B3] rounded-[2px] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] bg-white object-cover ${pixelated ? 'rendering-pixelated' : ''} ${className}`}
        style={{
          width: sizePx,
          height: sizePx,
          imageRendering: pixelated ? 'pixelated' : 'auto',
          ...style
        }}
        {...props}
      />
    );
  }
);

Avatar.displayName = 'Avatar';
