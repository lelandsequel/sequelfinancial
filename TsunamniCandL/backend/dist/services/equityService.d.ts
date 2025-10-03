import { Decimal } from '@prisma/client/runtime/library';
import { Equity, CreateEquityInput, UpdateEquityInput, ApiResponse, AccountingEquation } from '../types/accounting';
export declare class EquityService {
    /**
     * Create a new equity entry
     */
    static createEquity(input: CreateEquityInput): Promise<ApiResponse<Equity>>;
    /**
     * Get equity by ID
     */
    static getEquityById(id: string): Promise<ApiResponse<Equity>>;
    /**
     * Get all equity entries
     */
    static getAllEquity(): Promise<ApiResponse<Equity[]>>;
    /**
     * Update equity
     */
    static updateEquity(id: string, input: UpdateEquityInput): Promise<ApiResponse<Equity>>;
    /**
     * Calculate and update retained earnings (Revenue - Expenses)
     */
    static calculateRetainedEarnings(): Promise<ApiResponse<Decimal>>;
    /**
     * Get total equity value (sum of all equity entries)
     */
    static getTotalEquityValue(): Promise<ApiResponse<Decimal>>;
    /**
     * Get accounting equation status
     */
    static getAccountingEquation(): Promise<ApiResponse<AccountingEquation>>;
    /**
     * Get equity by type
     */
    static getEquityByType(type: string): Promise<ApiResponse<Equity[]>>;
}
//# sourceMappingURL=equityService.d.ts.map