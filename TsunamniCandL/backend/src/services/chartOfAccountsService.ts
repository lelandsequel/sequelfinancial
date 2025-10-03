import prisma from '../config/database';
import {
  ChartOfAccounts,
  CreateChartOfAccountsInput,
  UpdateChartOfAccountsInput,
  AccountType,
  AccountStatus,
  ApiResponse,
  PaginatedResponse
} from '../types/accounting';

export class ChartOfAccountsService {
  // Account numbering ranges per type
  private static readonly ACCOUNT_RANGES = {
    [AccountType.ASSET]: { min: 1000, max: 1999 },
    [AccountType.LIABILITY]: { min: 2000, max: 2999 },
    [AccountType.EQUITY]: { min: 3000, max: 3999 },
    [AccountType.REVENUE]: { min: 4000, max: 4999 },
    [AccountType.EXPENSE]: { min: 5000, max: 5999 }
  };

  /**
   * Create a new chart of accounts entry
   */
  static async createAccount(input: CreateChartOfAccountsInput): Promise<ApiResponse<ChartOfAccounts>> {
    try {
      // Validate account number
      const accountNumber = parseInt(input.accountNumber);
      if (isNaN(accountNumber)) {
        return {
          success: false,
          error: 'Account number must be numeric'
        };
      }

      // Validate account number range
      const range = this.ACCOUNT_RANGES[input.type];
      if (!range || accountNumber < range.min || accountNumber > range.max) {
        return {
          success: false,
          error: `Account number ${accountNumber} is not valid for account type ${input.type}. Valid range: ${range.min}-${range.max}`
        };
      }

      // Check if account number already exists
      const existing = await prisma.chartOfAccounts.findUnique({
        where: { accountNumber: input.accountNumber }
      });

      if (existing) {
        return {
          success: false,
          error: `Account number ${input.accountNumber} already exists`
        };
      }

      // Validate parent relationship if provided
      if (input.parentId) {
        const parent = await prisma.chartOfAccounts.findUnique({
          where: { id: input.parentId }
        });

        if (!parent) {
          return {
            success: false,
            error: 'Parent account not found'
          };
        }

        // Prevent circular references
        if (parent.parentId === input.accountNumber) {
          return {
            success: false,
            error: 'Cannot create circular parent-child relationship'
          };
        }
      }

      const account = await prisma.chartOfAccounts.create({
        data: {
          accountNumber: input.accountNumber,
          name: input.name,
          type: input.type,
          parentId: input.parentId,
          description: input.description
        },
        include: {
          parent: true,
          children: true
        }
      });

      return {
        success: true,
        data: account,
        message: 'Account created successfully'
      };
    } catch (error: any) {
      console.error('Error creating account:', error);
      return {
        success: false,
        error: 'Failed to create account'
      };
    }
  }

  /**
   * Get account by ID
   */
  static async getAccountById(id: string): Promise<ApiResponse<ChartOfAccounts>> {
    try {
      const account = await prisma.chartOfAccounts.findUnique({
        where: { id },
        include: {
          parent: true,
          children: {
            include: {
              children: true
            }
          }
        }
      });

      if (!account) {
        return {
          success: false,
          error: 'Account not found'
        };
      }

      return {
        success: true,
        data: account
      };
    } catch (error: any) {
      console.error('Error fetching account:', error);
      return {
        success: false,
        error: 'Failed to fetch account'
      };
    }
  }

  /**
   * Get account by account number
   */
  static async getAccountByNumber(accountNumber: string): Promise<ApiResponse<ChartOfAccounts>> {
    try {
      const account = await prisma.chartOfAccounts.findUnique({
        where: { accountNumber },
        include: {
          parent: true,
          children: {
            include: {
              children: true
            }
          }
        }
      });

      if (!account) {
        return {
          success: false,
          error: 'Account not found'
        };
      }

      return {
        success: true,
        data: account
      };
    } catch (error: any) {
      console.error('Error fetching account by number:', error);
      return {
        success: false,
        error: 'Failed to fetch account'
      };
    }
  }

  /**
   * Get all accounts with pagination and filtering
   */
  static async getAllAccounts(
    page: number = 1,
    limit: number = 10,
    type?: AccountType,
    status?: AccountStatus,
    parentOnly: boolean = false
  ): Promise<ApiResponse<PaginatedResponse<ChartOfAccounts>>> {
    try {
      const skip = (page - 1) * limit;

      const where: any = {};
      if (type) where.type = type;
      if (status) where.status = status;
      if (parentOnly) where.parentId = null;

      const [accounts, total] = await Promise.all([
        prisma.chartOfAccounts.findMany({
          where,
          skip,
          take: limit,
          orderBy: { accountNumber: 'asc' },
          include: {
            parent: true,
            children: {
              include: {
                children: true
              }
            }
          }
        }),
        prisma.chartOfAccounts.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: {
          data: accounts,
          total,
          page,
          limit,
          totalPages
        }
      };
    } catch (error: any) {
      console.error('Error fetching accounts:', error);
      return {
        success: false,
        error: 'Failed to fetch accounts'
      };
    }
  }

  /**
   * Update account
   */
  static async updateAccount(id: string, input: UpdateChartOfAccountsInput): Promise<ApiResponse<ChartOfAccounts>> {
    try {
      // Prevent updating system accounts
      const account = await prisma.chartOfAccounts.findUnique({
        where: { id }
      });

      if (!account) {
        return {
          success: false,
          error: 'Account not found'
        };
      }

      if (account.isSystem && input.status === AccountStatus.ARCHIVED) {
        return {
          success: false,
          error: 'Cannot archive system accounts'
        };
      }

      // Validate parent relationship if being updated
      if (input.parentId) {
        const parent = await prisma.chartOfAccounts.findUnique({
          where: { id: input.parentId }
        });

        if (!parent) {
          return {
            success: false,
            error: 'Parent account not found'
          };
        }

        // Prevent circular references
        if (parent.parentId === account.accountNumber) {
          return {
            success: false,
            error: 'Cannot create circular parent-child relationship'
          };
        }
      }

      const updatedAccount = await prisma.chartOfAccounts.update({
        where: { id },
        data: input,
        include: {
          parent: true,
          children: true
        }
      });

      return {
        success: true,
        data: updatedAccount,
        message: 'Account updated successfully'
      };
    } catch (error: any) {
      console.error('Error updating account:', error);
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'Account not found'
        };
      }
      return {
        success: false,
        error: 'Failed to update account'
      };
    }
  }

  /**
   * Delete account (only non-system accounts)
   */
  static async deleteAccount(id: string): Promise<ApiResponse<boolean>> {
    try {
      const account = await prisma.chartOfAccounts.findUnique({
        where: { id },
        include: {
          children: true,
          journalEntries: true
        }
      });

      if (!account) {
        return {
          success: false,
          error: 'Account not found'
        };
      }

      if (account.isSystem) {
        return {
          success: false,
          error: 'Cannot delete system accounts'
        };
      }

      if (account.children.length > 0) {
        return {
          success: false,
          error: 'Cannot delete account with child accounts. Remove children first.'
        };
      }

      if (account.journalEntries.length > 0) {
        return {
          success: false,
          error: 'Cannot delete account with transaction history. Archive instead.'
        };
      }

      await prisma.chartOfAccounts.delete({
        where: { id }
      });

      return {
        success: true,
        data: true,
        message: 'Account deleted successfully'
      };
    } catch (error: any) {
      console.error('Error deleting account:', error);
      return {
        success: false,
        error: 'Failed to delete account'
      };
    }
  }

  /**
   * Get account hierarchy (tree structure)
   */
  static async getAccountHierarchy(type?: AccountType): Promise<ApiResponse<ChartOfAccounts[]>> {
    try {
      const where: any = { parentId: null };
      if (type) where.type = type;

      const rootAccounts = await prisma.chartOfAccounts.findMany({
        where,
        include: {
          children: {
            include: {
              children: {
                include: {
                  children: true
                }
              }
            }
          }
        },
        orderBy: { accountNumber: 'asc' }
      });

      return {
        success: true,
        data: rootAccounts
      };
    } catch (error: any) {
      console.error('Error fetching account hierarchy:', error);
      return {
        success: false,
        error: 'Failed to fetch account hierarchy'
      };
    }
  }

  /**
   * Get next available account number for a type
   */
  static async getNextAccountNumber(type: AccountType): Promise<ApiResponse<string>> {
    try {
      const range = this.ACCOUNT_RANGES[type];
      if (!range) {
        return {
          success: false,
          error: 'Invalid account type'
        };
      }

      const accounts = await prisma.chartOfAccounts.findMany({
        where: {
          type,
          accountNumber: {
            gte: range.min.toString().padStart(4, '0'),
            lte: range.max.toString().padStart(4, '0')
          }
        },
        orderBy: { accountNumber: 'desc' },
        take: 1
      });

      let nextNumber = range.min;
      if (accounts.length > 0) {
        const lastNumber = parseInt(accounts[0].accountNumber);
        nextNumber = lastNumber + 1;

        // Check if we've exceeded the range
        if (nextNumber > range.max) {
          return {
            success: false,
            error: `No available account numbers for type ${type}`
          };
        }
      }

      return {
        success: true,
        data: nextNumber.toString().padStart(4, '0')
      };
    } catch (error: any) {
      console.error('Error getting next account number:', error);
      return {
        success: false,
        error: 'Failed to get next account number'
      };
    }
  }

  /**
   * Search accounts by name or number
   */
  static async searchAccounts(query: string, type?: AccountType): Promise<ApiResponse<ChartOfAccounts[]>> {
    try {
      const where: any = {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { accountNumber: { contains: query } }
        ],
        status: AccountStatus.ACTIVE
      };

      if (type) where.type = type;

      const accounts = await prisma.chartOfAccounts.findMany({
        where,
        orderBy: { accountNumber: 'asc' },
        take: 20,
        include: {
          parent: true
        }
      });

      return {
        success: true,
        data: accounts
      };
    } catch (error: any) {
      console.error('Error searching accounts:', error);
      return {
        success: false,
        error: 'Failed to search accounts'
      };
    }
  }
}
