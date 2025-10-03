import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../config/database';
import { Liability, CreateLiabilityInput, UpdateLiabilityInput, ApiResponse, PaginatedResponse } from '../types/accounting';
import { ValidationService } from './validationService';

export class LiabilityService {
  /**
   * Create a new liability
   */
  static async createLiability(input: CreateLiabilityInput): Promise<ApiResponse<Liability>> {
    try {
      // Validate input
      const validation = ValidationService.validateLiabilityAmount(input.amountOwed);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', ')
        };
      }

      // Validate due date if provided
      if (input.dueDate) {
        const dateValidation = ValidationService.validateDateNotFuture(input.dueDate);
        if (!dateValidation.isValid) {
          return {
            success: false,
            error: dateValidation.errors.join(', ')
          };
        }
      }

      const liability = await prisma.liability.create({
        data: {
          name: input.name,
          type: input.type,
          amountOwed: input.amountOwed,
          dueDate: input.dueDate,
          creditor: input.creditor,
          description: input.description
        }
      });

      return {
        success: true,
        data: liability,
        message: 'Liability created successfully'
      };
    } catch (error) {
      console.error('Error creating liability:', error);
      return {
        success: false,
        error: 'Failed to create liability'
      };
    }
  }

  /**
   * Get liability by ID
   */
  static async getLiabilityById(id: string): Promise<ApiResponse<Liability>> {
    try {
      const liability = await prisma.liability.findUnique({
        where: { id }
      });

      if (!liability) {
        return {
          success: false,
          error: 'Liability not found'
        };
      }

      return {
        success: true,
        data: liability
      };
    } catch (error) {
      console.error('Error fetching liability:', error);
      return {
        success: false,
        error: 'Failed to fetch liability'
      };
    }
  }

  /**
   * Get all liabilities with pagination
   */
  static async getAllLiabilities(
    page: number = 1,
    limit: number = 10,
    activeOnly: boolean = true
  ): Promise<ApiResponse<PaginatedResponse<Liability>>> {
    try {
      const skip = (page - 1) * limit;

      const where = activeOnly ? { isActive: true } : {};

      const [liabilities, total] = await Promise.all([
        prisma.liability.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.liability.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: {
          data: liabilities,
          total,
          page,
          limit,
          totalPages
        }
      };
    } catch (error) {
      console.error('Error fetching liabilities:', error);
      return {
        success: false,
        error: 'Failed to fetch liabilities'
      };
    }
  }

  /**
   * Update liability
   */
  static async updateLiability(id: string, input: UpdateLiabilityInput): Promise<ApiResponse<Liability>> {
    try {
      // If updating amount owed, validate it
      if (input.amountOwed) {
        const validation = ValidationService.validateLiabilityAmount(input.amountOwed);
        if (!validation.isValid) {
          return {
            success: false,
            error: validation.errors.join(', ')
          };
        }
      }

      // If updating due date, validate it
      if (input.dueDate) {
        const dateValidation = ValidationService.validateDateNotFuture(input.dueDate);
        if (!dateValidation.isValid) {
          return {
            success: false,
            error: dateValidation.errors.join(', ')
          };
        }
      }

      const liability = await prisma.liability.update({
        where: { id },
        data: input
      });

      return {
        success: true,
        data: liability,
        message: 'Liability updated successfully'
      };
    } catch (error: any) {
      console.error('Error updating liability:', error);
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'Liability not found'
        };
      }
      return {
        success: false,
        error: 'Failed to update liability'
      };
    }
  }

  /**
   * Delete liability (soft delete by setting isActive to false)
   */
  static async deleteLiability(id: string): Promise<ApiResponse<boolean>> {
    try {
      await prisma.liability.update({
        where: { id },
        data: { isActive: false }
      });

      return {
        success: true,
        data: true,
        message: 'Liability deleted successfully'
      };
    } catch (error: any) {
      console.error('Error deleting liability:', error);
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'Liability not found'
        };
      }
      return {
        success: false,
        error: 'Failed to delete liability'
      };
    }
  }

  /**
   * Get total liability amount
   */
  static async getTotalLiabilityAmount(activeOnly: boolean = true): Promise<ApiResponse<Decimal>> {
    try {
      const where = activeOnly ? { isActive: true } : {};

      const result = await prisma.liability.aggregate({
        where,
        _sum: {
          amountOwed: true
        }
      });

      const total = result._sum.amountOwed || new Decimal(0);

      return {
        success: true,
        data: total
      };
    } catch (error) {
      console.error('Error calculating total liability amount:', error);
      return {
        success: false,
        error: 'Failed to calculate total liability amount'
      };
    }
  }

  /**
   * Get liabilities by type
   */
  static async getLiabilitiesByType(type: string, activeOnly: boolean = true): Promise<ApiResponse<Liability[]>> {
    try {
      const where = {
        type: type as any,
        ...(activeOnly ? { isActive: true } : {})
      };

      const liabilities = await prisma.liability.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });

      return {
        success: true,
        data: liabilities
      };
    } catch (error) {
      console.error('Error fetching liabilities by type:', error);
      return {
        success: false,
        error: 'Failed to fetch liabilities by type'
      };
    }
  }

  /**
   * Get liabilities due within a certain number of days
   */
  static async getLiabilitiesDueWithin(days: number, activeOnly: boolean = true): Promise<ApiResponse<Liability[]>> {
    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);

      const where = {
        dueDate: {
          lte: futureDate,
          gte: new Date()
        },
        ...(activeOnly ? { isActive: true } : {})
      };

      const liabilities = await prisma.liability.findMany({
        where,
        orderBy: { dueDate: 'asc' }
      });

      return {
        success: true,
        data: liabilities
      };
    } catch (error) {
      console.error('Error fetching liabilities due within period:', error);
      return {
        success: false,
        error: 'Failed to fetch liabilities due within period'
      };
    }
  }
}
