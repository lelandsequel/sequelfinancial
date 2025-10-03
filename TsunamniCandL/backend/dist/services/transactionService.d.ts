import { Decimal } from '@prisma/client/runtime/library';
import { Transaction, CreateTransactionInput, UpdateTransactionInput, CreateJournalEntryInput, TransactionValidationResult, ApiResponse, PaginatedResponse, TransactionType } from '../types/accounting';
export declare class TransactionService {
    /**
     * Create a new transaction with journal entries (double-entry bookkeeping)
     */
    static createTransaction(input: CreateTransactionInput): Promise<ApiResponse<Transaction>>;
    /**
     * Get transaction by ID
     */
    static getTransactionById(id: string): Promise<ApiResponse<Transaction>>;
    /**
     * Get all transactions with pagination and filtering
     */
    static getAllTransactions(page?: number, limit?: number, type?: TransactionType, startDate?: Date, endDate?: Date, isBalanced?: boolean): Promise<ApiResponse<PaginatedResponse<Transaction>>>;
    /**
     * Update transaction (only non-balanced transactions can be updated)
     */
    static updateTransaction(id: string, input: UpdateTransactionInput): Promise<ApiResponse<Transaction>>;
    /**
     * Delete transaction (only non-balanced transactions can be deleted)
     */
    static deleteTransaction(id: string): Promise<ApiResponse<boolean>>;
    /**
     * Validate journal entries for balancing (debits = credits)
     */
    static validateJournalEntries(entries: CreateJournalEntryInput[]): TransactionValidationResult;
    /**
     * Get transaction summary by type
     */
    static getTransactionSummary(startDate?: Date, endDate?: Date): Promise<ApiResponse<Array<{
        type: TransactionType;
        count: number;
        totalAmount: Decimal;
    }>>>;
    /**
     * Get unbalanced transactions (for reconciliation)
     */
    static getUnbalancedTransactions(): Promise<ApiResponse<Transaction[]>>;
    /**
     * Balance a transaction (mark as balanced after manual review)
     */
    static balanceTransaction(id: string): Promise<ApiResponse<Transaction>>;
    /**
     * Get account balance from journal entries
     */
    static getAccountBalance(accountId: string, startDate?: Date, endDate?: Date): Promise<ApiResponse<Decimal>>;
}
//# sourceMappingURL=transactionService.d.ts.map