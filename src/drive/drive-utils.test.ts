import { getFileLink, getPublicUrlRequestHeaders } from './drive-utils';

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

describe('getPublicUrlRequestHeaders', () => {
  it('should construct the correct request headers and body', () => {
    const size = 1024;
    const mimeType = 'text/plain';
    const token = 'fake-token-123';
    const fileName = 'test.txt';
    const parent = 'folder-id-456';

    const result = getPublicUrlRequestHeaders(size, mimeType, token, fileName, parent);

    expect(result).toEqual({
      method: 'POST',
      url: 'https://www.googleapis.com/upload/drive/v3/files',
      qs: {
        uploadType: 'resumable',
        supportsAllDrives: true
      },
      headers: {
        'Cache-Control': 'no-cache',
        'X-Upload-Content-Length': size,
        'X-Upload-Content-Type': mimeType,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: {
        name: fileName,
        mimeType: mimeType,
        parents: [parent]
      },
      json: true
    });
  });

  it('should correctly map falsy but valid values', () => {
    const result = getPublicUrlRequestHeaders(0, '', '', '', '');

    expect(result).toEqual({
      method: 'POST',
      url: 'https://www.googleapis.com/upload/drive/v3/files',
      qs: {
        uploadType: 'resumable',
        supportsAllDrives: true
      },
      headers: {
        'Cache-Control': 'no-cache',
        'X-Upload-Content-Length': 0,
        'X-Upload-Content-Type': '',
        'Content-Type': 'application/json',
        'Authorization': `Bearer `
      },
      body: {
        name: '',
        mimeType: '',
        parents: ['']
      },
      json: true
    });
  });
});
