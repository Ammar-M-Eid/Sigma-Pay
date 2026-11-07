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
  ILoginActivity,
  IBill,
} from './entities';

// Service Interfaces - matching UML diagram

export interface IAccountService {
  createAccount(account: IAccount): string;
  getAccount(accountId: string): IAccount | null;
  updateAccount(account: IAccount): void;
  deleteAccount(accountId: string): void;
  saveUser(user: IUserAccount): string;
  findUserByEmail(email: string): IUserAccount | null;
  findUserByUsername(username: string): IUserAccount | null;
  findUserByPhone(phone: string): IUserAccount | null;
  getUserAccount(userId: string): IUserAccount | null;
}

export interface ILoginActivityService {
  record(activity: ILoginActivity): void;
  getByUserId(userId: string): ILoginActivity[];
}

export interface IBudgetService {
  createBudget(plan: IBudgetPlan): string;
  updateBudget(plan: IBudgetPlan): void;
  deleteBudget(budgetId: string): void;
  getBudget(budgetId: string): IBudgetPlan | null;
  recordExpense(userId: string, amount: number, category: string): boolean;
  analyzeSpending(budgetId: string): any;
  getBudgetsByUserId(userId: string): IBudgetPlan[];
  getSpendingTrends(userId: string): Array<{ category: string; amount: number; currency: string }>;
}

export interface IGoalService {
  createGoal(goal: IFinancialGoal): string;
  updateGoal(goal: IFinancialGoal): void;
  trackProgress(goalId: string): IGoalProgress | null;
  contributeToGoal(goalId: string, amount: number): void;
  getGoal(goalId: string): IFinancialGoal | null;
  getGoalsByUserId(userId: string): IFinancialGoal[];
}

export interface IGroupSavingsService {
  createGroup(group: IGroupSavings): string;
  joinGroup(groupId: string, userId: string): void;
  contribute(groupId: string, userId: string, amount: number): void;
  generateGroupReport(groupId: string): string;
}

export interface IPaymentsServiceBL {
  processPayment(payment: IPayment): any;
  scheduleRecurringPayment(payment: IPayment, schedule: any): string;
  cancelPayment(paymentId: string): void;
  refundPayment(paymentId: string): any;
  getPaymentsByUserId(userId: string): IPayment[];
}

export interface IBillService {
  createBill(bill: IBill): string;
  getBillsByUserId(userId: string): IBill[];
  payBill(billId: string, userId: string): IBill | null;
}

export interface IReportingService {
  generateReport(filter: any, type: string): IReport | null;
  generateIncomeStatement(userId: string): string;
  generateMonthlySummary(userId: string): string;
  exportToPDF(report: IReport): Buffer;
}

export interface INotificationServiceBL {
  sendNotification(notification: INotification): void;
  sendAlert(userId: string, message: string): boolean;
  getNotifications(userId: string): INotification[];
}
