import { DlVars } from './detail';
import TelegramBot = require('node-telegram-bot-api');

describe('DlVars', () => {
  beforeEach(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(1620000000000); // Set a fixed time for predictable testing
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize correctly with a message containing a username', () => {
    const mockMsg = {
      from: {
        id: 123,
        username: 'testuser',
        first_name: 'Test'
      },
      chat: {
        id: 456
      },
      message_id: 789
    } as any as TelegramBot.Message;

    const gid = 'test-gid-123';
    const isTar = true;
    const downloadDir = '/downloads/abc';

    const dlVars = new DlVars(gid, mockMsg, isTar, downloadDir);

    expect(dlVars.gid).toBe(gid);
    expect(dlVars.downloadDir).toBe(downloadDir);
    expect(dlVars.isTar).toBe(isTar);
    expect(dlVars.tgFromId).toBe(123);
    expect(dlVars.tgChatId).toBe(456);
    expect(dlVars.tgMessageId).toBe(789);
    expect(dlVars.tgUsername).toBe('@testuser');
    expect(dlVars.tgRepliedUsername).toBeUndefined();
    expect(dlVars.uploadedBytes).toBe(0);
    expect(dlVars.uploadedBytesLast).toBe(0);
    expect(dlVars.startTime).toBe(1620000000000);
  });

  it('should initialize correctly with a message without a username (fallback to HTML link)', () => {
    const mockMsg = {
      from: {
        id: 123,
        first_name: 'Test'
      },
      chat: {
        id: 456
      },
      message_id: 789
    } as any as TelegramBot.Message;

    const dlVars = new DlVars('test-gid', mockMsg, false, '/downloads');

    expect(dlVars.tgUsername).toBe('<a href="tg://user?id=123">Test</a>');
  });

  it('should extract tgRepliedUsername if reply_to_message is present', () => {
    const mockMsg = {
      from: {
        id: 123,
        username: 'testuser',
        first_name: 'Test'
      },
      chat: {
        id: 456
      },
      message_id: 789,
      reply_to_message: {
        from: {
          id: 321,
          first_name: 'RepliedUser'
        }
      }
    } as any as TelegramBot.Message;

    const dlVars = new DlVars('test-gid', mockMsg, false, '/downloads');

    expect(dlVars.tgRepliedUsername).toBe('<a href="tg://user?id=321">RepliedUser</a>');
  });

  it('should extract tgRepliedUsername as @username if reply_to_message has a username', () => {
    const mockMsg = {
      from: {
        id: 123,
        username: 'testuser',
        first_name: 'Test'
      },
      chat: {
        id: 456
      },
      message_id: 789,
      reply_to_message: {
        from: {
          id: 321,
          username: 'replieduser',
          first_name: 'RepliedUser'
        }
      }
    } as any as TelegramBot.Message;

    const dlVars = new DlVars('test-gid', mockMsg, false, '/downloads');

    expect(dlVars.tgRepliedUsername).toBe('@replieduser');
  });
});
