import { generateStatusMessage, isDownloadAllowed } from './utils';
import * as filenameUtils from './filename-utils';

jest.mock('../.constants', () => ({
  ARIA_FILTERED_DOMAINS: ['yts', 'YTS', 'cruzing.xyz', 'eztv.ag', 'YIFY'],
  ARIA_DOWNLOAD_LOCATION: '/downloads'
}));

// Mock filename-utils since the test is failing on filename extraction which is out of scope for downloadETA
jest.mock('./filename-utils', () => ({
  findAriaFilePath: jest.fn().mockReturnValue({
    path: '/downloads/12345678-1234-1234-1234-123456789012/test-file.zip',
    inputPath: '/downloads/12345678-1234-1234-1234-123456789012/test-file.zip',
    downloadUri: 'http://example.com/test-file.zip'
  }),
  getFileNameFromPath: jest.fn().mockReturnValue('test-file.zip'),
  getActualDownloadPath: jest.fn()
}));

describe('generateStatusMessage', () => {
  const mockFiles = [
    {
      path: '/downloads/12345678-1234-1234-1234-123456789012/test-file.zip',
      uris: [{ uri: 'http://example.com/test-file.zip' }]
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle zero speed edge case for ETA', () => {
    const totalLength = 1000000;
    const completedLength = 500000;
    const speed = 0;
    const isUploading = false;

    const result = generateStatusMessage(totalLength, completedLength, speed, mockFiles, isUploading);

    // Speed is 0, so ETA should be '-'
    expect(result.message).toContain('<b>ETA</b>: <code>-</code>');
  });

  it('should calculate ETA correctly when speed > 0', () => {
    const totalLength = 1000000;
    const completedLength = 500000;
    const speed = 100000; // 5 seconds remaining
    const isUploading = false;

    const result = generateStatusMessage(totalLength, completedLength, speed, mockFiles, isUploading);

    expect(result.message).toContain('<b>ETA</b>: <code>5s</code>');
  });

  it('should calculate minutes and seconds correctly when speed > 0', () => {
    const totalLength = 1000000;
    const completedLength = 400000;
    const speed = 10000; // 600000 bytes remaining / 10000 = 60 seconds = 1m 0s
    const isUploading = false;

    const result = generateStatusMessage(totalLength, completedLength, speed, mockFiles, isUploading);

    expect(result.message).toContain('<b>ETA</b>: <code>1m 0s</code>');
  });

  it('should calculate hours, minutes, and seconds correctly when speed > 0', () => {
    const totalLength = 4000000;
    const completedLength = 400000;
    const speed = 1000; // 3600000 bytes remaining / 1000 = 3600 seconds = 1h 0m 0s
    const isUploading = false;

    const result = generateStatusMessage(totalLength, completedLength, speed, mockFiles, isUploading);

    expect(result.message).toContain('<b>ETA</b>: <code>1h 0m 0s</code>');
  });
});


describe('isDownloadAllowed', () => {
  it('should return true for URLs that do not contain filtered domains', () => {
    expect(isDownloadAllowed('https://google.com')).toBe(true);
    expect(isDownloadAllowed('https://github.com/out386')).toBe(true);
  });

  it('should return false for URLs that contain filtered domains', () => {
    expect(isDownloadAllowed('https://yts.mx/movie')).toBe(false);
    expect(isDownloadAllowed('http://cruzing.xyz/file')).toBe(false);
    expect(isDownloadAllowed('https://example.com/YIFY/movie')).toBe(false);
  });

  it('should be case sensitive if the filtered domains are mixed case', () => {
    expect(isDownloadAllowed('https://example.com/yts/test')).toBe(false);
    expect(isDownloadAllowed('https://example.com/YTS/test')).toBe(false);
  });

  it('should return true for empty URLs', () => {
    expect(isDownloadAllowed('')).toBe(true);
  });

  it('should handle URL with query parameters containing filtered domains', () => {
    expect(isDownloadAllowed('https://google.com/search?q=yts')).toBe(false);
  });

  it('should prevent filter bypass via URL encoding', () => {
    expect(isDownloadAllowed('https://example.com/y%74s/movie')).toBe(false);
    expect(isDownloadAllowed('https://example.com/%79%74%73/movie')).toBe(false);
    expect(isDownloadAllowed('http://%63ruzing.xyz/file')).toBe(false);
  });

  it('should handle malformed URL encoding gracefully and evaluate original URL', () => {
    expect(isDownloadAllowed('https://example.com/test%ZZ')).toBe(true);
    expect(isDownloadAllowed('https://yts.mx/movie%ZZ')).toBe(false);
  });
});
