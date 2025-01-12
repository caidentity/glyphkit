import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './ColorPicker.scss';

interface ColorPickerProps {
  initialColor?: string;
  onChange?: (color: string) => void;
  showInput?: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  initialColor = '#5F6368',
  onChange,
  showInput = true,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const trueInitialColor = useRef(initialColor);
  const [inputType, setInputType] = useState<'hex' | 'rgba'>('hex');
  const [hue, setHue] = useState(260);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingHue, setIsDraggingHue] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const pickerRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('Selected Color:', selectedColor);
    console.log('True Initial Color:', trueInitialColor.current);
    console.log('Should show reset:', selectedColor.toLowerCase() !== trueInitialColor.current.toLowerCase());
  }, [selectedColor]);

  const colorPalette = [
    ['#000000', '#424242', '#616161', '#757575', '#9E9E9E', '#BDBDBD', '#E0E0E0', '#EEEEEE', '#F5F5F5', '#FFFFFF'],
    ['#8B0000', '#FF4500', '#FFA500', '#FFFF00', '#7FFF00', '#00FFFF', '#4169E1', '#0000FF', '#8A2BE2', '#FF00FF'],
    ['#FFE4E1', '#FFD9D9', '#FFE4C4', '#FFFACD', '#F0FFF0', '#E0FFFF', '#E6E6FA', '#E6E6FA', '#E6E6FA', '#FFE4E1'],
    ['#CD853F', '#DEB887', '#D2B48C', '#F0E68C', '#90EE90', '#87CEEB', '#87CEFA', '#ADD8E6', '#9370DB', '#DDA0DD'],
    ['#8B4513', '#CD5C5C', '#DAA520', '#FFD700', '#32CD32', '#20B2AA', '#4682B4', '#6495ED', '#483D8B', '#8B008B'],
    ['#800000', '#B22222', '#B8860B', '#DAA520', '#006400', '#008080', '#000080', '#191970', '#4B0082', '#800080'],
  ];

  const hexToRgba = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 1)`;
  };

  const rgbaToHex = (rgba: string): string => {
    const values = rgba.match(/\d+/g);
    if (!values || values.length < 3) return '#000000';
    const r = parseInt(values[0]).toString(16).padStart(2, '0');
    const g = parseInt(values[1]).toString(16).padStart(2, '0');
    const b = parseInt(values[2]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  };

  const isValidHex = (hex: string): boolean => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  };

  const formatHex = (input: string): string => {
    // Remove non-hex characters and ensure starts with #
    let formatted = input.replace(/[^A-Fa-f0-9]/g, '');
    if (formatted.length > 6) formatted = formatted.slice(0, 6);
    return '#' + formatted;
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (inputType === 'hex') {
      // Allow typing by updating state immediately
      setSelectedColor(newValue);
      
      // Only trigger onChange when it's a valid hex
      if (isValidHex(formatHex(newValue))) {
        const formattedHex = formatHex(newValue);
        onChange?.(formattedHex);
      }
    } else {
      // For RGBA, update immediately and convert valid values
      setSelectedColor(newValue);
      if (newValue.match(/^rgba?\((\s*\d+\s*,){3}\s*[\d.]+\)$/)) {
        const hexColor = rgbaToHex(newValue);
        onChange?.(hexColor);
      }
    }
  };

  const handlePaletteColorClick = (color: string) => {
    setSelectedColor(color);
    onChange?.(color);
    setShowPicker(false);
  };

  const handleColorDisplayClick = (e: React.MouseEvent) => {
    // Allow clicking input without closing picker
    if ((e.target as HTMLElement).closest('.color-value-input')) {
      return;
    }
    setShowPicker(!showPicker);
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return `#${Math.round(r * 255).toString(16).padStart(2, '0')}${Math.round(g * 255).toString(16).padStart(2, '0')}${Math.round(b * 255).toString(16).padStart(2, '0')}`.toUpperCase();
  };

  const handleHueChange = (e: React.MouseEvent) => {
    if (!hueRef.current || (!isDraggingHue && e.type === 'mousemove')) return;
    
    const rect = hueRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const newHue = Math.round((x / rect.width) * 360);
    setHue(newHue);
    
    const newColor = hslToRgb(newHue, 100, 50);
    setSelectedColor(newColor);
    onChange?.(newColor);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !pickerRef.current) return;
    
    const rect = pickerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
    
    setPosition({ x, y });

    const saturation = (x / rect.width) * 100;
    const lightness = 100 - (y / rect.height) * 100;

    const newColor = hslToRgb(hue, saturation, lightness);
    setSelectedColor(newColor);
    onChange?.(newColor);
  };

  // Update dropdown position when showing picker
  useEffect(() => {
    if (showPicker && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
    }
  }, [showPicker]);

  // Update click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside both the container and dropdown
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPicker]);

  const handleReset = () => {
    setSelectedColor(trueInitialColor.current);
    onChange?.(trueInitialColor.current);
    setShowPicker(false);
  };

  return (
    <div className="color-picker-container" ref={containerRef}>
      <div className="color-display" onClick={handleColorDisplayClick}>
        <div className="color-preview" style={{ backgroundColor: selectedColor }}></div>
        {showInput && (
          <input
            type="text"
            value={inputType === 'hex' ? selectedColor : hexToRgba(selectedColor)}
            onChange={handleColorChange}
            className="color-value-input"
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>

      {showPicker && createPortal(
        <div 
          ref={dropdownRef}
          className="picker-dropdown"
          style={{
            position: 'fixed',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`
          }}
        >
          <div 
            ref={pickerRef}
            className="gradient-picker"
            style={{
              background: `
                linear-gradient(to right, #FFF, hsl(${hue}, 100%, 50%)),
                linear-gradient(to bottom, transparent, #000)
              `,
              backgroundBlendMode: 'multiply'
            }}
            onMouseDown={(e) => {
              setIsDragging(true);
              handleMouseMove(e);
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
          >
            <div 
              className="picker-handle"
              style={{
                left: position.x,
                top: position.y,
                backgroundColor: selectedColor
              }}
            />
          </div>

          <div 
            ref={hueRef}
            className="hue-slider"
            onMouseDown={(e) => {
              setIsDraggingHue(true);
              handleHueChange(e);
            }}
            onMouseMove={handleHueChange}
            onMouseUp={() => setIsDraggingHue(false)}
            onMouseLeave={() => setIsDraggingHue(false)}
          >
            <div 
              className="hue-handle"
              style={{
                left: `${(hue / 360) * 100}%`
              }}
            />
          </div>

          <div className="color-input">
            <select 
              value={inputType} 
              onChange={(e) => setInputType(e.target.value as 'hex' | 'rgba')}
              className="format-select"
            >
              <option value="hex">HEX</option>
              <option value="rgba">RGBA</option>
            </select>
            <input
              type="text"
              value={inputType === 'hex' ? selectedColor : hexToRgba(selectedColor)}
              onChange={handleColorChange}
              className="dropdown-color-input"
            />
          </div>

          {selectedColor.toLowerCase() !== trueInitialColor.current.toLowerCase() && (
            <div className="color-reset">
              <button 
                onClick={handleReset}
                className="reset-button"
              >
                Reset to default
              </button>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

export default ColorPicker;
