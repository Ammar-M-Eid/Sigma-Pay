const { test } = require('node:test');
const assert = require('node:assert/strict');
const { PaymentsServiceBL } = require('../dist/services/services');

function fixture() {
  const payments = new Map();
  const calls = [];
  const repository = {
    save(payment) { calls.push(['save', payment.paymentId]); payments.set(payment.paymentId, payment); return payment.paymentId; },
    findById(id) { calls.push(['findById', id]); return payments.get(id) || null; },
    findByUserId(userId) { return [...payments.values()].filter((payment) => payment.userId === userId); },
  };
  return { service: new PaymentsServiceBL(repository), payments, calls };
}

function payment(id, state = 'Pending') {
  return {
    paymentId: id,
    userId: 'user-1',
    amount: { amount: 500, currency: { code: 'EGP', symbol: 'E£', exchangeRate: 1 } },
    methodId: 'method-1',
    state,
    timestamp: '2026-11-25T10:00:00.000Z',
  };
}

test('allows Pending to Completed to Refunded and rejects repeated processing and refund', () => {
  const { service, payments, calls } = fixture();
  const current = payment('p-1');
  payments.set(current.paymentId, current);

  assert.equal(service.processPayment(current).success, true);
  assert.equal(current.state, 'Completed');
  assert.equal(service.processPayment(current).success, false);
  assert.deepEqual(service.refundPayment('p-1'), { success: true, message: 'Refund processed' });
  assert.equal(current.state, 'Refunded');
  assert.equal(service.refundPayment('p-1').success, false);
  assert.deepEqual(calls, [['save', 'p-1'], ['findById', 'p-1'], ['save', 'p-1'], ['findById', 'p-1']]);
});

test('allows Pending to Scheduled to Cancelled and rejects invalid repeats', () => {
  const { service, payments, calls } = fixture();
  const current = payment('p-2');
  payments.set(current.paymentId, current);

  assert.equal(service.scheduleRecurringPayment(current, { frequency: 'monthly', nextRunAt: '2026-12-01' }), 'p-2');
  assert.equal(current.state, 'Scheduled');
  assert.equal(service.scheduleRecurringPayment(current, { frequency: 'monthly', nextRunAt: '2026-12-01' }), null);
  assert.equal(service.processPayment(current).success, false);
  assert.equal(service.cancelPayment('p-2'), true);
  assert.equal(current.state, 'Cancelled');
  assert.equal(service.cancelPayment('p-2'), false);
  assert.equal(service.refundPayment('p-2').success, false);
  assert.deepEqual(calls, [['save', 'p-2'], ['findById', 'p-2'], ['save', 'p-2'], ['findById', 'p-2'], ['findById', 'p-2']]);
});

test('does not transition or persist a missing payment', () => {
  const { service, calls } = fixture();
  assert.equal(service.cancelPayment('missing'), false);
  assert.deepEqual(service.refundPayment('missing'), { success: false, message: 'Payment not found' });
  assert.deepEqual(calls, [['findById', 'missing'], ['findById', 'missing']]);
});

test('rejects every payment operation that is invalid for each modeled state', () => {
  const states = ['Pending', 'Scheduled', 'Completed', 'Cancelled', 'Refunded'];
  const operations = [
    { name: 'process', allowedFrom: 'Pending', run: (service, current) => service.processPayment(current) },
    { name: 'schedule', allowedFrom: 'Pending', run: (service, current) => service.scheduleRecurringPayment(current, { frequency: 'monthly', nextRunAt: '2026-12-01' }) },
    { name: 'cancel', allowedFrom: 'Scheduled', run: (service, current) => service.cancelPayment(current.paymentId) },
    { name: 'refund', allowedFrom: 'Completed', run: (service, current) => service.refundPayment(current.paymentId) },
  ];

  for (const state of states) {
    for (const operation of operations) {
      if (state === operation.allowedFrom) continue;
      const { service, payments, calls } = fixture();
      const current = payment(`${operation.name}-${state}`, state);
      payments.set(current.paymentId, current);
      const result = operation.run(service, current);

      if (operation.name === 'process') assert.equal(result.success, false, `${state} must not process`);
      if (operation.name === 'schedule') assert.equal(result, null, `${state} must not schedule`);
      if (operation.name === 'cancel') assert.equal(result, false, `${state} must not cancel`);
      if (operation.name === 'refund') assert.equal(result.success, false, `${state} must not refund`);
      assert.equal(current.state, state, `${operation.name} must preserve ${state}`);
      assert.equal(calls.some(([method]) => method === 'save'), false, `${operation.name} must not persist invalid ${state}`);
    }
  }
});
