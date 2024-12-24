import * as React from 'react';
import { Icon } from '../src/components/Icon';

// Generate 64 icons (8x8 grid)
const iconConfigs = [
  // Original icons
  { name: 'sun_16', color: '#000000' },
  { name: 'arrow_line_inward_corner_16', color: 'red' },
  { name: 'dot_spoke_three_24', color: '#ccc' },
  { name: 'communication_paper_plane_send_24', color: '#000000' },
  { name: 'message_warning_filled_16', color: '#000000' },
  { name: 'factory_16', color: 'red' },
  { name: 'brand_sap_24', color: 'red' },
  { name: 'minus_circle_24', color: 'red' },
  { name: 'minus_circle_24', color: 'red' },
  { name: 'date_progress_37_24', color: 'red' },
  { name: 'plus_circle_24', color: '#ccc' },
  { name: 'data_chart_pie_quarter_24', color: 'red' },
  { name: 'diagram_ven_24', color: 'red' },
  { name: 'data_spreadsheet_search_24', color: 'red' },
  { name: 'data_spreadsheet_24', color: 'yellow' },
  { name: 'checkmark_circle_24', color: 'purple' },
  { name: 'file_note_24', color: 'green' },
  { name: 'location_pin_24', color: 'green' },
  { name: 'x_circle_24', color: 'green' },
  { name: 'map_24', color: 'green' },
  { name: 'x_circle_24', color: 'green' },
  { name: 'x_circle_24', color: 'green' },
  { name: 'x_circle_24', color: 'green' },
  { name: 'x_circle_24', color: 'green' },
  { name: 'x_circle_24', color: 'green' },
  { name: 'x_circle_24', color: 'green' },
  { name: 'x_circle_24', color: 'green' },

  // Fill remaining spots with placeholders
  ...Array(56).fill({ name: 'minus_circle_24', color: '#666' })
];

const App = () => {
  const handleError = (error: Error) => {
    console.error('Icon failed to load:', error);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        GlyphKit Demo
      </h1>
      <div style={{ 
        border: '1px solid #e5e7eb',
        borderRadius: '0.375rem',
        padding: '1rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gap: '0',
          border: '1px solid #e5e7eb',
        }}>
          {iconConfigs.map((config, index) => (
            <div 
              key={index} 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                borderRight: '1px solid #e5e7eb',
                borderBottom: '1px solid #e5e7eb',
                transition: 'background-color 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Icon 
                name={config.name}
                color={config.color}
                size={24}
                onError={handleError}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App; 