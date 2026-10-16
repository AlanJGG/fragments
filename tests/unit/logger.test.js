// tests/unit/logger.test.js

describe('Logger', () => {
  const originalLevel = process.env.FRAGMENTS_LOG_LEVEL;

  afterEach(() => {
    jest.resetModules();

    if (originalLevel === undefined) {
      delete process.env.FRAGMENTS_LOG_LEVEL;
    } else {
      process.env.FRAGMENTS_LOG_LEVEL = originalLevel;
    }
  });

  test('uses info as the default log level', () => {
    delete process.env.FRAGMENTS_LOG_LEVEL;

    jest.isolateModules(() => {
      const logger = require('../../src/logger');

      expect(logger.level).toBe('info');
    });
  });

  test('uses the log level from the environment', () => {
    process.env.FRAGMENTS_LOG_LEVEL = 'silent';

    jest.isolateModules(() => {
      const logger = require('../../src/logger');

      expect(logger.level).toBe('silent');
    });
  });

  test('uses pino-pretty when debug is enabled', () => {
    process.env.FRAGMENTS_LOG_LEVEL = 'debug';

    const mockPino = jest.fn(() => ({ level: 'debug' }));

    jest.isolateModules(() => {
      jest.doMock('pino', () => mockPino);

      require('../../src/logger');
    });

    expect(mockPino).toHaveBeenCalledWith({
      level: 'debug',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    });

    jest.dontMock('pino');
  });
});
