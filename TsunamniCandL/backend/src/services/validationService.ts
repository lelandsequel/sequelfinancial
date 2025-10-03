import { Decimal } from '@prisma/client/runtime/library';
import { ValidationResult } from '../types/accounting';

export class ValidationService {
  /**
   * Validates that asset values are positive
   */
  static validateAssetValue(value: Decimal): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (value.isNegative()) {
      errors.push('Asset values must be positive');
    }

    if (value.isZero()) {
      warnings.push('Asset value is zero - consider if this is correct');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validates that liability amounts are positive
   */
  static validateLiabilityAmount(amount: Decimal): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (amount.isNegative()) {
      errors.push('Liability amounts must be positive');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validates that revenue amounts are positive
   */
  static validateRevenueAmount(amount: Decimal): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (amount.isNegative()) {
      errors.push('Revenue amounts must be positive');
    }

    if (amount.isZero()) {
      warnings.push('Revenue amount is zero');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validates that expense amounts are positive
   */
  static validateExpenseAmount(amount: Decimal): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (amount.isNegative()) {
      errors.push('Expense amounts must be positive');
    }

    if (amount.isZero()) {
      warnings.push('Expense amount is zero');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validates date is not in the future
   */
  static validateDateNotFuture(date: Date): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const now = new Date();
    if (date > now) {
      errors.push('Date cannot be in the future');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validates that equity calculations are correct (Assets = Liabilities + Equity)
   */
  static validateAccountingEquation(
    totalAssets: Decimal,
    totalLiabilities: Decimal,
    totalEquity: Decimal
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const leftSide = totalAssets;
    const rightSide = totalLiabilities.add(totalEquity);

    // Allow for small rounding differences (0.01 tolerance)
    const difference = leftSide.sub(rightSide).abs();

    if (difference.greaterThan(new Decimal('0.01'))) {
      errors.push(
        `Accounting equation not balanced. Assets (${leftSide.toString()}) ≠ Liabilities + Equity (${rightSide.toString()})`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validates that equity shares outstanding are positive when provided
   */
  static validateSharesOutstanding(shares?: number): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (shares !== undefined && shares < 0) {
      errors.push('Shares outstanding cannot be negative');
    }

    if (shares !== undefined && shares === 0) {
      warnings.push('Shares outstanding is zero');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validates par value is positive when provided
   */
  static validateParValue(parValue?: Decimal): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (parValue !== undefined && parValue.isNegative()) {
      errors.push('Par value must be positive');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Comprehensive validation for a complete accounting entry
   */
  static validateCompleteEntry(
    assets: Decimal[],
    liabilities: Decimal[],
    revenues: Decimal[],
    expenses: Decimal[]
  ): ValidationResult {
    const allErrors: string[] = [];
    const allWarnings: string[] = [];

    // Validate all asset values
    assets.forEach((asset, index) => {
      const result = this.validateAssetValue(asset);
      if (!result.isValid) {
        allErrors.push(`Asset ${index + 1}: ${result.errors.join(', ')}`);
      }
      allWarnings.push(...result.warnings.map(w => `Asset ${index + 1}: ${w}`));
    });

    // Validate all liability amounts
    liabilities.forEach((liability, index) => {
      const result = this.validateLiabilityAmount(liability);
      if (!result.isValid) {
        allErrors.push(`Liability ${index + 1}: ${result.errors.join(', ')}`);
      }
      allWarnings.push(...result.warnings.map(w => `Liability ${index + 1}: ${w}`));
    });

    // Validate all revenue amounts
    revenues.forEach((revenue, index) => {
      const result = this.validateRevenueAmount(revenue);
      if (!result.isValid) {
        allErrors.push(`Revenue ${index + 1}: ${result.errors.join(', ')}`);
      }
      allWarnings.push(...result.warnings.map(w => `Revenue ${index + 1}: ${w}`));
    });

    // Validate all expense amounts
    expenses.forEach((expense, index) => {
      const result = this.validateExpenseAmount(expense);
      if (!result.isValid) {
        allErrors.push(`Expense ${index + 1}: ${result.errors.join(', ')}`);
      }
      allWarnings.push(...result.warnings.map(w => `Expense ${index + 1}: ${w}`));
    });

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings
    };
  }
}
