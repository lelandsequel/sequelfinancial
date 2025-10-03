"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const library_1 = require("@prisma/client/runtime/library");
const database_1 = __importDefault(require("../config/database"));
class TransactionService {
    /**
     * Create a new transaction with journal entries (double-entry bookkeeping)
     */
    static async createTransaction(input) {
        try {
            // Validate journal entries (must balance)
            const validation = this.validateJournalEntries(input.journalEntries);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: `Transaction does not balance: ${validation.errors.join(', ')}`
                };
            }
            // Create transaction with journal entries in a transaction
            const result = await database_1.default.$transaction(async (tx) => {
                // Create the transaction
                const transaction = await tx.transaction.create({
                    data: {
                        type: input.type,
                        description: input.description,
                        amount: input.amount,
                        date: input.date,
                        periodId: input.periodId,
                        reference: input.reference,
                        assetId: input.assetId,
                        liabilityId: input.liabilityId,
                        equityId: input.equityId,
                        revenueId: input.revenueId,
                        expenseId: input.expenseId,
                        isBalanced: validation.isBalanced
                    }
                });
                // Create journal entries
                const journalEntries = input.journalEntries.map(entry => ({
                    transactionId: transaction.id,
                    accountId: entry.accountId,
                    debit: entry.debit,
                    credit: entry.credit,
                    description: entry.description
                }));
                await tx.journalEntry.createMany({
                    data: journalEntries
                });
                // Return transaction with journal entries
                return await tx.transaction.findUnique({
                    where: { id: transaction.id },
                    include: {
                        journalEntries: {
                            include: {
                                account: true
                            }
                        }
                    }
                });
            });
            return {
                success: true,
                data: result,
                message: 'Transaction created successfully'
            };
        }
        catch (error) {
            console.error('Error creating transaction:', error);
            return {
                success: false,
                error: 'Failed to create transaction'
            };
        }
    }
    /**
     * Get transaction by ID
     */
    static async getTransactionById(id) {
        try {
            const transaction = await database_1.default.transaction.findUnique({
                where: { id },
                include: {
                    journalEntries: {
                        include: {
                            account: true
                        },
                        orderBy: {
                            debit: 'desc' // Debits first, then credits
                        }
                    },
                    asset: true,
                    liability: true,
                    equity: true,
                    revenue: true,
                    expense: true
                }
            });
            if (!transaction) {
                return {
                    success: false,
                    error: 'Transaction not found'
                };
            }
            return {
                success: true,
                data: transaction
            };
        }
        catch (error) {
            console.error('Error fetching transaction:', error);
            return {
                success: false,
                error: 'Failed to fetch transaction'
            };
        }
    }
    /**
     * Get all transactions with pagination and filtering
     */
    static async getAllTransactions(page = 1, limit = 10, type, startDate, endDate, isBalanced) {
        try {
            const skip = (page - 1) * limit;
            const where = {};
            if (type)
                where.type = type;
            if (isBalanced !== undefined)
                where.isBalanced = isBalanced;
            if (startDate || endDate) {
                where.date = {};
                if (startDate)
                    where.date.gte = startDate;
                if (endDate)
                    where.date.lte = endDate;
            }
            const [transactions, total] = await Promise.all([
                database_1.default.transaction.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { date: 'desc' },
                    include: {
                        journalEntries: {
                            include: {
                                account: true
                            }
                        }
                    }
                }),
                database_1.default.transaction.count({ where })
            ]);
            const totalPages = Math.ceil(total / limit);
            return {
                success: true,
                data: {
                    data: transactions,
                    total,
                    page,
                    limit,
                    totalPages
                }
            };
        }
        catch (error) {
            console.error('Error fetching transactions:', error);
            return {
                success: false,
                error: 'Failed to fetch transactions'
            };
        }
    }
    /**
     * Update transaction (only non-balanced transactions can be updated)
     */
    static async updateTransaction(id, input) {
        try {
            const transaction = await database_1.default.transaction.findUnique({
                where: { id }
            });
            if (!transaction) {
                return {
                    success: false,
                    error: 'Transaction not found'
                };
            }
            if (transaction.isBalanced) {
                return {
                    success: false,
                    error: 'Cannot update a balanced transaction'
                };
            }
            const updatedTransaction = await database_1.default.transaction.update({
                where: { id },
                data: input,
                include: {
                    journalEntries: {
                        include: {
                            account: true
                        }
                    }
                }
            });
            return {
                success: true,
                data: updatedTransaction,
                message: 'Transaction updated successfully'
            };
        }
        catch (error) {
            console.error('Error updating transaction:', error);
            if (error.code === 'P2025') {
                return {
                    success: false,
                    error: 'Transaction not found'
                };
            }
            return {
                success: false,
                error: 'Failed to update transaction'
            };
        }
    }
    /**
     * Delete transaction (only non-balanced transactions can be deleted)
     */
    static async deleteTransaction(id) {
        try {
            const transaction = await database_1.default.transaction.findUnique({
                where: { id },
                include: {
                    journalEntries: true
                }
            });
            if (!transaction) {
                return {
                    success: false,
                    error: 'Transaction not found'
                };
            }
            if (transaction.isBalanced) {
                return {
                    success: false,
                    error: 'Cannot delete a balanced transaction'
                };
            }
            await database_1.default.transaction.delete({
                where: { id }
            });
            return {
                success: true,
                data: true,
                message: 'Transaction deleted successfully'
            };
        }
        catch (error) {
            console.error('Error deleting transaction:', error);
            return {
                success: false,
                error: 'Failed to delete transaction'
            };
        }
    }
    /**
     * Validate journal entries for balancing (debits = credits)
     */
    static validateJournalEntries(entries) {
        const errors = [];
        const warnings = [];
        if (entries.length < 2) {
            errors.push('Transaction must have at least 2 journal entries');
        }
        let totalDebits = new library_1.Decimal(0);
        let totalCredits = new library_1.Decimal(0);
        // Check for duplicate accounts
        const accountIds = new Set();
        for (const entry of entries) {
            if (accountIds.has(entry.accountId)) {
                errors.push(`Duplicate account ${entry.accountId} in transaction`);
            }
            accountIds.add(entry.accountId);
            // Validate amounts
            if (entry.debit && entry.credit) {
                errors.push('Entry cannot have both debit and credit amounts');
            }
            if (!entry.debit && !entry.credit) {
                errors.push('Entry must have either debit or credit amount');
            }
            if (entry.debit) {
                if (entry.debit.isNegative()) {
                    errors.push('Debit amounts must be positive');
                }
                totalDebits = totalDebits.add(entry.debit);
            }
            if (entry.credit) {
                if (entry.credit.isNegative()) {
                    errors.push('Credit amounts must be positive');
                }
                totalCredits = totalCredits.add(entry.credit);
            }
        }
        const isBalanced = totalDebits.equals(totalCredits);
        if (!isBalanced) {
            errors.push(`Transaction does not balance. Debits: ${totalDebits.toString()}, Credits: ${totalCredits.toString()}`);
        }
        return {
            isValid: errors.length === 0,
            isBalanced,
            totalDebits,
            totalCredits,
            errors,
            warnings
        };
    }
    /**
     * Get transaction summary by type
     */
    static async getTransactionSummary(startDate, endDate) {
        try {
            const where = {};
            if (startDate || endDate) {
                where.date = {};
                if (startDate)
                    where.date.gte = startDate;
                if (endDate)
                    where.date.lte = endDate;
            }
            const summary = await database_1.default.transaction.groupBy({
                by: ['type'],
                where,
                _count: {
                    id: true
                },
                _sum: {
                    amount: true
                },
                orderBy: {
                    _count: {
                        id: 'desc'
                    }
                }
            });
            const result = summary.map((item) => ({
                type: item.type,
                count: item._count.id,
                totalAmount: item._sum.amount || new library_1.Decimal(0)
            }));
            return {
                success: true,
                data: result
            };
        }
        catch (error) {
            console.error('Error getting transaction summary:', error);
            return {
                success: false,
                error: 'Failed to get transaction summary'
            };
        }
    }
    /**
     * Get unbalanced transactions (for reconciliation)
     */
    static async getUnbalancedTransactions() {
        try {
            const transactions = await database_1.default.transaction.findMany({
                where: { isBalanced: false },
                include: {
                    journalEntries: {
                        include: {
                            account: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
            return {
                success: true,
                data: transactions
            };
        }
        catch (error) {
            console.error('Error fetching unbalanced transactions:', error);
            return {
                success: false,
                error: 'Failed to fetch unbalanced transactions'
            };
        }
    }
    /**
     * Balance a transaction (mark as balanced after manual review)
     */
    static async balanceTransaction(id) {
        try {
            const transaction = await database_1.default.transaction.findUnique({
                where: { id },
                include: {
                    journalEntries: {
                        include: {
                            account: true
                        }
                    }
                }
            });
            if (!transaction) {
                return {
                    success: false,
                    error: 'Transaction not found'
                };
            }
            // Re-validate the transaction
            const entries = transaction.journalEntries.map((entry) => ({
                accountId: entry.accountId,
                debit: entry.debit,
                credit: entry.credit,
                description: entry.description
            }));
            const validation = this.validateJournalEntries(entries);
            if (!validation.isBalanced) {
                return {
                    success: false,
                    error: `Cannot balance transaction: ${validation.errors.join(', ')}`
                };
            }
            const updatedTransaction = await database_1.default.transaction.update({
                where: { id },
                data: { isBalanced: true },
                include: {
                    journalEntries: {
                        include: {
                            account: true
                        }
                    }
                }
            });
            return {
                success: true,
                data: updatedTransaction,
                message: 'Transaction balanced successfully'
            };
        }
        catch (error) {
            console.error('Error balancing transaction:', error);
            return {
                success: false,
                error: 'Failed to balance transaction'
            };
        }
    }
    /**
     * Get account balance from journal entries
     */
    static async getAccountBalance(accountId, startDate, endDate) {
        try {
            const where = {
                accountId,
                transaction: {
                    isBalanced: true
                }
            };
            if (startDate || endDate) {
                where.transaction = {
                    ...where.transaction,
                    date: {}
                };
                if (startDate)
                    where.transaction.date.gte = startDate;
                if (endDate)
                    where.transaction.date.lte = endDate;
            }
            const entries = await database_1.default.journalEntry.findMany({
                where,
                select: {
                    debit: true,
                    credit: true
                }
            });
            let balance = new library_1.Decimal(0);
            for (const entry of entries) {
                if (entry.debit) {
                    balance = balance.add(entry.debit);
                }
                if (entry.credit) {
                    balance = balance.sub(entry.credit);
                }
            }
            return {
                success: true,
                data: balance
            };
        }
        catch (error) {
            console.error('Error calculating account balance:', error);
            return {
                success: false,
                error: 'Failed to calculate account balance'
            };
        }
    }
}
exports.TransactionService = TransactionService;
//# sourceMappingURL=transactionService.js.map