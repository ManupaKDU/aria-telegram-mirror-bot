jest.mock('@src/.constants', () => ({}), { virtual: true });
jest.mock('node-telegram-bot-api');
jest.mock('@src/download_tools/aria-tools', () => ({}), { virtual: true });
jest.mock('@src/dl_model/dl-manager', () => ({
  DlManager: {
    getInstance: jest.fn(() => ({}))
  }
}), { virtual: true });

const { sleep } = require('@src/bot_utils/msg-tools');

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
