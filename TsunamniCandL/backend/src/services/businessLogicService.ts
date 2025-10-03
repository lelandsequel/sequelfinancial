import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../config/database';
import {
  TransactionType,
  AccountType,
  PeriodType,
  PeriodStatus,
  ApiResponse,
  AccountingEquation,
  FinancialRatios
} from '../types/accounting';

export class BusinessLogicService {
  /**
   * Calculate comprehensive financial ratios for a period
   */
  static async calculateFinancialRatios(periodId?: string): Promise<ApiResponse<FinancialRatios>> {
    try {
      // Get accounting equation data
      const equationResult = await this.getAccountingEquation(periodId);
      if (!equationResult.success) {
        return { success: false, error: equationResult.error };
      }

      const equation = equationResult.data!;

      // Calculate ratios
      const totalAssets = parseFloat(equation.totalAssets.toString());
      const totalLiabilities = parseFloat(equation.totalLiabilities.toString());
      const totalEquity = parseFloat(equation.totalEquity.toString());

      const ratios: FinancialRatios = {
        currentRatio: totalAssets > 0 ? (totalAssets / totalLiabilities).toFixed(2) : '0.00',
        debtToEquityRatio: totalEquity > 0 ? (totalLiabilities / totalEquity).toFixed(2) : '0.00',
        profitMargin: await this.calculateProfitMargin(periodId),
        returnOnAssets: await this.calculateReturnOnAssets(periodId),
        returnOnEquity: await this.calculateReturnOnEquity(periodId),
      };

      return {
        success: true,
        data: ratios
      };
    } catch (error: any) {
      console.error('Error calculating financial ratios:', error);
      return {
        success: false,
        error: 'Failed to calculate financial ratios'
      };
    }
  }

  /**
   * Generate income statement for a period
   */
  static async generateIncomeStatement(periodId?: string): Promise<ApiResponse<{
    revenues: { account: string; amount: Decimal }[];
    expenses: { account: string; amount: Decimal }[];
    netIncome: Decimal;
    period: { name: string; startDate: string; endDate: string };
  }>> {
    try {
      let transactions: any[];
      let periodInfo: { name: string; startDate: string; endDate: string };

      if (periodId) {
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
          return { success: false, error: 'Period not found' };
        }

        transactions = period.transactions;
        periodInfo = {
          name: period.name,
          startDate: period.startDate.toISOString().split('T')[0],
          endDate: period.endDate.toISOString().split('T')[0]
        };
      } else {
        // Get all transactions if no period specified
        transactions = await prisma.transaction.findMany({
          where: { isBalanced: true },
          include: {
            journalEntries: {
              include: {
                account: true
              }
            }
          }
        });

        const currentDate = new Date().toISOString().split('T')[0];
        periodInfo = {
          name: 'All Periods',
          startDate: 'N/A',
          endDate: currentDate
        };
      }

      const revenues: { account: string; amount: Decimal }[] = [];
      const expenses: { account: string; amount: Decimal }[] = [];
      let totalRevenues = new Decimal(0);
      let totalExpenses = new Decimal(0);

      // Aggregate revenues and expenses from journal entries
      for (const transaction of transactions) {
        if (!transaction.isBalanced) continue;

        for (const entry of transaction.journalEntries) {
          if (entry.account.type === AccountType.REVENUE) {
            // Revenue: Credit increases, Debit decreases
            const amount = entry.credit || new Decimal(0).sub(entry.debit || new Decimal(0));
            if (amount.greaterThan(0)) {
              revenues.push({ account: entry.account.name, amount });
              totalRevenues = totalRevenues.add(amount);
            }
          } else if (entry.account.type === AccountType.EXPENSE) {
            // Expense: Debit increases, Credit decreases
            const amount = entry.debit || new Decimal(0).sub(entry.credit || new Decimal(0));
            if (amount.greaterThan(0)) {
              expenses.push({ account: entry.account.name, amount });
              totalExpenses = totalExpenses.add(amount);
            }
          }
        }
      }

      const netIncome = totalRevenues.sub(totalExpenses);

      return {
        success: true,
        data: {
          revenues,
          expenses,
          netIncome,
          period: periodInfo
        }
      };
    } catch (error: any) {
      console.error('Error generating income statement:', error);
      return {
        success: false,
        error: 'Failed to generate income statement'
      };
    }
  }

  /**
   * Generate balance sheet for a specific date
   */
  static async generateBalanceSheet(asOfDate?: Date): Promise<ApiResponse<{
    assets: { current: { account: string; amount: Decimal }[]; fixed: { account: string; amount: Decimal }[] };
    liabilities: { current: { account: string; amount: Decimal }[]; longTerm: { account: string; amount: Decimal }[] };
    equity: { account: string; amount: Decimal }[];
    totalAssets: Decimal;
    totalLiabilities: Decimal;
    totalEquity: Decimal;
    asOfDate: string;
  }>> {
    try {
      const referenceDate = asOfDate || new Date();

      // Get all transactions up to the reference date
      const transactions = await prisma.transaction.findMany({
        where: {
          date: { lte: referenceDate },
          isBalanced: true
        },
        include: {
          journalEntries: {
            include: {
              account: true
            }
          }
        }
      });

      // Calculate balances for each account
      const accountBalances = new Map<string, { account: any; balance: Decimal }>();

      for (const transaction of transactions) {
        for (const entry of transaction.journalEntries) {
          const accountId = entry.accountId;
          const currentBalance = accountBalances.get(accountId)?.balance || new Decimal(0);

          // Normal balance logic:
          // Assets: Debit increases, Credit decreases
          // Liabilities: Credit increases, Debit decreases
          // Equity: Credit increases, Debit decreases
          // Revenue: Credit increases, Debit decreases
          // Expenses: Debit increases, Credit decreases

          let balanceChange = new Decimal(0);
          if (entry.debit) {
            if ([AccountType.ASSET, AccountType.EXPENSE].includes(entry.account.type)) {
              balanceChange = balanceChange.add(entry.debit);
            } else {
              balanceChange = balanceChange.sub(entry.debit);
            }
          }
          if (entry.credit) {
            if ([AccountType.ASSET, AccountType.EXPENSE].includes(entry.account.type)) {
              balanceChange = balanceChange.sub(entry.credit);
            } else {
              balanceChange = balanceChange.add(entry.credit);
            }
          }

          const newBalance = currentBalance.add(balanceChange);
          accountBalances.set(accountId, {
            account: entry.account,
            balance: newBalance
          });
        }
      }

      // Organize by category
      const assets = { current: [] as any[], fixed: [] as any[] };
      const liabilities = { current: [] as any[], longTerm: [] as any[] };
      const equity = [] as any[];

      let totalAssets = new Decimal(0);
      let totalLiabilities = new Decimal(0);
      let totalEquity = new Decimal(0);

      for (const [_, { account, balance }] of accountBalances) {
        if (balance.equals(0)) continue;

        switch (account.type) {
          case AccountType.ASSET:
            if (account.accountNumber.startsWith('1')) { // Current assets
              assets.current.push({ account: account.name, amount: balance });
            } else { // Fixed assets
              assets.fixed.push({ account: account.name, amount: balance });
            }
            totalAssets = totalAssets.add(balance);
            break;
          case AccountType.LIABILITY:
            if (account.accountNumber.startsWith('2')) { // Current liabilities
              liabilities.current.push({ account: account.name, amount: balance });
            } else { // Long-term liabilities
              liabilities.longTerm.push({ account: account.name, amount: balance });
            }
            totalLiabilities = totalLiabilities.add(balance);
            break;
          case AccountType.EQUITY:
            equity.push({ account: account.name, amount: balance });
            totalEquity = totalEquity.add(balance);
            break;
        }
      }

      return {
        success: true,
        data: {
          assets,
          liabilities,
          equity,
          totalAssets,
          totalLiabilities,
          totalEquity,
          asOfDate: referenceDate.toISOString().split('T')[0]
        }
      };
    } catch (error: any) {
      console.error('Error generating balance sheet:', error);
      return {
        success: false,
        error: 'Failed to generate balance sheet'
      };
    }
  }

  /**
   * Create accrual entries for period-end adjustments
   */
  static async createAccrualEntries(periodId: string, adjustments: {
    description: string;
    accountId: string;
    amount: Decimal;
    type: 'accrue' | 'defer';
  }[]): Promise<ApiResponse<any[]>> {
    try {
      const period = await prisma.period.findUnique({
        where: { id: periodId }
      });

      if (!period || period.status !== PeriodStatus.OPEN) {
        return { success: false, error: 'Period must be open for adjustments' };
      }

      const accrualTransactions = [];

      for (const adjustment of adjustments) {
        // Create adjusting entry
        const transaction = await prisma.transaction.create({
          data: {
            type: TransactionType.ADJUSTMENTS,
            description: `${adjustment.type === 'accrue' ? 'Accrual' : 'Deferral'}: ${adjustment.description}`,
            amount: adjustment.amount,
            date: period.endDate,
            periodId: periodId,
            reference: `ADJ-${Date.now()}`,
            journalEntries: {
              create: adjustment.type === 'accrue' ? [
                // Accrue: Debit expense, Credit liability
                {
                  accountId: adjustment.accountId, // Expense account
                  debit: adjustment.amount
                },
                {
                  accountId: await this.getAccruedLiabilityAccount(),
                  credit: adjustment.amount
                }
              ] : [
                // Defer: Debit asset, Credit revenue
                {
                  accountId: await this.getDeferredAssetAccount(),
                  debit: adjustment.amount
                },
                {
                  accountId: adjustment.accountId, // Revenue account
                  credit: adjustment.amount
                }
              ]
            },
            isBalanced: true
          }
        });

        accrualTransactions.push(transaction);
      }

      return {
        success: true,
        data: accrualTransactions,
        message: `Created ${adjustments.length} accrual/deferral entries`
      };
    } catch (error: any) {
      console.error('Error creating accrual entries:', error);
      return {
        success: false,
        error: 'Failed to create accrual entries'
      };
    }
  }

  /**
   * Generate comparative reports between periods
   */
  static async generateComparativeReport(
    periodIds: string[],
    reportType: 'income-statement' | 'balance-sheet'
  ): Promise<ApiResponse<any>> {
    try {
      const reports = [];

      for (const periodId of periodIds) {
        if (reportType === 'income-statement') {
          const result = await this.generateIncomeStatement(periodId);
          if (result.success) {
            reports.push(result.data);
          }
        } else if (reportType === 'balance-sheet') {
          const period = await prisma.period.findUnique({ where: { id: periodId } });
          if (period) {
            const result = await this.generateBalanceSheet(period.endDate);
            if (result.success) {
              reports.push({ ...result.data, period: period.name });
            }
          }
        }
      }

      return {
        success: true,
        data: {
          reportType,
          periods: reports.length,
          reports
        }
      };
    } catch (error: any) {
      console.error('Error generating comparative report:', error);
      return {
        success: false,
        error: 'Failed to generate comparative report'
      };
    }
  }

  /**
   * Calculate cash flow statement
   */
  static async generateCashFlowStatement(periodId: string): Promise<ApiResponse<{
    operatingActivities: Decimal;
    investingActivities: Decimal;
    financingActivities: Decimal;
    netCashFlow: Decimal;
    beginningCash: Decimal;
    endingCash: Decimal;
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
        return { success: false, error: 'Period not found' };
      }

      let operatingCashFlow = new Decimal(0);
      let investingCashFlow = new Decimal(0);
      let financingCashFlow = new Decimal(0);

      // Calculate cash flows from journal entries
      for (const transaction of period.transactions) {
        if (!transaction.isBalanced) continue;

        for (const entry of transaction.journalEntries) {
          if (entry.account.accountNumber === '1000') { // Cash account
            const cashChange = (entry.debit || new Decimal(0)).sub(entry.credit || new Decimal(0));

            // Classify cash flow activity
            if (this.isOperatingActivity(entry.account)) {
              operatingCashFlow = operatingCashFlow.add(cashChange);
            } else if (this.isInvestingActivity(entry.account)) {
              investingCashFlow = investingCashFlow.add(cashChange);
            } else if (this.isFinancingActivity(entry.account)) {
              financingCashFlow = financingCashFlow.add(cashChange);
            }
          }
        }
      }

      const netCashFlow = operatingCashFlow.add(investingCashFlow).add(financingCashFlow);

      // Get beginning cash balance (from previous period)
      const beginningCash = await this.getCashBalanceAtStartOfPeriod(periodId);

      return {
        success: true,
        data: {
          operatingActivities: operatingCashFlow,
          investingActivities: investingCashFlow,
          financingActivities: financingCashFlow,
          netCashFlow,
          beginningCash,
          endingCash: beginningCash.add(netCashFlow)
        }
      };
    } catch (error: any) {
      console.error('Error generating cash flow statement:', error);
      return {
        success: false,
        error: 'Failed to generate cash flow statement'
      };
    }
  }

  // Helper methods

  private static async getAccountingEquation(periodId?: string): Promise<ApiResponse<AccountingEquation>> {
    const whereClause = periodId ? { periodId } : {};

    const [assets, liabilities, equity] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          ...whereClause,
          journalEntries: {
            some: {
              account: {
                type: AccountType.ASSET
              }
            }
          }
        },
        _sum: {
          amount: true
        }
      }),
      prisma.transaction.aggregate({
        where: {
          ...whereClause,
          journalEntries: {
            some: {
              account: {
                type: AccountType.LIABILITY
              }
            }
          }
        },
        _sum: {
          amount: true
        }
      }),
      prisma.transaction.aggregate({
        where: {
          ...whereClause,
          journalEntries: {
            some: {
              account: {
                type: AccountType.EQUITY
              }
            }
          }
        },
        _sum: {
          amount: true
        }
      })
    ]);

    return {
      success: true,
      data: {
        totalAssets: assets._sum.amount || new Decimal(0),
        totalLiabilities: liabilities._sum.amount || new Decimal(0),
        totalEquity: equity._sum.amount || new Decimal(0),
        isBalanced: true // Simplified for now
      }
    };
  }

  private static async calculateProfitMargin(periodId?: string): Promise<string> {
    const whereClause = periodId ? { periodId } : {};

    const [revenues, expenses] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          ...whereClause,
          journalEntries: {
            some: {
              account: {
                type: AccountType.REVENUE
              }
            }
          }
        },
        _sum: { amount: true }
      }),
      prisma.transaction.aggregate({
        where: {
          ...whereClause,
          journalEntries: {
            some: {
              account: {
                type: AccountType.EXPENSE
              }
            }
          }
        },
        _sum: { amount: true }
      })
    ]);

    const totalRevenue = revenues._sum.amount || new Decimal(0);
    const totalExpenses = expenses._sum.amount || new Decimal(0);
    const netIncome = totalRevenue.sub(totalExpenses);

    return totalRevenue.greaterThan(0)
      ? ((parseFloat(netIncome.toString()) / parseFloat(totalRevenue.toString())) * 100).toFixed(2)
      : '0.00';
  }

  private static async calculateReturnOnAssets(periodId?: string): Promise<string> {
    const [equation, income] = await Promise.all([
      this.getAccountingEquation(periodId),
      this.calculateNetIncome(periodId)
    ]);

    if (!equation.success) return '0.00';

    const totalAssets = parseFloat(equation.data!.totalAssets.toString());
    const netIncome = parseFloat(income);

    return totalAssets > 0 ? ((netIncome / totalAssets) * 100).toFixed(2) : '0.00';
  }

  private static async calculateReturnOnEquity(periodId?: string): Promise<string> {
    const [equation, income] = await Promise.all([
      this.getAccountingEquation(periodId),
      this.calculateNetIncome(periodId)
    ]);

    if (!equation.success) return '0.00';

    const totalEquity = parseFloat(equation.data!.totalEquity.toString());
    const netIncome = parseFloat(income);

    return totalEquity > 0 ? ((netIncome / totalEquity) * 100).toFixed(2) : '0.00';
  }

  private static async calculateNetIncome(periodId?: string): Promise<string> {
    const whereClause = periodId ? { periodId } : {};

    const [revenues, expenses] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          ...whereClause,
          journalEntries: {
            some: {
              account: {
                type: AccountType.REVENUE
              }
            }
          }
        },
        _sum: { amount: true }
      }),
      prisma.transaction.aggregate({
        where: {
          ...whereClause,
          journalEntries: {
            some: {
              account: {
                type: AccountType.EXPENSE
              }
            }
          }
        },
        _sum: { amount: true }
      })
    ]);

    const totalRevenue = revenues._sum.amount || new Decimal(0);
    const totalExpenses = expenses._sum.amount || new Decimal(0);

    return totalRevenue.sub(totalExpenses).toString();
  }

  private static async getAccruedLiabilityAccount(): Promise<string> {
    const account = await prisma.chartOfAccounts.findFirst({
      where: { accountNumber: '2200' } // Accrued Liabilities
    });
    return account?.id || '';
  }

  private static async getDeferredAssetAccount(): Promise<string> {
    // Create a deferred revenue asset account if it doesn't exist
    let account = await prisma.chartOfAccounts.findFirst({
      where: { accountNumber: '1199' } // Deferred Assets
    });

    if (!account) {
      account = await prisma.chartOfAccounts.create({
        data: {
          accountNumber: '1199',
          name: 'Deferred Assets',
          type: AccountType.ASSET,
          description: 'Assets deferred to future periods'
        }
      });
    }

    return account.id;
  }

  private static isOperatingActivity(account: any): boolean {
    // Operating activities typically involve revenue, expenses, and current assets/liabilities
    return ['4000', '5000', '5100', '1100', '2000'].some(prefix =>
      account.accountNumber.startsWith(prefix)
    );
  }

  private static isInvestingActivity(account: any): boolean {
    // Investing activities involve fixed assets
    return account.accountNumber.startsWith('13');
  }

  private static isFinancingActivity(account: any): boolean {
    // Financing activities involve equity and loans
    return ['21', '30', '31'].some(prefix => account.accountNumber.startsWith(prefix));
  }

  private static async getCashBalanceAtStartOfPeriod(periodId: string): Promise<Decimal> {
    const period = await prisma.period.findUnique({
      where: { id: periodId }
    });

    if (!period) return new Decimal(0);

    // Get cash balance at the start of the period
    const transactionsBeforePeriod = await prisma.transaction.findMany({
      where: {
        date: { lt: period.startDate },
        isBalanced: true
      },
      include: {
        journalEntries: {
          where: {
            account: {
              accountNumber: '1000' // Cash account
            }
          }
        }
      }
    });

    let beginningCash = new Decimal(0);
    for (const transaction of transactionsBeforePeriod) {
      for (const entry of transaction.journalEntries) {
        beginningCash = beginningCash.add(entry.debit || new Decimal(0));
        beginningCash = beginningCash.sub(entry.credit || new Decimal(0));
      }
    }

    return beginningCash;
  }
}
