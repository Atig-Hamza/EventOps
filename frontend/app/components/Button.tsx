import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const baseStyles = [
      'inline-flex items-center justify-center font-medium',
      'transition-all duration-200 ease-[cubic-bezier(0.2,0.6,0.35,1)]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent',
      'disabled:opacity-40 disabled:pointer-events-none',
      'active:scale-[0.97] cursor-pointer',
      'select-none',
    ].join(' ');
    
    const variants = {
      primary: [
        'bg-neutral-900 text-white',
        'hover:bg-neutral-800',
        'shadow-sm hover:shadow-md',
        'rounded-full',
      ].join(' '),
      secondary: [
        'bg-white text-neutral-900',
        'border border-neutral-200',
        'hover:bg-neutral-50 hover:border-neutral-300',
        'shadow-sm',
        'rounded-full',
      ].join(' '),
      glass: [
        'bg-white/60 backdrop-blur-xl',
        'text-neutral-800 border border-white/40',
        'hover:bg-white/80',
        'rounded-full',
      ].join(' '),
      ghost: [
        'bg-transparent',
        'text-neutral-600 hover:text-neutral-900',
        'hover:bg-neutral-100',
        'rounded-full',
      ].join(' '),
      danger: [
        'bg-white text-danger',
        'border border-danger/20',
        'hover:bg-danger-light hover:border-danger/30',
        'rounded-full',
      ].join(' '),
    };

    const sizes = {
      sm: 'h-9 px-4 text-[13px] gap-1.5 tracking-[-0.01em]',
      md: 'h-11 px-6 text-[15px] gap-2 tracking-[-0.014em]',
      lg: 'h-[52px] px-8 text-[16px] gap-2.5 tracking-[-0.017em]',
    };

    return (
      <button
        ref={ref}
        className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
