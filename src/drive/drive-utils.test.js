const { getFileLink } = require('./drive-utils');

describe('getFileLink', () => {
  it('should return a Google Drive folder link when isFolder is true', () => {
    const fileId = '12345abcdef';
    const expectedLink = 'https://drive.google.com/drive/folders/' + fileId;
    expect(getFileLink(fileId, true)).toBe(expectedLink);
  });

  it('should return a direct download link when isFolder is false', () => {
    const fileId = '12345abcdef';
    const expectedLink = 'https://drive.google.com/uc?id=' + fileId + '&export=download';
    expect(getFileLink(fileId, false)).toBe(expectedLink);
  });

  it('should handle empty fileId correctly', () => {
    expect(getFileLink('', true)).toBe('https://drive.google.com/drive/folders/');
    expect(getFileLink('', false)).toBe('https://drive.google.com/uc?id=&export=download');
  });
});
