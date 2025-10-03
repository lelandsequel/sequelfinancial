import { Decimal } from '@prisma/client/runtime/library';
import { Liability, CreateLiabilityInput, UpdateLiabilityInput, ApiResponse, PaginatedResponse } from '../types/accounting';
export declare class LiabilityService {
    /**
     * Create a new liability
     */
    static createLiability(input: CreateLiabilityInput): Promise<ApiResponse<Liability>>;
    /**
     * Get liability by ID
     */
    static getLiabilityById(id: string): Promise<ApiResponse<Liability>>;
    /**
     * Get all liabilities with pagination
     */
    static getAllLiabilities(page?: number, limit?: number, activeOnly?: boolean): Promise<ApiResponse<PaginatedResponse<Liability>>>;
    /**
     * Update liability
     */
    static updateLiability(id: string, input: UpdateLiabilityInput): Promise<ApiResponse<Liability>>;
    /**
     * Delete liability (soft delete by setting isActive to false)
     */
    static deleteLiability(id: string): Promise<ApiResponse<boolean>>;
    /**
     * Get total liability amount
     */
    static getTotalLiabilityAmount(activeOnly?: boolean): Promise<ApiResponse<Decimal>>;
    /**
     * Get liabilities by type
     */
    static getLiabilitiesByType(type: string, activeOnly?: boolean): Promise<ApiResponse<Liability[]>>;
    /**
     * Get liabilities due within a certain number of days
     */
    static getLiabilitiesDueWithin(days: number, activeOnly?: boolean): Promise<ApiResponse<Liability[]>>;
}
//# sourceMappingURL=liabilityService.d.ts.map