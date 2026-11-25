import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { createServer } from 'node:http';
import { createFeatureHubRouter } from '../src/api/featureHub';

test('stores a valid illustrative strategy and rejects unknown options', async (t) => {
  const app = express();
  app.use(express.json());
  const calls = [];
  const strategies = new Map();
  const store = {
    get(userId) { calls.push(['get', userId]); return strategies.get(userId) || null; },
    save(strategy) { calls.push(['save', strategy.userId]); strategies.set(strategy.userId, strategy); },
  };
  app.use(createFeatureHubRouter(store));
  const server = createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())));
  const address = server.address();
  const base = `http://127.0.0.1:${address.port}`;

  const put = await fetch(`${base}/investments/U-88/strategy`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ optionIds: ['cash-reserve', 'broad-market-fund'] }) });
  const saved = await put.json();
  assert.equal(put.status, 200);
  assert.deepEqual(saved.strategy.optionIds, ['cash-reserve', 'broad-market-fund']);
  assert.equal(saved.source, 'illustrative-demo');
  assert.deepEqual(calls, [['save', 'U-88']]);

  const get = await fetch(`${base}/investments/U-88/strategy`);
  assert.deepEqual((await get.json()).strategy.optionIds, ['cash-reserve', 'broad-market-fund']);
  assert.deepEqual(calls, [['save', 'U-88'], ['get', 'U-88']]);

  const invalid = await fetch(`${base}/investments/U-89/strategy`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ optionIds: ['not-a-real-option'] }) });
  assert.equal(invalid.status, 400);
  assert.deepEqual(calls, [['save', 'U-88'], ['get', 'U-88']]);
});

