import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, rows = 3, ...rest }, ref) => {
    const textareaId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const baseClasses =
      'bg-elevated border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary w-full outline-none transition-all duration-200 resize-y';

    const borderClasses = error
      ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
      : 'border-border-dim focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20';

    const classes = [baseClasses, borderClasses, className].filter(Boolean).join(' ');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            {label}
          </label>
        )}
        <textarea ref={ref} id={textareaId} rows={rows} className={classes} {...rest} />
        {error && (
          <p className="text-xs text-error mt-1" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
