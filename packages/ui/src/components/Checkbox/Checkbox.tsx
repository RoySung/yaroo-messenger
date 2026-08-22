import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, children, className = '', ...props }, ref) => {
    return (
      <label className={`flex items-center gap-yr-1 cursor-pointer select-none ${className}`}>
        <input
          type="checkbox"
          ref={ref}
          className="accent-yr-purple w-[13px] h-[13px] border border-yr-border bg-white cursor-pointer"
          {...props}
        />
        {(label || children) && (
          <span className="text-yr-text-dark text-yr-sm">{label || children}</span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
