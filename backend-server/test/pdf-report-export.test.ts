import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { createServer } from 'node:http';
import { Controller, createApiRouter } from '../src/api/controller';
import {
  AccountService, BillService, BudgetService, GoalService, GroupSavingsService,
  LoginActivityService, NotificationServiceBL, PaymentsServiceBL, ReportingService,
} from '../src/services/services';
import {
  AccountsRepositoryImpl, BillRepositoryImpl, BudgetRepositoryImpl, GoalRepositoryImpl,
  GroupSavingsRepositoryImpl, LoginActivityRepositoryImpl, NotificationRepositoryImpl,
  PaymentRepositoryImpl, TransactionRepositoryImpl, UserRepositoryImpl,
} from '../src/data/repositories';
import { IReport } from '../src/domain/entities';

function report(content: string): IReport {
  return { reportId: 'R-1', userId: 'U-1', reportType: 'monthly', generatedAt: '2026-11-27T08:00:00.000Z', content };
}

function assertValidPdf(pdf: Buffer) {
  const source = pdf.toString('ascii');
  assert.ok(source.startsWith('%PDF-1.4\n'));
  assert.ok(source.endsWith('%%EOF\n'));
  const xrefMatch = source.match(/startxref\n(\d+)\n%%EOF/);
  assert.ok(xrefMatch);
  const xrefOffset = Number(xrefMatch[1]);
  assert.equal(source.slice(xrefOffset, xrefOffset + 5), 'xref\n');
  const xref = source.slice(xrefOffset).split('\n');
  const [, objectCountLine, ...offsetLines] = xref;
  const objectCount = Number(objectCountLine.split(' ')[1]);
  assert.equal(offsetLines.filter((line) => /^\d{10} 00000 n $/.test(line)).length, objectCount - 1);
  for (let objectIndex = 1; objectIndex < objectCount; objectIndex += 1) {
    const offset = Number(offsetLines[objectIndex].slice(0, 10));
    assert.ok(source.startsWith(`${objectIndex} 0 obj\n`, offset), `object ${objectIndex} has a valid cross-reference offset`);
  }
  return source;
}

function buildController(transactions: TransactionRepositoryImpl) {
  return new Controller(
    new AccountService(new AccountsRepositoryImpl(), new UserRepositoryImpl()),
    new BudgetService(new BudgetRepositoryImpl(), transactions),
    new GoalService(new GoalRepositoryImpl()),
    new GroupSavingsService(new GroupSavingsRepositoryImpl()),
    new PaymentsServiceBL(new PaymentRepositoryImpl()),
    new ReportingService(transactions),
    new NotificationServiceBL(new NotificationRepositoryImpl()),
    new LoginActivityService(new LoginActivityRepositoryImpl()),
    new BillService(new BillRepositoryImpl()),
  );
}

test('TC-REPORT-005 generates a valid single-page PDF and escapes report text safely', () => {
  const service = new ReportingService(new TransactionRepositoryImpl());
  const pdf = service.exportToPDF(report('Activity (November)\\West\nTotal: $120.00\nCafé — paid'));
  const source = assertValidPdf(pdf);

  assert.match(source, /\/Type \/Catalog/);
  assert.match(source, /\/MediaBox \[0 0 595 842\]/);
  assert.ok(source.includes('(Activity \\(November\\)\\\\West) Tj'));
  assert.match(source, /\(Cafe - paid\) Tj/);
  assert.match(source, /Page 1 of 1/);
});

test('TC-REPORT-006 wraps long content into valid pages with a correct page tree', () => {
  const service = new ReportingService(new TransactionRepositoryImpl());
  const pdf = service.exportToPDF(report(Array.from({ length: 160 }, (_, index) => `Transaction ${index + 1}: ${'Long category and description '.repeat(4)}$${index}.00`).join('\n')));
  const source = assertValidPdf(pdf);
  const pageCount = Number(source.match(/\/Type \/Pages \/Kids \[[^\]]*\] \/Count (\d+)/)?.[1]);

  assert.ok(pageCount > 1);
  assert.match(source, new RegExp(`Page ${pageCount} of ${pageCount}`));
});

test('TC-REPORT-007 serves a downloadable PDF and rejects an invalid date range', async (t) => {
  const transactions = new TransactionRepositoryImpl();
  transactions.save({ transactionId: 'T-1', userId: 'U-1', category: 'Food', amount: { amount: 20, currency: { code: 'USD', symbol: '$', exchangeRate: 1 } }, date: '2026-11-05T12:00:00.000Z', paymentMethod: 'card' });
  const app = express();
  app.use(express.json());
  app.use(createApiRouter(buildController(transactions)));
  const server = createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())));
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  const baseUrl = `http://127.0.0.1:${address.port}`;

  const response = await fetch(`${baseUrl}/reports/U-1/export/pdf?type=spending&startDate=2026-11-01&endDate=2026-11-30`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type') ?? '', /application\/pdf/);
  assert.match(response.headers.get('content-disposition') ?? '', /filename=sigmapay-spending-report\.pdf/);
  const pdf = Buffer.from(await response.arrayBuffer());
  assert.match(assertValidPdf(pdf), /Food: \$20\.00/);

  const invalid = await fetch(`${baseUrl}/reports/U-1/export/pdf?startDate=2026-12-01&endDate=2026-11-01`);
  assert.equal(invalid.status, 400);
  assert.equal((await invalid.json()).success, false);
});

test('TC-GROUP-005 creates a shared target and records only valid member contributions', async (t) => {
  const app = express();
  app.use(express.json());
  app.use(createApiRouter(buildController(new TransactionRepositoryImpl())));
  const server = createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())));
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  const baseUrl = `http://127.0.0.1:${address.port}`;

  const createdResponse = await fetch(`${baseUrl}/groups/create`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ groupName: 'Family trip', members: ['U-7'], targetAmount: 12000 }),
  });
  assert.equal(createdResponse.status, 200);
  const created = await createdResponse.json() as { success: boolean; group: { groupId: string; targetAmount: { amount: number } } };
  assert.equal(created.success, true);
  assert.equal(created.group.targetAmount.amount, 12000);

  const deposit = await fetch(`${baseUrl}/groups/${created.group.groupId}/deposit`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ memberId: 'U-7', amount: 500 }),
  });
  assert.equal((await deposit.json() as { success: boolean }).success, true);
  const unauthorized = await fetch(`${baseUrl}/groups/${created.group.groupId}/deposit`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ memberId: 'U-88', amount: 700 }),
  });
  assert.equal((await unauthorized.json() as { success: boolean }).success, false);
  const report = await fetch(`${baseUrl}/groups/${created.group.groupId}/report`);
  assert.match((await report.json() as { report: string }).report, /Target: 12000 USD[\s\S]*U-7: 500 USD/);
});

test('TC-BUDGET-002 returns spending trends and threshold alerts from recorded expenses', async (t) => {
  const app = express();
  app.use(express.json());
  app.use(createApiRouter(buildController(new TransactionRepositoryImpl())));
  const server = createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())));
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  const baseUrl = `http://127.0.0.1:${address.port}`;

  const created = await fetch(`${baseUrl}/budgets/create`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ userId: 'U-BUDGET-2', totalAmount: 1000, startDate: '2026-11-01', endDate: '2026-11-30', categories: ['Food'] }) });
  assert.equal((await created.json() as { success: boolean }).success, true);
  const expense = await fetch(`${baseUrl}/budgets/expense`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ userId: 'U-BUDGET-2', amount: 850, category: 'Food' }) });
  assert.equal((await expense.json() as { success: boolean }).success, true);

  const alert = await fetch(`${baseUrl}/budgets/U-BUDGET-2/alerts/check`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ thresholdPercent: 80 }) });
  const alertResult = await alert.json();
  assert.equal(alertResult.alerts.length, 1);
  assert.equal(alertResult.alerts[0].spent, 850);

  const trends = await fetch(`${baseUrl}/budgets/U-BUDGET-2/trends`);
  assert.deepEqual((await trends.json()).trends, [{ category: 'Food', amount: 850, currency: 'USD' }]);
});

test('TC-REPORT-008 compares user spending across two valid periods', async (t) => {
  const transactions = new TransactionRepositoryImpl();
  transactions.save({ transactionId: 'T-CURRENT', userId: 'U-COMPARE', category: 'Food', amount: { amount: 120, currency: { code: 'USD', symbol: '$', exchangeRate: 1 } }, date: '2026-11-15T12:00:00.000Z', paymentMethod: 'card' });
  transactions.save({ transactionId: 'T-PREVIOUS', userId: 'U-COMPARE', category: 'Rent', amount: { amount: 100, currency: { code: 'USD', symbol: '$', exchangeRate: 1 } }, date: '2026-10-15T12:00:00.000Z', paymentMethod: 'card' });
  const app = express();
  app.use(express.json());
  app.use(createApiRouter(buildController(transactions)));
  const server = createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())));
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  const baseUrl = `http://127.0.0.1:${address.port}`;
  const response = await fetch(`${baseUrl}/reports/U-COMPARE/compare`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ currentStart: '2026-11-01', currentEnd: '2026-11-30', previousStart: '2026-10-01', previousEnd: '2026-10-31' }),
  });
  const result = await response.json();
  assert.equal(response.status, 200);
  assert.deepEqual(result.comparison, { currentSpent: 120, previousSpent: 100, change: 20, changePercent: 20 });

  const invalid = await fetch(`${baseUrl}/reports/U-COMPARE/compare`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ currentStart: '2026-12-01', currentEnd: '2026-11-01', previousStart: '2026-10-01', previousEnd: '2026-10-31' }),
  });
  assert.equal(invalid.status, 400);
});
