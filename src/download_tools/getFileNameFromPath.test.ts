import { getFileNameFromPath, TYPE_METADATA } from './filename-utils';

jest.mock('../.constants', () => ({
  ARIA_DOWNLOAD_LOCATION: '/downloads'
}));

describe('getFileNameFromPath', () => {
  it('should extract the filename from a file in a 36-character uuid subdirectory', () => {
    // ARIA_DOWNLOAD_LOCATION is '/downloads' length is 10.
    // + 38 = 48.
    // '/downloads/12345678-1234-1234-1234-123456789012/' length is 48.
    const filePath = '/downloads/12345678-1234-1234-1234-123456789012/my_movie.mp4';
    const inputPath = filePath;
    expect(getFileNameFromPath(filePath, inputPath)).toBe('my_movie.mp4');
  });

  it('should return the subdirectory name if the file is nested further', () => {
    const filePath = '/downloads/12345678-1234-1234-1234-123456789012/my_folder/my_movie.mp4';
    const inputPath = filePath;
    expect(getFileNameFromPath(filePath, inputPath)).toBe('my_folder');
  });

  it('should return name from URI if filePath is falsy', () => {
    const inputPath = '';
    const downloadUri = 'http://example.com/some_file.zip?query=123';
    expect(getFileNameFromPath('', inputPath, downloadUri)).toBe('some_file.zip');
  });

  it('should handle URI with hash', () => {
    const inputPath = '';
    const downloadUri = 'http://example.com/some_file.zip#fragment';
    expect(getFileNameFromPath('', inputPath, downloadUri)).toBe('some_file.zip');
  });

  it('should handle metadata path when filePath is falsy', () => {
    const inputPath = '[METADATA]my_torrent_name';
    expect(getFileNameFromPath('', inputPath)).toBe('my_torrent_name');
  });

  it('should return TYPE_METADATA if path is truthy but does not start with [METADATA] and filePath is falsy', () => {
    const inputPath = 'some_other_path';
    expect(getFileNameFromPath('', inputPath)).toBe(TYPE_METADATA);
  });

  it('should return TYPE_METADATA if no filePath, no inputPath, and no URI are provided', () => {
    expect(getFileNameFromPath('', '')).toBe(TYPE_METADATA);
  });

  it('should fallback to URI if extracted filename is empty', () => {
    // The extracted substring will be empty if the string ends at the base dir.
    // /downloads length = 10.
    // 10 + 38 = 48.
    // So the path needs to be exactly 48 chars long to get an empty substring.
    const filePath = '/downloads/12345678-1234-1234-1234-123456789012/';
    const inputPath = '';
    const downloadUri = 'http://example.com/fallback.zip';
    expect(getFileNameFromPath(filePath, inputPath, downloadUri)).toBe('fallback.zip');
  });
});
