const mockOpen = jest.fn();
jest.mock('aria2', () => {
  return jest.fn().mockImplementation(() => {
    return {
      open: mockOpen
    };
  });
});
jest.mock('../.constants', () => ({
  ARIA_PORT: 8210,
  ARIA_SECRET: 'secret'
}), { virtual: true });

import ariaTools = require('./aria-tools');

describe('openWebsocket', () => {
  it('should handle aria2.open() rejection', (done) => {
    mockOpen.mockRejectedValue('connection error');
    ariaTools.openWebsocket((err) => {
      expect(err).toBe('connection error');
      done();
    });
  });

  it('should handle aria2.open() resolution', (done) => {
    mockOpen.mockResolvedValue(undefined);
    ariaTools.openWebsocket((err) => {
      expect(err).toBeNull();
      done();
    });
  });
});
