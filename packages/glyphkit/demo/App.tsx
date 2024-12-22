import React from 'react';
import { Icon } from '../src/components/Icon';
import { icons } from '../src/icons/registry';

const App = () => {
  const iconNames = Object.keys(icons);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">GlyphKit Demo</h1>
      <div className="grid grid-cols-2 gap-4">
        {iconNames.map((name) => (
          <div key={name} className="p-4 border rounded">
            <Icon 
              name={name as keyof typeof icons}
              color="#000000" 
              size={32}
              className="mb-2"
            />
            <div className="text-sm">{name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App; 