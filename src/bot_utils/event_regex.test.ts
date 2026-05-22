describe('EventRegex Disabled', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should initialize regexes without bot name when disabled', () => {
    jest.doMock('../.constants', () => ({
      COMMANDS_USE_BOT_NAME: {
        ENABLED: false,
        NAME: '@testbot'
      }
    }), { virtual: true });

    const { EventRegex } = require('./event_regex');
    const eventRegex = new EventRegex();

    expect(eventRegex.commandsRegex.start).toEqual(/^\/start$/i);
    expect(eventRegex.commandsRegex.mirrorTar).toEqual(/^\/mirrorTar (.+)/i);
    expect(eventRegex.commandsRegex.mirror).toEqual(/^\/mirror (.+)/i);
    expect(eventRegex.commandsRegex.mirrorStatus).toEqual(/^\/mirrorStatus$/i);
    expect(eventRegex.commandsRegex.list).toEqual(/^\/list (.+)/i);
    expect(eventRegex.commandsRegex.getFolder).toEqual(/^\/getFolder$/i);
    expect(eventRegex.commandsRegex.cancelMirror).toEqual(/^\/cancelMirror$/i);
    expect(eventRegex.commandsRegex.cancelAll).toEqual(/^\/cancelAll$/i);
    expect(eventRegex.commandsRegex.disk).toEqual(/^\/disk$/i);

    expect(eventRegex.commandsRegexNoName.start).toEqual(/(^\/start|^\/start@[\S]+)$/i);
    expect(eventRegex.commandsRegexNoName.mirror).toEqual(/(^\/mirror|^\/mirror@[\S]+) (.+)/i);
  });
});

describe('EventRegex Enabled', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should initialize regexes with bot name when enabled', () => {
    jest.doMock('../.constants', () => ({
      COMMANDS_USE_BOT_NAME: {
        ENABLED: true,
        NAME: '@testbot'
      }
    }), { virtual: true });

    const { EventRegex } = require('./event_regex');
    const eventRegex = new EventRegex();

    expect(eventRegex.commandsRegex.start).toEqual(/^\/start@testbot$/i);
    expect(eventRegex.commandsRegex.mirrorTar).toEqual(/^\/mirrorTar@testbot (.+)/i);
    expect(eventRegex.commandsRegex.mirror).toEqual(/^\/mirror@testbot (.+)/i);
    expect(eventRegex.commandsRegex.mirrorStatus).toEqual(/^\/mirrorStatus@testbot$/i);
    // list should remain without bot name even when enabled
    expect(eventRegex.commandsRegex.list).toEqual(/^\/list (.+)/i);
    expect(eventRegex.commandsRegex.getFolder).toEqual(/^\/getFolder@testbot$/i);
    expect(eventRegex.commandsRegex.cancelMirror).toEqual(/^\/cancelMirror@testbot$/i);
    expect(eventRegex.commandsRegex.cancelAll).toEqual(/^\/cancelAll@testbot$/i);
    expect(eventRegex.commandsRegex.disk).toEqual(/^\/disk@testbot$/i);

    expect(eventRegex.commandsRegexNoName.start).toEqual(/(^\/start|^\/start@[\S]+)$/i);
    expect(eventRegex.commandsRegexNoName.mirror).toEqual(/(^\/mirror|^\/mirror@[\S]+) (.+)/i);
  });
});

describe('EventRegex Undefined', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should gracefully handle COMMANDS_USE_BOT_NAME not being defined', () => {
    jest.doMock('../.constants', () => ({}), { virtual: true });

    const { EventRegex } = require('./event_regex');
    const eventRegex = new EventRegex();

    expect(eventRegex.commandsRegex.start).toEqual(/^\/start$/i);
    expect(eventRegex.commandsRegex.mirror).toEqual(/^\/mirror (.+)/i);
    expect(eventRegex.commandsRegexNoName.start).toEqual(/(^\/start|^\/start@[\S]+)$/i);
  });
});
