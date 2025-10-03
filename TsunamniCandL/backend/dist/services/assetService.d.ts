import { Decimal } from '@prisma/client/runtime/library';
import { Asset, CreateAssetInput, UpdateAssetInput, ApiResponse, PaginatedResponse } from '../types/accounting';
export declare class AssetService {
    /**
     * Create a new asset
     */
    static createAsset(input: CreateAssetInput): Promise<ApiResponse<Asset>>;
    /**
     * Get asset by ID
     */
    static getAssetById(id: string): Promise<ApiResponse<Asset>>;
    /**
     * Get all assets with pagination
     */
    static getAllAssets(page?: number, limit?: number, activeOnly?: boolean): Promise<ApiResponse<PaginatedResponse<Asset>>>;
    /**
     * Update asset
     */
    static updateAsset(id: string, input: UpdateAssetInput): Promise<ApiResponse<Asset>>;
    /**
     * Delete asset (soft delete by setting isActive to false)
     */
    static deleteAsset(id: string): Promise<ApiResponse<boolean>>;
    /**
     * Get total asset value
     */
    static getTotalAssetValue(activeOnly?: boolean): Promise<ApiResponse<Decimal>>;
    /**
     * Get assets by type
     */
    static getAssetsByType(type: string, activeOnly?: boolean): Promise<ApiResponse<Asset[]>>;
}
//# sourceMappingURL=assetService.d.ts.map