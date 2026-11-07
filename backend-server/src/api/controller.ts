import { Router, Request, Response } from 'express';
import { randomUUID as uuidv4 } from 'crypto';
import { hashPassword, isValidPassword, verifyPassword } from '../config/passwords';
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
  IUserAccount,
  IAccount,
  IBudgetPlan,
  IFinancialGoal,
  IGroupSavings,
  IPayment,
  IMoney,
  IBill,
} from '../domain/entities';

// Controller class implementing all controller interfaces from UML
export class Controller {
  private notificationPreferences = new Map<string, Record<string, boolean>>();
  constructor(
    private accountService: IAccountService,
    private budgetService: IBudgetService,
    private goalService: IGoalService,
    private groupSavingsService: IGroupSavingsService,
    private paymentsService: IPaymentsServiceBL,
    private reportingService: IReportingService,
    private notificationService: INotificationServiceBL,
    private loginActivityService: ILoginActivityService,
    private billService: IBillService
  ) {}

  // IControllerAuth methods
  ctlCreateAccount(username: string, email: string, password: string, phoneNumber: string) {
    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();
    const phone = phoneNumber.trim();
    if (
      normalizedUsername.length < 3 ||
      normalizedUsername.length > 20 ||
      !/^[a-z0-9_]+$/.test(normalizedUsername) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) ||
      !/^\d{10,}$/.test(phone.replace(/\D/g, '')) ||
      !isValidPassword(password)
    ) {
      return null;
    }
    if (
      this.accountService.findUserByEmail(normalizedEmail) ||
      this.accountService.findUserByUsername(normalizedUsername) ||
      this.accountService.findUserByPhone(phone)
    ) {
      return null;
    }

    const userId = uuidv4();
    const userAccount: IUserAccount = {
      userId,
      credentials: { username: normalizedUsername, passwordHash: hashPassword(password) },
      profile: { email: normalizedEmail, phone },
      securitySettings: { twoFactorEnabled: false, accountStatus: 'Active' },
    };
    const account: IAccount = {
      accountId: uuidv4(),
      userId,
      balance: { amount: 0, currency: { code: 'USD', symbol: '$', exchangeRate: 1 } },
    };

    this.accountService.saveUser(userAccount);
    const accountId = this.accountService.createAccount(account);
    const storedAccount = this.accountService.getAccount(accountId);
    if (!storedAccount) return null;

    return {
      userId,
      account: storedAccount,
      user: { userId, username: normalizedUsername, email: normalizedEmail, phone },
    };
  }

  ctlLogin(email: string, password: string, device = 'browser', ip = 'local', verificationCode?: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = this.accountService.findUserByEmail(normalizedEmail);
    const passwordValid = !!user && verifyPassword(password, user.credentials.passwordHash);
    const twoFactorValid = !user?.securitySettings.twoFactorEnabled || verificationCode === '246810';
    const valid = !!user && user.securitySettings.accountStatus === 'Active' && passwordValid && twoFactorValid;
    this.loginActivityService.record({
      activityId: uuidv4(),
      userId: user?.userId,
      email: normalizedEmail,
      at: new Date().toISOString(),
      device,
      ip,
      status: valid ? 'Success' : 'Failed',
    });
    if (!valid || !user) {
      return null;
    }
    return {
      userId: user.userId,
      user: { userId: user.userId, username: user.credentials.username, ...user.profile },
    };
  }

  ctlDemoLogin() {
    const user = this.accountService.getUserAccount('demo-user');
    if (!user) return null;
    return {
      userId: user.userId,
      user: { userId: user.userId, username: user.credentials.username, ...user.profile },
    };
  }

  ctlSetTwoFactor(userId: string, enabled: boolean): boolean {
    const user = this.accountService.getUserAccount(userId);
    if (!user) return false;
    user.securitySettings.twoFactorEnabled = enabled;
    return true;
  }

  ctlGetLoginActivity(userId: string) {
    return this.loginActivityService.getByUserId(userId);
  }

  ctlGetAccountDetails(userId: string): IUserAccount | null {
    return this.accountService.getUserAccount(userId);
  }

  ctlUpdateUserInfo(userId: string, newEmail: string, newPhoneNumber: string, newAddress: string): boolean {
    try {
      const user = this.accountService.getUserAccount(userId);
      const email = newEmail.trim().toLowerCase(); const phone = newPhoneNumber.trim();
      if (!user || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\d{10,}$/.test(phone.replace(/\D/g, ''))) return false;
      const duplicateEmail = this.accountService.findUserByEmail(email);
      const duplicatePhone = this.accountService.findUserByPhone(phone);
      if ((duplicateEmail && duplicateEmail.userId !== userId) || (duplicatePhone && duplicatePhone.userId !== userId)) return false;
      user.profile.email = email;
      user.profile.phone = phone;
      user.profile.address = newAddress.trim();
      this.accountService.saveUser(user);
      return true;
    } catch (error) {
      console.error('Error updating user info:', error);
      return false;
    }
  }

  ctlDeleteAccount(userId: string): boolean {
    try {
      if (!this.accountService.getUserAccount(userId)) return false;
      this.accountService.deleteAccount(userId);
      return true;
    } catch (error) {
      console.error('Error deleting account:', error);
      return false;
    }
  }

  ctlChangeUsername(userId: string, newUsername: string): boolean {
    try {
      const user = this.accountService.getUserAccount(userId);
      const username = newUsername.trim().toLowerCase();
      if (!user || username.length < 3 || username.length > 20 || !/^[a-z0-9_]+$/.test(username)) return false;
      const duplicate = this.accountService.findUserByUsername(username);
      if (duplicate && duplicate.userId !== userId) return false;
      user.credentials.username = username;
      this.accountService.saveUser(user);
      return true;
    } catch (error) {
      console.error('Error changing username:', error);
      return false;
    }
  }

  ctlResetPassword(userId: string, oldPassword: string, newPassword: string): boolean {
    try {
      const user = this.accountService.getUserAccount(userId);
      if (user && verifyPassword(oldPassword, user.credentials.passwordHash) && isValidPassword(newPassword)) {
        user.credentials.passwordHash = hashPassword(newPassword);
        // In production, save via user service
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error resetting password:', error);
      return false;
    }
  }

  ctlVerifyIdentity(userId: string, verificationCode: string, method: string): boolean {
    // Mock implementation - in production, verify against stored code
    return verificationCode.length >= 6;
  }

  ctlEnableAccount(userId: string): boolean {
    try {
      const user = this.accountService.getUserAccount(userId);
      if (user) {
        user.securitySettings.accountStatus = 'Active';
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  ctlDisableAccount(userId: string): boolean {
    try {
      const user = this.accountService.getUserAccount(userId);
      if (user) {
        user.securitySettings.accountStatus = 'Disabled';
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  // IControllerBudget methods
  ctlCreateBudget(
    userId: string,
    totalAmount: number,
    startDate: string,
    endDate: string,
    categories: string[]
  ): IBudgetPlan | null {
    try {
      const budget: IBudgetPlan = {
        budgetId: uuidv4(),
        userId,
        totalAmount: { amount: totalAmount, currency: { code: 'USD', symbol: '$', exchangeRate: 1 } },
        startDate,
        endDate,
        categories,
        spent: 0,
      };
      const budgetId = this.budgetService.createBudget(budget);
      return this.budgetService.getBudget(budgetId);
    } catch (error) {
      console.error('Error creating budget:', error);
      return null;
    }
  }

  ctlRecordExpense(
    userId: string,
    amount: number,
    category: string,
    date: string,
    paymentMethod: string
  ): boolean {
    return this.budgetService.recordExpense(userId, amount, category);
  }

  ctlSendBudgetAlert(userId: string, alertType: string, message: string): boolean {
    return this.notificationService.sendAlert(userId, `[${alertType}] ${message}`);
  }

  ctlGetBudgets(userId: string) { return this.budgetService.getBudgetsByUserId(userId); }
  ctlGetBudgetTrends(userId: string) { return this.budgetService.getSpendingTrends(userId); }

  // IControllerGoals methods
  ctlSetGoal(
    userId: string,
    goalType: string,
    targetAmount: number,
    deadline: string,
    priorityLevel: string
  ): IFinancialGoal | null {
    try {
      const goal: IFinancialGoal = {
        goalId: uuidv4(),
        userId,
        goalType,
        targetAmount: { amount: targetAmount, currency: { code: 'USD', symbol: '$', exchangeRate: 1 } },
        currentAmount: { amount: 0, currency: { code: 'USD', symbol: '$', exchangeRate: 1 } },
        deadline,
        priorityLevel,
        state: 'Active',
      };
      const goalId = this.goalService.createGoal(goal);
      return goal;
    } catch (error) {
      console.error('Error setting goal:', error);
      return null;
    }
  }

  ctlTrackProgress(userId: string, goalId: string, detailed: boolean) {
    return this.goalService.trackProgress(goalId);
  }

  ctlGetGoals(userId: string) { return this.goalService.getGoalsByUserId(userId); }
  ctlContributeToGoal(userId: string, goalId: string, amount: number): boolean {
    const goal = this.goalService.getGoal(goalId);
    if (!goal || goal.userId !== userId || !Number.isFinite(amount) || amount <= 0) return false;
    this.goalService.contributeToGoal(goalId, amount);
    return true;
  }

  ctlGetOptimizedGoalPlan(userId: string, financialData: string, timeFrame: number, riskSensitive: boolean) {
    // Mock AI recommendation
    return {
      recommendationId: uuidv4(),
      userId,
      goalId: 'mock-goal-id',
      suggestions: ['Increase monthly savings by 10%', 'Reduce discretionary spending'],
      estimatedCompletion: new Date(Date.now() + timeFrame * 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  // IControllerGroupSavings methods
  ctlCreateGroup(groupName: string, members: string[]): IGroupSavings | null {
    try {
      const group: IGroupSavings = {
        groupId: uuidv4(),
        groupName,
        targetAmount: { amount: 0, currency: { code: 'USD', symbol: '$', exchangeRate: 1 } },
        currentAmount: { amount: 0, currency: { code: 'USD', symbol: '$', exchangeRate: 1 } },
        members,
      };
      const groupId = this.groupSavingsService.createGroup(group);
      return group;
    } catch (error) {
      console.error('Error creating group:', error);
      return null;
    }
  }

  ctlAddMember(groupId: string, memberId: string): boolean {
    try {
      this.groupSavingsService.joinGroup(groupId, memberId);
      return true;
    } catch (error) {
      return false;
    }
  }

  ctlProcessDeposit(groupId: string, memberId: string, amount: number): boolean {
    try {
      this.groupSavingsService.contribute(groupId, memberId, amount);
      return true;
    } catch (error) {
      return false;
    }
  }

  ctlGenerateGroupReport(groupId: string): string {
    return this.groupSavingsService.generateGroupReport(groupId);
  }

  // IControllerReports methods
  ctlGenerateIncomeStatement(userId: string): string {
    return this.reportingService.generateIncomeStatement(userId);
  }

  ctlGenerateMonthlySummary(userId: string): string {
    return this.reportingService.generateMonthlySummary(userId);
  }

  ctlGenerateReport(userId: string, reportType: string, startDate?: string, endDate?: string) {
    return this.reportingService.generateReport({ userId, startDate, endDate }, reportType);
  }

  ctlExportToPDF(reportType: string): boolean {
    // Mock implementation
    return true;
  }

  // IControllerPayments methods
  ctlProcessPayment(userId: string, methodId: string, amount: number, merchantId: string): boolean {
    try {
      if (!Number.isFinite(amount) || amount <= 0 || !methodId.trim() || !merchantId.trim()) return false;
      const payment: IPayment = {
        paymentId: uuidv4(),
        userId,
        amount: { amount, currency: { code: 'USD', symbol: '$', exchangeRate: 1 } },
        methodId,
        merchantId,
        state: 'Pending',
        timestamp: new Date().toISOString(),
      };
      const result = this.paymentsService.processPayment(payment);
      return result.success;
    } catch (error) {
      return false;
    }
  }

  ctlRequestRefund(userId: string, transactionId: string, amount: number, reason: string): boolean {
    try {
      const payment = this.paymentsService.getPaymentsByUserId(userId).find((item) => item.paymentId === transactionId);
      if (!payment || payment.state !== 'Completed' || !Number.isFinite(amount) || amount !== payment.amount.amount || !reason.trim()) return false;
      const result = this.paymentsService.refundPayment(transactionId);
      return result.success;
    } catch (error) {
      return false;
    }
  }

  ctlVerifyPaymentMethod(userId: string, methodId: string, CVV: string): boolean {
    // Mock verification - in production, use proper payment gateway validation
    return CVV.length === 3;
  }

  // IControllerNotifications methods
  ctlSendAlert(userId: string, message: string): boolean {
    return this.notificationService.sendAlert(userId, message);
  }

  ctlSetNotificationPreference(userId: string, preferenceType: string, isEnabled: boolean): boolean {
    if (!userId || !preferenceType || typeof isEnabled !== 'boolean') return false;
    const current = this.notificationPreferences.get(userId) ?? {};
    current[preferenceType] = isEnabled;
    this.notificationPreferences.set(userId, current);
    return true;
  }

  ctlGetNotificationPreferences(userId: string) { return this.notificationPreferences.get(userId) ?? {}; }

  ctlGetNotificationHistory(userId: string) {
    return this.notificationService.getNotifications(userId);
  }

  ctlGetPayments(userId: string) { return this.paymentsService.getPaymentsByUserId(userId); }
  ctlSchedulePayment(userId: string, methodId: string, amount: number, merchantId: string, frequency: string, nextRunAt: string) {
    if (!Number.isFinite(amount) || amount <= 0 || !['weekly', 'monthly', 'quarterly', 'yearly'].includes(frequency)) return null;
    const payment: IPayment = {
      paymentId: uuidv4(), userId,
      amount: { amount, currency: { code: 'USD', symbol: '$', exchangeRate: 1 } },
      methodId, merchantId, state: 'Scheduled', timestamp: new Date().toISOString(),
    };
    const paymentId = this.paymentsService.scheduleRecurringPayment(payment, { frequency, nextRunAt });
    return this.paymentsService.getPaymentsByUserId(userId).find((item) => item.paymentId === paymentId) ?? null;
  }
  ctlCancelPayment(userId: string, paymentId: string): boolean {
    const payment = this.paymentsService.getPaymentsByUserId(userId).find((item) => item.paymentId === paymentId && item.state === 'Scheduled');
    if (!payment) return false;
    this.paymentsService.cancelPayment(paymentId);
    return true;
  }
  ctlGetBills(userId: string) { return this.billService.getBillsByUserId(userId); }
  ctlCreateBill(userId: string, provider: string, accountRef: string, amount: number, dueAt: string, recurring: boolean) {
    if (!provider.trim() || !Number.isFinite(amount) || amount <= 0 || !Number.isFinite(Date.parse(dueAt))) return null;
    const bill: IBill = {
      billId: uuidv4(), userId, provider, accountRef, amount: { amount, currency: { code: 'USD', symbol: '$', exchangeRate: 1 } },
      dueAt, recurring, status: 'Scheduled',
    };
    this.billService.createBill(bill);
    return bill;
  }
  ctlPayBill(billId: string, userId: string) { return this.billService.payBill(billId, userId); }
}

// Create Express router with all endpoints
export function createApiRouter(controller: Controller): Router {
  const router = Router();

  // Auth endpoints
  router.post('/accounts/register', (req: Request, res: Response) => {
    const { username, email, password, phoneNumber } = req.body;
    if ([username, email, password, phoneNumber].some((value) => typeof value !== 'string')) {
      res.status(400).json({ success: false, message: 'Username, email, password, and phone number are required.' });
      return;
    }
    const result = controller.ctlCreateAccount(username, email, password, phoneNumber);
    if (!result) {
      res.status(400).json({ success: false, message: 'Registration failed. Check your details, password rules, and that the email, username, and phone are unused.' });
      return;
    }
    res.status(201).json({ success: true, ...result, message: 'Account created successfully' });
  });

  router.post('/accounts/login', (req: Request, res: Response) => {
    const { email, password, verificationCode } = req.body;
    if (typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }
    const result = controller.ctlLogin(email, password, 'browser', 'local', verificationCode);
    if (!result) {
      res.status(401).json({ success: false, message: 'Email or password is incorrect, or the account is disabled.' });
      return;
    }
    res.json({ success: true, ...result });
  });

  router.post('/accounts/demo-login', (_req: Request, res: Response) => {
    const result = controller.ctlDemoLogin();
    if (!result) {
      res.status(503).json({ success: false, message: 'The local demo profile is unavailable.' });
      return;
    }
    res.json({ success: true, demo: true, ...result });
  });

  router.get('/accounts/:userId', (req: Request, res: Response) => {
    const { userId } = req.params;
    const account = controller.ctlGetAccountDetails(userId);
    if (account) {
      const { credentials: _credentials, ...publicAccount } = account;
      res.json({ success: true, account: publicAccount });
    } else {
      res.status(404).json({ success: false, message: 'Account not found' });
    }
  });

  router.put('/accounts/:userId', (req: Request, res: Response) => {
    const { userId } = req.params;
    const { email, phoneNumber, address } = req.body;
    const result = controller.ctlUpdateUserInfo(userId, email, phoneNumber, address);
    res.json({ success: result, message: result ? 'Account updated successfully' : 'Failed to update account' });
  });

  router.delete('/accounts/:userId', (req: Request, res: Response) => {
    const { userId } = req.params;
    const result = controller.ctlDeleteAccount(userId);
    res.json({ success: result, message: result ? 'Account deleted successfully' : 'Failed to delete account' });
  });

  router.put('/accounts/:userId/username', (req: Request, res: Response) => {
    const { userId } = req.params;
    const { newUsername } = req.body;
    const result = controller.ctlChangeUsername(userId, newUsername);
    res.json({ success: result, message: result ? 'Username changed successfully' : 'Failed to change username' });
  });

  router.put('/accounts/:userId/password', (req: Request, res: Response) => {
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;
    const result = controller.ctlResetPassword(userId, oldPassword, newPassword);
    res.json({ success: result, message: result ? 'Password reset successfully' : 'Failed to reset password' });
  });

  router.post('/accounts/:userId/verify', (req: Request, res: Response) => {
    const { userId } = req.params;
    const { verificationCode, method } = req.body;
    const result = controller.ctlVerifyIdentity(userId, verificationCode, method);
    res.json({ success: result, message: result ? 'Identity verified successfully' : 'Failed to verify identity' });
  });

  router.get('/accounts/:userId/login-activity', (req: Request, res: Response) => {
    res.json({ success: true, activity: controller.ctlGetLoginActivity(req.params.userId) });
  });
  router.post('/accounts/:userId/2fa/enable', (req: Request, res: Response) => {
    const success = controller.ctlSetTwoFactor(req.params.userId, true);
    res.status(success ? 200 : 404).json({ success, method: req.body.method || 'authenticator', demoCode: success ? '246810' : undefined, message: success ? 'Two-factor authentication enabled for this demo' : 'Account not found' });
  });
  router.post('/accounts/:userId/2fa/disable', (req: Request, res: Response) => {
    const success = controller.ctlSetTwoFactor(req.params.userId, false);
    res.status(success ? 200 : 404).json({ success, message: success ? 'Two-factor authentication disabled' : 'Account not found' });
  });

  router.put('/accounts/:userId/enable', (req: Request, res: Response) => {
    const { userId } = req.params;
    const result = controller.ctlEnableAccount(userId);
    res.json({ success: result, message: result ? 'Account enabled successfully' : 'Failed to enable account' });
  });

  router.put('/accounts/:userId/disable', (req: Request, res: Response) => {
    const { userId } = req.params;
    const result = controller.ctlDisableAccount(userId);
    res.json({ success: result, message: result ? 'Account disabled successfully' : 'Failed to disable account' });
  });

  // Budget endpoints
  router.post('/budgets/create', (req: Request, res: Response) => {
    const { userId, totalAmount, startDate, endDate, categories } = req.body;
    const budget = controller.ctlCreateBudget(userId, totalAmount, startDate, endDate, categories);
    res.json({ success: !!budget, budget });
  });

  router.post('/budgets/expense', (req: Request, res: Response) => {
    const { userId, amount, category, date, paymentMethod } = req.body;
    const result = controller.ctlRecordExpense(userId, amount, category, date, paymentMethod);
    res.json({ success: result });
  });

  router.get('/budgets/:userId/trends', (req: Request, res: Response) => res.json({ success: true, trends: controller.ctlGetBudgetTrends(req.params.userId) }));
  router.get('/budgets/:userId', (req: Request, res: Response) => res.json({ success: true, budgets: controller.ctlGetBudgets(req.params.userId) }));
  router.post('/budgets/:userId/alerts/check', (req: Request, res: Response) => {
    const budgets = controller.ctlGetBudgets(req.params.userId);
    const threshold = Number(req.body.thresholdPercent ?? 100);
    const alerts = budgets.filter((budget) => budget.totalAmount.amount > 0 && budget.spent / budget.totalAmount.amount * 100 >= threshold).map((budget) => ({ budgetId: budget.budgetId, spent: budget.spent, total: budget.totalAmount.amount }));
    res.json({ success: true, alerts });
  });

  // Goals endpoints
  router.post('/goals/create', (req: Request, res: Response) => {
    const { userId, goalType, targetAmount, deadline, priorityLevel } = req.body;
    const goal = controller.ctlSetGoal(userId, goalType, targetAmount, deadline, priorityLevel);
    res.json({ success: !!goal, goal });
  });

  router.get('/goals/:userId', (req: Request, res: Response) => res.json({ success: true, goals: controller.ctlGetGoals(req.params.userId) }));
  router.post('/goals/:goalId/contributions', (req: Request, res: Response) => {
    const { userId, amount } = req.body;
    const success = controller.ctlContributeToGoal(userId, req.params.goalId, Number(amount));
    res.status(success ? 200 : 400).json({ success, message: success ? 'Contribution added' : 'Goal contribution failed' });
  });
  router.post('/goals/recommendations', (req: Request, res: Response) => {
    const { userId, timeFrame = 12, riskSensitive = true } = req.body;
    const recommendation = controller.ctlGetOptimizedGoalPlan(userId, '', Number(timeFrame), Boolean(riskSensitive));
    res.json({ success: true, recommendation, demo: true });
  });

  router.get('/goals/:goalId/progress', (req: Request, res: Response) => {
    const { goalId } = req.params;
    const { userId } = req.query;
    const progress = controller.ctlTrackProgress(userId as string, goalId, true);
    res.json({ success: !!progress, progress });
  });

  // Group Savings endpoints
  router.post('/groups/create', (req: Request, res: Response) => {
    const { groupName, members } = req.body;
    const group = controller.ctlCreateGroup(groupName, members);
    res.json({ success: !!group, group });
  });

  router.post('/groups/:groupId/deposit', (req: Request, res: Response) => {
    const { groupId } = req.params;
    const { memberId, amount } = req.body;
    const result = controller.ctlProcessDeposit(groupId, memberId, amount);
    res.json({ success: result });
  });

  // Reports endpoints
  router.get('/reports/income/:userId', (req: Request, res: Response) => {
    const { userId } = req.params;
    const report = controller.ctlGenerateIncomeStatement(userId);
    res.json({ success: true, report });
  });

  router.get('/reports/monthly/:userId', (req: Request, res: Response) => {
    const { userId } = req.params;
    const report = controller.ctlGenerateMonthlySummary(userId);
    res.json({ success: true, report });
  });
  router.post('/reports/:userId', (req: Request, res: Response) => {
    const reportType = String(req.body.reportType ?? 'monthly');
    const { startDate, endDate } = req.body;
    if (!['monthly', 'income', 'spending'].includes(reportType) || (startDate && !Number.isFinite(Date.parse(startDate))) || (endDate && !Number.isFinite(Date.parse(endDate))) || (startDate && endDate && Date.parse(startDate) > Date.parse(endDate))) {
      res.status(400).json({ success: false, message: 'Choose a valid report type and date range.' });
      return;
    }
    const result = controller.ctlGenerateReport(req.params.userId, reportType, startDate, endDate);
    res.json({ success: !!result, report: result?.content, reportType, generatedAt: result?.generatedAt });
  });
  router.get('/reports/:userId/export', (req: Request, res: Response) => {
    const type = ['income', 'spending'].includes(String(req.query.type)) ? String(req.query.type) : 'monthly';
    const startDate = typeof req.query.startDate === 'string' ? req.query.startDate : undefined;
    const endDate = typeof req.query.endDate === 'string' ? req.query.endDate : undefined;
    const result = controller.ctlGenerateReport(req.params.userId, type, startDate, endDate);
    if (!result) { res.status(400).json({ success: false, message: 'Report could not be created.' }); return; }
    const content = result.content;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=sigmapay-${type}-report.csv`);
    res.send(`"${type} report","Generated"\n"${content.replace(/"/g, '""').replace(/\n/g, ' | ')}","${new Date().toISOString()}"\n`);
  });

  // Payment endpoints
  router.post('/payments/process', (req: Request, res: Response) => {
    const { userId, methodId, amount, merchantId } = req.body;
    const result = controller.ctlProcessPayment(userId, methodId, amount, merchantId);
    res.json({ success: result });
  });

  router.post('/payments/refund', (req: Request, res: Response) => {
    const { userId, transactionId, amount, reason } = req.body;
    const result = controller.ctlRequestRefund(userId, transactionId, amount, reason);
    res.json({ success: result });
  });

  router.post('/payments/verify', (req: Request, res: Response) => {
    const { userId, methodId, CVV } = req.body;
    const result = controller.ctlVerifyPaymentMethod(userId, methodId, CVV);
    res.json({ success: result, message: result ? 'Payment method verified' : 'Verification failed' });
  });
  router.get('/payments/:userId/recurring', (req: Request, res: Response) => res.json({ success: true, payments: controller.ctlGetPayments(req.params.userId).filter((payment) => !!payment.recurrenceFrequency) }));
  router.get('/payments/:userId', (req: Request, res: Response) => res.json({ success: true, payments: controller.ctlGetPayments(req.params.userId) }));
  router.post('/payments/recurring', (req: Request, res: Response) => {
    const { userId, methodId, amount, merchantId, frequency, nextRunAt } = req.body;
    const payment = controller.ctlSchedulePayment(userId, methodId, Number(amount), merchantId, frequency, nextRunAt);
    res.status(payment ? 201 : 400).json({ success: !!payment, payment, message: payment ? 'Recurring payment scheduled' : 'Invalid recurring payment schedule' });
  });
  router.delete('/payments/recurring/:paymentId', (req: Request, res: Response) => {
    const userId = String(req.query.userId ?? '');
    const success = controller.ctlCancelPayment(userId, req.params.paymentId);
    res.status(success ? 200 : 404).json({ success, message: success ? 'Recurring payment cancelled' : 'Scheduled payment not found' });
  });
  router.get('/bills/:userId', (req: Request, res: Response) => res.json({ success: true, bills: controller.ctlGetBills(req.params.userId) }));
  router.post('/bills', (req: Request, res: Response) => {
    const { userId, provider, accountRef, amount, dueAt, recurring } = req.body;
    const bill = controller.ctlCreateBill(userId, provider, accountRef, Number(amount), dueAt, Boolean(recurring));
    res.status(bill ? 201 : 400).json({ success: !!bill, bill, message: bill ? 'Bill added' : 'Bill details are invalid' });
  });
  router.post('/bills/:billId/pay', (req: Request, res: Response) => {
    const bill = controller.ctlPayBill(req.params.billId, req.body.userId);
    res.status(bill ? 200 : 404).json({ success: !!bill, bill, message: bill ? 'Bill marked as paid in the demo' : 'Bill not found or already paid' });
  });

  // Group Savings endpoints
  router.post('/groups/:groupId/member', (req: Request, res: Response) => {
    const { groupId } = req.params;
    const { memberId } = req.body;
    const result = controller.ctlAddMember(groupId, memberId);
    res.json({ success: result, message: result ? 'Member added successfully' : 'Failed to add member' });
  });

  router.get('/groups/:groupId/report', (req: Request, res: Response) => {
    const { groupId } = req.params;
    const report = controller.ctlGenerateGroupReport(groupId);
    res.json({ success: true, report });
  });

  // Notifications endpoints
  router.post('/notifications/alert', (req: Request, res: Response) => {
    const { userId, message } = req.body;
    const result = controller.ctlSendAlert(userId, message);
    res.json({ success: result });
  });

  router.get('/notifications/:userId', (req: Request, res: Response) => {
    const { userId } = req.params;
    const notifications = controller.ctlGetNotificationHistory(userId);
    res.json({ success: true, notifications });
  });

  router.get('/notifications/:userId/preferences', (req: Request, res: Response) => {
    res.json({ success: true, preferences: controller.ctlGetNotificationPreferences(req.params.userId) });
  });

  router.post('/notifications/preferences', (req: Request, res: Response) => {
    const { userId, preferenceType, isEnabled } = req.body;
    const result = controller.ctlSetNotificationPreference(userId, preferenceType, isEnabled);
    res.json({ success: result, message: result ? 'Preference updated successfully' : 'Failed to update preference' });
  });

  return router;
}
