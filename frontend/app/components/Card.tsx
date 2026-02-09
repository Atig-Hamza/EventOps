import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid' | 'outlined';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'glass', children, ...props }, ref) => {
    const variants = {
      glass: 'glass-card',
      solid: 'bg-white border border-[--border] shadow-[--shadow-xs] rounded-[--radius-lg]',
      outlined: 'bg-white/50 border border-[--border] rounded-[--radius-lg]',
    };

    return (
      <div
        ref={ref}
        className={twMerge(clsx(variants[variant], 'p-6', className))}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
