import { getFileLink } from './drive-utils';

describe('getFileLink', () => {
  it('should return a folder link when isFolder is true', () => {
    const fileId = '12345folderId';
    const result = getFileLink(fileId, true);
    expect(result).toBe('https://drive.google.com/drive/folders/12345folderId');
  });

  it('should return a file download link when isFolder is false', () => {
    const fileId = '67890fileId';
    const result = getFileLink(fileId, false);
    expect(result).toBe('https://drive.google.com/uc?id=67890fileId&export=download');
  });

  it('should handle empty string as fileId for folder', () => {
    const result = getFileLink('', true);
    expect(result).toBe('https://drive.google.com/drive/folders/');
  });

  it('should handle empty string as fileId for file', () => {
    const result = getFileLink('', false);
    expect(result).toBe('https://drive.google.com/uc?id=&export=download');
  });
});
