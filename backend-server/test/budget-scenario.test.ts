import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BudgetService } from '../src/services/services';

test('records a budgeted expense in order and updates the object snapshot', () => {
  const budget = { budgetId: 'B-11', userId: 'U-7', totalAmount: { amount: 3000, currency: { code: 'EGP', symbol: 'E£', exchangeRate: 1 } }, startDate: '2026-11-01', endDate: '2026-11-30', categories: ['Food'], spent: 1200 };
  const calls = [];
  const budgets = { findByUserId(id) { calls.push(['findByUserId', id]); return [budget]; }, save(value) { calls.push(['saveBudget', value.budgetId, value.spent]); return value.budgetId; }, findById() { return budget; } };
  const transactions = { save(value) { calls.push(['saveTransaction', value.userId, value.category, value.amount.amount]); return value.transactionId; }, findByUserId() { return []; }, findById() { return null; } };
  const service = new BudgetService(budgets, transactions);
  assert.equal(service.recordExpense('U-7', 300, 'Food'), true);
  assert.equal(budget.spent, 1500);
  assert.deepEqual(calls.map(([name]) => name), ['findByUserId', 'saveBudget', 'saveTransaction']);
  assert.deepEqual(calls[1], ['saveBudget', 'B-11', 1500]);
  calls.length = 0;
  assert.equal(service.recordExpense('U-7', -1, 'Food'), false);
  assert.deepEqual(calls, []);
});

