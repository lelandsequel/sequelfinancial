// API types that mirror the backend types

// Enums as const objects (compatible with verbatimModuleSyntax)
export const AssetType = {
  CURRENT: 'CURRENT',
  FIXED: 'FIXED'
} as const;

export const LiabilityType = {
  CURRENT: 'CURRENT',
  LONG_TERM: 'LONG_TERM'
} as const;

export const EquityType = {
  COMMON_STOCK: 'COMMON_STOCK',
  PREFERRED_STOCK: 'PREFERRED_STOCK',
  ADDITIONAL_PAID_IN_CAPITAL: 'ADDITIONAL_PAID_IN_CAPITAL',
  RETAINED_EARNINGS: 'RETAINED_EARNINGS'
} as const;

export const AccountType = {
  ASSET: 'ASSET',
  LIABILITY: 'LIABILITY',
  EQUITY: 'EQUITY',
  REVENUE: 'REVENUE',
  EXPENSE: 'EXPENSE'
} as const;

export const AccountStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ARCHIVED: 'ARCHIVED'
} as const;

export const TransactionType = {
  SALES: 'SALES',
  PURCHASES: 'PURCHASES',
  PAYMENTS: 'PAYMENTS',
  RECEIPTS: 'RECEIPTS',
  ADJUSTMENTS: 'ADJUSTMENTS',
  DEPRECIATION: 'DEPRECIATION'
} as const;

// Type helpers
export type AssetType = typeof AssetType[keyof typeof AssetType];
export type LiabilityType = typeof LiabilityType[keyof typeof LiabilityType];
export type EquityType = typeof EquityType[keyof typeof EquityType];
export type AccountType = typeof AccountType[keyof typeof AccountType];
export type AccountStatus = typeof AccountStatus[keyof typeof AccountStatus];
export type TransactionType = typeof TransactionType[keyof typeof TransactionType];

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Entity interfaces
export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  currentValue: string; // Decimal as string
  dateAcquired: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Liability {
  id: string;
  name: string;
  type: LiabilityType;
  amountOwed: string;
  dueDate?: string;
  creditor: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Equity {
  id: string;
  type: EquityType;
  sharesOutstanding?: number;
  parValue?: string;
  retainedEarnings: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Revenue {
  id: string;
  source: string;
  amount: string;
  date: string;
  description?: string;
  customerId?: string;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: string;
  date: string;
  description?: string;
  vendorId?: string;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChartOfAccounts {
  id: string;
  accountNumber: string;
  name: string;
  type: AccountType;
  status: AccountStatus;
  parentId?: string;
  description?: string;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
  parent?: ChartOfAccounts;
  children?: ChartOfAccounts[];
}

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: string;
  date: string;
  isBalanced: boolean;
  reference?: string;
  assetId?: string;
  liabilityId?: string;
  equityId?: string;
  revenueId?: string;
  expenseId?: string;
  createdAt: string;
  updatedAt: string;
  journalEntries?: JournalEntry[];
}

export interface JournalEntry {
  id: string;
  transactionId: string;
  accountId: string;
  account?: ChartOfAccounts;
  debit?: string;
  credit?: string;
  description?: string;
  createdAt: string;
}

export interface AccountingEquation {
  totalAssets: string;
  totalLiabilities: string;
  totalEquity: string;
  isBalanced: boolean;
}

// Form types
export interface CreateAssetForm {
  name: string;
  type: AssetType;
  currentValue: string;
  dateAcquired: string;
  description?: string;
}

export interface CreateLiabilityForm {
  name: string;
  type: LiabilityType;
  amountOwed: string;
  dueDate?: string;
  creditor: string;
  description?: string;
}

export interface CreateRevenueForm {
  source: string;
  amount: string;
  date: string;
  description?: string;
  customerId?: string;
  isRecurring: boolean;
}

export interface CreateExpenseForm {
  category: string;
  amount: string;
  date: string;
  description?: string;
  vendorId?: string;
  isRecurring: boolean;
}

export interface CreateChartOfAccountsForm {
  accountNumber: string;
  name: string;
  type: AccountType;
  parentId?: string;
  description?: string;
}

export interface CreateTransactionForm {
  type: TransactionType;
  description: string;
  amount: string;
  date: string;
  reference?: string;
  journalEntries: CreateJournalEntryForm[];
}

export interface CreateJournalEntryForm {
  accountId: string;
  debit?: string;
  credit?: string;
  description?: string;
}

// Financial metrics types
export interface FinancialRatios {
  currentRatio: number;
  debtToEquityRatio: number;
  profitMargin: number;
  returnOnAssets: number;
  returnOnEquity: number;
}

export interface CashFlowData {
  date: string;
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
  netCashFlow: number;
}

export interface AccountBalance {
  accountId: string;
  accountNumber: string;
  accountName: string;
  balance: string;
  type: AccountType;
}

// Dashboard types
export interface DashboardData {
  accountingEquation: AccountingEquation;
  financialRatios: FinancialRatios;
  recentTransactions: Transaction[];
  topAssets: Asset[];
  topLiabilities: Liability[];
  cashFlowData: CashFlowData[];
}

// Navigation and UI types
export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  children?: NavigationItem[];
}
