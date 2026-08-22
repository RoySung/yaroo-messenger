import { InputHTMLAttributes, forwardRef } from 'react';

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`px-yr-1 py-[2px] border border-[#7F9DB9] bg-white text-black outline-none focus:border-yr-purple shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] ${className}`}
        {...props}
      />
    );
  }
);

TextInput.displayName = 'TextInput';
