"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquityService = void 0;
const library_1 = require("@prisma/client/runtime/library");
const database_1 = __importDefault(require("../config/database"));
const validationService_1 = require("./validationService");
const assetService_1 = require("./assetService");
const liabilityService_1 = require("./liabilityService");
const revenueService_1 = require("./revenueService");
const expenseService_1 = require("./expenseService");
class EquityService {
    /**
     * Create a new equity entry
     */
    static async createEquity(input) {
        try {
            // Validate shares outstanding if provided
            if (input.sharesOutstanding) {
                const validation = validationService_1.ValidationService.validateSharesOutstanding(input.sharesOutstanding);
                if (!validation.isValid) {
                    return {
                        success: false,
                        error: validation.errors.join(', ')
                    };
                }
            }
            // Validate par value if provided
            if (input.parValue) {
                const validation = validationService_1.ValidationService.validateParValue(input.parValue);
                if (!validation.isValid) {
                    return {
                        success: false,
                        error: validation.errors.join(', ')
                    };
                }
            }
            const equity = await database_1.default.equity.create({
                data: {
                    type: input.type,
                    sharesOutstanding: input.sharesOutstanding,
                    parValue: input.parValue,
                    description: input.description
                }
            });
            return {
                success: true,
                data: equity,
                message: 'Equity created successfully'
            };
        }
        catch (error) {
            console.error('Error creating equity:', error);
            return {
                success: false,
                error: 'Failed to create equity'
            };
        }
    }
    /**
     * Get equity by ID
     */
    static async getEquityById(id) {
        try {
            const equity = await database_1.default.equity.findUnique({
                where: { id }
            });
            if (!equity) {
                return {
                    success: false,
                    error: 'Equity not found'
                };
            }
            return {
                success: true,
                data: equity
            };
        }
        catch (error) {
            console.error('Error fetching equity:', error);
            return {
                success: false,
                error: 'Failed to fetch equity'
            };
        }
    }
    /**
     * Get all equity entries
     */
    static async getAllEquity() {
        try {
            const equity = await database_1.default.equity.findMany({
                orderBy: { createdAt: 'desc' }
            });
            return {
                success: true,
                data: equity
            };
        }
        catch (error) {
            console.error('Error fetching equity:', error);
            return {
                success: false,
                error: 'Failed to fetch equity'
            };
        }
    }
    /**
     * Update equity
     */
    static async updateEquity(id, input) {
        try {
            // Validate shares outstanding if provided
            if (input.sharesOutstanding !== undefined) {
                const validation = validationService_1.ValidationService.validateSharesOutstanding(input.sharesOutstanding);
                if (!validation.isValid) {
                    return {
                        success: false,
                        error: validation.errors.join(', ')
                    };
                }
            }
            // Validate par value if provided
            if (input.parValue) {
                const validation = validationService_1.ValidationService.validateParValue(input.parValue);
                if (!validation.isValid) {
                    return {
                        success: false,
                        error: validation.errors.join(', ')
                    };
                }
            }
            const equity = await database_1.default.equity.update({
                where: { id },
                data: input
            });
            return {
                success: true,
                data: equity,
                message: 'Equity updated successfully'
            };
        }
        catch (error) {
            console.error('Error updating equity:', error);
            if (error.code === 'P2025') {
                return {
                    success: false,
                    error: 'Equity not found'
                };
            }
            return {
                success: false,
                error: 'Failed to update equity'
            };
        }
    }
    /**
     * Calculate and update retained earnings (Revenue - Expenses)
     */
    static async calculateRetainedEarnings() {
        try {
            // Get total revenue
            const revenueResult = await revenueService_1.RevenueService.getTotalRevenue();
            if (!revenueResult.success) {
                return {
                    success: false,
                    error: 'Failed to calculate retained earnings: ' + revenueResult.error
                };
            }
            // Get total expenses
            const expenseResult = await expenseService_1.ExpenseService.getTotalExpenses();
            if (!expenseResult.success) {
                return {
                    success: false,
                    error: 'Failed to calculate retained earnings: ' + expenseResult.error
                };
            }
            const totalRevenue = revenueResult.data;
            const totalExpenses = expenseResult.data;
            const retainedEarnings = totalRevenue.sub(totalExpenses);
            // Update retained earnings in equity
            await database_1.default.equity.updateMany({
                where: { type: 'RETAINED_EARNINGS' },
                data: { retainedEarnings }
            });
            return {
                success: true,
                data: retainedEarnings,
                message: 'Retained earnings calculated and updated'
            };
        }
        catch (error) {
            console.error('Error calculating retained earnings:', error);
            return {
                success: false,
                error: 'Failed to calculate retained earnings'
            };
        }
    }
    /**
     * Get total equity value (sum of all equity entries)
     */
    static async getTotalEquityValue() {
        try {
            // First ensure retained earnings are up to date
            await this.calculateRetainedEarnings();
            const result = await database_1.default.equity.aggregate({
                _sum: {
                    retainedEarnings: true
                }
            });
            const total = result._sum.retainedEarnings || new library_1.Decimal(0);
            return {
                success: true,
                data: total
            };
        }
        catch (error) {
            console.error('Error calculating total equity value:', error);
            return {
                success: false,
                error: 'Failed to calculate total equity value'
            };
        }
    }
    /**
     * Get accounting equation status
     */
    static async getAccountingEquation() {
        try {
            // Get total assets
            const assetResult = await assetService_1.AssetService.getTotalAssetValue();
            if (!assetResult.success) {
                return {
                    success: false,
                    error: 'Failed to get accounting equation: ' + assetResult.error
                };
            }
            // Get total liabilities
            const liabilityResult = await liabilityService_1.LiabilityService.getTotalLiabilityAmount();
            if (!liabilityResult.success) {
                return {
                    success: false,
                    error: 'Failed to get accounting equation: ' + liabilityResult.error
                };
            }
            // Get total equity
            const equityResult = await this.getTotalEquityValue();
            if (!equityResult.success) {
                return {
                    success: false,
                    error: 'Failed to get accounting equation: ' + equityResult.error
                };
            }
            const totalAssets = assetResult.data;
            const totalLiabilities = liabilityResult.data;
            const totalEquity = equityResult.data;
            // Validate the equation
            const validation = validationService_1.ValidationService.validateAccountingEquation(totalAssets, totalLiabilities, totalEquity);
            return {
                success: true,
                data: {
                    totalAssets,
                    totalLiabilities,
                    totalEquity,
                    isBalanced: validation.isValid
                }
            };
        }
        catch (error) {
            console.error('Error getting accounting equation:', error);
            return {
                success: false,
                error: 'Failed to get accounting equation'
            };
        }
    }
    /**
     * Get equity by type
     */
    static async getEquityByType(type) {
        try {
            const equity = await database_1.default.equity.findMany({
                where: { type: type },
                orderBy: { createdAt: 'desc' }
            });
            return {
                success: true,
                data: equity
            };
        }
        catch (error) {
            console.error('Error fetching equity by type:', error);
            return {
                success: false,
                error: 'Failed to fetch equity by type'
            };
        }
    }
}
exports.EquityService = EquityService;
//# sourceMappingURL=equityService.js.map