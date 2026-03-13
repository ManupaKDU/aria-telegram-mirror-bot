const { getPublicUrlRequestHeaders } = require('../../out/drive/drive-utils');

describe('getPublicUrlRequestHeaders', () => {
  it('should return a valid request headers object populated with the provided arguments', () => {
    const size = 12345;
    const mimeType = 'text/plain';
    const token = 'fake-token-123';
    const fileName = 'test.txt';
    const parent = 'fake-parent-id';

    const result = getPublicUrlRequestHeaders(size, mimeType, token, fileName, parent);

    expect(result).toEqual({
      method: 'POST',
      url: 'https://www.googleapis.com/upload/drive/v3/files',
      qs: {
        uploadType: 'resumable',
        supportsAllDrives: true
      },
      headers: {
        'Postman-Token': '1d58fdd0-0408-45fa-a45d-fc703bff724a',
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

  it('should handle empty string inputs gracefully', () => {
    const size = 0;
    const mimeType = '';
    const token = '';
    const fileName = '';
    const parent = '';

    const result = getPublicUrlRequestHeaders(size, mimeType, token, fileName, parent);

    expect(result).toEqual({
      method: 'POST',
      url: 'https://www.googleapis.com/upload/drive/v3/files',
      qs: {
        uploadType: 'resumable',
        supportsAllDrives: true
      },
      headers: {
        'Postman-Token': '1d58fdd0-0408-45fa-a45d-fc703bff724a',
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

  it('should handle missing arguments gracefully (undefined)', () => {
    const result = getPublicUrlRequestHeaders(undefined, undefined, undefined, undefined, undefined);

    expect(result).toEqual({
      method: 'POST',
      url: 'https://www.googleapis.com/upload/drive/v3/files',
      qs: {
        uploadType: 'resumable',
        supportsAllDrives: true
      },
      headers: {
        'Postman-Token': '1d58fdd0-0408-45fa-a45d-fc703bff724a',
        'Cache-Control': 'no-cache',
        'X-Upload-Content-Length': undefined,
        'X-Upload-Content-Type': undefined,
        'Content-Type': 'application/json',
        'Authorization': `Bearer undefined`
      },
      body: {
        name: undefined,
        mimeType: undefined,
        parents: [undefined]
      },
      json: true
    });
  });
});
