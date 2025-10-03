"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chartOfAccountsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const chartOfAccountsService_1 = require("../services/chartOfAccountsService");
const router = express_1.default.Router();
exports.chartOfAccountsRoutes = router;
// GET /api/chart-of-accounts - Get all accounts with pagination and filtering
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const type = req.query.type;
        const status = req.query.status;
        const parentOnly = req.query.parentOnly === 'true';
        const result = await chartOfAccountsService_1.ChartOfAccountsService.getAllAccounts(page, limit, type, status, parentOnly);
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
// GET /api/chart-of-accounts/hierarchy - Get account hierarchy
router.get('/hierarchy', async (req, res) => {
    try {
        const type = req.query.type;
        const result = await chartOfAccountsService_1.ChartOfAccountsService.getAccountHierarchy(type);
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
// GET /api/chart-of-accounts/next-number/:type - Get next available account number
router.get('/next-number/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const result = await chartOfAccountsService_1.ChartOfAccountsService.getNextAccountNumber(type);
        if (result.success) {
            res.json(result);
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
// GET /api/chart-of-accounts/search - Search accounts by name or number
router.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        const type = req.query.type;
        if (!query) {
            return res.status(400).json({
                success: false,
                error: 'Search query is required'
            });
        }
        const result = await chartOfAccountsService_1.ChartOfAccountsService.searchAccounts(query, type);
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
// GET /api/chart-of-accounts/:id - Get account by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await chartOfAccountsService_1.ChartOfAccountsService.getAccountById(id);
        if (result.success) {
            res.json(result);
        }
        else if (result.error === 'Account not found') {
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
// GET /api/chart-of-accounts/number/:accountNumber - Get account by account number
router.get('/number/:accountNumber', async (req, res) => {
    try {
        const { accountNumber } = req.params;
        const result = await chartOfAccountsService_1.ChartOfAccountsService.getAccountByNumber(accountNumber);
        if (result.success) {
            res.json(result);
        }
        else if (result.error === 'Account not found') {
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
// POST /api/chart-of-accounts - Create new account
router.post('/', async (req, res) => {
    try {
        const { accountNumber, name, type, parentId, description } = req.body;
        const result = await chartOfAccountsService_1.ChartOfAccountsService.createAccount({
            accountNumber,
            name,
            type: type,
            parentId,
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
// PUT /api/chart-of-accounts/:id - Update account
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const result = await chartOfAccountsService_1.ChartOfAccountsService.updateAccount(id, updateData);
        if (result.success) {
            res.json(result);
        }
        else if (result.error === 'Account not found') {
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
// DELETE /api/chart-of-accounts/:id - Delete account
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await chartOfAccountsService_1.ChartOfAccountsService.deleteAccount(id);
        if (result.success) {
            res.json(result);
        }
        else if (result.error === 'Account not found') {
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
//# sourceMappingURL=chartOfAccountsRoutes.js.map