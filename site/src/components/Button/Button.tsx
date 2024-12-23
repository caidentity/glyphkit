import React from 'react';
import './Button.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'default', 
  size = 'md', 
  className = '',
  children, 
  ...props 
}) => {
  return (
    <button
      className={`button button--${variant} button--${size} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
