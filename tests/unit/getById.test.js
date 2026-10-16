// tests/unit/getById.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  // Unauthenticated requests should be denied
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/123').expect(401));

  // A fragment that does not exist should return 404
  test('non-existing fragments return 404', () =>
    request(app)
      .get('/v1/fragments/123')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .expect(404));

  // Authenticated users can retrieve their fragments
  test('authenticated users can retrieve a fragment', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'text/plain')
      .send('Hello World');

    expect(postRes.statusCode).toBe(201);

    const id = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth('test-user1@fragments-testing.com', 'test-password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.text).toBe('Hello World');
    expect(getRes.headers['content-type']).toContain('text/plain');
  });
});
