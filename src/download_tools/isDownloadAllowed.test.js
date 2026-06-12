const { isDownloadAllowed } = require('@src/download_tools/utils');

jest.mock('@src/.constants', () => ({
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

  it('should prevent filter bypass via URL encoding', () => {
    // URL encoded version of 'yts' is 'y%74s'
    expect(isDownloadAllowed('https://example.com/y%74s/movie')).toBe(false);
    expect(isDownloadAllowed('https://example.com/%79%74%73/movie')).toBe(false);

    // URL encoded version of 'cruzing.xyz'
    expect(isDownloadAllowed('http://%63ruzing.xyz/file')).toBe(false);
  });

  it('should handle malformed URL encoding gracefully and evaluate original URL', () => {
    // %ZZ is an invalid URI encoding
    expect(isDownloadAllowed('https://example.com/test%ZZ')).toBe(true);
    // Even if malformed encoding exists elsewhere, it still correctly evaluates the original URL for blocked domains
    expect(isDownloadAllowed('https://yts.mx/movie%ZZ')).toBe(false);
  });
});
