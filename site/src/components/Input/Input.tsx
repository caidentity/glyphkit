'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import './Input.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  variant?: 'default' | 'search';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div className={cn('input-wrapper', `input-wrapper--${variant}`, className)}>
        {variant === 'search' && (
          <Search className="input-icon" />
        )}
        <input
          type="text"
          className={cn(
            'input',
            `input--${variant}`,
            { 'input--with-icon': variant === 'search' }
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
