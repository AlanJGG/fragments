// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');
const hash = require('../../src/hash');

describe('GET /v1/fragments', () => {
  // Missing Authorization header should be denied
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // Invalid username/password should also be denied
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Valid test user should be allowed
  test('authenticated users get a fragments array', async () => {
    const res = await request(app)
      .get('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  test('users without fragments get an empty array', async () => {
    const res = await request(app)
      .get('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1');

    expect(res.statusCode).toBe(200);
    expect(res.body.fragments).toEqual([]);
  });

  test('authenticated users can get their fragment IDs', async () => {
    const ownerId = hash('test-user1@fragments-testing.com');

    const fragment = new Fragment({
      ownerId,
      type: 'text/plain',
    });

    await fragment.save();

    const res = await request(app)
      .get('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1');

    expect(res.statusCode).toBe(200);
    expect(res.body.fragments).toContain(fragment.id);
  });
});
