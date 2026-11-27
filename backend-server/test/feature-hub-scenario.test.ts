import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { createServer } from 'node:http';
import { createFeatureHubRouter } from '../src/api/featureHub';

test('TC-INVEST-001 stores an allowed investment strategy and rejects unknown options', async (t) => {
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

test('TC-LEARN-001 grades quiz answers and recommends resources for missed topics only to that learner', async (t) => {
  const app = express();
  app.use(express.json());
  app.use(createFeatureHubRouter());
  const server = createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())));
  const address = server.address();
  const base = `http://127.0.0.1:${address.port}`;

  const resourcesResponse = await fetch(`${base}/learning/resources`);
  const resources = await resourcesResponse.json();
  assert.equal(resources.success, true);
  assert.ok(resources.resources.length >= 3);

  const invalid = await fetch(`${base}/learning/quiz/submit`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ userId: 'U-LEARN-1', answers: [0] }) });
  assert.equal(invalid.status, 400);

  const submitted = await fetch(`${base}/learning/quiz/submit`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ userId: 'U-LEARN-1', answers: [1, 0, 1] }) });
  const result = await submitted.json();
  assert.equal(result.result.score, 1);
  assert.equal(result.feedback.length, 3);

  const recommendationsResponse = await fetch(`${base}/learning/U-LEARN-1/recommendations`);
  const recommendations = await recommendationsResponse.json();
  assert.equal(recommendations.personalized, true);
  assert.deepEqual(recommendations.resources.map((resource) => resource.id), ['budget-basics', 'compound-growth']);
  const otherLearner = await fetch(`${base}/learning/U-LEARN-2/recommendations`);
  assert.equal((await otherLearner.json()).personalized, false);
});

