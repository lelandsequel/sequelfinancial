import { Decimal } from '@prisma/client/runtime/library';
import { Revenue, CreateRevenueInput, UpdateRevenueInput, ApiResponse, PaginatedResponse } from '../types/accounting';
export declare class RevenueService {
    /**
     * Create a new revenue entry
     */
    static createRevenue(input: CreateRevenueInput): Promise<ApiResponse<Revenue>>;
    /**
     * Get revenue by ID
     */
    static getRevenueById(id: string): Promise<ApiResponse<Revenue>>;
    /**
     * Get all revenue with pagination
     */
    static getAllRevenue(page?: number, limit?: number): Promise<ApiResponse<PaginatedResponse<Revenue>>>;
    /**
     * Update revenue
     */
    static updateRevenue(id: string, input: UpdateRevenueInput): Promise<ApiResponse<Revenue>>;
    /**
     * Delete revenue
     */
    static deleteRevenue(id: string): Promise<ApiResponse<boolean>>;
    /**
     * Get total revenue amount
     */
    static getTotalRevenue(): Promise<ApiResponse<Decimal>>;
    /**
     * Get revenue by source
     */
    static getRevenueBySource(source: string): Promise<ApiResponse<Revenue[]>>;
    /**
     * Get revenue within date range
     */
    static getRevenueByDateRange(startDate: Date, endDate: Date): Promise<ApiResponse<Revenue[]>>;
    /**
     * Get recurring revenue
     */
    static getRecurringRevenue(): Promise<ApiResponse<Revenue[]>>;
}
//# sourceMappingURL=revenueService.d.ts.map