"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetService = void 0;
const library_1 = require("@prisma/client/runtime/library");
const database_1 = __importDefault(require("../config/database"));
const validationService_1 = require("./validationService");
class AssetService {
    /**
     * Create a new asset
     */
    static async createAsset(input) {
        try {
            // Validate input
            const validation = validationService_1.ValidationService.validateAssetValue(input.currentValue);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: validation.errors.join(', ')
                };
            }
            // Validate date
            const dateValidation = validationService_1.ValidationService.validateDateNotFuture(input.dateAcquired);
            if (!dateValidation.isValid) {
                return {
                    success: false,
                    error: dateValidation.errors.join(', ')
                };
            }
            const asset = await database_1.default.asset.create({
                data: {
                    name: input.name,
                    type: input.type,
                    currentValue: input.currentValue,
                    dateAcquired: input.dateAcquired,
                    description: input.description
                }
            });
            return {
                success: true,
                data: asset,
                message: 'Asset created successfully'
            };
        }
        catch (error) {
            console.error('Error creating asset:', error);
            return {
                success: false,
                error: 'Failed to create asset'
            };
        }
    }
    /**
     * Get asset by ID
     */
    static async getAssetById(id) {
        try {
            const asset = await database_1.default.asset.findUnique({
                where: { id }
            });
            if (!asset) {
                return {
                    success: false,
                    error: 'Asset not found'
                };
            }
            return {
                success: true,
                data: asset
            };
        }
        catch (error) {
            console.error('Error fetching asset:', error);
            return {
                success: false,
                error: 'Failed to fetch asset'
            };
        }
    }
    /**
     * Get all assets with pagination
     */
    static async getAllAssets(page = 1, limit = 10, activeOnly = true) {
        try {
            const skip = (page - 1) * limit;
            const where = activeOnly ? { isActive: true } : {};
            const [assets, total] = await Promise.all([
                database_1.default.asset.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { createdAt: 'desc' }
                }),
                database_1.default.asset.count({ where })
            ]);
            const totalPages = Math.ceil(total / limit);
            return {
                success: true,
                data: {
                    data: assets,
                    total,
                    page,
                    limit,
                    totalPages
                }
            };
        }
        catch (error) {
            console.error('Error fetching assets:', error);
            return {
                success: false,
                error: 'Failed to fetch assets'
            };
        }
    }
    /**
     * Update asset
     */
    static async updateAsset(id, input) {
        try {
            // If updating current value, validate it
            if (input.currentValue) {
                const validation = validationService_1.ValidationService.validateAssetValue(input.currentValue);
                if (!validation.isValid) {
                    return {
                        success: false,
                        error: validation.errors.join(', ')
                    };
                }
            }
            // If updating date, validate it
            if (input.dateAcquired) {
                const dateValidation = validationService_1.ValidationService.validateDateNotFuture(input.dateAcquired);
                if (!dateValidation.isValid) {
                    return {
                        success: false,
                        error: dateValidation.errors.join(', ')
                    };
                }
            }
            const asset = await database_1.default.asset.update({
                where: { id },
                data: input
            });
            return {
                success: true,
                data: asset,
                message: 'Asset updated successfully'
            };
        }
        catch (error) {
            console.error('Error updating asset:', error);
            if (error.code === 'P2025') {
                return {
                    success: false,
                    error: 'Asset not found'
                };
            }
            return {
                success: false,
                error: 'Failed to update asset'
            };
        }
    }
    /**
     * Delete asset (soft delete by setting isActive to false)
     */
    static async deleteAsset(id) {
        try {
            await database_1.default.asset.update({
                where: { id },
                data: { isActive: false }
            });
            return {
                success: true,
                data: true,
                message: 'Asset deleted successfully'
            };
        }
        catch (error) {
            console.error('Error deleting asset:', error);
            if (error.code === 'P2025') {
                return {
                    success: false,
                    error: 'Asset not found'
                };
            }
            return {
                success: false,
                error: 'Failed to delete asset'
            };
        }
    }
    /**
     * Get total asset value
     */
    static async getTotalAssetValue(activeOnly = true) {
        try {
            const where = activeOnly ? { isActive: true } : {};
            const result = await database_1.default.asset.aggregate({
                where,
                _sum: {
                    currentValue: true
                }
            });
            const total = result._sum.currentValue || new library_1.Decimal(0);
            return {
                success: true,
                data: total
            };
        }
        catch (error) {
            console.error('Error calculating total asset value:', error);
            return {
                success: false,
                error: 'Failed to calculate total asset value'
            };
        }
    }
    /**
     * Get assets by type
     */
    static async getAssetsByType(type, activeOnly = true) {
        try {
            const where = {
                type: type,
                ...(activeOnly ? { isActive: true } : {})
            };
            const assets = await database_1.default.asset.findMany({
                where,
                orderBy: { createdAt: 'desc' }
            });
            return {
                success: true,
                data: assets
            };
        }
        catch (error) {
            console.error('Error fetching assets by type:', error);
            return {
                success: false,
                error: 'Failed to fetch assets by type'
            };
        }
    }
}
exports.AssetService = AssetService;
//# sourceMappingURL=assetService.js.map