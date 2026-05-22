import { generateSearchQuery } from './drive-list';

describe('generateSearchQuery', () => {
  it('should generate a simple query for a filename without spaces', () => {
    const query = generateSearchQuery('nospacefile', 'parent-dir');
    expect(query).toBe('\'parent-dir\' in parents and (name contains \'nospacefile\')');
  });

  it('should generate a complex query for a filename with spaces', () => {
    const query = generateSearchQuery('my test file', 'parent-dir');
    expect(query).toBe('\'parent-dir\' in parents and (name contains \'my test file\' or name contains \'my.test.file\' or name contains \'my-test-file\' or name contains \'my_test_file\' )');
  });

  it('should handle filenames with special characters alongside spaces', () => {
    const query = generateSearchQuery('file! @name', 'parent123');
    expect(query).toBe('\'parent123\' in parents and (name contains \'file! @name\' or name contains \'file!.@name\' or name contains \'file!-@name\' or name contains \'file!_@name\' )');
  });

  it('should handle an empty string for the filename', () => {
    const query = generateSearchQuery('', 'parent-dir');
    expect(query).toBe('\'parent-dir\' in parents and (name contains \'\')');
  });

  it('should handle an empty string for the parent directory', () => {
    const query = generateSearchQuery('nospacefile', '');
    expect(query).toBe('\'\' in parents and (name contains \'nospacefile\')');
  });

  it('should handle a single space as a filename', () => {
    const query = generateSearchQuery(' ', 'parent-dir');
    expect(query).toBe('\'parent-dir\' in parents and (name contains \' \' or name contains \'.\' or name contains \'-\' or name contains \'_\' )');
  });
});
