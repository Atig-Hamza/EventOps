import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'glass', children, ...props }, ref) => {
    const variants = {
      glass: 'glass-card',
      solid: 'bg-white border border-slate-100 shadow-sm rounded-2xl',
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
