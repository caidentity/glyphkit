'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import './Input.scss';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  className?: string;
  variant?: 'default' | 'search';
  size?: 'small' | 'medium' | 'large';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', size = 'medium', ...props }, ref) => {
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
            `input--${size}`,
            { 'input--with-icon': variant === 'search' },
            className
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
