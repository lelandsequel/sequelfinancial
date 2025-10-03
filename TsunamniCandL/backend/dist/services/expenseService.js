"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseService = void 0;
const library_1 = require("@prisma/client/runtime/library");
const database_1 = __importDefault(require("../config/database"));
const validationService_1 = require("./validationService");
class ExpenseService {
    /**
     * Create a new expense entry
     */
    static async createExpense(input) {
        try {
            // Validate input
            const validation = validationService_1.ValidationService.validateExpenseAmount(input.amount);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: validation.errors.join(', ')
                };
            }
            // Validate date
            const dateValidation = validationService_1.ValidationService.validateDateNotFuture(input.date);
            if (!dateValidation.isValid) {
                return {
                    success: false,
                    error: dateValidation.errors.join(', ')
                };
            }
            const expense = await database_1.default.expense.create({
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
        }
        catch (error) {
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
    static async getExpenseById(id) {
        try {
            const expense = await database_1.default.expense.findUnique({
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
        }
        catch (error) {
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
    static async getAllExpenses(page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const [expenses, total] = await Promise.all([
                database_1.default.expense.findMany({
                    skip,
                    take: limit,
                    orderBy: { date: 'desc' }
                }),
                database_1.default.expense.count()
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
        }
        catch (error) {
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
    static async updateExpense(id, input) {
        try {
            // If updating amount, validate it
            if (input.amount) {
                const validation = validationService_1.ValidationService.validateExpenseAmount(input.amount);
                if (!validation.isValid) {
                    return {
                        success: false,
                        error: validation.errors.join(', ')
                    };
                }
            }
            // If updating date, validate it
            if (input.date) {
                const dateValidation = validationService_1.ValidationService.validateDateNotFuture(input.date);
                if (!dateValidation.isValid) {
                    return {
                        success: false,
                        error: dateValidation.errors.join(', ')
                    };
                }
            }
            const expense = await database_1.default.expense.update({
                where: { id },
                data: input
            });
            return {
                success: true,
                data: expense,
                message: 'Expense updated successfully'
            };
        }
        catch (error) {
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
    static async deleteExpense(id) {
        try {
            await database_1.default.expense.delete({
                where: { id }
            });
            return {
                success: true,
                data: true,
                message: 'Expense deleted successfully'
            };
        }
        catch (error) {
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
    static async getTotalExpenses() {
        try {
            const result = await database_1.default.expense.aggregate({
                _sum: {
                    amount: true
                }
            });
            const total = result._sum.amount || new library_1.Decimal(0);
            return {
                success: true,
                data: total
            };
        }
        catch (error) {
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
    static async getExpensesByCategory(category) {
        try {
            const expenses = await database_1.default.expense.findMany({
                where: { category },
                orderBy: { date: 'desc' }
            });
            return {
                success: true,
                data: expenses
            };
        }
        catch (error) {
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
    static async getExpensesByDateRange(startDate, endDate) {
        try {
            const expenses = await database_1.default.expense.findMany({
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
        }
        catch (error) {
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
    static async getRecurringExpenses() {
        try {
            const expenses = await database_1.default.expense.findMany({
                where: { isRecurring: true },
                orderBy: { date: 'desc' }
            });
            return {
                success: true,
                data: expenses
            };
        }
        catch (error) {
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
    static async getExpenseSummaryByCategory() {
        try {
            const expenses = await database_1.default.expense.groupBy({
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
            const summary = expenses.map((expense) => ({
                category: expense.category,
                total: expense._sum.amount || new library_1.Decimal(0),
                count: expense._count.id
            }));
            return {
                success: true,
                data: summary
            };
        }
        catch (error) {
            console.error('Error getting expense summary by category:', error);
            return {
                success: false,
                error: 'Failed to get expense summary by category'
            };
        }
    }
}
exports.ExpenseService = ExpenseService;
//# sourceMappingURL=expenseService.js.map