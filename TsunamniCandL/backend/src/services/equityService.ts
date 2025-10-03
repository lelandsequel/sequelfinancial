import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../config/database';
import { Equity, CreateEquityInput, UpdateEquityInput, ApiResponse, PaginatedResponse, AccountingEquation } from '../types/accounting';
import { ValidationService } from './validationService';
import { AssetService } from './assetService';
import { LiabilityService } from './liabilityService';
import { RevenueService } from './revenueService';
import { ExpenseService } from './expenseService';

export class EquityService {
  /**
   * Create a new equity entry
   */
  static async createEquity(input: CreateEquityInput): Promise<ApiResponse<Equity>> {
    try {
      // Validate shares outstanding if provided
      if (input.sharesOutstanding) {
        const validation = ValidationService.validateSharesOutstanding(input.sharesOutstanding);
        if (!validation.isValid) {
          return {
            success: false,
            error: validation.errors.join(', ')
          };
        }
      }

      // Validate par value if provided
      if (input.parValue) {
        const validation = ValidationService.validateParValue(input.parValue);
        if (!validation.isValid) {
          return {
            success: false,
            error: validation.errors.join(', ')
          };
        }
      }

      const equity = await prisma.equity.create({
        data: {
          type: input.type,
          sharesOutstanding: input.sharesOutstanding,
          parValue: input.parValue,
          description: input.description
        }
      });

      return {
        success: true,
        data: equity,
        message: 'Equity created successfully'
      };
    } catch (error) {
      console.error('Error creating equity:', error);
      return {
        success: false,
        error: 'Failed to create equity'
      };
    }
  }

  /**
   * Get equity by ID
   */
  static async getEquityById(id: string): Promise<ApiResponse<Equity>> {
    try {
      const equity = await prisma.equity.findUnique({
        where: { id }
      });

      if (!equity) {
        return {
          success: false,
          error: 'Equity not found'
        };
      }

      return {
        success: true,
        data: equity
      };
    } catch (error) {
      console.error('Error fetching equity:', error);
      return {
        success: false,
        error: 'Failed to fetch equity'
      };
    }
  }

  /**
   * Get all equity entries
   */
  static async getAllEquity(): Promise<ApiResponse<Equity[]>> {
    try {
      const equity = await prisma.equity.findMany({
        orderBy: { createdAt: 'desc' }
      });

      return {
        success: true,
        data: equity
      };
    } catch (error) {
      console.error('Error fetching equity:', error);
      return {
        success: false,
        error: 'Failed to fetch equity'
      };
    }
  }

  /**
   * Update equity
   */
  static async updateEquity(id: string, input: UpdateEquityInput): Promise<ApiResponse<Equity>> {
    try {
      // Validate shares outstanding if provided
      if (input.sharesOutstanding !== undefined) {
        const validation = ValidationService.validateSharesOutstanding(input.sharesOutstanding);
        if (!validation.isValid) {
          return {
            success: false,
            error: validation.errors.join(', ')
          };
        }
      }

      // Validate par value if provided
      if (input.parValue) {
        const validation = ValidationService.validateParValue(input.parValue);
        if (!validation.isValid) {
          return {
            success: false,
            error: validation.errors.join(', ')
          };
        }
      }

      const equity = await prisma.equity.update({
        where: { id },
        data: input
      });

      return {
        success: true,
        data: equity,
        message: 'Equity updated successfully'
      };
    } catch (error: any) {
      console.error('Error updating equity:', error);
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'Equity not found'
        };
      }
      return {
        success: false,
        error: 'Failed to update equity'
      };
    }
  }

  /**
   * Calculate and update retained earnings (Revenue - Expenses)
   */
  static async calculateRetainedEarnings(): Promise<ApiResponse<Decimal>> {
    try {
      // Get total revenue
      const revenueResult = await RevenueService.getTotalRevenue();
      if (!revenueResult.success) {
        return {
          success: false,
          error: 'Failed to calculate retained earnings: ' + revenueResult.error
        };
      }

      // Get total expenses
      const expenseResult = await ExpenseService.getTotalExpenses();
      if (!expenseResult.success) {
        return {
          success: false,
          error: 'Failed to calculate retained earnings: ' + expenseResult.error
        };
      }

      const totalRevenue = revenueResult.data!;
      const totalExpenses = expenseResult.data!;
      const retainedEarnings = totalRevenue.sub(totalExpenses);

      // Update retained earnings in equity
      await prisma.equity.updateMany({
        where: { type: 'RETAINED_EARNINGS' },
        data: { retainedEarnings }
      });

      return {
        success: true,
        data: retainedEarnings,
        message: 'Retained earnings calculated and updated'
      };
    } catch (error) {
      console.error('Error calculating retained earnings:', error);
      return {
        success: false,
        error: 'Failed to calculate retained earnings'
      };
    }
  }

  /**
   * Get total equity value (sum of all equity entries)
   */
  static async getTotalEquityValue(): Promise<ApiResponse<Decimal>> {
    try {
      // First ensure retained earnings are up to date
      await this.calculateRetainedEarnings();

      const result = await prisma.equity.aggregate({
        _sum: {
          retainedEarnings: true
        }
      });

      const total = result._sum.retainedEarnings || new Decimal(0);

      return {
        success: true,
        data: total
      };
    } catch (error) {
      console.error('Error calculating total equity value:', error);
      return {
        success: false,
        error: 'Failed to calculate total equity value'
      };
    }
  }

  /**
   * Get accounting equation status
   */
  static async getAccountingEquation(): Promise<ApiResponse<AccountingEquation>> {
    try {
      // Get total assets
      const assetResult = await AssetService.getTotalAssetValue();
      if (!assetResult.success) {
        return {
          success: false,
          error: 'Failed to get accounting equation: ' + assetResult.error
        };
      }

      // Get total liabilities
      const liabilityResult = await LiabilityService.getTotalLiabilityAmount();
      if (!liabilityResult.success) {
        return {
          success: false,
          error: 'Failed to get accounting equation: ' + liabilityResult.error
        };
      }

      // Get total equity
      const equityResult = await this.getTotalEquityValue();
      if (!equityResult.success) {
        return {
          success: false,
          error: 'Failed to get accounting equation: ' + equityResult.error
        };
      }

      const totalAssets = assetResult.data!;
      const totalLiabilities = liabilityResult.data!;
      const totalEquity = equityResult.data!;

      // Validate the equation
      const validation = ValidationService.validateAccountingEquation(
        totalAssets,
        totalLiabilities,
        totalEquity
      );

      return {
        success: true,
        data: {
          totalAssets,
          totalLiabilities,
          totalEquity,
          isBalanced: validation.isValid
        }
      };
    } catch (error) {
      console.error('Error getting accounting equation:', error);
      return {
        success: false,
        error: 'Failed to get accounting equation'
      };
    }
  }

  /**
   * Get equity by type
   */
  static async getEquityByType(type: string): Promise<ApiResponse<Equity[]>> {
    try {
      const equity = await prisma.equity.findMany({
        where: { type: type as any },
        orderBy: { createdAt: 'desc' }
      });

      return {
        success: true,
        data: equity
      };
    } catch (error) {
      console.error('Error fetching equity by type:', error);
      return {
        success: false,
        error: 'Failed to fetch equity by type'
      };
    }
  }
}
