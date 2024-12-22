import React from 'react';
import { Icon } from '../../src/components/Icon';
import './App.css';

export function App() {
  return (
    <div className="demo-container">
      <Icon
        name="ic_link_24"
        size={24}
        color="#333"
        onError={(error) => {
          console.error('Icon error:', error);
        }}
      />
      <Icon
        name="ic_sun_24"
        size={24}
        color="#333"
        onError={(error) => {
          console.error('Icon error:', error);
        }}
      />
      <Icon
        name="ic_document_arrow_left_right_24"
        size={24}
        color="#333"
        onError={(error) => {
          console.error('Icon error:', error);
        }}
      />
      <Icon
        name="ic_cloud_database_24"
        size={24}
        color="#333"
        onError={(error) => {
          console.error('Icon error:', error);
        }}
      />
      <Icon
        name="ic_moon_16"
        size={24}
        color="#333"
        onError={(error) => {
          console.error('Icon error:', error);
        }}
      />
    </div>
  );
} 