import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../config/database';
import { Asset, CreateAssetInput, UpdateAssetInput, ApiResponse, PaginatedResponse } from '../types/accounting';
import { ValidationService } from './validationService';

export class AssetService {
  /**
   * Create a new asset
   */
  static async createAsset(input: CreateAssetInput): Promise<ApiResponse<Asset>> {
    try {
      // Validate input
      const validation = ValidationService.validateAssetValue(input.currentValue);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', ')
        };
      }

      // Validate date
      const dateValidation = ValidationService.validateDateNotFuture(input.dateAcquired);
      if (!dateValidation.isValid) {
        return {
          success: false,
          error: dateValidation.errors.join(', ')
        };
      }

      const asset = await prisma.asset.create({
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
    } catch (error) {
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
  static async getAssetById(id: string): Promise<ApiResponse<Asset>> {
    try {
      const asset = await prisma.asset.findUnique({
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
    } catch (error) {
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
  static async getAllAssets(
    page: number = 1,
    limit: number = 10,
    activeOnly: boolean = true
  ): Promise<ApiResponse<PaginatedResponse<Asset>>> {
    try {
      const skip = (page - 1) * limit;

      const where = activeOnly ? { isActive: true } : {};

      const [assets, total] = await Promise.all([
        prisma.asset.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.asset.count({ where })
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
    } catch (error) {
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
  static async updateAsset(id: string, input: UpdateAssetInput): Promise<ApiResponse<Asset>> {
    try {
      // If updating current value, validate it
      if (input.currentValue) {
        const validation = ValidationService.validateAssetValue(input.currentValue);
        if (!validation.isValid) {
          return {
            success: false,
            error: validation.errors.join(', ')
          };
        }
      }

      // If updating date, validate it
      if (input.dateAcquired) {
        const dateValidation = ValidationService.validateDateNotFuture(input.dateAcquired);
        if (!dateValidation.isValid) {
          return {
            success: false,
            error: dateValidation.errors.join(', ')
          };
        }
      }

      const asset = await prisma.asset.update({
        where: { id },
        data: input
      });

      return {
        success: true,
        data: asset,
        message: 'Asset updated successfully'
      };
    } catch (error: any) {
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
  static async deleteAsset(id: string): Promise<ApiResponse<boolean>> {
    try {
      await prisma.asset.update({
        where: { id },
        data: { isActive: false }
      });

      return {
        success: true,
        data: true,
        message: 'Asset deleted successfully'
      };
    } catch (error: any) {
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
  static async getTotalAssetValue(activeOnly: boolean = true): Promise<ApiResponse<Decimal>> {
    try {
      const where = activeOnly ? { isActive: true } : {};

      const result = await prisma.asset.aggregate({
        where,
        _sum: {
          currentValue: true
        }
      });

      const total = result._sum.currentValue || new Decimal(0);

      return {
        success: true,
        data: total
      };
    } catch (error) {
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
  static async getAssetsByType(type: string, activeOnly: boolean = true): Promise<ApiResponse<Asset[]>> {
    try {
      const where = {
        type: type as any,
        ...(activeOnly ? { isActive: true } : {})
      };

      const assets = await prisma.asset.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });

      return {
        success: true,
        data: assets
      };
    } catch (error) {
      console.error('Error fetching assets by type:', error);
      return {
        success: false,
        error: 'Failed to fetch assets by type'
      };
    }
  }
}
