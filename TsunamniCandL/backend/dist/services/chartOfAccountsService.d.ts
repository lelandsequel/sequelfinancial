import { ChartOfAccounts, CreateChartOfAccountsInput, UpdateChartOfAccountsInput, AccountType, AccountStatus, ApiResponse, PaginatedResponse } from '../types/accounting';
export declare class ChartOfAccountsService {
    private static readonly ACCOUNT_RANGES;
    /**
     * Create a new chart of accounts entry
     */
    static createAccount(input: CreateChartOfAccountsInput): Promise<ApiResponse<ChartOfAccounts>>;
    /**
     * Get account by ID
     */
    static getAccountById(id: string): Promise<ApiResponse<ChartOfAccounts>>;
    /**
     * Get account by account number
     */
    static getAccountByNumber(accountNumber: string): Promise<ApiResponse<ChartOfAccounts>>;
    /**
     * Get all accounts with pagination and filtering
     */
    static getAllAccounts(page?: number, limit?: number, type?: AccountType, status?: AccountStatus, parentOnly?: boolean): Promise<ApiResponse<PaginatedResponse<ChartOfAccounts>>>;
    /**
     * Update account
     */
    static updateAccount(id: string, input: UpdateChartOfAccountsInput): Promise<ApiResponse<ChartOfAccounts>>;
    /**
     * Delete account (only non-system accounts)
     */
    static deleteAccount(id: string): Promise<ApiResponse<boolean>>;
    /**
     * Get account hierarchy (tree structure)
     */
    static getAccountHierarchy(type?: AccountType): Promise<ApiResponse<ChartOfAccounts[]>>;
    /**
     * Get next available account number for a type
     */
    static getNextAccountNumber(type: AccountType): Promise<ApiResponse<string>>;
    /**
     * Search accounts by name or number
     */
    static searchAccounts(query: string, type?: AccountType): Promise<ApiResponse<ChartOfAccounts[]>>;
}
//# sourceMappingURL=chartOfAccountsService.d.ts.map