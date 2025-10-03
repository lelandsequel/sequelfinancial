"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodService = void 0;
const library_1 = require("@prisma/client/runtime/library");
const database_1 = __importDefault(require("../config/database"));
const accounting_1 = require("../types/accounting");
const equityService_1 = require("./equityService");
class PeriodService {
    /**
     * Create a new accounting period
     */
    static async createPeriod(input) {
        try {
            // Validate period dates
            if (input.startDate >= input.endDate) {
                return {
                    success: false,
                    error: 'End date must be after start date'
                };
            }
            // Check for overlapping periods
            const overlappingPeriod = await database_1.default.period.findFirst({
                where: {
                    OR: [
                        {
                            AND: [
                                { startDate: { lte: input.startDate } },
                                { endDate: { gt: input.startDate } }
                            ]
                        },
                        {
                            AND: [
                                { startDate: { lt: input.endDate } },
                                { endDate: { gte: input.endDate } }
                            ]
                        }
                    ]
                }
            });
            if (overlappingPeriod) {
                return {
                    success: false,
                    error: 'Period dates overlap with existing period'
                };
            }
            // If this is the first period or marked as current, set it as current
            const existingCurrent = await database_1.default.period.findFirst({
                where: { isCurrent: true }
            });
            const isCurrent = !existingCurrent || input.type === accounting_1.PeriodType.ANNUAL;
            // If setting as current, unset the previous current period
            if (isCurrent && existingCurrent) {
                await database_1.default.period.update({
                    where: { id: existingCurrent.id },
                    data: { isCurrent: false }
                });
            }
            const period = await database_1.default.period.create({
                data: {
                    name: input.name,
                    type: input.type,
                    startDate: input.startDate,
                    endDate: input.endDate,
                    isCurrent: isCurrent,
                    notes: input.notes
                }
            });
            return {
                success: true,
                data: period,
                message: 'Period created successfully'
            };
        }
        catch (error) {
            console.error('Error creating period:', error);
            return {
                success: false,
                error: 'Failed to create period'
            };
        }
    }
    /**
     * Get period by ID
     */
    static async getPeriodById(id) {
        try {
            const period = await database_1.default.period.findUnique({
                where: { id },
                include: {
                    transactions: {
                        include: {
                            journalEntries: {
                                include: {
                                    account: true
                                }
                            }
                        }
                    }
                }
            });
            if (!period) {
                return {
                    success: false,
                    error: 'Period not found'
                };
            }
            return {
                success: true,
                data: period
            };
        }
        catch (error) {
            console.error('Error fetching period:', error);
            return {
                success: false,
                error: 'Failed to fetch period'
            };
        }
    }
    /**
     * Get current period
     */
    static async getCurrentPeriod() {
        try {
            const period = await database_1.default.period.findFirst({
                where: { isCurrent: true },
                include: {
                    transactions: {
                        include: {
                            journalEntries: {
                                include: {
                                    account: true
                                }
                            }
                        }
                    }
                }
            });
            if (!period) {
                return {
                    success: false,
                    error: 'No current period found'
                };
            }
            return {
                success: true,
                data: period
            };
        }
        catch (error) {
            console.error('Error fetching current period:', error);
            return {
                success: false,
                error: 'Failed to fetch current period'
            };
        }
    }
    /**
     * Get all periods with pagination
     */
    static async getAllPeriods(page = 1, limit = 10, status) {
        try {
            const skip = (page - 1) * limit;
            const where = {};
            if (status)
                where.status = status;
            const [periods, total] = await Promise.all([
                database_1.default.period.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { startDate: 'desc' },
                    include: {
                        transactions: {
                            select: {
                                id: true,
                                amount: true,
                                isBalanced: true
                            }
                        }
                    }
                }),
                database_1.default.period.count({ where })
            ]);
            const totalPages = Math.ceil(total / limit);
            return {
                success: true,
                data: {
                    data: periods,
                    total,
                    page,
                    limit,
                    totalPages
                }
            };
        }
        catch (error) {
            console.error('Error fetching periods:', error);
            return {
                success: false,
                error: 'Failed to fetch periods'
            };
        }
    }
    /**
     * Update period
     */
    static async updatePeriod(id, input) {
        try {
            const period = await database_1.default.period.findUnique({
                where: { id }
            });
            if (!period) {
                return {
                    success: false,
                    error: 'Period not found'
                };
            }
            // Prevent updates to closed/locked periods
            if (period.status === accounting_1.PeriodStatus.CLOSED || period.status === accounting_1.PeriodStatus.LOCKED) {
                return {
                    success: false,
                    error: 'Cannot update closed or locked period'
                };
            }
            // If setting as current, unset the previous current period
            if (input.status === accounting_1.PeriodStatus.OPEN) {
                const existingCurrent = await database_1.default.period.findFirst({
                    where: { isCurrent: true, id: { not: id } }
                });
                if (existingCurrent) {
                    await database_1.default.period.update({
                        where: { id: existingCurrent.id },
                        data: { isCurrent: false }
                    });
                }
            }
            const updatedPeriod = await database_1.default.period.update({
                where: { id },
                data: input
            });
            return {
                success: true,
                data: updatedPeriod,
                message: 'Period updated successfully'
            };
        }
        catch (error) {
            console.error('Error updating period:', error);
            if (error.code === 'P2025') {
                return {
                    success: false,
                    error: 'Period not found'
                };
            }
            return {
                success: false,
                error: 'Failed to update period'
            };
        }
    }
    /**
     * Close accounting period
     */
    static async closePeriod(id, closedBy) {
        try {
            const period = await database_1.default.period.findUnique({
                where: { id },
                include: {
                    transactions: {
                        include: {
                            journalEntries: {
                                include: {
                                    account: true
                                }
                            }
                        }
                    }
                }
            });
            if (!period) {
                return {
                    success: false,
                    error: 'Period not found'
                };
            }
            if (period.status !== accounting_1.PeriodStatus.OPEN) {
                return {
                    success: false,
                    error: 'Period is not open and cannot be closed'
                };
            }
            // Check if all transactions in the period are balanced
            const unbalancedTransactions = period.transactions.filter((t) => !t.isBalanced);
            if (unbalancedTransactions.length > 0) {
                return {
                    success: false,
                    error: `Cannot close period: ${unbalancedTransactions.length} transactions are not balanced`
                };
            }
            // Calculate retained earnings adjustment
            const { retainedEarningsAdjustment, adjustmentsCount } = await this.calculatePeriodAdjustments(period.id);
            // Close the period
            const closedAt = new Date();
            await database_1.default.period.update({
                where: { id },
                data: {
                    status: accounting_1.PeriodStatus.CLOSED,
                    closedBy,
                    closedAt,
                    isCurrent: false
                }
            });
            // Create the next period automatically if this was the current period
            if (period.isCurrent) {
                await this.createNextPeriod(period);
            }
            return {
                success: true,
                data: {
                    periodId: id,
                    closedAt,
                    closedBy,
                    adjustmentsCount,
                    retainedEarningsAdjustment,
                    success: true,
                    message: `Period closed successfully. Retained earnings adjusted by $${retainedEarningsAdjustment.toString()}`
                }
            };
        }
        catch (error) {
            console.error('Error closing period:', error);
            return {
                success: false,
                error: 'Failed to close period'
            };
        }
    }
    /**
     * Calculate period-end adjustments
     */
    static async calculatePeriodAdjustments(periodId) {
        // Calculate net income for the period
        const periodTransactions = await database_1.default.transaction.findMany({
            where: { periodId },
            include: {
                journalEntries: {
                    include: {
                        account: true
                    }
                }
            }
        });
        let netIncome = new library_1.Decimal(0);
        for (const transaction of periodTransactions) {
            // Calculate impact on retained earnings
            // Revenue increases retained earnings, expenses decrease it
            for (const entry of transaction.journalEntries) {
                if (entry.account.type === 'REVENUE') {
                    netIncome = netIncome.add(entry.credit || new library_1.Decimal(0));
                    netIncome = netIncome.sub(entry.debit || new library_1.Decimal(0));
                }
                else if (entry.account.type === 'EXPENSE') {
                    netIncome = netIncome.sub(entry.credit || new library_1.Decimal(0));
                    netIncome = netIncome.add(entry.debit || new library_1.Decimal(0));
                }
            }
        }
        // Update retained earnings
        await equityService_1.EquityService.calculateRetainedEarnings();
        return {
            retainedEarningsAdjustment: netIncome,
            adjustmentsCount: periodTransactions.length
        };
    }
    /**
     * Create the next period automatically
     */
    static async createNextPeriod(currentPeriod) {
        const nextStartDate = new Date(currentPeriod.endDate);
        nextStartDate.setDate(nextStartDate.getDate() + 1);
        let nextEndDate;
        if (currentPeriod.type === accounting_1.PeriodType.MONTHLY) {
            nextEndDate = new Date(nextStartDate);
            nextEndDate.setMonth(nextEndDate.getMonth() + 1);
            nextEndDate.setDate(nextEndDate.getDate() - 1);
        }
        else if (currentPeriod.type === accounting_1.PeriodType.QUARTERLY) {
            nextEndDate = new Date(nextStartDate);
            nextEndDate.setMonth(nextEndDate.getMonth() + 3);
            nextEndDate.setDate(nextEndDate.getDate() - 1);
        }
        else {
            // Annual
            nextEndDate = new Date(nextStartDate);
            nextEndDate.setFullYear(nextEndDate.getFullYear() + 1);
            nextEndDate.setDate(nextEndDate.getDate() - 1);
        }
        const periodName = this.generatePeriodName(nextStartDate, nextEndDate, currentPeriod.type);
        await database_1.default.period.create({
            data: {
                name: periodName,
                type: currentPeriod.type,
                startDate: nextStartDate,
                endDate: nextEndDate,
                isCurrent: true
            }
        });
    }
    /**
     * Generate period name based on dates and type
     */
    static generatePeriodName(startDate, endDate, type) {
        if (type === accounting_1.PeriodType.MONTHLY) {
            return `${startDate.toLocaleString('default', { month: 'long' })} ${startDate.getFullYear()}`;
        }
        else if (type === accounting_1.PeriodType.QUARTERLY) {
            const quarter = Math.floor(startDate.getMonth() / 3) + 1;
            return `Q${quarter} ${startDate.getFullYear()}`;
        }
        else {
            return `FY ${startDate.getFullYear()}`;
        }
    }
    /**
     * Get period summary with financial metrics
     */
    static async getPeriodSummary(periodId) {
        try {
            const period = await database_1.default.period.findUnique({
                where: { id: periodId },
                include: {
                    transactions: {
                        include: {
                            journalEntries: {
                                include: {
                                    account: true
                                }
                            }
                        }
                    }
                }
            });
            if (!period) {
                return {
                    success: false,
                    error: 'Period not found'
                };
            }
            let totalDebits = new library_1.Decimal(0);
            let totalCredits = new library_1.Decimal(0);
            let netIncome = new library_1.Decimal(0);
            let balancedTransactions = 0;
            for (const transaction of period.transactions) {
                if (transaction.isBalanced) {
                    balancedTransactions++;
                }
                for (const entry of transaction.journalEntries) {
                    if (entry.debit)
                        totalDebits = totalDebits.add(entry.debit);
                    if (entry.credit)
                        totalCredits = totalCredits.add(entry.credit);
                    // Calculate net income
                    if (entry.account.type === 'REVENUE') {
                        netIncome = netIncome.add(entry.credit || new library_1.Decimal(0));
                        netIncome = netIncome.sub(entry.debit || new library_1.Decimal(0));
                    }
                    else if (entry.account.type === 'EXPENSE') {
                        netIncome = netIncome.sub(entry.credit || new library_1.Decimal(0));
                        netIncome = netIncome.add(entry.debit || new library_1.Decimal(0));
                    }
                }
            }
            // Get accounting equation for this period
            const equationResult = await equityService_1.EquityService.getAccountingEquation();
            const accountingEquation = equationResult.success ? equationResult.data : {
                totalAssets: new library_1.Decimal(0),
                totalLiabilities: new library_1.Decimal(0),
                totalEquity: new library_1.Decimal(0),
                isBalanced: false
            };
            return {
                success: true,
                data: {
                    period,
                    totalTransactions: period.transactions.length,
                    balancedTransactions,
                    totalDebits,
                    totalCredits,
                    netIncome,
                    accountingEquation
                }
            };
        }
        catch (error) {
            console.error('Error getting period summary:', error);
            return {
                success: false,
                error: 'Failed to get period summary'
            };
        }
    }
    /**
     * Delete period (only if open and no transactions)
     */
    static async deletePeriod(id) {
        try {
            const period = await database_1.default.period.findUnique({
                where: { id },
                include: {
                    transactions: true
                }
            });
            if (!period) {
                return {
                    success: false,
                    error: 'Period not found'
                };
            }
            if (period.status !== accounting_1.PeriodStatus.OPEN) {
                return {
                    success: false,
                    error: 'Cannot delete closed or locked period'
                };
            }
            if (period.transactions.length > 0) {
                return {
                    success: false,
                    error: 'Cannot delete period with transactions'
                };
            }
            await database_1.default.period.delete({
                where: { id }
            });
            return {
                success: true,
                data: true,
                message: 'Period deleted successfully'
            };
        }
        catch (error) {
            console.error('Error deleting period:', error);
            return {
                success: false,
                error: 'Failed to delete period'
            };
        }
    }
}
exports.PeriodService = PeriodService;
//# sourceMappingURL=periodService.js.map