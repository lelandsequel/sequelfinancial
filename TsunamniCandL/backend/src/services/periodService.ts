import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../config/database';
import {
  Period,
  CreatePeriodInput,
  UpdatePeriodInput,
  PeriodClosingResult,
  PeriodType,
  PeriodStatus,
  ApiResponse,
  PaginatedResponse,
  AccountingEquation
} from '../types/accounting';
import { EquityService } from './equityService';

export class PeriodService {
  /**
   * Create a new accounting period
   */
  static async createPeriod(input: CreatePeriodInput): Promise<ApiResponse<Period>> {
    try {
      // Validate period dates
      if (input.startDate >= input.endDate) {
        return {
          success: false,
          error: 'End date must be after start date'
        };
      }

      // Check for overlapping periods
      const overlappingPeriod = await prisma.period.findFirst({
        where: {
          OR: [
            {
              AND: [
                { startDate: { lte: input.startDate } },
                { endDate: { gt: input.startDate } }
              ]
            },
            {
              AND: [
                { startDate: { lt: input.endDate } },
                { endDate: { gte: input.endDate } }
              ]
            }
          ]
        }
      });

      if (overlappingPeriod) {
        return {
          success: false,
          error: 'Period dates overlap with existing period'
        };
      }

      // If this is the first period or marked as current, set it as current
      const existingCurrent = await prisma.period.findFirst({
        where: { isCurrent: true }
      });

      const isCurrent = !existingCurrent || input.type === PeriodType.ANNUAL;

      // If setting as current, unset the previous current period
      if (isCurrent && existingCurrent) {
        await prisma.period.update({
          where: { id: existingCurrent.id },
          data: { isCurrent: false }
        });
      }

      const period = await prisma.period.create({
        data: {
          name: input.name,
          type: input.type,
          startDate: input.startDate,
          endDate: input.endDate,
          isCurrent: isCurrent,
          notes: input.notes
        }
      });

      return {
        success: true,
        data: period,
        message: 'Period created successfully'
      };
    } catch (error: any) {
      console.error('Error creating period:', error);
      return {
        success: false,
        error: 'Failed to create period'
      };
    }
  }

  /**
   * Get period by ID
   */
  static async getPeriodById(id: string): Promise<ApiResponse<Period>> {
    try {
      const period = await prisma.period.findUnique({
        where: { id },
        include: {
          transactions: {
            include: {
              journalEntries: {
                include: {
                  account: true
                }
              }
            }
          }
        }
      });

      if (!period) {
        return {
          success: false,
          error: 'Period not found'
        };
      }

      return {
        success: true,
        data: period
      };
    } catch (error: any) {
      console.error('Error fetching period:', error);
      return {
        success: false,
        error: 'Failed to fetch period'
      };
    }
  }

  /**
   * Get current period
   */
  static async getCurrentPeriod(): Promise<ApiResponse<Period>> {
    try {
      const period = await prisma.period.findFirst({
        where: { isCurrent: true },
        include: {
          transactions: {
            include: {
              journalEntries: {
                include: {
                  account: true
                }
              }
            }
          }
        }
      });

      if (!period) {
        return {
          success: false,
          error: 'No current period found'
        };
      }

      return {
        success: true,
        data: period
      };
    } catch (error: any) {
      console.error('Error fetching current period:', error);
      return {
        success: false,
        error: 'Failed to fetch current period'
      };
    }
  }

  /**
   * Get all periods with pagination
   */
  static async getAllPeriods(
    page: number = 1,
    limit: number = 10,
    status?: PeriodStatus
  ): Promise<ApiResponse<PaginatedResponse<Period>>> {
    try {
      const skip = (page - 1) * limit;

      const where: any = {};
      if (status) where.status = status;

      const [periods, total] = await Promise.all([
        prisma.period.findMany({
          where,
          skip,
          take: limit,
          orderBy: { startDate: 'desc' },
          include: {
            transactions: {
              select: {
                id: true,
                amount: true,
                isBalanced: true
              }
            }
          }
        }),
        prisma.period.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: {
          data: periods,
          total,
          page,
          limit,
          totalPages
        }
      };
    } catch (error: any) {
      console.error('Error fetching periods:', error);
      return {
        success: false,
        error: 'Failed to fetch periods'
      };
    }
  }

  /**
   * Update period
   */
  static async updatePeriod(id: string, input: UpdatePeriodInput): Promise<ApiResponse<Period>> {
    try {
      const period = await prisma.period.findUnique({
        where: { id }
      });

      if (!period) {
        return {
          success: false,
          error: 'Period not found'
        };
      }

      // Prevent updates to closed/locked periods
      if (period.status === PeriodStatus.CLOSED || period.status === PeriodStatus.LOCKED) {
        return {
          success: false,
          error: 'Cannot update closed or locked period'
        };
      }

      // If setting as current, unset the previous current period
      if (input.status === PeriodStatus.OPEN) {
        const existingCurrent = await prisma.period.findFirst({
          where: { isCurrent: true, id: { not: id } }
        });

        if (existingCurrent) {
          await prisma.period.update({
            where: { id: existingCurrent.id },
            data: { isCurrent: false }
          });
        }
      }

      const updatedPeriod = await prisma.period.update({
        where: { id },
        data: input
      });

      return {
        success: true,
        data: updatedPeriod,
        message: 'Period updated successfully'
      };
    } catch (error: any) {
      console.error('Error updating period:', error);
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'Period not found'
        };
      }
      return {
        success: false,
        error: 'Failed to update period'
      };
    }
  }

  /**
   * Close accounting period
   */
  static async closePeriod(id: string, closedBy: string): Promise<ApiResponse<PeriodClosingResult>> {
    try {
      const period = await prisma.period.findUnique({
        where: { id },
        include: {
          transactions: {
            include: {
              journalEntries: {
                include: {
                  account: true
                }
              }
            }
          }
        }
      });

      if (!period) {
        return {
          success: false,
          error: 'Period not found'
        };
      }

      if (period.status !== PeriodStatus.OPEN) {
        return {
          success: false,
          error: 'Period is not open and cannot be closed'
        };
      }

      // Check if all transactions in the period are balanced
      const unbalancedTransactions = period.transactions.filter((t: any) => !t.isBalanced);
      if (unbalancedTransactions.length > 0) {
        return {
          success: false,
          error: `Cannot close period: ${unbalancedTransactions.length} transactions are not balanced`
        };
      }

      // Calculate retained earnings adjustment
      const { retainedEarningsAdjustment, adjustmentsCount } = await this.calculatePeriodAdjustments(period.id);

      // Close the period
      const closedAt = new Date();
      await prisma.period.update({
        where: { id },
        data: {
          status: PeriodStatus.CLOSED,
          closedBy,
          closedAt,
          isCurrent: false
        }
      });

      // Create the next period automatically if this was the current period
      if (period.isCurrent) {
        await this.createNextPeriod(period);
      }

      return {
        success: true,
        data: {
          periodId: id,
          closedAt,
          closedBy,
          adjustmentsCount,
          retainedEarningsAdjustment,
          success: true,
          message: `Period closed successfully. Retained earnings adjusted by $${retainedEarningsAdjustment.toString()}`
        }
      };
    } catch (error: any) {
      console.error('Error closing period:', error);
      return {
        success: false,
        error: 'Failed to close period'
      };
    }
  }

  /**
   * Calculate period-end adjustments
   */
  private static async calculatePeriodAdjustments(periodId: string): Promise<{
    retainedEarningsAdjustment: Decimal;
    adjustmentsCount: number;
  }> {
    // Calculate net income for the period
    const periodTransactions = await prisma.transaction.findMany({
      where: { periodId },
      include: {
        journalEntries: {
          include: {
            account: true
          }
        }
      }
    });

    let netIncome = new Decimal(0);
    for (const transaction of periodTransactions) {
      // Calculate impact on retained earnings
      // Revenue increases retained earnings, expenses decrease it
      for (const entry of transaction.journalEntries) {
        if (entry.account.type === 'REVENUE') {
          netIncome = netIncome.add(entry.credit || new Decimal(0));
          netIncome = netIncome.sub(entry.debit || new Decimal(0));
        } else if (entry.account.type === 'EXPENSE') {
          netIncome = netIncome.sub(entry.credit || new Decimal(0));
          netIncome = netIncome.add(entry.debit || new Decimal(0));
        }
      }
    }

    // Update retained earnings
    await EquityService.calculateRetainedEarnings();

    return {
      retainedEarningsAdjustment: netIncome,
      adjustmentsCount: periodTransactions.length
    };
  }

  /**
   * Create the next period automatically
   */
  private static async createNextPeriod(currentPeriod: Period): Promise<void> {
    const nextStartDate = new Date(currentPeriod.endDate);
    nextStartDate.setDate(nextStartDate.getDate() + 1);

    let nextEndDate: Date;

    if (currentPeriod.type === PeriodType.MONTHLY) {
      nextEndDate = new Date(nextStartDate);
      nextEndDate.setMonth(nextEndDate.getMonth() + 1);
      nextEndDate.setDate(nextEndDate.getDate() - 1);
    } else if (currentPeriod.type === PeriodType.QUARTERLY) {
      nextEndDate = new Date(nextStartDate);
      nextEndDate.setMonth(nextEndDate.getMonth() + 3);
      nextEndDate.setDate(nextEndDate.getDate() - 1);
    } else {
      // Annual
      nextEndDate = new Date(nextStartDate);
      nextEndDate.setFullYear(nextEndDate.getFullYear() + 1);
      nextEndDate.setDate(nextEndDate.getDate() - 1);
    }

    const periodName = this.generatePeriodName(nextStartDate, nextEndDate, currentPeriod.type);

    await prisma.period.create({
      data: {
        name: periodName,
        type: currentPeriod.type,
        startDate: nextStartDate,
        endDate: nextEndDate,
        isCurrent: true
      }
    });
  }

  /**
   * Generate period name based on dates and type
   */
  private static generatePeriodName(startDate: Date, endDate: Date, type: PeriodType): string {
    if (type === PeriodType.MONTHLY) {
      return `${startDate.toLocaleString('default', { month: 'long' })} ${startDate.getFullYear()}`;
    } else if (type === PeriodType.QUARTERLY) {
      const quarter = Math.floor(startDate.getMonth() / 3) + 1;
      return `Q${quarter} ${startDate.getFullYear()}`;
    } else {
      return `FY ${startDate.getFullYear()}`;
    }
  }

  /**
   * Get period summary with financial metrics
   */
  static async getPeriodSummary(periodId: string): Promise<ApiResponse<{
    period: Period;
    totalTransactions: number;
    balancedTransactions: number;
    totalDebits: Decimal;
    totalCredits: Decimal;
    netIncome: Decimal;
    accountingEquation: AccountingEquation;
  }>> {
    try {
      const period = await prisma.period.findUnique({
        where: { id: periodId },
        include: {
          transactions: {
            include: {
              journalEntries: {
                include: {
                  account: true
                }
              }
            }
          }
        }
      });

      if (!period) {
        return {
          success: false,
          error: 'Period not found'
        };
      }

      let totalDebits = new Decimal(0);
      let totalCredits = new Decimal(0);
      let netIncome = new Decimal(0);
      let balancedTransactions = 0;

      for (const transaction of period.transactions) {
        if (transaction.isBalanced) {
          balancedTransactions++;
        }

        for (const entry of transaction.journalEntries) {
          if (entry.debit) totalDebits = totalDebits.add(entry.debit);
          if (entry.credit) totalCredits = totalCredits.add(entry.credit);

          // Calculate net income
          if (entry.account.type === 'REVENUE') {
            netIncome = netIncome.add(entry.credit || new Decimal(0));
            netIncome = netIncome.sub(entry.debit || new Decimal(0));
          } else if (entry.account.type === 'EXPENSE') {
            netIncome = netIncome.sub(entry.credit || new Decimal(0));
            netIncome = netIncome.add(entry.debit || new Decimal(0));
          }
        }
      }

      // Get accounting equation for this period
      const equationResult = await EquityService.getAccountingEquation();
      const accountingEquation = equationResult.success ? equationResult.data! : {
        totalAssets: new Decimal(0),
        totalLiabilities: new Decimal(0),
        totalEquity: new Decimal(0),
        isBalanced: false
      };

      return {
        success: true,
        data: {
          period,
          totalTransactions: period.transactions.length,
          balancedTransactions,
          totalDebits,
          totalCredits,
          netIncome,
          accountingEquation
        }
      };
    } catch (error: any) {
      console.error('Error getting period summary:', error);
      return {
        success: false,
        error: 'Failed to get period summary'
      };
    }
  }

  /**
   * Delete period (only if open and no transactions)
   */
  static async deletePeriod(id: string): Promise<ApiResponse<boolean>> {
    try {
      const period = await prisma.period.findUnique({
        where: { id },
        include: {
          transactions: true
        }
      });

      if (!period) {
        return {
          success: false,
          error: 'Period not found'
        };
      }

      if (period.status !== PeriodStatus.OPEN) {
        return {
          success: false,
          error: 'Cannot delete closed or locked period'
        };
      }

      if (period.transactions.length > 0) {
        return {
          success: false,
          error: 'Cannot delete period with transactions'
        };
      }

      await prisma.period.delete({
        where: { id }
      });

      return {
        success: true,
        data: true,
        message: 'Period deleted successfully'
      };
    } catch (error: any) {
      console.error('Error deleting period:', error);
      return {
        success: false,
        error: 'Failed to delete period'
      };
    }
  }
}
