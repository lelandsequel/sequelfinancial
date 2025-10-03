"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessLogicService = void 0;
const library_1 = require("@prisma/client/runtime/library");
const database_1 = __importDefault(require("../config/database"));
const accounting_1 = require("../types/accounting");
class BusinessLogicService {
    /**
     * Calculate comprehensive financial ratios for a period
     */
    static async calculateFinancialRatios(periodId) {
        try {
            // Get accounting equation data
            const equationResult = await this.getAccountingEquation(periodId);
            if (!equationResult.success) {
                return { success: false, error: equationResult.error };
            }
            const equation = equationResult.data;
            // Calculate ratios
            const totalAssets = parseFloat(equation.totalAssets.toString());
            const totalLiabilities = parseFloat(equation.totalLiabilities.toString());
            const totalEquity = parseFloat(equation.totalEquity.toString());
            const ratios = {
                currentRatio: totalAssets > 0 ? (totalAssets / totalLiabilities).toFixed(2) : '0.00',
                debtToEquityRatio: totalEquity > 0 ? (totalLiabilities / totalEquity).toFixed(2) : '0.00',
                profitMargin: await this.calculateProfitMargin(periodId),
                returnOnAssets: await this.calculateReturnOnAssets(periodId),
                returnOnEquity: await this.calculateReturnOnEquity(periodId),
            };
            return {
                success: true,
                data: ratios
            };
        }
        catch (error) {
            console.error('Error calculating financial ratios:', error);
            return {
                success: false,
                error: 'Failed to calculate financial ratios'
            };
        }
    }
    /**
     * Generate income statement for a period
     */
    static async generateIncomeStatement(periodId) {
        try {
            let transactions;
            let periodInfo;
            if (periodId) {
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
                    return { success: false, error: 'Period not found' };
                }
                transactions = period.transactions;
                periodInfo = {
                    name: period.name,
                    startDate: period.startDate.toISOString().split('T')[0],
                    endDate: period.endDate.toISOString().split('T')[0]
                };
            }
            else {
                // Get all transactions if no period specified
                transactions = await database_1.default.transaction.findMany({
                    where: { isBalanced: true },
                    include: {
                        journalEntries: {
                            include: {
                                account: true
                            }
                        }
                    }
                });
                const currentDate = new Date().toISOString().split('T')[0];
                periodInfo = {
                    name: 'All Periods',
                    startDate: 'N/A',
                    endDate: currentDate
                };
            }
            const revenues = [];
            const expenses = [];
            let totalRevenues = new library_1.Decimal(0);
            let totalExpenses = new library_1.Decimal(0);
            // Aggregate revenues and expenses from journal entries
            for (const transaction of transactions) {
                if (!transaction.isBalanced)
                    continue;
                for (const entry of transaction.journalEntries) {
                    if (entry.account.type === accounting_1.AccountType.REVENUE) {
                        // Revenue: Credit increases, Debit decreases
                        const amount = entry.credit || new library_1.Decimal(0).sub(entry.debit || new library_1.Decimal(0));
                        if (amount.greaterThan(0)) {
                            revenues.push({ account: entry.account.name, amount });
                            totalRevenues = totalRevenues.add(amount);
                        }
                    }
                    else if (entry.account.type === accounting_1.AccountType.EXPENSE) {
                        // Expense: Debit increases, Credit decreases
                        const amount = entry.debit || new library_1.Decimal(0).sub(entry.credit || new library_1.Decimal(0));
                        if (amount.greaterThan(0)) {
                            expenses.push({ account: entry.account.name, amount });
                            totalExpenses = totalExpenses.add(amount);
                        }
                    }
                }
            }
            const netIncome = totalRevenues.sub(totalExpenses);
            return {
                success: true,
                data: {
                    revenues,
                    expenses,
                    netIncome,
                    period: periodInfo
                }
            };
        }
        catch (error) {
            console.error('Error generating income statement:', error);
            return {
                success: false,
                error: 'Failed to generate income statement'
            };
        }
    }
    /**
     * Generate balance sheet for a specific date
     */
    static async generateBalanceSheet(asOfDate) {
        try {
            const referenceDate = asOfDate || new Date();
            // Get all transactions up to the reference date
            const transactions = await database_1.default.transaction.findMany({
                where: {
                    date: { lte: referenceDate },
                    isBalanced: true
                },
                include: {
                    journalEntries: {
                        include: {
                            account: true
                        }
                    }
                }
            });
            // Calculate balances for each account
            const accountBalances = new Map();
            for (const transaction of transactions) {
                for (const entry of transaction.journalEntries) {
                    const accountId = entry.accountId;
                    const currentBalance = accountBalances.get(accountId)?.balance || new library_1.Decimal(0);
                    // Normal balance logic:
                    // Assets: Debit increases, Credit decreases
                    // Liabilities: Credit increases, Debit decreases
                    // Equity: Credit increases, Debit decreases
                    // Revenue: Credit increases, Debit decreases
                    // Expenses: Debit increases, Credit decreases
                    let balanceChange = new library_1.Decimal(0);
                    if (entry.debit) {
                        if ([accounting_1.AccountType.ASSET, accounting_1.AccountType.EXPENSE].includes(entry.account.type)) {
                            balanceChange = balanceChange.add(entry.debit);
                        }
                        else {
                            balanceChange = balanceChange.sub(entry.debit);
                        }
                    }
                    if (entry.credit) {
                        if ([accounting_1.AccountType.ASSET, accounting_1.AccountType.EXPENSE].includes(entry.account.type)) {
                            balanceChange = balanceChange.sub(entry.credit);
                        }
                        else {
                            balanceChange = balanceChange.add(entry.credit);
                        }
                    }
                    const newBalance = currentBalance.add(balanceChange);
                    accountBalances.set(accountId, {
                        account: entry.account,
                        balance: newBalance
                    });
                }
            }
            // Organize by category
            const assets = { current: [], fixed: [] };
            const liabilities = { current: [], longTerm: [] };
            const equity = [];
            let totalAssets = new library_1.Decimal(0);
            let totalLiabilities = new library_1.Decimal(0);
            let totalEquity = new library_1.Decimal(0);
            for (const [_, { account, balance }] of accountBalances) {
                if (balance.equals(0))
                    continue;
                switch (account.type) {
                    case accounting_1.AccountType.ASSET:
                        if (account.accountNumber.startsWith('1')) { // Current assets
                            assets.current.push({ account: account.name, amount: balance });
                        }
                        else { // Fixed assets
                            assets.fixed.push({ account: account.name, amount: balance });
                        }
                        totalAssets = totalAssets.add(balance);
                        break;
                    case accounting_1.AccountType.LIABILITY:
                        if (account.accountNumber.startsWith('2')) { // Current liabilities
                            liabilities.current.push({ account: account.name, amount: balance });
                        }
                        else { // Long-term liabilities
                            liabilities.longTerm.push({ account: account.name, amount: balance });
                        }
                        totalLiabilities = totalLiabilities.add(balance);
                        break;
                    case accounting_1.AccountType.EQUITY:
                        equity.push({ account: account.name, amount: balance });
                        totalEquity = totalEquity.add(balance);
                        break;
                }
            }
            return {
                success: true,
                data: {
                    assets,
                    liabilities,
                    equity,
                    totalAssets,
                    totalLiabilities,
                    totalEquity,
                    asOfDate: referenceDate.toISOString().split('T')[0]
                }
            };
        }
        catch (error) {
            console.error('Error generating balance sheet:', error);
            return {
                success: false,
                error: 'Failed to generate balance sheet'
            };
        }
    }
    /**
     * Create accrual entries for period-end adjustments
     */
    static async createAccrualEntries(periodId, adjustments) {
        try {
            const period = await database_1.default.period.findUnique({
                where: { id: periodId }
            });
            if (!period || period.status !== accounting_1.PeriodStatus.OPEN) {
                return { success: false, error: 'Period must be open for adjustments' };
            }
            const accrualTransactions = [];
            for (const adjustment of adjustments) {
                // Create adjusting entry
                const transaction = await database_1.default.transaction.create({
                    data: {
                        type: accounting_1.TransactionType.ADJUSTMENTS,
                        description: `${adjustment.type === 'accrue' ? 'Accrual' : 'Deferral'}: ${adjustment.description}`,
                        amount: adjustment.amount,
                        date: period.endDate,
                        periodId: periodId,
                        reference: `ADJ-${Date.now()}`,
                        journalEntries: {
                            create: adjustment.type === 'accrue' ? [
                                // Accrue: Debit expense, Credit liability
                                {
                                    accountId: adjustment.accountId, // Expense account
                                    debit: adjustment.amount
                                },
                                {
                                    accountId: await this.getAccruedLiabilityAccount(),
                                    credit: adjustment.amount
                                }
                            ] : [
                                // Defer: Debit asset, Credit revenue
                                {
                                    accountId: await this.getDeferredAssetAccount(),
                                    debit: adjustment.amount
                                },
                                {
                                    accountId: adjustment.accountId, // Revenue account
                                    credit: adjustment.amount
                                }
                            ]
                        },
                        isBalanced: true
                    }
                });
                accrualTransactions.push(transaction);
            }
            return {
                success: true,
                data: accrualTransactions,
                message: `Created ${adjustments.length} accrual/deferral entries`
            };
        }
        catch (error) {
            console.error('Error creating accrual entries:', error);
            return {
                success: false,
                error: 'Failed to create accrual entries'
            };
        }
    }
    /**
     * Generate comparative reports between periods
     */
    static async generateComparativeReport(periodIds, reportType) {
        try {
            const reports = [];
            for (const periodId of periodIds) {
                if (reportType === 'income-statement') {
                    const result = await this.generateIncomeStatement(periodId);
                    if (result.success) {
                        reports.push(result.data);
                    }
                }
                else if (reportType === 'balance-sheet') {
                    const period = await database_1.default.period.findUnique({ where: { id: periodId } });
                    if (period) {
                        const result = await this.generateBalanceSheet(period.endDate);
                        if (result.success) {
                            reports.push({ ...result.data, period: period.name });
                        }
                    }
                }
            }
            return {
                success: true,
                data: {
                    reportType,
                    periods: reports.length,
                    reports
                }
            };
        }
        catch (error) {
            console.error('Error generating comparative report:', error);
            return {
                success: false,
                error: 'Failed to generate comparative report'
            };
        }
    }
    /**
     * Calculate cash flow statement
     */
    static async generateCashFlowStatement(periodId) {
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
                return { success: false, error: 'Period not found' };
            }
            let operatingCashFlow = new library_1.Decimal(0);
            let investingCashFlow = new library_1.Decimal(0);
            let financingCashFlow = new library_1.Decimal(0);
            // Calculate cash flows from journal entries
            for (const transaction of period.transactions) {
                if (!transaction.isBalanced)
                    continue;
                for (const entry of transaction.journalEntries) {
                    if (entry.account.accountNumber === '1000') { // Cash account
                        const cashChange = (entry.debit || new library_1.Decimal(0)).sub(entry.credit || new library_1.Decimal(0));
                        // Classify cash flow activity
                        if (this.isOperatingActivity(entry.account)) {
                            operatingCashFlow = operatingCashFlow.add(cashChange);
                        }
                        else if (this.isInvestingActivity(entry.account)) {
                            investingCashFlow = investingCashFlow.add(cashChange);
                        }
                        else if (this.isFinancingActivity(entry.account)) {
                            financingCashFlow = financingCashFlow.add(cashChange);
                        }
                    }
                }
            }
            const netCashFlow = operatingCashFlow.add(investingCashFlow).add(financingCashFlow);
            // Get beginning cash balance (from previous period)
            const beginningCash = await this.getCashBalanceAtStartOfPeriod(periodId);
            return {
                success: true,
                data: {
                    operatingActivities: operatingCashFlow,
                    investingActivities: investingCashFlow,
                    financingActivities: financingCashFlow,
                    netCashFlow,
                    beginningCash,
                    endingCash: beginningCash.add(netCashFlow)
                }
            };
        }
        catch (error) {
            console.error('Error generating cash flow statement:', error);
            return {
                success: false,
                error: 'Failed to generate cash flow statement'
            };
        }
    }
    // Helper methods
    static async getAccountingEquation(periodId) {
        const whereClause = periodId ? { periodId } : {};
        const [assets, liabilities, equity] = await Promise.all([
            database_1.default.transaction.aggregate({
                where: {
                    ...whereClause,
                    journalEntries: {
                        some: {
                            account: {
                                type: accounting_1.AccountType.ASSET
                            }
                        }
                    }
                },
                _sum: {
                    amount: true
                }
            }),
            database_1.default.transaction.aggregate({
                where: {
                    ...whereClause,
                    journalEntries: {
                        some: {
                            account: {
                                type: accounting_1.AccountType.LIABILITY
                            }
                        }
                    }
                },
                _sum: {
                    amount: true
                }
            }),
            database_1.default.transaction.aggregate({
                where: {
                    ...whereClause,
                    journalEntries: {
                        some: {
                            account: {
                                type: accounting_1.AccountType.EQUITY
                            }
                        }
                    }
                },
                _sum: {
                    amount: true
                }
            })
        ]);
        return {
            success: true,
            data: {
                totalAssets: assets._sum.amount || new library_1.Decimal(0),
                totalLiabilities: liabilities._sum.amount || new library_1.Decimal(0),
                totalEquity: equity._sum.amount || new library_1.Decimal(0),
                isBalanced: true // Simplified for now
            }
        };
    }
    static async calculateProfitMargin(periodId) {
        const whereClause = periodId ? { periodId } : {};
        const [revenues, expenses] = await Promise.all([
            database_1.default.transaction.aggregate({
                where: {
                    ...whereClause,
                    journalEntries: {
                        some: {
                            account: {
                                type: accounting_1.AccountType.REVENUE
                            }
                        }
                    }
                },
                _sum: { amount: true }
            }),
            database_1.default.transaction.aggregate({
                where: {
                    ...whereClause,
                    journalEntries: {
                        some: {
                            account: {
                                type: accounting_1.AccountType.EXPENSE
                            }
                        }
                    }
                },
                _sum: { amount: true }
            })
        ]);
        const totalRevenue = revenues._sum.amount || new library_1.Decimal(0);
        const totalExpenses = expenses._sum.amount || new library_1.Decimal(0);
        const netIncome = totalRevenue.sub(totalExpenses);
        return totalRevenue.greaterThan(0)
            ? ((parseFloat(netIncome.toString()) / parseFloat(totalRevenue.toString())) * 100).toFixed(2)
            : '0.00';
    }
    static async calculateReturnOnAssets(periodId) {
        const [equation, income] = await Promise.all([
            this.getAccountingEquation(periodId),
            this.calculateNetIncome(periodId)
        ]);
        if (!equation.success)
            return '0.00';
        const totalAssets = parseFloat(equation.data.totalAssets.toString());
        const netIncome = parseFloat(income);
        return totalAssets > 0 ? ((netIncome / totalAssets) * 100).toFixed(2) : '0.00';
    }
    static async calculateReturnOnEquity(periodId) {
        const [equation, income] = await Promise.all([
            this.getAccountingEquation(periodId),
            this.calculateNetIncome(periodId)
        ]);
        if (!equation.success)
            return '0.00';
        const totalEquity = parseFloat(equation.data.totalEquity.toString());
        const netIncome = parseFloat(income);
        return totalEquity > 0 ? ((netIncome / totalEquity) * 100).toFixed(2) : '0.00';
    }
    static async calculateNetIncome(periodId) {
        const whereClause = periodId ? { periodId } : {};
        const [revenues, expenses] = await Promise.all([
            database_1.default.transaction.aggregate({
                where: {
                    ...whereClause,
                    journalEntries: {
                        some: {
                            account: {
                                type: accounting_1.AccountType.REVENUE
                            }
                        }
                    }
                },
                _sum: { amount: true }
            }),
            database_1.default.transaction.aggregate({
                where: {
                    ...whereClause,
                    journalEntries: {
                        some: {
                            account: {
                                type: accounting_1.AccountType.EXPENSE
                            }
                        }
                    }
                },
                _sum: { amount: true }
            })
        ]);
        const totalRevenue = revenues._sum.amount || new library_1.Decimal(0);
        const totalExpenses = expenses._sum.amount || new library_1.Decimal(0);
        return totalRevenue.sub(totalExpenses).toString();
    }
    static async getAccruedLiabilityAccount() {
        const account = await database_1.default.chartOfAccounts.findFirst({
            where: { accountNumber: '2200' } // Accrued Liabilities
        });
        return account?.id || '';
    }
    static async getDeferredAssetAccount() {
        // Create a deferred revenue asset account if it doesn't exist
        let account = await database_1.default.chartOfAccounts.findFirst({
            where: { accountNumber: '1199' } // Deferred Assets
        });
        if (!account) {
            account = await database_1.default.chartOfAccounts.create({
                data: {
                    accountNumber: '1199',
                    name: 'Deferred Assets',
                    type: accounting_1.AccountType.ASSET,
                    description: 'Assets deferred to future periods'
                }
            });
        }
        return account.id;
    }
    static isOperatingActivity(account) {
        // Operating activities typically involve revenue, expenses, and current assets/liabilities
        return ['4000', '5000', '5100', '1100', '2000'].some(prefix => account.accountNumber.startsWith(prefix));
    }
    static isInvestingActivity(account) {
        // Investing activities involve fixed assets
        return account.accountNumber.startsWith('13');
    }
    static isFinancingActivity(account) {
        // Financing activities involve equity and loans
        return ['21', '30', '31'].some(prefix => account.accountNumber.startsWith(prefix));
    }
    static async getCashBalanceAtStartOfPeriod(periodId) {
        const period = await database_1.default.period.findUnique({
            where: { id: periodId }
        });
        if (!period)
            return new library_1.Decimal(0);
        // Get cash balance at the start of the period
        const transactionsBeforePeriod = await database_1.default.transaction.findMany({
            where: {
                date: { lt: period.startDate },
                isBalanced: true
            },
            include: {
                journalEntries: {
                    where: {
                        account: {
                            accountNumber: '1000' // Cash account
                        }
                    }
                }
            }
        });
        let beginningCash = new library_1.Decimal(0);
        for (const transaction of transactionsBeforePeriod) {
            for (const entry of transaction.journalEntries) {
                beginningCash = beginningCash.add(entry.debit || new library_1.Decimal(0));
                beginningCash = beginningCash.sub(entry.credit || new library_1.Decimal(0));
            }
        }
        return beginningCash;
    }
}
exports.BusinessLogicService = BusinessLogicService;
//# sourceMappingURL=businessLogicService.js.map