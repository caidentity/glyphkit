import { render, waitFor } from '@testing-library/react';
import { Icon } from '../components/Icon';

describe('Icon', () => {
  beforeEach(() => {
    // Clear fetch mocks
    jest.clearAllMocks();
  });

  it('renders without crashing', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve('<path d="M0 0h24v24H0z" />')
      })
    );

    const { container } = render(
      <Icon name="test-icon" />
    );

    await waitFor(() => {
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  it('applies custom size and color', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve('<path d="M0 0h24v24H0z" />')
      })
    );

    const { container } = render(
      <Icon name="test-icon" size={32} color="#ff0000" />
    );

    await waitFor(() => {
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '32');
      expect(svg).toHaveAttribute('fill', '#ff0000');
    });
  });

  it('handles loading errors', async () => {
    const onError = jest.fn();
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 404
      })
    );

    render(
      <Icon name="nonexistent-icon" onError={onError} />
    );

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });
  });
}); 