/// <reference types="jest" />
import '@testing-library/jest-dom';

// Mock window.matchMedia
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {},
    addEventListener: function() {},
    removeEventListener: function() {},
    dispatchEvent: function() { return true; },
    media: '',
    onchange: null
  };
};

// Suppress console warnings
const originalError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && 
      (args[0].includes('Warning:') || args[0].includes('[React]'))) {
    return;
  }
  originalError.call(console, ...args);
};