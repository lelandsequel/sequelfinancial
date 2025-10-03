"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revenueRoutes = void 0;
const express_1 = __importDefault(require("express"));
const revenueService_1 = require("../services/revenueService");
const router = express_1.default.Router();
exports.revenueRoutes = router;
// GET /api/revenue - Get all revenue with pagination
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await revenueService_1.RevenueService.getAllRevenue(page, limit);
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
// GET /api/revenue/total - Get total revenue amount
router.get('/total', async (req, res) => {
    try {
        const result = await revenueService_1.RevenueService.getTotalRevenue();
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
// GET /api/revenue/source/:source - Get revenue by source
router.get('/source/:source', async (req, res) => {
    try {
        const { source } = req.params;
        const result = await revenueService_1.RevenueService.getRevenueBySource(decodeURIComponent(source));
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
// GET /api/revenue/recurring - Get recurring revenue
router.get('/recurring', async (req, res) => {
    try {
        const result = await revenueService_1.RevenueService.getRecurringRevenue();
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
// GET /api/revenue/:id - Get revenue by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await revenueService_1.RevenueService.getRevenueById(id);
        if (result.success) {
            res.json(result);
        }
        else if (result.error === 'Revenue not found') {
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
// POST /api/revenue - Create new revenue entry
router.post('/', async (req, res) => {
    try {
        const { source, amount, date, description, customerId, isRecurring } = req.body;
        const result = await revenueService_1.RevenueService.createRevenue({
            source,
            amount,
            date: new Date(date),
            description,
            customerId,
            isRecurring
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
// PUT /api/revenue/:id - Update revenue
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (updateData.date) {
            updateData.date = new Date(updateData.date);
        }
        const result = await revenueService_1.RevenueService.updateRevenue(id, updateData);
        if (result.success) {
            res.json(result);
        }
        else if (result.error === 'Revenue not found') {
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
// DELETE /api/revenue/:id - Delete revenue
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await revenueService_1.RevenueService.deleteRevenue(id);
        if (result.success) {
            res.json(result);
        }
        else if (result.error === 'Revenue not found') {
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
//# sourceMappingURL=revenueRoutes.js.map