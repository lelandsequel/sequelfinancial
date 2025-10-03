import express from 'express';
import { ChartOfAccountsService } from '../services/chartOfAccountsService';
import { AccountType, AccountStatus } from '../types/accounting';

const router = express.Router();

// GET /api/chart-of-accounts - Get all accounts with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const type = req.query.type as AccountType;
    const status = req.query.status as AccountStatus;
    const parentOnly = req.query.parentOnly === 'true';

    const result = await ChartOfAccountsService.getAllAccounts(page, limit, type, status, parentOnly);

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

// GET /api/chart-of-accounts/hierarchy - Get account hierarchy
router.get('/hierarchy', async (req, res) => {
  try {
    const type = req.query.type as AccountType;
    const result = await ChartOfAccountsService.getAccountHierarchy(type);

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

// GET /api/chart-of-accounts/next-number/:type - Get next available account number
router.get('/next-number/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const result = await ChartOfAccountsService.getNextAccountNumber(type as AccountType);

    if (result.success) {
      res.json(result);
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

// GET /api/chart-of-accounts/search - Search accounts by name or number
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q as string;
    const type = req.query.type as AccountType;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const result = await ChartOfAccountsService.searchAccounts(query, type);

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

// GET /api/chart-of-accounts/:id - Get account by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ChartOfAccountsService.getAccountById(id);

    if (result.success) {
      res.json(result);
    } else if (result.error === 'Account not found') {
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

// GET /api/chart-of-accounts/number/:accountNumber - Get account by account number
router.get('/number/:accountNumber', async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const result = await ChartOfAccountsService.getAccountByNumber(accountNumber);

    if (result.success) {
      res.json(result);
    } else if (result.error === 'Account not found') {
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

// POST /api/chart-of-accounts - Create new account
router.post('/', async (req, res) => {
  try {
    const { accountNumber, name, type, parentId, description } = req.body;

    const result = await ChartOfAccountsService.createAccount({
      accountNumber,
      name,
      type: type as AccountType,
      parentId,
      description
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

// PUT /api/chart-of-accounts/:id - Update account
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const result = await ChartOfAccountsService.updateAccount(id, updateData);

    if (result.success) {
      res.json(result);
    } else if (result.error === 'Account not found') {
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

// DELETE /api/chart-of-accounts/:id - Delete account
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ChartOfAccountsService.deleteAccount(id);

    if (result.success) {
      res.json(result);
    } else if (result.error === 'Account not found') {
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

export { router as chartOfAccountsRoutes };
