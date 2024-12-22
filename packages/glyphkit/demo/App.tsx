import { Icon } from '../src/components/Icon';

const App = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">GlyphKit Demo</h1>
      <div className="p-4 border rounded">
        <Icon 
          name="ic_brand_apple_16"
          color="#000000" 
          size={32}
        />
      </div>
    </div>
  );
};

export default App; 