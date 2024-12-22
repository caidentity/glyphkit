import { icons, getIcon } from '../icons';

// Basic smoke test only
describe('Icon Registry', () => {
  it('should have icons exported', () => {
    expect(icons).toBeDefined();
    expect(getIcon).toBeDefined();
  });
}); 