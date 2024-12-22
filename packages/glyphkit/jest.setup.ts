import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Suppress console warnings
const originalError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && 
      (args[0].includes('Warning:') || args[0].includes('[React]'))) {
    return;
  }
  originalError.call(console, ...args);
};