import { deleteDownloadedFile } from './utils';
import fs = require('fs-extra');

jest.mock('fs-extra');

jest.mock('../.constants', () => ({
  ARIA_DOWNLOAD_LOCATION: '/downloads'
}));

describe('deleteDownloadedFile', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should successfully delete the downloaded file and log success', async () => {
    const subdirName = 'test-dir';
    (fs.remove as jest.Mock).mockResolvedValue(undefined);

    deleteDownloadedFile(subdirName);

    // Wait for the promise chain to finish
    await Promise.resolve();
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(fs.remove).toHaveBeenCalledWith('/downloads/test-dir');
    expect(consoleLogSpy).toHaveBeenCalledWith('cleanup: Deleted test-dir\n');
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('should log an error message when deletion fails', async () => {
    const subdirName = 'test-dir';
    const errorMessage = 'Permission denied';
    (fs.remove as jest.Mock).mockRejectedValue(new Error(errorMessage));

    deleteDownloadedFile(subdirName);

    // Wait for the promise chain to finish
    await Promise.resolve();
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(fs.remove).toHaveBeenCalledWith('/downloads/test-dir');
    expect(consoleErrorSpy).toHaveBeenCalledWith(`cleanup: Failed to delete test-dir: ${errorMessage}\n`);
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });
});
