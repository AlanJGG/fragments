// tests/unit/auth-middleware.test.js

const passport = require('passport');
const authorize = require('../../src/auth/auth-middleware');

describe('Authentication Middleware', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns an error when authentication fails', () => {
    const error = new Error('Authentication failed');

    jest.spyOn(passport, 'authenticate').mockImplementation((strategy, options, callback) => {
      return () => callback(error, null);
    });

    const req = {};
    const res = {};
    const next = jest.fn();

    const middleware = authorize('bearer');

    middleware(req, res, next);

    expect(passport.authenticate).toHaveBeenCalledWith(
      'bearer',
      { session: false },
      expect.any(Function)
    );

    expect(next).toHaveBeenCalledWith({
      status: 'error',
      error: {
        code: 500,
        message: 'Unable to authenticate user',
      },
    });
  });
});
