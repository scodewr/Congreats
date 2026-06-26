import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, className = '', id, ...rest }, ref) => {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const baseClasses =
      'bg-elevated border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary w-full outline-none transition-all duration-200';

    const borderClasses = error
      ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
      : 'border-border-dim focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20';

    const paddingClasses = leftIcon ? 'pl-10' : '';

    const classes = [baseClasses, borderClasses, paddingClasses, className]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            {label}
          </label>
        )}
        <div className={leftIcon ? 'relative' : undefined}>
          {leftIcon && (
            <span className="absolute inset-y-0 left-3 flex items-center text-text-tertiary pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input ref={ref} id={inputId} className={classes} {...rest} />
        </div>
        {error && (
          <p className="text-xs text-error mt-1" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
