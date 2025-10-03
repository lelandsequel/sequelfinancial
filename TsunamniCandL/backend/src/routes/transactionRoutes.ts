import express from 'express';
import { TransactionService } from '../services/transactionService';
import { TransactionType } from '../types/accounting';

const router = express.Router();

// GET /api/transactions - Get all transactions with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const type = req.query.type as TransactionType;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    const isBalanced = req.query.isBalanced ? req.query.isBalanced === 'true' : undefined;

    const result = await TransactionService.getAllTransactions(page, limit, type, startDate, endDate, isBalanced);

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

// GET /api/transactions/summary - Get transaction summary by type
router.get('/summary', async (req, res) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const result = await TransactionService.getTransactionSummary(startDate, endDate);

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

// GET /api/transactions/unbalanced - Get unbalanced transactions
router.get('/unbalanced', async (req, res) => {
  try {
    const result = await TransactionService.getUnbalancedTransactions();

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

// GET /api/transactions/:id - Get transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await TransactionService.getTransactionById(id);

    if (result.success) {
      res.json(result);
    } else if (result.error === 'Transaction not found') {
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

// GET /api/transactions/:id/balance - Get account balance for transaction
router.get('/:id/balance/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const result = await TransactionService.getAccountBalance(accountId, startDate, endDate);

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

// POST /api/transactions - Create new transaction with journal entries
router.post('/', async (req, res) => {
  try {
    const { type, description, amount, date, periodId, reference, assetId, liabilityId, equityId, revenueId, expenseId, journalEntries } = req.body;

    // If no periodId provided, get the current period
    let transactionPeriodId = periodId;
    if (!transactionPeriodId) {
      const { PeriodService } = await import('../services/periodService');
      const currentPeriodResult = await PeriodService.getCurrentPeriod();
      if (currentPeriodResult.success) {
        transactionPeriodId = currentPeriodResult.data!.id;
      } else {
        return res.status(400).json({
          success: false,
          error: 'No period specified and no current period found'
        });
      }
    }

    const result = await TransactionService.createTransaction({
      type: type as TransactionType,
      description,
      amount,
      date: new Date(date),
      periodId: transactionPeriodId,
      reference,
      assetId,
      liabilityId,
      equityId,
      revenueId,
      expenseId,
      journalEntries
    });

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

// PUT /api/transactions/:id - Update transaction
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    const result = await TransactionService.updateTransaction(id, updateData);

    if (result.success) {
      res.json(result);
    } else if (result.error === 'Transaction not found') {
      res.status(404).json(result);
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

// DELETE /api/transactions/:id - Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await TransactionService.deleteTransaction(id);

    if (result.success) {
      res.json(result);
    } else if (result.error === 'Transaction not found') {
      res.status(404).json(result);
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

// POST /api/transactions/:id/balance - Balance a transaction
router.post('/:id/balance', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await TransactionService.balanceTransaction(id);

    if (result.success) {
      res.json(result);
    } else if (result.error === 'Transaction not found') {
      res.status(404).json(result);
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

// POST /api/transactions/validate - Validate journal entries without creating transaction
router.post('/validate', async (req, res) => {
  try {
    const { journalEntries } = req.body;

    if (!journalEntries || !Array.isArray(journalEntries)) {
      return res.status(400).json({
        success: false,
        error: 'Journal entries array is required'
      });
    }

    const validation = TransactionService.validateJournalEntries(journalEntries);

    res.json({
      success: true,
      data: validation
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export { router as transactionRoutes };
