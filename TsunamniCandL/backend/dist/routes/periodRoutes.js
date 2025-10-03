"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.periodRoutes = void 0;
const express_1 = __importDefault(require("express"));
const periodService_1 = require("../services/periodService");
const accounting_1 = require("../types/accounting");
const router = express_1.default.Router();
exports.periodRoutes = router;
// GET /api/periods - Get all periods with pagination
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const result = await periodService_1.PeriodService.getAllPeriods(page, limit, status);
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
// GET /api/periods/current - Get current period
router.get('/current', async (req, res) => {
    try {
        const result = await periodService_1.PeriodService.getCurrentPeriod();
        if (result.success) {
            res.json(result);
        }
        else if (result.error === 'No current period found') {
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
// GET /api/periods/:id - Get period by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await periodService_1.PeriodService.getPeriodById(id);
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
// GET /api/periods/:id/summary - Get period summary with financial metrics
router.get('/:id/summary', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await periodService_1.PeriodService.getPeriodSummary(id);
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
// POST /api/periods - Create new period
router.post('/', async (req, res) => {
    try {
        const { name, type, startDate, endDate, notes } = req.body;
        const result = await periodService_1.PeriodService.createPeriod({
            name,
            type: type,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            notes
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
// PUT /api/periods/:id - Update period
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (updateData.startDate) {
            updateData.startDate = new Date(updateData.startDate);
        }
        if (updateData.endDate) {
            updateData.endDate = new Date(updateData.endDate);
        }
        if (updateData.closedAt) {
            updateData.closedAt = new Date(updateData.closedAt);
        }
        const result = await periodService_1.PeriodService.updatePeriod(id, updateData);
        if (result.success) {
            res.json(result);
        }
        else if (result.error === 'Period not found') {
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
// POST /api/periods/:id/close - Close accounting period
router.post('/:id/close', async (req, res) => {
    try {
        const { id } = req.params;
        const { closedBy } = req.body;
        if (!closedBy) {
            return res.status(400).json({
                success: false,
                error: 'closedBy is required'
            });
        }
        const result = await periodService_1.PeriodService.closePeriod(id, closedBy);
        if (result.success) {
            res.json(result);
        }
        else if (result.error?.includes('not found')) {
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
// DELETE /api/periods/:id - Delete period
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await periodService_1.PeriodService.deletePeriod(id);
        if (result.success) {
            res.json(result);
        }
        else if (result.error === 'Period not found') {
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
// POST /api/periods/generate - Generate periods for a year
router.post('/generate', async (req, res) => {
    try {
        const { year, type } = req.body;
        if (!year || !type) {
            return res.status(400).json({
                success: false,
                error: 'year and type are required'
            });
        }
        const periods = [];
        const startYear = new Date(year, 0, 1);
        const endYear = new Date(year, 11, 31);
        if (type === accounting_1.PeriodType.ANNUAL) {
            const result = await periodService_1.PeriodService.createPeriod({
                name: `FY ${year}`,
                type: accounting_1.PeriodType.ANNUAL,
                startDate: startYear,
                endDate: endYear
            });
            if (result.success) {
                periods.push(result.data);
            }
        }
        else if (type === accounting_1.PeriodType.QUARTERLY) {
            for (let quarter = 0; quarter < 4; quarter++) {
                const startMonth = quarter * 3;
                const startDate = new Date(year, startMonth, 1);
                const endDate = new Date(year, startMonth + 3, 0);
                const result = await periodService_1.PeriodService.createPeriod({
                    name: `Q${quarter + 1} ${year}`,
                    type: accounting_1.PeriodType.QUARTERLY,
                    startDate,
                    endDate
                });
                if (result.success) {
                    periods.push(result.data);
                }
            }
        }
        else if (type === accounting_1.PeriodType.MONTHLY) {
            for (let month = 0; month < 12; month++) {
                const startDate = new Date(year, month, 1);
                const endDate = new Date(year, month + 1, 0);
                const monthName = startDate.toLocaleString('default', { month: 'long' });
                const result = await periodService_1.PeriodService.createPeriod({
                    name: `${monthName} ${year}`,
                    type: accounting_1.PeriodType.MONTHLY,
                    startDate,
                    endDate
                });
                if (result.success) {
                    periods.push(result.data);
                }
            }
        }
        res.json({
            success: true,
            data: periods,
            message: `Generated ${periods.length} periods for ${year}`
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
//# sourceMappingURL=periodRoutes.js.map