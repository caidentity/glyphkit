import React from 'react';
import { cn } from '@/lib/utils';
import './ButtonGroup.scss';
import Button, { ButtonProps } from './Button';

interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({ children, className }) => {
  return (
    <div className={cn('button-group', className)}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement<React.ComponentProps<typeof Button>>(child)) {
          return React.cloneElement(child, {
            ...child.props,
            className: cn(
              child.props.className,
              'button-group__item',
              {
                'button-group__item--first': index === 0,
                'button-group__item--last': index === React.Children.count(children) - 1,
              }
            ),
          });
        }
        return child;
      })}
    </div>
  );
};

export default ButtonGroup; 