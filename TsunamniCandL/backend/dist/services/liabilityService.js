"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiabilityService = void 0;
const library_1 = require("@prisma/client/runtime/library");
const database_1 = __importDefault(require("../config/database"));
const validationService_1 = require("./validationService");
class LiabilityService {
    /**
     * Create a new liability
     */
    static async createLiability(input) {
        try {
            // Validate input
            const validation = validationService_1.ValidationService.validateLiabilityAmount(input.amountOwed);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: validation.errors.join(', ')
                };
            }
            // Validate due date if provided
            if (input.dueDate) {
                const dateValidation = validationService_1.ValidationService.validateDateNotFuture(input.dueDate);
                if (!dateValidation.isValid) {
                    return {
                        success: false,
                        error: dateValidation.errors.join(', ')
                    };
                }
            }
            const liability = await database_1.default.liability.create({
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
        }
        catch (error) {
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
    static async getLiabilityById(id) {
        try {
            const liability = await database_1.default.liability.findUnique({
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
        }
        catch (error) {
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
    static async getAllLiabilities(page = 1, limit = 10, activeOnly = true) {
        try {
            const skip = (page - 1) * limit;
            const where = activeOnly ? { isActive: true } : {};
            const [liabilities, total] = await Promise.all([
                database_1.default.liability.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { createdAt: 'desc' }
                }),
                database_1.default.liability.count({ where })
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
        }
        catch (error) {
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
    static async updateLiability(id, input) {
        try {
            // If updating amount owed, validate it
            if (input.amountOwed) {
                const validation = validationService_1.ValidationService.validateLiabilityAmount(input.amountOwed);
                if (!validation.isValid) {
                    return {
                        success: false,
                        error: validation.errors.join(', ')
                    };
                }
            }
            // If updating due date, validate it
            if (input.dueDate) {
                const dateValidation = validationService_1.ValidationService.validateDateNotFuture(input.dueDate);
                if (!dateValidation.isValid) {
                    return {
                        success: false,
                        error: dateValidation.errors.join(', ')
                    };
                }
            }
            const liability = await database_1.default.liability.update({
                where: { id },
                data: input
            });
            return {
                success: true,
                data: liability,
                message: 'Liability updated successfully'
            };
        }
        catch (error) {
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
    static async deleteLiability(id) {
        try {
            await database_1.default.liability.update({
                where: { id },
                data: { isActive: false }
            });
            return {
                success: true,
                data: true,
                message: 'Liability deleted successfully'
            };
        }
        catch (error) {
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
    static async getTotalLiabilityAmount(activeOnly = true) {
        try {
            const where = activeOnly ? { isActive: true } : {};
            const result = await database_1.default.liability.aggregate({
                where,
                _sum: {
                    amountOwed: true
                }
            });
            const total = result._sum.amountOwed || new library_1.Decimal(0);
            return {
                success: true,
                data: total
            };
        }
        catch (error) {
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
    static async getLiabilitiesByType(type, activeOnly = true) {
        try {
            const where = {
                type: type,
                ...(activeOnly ? { isActive: true } : {})
            };
            const liabilities = await database_1.default.liability.findMany({
                where,
                orderBy: { createdAt: 'desc' }
            });
            return {
                success: true,
                data: liabilities
            };
        }
        catch (error) {
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
    static async getLiabilitiesDueWithin(days, activeOnly = true) {
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
            const liabilities = await database_1.default.liability.findMany({
                where,
                orderBy: { dueDate: 'asc' }
            });
            return {
                success: true,
                data: liabilities
            };
        }
        catch (error) {
            console.error('Error fetching liabilities due within period:', error);
            return {
                success: false,
                error: 'Failed to fetch liabilities due within period'
            };
        }
    }
}
exports.LiabilityService = LiabilityService;
//# sourceMappingURL=liabilityService.js.map