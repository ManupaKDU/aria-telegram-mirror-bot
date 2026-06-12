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
  it('should return a valid request headers object populated with the provided arguments', () => {
    const options = {
      size: 12345,
      mimeType: 'text/plain',
      token: 'fake-token-123',
      fileName: 'test.txt',
      parent: 'fake-parent-id'
    };

    const result = getPublicUrlRequestHeaders(options);

    expect(result).toEqual({
      method: 'POST',
      url: 'https://www.googleapis.com/upload/drive/v3/files',
      qs: {
        uploadType: 'resumable',
        supportsAllDrives: true
      },
      headers: {
        'Cache-Control': 'no-cache',
        'X-Upload-Content-Length': 12345,
        'X-Upload-Content-Type': 'text/plain',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer fake-token-123'
      },
      body: {
        name: 'test.txt',
        mimeType: 'text/plain',
        parents: ['fake-parent-id']
      },
      json: true
    });
  });

  it('should handle empty string inputs gracefully', () => {
    const options = {
      size: 0,
      mimeType: '',
      token: '',
      fileName: '',
      parent: ''
    };

    const result = getPublicUrlRequestHeaders(options);

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
        'Authorization': 'Bearer '
      },
      body: {
        name: '',
        mimeType: '',
        parents: ['']
      },
      json: true
    });
  });

  it('should handle negative sizes without modifying them (assuming caller does validation)', () => {
    const options = {
      size: -100,
      mimeType: 'video/mp4',
      token: 'token',
      fileName: 'vid.mp4',
      parent: 'parent'
    };

    const result = getPublicUrlRequestHeaders(options);

    expect(result.headers['X-Upload-Content-Length']).toBe(-100);
  });
});
