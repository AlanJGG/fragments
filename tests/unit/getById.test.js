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

  // Markdown fragments can be retrieved as Markdown
  test('Markdown fragments can be retrieved as Markdown', async () => {
    const created = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'text/markdown')
      .send('# Hello World');

    const res = await request(app)
      .get(`/v1/fragments/${created.body.fragment.id}`)
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Accept', 'text/markdown');

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/markdown');
    expect(res.text).toBe('# Hello World');
  });

  // Markdown fragments can be converted to HTML
  test('Markdown fragments can be converted to HTML', async () => {
    const created = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'text/markdown')
      .send('# Hello World');

    const res = await request(app)
      .get(`/v1/fragments/${created.body.fragment.id}`)
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Accept', 'text/html');

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
    expect(res.text).toContain('<h1>Hello World</h1>');
  });

  // Unsupported conversions return 406
  test('unsupported conversions return 406', async () => {
    const created = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'text/markdown')
      .send('# Hello World');

    await request(app)
      .get(`/v1/fragments/${created.body.fragment.id}`)
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Accept', 'application/pdf')
      .expect(406);
  });
});
