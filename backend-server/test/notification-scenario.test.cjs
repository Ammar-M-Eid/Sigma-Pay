const { test } = require('node:test');
const assert = require('node:assert/strict');
const { NotificationServiceBL } = require('../dist/services/services');

test('sends an alert through the repository with an unread fixture', () => {
  const saved = [];
  const calls = [];
  const repository = { save(item) { calls.push(['save', item.userId]); saved.push(item); return item.notificationId; }, findByUserId(id) { calls.push(['findByUserId', id]); return saved.filter((item) => item.userId === id); }, findById() { return null; } };
  const service = new NotificationServiceBL(repository);
  assert.equal(service.sendAlert('U-12', 'Budget reached 80 percent'), true);
  assert.deepEqual(calls, [['save', 'U-12']]);
  assert.equal(saved[0].type, 'alert');
  assert.match(saved[0].notificationId, /^[0-9a-f-]{36}$/i);
  assert.equal(saved[0].read, false);
  assert.equal(saved[0].message, 'Budget reached 80 percent');
  assert.equal(service.getNotifications('U-12')[0], saved[0]);
  assert.deepEqual(calls[1], ['findByUserId', 'U-12']);
});
