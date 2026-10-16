// tests/unit/app.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('App', () => {
  test('unknown route returns HTTP 404', async () => {
    const res = await request(app).get('/this-route-does-not-exist');

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({
      status: 'error',
      error: {
        message: 'not found',
        code: 404,
      },
    });
  });

  // Get the error-handling middleware registered in app.js
  const errorHandler = app.router.stack.filter((layer) => layer.handle.length === 4).at(-1).handle;

  test('handles errors with a custom status and message', () => {
    const error = new Error('bad request');
    error.status = 400;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    errorHandler(error, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      error: {
        code: 400,
        message: 'bad request',
      },
    });
  });

  test('handles errors without a status', () => {
    const error = new Error('server error');

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    errorHandler(error, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      error: {
        code: 500,
        message: 'server error',
      },
    });
  });

  test('handles errors without a message', () => {
    const error = new Error();
    error.status = 400;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    errorHandler(error, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      error: {
        code: 400,
        message: 'unable to process request',
      },
    });
  });
});
