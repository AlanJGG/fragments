const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id/metadata', () => {
  // Unauthenticated requests should be denied
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/123/metadata').expect(401));

  // A fragment that does not exist should return 404
  test('non-existing fragments return 404', () =>
    request(app)
      .get('/v1/fragments/123/metadata')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .expect(404));

  // Authenticated users can retrieve fragment metadata
  test('authenticated users can retrieve fragment metadata', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'text/plain')
      .send('Hello World');

    expect(postRes.statusCode).toBe(201);

    const id = postRes.body.fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${id}/metadata`)
      .auth('test-user1@fragments-testing.com', 'test-password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.status).toBe('ok');
    expect(getRes.body.fragment.id).toBe(id);
    expect(getRes.body.fragment.type).toBe('text/plain');
    expect(getRes.body.fragment.size).toBe(11);
    expect(getRes.body.fragment.ownerId).toBeDefined();
    expect(getRes.body.fragment.created).toBeDefined();
    expect(getRes.body.fragment.updated).toBeDefined();
  });
});
