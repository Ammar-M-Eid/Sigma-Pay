import { randomUUID as uuidv4 } from 'crypto';
import {
  IAccount,
  IUserAccount,
  IBudgetPlan,
  IFinancialGoal,
  IGoalProgress,
  IGroupSavings,
  IPayment,
  IReport,
  INotification,
  IMoney,
} from '../domain/entities';
import {
  IAccountService,
  IBudgetService,
  IGoalService,
  IGroupSavingsService,
  IPaymentsServiceBL,
  IReportingService,
  INotificationServiceBL,
} from '../domain/serviceInterfaces';
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

// Service Implementations - Business Logic Layer

export class AccountService implements IAccountService {
  constructor(
    private accountsRepository: IAccountsRepository,
    private userRepository: IUserRepository
  ) {}

  createAccount(account: IAccount): string {
    return this.accountsRepository.save(account);
  }

  getAccount(accountId: string): IAccount | null {
    return this.accountsRepository.findById(accountId);
  }

  updateAccount(account: IAccount): void {
    this.accountsRepository.save(account);
  }

  deleteAccount(accountId: string): void {
    // In a real implementation, this would delete the account
    // For mock, we'll just skip it
  }

  getUserAccount(userId: string): IUserAccount | null {
    return this.userRepository.findById(userId);
  }
}

export class BudgetService implements IBudgetService {
  constructor(
    private budgetRepository: IBudgetRepository,
    private transactionRepository: ITransactionRepository
  ) {}

  createBudget(plan: IBudgetPlan): string {
    if (!plan.budgetId) {
      plan.budgetId = uuidv4();
    }
    plan.spent = 0;
    return this.budgetRepository.save(plan);
  }

  updateBudget(plan: IBudgetPlan): void {
    this.budgetRepository.save(plan);
  }

  deleteBudget(budgetId: string): void {
    // Mock implementation
  }

  getBudget(budgetId: string): IBudgetPlan | null {
    return this.budgetRepository.findById(budgetId);
  }

  recordExpense(userId: string, amount: number, category: string): boolean {
    const budgets = this.budgetRepository.findByUserId(userId);
    if (budgets.length > 0) {
      const budget = budgets[0];
      budget.spent += amount;
      this.budgetRepository.save(budget);

      // Create transaction record
      const transaction = {
        transactionId: uuidv4(),
        userId,
        amount: { amount, currency: { code: 'USD', symbol: '$', exchangeRate: 1 } } as IMoney,
        category,
        date: new Date().toISOString(),
        paymentMethod: 'card',
      };
      this.transactionRepository.save(transaction);
      return true;
    }
    return false;
  }

  analyzeSpending(budgetId: string): any {
    const budget = this.budgetRepository.findById(budgetId);
    if (budget) {
      const percentSpent = (budget.spent / budget.totalAmount.amount) * 100;
      return {
        budgetId,
        totalAmount: budget.totalAmount.amount,
        spent: budget.spent,
        remaining: budget.totalAmount.amount - budget.spent,
        percentSpent,
      };
    }
    return null;
  }
}

export class GoalService implements IGoalService {
  constructor(private goalRepository: IGoalRepository) {}

  createGoal(goal: IFinancialGoal): string {
    if (!goal.goalId) {
      goal.goalId = uuidv4();
    }
    if (!goal.currentAmount) {
      goal.currentAmount = { amount: 0, currency: goal.targetAmount.currency };
    }
    goal.state = 'Active';
    return this.goalRepository.save(goal);
  }

  updateGoal(goal: IFinancialGoal): void {
    this.goalRepository.save(goal);
  }

  trackProgress(goalId: string): IGoalProgress | null {
    const goal = this.goalRepository.findById(goalId);
    if (goal) {
      const percentageComplete = (goal.currentAmount.amount / goal.targetAmount.amount) * 100;
      const remainingAmount: IMoney = {
        amount: goal.targetAmount.amount - goal.currentAmount.amount,
        currency: goal.targetAmount.currency,
      };
      const deadline = new Date(goal.deadline);
      const now = new Date();
      const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      return {
        goalId,
        percentageComplete,
        remainingAmount,
        daysRemaining,
        onTrack: percentageComplete >= 50 || daysRemaining > 30,
      };
    }
    return null;
  }

  contributeToGoal(goalId: string, amount: number): void {
    const goal = this.goalRepository.findById(goalId);
    if (goal) {
      goal.currentAmount.amount += amount;
      if (goal.currentAmount.amount >= goal.targetAmount.amount) {
        goal.state = 'Completed';
      }
      this.goalRepository.save(goal);
    }
  }
}

export class GroupSavingsService implements IGroupSavingsService {
  constructor(private groupSavingsRepository: IGroupSavingsRepository) {}

  createGroup(group: IGroupSavings): string {
    if (!group.groupId) {
      group.groupId = uuidv4();
    }
    if (!group.currentAmount) {
      group.currentAmount = { amount: 0, currency: group.targetAmount.currency };
    }
    return this.groupSavingsRepository.save(group);
  }

  joinGroup(groupId: string, userId: string): void {
    const group = this.groupSavingsRepository.findById(groupId);
    if (group && !group.members.includes(userId)) {
      group.members.push(userId);
      this.groupSavingsRepository.save(group);
    }
  }

  contribute(groupId: string, userId: string, amount: number): void {
    const group = this.groupSavingsRepository.findById(groupId);
    if (group) {
      group.currentAmount.amount += amount;
      this.groupSavingsRepository.save(group);
    }
  }

  generateGroupReport(groupId: string): string {
    const group = this.groupSavingsRepository.findById(groupId);
    if (group) {
      return `Group: ${group.groupName}\nTarget: ${group.targetAmount.amount} ${group.targetAmount.currency.code}\nCurrent: ${group.currentAmount.amount} ${group.currentAmount.currency.code}\nMembers: ${group.members.length}`;
    }
    return 'Group not found';
  }
}

export class PaymentsServiceBL implements IPaymentsServiceBL {
  constructor(private paymentRepository: IPaymentRepository) {}

  processPayment(payment: IPayment): any {
    if (!payment.paymentId) {
      payment.paymentId = uuidv4();
    }
    payment.state = 'Completed';
    payment.timestamp = new Date().toISOString();
    this.paymentRepository.save(payment);
    return { success: true, paymentId: payment.paymentId };
  }

  scheduleRecurringPayment(payment: IPayment, schedule: any): string {
    // Mock implementation
    return uuidv4();
  }

  cancelPayment(paymentId: string): void {
    const payment = this.paymentRepository.findById(paymentId);
    if (payment) {
      payment.state = 'Cancelled';
      this.paymentRepository.save(payment);
    }
  }

  refundPayment(paymentId: string): any {
    const payment = this.paymentRepository.findById(paymentId);
    if (payment) {
      payment.state = 'Refunded';
      this.paymentRepository.save(payment);
      return { success: true, message: 'Refund processed' };
    }
    return { success: false, message: 'Payment not found' };
  }
}

export class ReportingService implements IReportingService {
  constructor(private transactionRepository: ITransactionRepository) {}

  generateReport(filter: any, type: string): IReport | null {
    return {
      reportId: uuidv4(),
      userId: filter.userId,
      reportType: type,
      generatedAt: new Date().toISOString(),
      content: 'Mock report content',
    };
  }

  generateIncomeStatement(userId: string): string {
    const transactions = this.transactionRepository.findByUserId(userId);
    const totalIncome = transactions
      .filter((t) => t.category === 'income')
      .reduce((sum, t) => sum + t.amount.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.category !== 'income')
      .reduce((sum, t) => sum + t.amount.amount, 0);

    return `Income Statement for User ${userId}\nTotal Income: $${totalIncome}\nTotal Expenses: $${totalExpenses}\nNet: $${totalIncome - totalExpenses}`;
  }

  generateMonthlySummary(userId: string): string {
    const transactions = this.transactionRepository.findByUserId(userId);
    return `Monthly Summary for User ${userId}\nTotal Transactions: ${transactions.length}\nTotal Spent: $${transactions.reduce((sum, t) => sum + t.amount.amount, 0)}`;
  }

  exportToPDF(report: IReport): Buffer {
    // Mock PDF export
    return Buffer.from(report.content);
  }
}

export class NotificationServiceBL implements INotificationServiceBL {
  constructor(private notificationRepository: INotificationRepository) {}

  sendNotification(notification: INotification): void {
    if (!notification.notificationId) {
      notification.notificationId = uuidv4();
    }
    notification.timestamp = new Date().toISOString();
    notification.read = false;
    this.notificationRepository.save(notification);
  }

  sendAlert(userId: string, message: string): boolean {
    const notification: INotification = {
      notificationId: uuidv4(),
      userId,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'alert',
    };
    this.notificationRepository.save(notification);
    return true;
  }

  getNotifications(userId: string): INotification[] {
    return this.notificationRepository.findByUserId(userId);
  }
}
