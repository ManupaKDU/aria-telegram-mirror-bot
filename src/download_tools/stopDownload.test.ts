import { stopDownload } from './aria-tools';

jest.mock('aria2');
import Aria2 = require('aria2');

describe('stopDownload', () => {
  it('should call aria2.remove with correct args', () => {
    const mockCallback = jest.fn();
    stopDownload('mock-gid', mockCallback);

    const mockAria2Instance = (Aria2 as any).mock.instances[0];
    expect(mockAria2Instance.remove).toHaveBeenCalledWith('mock-gid', mockCallback);
  });
});
