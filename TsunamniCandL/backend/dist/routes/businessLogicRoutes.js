"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessLogicRoutes = void 0;
const express_1 = __importDefault(require("express"));
const businessLogicService_1 = require("../services/businessLogicService");
const library_1 = require("@prisma/client/runtime/library");
const router = express_1.default.Router();
exports.businessLogicRoutes = router;
// GET /api/business-logic/financial-ratios - Get financial ratios
router.get('/financial-ratios', async (req, res) => {
    try {
        const periodId = req.query.periodId;
        const result = await businessLogicService_1.BusinessLogicService.calculateFinancialRatios(periodId);
        if (result.success) {
            res.json(result);
        }
        else {
            res.status(500).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// GET /api/business-logic/income-statement/:periodId - Generate income statement
router.get('/income-statement/:periodId', async (req, res) => {
    try {
        const { periodId } = req.params;
        const result = await businessLogicService_1.BusinessLogicService.generateIncomeStatement(periodId);
        if (result.success) {
            res.json(result);
        }
        else if (result.error === 'Period not found') {
            res.status(404).json(result);
        }
        else {
            res.status(500).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// GET /api/business-logic/balance-sheet - Generate balance sheet
router.get('/balance-sheet', async (req, res) => {
    try {
        const asOfDate = req.query.asOfDate ? new Date(req.query.asOfDate) : undefined;
        const result = await businessLogicService_1.BusinessLogicService.generateBalanceSheet(asOfDate);
        if (result.success) {
            res.json(result);
        }
        else {
            res.status(500).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// GET /api/business-logic/cash-flow/:periodId - Generate cash flow statement
router.get('/cash-flow/:periodId', async (req, res) => {
    try {
        const { periodId } = req.params;
        const result = await businessLogicService_1.BusinessLogicService.generateCashFlowStatement(periodId);
        if (result.success) {
            res.json(result);
        }
        else if (result.error === 'Period not found') {
            res.status(404).json(result);
        }
        else {
            res.status(500).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// POST /api/business-logic/accruals/:periodId - Create accrual entries
router.post('/accruals/:periodId', async (req, res) => {
    try {
        const { periodId } = req.params;
        const { adjustments } = req.body;
        if (!adjustments || !Array.isArray(adjustments)) {
            return res.status(400).json({
                success: false,
                error: 'Adjustments array is required'
            });
        }
        const result = await businessLogicService_1.BusinessLogicService.createAccrualEntries(periodId, adjustments);
        if (result.success) {
            res.status(201).json(result);
        }
        else {
            res.status(400).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// GET /api/business-logic/comparative-report - Generate comparative report
router.get('/comparative-report', async (req, res) => {
    try {
        const periodIds = req.query.periodIds;
        const reportType = req.query.reportType;
        if (!periodIds || !Array.isArray(periodIds) || periodIds.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'periodIds array is required'
            });
        }
        if (!reportType || !['income-statement', 'balance-sheet'].includes(reportType)) {
            return res.status(400).json({
                success: false,
                error: 'Valid reportType is required (income-statement or balance-sheet)'
            });
        }
        const result = await businessLogicService_1.BusinessLogicService.generateComparativeReport(periodIds, reportType);
        if (result.success) {
            res.json(result);
        }
        else {
            res.status(500).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// GET /api/business-logic/financial-statements/:periodId - Get all financial statements for a period
router.get('/financial-statements/:periodId', async (req, res) => {
    try {
        const { periodId } = req.params;
        const [incomeStatement, cashFlow, balanceSheet] = await Promise.all([
            businessLogicService_1.BusinessLogicService.generateIncomeStatement(periodId),
            businessLogicService_1.BusinessLogicService.generateCashFlowStatement(periodId),
            businessLogicService_1.BusinessLogicService.generateBalanceSheet()
        ]);
        if (!incomeStatement.success || !cashFlow.success || !balanceSheet.success) {
            return res.status(500).json({
                success: false,
                error: 'Failed to generate one or more financial statements'
            });
        }
        res.json({
            success: true,
            data: {
                incomeStatement: incomeStatement.data,
                cashFlowStatement: cashFlow.data,
                balanceSheet: balanceSheet.data
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// GET /api/business-logic/profit-loss-analysis - Profit/loss analysis with trends
router.get('/profit-loss-analysis', async (req, res) => {
    try {
        const periods = parseInt(req.query.periods) || 12;
        // Import PeriodService to get periods
        const { PeriodService } = await Promise.resolve().then(() => __importStar(require('../services/periodService')));
        // Get recent closed periods
        const recentPeriodsResult = await PeriodService.getAllPeriods(1, periods, 'CLOSED');
        if (!recentPeriodsResult.success) {
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch period data'
            });
        }
        const periods_data = recentPeriodsResult.data.data;
        const analysis = [];
        for (const period of periods_data) {
            const incomeResult = await businessLogicService_1.BusinessLogicService.generateIncomeStatement(period.id);
            if (incomeResult.success) {
                analysis.push({
                    period: period.name,
                    revenues: incomeResult.data.revenues,
                    expenses: incomeResult.data.expenses,
                    netIncome: incomeResult.data.netIncome,
                    periodInfo: incomeResult.data.period
                });
            }
        }
        // Calculate trends
        const trends = calculateTrends(analysis);
        res.json({
            success: true,
            data: {
                analysis,
                trends,
                summary: {
                    totalPeriods: analysis.length,
                    averageNetIncome: analysis.length > 0
                        ? analysis.reduce((sum, item) => sum + parseFloat(item.netIncome.toString()), 0) / analysis.length
                        : 0,
                    bestPeriod: analysis.length > 0
                        ? analysis.reduce((best, current) => parseFloat(current.netIncome.toString()) > parseFloat(best.netIncome.toString()) ? current : best)
                        : null
                }
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// GET /api/business-logic/revenue-expense-breakdown - Revenue and expense breakdown by category
router.get('/revenue-expense-breakdown', async (req, res) => {
    try {
        const periodId = req.query.periodId;
        const category = req.query.category;
        if (!category || !['revenue', 'expense'].includes(category)) {
            return res.status(400).json({
                success: false,
                error: 'Valid category is required (revenue or expense)'
            });
        }
        const incomeResult = await businessLogicService_1.BusinessLogicService.generateIncomeStatement(periodId ? periodId : undefined);
        if (!incomeResult.success) {
            return res.status(500).json({
                success: false,
                error: 'Failed to generate income data'
            });
        }
        const data = category === 'revenue' ? incomeResult.data.revenues : incomeResult.data.expenses;
        // Group by account and calculate percentages
        const total = data.reduce((sum, item) => sum.add(item.amount), new library_1.Decimal(0));
        const breakdown = data.map(item => ({
            account: item.account,
            amount: item.amount,
            percentage: total.greaterThan(0) ? item.amount.div(total).mul(100).toFixed(2) : '0.00'
        }));
        res.json({
            success: true,
            data: {
                category,
                total,
                breakdown: breakdown.sort((a, b) => parseFloat(b.amount.toString()) - parseFloat(a.amount.toString())),
                period: incomeResult.data.period
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// Helper function for trend calculation
function calculateTrends(analysis) {
    if (analysis.length < 2)
        return { trend: 'insufficient-data', change: 0 };
    const values = analysis.map(item => parseFloat(item.netIncome.toString()));
    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    const change = ((lastValue - firstValue) / Math.abs(firstValue)) * 100;
    const trend = change > 5 ? 'increasing' : change < -5 ? 'decreasing' : 'stable';
    return {
        trend,
        change: change.toFixed(2),
        periodOverPeriod: values.slice(1).map((value, index) => ({
            period: analysis[index + 1].period,
            change: (((value - values[index]) / Math.abs(values[index])) * 100).toFixed(2)
        }))
    };
}
//# sourceMappingURL=businessLogicRoutes.js.map