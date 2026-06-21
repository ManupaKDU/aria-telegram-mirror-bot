describe('getActualDownloadPath', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should return the path of the top-level directory of the download', () => {
    jest.doMock('../../out/.constants', () => ({
      ARIA_DOWNLOAD_LOCATION: '/downloads',
    }));
    const { getActualDownloadPath } = require('../../out/download_tools/filename-utils.js');

    const filePath = '/downloads/12345678-1234-1234-1234-123456789012/my_folder/my_file.txt';
    expect(getActualDownloadPath(filePath)).toBe('/downloads/12345678-1234-1234-1234-123456789012/my_folder');
  });

  it('should return the file path if it is the only file in the download (nameEndIndex === -1)', () => {
    jest.doMock('../../out/.constants', () => ({
      ARIA_DOWNLOAD_LOCATION: '/downloads',
    }));
    const { getActualDownloadPath } = require('../../out/download_tools/filename-utils.js');

    const filePath = '/downloads/12345678-1234-1234-1234-123456789012/my_single_file.txt';
    expect(getActualDownloadPath(filePath)).toBe(filePath);
  });
});
