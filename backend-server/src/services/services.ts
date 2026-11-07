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
  ILoginActivity,
  IBill,
} from '../domain/entities';
import {
  IAccountService,
  IBudgetService,
  IGoalService,
  IGroupSavingsService,
  IPaymentsServiceBL,
  IReportingService,
  INotificationServiceBL,
  ILoginActivityService,
  IBillService,
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
  ILoginActivityRepository,
  IBillRepository,
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

  saveUser(user: IUserAccount): string {
    return this.userRepository.save(user);
  }

  findUserByEmail(email: string): IUserAccount | null {
    return this.userRepository.findByEmail(email);
  }

  findUserByUsername(username: string): IUserAccount | null {
    return this.userRepository.findByUsername(username);
  }

  findUserByPhone(phone: string): IUserAccount | null {
    return this.userRepository.findByPhone(phone);
  }

  deleteAccount(accountId: string): void {
    this.accountsRepository.deleteByUserId(accountId);
    this.userRepository.delete(accountId);
  }

  getUserAccount(userId: string): IUserAccount | null {
    return this.userRepository.findById(userId);
  }
}

export class LoginActivityService implements ILoginActivityService {
  constructor(private activityRepository: ILoginActivityRepository) {}

  record(activity: ILoginActivity): void {
    this.activityRepository.save(activity);
  }

  getByUserId(userId: string): ILoginActivity[] {
    return this.activityRepository.findByUserId(userId);
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
    if (!Number.isFinite(amount) || amount <= 0 || !category.trim()) return false;
    const budgets = this.budgetRepository.findByUserId(userId);
    const isIncome = category.trim().toLowerCase() === 'income';
    if (isIncome || budgets.length > 0) {
      if (!isIncome) {
      const budget = budgets[0];
      budget.spent += amount;
      this.budgetRepository.save(budget);
      }

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

  getBudgetsByUserId(userId: string): IBudgetPlan[] {
    return this.budgetRepository.findByUserId(userId);
  }

  getSpendingTrends(userId: string): Array<{ category: string; amount: number; currency: string }> {
    const totals = new Map<string, number>();
    for (const transaction of this.transactionRepository.findByUserId(userId)) {
      if (transaction.category.toLowerCase() === 'income') continue;
      totals.set(transaction.category, (totals.get(transaction.category) ?? 0) + transaction.amount.amount);
    }
    return [...totals.entries()].map(([category, amount]) => ({ category, amount, currency: 'USD' }));
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

  getGoal(goalId: string): IFinancialGoal | null {
    return this.goalRepository.findById(goalId);
  }

  getGoalsByUserId(userId: string): IFinancialGoal[] {
    return this.goalRepository.findByUserId(userId);
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
    payment.paymentId ||= uuidv4();
    payment.state = 'Scheduled';
    payment.timestamp = new Date().toISOString();
    payment.recurrenceFrequency = schedule.frequency;
    payment.nextRunAt = schedule.nextRunAt;
    return this.paymentRepository.save(payment);
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

  getPaymentsByUserId(userId: string): IPayment[] {
    return this.paymentRepository.findByUserId(userId);
  }
}

export class BillService implements IBillService {
  constructor(private billRepository: IBillRepository) {}

  createBill(bill: IBill): string {
    bill.status = 'Scheduled';
    return this.billRepository.save(bill);
  }

  getBillsByUserId(userId: string): IBill[] {
    return this.billRepository.findByUserId(userId);
  }

  payBill(billId: string, userId: string): IBill | null {
    const bill = this.billRepository.findById(billId);
    if (!bill || bill.userId !== userId || bill.status !== 'Scheduled') return null;
    bill.status = 'Paid';
    bill.paidAt = new Date().toISOString();
    this.billRepository.save(bill);
    return bill;
  }
}

export class ReportingService implements IReportingService {
  constructor(private transactionRepository: ITransactionRepository) {}

  generateReport(filter: any, type: string): IReport | null {
    if (!filter?.userId || !['monthly', 'income', 'spending'].includes(type)) return null;
    const start = filter.startDate ? new Date(`${filter.startDate}T00:00:00`).getTime() : Number.NEGATIVE_INFINITY;
    const end = filter.endDate ? new Date(`${filter.endDate}T23:59:59.999`).getTime() : Number.POSITIVE_INFINITY;
    if ((Number.isNaN(start) && filter.startDate) || (Number.isNaN(end) && filter.endDate) || start > end) return null;
    const transactions = this.transactionRepository.findByUserId(filter.userId).filter((transaction) => {
      const date = new Date(transaction.date).getTime();
      return date >= start && date <= end;
    });
    const income = transactions.filter((transaction) => transaction.category.toLowerCase() === 'income').reduce((sum, transaction) => sum + transaction.amount.amount, 0);
    const expenses = transactions.filter((transaction) => transaction.category.toLowerCase() !== 'income');
    const spent = expenses.reduce((sum, transaction) => sum + transaction.amount.amount, 0);
    const categoryTotals = new Map<string, number>();
    expenses.forEach((transaction) => categoryTotals.set(transaction.category, (categoryTotals.get(transaction.category) ?? 0) + transaction.amount.amount));
    const range = `${filter.startDate ?? 'all'} to ${filter.endDate ?? 'date'}`;
    const content = type === 'income'
      ? `Income statement (${range})\nIncome: $${income.toFixed(2)}\nExpenses: $${spent.toFixed(2)}\nNet: $${(income - spent).toFixed(2)}`
      : type === 'spending'
        ? `Spending report (${range})\nTransactions: ${expenses.length}\nTotal spent: $${spent.toFixed(2)}\nBy category:\n${[...categoryTotals].map(([category, amount]) => `${category}: $${amount.toFixed(2)}`).join('\n') || 'No spending recorded.'}`
        : `Activity summary (${range})\nExpense transactions: ${expenses.length}\nIncome transactions: ${transactions.length - expenses.length}\nTotal spent: $${spent.toFixed(2)}\nIncome recorded: $${income.toFixed(2)}`;
    return {
      reportId: uuidv4(),
      userId: filter.userId,
      reportType: type,
      generatedAt: new Date().toISOString(),
      content,
    };
  }

  generateIncomeStatement(userId: string): string {
    const transactions = this.transactionRepository.findByUserId(userId);
    const totalIncome = transactions
      .filter((t) => t.category.toLowerCase() === 'income')
      .reduce((sum, t) => sum + t.amount.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.category.toLowerCase() !== 'income')
      .reduce((sum, t) => sum + t.amount.amount, 0);

    return `Income Statement for User ${userId}\nTotal Income: $${totalIncome}\nTotal Expenses: $${totalExpenses}\nNet: $${totalIncome - totalExpenses}`;
  }

  generateMonthlySummary(userId: string): string {
    const transactions = this.transactionRepository.findByUserId(userId);
    const expenses = transactions.filter((t) => t.category.toLowerCase() !== 'income');
    return `Monthly Summary for User ${userId}\nExpense Transactions: ${expenses.length}\nTotal Spent: $${expenses.reduce((sum, t) => sum + t.amount.amount, 0)}`;
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
