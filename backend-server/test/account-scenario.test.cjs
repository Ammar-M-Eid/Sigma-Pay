const { test } = require('node:test');
const assert = require('node:assert/strict');
const { AccountService } = require('../dist/services/services');

test('looks up the account fixture and verifies the repository message', () => {
  const account = { accountId: 'A-204', userId: 'U-7', balance: { amount: 7500, currency: { code: 'EGP', symbol: 'E£', exchangeRate: 1 } } };
  const calls = [];
  const accounts = { findById(id) { calls.push(['findById', id]); return id === account.accountId ? account : null; }, save(value) { calls.push(['save', value.accountId]); return value.accountId; }, deleteByUserId() { return true; } };
  const users = { findById() { return null; }, findByEmail() { return null; }, findByUsername() { return null; }, findByPhone() { return null; }, save(value) { return value.userId; }, delete() { return true; } };
  const service = new AccountService(accounts, users);
  assert.equal(service.getAccount('A-204'), account);
  assert.equal(service.getAccount('missing'), null);
  assert.deepEqual(calls, [['findById', 'A-204'], ['findById', 'missing']]);
});
