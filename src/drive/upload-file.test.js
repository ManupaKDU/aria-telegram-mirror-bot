const fs = require('fs');

// Mock other dependencies
jest.mock('http-range-parse', () => jest.fn(), { virtual: true });

// Mock `drive-auth` and `drive-utils`
jest.mock('../../out/drive/drive-auth', () => ({
  call: jest.fn()
}), { virtual: true });

jest.mock('../../out/drive/drive-utils', () => ({
  getPublicUrlRequestHeaders: jest.fn()
}), { virtual: true });

// Mock `request` and `request.put`
jest.mock('request', () => {
  const req = jest.fn();
  req.put = jest.fn();
  return req;
}, { virtual: true });

// Mock `fs.statSync` and `fs.createReadStream`
jest.mock('fs', () => ({
  statSync: jest.fn().mockReturnValue({ size: 2000 }),
  createReadStream: jest.fn(),
  writeFileSync: jest.fn()
}));

describe('uploadChunk', () => {
  let uploadGoogleDriveFile;

  beforeAll(() => {
    // Dynamically require to ensure mocks are applied
    const uploadFileModule = require('../../out/drive/upload-file');
    uploadGoogleDriveFile = uploadFileModule.uploadGoogleDriveFile;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle large unparseable body correctly', async () => {
    const dlDetails = { uploadedBytes: 0 };
    const parent = 'test_parent';
    const file = { filePath: '/test/path/file.txt', mimeType: 'text/plain' };

    const driveAuthMock = require('../../out/drive/drive-auth');
    driveAuthMock.call.mockImplementation((cb) => {
      cb(null, {
        getAccessToken: jest.fn().mockResolvedValue({ token: 'mock_token' })
      });
    });

    const requestMock = require('request');
    requestMock.mockImplementation((options, cb) => {
      cb(null, { headers: { location: 'mock_url' } });
    });

    const largeUnparseableBody = 'a'.repeat(1500);

    requestMock.put.mockImplementation((options, cb) => {
      // simulate large body response
      cb(null, { headers: {} }, largeUnparseableBody);
    });

    // Catch console.log
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    try {
      await uploadGoogleDriveFile(dlDetails, parent, file);
    } catch (e) {
      // It should reject because fileId is invalid/null
      expect(e.message).toContain('Uploaded and got invalid id');
    }

    const fsMock = require('fs');
    expect(fsMock.writeFileSync).toHaveBeenCalled();
    const [calledFilename, calledContent] = fsMock.writeFileSync.mock.calls[0];
    expect(calledFilename).toMatch(/upload-error-\d+\.txt/);
    expect(calledContent).toBe(largeUnparseableBody);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining(`Upload chunk returned large unparseable body. Dumped to ${calledFilename}`));

    consoleSpy.mockRestore();
  });

  it('should handle small unparseable body correctly', async () => {
    const dlDetails = { uploadedBytes: 0 };
    const parent = 'test_parent';
    const file = { filePath: '/test/path/file.txt', mimeType: 'text/plain' };

    const driveAuthMock = require('../../out/drive/drive-auth');
    driveAuthMock.call.mockImplementation((cb) => {
      cb(null, {
        getAccessToken: jest.fn().mockResolvedValue({ token: 'mock_token' })
      });
    });

    const requestMock = require('request');
    requestMock.mockImplementation((options, cb) => {
      cb(null, { headers: { location: 'mock_url' } });
    });

    const smallUnparseableBody = 'small_error';

    requestMock.put.mockImplementation((options, cb) => {
      // simulate small body response
      cb(null, { headers: {} }, smallUnparseableBody);
    });

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    try {
      await uploadGoogleDriveFile(dlDetails, parent, file);
    } catch (e) {
      // It should reject because fileId is invalid/null
    }

    const fsMock = require('fs');
    expect(fsMock.writeFileSync).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(smallUnparseableBody);

    consoleSpy.mockRestore();
  });
});