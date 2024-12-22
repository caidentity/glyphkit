import '@testing-library/jest-dom';

// Suppress console.error during tests
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' && 
    (args[0].includes('[Icon]') || args[0].includes('Warning:'))
  ) {
    return;
  }
  originalError.call(console, ...args);
};