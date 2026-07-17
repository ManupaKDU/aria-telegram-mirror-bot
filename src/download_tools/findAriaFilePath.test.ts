import { findAriaFilePath } from './filename-utils';
import constants = require('../.constants');

jest.mock('../.constants', () => ({
  ARIA_DOWNLOAD_LOCATION: '/downloads'
}));

describe('findAriaFilePath', () => {
  it('should return file path and download uri for a regular file inside ARIA_DOWNLOAD_LOCATION', () => {
    const files = [
      {
        path: '/downloads/test-file.zip',
        uris: [{ uri: 'http://example.com/test-file.zip' }]
      }
    ];

    const result = findAriaFilePath(files);

    expect(result).toEqual({
      path: '/downloads/test-file.zip',
      inputPath: '/downloads/test-file.zip',
      downloadUri: 'http://example.com/test-file.zip'
    });
  });

  it('should return null path for a torrent metadata file inside ARIA_DOWNLOAD_LOCATION', () => {
    const files = [
      {
        path: '/downloads/test-file.torrent',
        uris: [{ uri: 'http://example.com/test-file.torrent' }]
      }
    ];

    const result = findAriaFilePath(files);

    expect(result).toEqual({
      path: null,
      inputPath: '/downloads/test-file.torrent',
      downloadUri: 'http://example.com/test-file.torrent'
    });
  });

  it('should return null path for a file outside ARIA_DOWNLOAD_LOCATION', () => {
    const files = [
      {
        path: '/other-folder/test-file.zip',
        uris: [{ uri: 'http://example.com/test-file.zip' }]
      }
    ];

    const result = findAriaFilePath(files);

    expect(result).toEqual({
      path: null,
      inputPath: '/other-folder/test-file.zip',
      downloadUri: 'http://example.com/test-file.zip'
    });
  });

  it('should handle empty uris array', () => {
    const files = [
      {
        path: '/downloads/test-file.zip',
        uris: []
      }
    ];

    const result = findAriaFilePath(files);

    expect(result).toEqual({
      path: '/downloads/test-file.zip',
      inputPath: '/downloads/test-file.zip',
      downloadUri: null
    });
  });

  it('should handle missing uris property gracefully (if it happens)', () => {
    // Note: The original code assumes uris[0] is accessible or checking it won't crash
    // Let's test the case where uris contains an empty object or similar,
    // though the code specifically checks files[0].uris[0].
    const files = [
      {
        path: '/downloads/test-file.zip',
        uris: [null] // or undefined
      }
    ];

    const result = findAriaFilePath(files);

    expect(result).toEqual({
      path: '/downloads/test-file.zip',
      inputPath: '/downloads/test-file.zip',
      downloadUri: null
    });
  });
});
