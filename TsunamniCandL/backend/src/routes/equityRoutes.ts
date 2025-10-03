import express from 'express';
import { EquityService } from '../services/equityService';
import { EquityType } from '../types/accounting';

const router = express.Router();

// GET /api/equity - Get all equity entries
router.get('/', async (req, res) => {
  try {
    const result = await EquityService.getAllEquity();

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/equity/total - Get total equity value
router.get('/total', async (req, res) => {
  try {
    const result = await EquityService.getTotalEquityValue();

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/equity/equation - Get accounting equation status
router.get('/equation', async (req, res) => {
  try {
    const result = await EquityService.getAccountingEquation();

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/equity/type/:type - Get equity by type
router.get('/type/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const result = await EquityService.getEquityByType(type);

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/equity/:id - Get equity by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await EquityService.getEquityById(id);

    if (result.success) {
      res.json(result);
    } else if (result.error === 'Equity not found') {
      res.status(404).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST /api/equity - Create new equity entry
router.post('/', async (req, res) => {
  try {
    const { type, sharesOutstanding, parValue, description } = req.body;

    const result = await EquityService.createEquity({
      type: type as EquityType,
      sharesOutstanding,
      parValue,
      description
    });

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// PUT /api/equity/:id - Update equity
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const result = await EquityService.updateEquity(id, updateData);

    if (result.success) {
      res.json(result);
    } else if (result.error === 'Equity not found') {
      res.status(404).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST /api/equity/calculate-retained-earnings - Calculate retained earnings
router.post('/calculate-retained-earnings', async (req, res) => {
  try {
    const result = await EquityService.calculateRetainedEarnings();

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export { router as equityRoutes };
