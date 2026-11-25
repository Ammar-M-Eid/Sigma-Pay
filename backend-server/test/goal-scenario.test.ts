import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GoalService } from '../src/services/services';

test('contribution completes the goal fixture and verifies repository messages', () => {
  const goal = { goalId: 'G-23', userId: 'U-7', goalType: 'Emergency fund', targetAmount: { amount: 5000, currency: { code: 'EGP', symbol: 'E£', exchangeRate: 1 } }, currentAmount: { amount: 4500, currency: { code: 'EGP', symbol: 'E£', exchangeRate: 1 } }, deadline: '2026-12-31', priorityLevel: 'High', state: 'Active' };
  const calls = [];
  const repository = { findById(id) { calls.push(['findById', id]); return id === goal.goalId ? goal : null; }, save(value) { calls.push(['save', value.goalId, value.state]); return value.goalId; }, findByUserId() { return [goal]; } };
  const service = new GoalService(repository);
  service.contributeToGoal('G-23', 500);
  assert.equal(goal.currentAmount.amount, 5000);
  assert.equal(goal.state, 'Completed');
  assert.deepEqual(calls, [['findById', 'G-23'], ['save', 'G-23', 'Completed']]);
  calls.length = 0;
  service.contributeToGoal('missing', 500);
  assert.deepEqual(calls, [['findById', 'missing']]);
});

