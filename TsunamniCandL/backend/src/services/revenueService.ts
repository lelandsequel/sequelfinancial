import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../config/database';
import { Revenue, CreateRevenueInput, UpdateRevenueInput, ApiResponse, PaginatedResponse } from '../types/accounting';
import { ValidationService } from './validationService';

export class RevenueService {
  /**
   * Create a new revenue entry
   */
  static async createRevenue(input: CreateRevenueInput): Promise<ApiResponse<Revenue>> {
    try {
      // Validate input
      const validation = ValidationService.validateRevenueAmount(input.amount);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', ')
        };
      }

      // Validate date
      const dateValidation = ValidationService.validateDateNotFuture(input.date);
      if (!dateValidation.isValid) {
        return {
          success: false,
          error: dateValidation.errors.join(', ')
        };
      }

      const revenue = await prisma.revenue.create({
        data: {
          source: input.source,
          amount: input.amount,
          date: input.date,
          description: input.description,
          customerId: input.customerId,
          isRecurring: input.isRecurring || false
        }
      });

      return {
        success: true,
        data: revenue,
        message: 'Revenue created successfully'
      };
    } catch (error) {
      console.error('Error creating revenue:', error);
      return {
        success: false,
        error: 'Failed to create revenue'
      };
    }
  }

  /**
   * Get revenue by ID
   */
  static async getRevenueById(id: string): Promise<ApiResponse<Revenue>> {
    try {
      const revenue = await prisma.revenue.findUnique({
        where: { id }
      });

      if (!revenue) {
        return {
          success: false,
          error: 'Revenue not found'
        };
      }

      return {
        success: true,
        data: revenue
      };
    } catch (error) {
      console.error('Error fetching revenue:', error);
      return {
        success: false,
        error: 'Failed to fetch revenue'
      };
    }
  }

  /**
   * Get all revenue with pagination
   */
  static async getAllRevenue(
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<PaginatedResponse<Revenue>>> {
    try {
      const skip = (page - 1) * limit;

      const [revenues, total] = await Promise.all([
        prisma.revenue.findMany({
          skip,
          take: limit,
          orderBy: { date: 'desc' }
        }),
        prisma.revenue.count()
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: {
          data: revenues,
          total,
          page,
          limit,
          totalPages
        }
      };
    } catch (error) {
      console.error('Error fetching revenues:', error);
      return {
        success: false,
        error: 'Failed to fetch revenues'
      };
    }
  }

  /**
   * Update revenue
   */
  static async updateRevenue(id: string, input: UpdateRevenueInput): Promise<ApiResponse<Revenue>> {
    try {
      // If updating amount, validate it
      if (input.amount) {
        const validation = ValidationService.validateRevenueAmount(input.amount);
        if (!validation.isValid) {
          return {
            success: false,
            error: validation.errors.join(', ')
          };
        }
      }

      // If updating date, validate it
      if (input.date) {
        const dateValidation = ValidationService.validateDateNotFuture(input.date);
        if (!dateValidation.isValid) {
          return {
            success: false,
            error: dateValidation.errors.join(', ')
          };
        }
      }

      const revenue = await prisma.revenue.update({
        where: { id },
        data: input
      });

      return {
        success: true,
        data: revenue,
        message: 'Revenue updated successfully'
      };
    } catch (error: any) {
      console.error('Error updating revenue:', error);
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'Revenue not found'
        };
      }
      return {
        success: false,
        error: 'Failed to update revenue'
      };
    }
  }

  /**
   * Delete revenue
   */
  static async deleteRevenue(id: string): Promise<ApiResponse<boolean>> {
    try {
      await prisma.revenue.delete({
        where: { id }
      });

      return {
        success: true,
        data: true,
        message: 'Revenue deleted successfully'
      };
    } catch (error: any) {
      console.error('Error deleting revenue:', error);
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'Revenue not found'
        };
      }
      return {
        success: false,
        error: 'Failed to delete revenue'
      };
    }
  }

  /**
   * Get total revenue amount
   */
  static async getTotalRevenue(): Promise<ApiResponse<Decimal>> {
    try {
      const result = await prisma.revenue.aggregate({
        _sum: {
          amount: true
        }
      });

      const total = result._sum.amount || new Decimal(0);

      return {
        success: true,
        data: total
      };
    } catch (error) {
      console.error('Error calculating total revenue:', error);
      return {
        success: false,
        error: 'Failed to calculate total revenue'
      };
    }
  }

  /**
   * Get revenue by source
   */
  static async getRevenueBySource(source: string): Promise<ApiResponse<Revenue[]>> {
    try {
      const revenues = await prisma.revenue.findMany({
        where: { source },
        orderBy: { date: 'desc' }
      });

      return {
        success: true,
        data: revenues
      };
    } catch (error) {
      console.error('Error fetching revenue by source:', error);
      return {
        success: false,
        error: 'Failed to fetch revenue by source'
      };
    }
  }

  /**
   * Get revenue within date range
   */
  static async getRevenueByDateRange(startDate: Date, endDate: Date): Promise<ApiResponse<Revenue[]>> {
    try {
      const revenues = await prisma.revenue.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate
          }
        },
        orderBy: { date: 'desc' }
      });

      return {
        success: true,
        data: revenues
      };
    } catch (error) {
      console.error('Error fetching revenue by date range:', error);
      return {
        success: false,
        error: 'Failed to fetch revenue by date range'
      };
    }
  }

  /**
   * Get recurring revenue
   */
  static async getRecurringRevenue(): Promise<ApiResponse<Revenue[]>> {
    try {
      const revenues = await prisma.revenue.findMany({
        where: { isRecurring: true },
        orderBy: { date: 'desc' }
      });

      return {
        success: true,
        data: revenues
      };
    } catch (error) {
      console.error('Error fetching recurring revenue:', error);
      return {
        success: false,
        error: 'Failed to fetch recurring revenue'
      };
    }
  }
}
