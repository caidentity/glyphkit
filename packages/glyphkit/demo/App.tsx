import * as React from 'react';
import { Icon } from '../src/components/Icon';

const App = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">GlyphKit Demo</h1>
      <div className="p-4 border rounded">
        <Icon 
          name="communication_paper_plane_send_24"
          color="#000000" 
          size={32}
          onError={(error: Error) => {
            console.error('Icon failed to load:', error);
          }}
        />
                <Icon 
          name="arrow_line_inward_corner_16"
          color="red" 
          size={32}
          onError={(error: Error) => {
            console.error('Icon failed to load:', error);
          }}
        />
                <Icon 
          name="dot_spoke_three_24"
          color="#ccc" 
          size={32}
          onError={(error: Error) => {
            console.error('Icon failed to load:', error);
          }}
        />
                <Icon 
          name="communication_paper_plane_send_24"
          color="#000000" 
          size={32}
          onError={(error: Error) => {
            console.error('Icon failed to load:', error);
          }}
        />
                <Icon 
          name="message_warning_filled_16"
          color="#000000" 
          size={32}
          onError={(error: Error) => {
            console.error('Icon failed to load:', error);
          }}
        />
      </div>
    </div>
  );
};

export default App; 