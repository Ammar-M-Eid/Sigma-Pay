import {
  IAccount,
  IUserAccount,
  ITransaction,
  IBudgetPlan,
  IFinancialGoal,
  IPayment,
  IGroupSavings,
  INotification,
  ILoginActivity,
  IBill,
} from './entities';

// Repository Interfaces - matching UML diagram

export interface IAccountsRepository {
  save(account: IAccount): string;
  findById(accountId: string): IAccount | null;
  findByUserId(userId: string): IAccount | null;
  deleteByUserId(userId: string): boolean;
}

export interface IUserRepository {
  save(user: IUserAccount): string;
  findById(userId: string): IUserAccount | null;
  findByUsername(username: string): IUserAccount | null;
  findByEmail(email: string): IUserAccount | null;
  findByPhone(phone: string): IUserAccount | null;
  delete(userId: string): boolean;
}

export interface ILoginActivityRepository {
  save(activity: ILoginActivity): string;
  findByUserId(userId: string): ILoginActivity[];
}

export interface ITransactionRepository {
  save(transaction: ITransaction): string;
  findById(transactionId: string): ITransaction | null;
  findByUserId(userId: string): ITransaction[];
}

export interface IBudgetRepository {
  save(budget: IBudgetPlan): string;
  findById(budgetId: string): IBudgetPlan | null;
  findByUserId(userId: string): IBudgetPlan[];
}

export interface IGoalRepository {
  save(goal: IFinancialGoal): string;
  findById(goalId: string): IFinancialGoal | null;
  findByUserId(userId: string): IFinancialGoal[];
}

export interface IPaymentRepository {
  save(payment: IPayment): string;
  findById(paymentId: string): IPayment | null;
  findByUserId(userId: string): IPayment[];
}

export interface IBillRepository {
  save(bill: IBill): string;
  findById(billId: string): IBill | null;
  findByUserId(userId: string): IBill[];
}

export interface IGroupSavingsRepository {
  save(group: IGroupSavings): string;
  findById(groupId: string): IGroupSavings | null;
}

export interface INotificationRepository {
  save(notification: INotification): string;
  findById(notificationId: string): INotification | null;
  findByUserId(userId: string): INotification[];
}
