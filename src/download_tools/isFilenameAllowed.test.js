describe('isFilenameAllowed', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should return 1 for allowed filenames', () => {
    jest.doMock('../../out/.constants', () => ({
      ARIA_FILTERED_FILENAMES: ['filtered', 'blocked', 'spam'],
    }));
    const { isFilenameAllowed } = require('../../out/download_tools/filename-utils.js');

    expect(isFilenameAllowed('good_file.txt')).toBe(1);
    expect(isFilenameAllowed('another-file.png')).toBe(1);
  });

  it('should return 0 for filtered filenames', () => {
    jest.doMock('../../out/.constants', () => ({
      ARIA_FILTERED_FILENAMES: ['filtered', 'blocked', 'spam'],
    }));
    const { isFilenameAllowed } = require('../../out/download_tools/filename-utils.js');

    expect(isFilenameAllowed('this-is-filtered-file.txt')).toBe(0);
    expect(isFilenameAllowed('blocked_movie.mp4')).toBe(0);
    expect(isFilenameAllowed('spam.txt')).toBe(0);
  });

  it('should return -1 for metadata', () => {
    jest.doMock('../../out/.constants', () => ({
      ARIA_FILTERED_FILENAMES: ['filtered', 'blocked', 'spam'],
    }));
    const { isFilenameAllowed, TYPE_METADATA } = require('../../out/download_tools/filename-utils.js');

    expect(isFilenameAllowed(TYPE_METADATA)).toBe(-1);
  });

  it('should return 1 if ARIA_FILTERED_FILENAMES is not defined', () => {
    jest.doMock('../../out/.constants', () => ({
      ARIA_FILTERED_FILENAMES: null,
    }));
    const { isFilenameAllowed, TYPE_METADATA } = require('../../out/download_tools/filename-utils.js');

    expect(isFilenameAllowed(TYPE_METADATA)).toBe(1);
    expect(isFilenameAllowed('spam.txt')).toBe(1);
  });

  it('should be case sensitive if the filtered filenames are mixed case', () => {
    jest.doMock('../../out/.constants', () => ({
      ARIA_FILTERED_FILENAMES: ['FILTERED', 'blocked', 'spam'],
    }));
    const { isFilenameAllowed } = require('../../out/download_tools/filename-utils.js');

    // 'FILTERED' is filtered, so it should match 'FILTERED'
    expect(isFilenameAllowed('THIS-IS-FILTERED-FILE.txt')).toBe(0);
    // 'FILTERED' does not match 'filtered'
    expect(isFilenameAllowed('this-is-filtered-file.txt')).toBe(1);
  });
});
