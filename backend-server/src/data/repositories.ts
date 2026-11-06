import { randomUUID as uuidv4 } from 'crypto';
import {
  IAccount,
  IUserAccount,
  ITransaction,
  IBudgetPlan,
  IFinancialGoal,
  IPayment,
  IGroupSavings,
  INotification,
} from '../domain/entities';
import {
  IAccountsRepository,
  IUserRepository,
  ITransactionRepository,
  IBudgetRepository,
  IGoalRepository,
  IPaymentRepository,
  IGroupSavingsRepository,
  INotificationRepository,
} from '../domain/repositoryInterfaces';

// PATTERN: Singleton - DatabaseConnectionPool (simulated with in-memory stores)
export class DatabaseConnectionPool {
  private static instance: DatabaseConnectionPool;
  private connections: Map<string, any>;

  private constructor() {
    this.connections = new Map();
  }

  public static getInstance(): DatabaseConnectionPool {
    if (!DatabaseConnectionPool.instance) {
      DatabaseConnectionPool.instance = new DatabaseConnectionPool();
    }
    return DatabaseConnectionPool.instance;
  }

  public getConnection(): any {
    return { connected: true };
  }
}

// Repository Implementations with in-memory storage

export class UserRepositoryImpl implements IUserRepository {
  private users: Map<string, IUserAccount> = new Map();

  save(user: IUserAccount): string {
    if (!user.userId) {
      user.userId = uuidv4();
    }
    this.users.set(user.userId, user);
    return user.userId;
  }

  findById(userId: string): IUserAccount | null {
    return this.users.get(userId) || null;
  }

  findByUsername(username: string): IUserAccount | null {
    for (const user of this.users.values()) {
      if (user.credentials.username === username) {
        return user;
      }
    }
    return null;
  }

  findByEmail(email: string): IUserAccount | null {
    for (const user of this.users.values()) {
      if (user.profile.email === email) {
        return user;
      }
    }
    return null;
  }
}

export class AccountsRepositoryImpl implements IAccountsRepository {
  private accounts: Map<string, IAccount> = new Map();

  save(account: IAccount): string {
    if (!account.accountId) {
      account.accountId = uuidv4();
    }
    this.accounts.set(account.accountId, account);
    return account.accountId;
  }

  findById(accountId: string): IAccount | null {
    return this.accounts.get(accountId) || null;
  }

  findByUserId(userId: string): IAccount | null {
    for (const account of this.accounts.values()) {
      if (account.userId === userId) {
        return account;
      }
    }
    return null;
  }
}

export class TransactionRepositoryImpl implements ITransactionRepository {
  private transactions: Map<string, ITransaction> = new Map();

  save(transaction: ITransaction): string {
    if (!transaction.transactionId) {
      transaction.transactionId = uuidv4();
    }
    this.transactions.set(transaction.transactionId, transaction);
    return transaction.transactionId;
  }

  findById(transactionId: string): ITransaction | null {
    return this.transactions.get(transactionId) || null;
  }

  findByUserId(userId: string): ITransaction[] {
    const userTransactions: ITransaction[] = [];
    for (const transaction of this.transactions.values()) {
      if (transaction.userId === userId) {
        userTransactions.push(transaction);
      }
    }
    return userTransactions;
  }
}

export class BudgetRepositoryImpl implements IBudgetRepository {
  private budgets: Map<string, IBudgetPlan> = new Map();

  save(budget: IBudgetPlan): string {
    if (!budget.budgetId) {
      budget.budgetId = uuidv4();
    }
    this.budgets.set(budget.budgetId, budget);
    return budget.budgetId;
  }

  findById(budgetId: string): IBudgetPlan | null {
    return this.budgets.get(budgetId) || null;
  }

  findByUserId(userId: string): IBudgetPlan[] {
    const userBudgets: IBudgetPlan[] = [];
    for (const budget of this.budgets.values()) {
      if (budget.userId === userId) {
        userBudgets.push(budget);
      }
    }
    return userBudgets;
  }
}

export class GoalRepositoryImpl implements IGoalRepository {
  private goals: Map<string, IFinancialGoal> = new Map();

  save(goal: IFinancialGoal): string {
    if (!goal.goalId) {
      goal.goalId = uuidv4();
    }
    this.goals.set(goal.goalId, goal);
    return goal.goalId;
  }

  findById(goalId: string): IFinancialGoal | null {
    return this.goals.get(goalId) || null;
  }

  findByUserId(userId: string): IFinancialGoal[] {
    const userGoals: IFinancialGoal[] = [];
    for (const goal of this.goals.values()) {
      if (goal.userId === userId) {
        userGoals.push(goal);
      }
    }
    return userGoals;
  }
}

export class PaymentRepositoryImpl implements IPaymentRepository {
  private payments: Map<string, IPayment> = new Map();

  save(payment: IPayment): string {
    if (!payment.paymentId) {
      payment.paymentId = uuidv4();
    }
    this.payments.set(payment.paymentId, payment);
    return payment.paymentId;
  }

  findById(paymentId: string): IPayment | null {
    return this.payments.get(paymentId) || null;
  }

  findByUserId(userId: string): IPayment[] {
    const userPayments: IPayment[] = [];
    for (const payment of this.payments.values()) {
      if (payment.userId === userId) {
        userPayments.push(payment);
      }
    }
    return userPayments;
  }
}

export class GroupSavingsRepositoryImpl implements IGroupSavingsRepository {
  private groups: Map<string, IGroupSavings> = new Map();

  save(group: IGroupSavings): string {
    if (!group.groupId) {
      group.groupId = uuidv4();
    }
    this.groups.set(group.groupId, group);
    return group.groupId;
  }

  findById(groupId: string): IGroupSavings | null {
    return this.groups.get(groupId) || null;
  }
}

export class NotificationRepositoryImpl implements INotificationRepository {
  private notifications: Map<string, INotification> = new Map();

  save(notification: INotification): string {
    if (!notification.notificationId) {
      notification.notificationId = uuidv4();
    }
    this.notifications.set(notification.notificationId, notification);
    return notification.notificationId;
  }

  findById(notificationId: string): INotification | null {
    return this.notifications.get(notificationId) || null;
  }

  findByUserId(userId: string): INotification[] {
    const userNotifications: INotification[] = [];
    for (const notification of this.notifications.values()) {
      if (notification.userId === userId) {
        userNotifications.push(notification);
      }
    }
    return userNotifications;
  }
}
