import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const Select: React.FC<SelectProps> = ({ label, error, id, className, children, ...props }) => {
  const baseStyles =
    'bg-elevated border border-border-dim rounded-xl px-4 py-3 text-text-primary w-full outline-none appearance-none cursor-pointer transition-all duration-200';
  const focusStyles = 'focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20';
  const errorStyles = error ? 'border-error focus:border-error focus:ring-error/20' : '';

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={[baseStyles, focusStyles, errorStyles, className].filter(Boolean).join(' ')}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none w-4 h-4" />
      </div>
      {error && <p className="text-xs text-error mt-1">{error}</p>}
    </div>
  );
};

export default Select;
