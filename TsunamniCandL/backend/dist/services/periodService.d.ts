import { Decimal } from '@prisma/client/runtime/library';
import { Period, CreatePeriodInput, UpdatePeriodInput, PeriodClosingResult, PeriodStatus, ApiResponse, PaginatedResponse, AccountingEquation } from '../types/accounting';
export declare class PeriodService {
    /**
     * Create a new accounting period
     */
    static createPeriod(input: CreatePeriodInput): Promise<ApiResponse<Period>>;
    /**
     * Get period by ID
     */
    static getPeriodById(id: string): Promise<ApiResponse<Period>>;
    /**
     * Get current period
     */
    static getCurrentPeriod(): Promise<ApiResponse<Period>>;
    /**
     * Get all periods with pagination
     */
    static getAllPeriods(page?: number, limit?: number, status?: PeriodStatus): Promise<ApiResponse<PaginatedResponse<Period>>>;
    /**
     * Update period
     */
    static updatePeriod(id: string, input: UpdatePeriodInput): Promise<ApiResponse<Period>>;
    /**
     * Close accounting period
     */
    static closePeriod(id: string, closedBy: string): Promise<ApiResponse<PeriodClosingResult>>;
    /**
     * Calculate period-end adjustments
     */
    private static calculatePeriodAdjustments;
    /**
     * Create the next period automatically
     */
    private static createNextPeriod;
    /**
     * Generate period name based on dates and type
     */
    private static generatePeriodName;
    /**
     * Get period summary with financial metrics
     */
    static getPeriodSummary(periodId: string): Promise<ApiResponse<{
        period: Period;
        totalTransactions: number;
        balancedTransactions: number;
        totalDebits: Decimal;
        totalCredits: Decimal;
        netIncome: Decimal;
        accountingEquation: AccountingEquation;
    }>>;
    /**
     * Delete period (only if open and no transactions)
     */
    static deletePeriod(id: string): Promise<ApiResponse<boolean>>;
}
//# sourceMappingURL=periodService.d.ts.map