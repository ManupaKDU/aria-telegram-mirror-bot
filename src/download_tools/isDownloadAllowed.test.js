const { isDownloadAllowed } = require('./utils');

jest.mock('../.constants', () => ({
  ARIA_FILTERED_DOMAINS: ['yts', 'YTS', 'cruzing.xyz', 'eztv.ag', 'YIFY'],
  ARIA_DOWNLOAD_LOCATION: '/downloads'
}));

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
    // 'yts' is filtered, so it should match 'yts'
    expect(isDownloadAllowed('https://example.com/yts/test')).toBe(false);
    // 'YTS' is also filtered, so it should match 'YTS'
    expect(isDownloadAllowed('https://example.com/YTS/test')).toBe(false);
  });

  it('should return true for empty URLs', () => {
    expect(isDownloadAllowed('')).toBe(true);
  });

  it('should handle URL with query parameters containing filtered domains', () => {
    expect(isDownloadAllowed('https://google.com/search?q=yts')).toBe(false);
  });
});
