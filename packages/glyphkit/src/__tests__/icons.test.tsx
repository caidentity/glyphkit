import React from 'react';
import { render } from '@testing-library/react';
import * as Icons from '../icons';
import { paths } from '../../icons/flat/paths.js';

// Basic smoke test only
describe('Icon Registry', () => {
  it('should have icons exported', () => {
    expect(Icons).toBeDefined();
    expect(Icons.icons).toBeDefined();
    expect(Icons.getIcon).toBeDefined();
  });
}); 