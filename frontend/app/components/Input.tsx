import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-[13px] font-medium text-neutral-600 tracking-[-0.01em]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={twMerge(
            clsx(
              'neo-input h-11 w-full rounded-xl px-4 text-[15px] text-neutral-900 placeholder:text-neutral-400',
              error && 'border-danger focus:ring-danger/20 focus:border-danger',
              className
            )
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-[13px] text-danger flex items-center gap-1">
            <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
