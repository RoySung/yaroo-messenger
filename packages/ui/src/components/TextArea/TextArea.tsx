import { TextareaHTMLAttributes, forwardRef } from 'react';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`px-yr-1 py-[2px] border border-[#7F9DB9] bg-white text-black outline-none focus:border-yr-purple shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] resize-none ${className}`}
        {...props}
      />
    );
  }
);

TextArea.displayName = 'TextArea';
