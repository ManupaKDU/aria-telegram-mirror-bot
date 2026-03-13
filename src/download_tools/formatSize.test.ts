import { formatSize } from './utils';

jest.mock('../.constants', () => ({
  ARIA_FILTERED_DOMAINS: ['yts', 'YTS', 'cruzing.xyz', 'eztv.ag', 'YIFY'],
  ARIA_DOWNLOAD_LOCATION: '/downloads'
}));

describe('formatSize', () => {
  it('should format sizes less than 1000 bytes as B', () => {
    expect(formatSize(0)).toBe('0B');
    expect(formatSize(500)).toBe('500B');
    expect(formatSize(999)).toBe('999B');
  });

  it('should format sizes less than 1024000 bytes as KB', () => {
    expect(formatSize(1000)).toBe('0.98KB'); // 1000 / 1024 = 0.976... -> 0.98
    expect(formatSize(1024)).toBe('1KB');
    expect(formatSize(512000)).toBe('500KB'); // 512000 / 1024 = 500
    expect(formatSize(1023999)).toBe('1000KB'); // 1023999 / 1024 = 999.999... -> 1000
  });

  it('should format sizes less than 1048576000 bytes as MB', () => {
    expect(formatSize(1024000)).toBe('0.98MB'); // 1024000 / 1048576 = 0.976... -> 0.98
    expect(formatSize(1048576)).toBe('1MB');
    expect(formatSize(524288000)).toBe('500MB'); // 524288000 / 1048576 = 500
    expect(formatSize(1048575999)).toBe('1000MB'); // 1048575999 / 1048576 = 999.999... -> 1000
  });

  it('should format sizes 1048576000 bytes or greater as GB', () => {
    expect(formatSize(1048576000)).toBe('0.98GB'); // 1048576000 / 1073741824 = 0.976... -> 0.98
    expect(formatSize(1073741824)).toBe('1GB');
    expect(formatSize(5368709120)).toBe('5GB'); // 5368709120 / 1073741824 = 5
  });

  it('should format negative sizes', () => {
    expect(formatSize(-500)).toBe('-500B');
  });

  it('should round to 2 decimal places', () => {
    // 1536 is 1.5 KB
    expect(formatSize(1536)).toBe('1.5KB');
    // 1234567 is 1234567 / 1048576 = 1.177... -> 1.18 MB
    expect(formatSize(1234567)).toBe('1.18MB');
    // 1500000000 is 1500000000 / 1073741824 = 1.397... -> 1.4 GB
    expect(formatSize(1500000000)).toBe('1.4GB');
  });
});
