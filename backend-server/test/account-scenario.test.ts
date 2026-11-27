import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AccountService } from '../src/services/services';

test('TC-ACCOUNT-001 looks up an account and returns null when it is missing', () => {
  const account = { accountId: 'A-204', userId: 'U-7', balance: { amount: 7500, currency: { code: 'EGP', symbol: 'E£', exchangeRate: 1 } } };
  const calls = [];
  const accounts = { findById(id) { calls.push(['findById', id]); return id === account.accountId ? account : null; }, save(value) { calls.push(['save', value.accountId]); return value.accountId; }, deleteByUserId() { return true; } };
  const users = { findById() { return null; }, findByEmail() { return null; }, findByUsername() { return null; }, findByPhone() { return null; }, save(value) { return value.userId; }, delete() { return true; } };
  const service = new AccountService(accounts, users);
  assert.equal(service.getAccount('A-204'), account);
  assert.equal(service.getAccount('missing'), null);
  assert.deepEqual(calls, [['findById', 'A-204'], ['findById', 'missing']]);
});

test('TC-ACCOUNT-002 creates, updates, and deletes account records through their repositories', () => {
  const account = { accountId: 'A-204', userId: 'U-7', balance: { amount: 7500, currency: { code: 'EGP', symbol: 'E£', exchangeRate: 1 } } };
  const savedUsers = new Map();
  const calls = [];
  const accounts = {
    findById(id) { return id === account.accountId ? account : null; },
    save(value) { calls.push(['saveAccount', value.accountId]); return value.accountId; },
    deleteByUserId(id) { calls.push(['deleteAccount', id]); return true; },
  };
  const users = {
    findById(id) { return savedUsers.get(id) ?? null; }, findByEmail() { return null; }, findByUsername() { return null; }, findByPhone() { return null; },
    save(value) { calls.push(['saveUser', value.userId]); savedUsers.set(value.userId, value); return value.userId; },
    delete(id) { calls.push(['deleteUser', id]); return savedUsers.delete(id); },
  };
  const service = new AccountService(accounts, users);
  const user = { userId: 'U-7', credentials: { username: 'ammar', passwordHash: 'hashed' }, profile: { email: 'a@example.com', phone: '201000000000' }, securitySettings: { twoFactorEnabled: false, accountStatus: 'Active' } };

  assert.equal(service.createAccount(account), 'A-204');
  service.updateAccount(account);
  assert.equal(service.saveUser(user), 'U-7');
  assert.equal(service.getUserAccount('U-7'), user);
  service.deleteAccount('U-7');
  assert.deepEqual(calls, [['saveAccount', 'A-204'], ['saveAccount', 'A-204'], ['saveUser', 'U-7'], ['deleteAccount', 'U-7'], ['deleteUser', 'U-7']]);
  assert.equal(service.getUserAccount('U-7'), null);
});

