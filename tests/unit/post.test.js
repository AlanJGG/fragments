// tests/unit/post.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  // Missing Authorization header should be denied
  test('unauthenticated requests are denied', () =>
    request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .send('Hello World')
      .expect(401));

  // Valid users can create a text fragment
  test('authenticated users can create a text fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'text/plain')
      .send('Hello World');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.type).toBe('text/plain');
    expect(res.body.fragment.size).toBe(11);
    expect(res.body.fragment.id).toBeDefined();
  });

  // Valid users can create a JSON fragment
  test('authenticated users can create a JSON fragment', async () => {
    const data = JSON.stringify({ message: 'Hello World' });

    const res = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'application/json')
      .send(data);

    expect(res.statusCode).toBe(201);
    expect(res.body.fragment.type).toBe('application/json');
    expect(res.body.fragment.size).toBe(Buffer.byteLength(data));
  });

  // Valid users can create a Markdown fragment
  test('authenticated users can create a Markdown fragment', async () => {
    const data = '# Hello World';

    const res = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'text/markdown')
      .send(data);

    expect(res.statusCode).toBe(201);
    expect(res.body.fragment.type).toBe('text/markdown');
    expect(res.body.fragment.size).toBe(Buffer.byteLength(data));
  });

  // Unsupported content types should be rejected
  test('unsupported content types are rejected', () =>
    request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'application/pdf')
      .send(JSON.stringify({ message: 'Hello World' }))
      .expect(415));

  // Created fragments should include a Location header
  test('created fragments include a Location header', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'text/plain')
      .send('Hello World');

    expect(res.statusCode).toBe(201);
    expect(res.headers.location).toContain(`/v1/fragments/${res.body.fragment.id}`);
  });
});
