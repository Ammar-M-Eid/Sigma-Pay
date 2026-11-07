// Entity Interfaces - matching UML diagram

export interface IUserAccount {
  userId: string;
  credentials: ICredentials;
  profile: IUserProfile;
  securitySettings: ISecuritySettings;
}

export interface ILoginActivity {
  activityId: string;
  userId?: string;
  email: string;
  at: string;
  device: string;
  ip: string;
  status: 'Success' | 'Failed';
}

export interface ICredentials {
  username: string;
  passwordHash: string;
}

export interface IUserProfile {
  email: string;
  phone: string;
  address?: string;
}

export interface ISecuritySettings {
  twoFactorEnabled: boolean;
  accountStatus: string;
}

export interface IAccount {
  accountId: string;
  balance: IMoney;
  userId: string;
}

export interface IMoney {
  amount: number;
  currency: ICurrency;
}

export interface ICurrency {
  code: string;
  symbol: string;
  exchangeRate: number;
}

export interface ITransaction {
  transactionId: string;
  amount: IMoney;
  merchantType?: string;
  date: string;
  userId: string;
  category: string;
  paymentMethod: string;
}

export interface IBudgetPlan {
  budgetId: string;
  userId: string;
  totalAmount: IMoney;
  startDate: string;
  endDate: string;
  categories: string[];
  spent: number;
}

export interface IFinancialGoal {
  goalId: string;
  userId: string;
  goalType: string;
  targetAmount: IMoney;
  currentAmount: IMoney;
  deadline: string;
  priorityLevel: string;
  state: string;
}

export interface IGoalProgress {
  goalId: string;
  percentageComplete: number;
  remainingAmount: IMoney;
  daysRemaining: number;
  onTrack: boolean;
}

export interface IAIRecommendation {
  recommendationId: string;
  userId: string;
  goalId: string;
  suggestions: string[];
  estimatedCompletion: string;
}

export interface IPayment {
  paymentId: string;
  userId: string;
  amount: IMoney;
  methodId: string;
  merchantId?: string;
  state: string;
  timestamp: string;
  recurrenceFrequency?: string;
  nextRunAt?: string;
}

export interface IBill {
  billId: string;
  userId: string;
  provider: string;
  accountRef: string;
  amount: IMoney;
  dueAt: string;
  recurring: boolean;
  status: 'Scheduled' | 'Paid' | 'Cancelled';
  paidAt?: string;
}

export interface IGroupSavings {
  groupId: string;
  groupName: string;
  targetAmount: IMoney;
  currentAmount: IMoney;
  members: string[];
}

export interface ISavingsGroup extends IGroupSavings {
  contributions: Map<string, number>;
}

export interface IReport {
  reportId: string;
  userId: string;
  reportType: string;
  generatedAt: string;
  content: string;
}

export interface INotification {
  notificationId: string;
  userId: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: string;
}
