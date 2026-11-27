import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Controller } from '../src/api/controller';
import {
  AccountService, BillService, BudgetService, GoalService, GroupSavingsService,
  LoginActivityService, NotificationServiceBL, PaymentsServiceBL, ReportingService,
} from '../src/services/services';
import {
  AccountsRepositoryImpl, BillRepositoryImpl, BudgetRepositoryImpl, GoalRepositoryImpl,
  GroupSavingsRepositoryImpl, LoginActivityRepositoryImpl, NotificationRepositoryImpl,
  PaymentRepositoryImpl, TransactionRepositoryImpl, UserRepositoryImpl,
} from '../src/data/repositories';

function controllerFixture() {
  const accountRepository = new AccountsRepositoryImpl();
  const userRepository = new UserRepositoryImpl();
  const activityRepository = new LoginActivityRepositoryImpl();
  const transactions = new TransactionRepositoryImpl();
  const controller = new Controller(
    new AccountService(accountRepository, userRepository),
    new BudgetService(new BudgetRepositoryImpl(), transactions),
    new GoalService(new GoalRepositoryImpl()),
    new GroupSavingsService(new GroupSavingsRepositoryImpl()),
    new PaymentsServiceBL(new PaymentRepositoryImpl()),
    new ReportingService(transactions),
    new NotificationServiceBL(new NotificationRepositoryImpl()),
    new LoginActivityService(activityRepository),
    new BillService(new BillRepositoryImpl()),
  );
  return { controller, accountRepository, userRepository, activityRepository };
}

test('TC-AUTH-002 registers a normalized account and rejects invalid or duplicate registration data', () => {
  const { controller, accountRepository, userRepository } = controllerFixture();
  const created = controller.ctlCreateAccount(' Ammar_1 ', ' AMMAR@example.com ', 'StrongPass1', '+20 100 000 0000');

  assert.ok(created);
  assert.match(created.userId, /^[0-9a-f-]{36}$/i);
  assert.equal(created.user.username, 'ammar_1');
  assert.equal(created.user.email, 'ammar@example.com');
  assert.equal(created.account.userId, created.userId);
  assert.equal(created.account.balance.amount, 0);
  const storedUser = userRepository.findById(created.userId);
  assert.ok(storedUser);
  assert.notEqual(storedUser.credentials.passwordHash, 'StrongPass1');
  assert.equal(accountRepository.findByUserId(created.userId), created.account);

  assert.equal(controller.ctlCreateAccount('ab', 'bad-email', 'weak', '123'), null);
  assert.equal(controller.ctlCreateAccount('other', 'ammar@example.com', 'StrongPass1', '201000000001'), null);
});

test('TC-AUTH-003 authenticates valid credentials, rejects wrong passwords, and records both attempts', () => {
  const { controller, activityRepository } = controllerFixture();
  const created = controller.ctlCreateAccount('ammar', 'ammar@example.com', 'StrongPass1', '201000000000');
  assert.ok(created);

  const login = controller.ctlLogin(' AMMAR@example.com ', 'StrongPass1', 'web', '127.0.0.1');
  assert.ok(login);
  assert.equal(login.userId, created.userId);
  assert.equal(controller.ctlLogin('ammar@example.com', 'WrongPass1'), null);
  const history = activityRepository.findByUserId(created.userId);
  assert.deepEqual(history.map((entry) => entry.status), ['Failed', 'Success']);
  assert.ok(history.every((entry) => entry.email === 'ammar@example.com'));
});

test('TC-AUTH-004 blocks login after account access is disabled', () => {
  const { controller, userRepository } = controllerFixture();
  const created = controller.ctlCreateAccount('user_2', 'user2@example.com', 'StrongPass1', '201000000002');
  assert.ok(created);
  const user = userRepository.findById(created.userId);
  assert.ok(user);
  user.securitySettings.accountStatus = 'Disabled';

  assert.equal(controller.ctlLogin('user2@example.com', 'StrongPass1'), null);
});
