'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';
import './Slider.scss';

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  label?: string;
  valueLabel?: string;
  formatValue?: (value: number) => string;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, label, valueLabel, formatValue, value, ...props }, ref) => {
  const currentValue = Array.isArray(value) ? value[0] : 0;
  const formattedValue = formatValue 
    ? formatValue(currentValue)
    : valueLabel 
      ? `${currentValue}${valueLabel}`
      : currentValue.toString();

  return (
    <div className="slider">
      <SliderPrimitive.Root
        ref={ref}
        className={cn("slider-root", className)}
        value={value}
        {...props}
      >
        <SliderPrimitive.Track className="slider-track">
          <SliderPrimitive.Range className="slider-range" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="slider-thumb" />
      </SliderPrimitive.Root>
    </div>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export default Slider; 