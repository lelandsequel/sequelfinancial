import { Decimal } from '@prisma/client/runtime/library';
import { ValidationResult } from '../types/accounting';
export declare class ValidationService {
    /**
     * Validates that asset values are positive
     */
    static validateAssetValue(value: Decimal): ValidationResult;
    /**
     * Validates that liability amounts are positive
     */
    static validateLiabilityAmount(amount: Decimal): ValidationResult;
    /**
     * Validates that revenue amounts are positive
     */
    static validateRevenueAmount(amount: Decimal): ValidationResult;
    /**
     * Validates that expense amounts are positive
     */
    static validateExpenseAmount(amount: Decimal): ValidationResult;
    /**
     * Validates date is not in the future
     */
    static validateDateNotFuture(date: Date): ValidationResult;
    /**
     * Validates that equity calculations are correct (Assets = Liabilities + Equity)
     */
    static validateAccountingEquation(totalAssets: Decimal, totalLiabilities: Decimal, totalEquity: Decimal): ValidationResult;
    /**
     * Validates that equity shares outstanding are positive when provided
     */
    static validateSharesOutstanding(shares?: number): ValidationResult;
    /**
     * Validates par value is positive when provided
     */
    static validateParValue(parValue?: Decimal): ValidationResult;
    /**
     * Comprehensive validation for a complete accounting entry
     */
    static validateCompleteEntry(assets: Decimal[], liabilities: Decimal[], revenues: Decimal[], expenses: Decimal[]): ValidationResult;
}
//# sourceMappingURL=validationService.d.ts.map