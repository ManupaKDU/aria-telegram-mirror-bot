import { RegExps } from './reg_exps';

describe('RegExps', () => {
  it('should initialize RegExp properties with the correct strings and "i" flag', () => {
    const commands = [
      '^/start$',
      '^/mirrorTar (.+)',
      '^/mirror (.+)',
      '^/mirrorStatus$',
      '^/list (.+)',
      '^/getFolder$',
      '^/cancelMirror$',
      '^/cancelAll$',
      '^/disk$'
    ];

    const regExps = new RegExps(commands);

    expect(regExps.start).toEqual(new RegExp('^/start$', 'i'));
    expect(regExps.mirrorTar).toEqual(new RegExp('^/mirrorTar (.+)', 'i'));
    expect(regExps.mirror).toEqual(new RegExp('^/mirror (.+)', 'i'));
    expect(regExps.mirrorStatus).toEqual(new RegExp('^/mirrorStatus$', 'i'));
    expect(regExps.list).toEqual(new RegExp('^/list (.+)', 'i'));
    expect(regExps.getFolder).toEqual(new RegExp('^/getFolder$', 'i'));
    expect(regExps.cancelMirror).toEqual(new RegExp('^/cancelMirror$', 'i'));
    expect(regExps.cancelAll).toEqual(new RegExp('^/cancelAll$', 'i'));
    expect(regExps.disk).toEqual(new RegExp('^/disk$', 'i'));
  });

  it('should handle undefined strings gracefully by compiling into an empty non-capturing group RegExp /(?:)/i', () => {
    const commands = new Array(9).fill(undefined as unknown as string);

    const regExps = new RegExps(commands);

    const emptyRegExp = /(?:)/i;

    expect(regExps.start).toEqual(emptyRegExp);
    expect(regExps.mirrorTar).toEqual(emptyRegExp);
    expect(regExps.mirror).toEqual(emptyRegExp);
    expect(regExps.mirrorStatus).toEqual(emptyRegExp);
    expect(regExps.list).toEqual(emptyRegExp);
    expect(regExps.getFolder).toEqual(emptyRegExp);
    expect(regExps.cancelMirror).toEqual(emptyRegExp);
    expect(regExps.cancelAll).toEqual(emptyRegExp);
    expect(regExps.disk).toEqual(emptyRegExp);
  });
});
