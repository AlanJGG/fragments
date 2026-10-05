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
});
