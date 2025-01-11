'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';
import './Slider.scss';
import { motion, AnimatePresence } from 'framer-motion';

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  label?: string;
  valueLabel?: string;
  formatValue?: (value: number) => string;
  showTooltip?: boolean;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, label, valueLabel, formatValue, value, showTooltip = false, ...props }, ref) => {
  const [isDragging, setIsDragging] = React.useState(false);
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
        onPointerDown={() => setIsDragging(true)}
        onPointerUp={() => setIsDragging(false)}
        {...props}
      >
        <SliderPrimitive.Track className="slider-track">
          <SliderPrimitive.Range className="slider-range" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="slider-thumb">
          {showTooltip && (
            <AnimatePresence>
              {isDragging && (
                <motion.div 
                  className="slider-tooltip"
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: -32 }}
                  exit={{ opacity: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {formattedValue}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Root>
    </div>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export default Slider; 