import { generateStatusMessage } from './utils';
import * as filenameUtils from './filename-utils';

jest.mock('../.constants', () => ({
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
