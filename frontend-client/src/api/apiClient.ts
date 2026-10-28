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

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, options);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error); // TODO: Replace with proper logging service in production
      return { success: false, message: 'Network error' };
    }
  }

  // Auth API
  async register(username: string, email: string, password: string, phoneNumber: string) {
    return this.request('/accounts/register', 'POST', { username, email, password, phoneNumber });
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

  // Goals API
  async createGoal(userId: string, goalType: string, targetAmount: number, deadline: string, priorityLevel: string) {
    return this.request('/goals/create', 'POST', { userId, goalType, targetAmount, deadline, priorityLevel });
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

  async sendAlert(userId: string, message: string) {
    return this.request('/notifications/alert', 'POST', { userId, message });
  }

  async setNotificationPreference(userId: string, preferenceType: string, isEnabled: boolean) {
    return this.request('/notifications/preferences', 'POST', { userId, preferenceType, isEnabled });
  }
}

const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
