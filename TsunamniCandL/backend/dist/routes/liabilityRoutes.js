"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.liabilityRoutes = void 0;
const express_1 = __importDefault(require("express"));
const liabilityService_1 = require("../services/liabilityService");
const router = express_1.default.Router();
exports.liabilityRoutes = router;
// GET /api/liabilities - Get all liabilities with pagination
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const activeOnly = req.query.activeOnly !== 'false';
        const result = await liabilityService_1.LiabilityService.getAllLiabilities(page, limit, activeOnly);
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
// GET /api/liabilities/total - Get total liability amount
router.get('/total', async (req, res) => {
    try {
        const activeOnly = req.query.activeOnly !== 'false';
        const result = await liabilityService_1.LiabilityService.getTotalLiabilityAmount(activeOnly);
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
// GET /api/liabilities/due/:days - Get liabilities due within X days
router.get('/due/:days', async (req, res) => {
    try {
        const days = parseInt(req.params.days);
        const activeOnly = req.query.activeOnly !== 'false';
        const result = await liabilityService_1.LiabilityService.getLiabilitiesDueWithin(days, activeOnly);
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
// GET /api/liabilities/:id - Get liability by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await liabilityService_1.LiabilityService.getLiabilityById(id);
        if (result.success) {
            res.json(result);
        }
        else if (result.error === 'Liability not found') {
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
// POST /api/liabilities - Create new liability
router.post('/', async (req, res) => {
    try {
        const { name, type, amountOwed, dueDate, creditor, description } = req.body;
        const result = await liabilityService_1.LiabilityService.createLiability({
            name,
            type: type,
            amountOwed,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            creditor,
            description
        });
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
// PUT /api/liabilities/:id - Update liability
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (updateData.dueDate) {
            updateData.dueDate = new Date(updateData.dueDate);
        }
        const result = await liabilityService_1.LiabilityService.updateLiability(id, updateData);
        if (result.success) {
            res.json(result);
        }
        else if (result.error === 'Liability not found') {
            res.status(404).json(result);
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
// DELETE /api/liabilities/:id - Delete liability (soft delete)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await liabilityService_1.LiabilityService.deleteLiability(id);
        if (result.success) {
            res.json(result);
        }
        else if (result.error === 'Liability not found') {
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
//# sourceMappingURL=liabilityRoutes.js.map