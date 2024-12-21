import { render, screen } from '@testing-library/react';
import { Icon } from '../components/Icon';
import { GlyphKitProvider } from '../components/GlyphKitProvider';

describe('Icon', () => {
  it('renders without crashing', () => {
    render(
      <GlyphKitProvider>
        <Icon name="test-icon" />
      </GlyphKitProvider>
    );
    
    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  it('applies custom size and color', () => {
    render(
      <GlyphKitProvider>
        <Icon name="test-icon" size={32} color="#ff0000" />
      </GlyphKitProvider>
    );
    
    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('width', '32');
    expect(svgElement).toHaveAttribute('fill', '#ff0000');
  });
}); 