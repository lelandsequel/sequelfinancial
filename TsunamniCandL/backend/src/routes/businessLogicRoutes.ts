import express from 'express';
import { BusinessLogicService } from '../services/businessLogicService';
import { Decimal } from '@prisma/client/runtime/library';

const router = express.Router();

// GET /api/business-logic/financial-ratios - Get financial ratios
router.get('/financial-ratios', async (req, res) => {
  try {
    const periodId = req.query.periodId as string;

    const result = await BusinessLogicService.calculateFinancialRatios(periodId);

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error: any) {
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

    const result = await BusinessLogicService.generateIncomeStatement(periodId);

    if (result.success) {
      res.json(result);
    } else if (result.error === 'Period not found') {
      res.status(404).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/business-logic/balance-sheet - Generate balance sheet
router.get('/balance-sheet', async (req, res) => {
  try {
    const asOfDate = req.query.asOfDate ? new Date(req.query.asOfDate as string) : undefined;

    const result = await BusinessLogicService.generateBalanceSheet(asOfDate);

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error: any) {
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

    const result = await BusinessLogicService.generateCashFlowStatement(periodId);

    if (result.success) {
      res.json(result);
    } else if (result.error === 'Period not found') {
      res.status(404).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error: any) {
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

    const result = await BusinessLogicService.createAccrualEntries(periodId, adjustments);

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/business-logic/comparative-report - Generate comparative report
router.get('/comparative-report', async (req, res) => {
  try {
    const periodIds = req.query.periodIds as string[];
    const reportType = req.query.reportType as 'income-statement' | 'balance-sheet';

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

    const result = await BusinessLogicService.generateComparativeReport(periodIds, reportType);

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error: any) {
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
      BusinessLogicService.generateIncomeStatement(periodId),
      BusinessLogicService.generateCashFlowStatement(periodId),
      BusinessLogicService.generateBalanceSheet()
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/business-logic/profit-loss-analysis - Profit/loss analysis with trends
router.get('/profit-loss-analysis', async (req, res) => {
  try {
    const periods = parseInt(req.query.periods as string) || 12;

    // Import PeriodService to get periods
    const { PeriodService } = await import('../services/periodService');

    // Get recent closed periods
    const recentPeriodsResult = await PeriodService.getAllPeriods(1, periods, 'CLOSED' as any);

    if (!recentPeriodsResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch period data'
      });
    }

    const periods_data = recentPeriodsResult.data!.data;
    const analysis = [];

    for (const period of periods_data) {
      const incomeResult = await BusinessLogicService.generateIncomeStatement(period.id);
      if (incomeResult.success) {
        analysis.push({
          period: period.name,
          revenues: incomeResult.data!.revenues,
          expenses: incomeResult.data!.expenses,
          netIncome: incomeResult.data!.netIncome,
          periodInfo: incomeResult.data!.period
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
            ? analysis.reduce((best, current) =>
                parseFloat(current.netIncome.toString()) > parseFloat(best.netIncome.toString()) ? current : best
              )
            : null
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/business-logic/revenue-expense-breakdown - Revenue and expense breakdown by category
router.get('/revenue-expense-breakdown', async (req, res) => {
  try {
    const periodId = req.query.periodId as string;
    const category = req.query.category as 'revenue' | 'expense';

    if (!category || !['revenue', 'expense'].includes(category)) {
      return res.status(400).json({
        success: false,
        error: 'Valid category is required (revenue or expense)'
      });
    }

    const incomeResult = await BusinessLogicService.generateIncomeStatement(periodId ? periodId : undefined);

    if (!incomeResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate income data'
      });
    }

    const data = category === 'revenue' ? incomeResult.data!.revenues : incomeResult.data!.expenses;

    // Group by account and calculate percentages
    const total = data.reduce((sum, item) => sum.add(item.amount), new Decimal(0));
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
        period: incomeResult.data!.period
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Helper function for trend calculation
function calculateTrends(analysis: any[]) {
  if (analysis.length < 2) return { trend: 'insufficient-data', change: 0 };

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

export { router as businessLogicRoutes };
