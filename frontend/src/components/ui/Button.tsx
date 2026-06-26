import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'achievement' | 'ghost' | 'icon';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children'>,
    Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-purple-500 hover:bg-purple-400 text-white rounded-xl font-semibold shadow-purple-glow hover:shadow-purple-glow-lg',
  secondary:
    'border border-purple-700 text-purple-300 hover:bg-purple-900 rounded-xl font-semibold',
  destructive:
    'bg-wine-700 hover:bg-wine-500 text-white rounded-xl font-semibold',
  achievement:
    'bg-gold-900 border border-gold-700 text-gold-400 hover:text-gold-300 rounded-xl font-semibold',
  ghost:
    'text-text-secondary hover:text-text-primary hover:bg-overlay rounded-xl',
  icon:
    'rounded-full w-10 h-10 flex items-center justify-center bg-overlay hover:border hover:border-border-subtle text-text-secondary hover:text-text-primary',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3',
  lg: 'px-8 py-4 text-lg',
};

const iconSizeOverride: Partial<Record<ButtonVariant, true>> = {
  icon: true,
};

const Spinner: React.FC = () => (
  <svg
    className="animate-spin h-4 w-4 inline-block mr-2"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      className = '',
      ...rest
    },
    ref
  ) => {
    const isDisabled = isLoading || disabled;

    // Icon variant has fixed dimensions — skip size padding classes
    const sizeClass = iconSizeOverride[variant] ? '' : sizeClasses[size];

    const classes = [
      variantClasses[variant],
      sizeClass,
      'transition-all duration-150',
      'focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none',
      isDisabled ? 'opacity-60 cursor-not-allowed' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <motion.button
        ref={ref}
        className={classes}
        whileTap={isDisabled ? undefined : { scale: 0.97 }}
        disabled={isDisabled}
        {...rest}
      >
        {isLoading && <Spinner />}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
