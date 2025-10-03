"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevenueService = void 0;
const library_1 = require("@prisma/client/runtime/library");
const database_1 = __importDefault(require("../config/database"));
const validationService_1 = require("./validationService");
class RevenueService {
    /**
     * Create a new revenue entry
     */
    static async createRevenue(input) {
        try {
            // Validate input
            const validation = validationService_1.ValidationService.validateRevenueAmount(input.amount);
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
            const revenue = await database_1.default.revenue.create({
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
        }
        catch (error) {
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
    static async getRevenueById(id) {
        try {
            const revenue = await database_1.default.revenue.findUnique({
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
        }
        catch (error) {
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
    static async getAllRevenue(page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const [revenues, total] = await Promise.all([
                database_1.default.revenue.findMany({
                    skip,
                    take: limit,
                    orderBy: { date: 'desc' }
                }),
                database_1.default.revenue.count()
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
        }
        catch (error) {
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
    static async updateRevenue(id, input) {
        try {
            // If updating amount, validate it
            if (input.amount) {
                const validation = validationService_1.ValidationService.validateRevenueAmount(input.amount);
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
            const revenue = await database_1.default.revenue.update({
                where: { id },
                data: input
            });
            return {
                success: true,
                data: revenue,
                message: 'Revenue updated successfully'
            };
        }
        catch (error) {
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
    static async deleteRevenue(id) {
        try {
            await database_1.default.revenue.delete({
                where: { id }
            });
            return {
                success: true,
                data: true,
                message: 'Revenue deleted successfully'
            };
        }
        catch (error) {
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
    static async getTotalRevenue() {
        try {
            const result = await database_1.default.revenue.aggregate({
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
    static async getRevenueBySource(source) {
        try {
            const revenues = await database_1.default.revenue.findMany({
                where: { source },
                orderBy: { date: 'desc' }
            });
            return {
                success: true,
                data: revenues
            };
        }
        catch (error) {
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
    static async getRevenueByDateRange(startDate, endDate) {
        try {
            const revenues = await database_1.default.revenue.findMany({
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
        }
        catch (error) {
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
    static async getRecurringRevenue() {
        try {
            const revenues = await database_1.default.revenue.findMany({
                where: { isRecurring: true },
                orderBy: { date: 'desc' }
            });
            return {
                success: true,
                data: revenues
            };
        }
        catch (error) {
            console.error('Error fetching recurring revenue:', error);
            return {
                success: false,
                error: 'Failed to fetch recurring revenue'
            };
        }
    }
}
exports.RevenueService = RevenueService;
//# sourceMappingURL=revenueService.js.map