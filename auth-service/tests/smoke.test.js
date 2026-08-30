import test from 'node:test';
import assert from 'node:assert/strict';
import net from 'node:net';
import env from '../src/config/env.js';
import { startServer } from '../src/server.js';

test('environment config exposes defaults for local startup', () => {
  assert.ok(env.port);
  assert.match(env.databaseUrl, /postgresql:/);
  assert.ok(env.jwtSecret);
});

test('startServer falls back to the next available port when requested port is busy', async () => {
  const blocker = net.createServer();
  await new Promise((resolve) => blocker.listen(0, '127.0.0.1', resolve));
  const address = blocker.address();

  const server = await startServer(address.port, '127.0.0.1', 2);
  assert.equal(server.address().port, address.port + 1);

  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  await new Promise((resolve, reject) => blocker.close((error) => (error ? reject(error) : resolve())));
});
