// API Client for communicating with the backend
const API_BASE_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api`;

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    method: string = 'GET',
    body?: any
  ): Promise<ApiResponse<T>> {
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (body !== undefined) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, options);
      let data: ApiResponse<T>;
      try {
        data = await response.json() as ApiResponse<T>;
      } catch {
        return {
          success: false,
          message: response.ok ? 'The server returned an unreadable response.' : `Request failed (${response.status}).`,
        };
      }
      if (!response.ok) {
        return { ...data, success: false, message: data.message || `Request failed (${response.status}).` };
      }
      return data;
    } catch {
      return { success: false, message: 'The service could not be reached. Check your connection and try again.' };
    }
  }

  // Auth API
  async register(username: string, email: string, password: string, phoneNumber: string) {
    return this.request('/accounts/register', 'POST', { username, email, password, phoneNumber });
  }

  async login(email: string, password: string, verificationCode?: string) {
    return this.request('/accounts/login', 'POST', { email, password, verificationCode });
  }

  async demoLogin() {
    return this.request('/accounts/demo-login', 'POST', {});
  }

  async getAccount(userId: string) {
    return this.request(`/accounts/${userId}`, 'GET');
  }

  async updateAccount(userId: string, email: string, phoneNumber: string, address: string) {
    return this.request(`/accounts/${userId}`, 'PUT', { email, phoneNumber, address });
  }

  async deleteAccount(userId: string) {
    return this.request(`/accounts/${userId}`, 'DELETE');
  }

  async changeUsername(userId: string, newUsername: string) {
    return this.request(`/accounts/${userId}/username`, 'PUT', { newUsername });
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    return this.request(`/accounts/${userId}/password`, 'PUT', { oldPassword, newPassword });
  }

  async getLoginActivity(userId: string) {
    return this.request(`/accounts/${userId}/login-activity`, 'GET');
  }

  async enableTwoFactor(userId: string, method: string) {
    return this.request(`/accounts/${userId}/2fa/enable`, 'POST', { method });
  }

  async disableTwoFactor(userId: string) {
    return this.request(`/accounts/${userId}/2fa/disable`, 'POST');
  }

  async verifyIdentity(userId: string, verificationCode: string, method: string) {
    return this.request(`/accounts/${userId}/verify`, 'POST', { verificationCode, method });
  }

  // Budget API
  async createBudget(userId: string, totalAmount: number, startDate: string, endDate: string, categories: string[]) {
    return this.request('/budgets/create', 'POST', { userId, totalAmount, startDate, endDate, categories });
  }

  async recordExpense(userId: string, amount: number, category: string, date: string, paymentMethod: string) {
    return this.request('/budgets/expense', 'POST', { userId, amount, category, date, paymentMethod });
  }

  async getBudgets(userId: string) {
    return this.request(`/budgets/${userId}`, 'GET');
  }

  async getBudgetTrends(userId: string, period = 'month') {
    return this.request(`/budgets/${userId}/trends?period=${encodeURIComponent(period)}`, 'GET');
  }

  async checkBudgetAlerts(userId: string, thresholdPercent = 100) {
    return this.request(`/budgets/${userId}/alerts/check`, 'POST', { thresholdPercent });
  }

  // Goals API
  async createGoal(userId: string, goalType: string, targetAmount: number, deadline: string, priorityLevel: string) {
    return this.request('/goals/create', 'POST', { userId, goalType, targetAmount, deadline, priorityLevel });
  }

  async getGoals(userId: string) {
    return this.request(`/goals/${userId}`, 'GET');
  }

  async contributeToGoal(goalId: string, userId: string, amount: number) {
    return this.request(`/goals/${goalId}/contributions`, 'POST', { userId, amount });
  }

  async getGoalRecommendations(userId: string, timeFrame: number, riskSensitive: boolean) {
    return this.request('/goals/recommendations', 'POST', { userId, timeFrame, riskSensitive });
  }

  async trackProgress(userId: string, goalId: string) {
    return this.request(`/goals/${goalId}/progress?userId=${userId}`, 'GET');
  }

  // Reports API
  async generateMonthlySummary(userId: string) {
    return this.request(`/reports/monthly/${userId}`, 'GET');
  }

  async generateIncomeStatement(userId: string) {
    return this.request(`/reports/income/${userId}`, 'GET');
  }

  async generateReport(userId: string, reportType: string, startDate?: string, endDate?: string) {
    return this.request(`/reports/${userId}`, 'POST', { reportType, startDate, endDate });
  }

  async exportReport(userId: string, type: 'monthly' | 'income' | 'spending', startDate?: string, endDate?: string) {
    const params = new URLSearchParams({ type });
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    return fetch(`${this.baseUrl}/reports/${encodeURIComponent(userId)}/export?${params.toString()}`);
  }

  // Payments API
  async processPayment(userId: string, methodId: string, amount: number, merchantId: string) {
    return this.request('/payments/process', 'POST', { userId, methodId, amount, merchantId });
  }

  async requestRefund(userId: string, transactionId: string, amount: number, reason: string) {
    return this.request('/payments/refund', 'POST', { userId, transactionId, amount, reason });
  }

  async verifyPaymentMethod(userId: string, methodId: string, CVV: string) {
    return this.request('/payments/verify', 'POST', { userId, methodId, CVV });
  }

  async getPaymentHistory(userId: string) {
    return this.request(`/payments/${userId}`, 'GET');
  }

  async scheduleRecurringPayment(userId: string, methodId: string, amount: number, merchantId: string, frequency: string, nextRunAt: string) {
    return this.request('/payments/recurring', 'POST', { userId, methodId, amount, merchantId, frequency, nextRunAt });
  }

  async getRecurringPayments(userId: string) {
    return this.request(`/payments/${userId}/recurring`, 'GET');
  }

  async cancelRecurringPayment(paymentId: string, userId: string) {
    return this.request(`/payments/recurring/${paymentId}?userId=${encodeURIComponent(userId)}`, 'DELETE');
  }

  async getBills(userId: string) {
    return this.request(`/bills/${userId}`, 'GET');
  }

  async createBill(userId: string, provider: string, accountRef: string, amount: number, dueAt: string, recurring: boolean) {
    return this.request('/bills', 'POST', { userId, provider, accountRef, amount, dueAt, recurring });
  }

  async payBill(billId: string, userId: string) {
    return this.request(`/bills/${billId}/pay`, 'POST', { userId });
  }

  // Group Savings API
  async createGroup(groupName: string, members: string[]) {
    return this.request('/groups/create', 'POST', { groupName, members });
  }

  async addMemberToGroup(groupId: string, memberId: string) {
    return this.request(`/groups/${groupId}/member`, 'POST', { memberId });
  }

  async processGroupDeposit(groupId: string, memberId: string, amount: number) {
    return this.request(`/groups/${groupId}/deposit`, 'POST', { memberId, amount });
  }

  async getGroupReport(groupId: string) {
    return this.request(`/groups/${groupId}/report`, 'GET');
  }

  // Notifications API
  async getNotifications(userId: string) {
    return this.request(`/notifications/${userId}`, 'GET');
  }

  async getNotificationPreferences(userId: string) {
    return this.request(`/notifications/${userId}/preferences`, 'GET');
  }

  async sendAlert(userId: string, message: string) {
    return this.request('/notifications/alert', 'POST', { userId, message });
  }

  async setNotificationPreference(userId: string, preferenceType: string, isEnabled: boolean) {
    return this.request('/notifications/preferences', 'POST', { userId, preferenceType, isEnabled });
  }

  async getInvestmentOptions() { return this.request('/investments/options'); }
  async getInvestmentStrategy(userId: string) { return this.request(`/investments/${userId}/strategy`); }
  async saveInvestmentStrategy(userId: string, optionIds: string[]) { return this.request(`/investments/${userId}/strategy`, 'PUT', { optionIds }); }
  async getAdvisoryInsights(userId: string) { return this.request(`/advisory/${userId}/insights`); }
  async askAdvisoryQuestion(userId: string, question: string) { return this.request(`/advisory/${userId}/questions`, 'POST', { question }); }
  async requestAdvisorConsultation(userId: string, topic: string) { return this.request(`/advisory/${userId}/consultations`, 'POST', { topic }); }
  async getConsultationHistory(userId: string) { return this.request(`/advisory/${userId}/history`); }
  async getLearningResources() { return this.request('/learning/resources'); }
  async getLearningQuiz() { return this.request('/learning/quiz'); }
  async submitLearningQuiz(userId: string, answers: number[]) { return this.request('/learning/quiz/submit', 'POST', { userId, answers }); }
  async getLearningHistory(userId: string) { return this.request(`/learning/${userId}/history`); }
  async getOffers() { return this.request('/offers'); }
  async getCardActivity(userId: string) { return this.request(`/cards/${userId}/activity`); }
  async getFinancialConnections(userId: string) { return this.request(`/connections/${userId}`); }
}

const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
