import { Decimal } from '@prisma/client/runtime/library';
import { ApiResponse, FinancialRatios } from '../types/accounting';
export declare class BusinessLogicService {
    /**
     * Calculate comprehensive financial ratios for a period
     */
    static calculateFinancialRatios(periodId?: string): Promise<ApiResponse<FinancialRatios>>;
    /**
     * Generate income statement for a period
     */
    static generateIncomeStatement(periodId?: string): Promise<ApiResponse<{
        revenues: {
            account: string;
            amount: Decimal;
        }[];
        expenses: {
            account: string;
            amount: Decimal;
        }[];
        netIncome: Decimal;
        period: {
            name: string;
            startDate: string;
            endDate: string;
        };
    }>>;
    /**
     * Generate balance sheet for a specific date
     */
    static generateBalanceSheet(asOfDate?: Date): Promise<ApiResponse<{
        assets: {
            current: {
                account: string;
                amount: Decimal;
            }[];
            fixed: {
                account: string;
                amount: Decimal;
            }[];
        };
        liabilities: {
            current: {
                account: string;
                amount: Decimal;
            }[];
            longTerm: {
                account: string;
                amount: Decimal;
            }[];
        };
        equity: {
            account: string;
            amount: Decimal;
        }[];
        totalAssets: Decimal;
        totalLiabilities: Decimal;
        totalEquity: Decimal;
        asOfDate: string;
    }>>;
    /**
     * Create accrual entries for period-end adjustments
     */
    static createAccrualEntries(periodId: string, adjustments: {
        description: string;
        accountId: string;
        amount: Decimal;
        type: 'accrue' | 'defer';
    }[]): Promise<ApiResponse<any[]>>;
    /**
     * Generate comparative reports between periods
     */
    static generateComparativeReport(periodIds: string[], reportType: 'income-statement' | 'balance-sheet'): Promise<ApiResponse<any>>;
    /**
     * Calculate cash flow statement
     */
    static generateCashFlowStatement(periodId: string): Promise<ApiResponse<{
        operatingActivities: Decimal;
        investingActivities: Decimal;
        financingActivities: Decimal;
        netCashFlow: Decimal;
        beginningCash: Decimal;
        endingCash: Decimal;
    }>>;
    private static getAccountingEquation;
    private static calculateProfitMargin;
    private static calculateReturnOnAssets;
    private static calculateReturnOnEquity;
    private static calculateNetIncome;
    private static getAccruedLiabilityAccount;
    private static getDeferredAssetAccount;
    private static isOperatingActivity;
    private static isInvestingActivity;
    private static isFinancingActivity;
    private static getCashBalanceAtStartOfPeriod;
}
//# sourceMappingURL=businessLogicService.d.ts.map