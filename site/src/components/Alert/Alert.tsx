import React from 'react';

interface AlertProps {
  variant?: 'default' | 'destructive' | 'success';
  className?: string;
  children: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({ variant = 'default', className, children }) => {
  const baseStyles = 'p-4 rounded-md text-sm';
  const variantStyles = {
    default: 'bg-blue-100 text-blue-800',
    destructive: 'bg-red-100 text-red-800',
    success: 'bg-green-100 text-green-800',
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default Alert;
