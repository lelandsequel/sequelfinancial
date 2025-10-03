import { Decimal } from '@prisma/client/runtime/library';
import { Expense, CreateExpenseInput, UpdateExpenseInput, ApiResponse, PaginatedResponse } from '../types/accounting';
export declare class ExpenseService {
    /**
     * Create a new expense entry
     */
    static createExpense(input: CreateExpenseInput): Promise<ApiResponse<Expense>>;
    /**
     * Get expense by ID
     */
    static getExpenseById(id: string): Promise<ApiResponse<Expense>>;
    /**
     * Get all expenses with pagination
     */
    static getAllExpenses(page?: number, limit?: number): Promise<ApiResponse<PaginatedResponse<Expense>>>;
    /**
     * Update expense
     */
    static updateExpense(id: string, input: UpdateExpenseInput): Promise<ApiResponse<Expense>>;
    /**
     * Delete expense
     */
    static deleteExpense(id: string): Promise<ApiResponse<boolean>>;
    /**
     * Get total expenses amount
     */
    static getTotalExpenses(): Promise<ApiResponse<Decimal>>;
    /**
     * Get expenses by category
     */
    static getExpensesByCategory(category: string): Promise<ApiResponse<Expense[]>>;
    /**
     * Get expenses within date range
     */
    static getExpensesByDateRange(startDate: Date, endDate: Date): Promise<ApiResponse<Expense[]>>;
    /**
     * Get recurring expenses
     */
    static getRecurringExpenses(): Promise<ApiResponse<Expense[]>>;
    /**
     * Get expense summary by category
     */
    static getExpenseSummaryByCategory(): Promise<ApiResponse<Array<{
        category: string;
        total: Decimal;
        count: number;
    }>>>;
}
//# sourceMappingURL=expenseService.d.ts.map