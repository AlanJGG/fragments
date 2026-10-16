// tests/unit/auth.test.js

describe('Authentication Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();

    process.env = { ...originalEnv };

    delete process.env.AWS_COGNITO_POOL_ID;
    delete process.env.AWS_COGNITO_CLIENT_ID;
    delete process.env.HTPASSWD_FILE;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('uses AWS Cognito when configured', () => {
    process.env.AWS_COGNITO_POOL_ID = 'test-pool';
    process.env.AWS_COGNITO_CLIENT_ID = 'test-client';

    jest.doMock('../../src/auth/cognito', () => ({
      strategy: jest.fn(),
    }));

    const auth = require('../../src/auth');

    expect(auth.strategy).toBeDefined();
  });

  test('uses Basic Auth when configured', () => {
    process.env.HTPASSWD_FILE = 'test.htpasswd';
    process.env.NODE_ENV = 'test';

    jest.doMock('../../src/auth/basic-auth', () => ({
      strategy: jest.fn(),
    }));

    const auth = require('../../src/auth');

    expect(auth.strategy).toBeDefined();
  });

  test('throws an error when both authentication methods are configured', () => {
    process.env.AWS_COGNITO_POOL_ID = 'test-pool';
    process.env.AWS_COGNITO_CLIENT_ID = 'test-client';
    process.env.HTPASSWD_FILE = 'test.htpasswd';

    expect(() => require('../../src/auth')).toThrow('Only one is allowed.');
  });

  test('throws an error when no authentication method is configured', () => {
    expect(() => require('../../src/auth')).toThrow('no authorization configuration found');
  });
  test('Basic Auth requires HTPASSWD_FILE', () => {
    delete process.env.HTPASSWD_FILE;

    jest.dontMock('../../src/auth/basic-auth');
    jest.resetModules();

    expect(() => require('../../src/auth/basic-auth')).toThrow(
      'missing expected env var: HTPASSWD_FILE'
    );
  });
});
