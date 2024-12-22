import React from 'react';
import { render } from '@testing-library/react';
import { Icon } from '../components/Icon';
import { icons } from '../icons';

// Get a real icon name from our registry
const SAMPLE_ICON = Object.keys(icons)[0];

describe('Icon', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Icon name={SAMPLE_ICON} />
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('applies custom size and color', () => {
    const { container } = render(
      <Icon name={SAMPLE_ICON} size={32} color="#ff0000" />
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
    expect(svg).toHaveStyle({ color: '#ff0000' });
  });

  it('handles nonexistent icons', () => {
    const onError = jest.fn();
    render(
      <Icon name="nonexistent-icon" onError={onError} />
    );
    expect(onError).toHaveBeenCalled();
  });
}); 