// Enhanced API Client with proper error handling, typing, and request management

const API_BASE_URL = 'http://localhost:3001/api';

// ==================== Types ====================

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface RequestConfig {
  timeout?: number;
  headers?: Record<string, string>;
  retries?: number;
  cache?: boolean;
}

// ==================== Custom Errors ====================

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: ValidationError[]
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

// ==================== API Client ====================

class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number = 30000;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout: number = 5 * 60 * 1000; // 5 minutes

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Get authentication token from localStorage
  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Set authentication token
  public setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Clear authentication token
  public clearToken(): void {
    localStorage.removeItem('authToken');
  }

  // Get from cache if available and not expired
  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  // Save to cache
  private saveToCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Clear all cache
  public clearCache(): void {
    this.cache.clear();
  }

  // Core request method with retry logic, timeout, and error handling
  private async request<T>(
    endpoint: string,
    method: string = 'GET',
    body?: any,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = this.defaultTimeout,
      headers = {},
      retries = 2,
      cache = method === 'GET',
    } = config;

    const cacheKey = `${method}:${endpoint}:${JSON.stringify(body || '')}`;

    // Check cache for GET requests
    if (cache && method === 'GET') {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const makeRequest = async (attempt: number): Promise<ApiResponse<T>> => {
      try {
        const token = this.getToken();
        const requestHeaders: HeadersInit = {
          'Content-Type': 'application/json',
          ...headers,
        };

        if (token) {
          requestHeaders['Authorization'] = `Bearer ${token}`;
        }

        const options: RequestInit = {
          method,
          headers: requestHeaders,
          signal: controller.signal,
        };

        if (body) {
          options.body = JSON.stringify(body);
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, options);
        clearTimeout(timeoutId);

        const data = await response.json();

        // Handle non-200 responses
        if (!response.ok) {
          throw new ApiError(
            response.status,
            data.message || 'Request failed',
            data.errors
          );
        }

        // Cache successful GET requests
        if (cache && method === 'GET') {
          this.saveToCache(cacheKey, data);
        }

        return data;
      } catch (error: any) {
        clearTimeout(timeoutId);

        // Handle abort/timeout
        if (error.name === 'AbortError') {
          throw new TimeoutError(`Request timeout after ${timeout}ms`);
        }

        // Handle network errors
        if (error instanceof TypeError) {
          // Retry on network errors
          if (attempt < retries) {
            console.warn(`Request failed, retrying (${attempt + 1}/${retries})...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            return makeRequest(attempt + 1);
          }
          throw new NetworkError('Network error - please check your connection');
        }

        // Re-throw API errors
        if (error instanceof ApiError) {
          throw error;
        }

        // Unknown errors
        throw new Error(`Unexpected error: ${error.message}`);
      }
    };

    return makeRequest(0);
  }

  // ==================== Auth API ====================

  async register(
    username: string,
    email: string,
    password: string,
    phoneNumber: string
  ): Promise<ApiResponse<{ userId: string; token: string }>> {
    const response = await this.request<{ userId: string; token: string }>(
      '/accounts/register',
      'POST',
      { username, email, password, phoneNumber }
    );

    // Store token if registration successful
    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async login(
    email: string,
    password: string
  ): Promise<ApiResponse<{ userId: string; token: string }>> {
    const response = await this.request<{ userId: string; token: string }>(
      '/accounts/login',
      'POST',
      { email, password }
    );

    // Store token if login successful
    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async logout(): Promise<void> {
    this.clearToken();
    this.clearCache();
  }

  async getAccount(userId: string): Promise<ApiResponse> {
    return this.request(`/accounts/${userId}`, 'GET');
  }

  async updateAccount(
    userId: string,
    email: string,
    phoneNumber: string,
    address: string
  ): Promise<ApiResponse> {
    return this.request(`/accounts/${userId}`, 'PUT', {
      email,
      phoneNumber,
      address,
    });
  }

  async deleteAccount(userId: string): Promise<ApiResponse> {
    return this.request(`/accounts/${userId}`, 'DELETE');
  }

  async changeUsername(userId: string, newUsername: string): Promise<ApiResponse> {
    return this.request(`/accounts/${userId}/username`, 'PUT', { newUsername });
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<ApiResponse> {
    return this.request(`/accounts/${userId}/password`, 'PUT', {
      oldPassword,
      newPassword,
    });
  }

  async verifyIdentity(
    userId: string,
    verificationCode: string,
    method: string
  ): Promise<ApiResponse> {
    return this.request(`/accounts/${userId}/verify`, 'POST', {
      verificationCode,
      method,
    });
  }

  // ==================== Budget API ====================

  async createBudget(
    userId: string,
    totalAmount: number,
    startDate: string,
    endDate: string,
    categories: string[]
  ): Promise<ApiResponse> {
    return this.request('/budgets/create', 'POST', {
      userId,
      totalAmount,
      startDate,
      endDate,
      categories,
    });
  }

  async recordExpense(
    userId: string,
    amount: number,
    category: string,
    date: string,
    paymentMethod: string
  ): Promise<ApiResponse> {
    return this.request('/budgets/expense', 'POST', {
      userId,
      amount,
      category,
      date,
      paymentMethod,
    });
  }

  // ==================== Goals API ====================

  async createGoal(
    userId: string,
    goalType: string,
    targetAmount: number,
    deadline: string,
    priorityLevel: string
  ): Promise<ApiResponse> {
    return this.request('/goals/create', 'POST', {
      userId,
      goalType,
      targetAmount,
      deadline,
      priorityLevel,
    });
  }

  async trackProgress(userId: string, goalId: string): Promise<ApiResponse> {
    return this.request(`/goals/${goalId}/progress?userId=${userId}`, 'GET', null, {
      cache: true,
    });
  }

  // ==================== Reports API ====================

  async generateMonthlySummary(userId: string): Promise<ApiResponse> {
    return this.request(`/reports/monthly/${userId}`, 'GET', null, {
      cache: true,
      timeout: 60000, // Reports may take longer
    });
  }

  async generateIncomeStatement(userId: string): Promise<ApiResponse> {
    return this.request(`/reports/income/${userId}`, 'GET', null, {
      cache: true,
      timeout: 60000,
    });
  }

  // ==================== Payments API ====================

  async processPayment(
    userId: string,
    methodId: string,
    amount: number,
    merchantId: string
  ): Promise<ApiResponse> {
    return this.request('/payments/process', 'POST', {
      userId,
      methodId,
      amount,
      merchantId,
    });
  }

  async requestRefund(
    userId: string,
    transactionId: string,
    amount: number,
    reason: string
  ): Promise<ApiResponse> {
    return this.request('/payments/refund', 'POST', {
      userId,
      transactionId,
      amount,
      reason,
    });
  }

  async verifyPaymentMethod(
    userId: string,
    methodId: string,
    CVV: string
  ): Promise<ApiResponse> {
    return this.request('/payments/verify', 'POST', { userId, methodId, CVV });
  }

  // ==================== Group Savings API ====================

  async createGroup(groupName: string, members: string[]): Promise<ApiResponse> {
    return this.request('/groups/create', 'POST', { groupName, members });
  }

  async addMemberToGroup(groupId: string, memberId: string): Promise<ApiResponse> {
    return this.request(`/groups/${groupId}/member`, 'POST', { memberId });
  }

  async processGroupDeposit(
    groupId: string,
    memberId: string,
    amount: number
  ): Promise<ApiResponse> {
    return this.request(`/groups/${groupId}/deposit`, 'POST', { memberId, amount });
  }

  async getGroupReport(groupId: string): Promise<ApiResponse> {
    return this.request(`/groups/${groupId}/report`, 'GET', null, { cache: true });
  }

  // ==================== Notifications API ====================

  async getNotifications(userId: string): Promise<ApiResponse> {
    return this.request(`/notifications/${userId}`, 'GET', null, { cache: false });
  }

  async sendAlert(userId: string, message: string): Promise<ApiResponse> {
    return this.request('/notifications/alert', 'POST', { userId, message });
  }

  async setNotificationPreference(
    userId: string,
    preferenceType: string,
    isEnabled: boolean
  ): Promise<ApiResponse> {
    return this.request('/notifications/preferences', 'POST', {
      userId,
      preferenceType,
      isEnabled,
    });
  }
}

// Export singleton instance
const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
