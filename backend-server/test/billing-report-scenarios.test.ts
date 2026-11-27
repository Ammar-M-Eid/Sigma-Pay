import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BillService, LoginActivityService, ReportingService } from '../src/services/services';
import { BillRepositoryImpl, LoginActivityRepositoryImpl, TransactionRepositoryImpl } from '../src/data/repositories';
import { IBill, ILoginActivity, ITransaction } from '../src/domain/entities';

const currency = { code: 'USD', symbol: '$', exchangeRate: 1 };

function bill(overrides: Partial<IBill> = {}): IBill {
  return { billId: 'B-1', userId: 'U-1', provider: 'Utilities', accountRef: 'REF-1', amount: { amount: 85, currency }, dueAt: '2026-12-10', recurring: false, status: 'Scheduled', ...overrides };
}

function transaction(transactionId: string, userId: string, category: string, amount: number, date: string): ITransaction {
  return { transactionId, userId, category, amount: { amount, currency }, date, paymentMethod: 'card' };
}

test('TC-BILL-001 creates a bill as Scheduled and retrieves it for its owner', () => {
  const repository = new BillRepositoryImpl();
  const service = new BillService(repository);
  const item = bill({ status: 'Paid' });

  assert.equal(service.createBill(item), 'B-1');
  assert.equal(item.status, 'Scheduled');
  assert.deepEqual(service.getBillsByUserId('U-1'), [item]);
  assert.deepEqual(service.getBillsByUserId('U-2'), []);
});

test('TC-BILL-002 marks a scheduled bill paid once and records its timestamp', () => {
  const repository = new BillRepositoryImpl();
  const service = new BillService(repository);
  const item = bill();
  repository.save(item);

  const paid = service.payBill('B-1', 'U-1');
  assert.equal(paid, item);
  assert.equal(item.status, 'Paid');
  assert.ok(item.paidAt && !Number.isNaN(Date.parse(item.paidAt)));
  assert.equal(service.payBill('B-1', 'U-1'), null);
});

test('TC-BILL-003 rejects a missing bill and a bill owned by another user', () => {
  const repository = new BillRepositoryImpl();
  const service = new BillService(repository);
  repository.save(bill());

  assert.equal(service.payBill('missing', 'U-1'), null);
  assert.equal(service.payBill('B-1', 'U-2'), null);
  assert.equal(repository.findById('B-1')?.status, 'Scheduled');
});

test('TC-REPORT-001 builds a date-filtered monthly summary from one user transactions', () => {
  const repository = new TransactionRepositoryImpl();
  const service = new ReportingService(repository);
  repository.save(transaction('T-1', 'U-1', 'Income', 1000, '2026-11-05T12:00:00.000Z'));
  repository.save(transaction('T-2', 'U-1', 'Food', 120, '2026-11-10T12:00:00.000Z'));
  repository.save(transaction('T-3', 'U-1', 'Food', 30, '2026-12-01T12:00:00.000Z'));
  repository.save(transaction('T-4', 'U-2', 'Travel', 999, '2026-11-12T12:00:00.000Z'));

  const report = service.generateReport({ userId: 'U-1', startDate: '2026-11-01', endDate: '2026-11-30' }, 'monthly');
  assert.ok(report);
  assert.match(report.content, /Expense transactions: 1/);
  assert.match(report.content, /Income transactions: 1/);
  assert.match(report.content, /Total spent: \$120\.00/);
  assert.match(report.content, /Income recorded: \$1000\.00/);
});

test('TC-REPORT-002 groups spending by category and calculates income statement totals', () => {
  const repository = new TransactionRepositoryImpl();
  const service = new ReportingService(repository);
  repository.save(transaction('T-1', 'U-1', 'Income', 1000, '2026-11-05T12:00:00.000Z'));
  repository.save(transaction('T-2', 'U-1', 'Food', 120, '2026-11-10T12:00:00.000Z'));
  repository.save(transaction('T-3', 'U-1', 'Food', 30, '2026-11-11T12:00:00.000Z'));
  repository.save(transaction('T-4', 'U-1', 'Rent', 400, '2026-11-12T12:00:00.000Z'));

  const spending = service.generateReport({ userId: 'U-1' }, 'spending');
  assert.ok(spending);
  assert.match(spending.content, /Food: \$150\.00/);
  assert.match(spending.content, /Rent: \$400\.00/);
  assert.equal(service.generateIncomeStatement('U-1'), 'Income Statement for User U-1\nTotal Income: $1000\nTotal Expenses: $550\nNet: $450');
  assert.equal(service.generateMonthlySummary('U-1'), 'Monthly Summary for User U-1\nExpense Transactions: 3\nTotal Spent: $550');
});

test('TC-REPORT-003 rejects unsupported report types, missing account ids, and invalid date ranges', () => {
  const service = new ReportingService(new TransactionRepositoryImpl());
  assert.equal(service.generateReport({ userId: 'U-1' }, 'quarterly'), null);
  assert.equal(service.generateReport({}, 'monthly'), null);
  assert.equal(service.generateReport({ userId: 'U-1', startDate: 'not-a-date' }, 'monthly'), null);
  assert.equal(service.generateReport({ userId: 'U-1', startDate: '2026-12-01', endDate: '2026-11-01' }, 'monthly'), null);
});

test('TC-REPORT-004 exports the generated report as a valid PDF Buffer', () => {
  const service = new ReportingService(new TransactionRepositoryImpl());
  const report = service.generateReport({ userId: 'U-1' }, 'monthly');
  assert.ok(report);
  const pdf = service.exportToPDF(report);
  assert.ok(Buffer.isBuffer(pdf));
  assert.ok(pdf.toString('ascii').startsWith('%PDF-1.4\n'));
  assert.ok(pdf.toString('ascii').endsWith('%%EOF\n'));
});

test('TC-AUTH-001 stores login activity and returns history for only the requested user', () => {
  const repository = new LoginActivityRepositoryImpl();
  const service = new LoginActivityService(repository);
  const first: ILoginActivity = { activityId: 'L-1', userId: 'U-1', email: 'one@example.com', at: '2026-11-01T10:00:00.000Z', device: 'browser', ip: '127.0.0.1', status: 'Success' };
  const second: ILoginActivity = { ...first, activityId: 'L-2', status: 'Failed' };
  const other: ILoginActivity = { ...first, activityId: 'L-3', userId: 'U-2' };

  service.record(first);
  service.record(second);
  service.record(other);
  assert.deepEqual(service.getByUserId('U-1'), [second, first]);
  assert.deepEqual(service.getByUserId('U-2'), [other]);
  assert.deepEqual(service.getByUserId('unknown'), []);
});
