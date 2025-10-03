import axios from 'axios';
import type {
  ApiResponse,
  PaginatedResponse,
  Asset,
  Liability,
  Equity,
  Revenue,
  Expense,
  ChartOfAccounts,
  Transaction,
  JournalEntry,
  AccountingEquation,
  CreateAssetForm,
  CreateLiabilityForm,
  CreateRevenueForm,
  CreateExpenseForm,
  CreateChartOfAccountsForm,
  CreateTransactionForm,
  FinancialRatios,
  CashFlowData,
  DashboardData
} from '../types/api';
import {
  AccountType,
  AccountStatus,
  TransactionType
} from '../types/api';

// Configure axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Asset API
export const assetApi = {
  getAll: (page = 1, limit = 10, activeOnly = true) =>
    api.get<ApiResponse<PaginatedResponse<Asset>>>(`/assets?page=${page}&limit=${limit}&activeOnly=${activeOnly}`),

  getById: (id: string) =>
    api.get<ApiResponse<Asset>>(`/assets/${id}`),

  getTotalValue: (activeOnly = true) =>
    api.get<ApiResponse<string>>(`/assets/total?activeOnly=${activeOnly}`),

  getByType: (type: string, activeOnly = true) =>
    api.get<ApiResponse<Asset[]>>(`/assets/type/${type}?activeOnly=${activeOnly}`),

  create: (data: CreateAssetForm) =>
    api.post<ApiResponse<Asset>>('/assets', data),

  update: (id: string, data: Partial<CreateAssetForm>) =>
    api.put<ApiResponse<Asset>>(`/assets/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<boolean>>(`/assets/${id}`),
};

// Liability API
export const liabilityApi = {
  getAll: (page = 1, limit = 10, activeOnly = true) =>
    api.get<ApiResponse<PaginatedResponse<Liability>>>(`/liabilities?page=${page}&limit=${limit}&activeOnly=${activeOnly}`),

  getById: (id: string) =>
    api.get<ApiResponse<Liability>>(`/liabilities/${id}`),

  getTotalAmount: (activeOnly = true) =>
    api.get<ApiResponse<string>>(`/liabilities/total?activeOnly=${activeOnly}`),

  getDueWithin: (days: number, activeOnly = true) =>
    api.get<ApiResponse<Liability[]>>(`/liabilities/due/${days}?activeOnly=${activeOnly}`),

  create: (data: CreateLiabilityForm) =>
    api.post<ApiResponse<Liability>>('/liabilities', data),

  update: (id: string, data: Partial<CreateLiabilityForm>) =>
    api.put<ApiResponse<Liability>>(`/liabilities/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<boolean>>(`/liabilities/${id}`),
};

// Equity API
export const equityApi = {
  getAll: () =>
    api.get<ApiResponse<Equity[]>>('/equity'),

  getById: (id: string) =>
    api.get<ApiResponse<Equity>>(`/equity/${id}`),

  getTotalValue: () =>
    api.get<ApiResponse<string>>('/equity/total'),

  getEquation: () =>
    api.get<ApiResponse<AccountingEquation>>('/equity/equation'),

  getByType: (type: string) =>
    api.get<ApiResponse<Equity[]>>(`/equity/type/${type}`),

  create: (data: any) =>
    api.post<ApiResponse<Equity>>('/equity', data),

  update: (id: string, data: any) =>
    api.put<ApiResponse<Equity>>(`/equity/${id}`, data),

  calculateRetainedEarnings: () =>
    api.post<ApiResponse<string>>('/equity/calculate-retained-earnings'),
};

// Revenue API
export const revenueApi = {
  getAll: (page = 1, limit = 10) =>
    api.get<ApiResponse<PaginatedResponse<Revenue>>>(`/revenue?page=${page}&limit=${limit}`),

  getById: (id: string) =>
    api.get<ApiResponse<Revenue>>(`/revenue/${id}`),

  getTotalAmount: () =>
    api.get<ApiResponse<string>>('/revenue/total'),

  getBySource: (source: string) =>
    api.get<ApiResponse<Revenue[]>>(`/revenue/source/${encodeURIComponent(source)}`),

  getRecurring: () =>
    api.get<ApiResponse<Revenue[]>>('/revenue/recurring'),

  create: (data: CreateRevenueForm) =>
    api.post<ApiResponse<Revenue>>('/revenue', data),

  update: (id: string, data: Partial<CreateRevenueForm>) =>
    api.put<ApiResponse<Revenue>>(`/revenue/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<boolean>>(`/revenue/${id}`),
};

// Expense API
export const expenseApi = {
  getAll: (page = 1, limit = 10) =>
    api.get<ApiResponse<PaginatedResponse<Expense>>>(`/expenses?page=${page}&limit=${limit}`),

  getById: (id: string) =>
    api.get<ApiResponse<Expense>>(`/expenses/${id}`),

  getTotalAmount: () =>
    api.get<ApiResponse<string>>('/expenses/total'),

  getByCategory: (category: string) =>
    api.get<ApiResponse<Expense[]>>(`/expenses/category/${encodeURIComponent(category)}`),

  getRecurring: () =>
    api.get<ApiResponse<Expense[]>>('/expenses/recurring'),

  getSummary: () =>
    api.get<ApiResponse<Array<{ category: string; total: string; count: number }>>>('/expenses/summary'),

  create: (data: CreateExpenseForm) =>
    api.post<ApiResponse<Expense>>('/expenses', data),

  update: (id: string, data: Partial<CreateExpenseForm>) =>
    api.put<ApiResponse<Expense>>(`/expenses/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<boolean>>(`/expenses/${id}`),
};

// Chart of Accounts API
export const chartOfAccountsApi = {
  getAll: (page = 1, limit = 10, type?: AccountType, status?: AccountStatus, parentOnly = false) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      parentOnly: parentOnly.toString()
    });
    if (type) params.append('type', type);
    if (status) params.append('status', status);
    return api.get<ApiResponse<PaginatedResponse<ChartOfAccounts>>>(`/chart-of-accounts?${params}`);
  },

  getHierarchy: (type?: AccountType) => {
    const params = type ? `?type=${type}` : '';
    return api.get<ApiResponse<ChartOfAccounts[]>>(`/chart-of-accounts/hierarchy${params}`);
  },

  getNextNumber: (type: AccountType) =>
    api.get<ApiResponse<string>>(`/chart-of-accounts/next-number/${type}`),

  search: (query: string, type?: AccountType) => {
    const params = new URLSearchParams({ q: query });
    if (type) params.append('type', type);
    return api.get<ApiResponse<ChartOfAccounts[]>>(`/chart-of-accounts/search?${params}`);
  },

  getById: (id: string) =>
    api.get<ApiResponse<ChartOfAccounts>>(`/chart-of-accounts/${id}`),

  getByNumber: (accountNumber: string) =>
    api.get<ApiResponse<ChartOfAccounts>>(`/chart-of-accounts/number/${accountNumber}`),

  create: (data: CreateChartOfAccountsForm) =>
    api.post<ApiResponse<ChartOfAccounts>>('/chart-of-accounts', data),

  update: (id: string, data: Partial<CreateChartOfAccountsForm & { status?: AccountStatus }>) =>
    api.put<ApiResponse<ChartOfAccounts>>(`/chart-of-accounts/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<boolean>>(`/chart-of-accounts/${id}`),
};

// Transaction API
export const transactionApi = {
  getAll: (page = 1, limit = 10, type?: TransactionType, startDate?: string, endDate?: string, isBalanced?: boolean) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    if (type) params.append('type', type);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (isBalanced !== undefined) params.append('isBalanced', isBalanced.toString());
    return api.get<ApiResponse<PaginatedResponse<Transaction>>>(`/transactions?${params}`);
  },

  getById: (id: string) =>
    api.get<ApiResponse<Transaction>>(`/transactions/${id}`),

  getSummary: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return api.get<ApiResponse<Array<{ type: TransactionType; count: number; totalAmount: string }>>>(
      `/transactions/summary${params.toString() ? `?${params}` : ''}`
    );
  },

  getUnbalanced: () =>
    api.get<ApiResponse<Transaction[]>>('/transactions/unbalanced'),

  getAccountBalance: (accountId: string, startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return api.get<ApiResponse<string>>(`/transactions/${accountId}/balance${params.toString() ? `?${params}` : ''}`);
  },

  create: (data: CreateTransactionForm) =>
    api.post<ApiResponse<Transaction>>('/transactions', data),

  update: (id: string, data: any) =>
    api.put<ApiResponse<Transaction>>(`/transactions/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<boolean>>(`/transactions/${id}`),

  balance: (id: string) =>
    api.post<ApiResponse<Transaction>>(`/transactions/${id}/balance`),

  validate: (journalEntries: any[]) =>
    api.post<ApiResponse<{ isValid: boolean; isBalanced: boolean; totalDebits: string; totalCredits: string; errors: string[]; warnings: string[] }>>(
      '/transactions/validate',
      { journalEntries }
    ),
};

// Dashboard API
export const dashboardApi = {
  getAccountingEquation: () =>
    api.get<ApiResponse<AccountingEquation>>('/equity/equation'),

  getFinancialRatios: () =>
    api.get<ApiResponse<FinancialRatios>>('/dashboard/ratios'),

  getCashFlowData: (period = 'monthly', months = 12) =>
    api.get<ApiResponse<CashFlowData[]>>(`/dashboard/cash-flow?period=${period}&months=${months}`),

  getDashboardData: () =>
    api.get<ApiResponse<DashboardData>>('/dashboard'),
};

// Health check
export const healthApi = {
  check: () =>
    api.get<{ status: string; message: string; timestamp: string }>('/../health'),
};

export default api;
