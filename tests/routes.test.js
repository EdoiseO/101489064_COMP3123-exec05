const assert = require('node:assert/strict');
const { test, before, after } = require('node:test');
const app = require('../index');
const user = require('../user.json');

let server;
let baseUrl;
before(async () => {
  server = await new Promise((resolve) => {
    const listener = app.listen(0, '127.0.0.1', () => resolve(listener));
  });
  baseUrl = 'http://127.0.0.1:' + server.address().port;
});
after(async () => {
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
});

async function login(body) {
  return fetch(baseUrl + '/api/v1/user/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

test('GET /home serves the welcome heading and login form', async () => {
  const response = await fetch(baseUrl + '/home');
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /text\/html/);
  const html = await response.text();
  assert.match(html, /<h1>Welcome to ExpressJs Tutorial<\/h1>/);
  assert.match(html, /action="\/api\/v1\/user\/login"/);
});

test('GET /profile returns the complete provided user.json', async () => {
  const response = await fetch(baseUrl + '/api/v1/user/profile');
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), user);
});

test('valid credentials produce the specified response', async () => {
  const response = await login({ username: user.username, password: user.password });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: true, message: 'User Is valid' });
});

test('invalid username produces the specified response', async () => {
  const response = await login({ username: 'wrong', password: user.password });
  assert.deepEqual(await response.json(), { status: false, message: 'User Name is invalid' });
});

test('invalid password produces the specified response', async () => {
  const response = await login({ username: user.username, password: 'wrong' });
  assert.deepEqual(await response.json(), { status: false, message: 'Password is invalid' });
});

test('missing body does not crash the server', async () => {
  const response = await fetch(baseUrl + '/api/v1/user/login', { method: 'POST' });
  assert.deepEqual(await response.json(), { status: false, message: 'User Name is invalid' });
});

test('logout supports username as a query parameter', async () => {
  const response = await fetch(baseUrl + '/api/v1/user/logout?username=bret');
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /text\/html/);
  assert.equal(await response.text(), '<b>bret successfully logged out.</b>');
});

test('logout supports username as a path parameter', async () => {
  const response = await fetch(baseUrl + '/api/v1/user/logout/bret');
  assert.equal(await response.text(), '<b>bret successfully logged out.</b>');
});

test('logout requires a username', async () => {
  const response = await fetch(baseUrl + '/api/v1/user/logout');
  assert.equal(response.status, 400);
  assert.equal(await response.text(), 'Username is required');
});

test('logout escapes user-supplied HTML', async () => {
  const response = await fetch(baseUrl + '/api/v1/user/logout?username=' + encodeURIComponent('<script>test</script>'));
  assert.equal(await response.text(), '<b>&lt;script&gt;test&lt;/script&gt; successfully logged out.</b>');
});

test('invalid JSON reaches the required 500 error middleware', async () => {
  const response = await fetch(baseUrl + '/api/v1/user/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{'
  });
  assert.equal(response.status, 500);
  assert.equal(await response.text(), 'Server Error');
});

test('unmatched routes return 404', async () => {
  const response = await fetch(baseUrl + '/not-a-route');
  assert.equal(response.status, 404);
});
