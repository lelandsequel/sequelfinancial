import { Decimal } from '@prisma/client/runtime/library';

// Enums
export enum AssetType {
  CURRENT = 'CURRENT',
  FIXED = 'FIXED'
}

export enum LiabilityType {
  CURRENT = 'CURRENT',
  LONG_TERM = 'LONG_TERM'
}

export enum EquityType {
  COMMON_STOCK = 'COMMON_STOCK',
  PREFERRED_STOCK = 'PREFERRED_STOCK',
  ADDITIONAL_PAID_IN_CAPITAL = 'ADDITIONAL_PAID_IN_CAPITAL',
  RETAINED_EARNINGS = 'RETAINED_EARNINGS'
}

export enum AccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE'
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED'
}

export enum TransactionType {
  SALES = 'SALES',
  PURCHASES = 'PURCHASES',
  PAYMENTS = 'PAYMENTS',
  RECEIPTS = 'RECEIPTS',
  ADJUSTMENTS = 'ADJUSTMENTS',
  DEPRECIATION = 'DEPRECIATION'
}

export enum PeriodType {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUAL = 'ANNUAL'
}

export enum PeriodStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  LOCKED = 'LOCKED'
}

// Asset Interfaces
export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  currentValue: Decimal;
  dateAcquired: Date;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAssetInput {
  name: string;
  type: AssetType;
  currentValue: Decimal;
  dateAcquired: Date;
  description?: string;
}

export interface UpdateAssetInput {
  name?: string;
  type?: AssetType;
  currentValue?: Decimal;
  dateAcquired?: Date;
  description?: string;
  isActive?: boolean;
}

// Liability Interfaces
export interface Liability {
  id: string;
  name: string;
  type: LiabilityType;
  amountOwed: Decimal;
  dueDate?: Date;
  creditor: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLiabilityInput {
  name: string;
  type: LiabilityType;
  amountOwed: Decimal;
  dueDate?: Date;
  creditor: string;
  description?: string;
}

export interface UpdateLiabilityInput {
  name?: string;
  type?: LiabilityType;
  amountOwed?: Decimal;
  dueDate?: Date;
  creditor?: string;
  description?: string;
  isActive?: boolean;
}

// Equity Interfaces
export interface Equity {
  id: string;
  type: EquityType;
  sharesOutstanding?: number;
  parValue?: Decimal;
  retainedEarnings: Decimal;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEquityInput {
  type: EquityType;
  sharesOutstanding?: number;
  parValue?: Decimal;
  description?: string;
}

export interface UpdateEquityInput {
  type?: EquityType;
  sharesOutstanding?: number;
  parValue?: Decimal;
  retainedEarnings?: Decimal;
  description?: string;
}

// Revenue Interfaces
export interface Revenue {
  id: string;
  source: string;
  amount: Decimal;
  date: Date;
  description?: string;
  customerId?: string;
  isRecurring: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRevenueInput {
  source: string;
  amount: Decimal;
  date: Date;
  description?: string;
  customerId?: string;
  isRecurring?: boolean;
}

export interface UpdateRevenueInput {
  source?: string;
  amount?: Decimal;
  date?: Date;
  description?: string;
  customerId?: string;
  isRecurring?: boolean;
}

// Expense Interfaces
export interface Expense {
  id: string;
  category: string;
  amount: Decimal;
  date: Date;
  description?: string;
  vendorId?: string;
  isRecurring: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExpenseInput {
  category: string;
  amount: Decimal;
  date: Date;
  description?: string;
  vendorId?: string;
  isRecurring?: boolean;
}

export interface UpdateExpenseInput {
  category?: string;
  amount?: Decimal;
  date?: Date;
  description?: string;
  vendorId?: string;
  isRecurring?: boolean;
}

// Chart of Accounts Interfaces (Phase 2)
export interface ChartOfAccounts {
  id: string;
  accountNumber: string;
  name: string;
  type: AccountType;
  status: AccountStatus;
  parentId?: string;
  description?: string;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
  parent?: ChartOfAccounts;
  children?: ChartOfAccounts[];
}

export interface CreateChartOfAccountsInput {
  accountNumber: string;
  name: string;
  type: AccountType;
  parentId?: string;
  description?: string;
}

export interface UpdateChartOfAccountsInput {
  name?: string;
  status?: AccountStatus;
  parentId?: string;
  description?: string;
}

// Period Interfaces (Phase 4)
export interface Period {
  id: string;
  name: string;
  type: PeriodType;
  status: PeriodStatus;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
  closedBy?: string;
  closedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePeriodInput {
  name: string;
  type: PeriodType;
  startDate: Date;
  endDate: Date;
  notes?: string;
}

export interface UpdatePeriodInput {
  name?: string;
  status?: PeriodStatus;
  closedBy?: string;
  closedAt?: Date;
  notes?: string;
}

export interface PeriodClosingResult {
  periodId: string;
  closedAt: Date;
  closedBy: string;
  adjustmentsCount: number;
  retainedEarningsAdjustment: Decimal;
  success: boolean;
  message: string;
}

// Transaction Interfaces (Phase 2)
export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: Decimal;
  date: Date;
  isBalanced: boolean;
  reference?: string;
  periodId: string;
  period?: Period;
  assetId?: string;
  liabilityId?: string;
  equityId?: string;
  revenueId?: string;
  expenseId?: string;
  createdAt: Date;
  updatedAt: Date;
  journalEntries?: JournalEntry[];
}

export interface CreateTransactionInput {
  type: TransactionType;
  description: string;
  amount: Decimal;
  date: Date;
  periodId: string;
  reference?: string;
  assetId?: string;
  liabilityId?: string;
  equityId?: string;
  revenueId?: string;
  expenseId?: string;
  journalEntries: CreateJournalEntryInput[];
}

export interface UpdateTransactionInput {
  type?: TransactionType;
  description?: string;
  amount?: Decimal;
  date?: Date;
  reference?: string;
  assetId?: string;
  liabilityId?: string;
  equityId?: string;
  revenueId?: string;
  expenseId?: string;
}

export interface JournalEntry {
  id: string;
  transactionId: string;
  accountId: string;
  account?: ChartOfAccounts;
  debit?: Decimal;
  credit?: Decimal;
  description?: string;
  createdAt: Date;
}

export interface CreateJournalEntryInput {
  accountId: string;
  debit?: Decimal;
  credit?: Decimal;
  description?: string;
}

// Financial Metrics Types
export interface FinancialRatios {
  currentRatio: string;
  debtToEquityRatio: string;
  profitMargin: string;
  returnOnAssets: string;
  returnOnEquity: string;
}

// Transaction Validation
export interface TransactionValidationResult {
  isValid: boolean;
  isBalanced: boolean;
  totalDebits: Decimal;
  totalCredits: Decimal;
  errors: string[];
  warnings: string[];
}

// Validation and Business Logic Types
export interface AccountingEquation {
  totalAssets: Decimal;
  totalLiabilities: Decimal;
  totalEquity: Decimal;
  isBalanced: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// API Response Types
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
