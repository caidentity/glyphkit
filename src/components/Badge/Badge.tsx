import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'outline' | 'secondary';
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ variant = 'default', className, onClick, children }) => {
  const baseStyles = 'px-3 py-1 rounded-full text-sm cursor-pointer';
  const variantStyles = {
    default: 'bg-blue-500 text-white',
    outline: 'border border-blue-500 text-blue-500',
    secondary: 'bg-gray-200 text-gray-700',
  };

  return (
    <span
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </span>
  );
};

export default Badge;
