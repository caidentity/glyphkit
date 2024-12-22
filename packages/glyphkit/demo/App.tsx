import { Icon } from '../src/components/Icon';
import { icons } from '../src/icons';

const App = () => {
  const iconNames = Object.keys(icons);
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">GlyphKit Demo ({iconNames.length} icons)</h1>
      <div className="grid grid-cols-4 gap-4">
        {iconNames.map((iconName) => (
          <div key={iconName} className="flex flex-col items-center p-4 border rounded">
            <Icon 
              name={iconName as keyof typeof icons}
              color="#000000" 
              size={32}
              className="w-8 h-8"
              onError={(error) => console.error(`Error rendering ${iconName}:`, error)} 
            />
            <span className="mt-2 text-sm">{iconName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App; 