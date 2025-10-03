import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../config/database';
import { Expense, CreateExpenseInput, UpdateExpenseInput, ApiResponse, PaginatedResponse } from '../types/accounting';
import { ValidationService } from './validationService';

export class ExpenseService {
  /**
   * Create a new expense entry
   */
  static async createExpense(input: CreateExpenseInput): Promise<ApiResponse<Expense>> {
    try {
      // Validate input
      const validation = ValidationService.validateExpenseAmount(input.amount);
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

      const expense = await prisma.expense.create({
        data: {
          category: input.category,
          amount: input.amount,
          date: input.date,
          description: input.description,
          vendorId: input.vendorId,
          isRecurring: input.isRecurring || false
        }
      });

      return {
        success: true,
        data: expense,
        message: 'Expense created successfully'
      };
    } catch (error) {
      console.error('Error creating expense:', error);
      return {
        success: false,
        error: 'Failed to create expense'
      };
    }
  }

  /**
   * Get expense by ID
   */
  static async getExpenseById(id: string): Promise<ApiResponse<Expense>> {
    try {
      const expense = await prisma.expense.findUnique({
        where: { id }
      });

      if (!expense) {
        return {
          success: false,
          error: 'Expense not found'
        };
      }

      return {
        success: true,
        data: expense
      };
    } catch (error) {
      console.error('Error fetching expense:', error);
      return {
        success: false,
        error: 'Failed to fetch expense'
      };
    }
  }

  /**
   * Get all expenses with pagination
   */
  static async getAllExpenses(
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<PaginatedResponse<Expense>>> {
    try {
      const skip = (page - 1) * limit;

      const [expenses, total] = await Promise.all([
        prisma.expense.findMany({
          skip,
          take: limit,
          orderBy: { date: 'desc' }
        }),
        prisma.expense.count()
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: {
          data: expenses,
          total,
          page,
          limit,
          totalPages
        }
      };
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return {
        success: false,
        error: 'Failed to fetch expenses'
      };
    }
  }

  /**
   * Update expense
   */
  static async updateExpense(id: string, input: UpdateExpenseInput): Promise<ApiResponse<Expense>> {
    try {
      // If updating amount, validate it
      if (input.amount) {
        const validation = ValidationService.validateExpenseAmount(input.amount);
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

      const expense = await prisma.expense.update({
        where: { id },
        data: input
      });

      return {
        success: true,
        data: expense,
        message: 'Expense updated successfully'
      };
    } catch (error: any) {
      console.error('Error updating expense:', error);
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'Expense not found'
        };
      }
      return {
        success: false,
        error: 'Failed to update expense'
      };
    }
  }

  /**
   * Delete expense
   */
  static async deleteExpense(id: string): Promise<ApiResponse<boolean>> {
    try {
      await prisma.expense.delete({
        where: { id }
      });

      return {
        success: true,
        data: true,
        message: 'Expense deleted successfully'
      };
    } catch (error: any) {
      console.error('Error deleting expense:', error);
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'Expense not found'
        };
      }
      return {
        success: false,
        error: 'Failed to delete expense'
      };
    }
  }

  /**
   * Get total expenses amount
   */
  static async getTotalExpenses(): Promise<ApiResponse<Decimal>> {
    try {
      const result = await prisma.expense.aggregate({
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
      console.error('Error calculating total expenses:', error);
      return {
        success: false,
        error: 'Failed to calculate total expenses'
      };
    }
  }

  /**
   * Get expenses by category
   */
  static async getExpensesByCategory(category: string): Promise<ApiResponse<Expense[]>> {
    try {
      const expenses = await prisma.expense.findMany({
        where: { category },
        orderBy: { date: 'desc' }
      });

      return {
        success: true,
        data: expenses
      };
    } catch (error) {
      console.error('Error fetching expenses by category:', error);
      return {
        success: false,
        error: 'Failed to fetch expenses by category'
      };
    }
  }

  /**
   * Get expenses within date range
   */
  static async getExpensesByDateRange(startDate: Date, endDate: Date): Promise<ApiResponse<Expense[]>> {
    try {
      const expenses = await prisma.expense.findMany({
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
        data: expenses
      };
    } catch (error) {
      console.error('Error fetching expenses by date range:', error);
      return {
        success: false,
        error: 'Failed to fetch expenses by date range'
      };
    }
  }

  /**
   * Get recurring expenses
   */
  static async getRecurringExpenses(): Promise<ApiResponse<Expense[]>> {
    try {
      const expenses = await prisma.expense.findMany({
        where: { isRecurring: true },
        orderBy: { date: 'desc' }
      });

      return {
        success: true,
        data: expenses
      };
    } catch (error) {
      console.error('Error fetching recurring expenses:', error);
      return {
        success: false,
        error: 'Failed to fetch recurring expenses'
      };
    }
  }

  /**
   * Get expense summary by category
   */
  static async getExpenseSummaryByCategory(): Promise<ApiResponse<Array<{ category: string; total: Decimal; count: number }>>> {
    try {
      const expenses = await prisma.expense.groupBy({
        by: ['category'],
        _sum: {
          amount: true
        },
        _count: {
          id: true
        },
        orderBy: {
          _sum: {
            amount: 'desc'
          }
        }
      });

      const summary = expenses.map((expense: any) => ({
        category: expense.category,
        total: expense._sum.amount || new Decimal(0),
        count: expense._count.id
      }));

      return {
        success: true,
        data: summary
      };
    } catch (error) {
      console.error('Error getting expense summary by category:', error);
      return {
        success: false,
        error: 'Failed to get expense summary by category'
      };
    }
  }
}
