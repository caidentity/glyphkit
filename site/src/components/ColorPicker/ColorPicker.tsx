import React, { useState } from 'react';
import './ColorPicker.scss';

interface ColorPickerProps {
  initialColor?: string;
  onChange?: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  initialColor = '#5F6368',
  onChange
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [inputType, setInputType] = useState<'hex' | 'rgba'>('hex');

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
    let newColor = e.target.value;
    
    if (inputType === 'hex') {
      if (!newColor.startsWith('#')) {
        newColor = '#' + newColor;
      }
      newColor = formatHex(newColor);
      if (isValidHex(newColor)) {
        setSelectedColor(newColor);
        onChange?.(newColor);
      }
    } else {
      const hexColor = rgbaToHex(newColor);
      setSelectedColor(hexColor);
      onChange?.(hexColor);
    }
  };

  const handlePaletteColorClick = (color: string) => {
    setSelectedColor(color);
    onChange?.(color);
    setShowPicker(false);
  };

  return (
    <div className="color-picker-container">
      <div className="color-display" onClick={() => setShowPicker(!showPicker)}>
        <div className="color-preview" style={{ backgroundColor: selectedColor }}></div>
        <span>{selectedColor}</span>
      </div>

      {showPicker && (
        <div className="picker-dropdown">
          <div className="color-grid">
            {colorPalette.map((row, rowIndex) => (
              <div key={rowIndex} className="color-row">
                {row.map((color, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="color-cell"
                    style={{ backgroundColor: color }}
                    onClick={() => handlePaletteColorClick(color)}
                  ></div>
                ))}
              </div>
            ))}
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
              className="color-value-input"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
