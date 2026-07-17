jest.mock('../../src/.constants', () => ({}), { virtual: true });
jest.mock('node-telegram-bot-api', () => ({}), { virtual: true });
jest.mock('../../src/download_tools/aria-tools', () => ({}), { virtual: true });
jest.mock('../../src/dl_model/dl-manager', () => ({
  DlManager: {
    getInstance: jest.fn(() => ({}))
  }
}), { virtual: true });

const { sleep, deleteMsg, sendUnauthorizedMessage, editMessage, sendMessage } = require('@src/bot_utils/msg-tools');

describe('sendMessage', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should catch and log error when bot.sendMessage rejects', async () => {
    const mockBot = {
      sendMessage: jest.fn().mockRejectedValue(new Error('test error'))
    };
    const mockMsg = {
      chat: { id: 123 },
      message_id: 456
    };
    const text = 'test message';

    sendMessage(mockBot, mockMsg, text);

    expect(mockBot.sendMessage).toHaveBeenCalledWith(123, text, {
      reply_to_message_id: 456,
      parse_mode: 'HTML'
    });

    // Flush microtasks for bot.sendMessage rejection
    await Promise.resolve();
    // Flush microtasks for the .catch handler in the source code to execute
    await Promise.resolve();

    expect(consoleErrorSpy).toHaveBeenCalledWith('sendMessage error: test error');
  });
});

describe('sendUnauthorizedMessage', () => {
  let consoleErrorSpy;
  let consoleLogSpy;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.useFakeTimers();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
    jest.useRealTimers();
  });

  it('should send the unauthorized message to the correct chat', async () => {
    const mockBot = {
      sendMessage: jest.fn().mockResolvedValue({ chat: { id: 123 }, message_id: 789 }),
      deleteMessage: jest.fn().mockResolvedValue()
    };
    const mockMsg = {
      chat: { id: 123 },
      message_id: 456
    };

    sendUnauthorizedMessage(mockBot, mockMsg);

    expect(mockBot.sendMessage).toHaveBeenCalledWith(123, `You aren't authorized to use this bot here.`, {
      reply_to_message_id: 456,
      parse_mode: 'HTML'
    });

    // Flush microtasks for bot.sendMessage resolution
    await Promise.resolve();
    // Flush timers for delay and deleteMsg
    jest.runAllTimers();
    // Flush microtasks for deleteMessage resolution
    await Promise.resolve();
  });
});

describe('deleteMsg', () => {
  let consoleLogSpy;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.useFakeTimers();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    jest.useRealTimers();
  });

  it('should catch error when bot.deleteMessage rejects', async () => {
    const mockBot = {
      deleteMessage: jest.fn().mockRejectedValue(new Error('test error'))
    };
    const mockMsg = {
      chat: { id: 123 },
      message_id: 456
    };

    await deleteMsg(mockBot, mockMsg);

    expect(mockBot.deleteMessage).toHaveBeenCalledWith(123, '456');

    expect(consoleLogSpy).toHaveBeenCalledWith('Failed to delete message. Does the bot have message delete permissions for this chat? test error');
  });
});

describe('editMessage', () => {
  let mockBot;

  beforeEach(() => {
    mockBot = {
      editMessageText: jest.fn().mockResolvedValue('edited')
    };
  });

  it('should call bot.editMessageText with correct parameters when all fields are present', async () => {
    const mockMsg = {
      chat: { id: 123 },
      message_id: 456
    };
    const text = 'new text';

    const result = await editMessage(mockBot, mockMsg, text);

    expect(mockBot.editMessageText).toHaveBeenCalledWith(text, {
      chat_id: 123,
      message_id: 456,
      parse_mode: 'HTML'
    });
    expect(result).toBe('edited');
  });

  it('should resolve immediately if msg is undefined', async () => {
    const result = await editMessage(mockBot, undefined, 'text');

    expect(mockBot.editMessageText).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('should resolve immediately if msg is null', async () => {
    const result = await editMessage(mockBot, null, 'text');

    expect(mockBot.editMessageText).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('should resolve immediately if msg.chat is missing', async () => {
    const mockMsg = {
      message_id: 456
    };

    const result = await editMessage(mockBot, mockMsg, 'text');

    expect(mockBot.editMessageText).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('should resolve immediately if msg.chat.id is missing', async () => {
    const mockMsg = {
      chat: {},
      message_id: 456
    };

    const result = await editMessage(mockBot, mockMsg, 'text');

    expect(mockBot.editMessageText).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('should resolve immediately if msg.message_id is missing', async () => {
    const mockMsg = {
      chat: { id: 123 }
    };

    const result = await editMessage(mockBot, mockMsg, 'text');

    expect(mockBot.editMessageText).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});

describe('sleep', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should resolve after the specified time', async () => {
    const sleepPromise = sleep(1000);

    // Create a mock function to track if the promise resolves
    const resolveTracker = jest.fn();
    sleepPromise.then(resolveTracker);

    // It should not be resolved before time passes
    await Promise.resolve(); // Flush microtasks
    expect(resolveTracker).not.toHaveBeenCalled();

    // Advance time but not enough
    jest.advanceTimersByTime(500);
    await Promise.resolve(); // Flush microtasks
    expect(resolveTracker).not.toHaveBeenCalled();

    // Advance the rest of the time
    jest.advanceTimersByTime(500);
    await Promise.resolve(); // Flush microtasks

    // Now it should be resolved
    expect(resolveTracker).toHaveBeenCalled();
  });

  it('should handle zero delay', async () => {
    const sleepPromise = sleep(0);

    const resolveTracker = jest.fn();
    sleepPromise.then(resolveTracker);

    // Advance time by 0
    jest.advanceTimersByTime(0);
    await Promise.resolve(); // Flush microtasks

    expect(resolveTracker).toHaveBeenCalled();
  });

  it('should handle negative delays like zero delay (setTimeout behavior)', async () => {
    const sleepPromise = sleep(-100);

    const resolveTracker = jest.fn();
    sleepPromise.then(resolveTracker);

    // Advance time by 0
    jest.advanceTimersByTime(0);
    await Promise.resolve(); // Flush microtasks

    expect(resolveTracker).toHaveBeenCalled();
  });
});
