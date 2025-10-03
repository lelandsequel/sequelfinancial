"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const transactionService_1 = require("../services/transactionService");
const router = express_1.default.Router();
exports.transactionRoutes = router;
// GET /api/transactions - Get all transactions with pagination and filtering
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const type = req.query.type;
        const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
        const isBalanced = req.query.isBalanced ? req.query.isBalanced === 'true' : undefined;
        const result = await transactionService_1.TransactionService.getAllTransactions(page, limit, type, startDate, endDate, isBalanced);
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
// GET /api/transactions/summary - Get transaction summary by type
router.get('/summary', async (req, res) => {
    try {
        const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
        const result = await transactionService_1.TransactionService.getTransactionSummary(startDate, endDate);
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
// GET /api/transactions/unbalanced - Get unbalanced transactions
router.get('/unbalanced', async (req, res) => {
    try {
        const result = await transactionService_1.TransactionService.getUnbalancedTransactions();
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
// GET /api/transactions/:id - Get transaction by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await transactionService_1.TransactionService.getTransactionById(id);
        if (result.success) {
            res.json(result);
        }
        else if (result.error === 'Transaction not found') {
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
// GET /api/transactions/:id/balance - Get account balance for transaction
router.get('/:id/balance/:accountId', async (req, res) => {
    try {
        const { accountId } = req.params;
        const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
        const result = await transactionService_1.TransactionService.getAccountBalance(accountId, startDate, endDate);
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
// POST /api/transactions - Create new transaction with journal entries
router.post('/', async (req, res) => {
    try {
        const { type, description, amount, date, reference, assetId, liabilityId, equityId, revenueId, expenseId, journalEntries } = req.body;
        const result = await transactionService_1.TransactionService.createTransaction({
            type: type,
            description,
            amount,
            date: new Date(date),
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
// PUT /api/transactions/:id - Update transaction
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (updateData.date) {
            updateData.date = new Date(updateData.date);
        }
        const result = await transactionService_1.TransactionService.updateTransaction(id, updateData);
        if (result.success) {
            res.json(result);
        }
        else if (result.error === 'Transaction not found') {
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
// DELETE /api/transactions/:id - Delete transaction
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await transactionService_1.TransactionService.deleteTransaction(id);
        if (result.success) {
            res.json(result);
        }
        else if (result.error === 'Transaction not found') {
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
// POST /api/transactions/:id/balance - Balance a transaction
router.post('/:id/balance', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await transactionService_1.TransactionService.balanceTransaction(id);
        if (result.success) {
            res.json(result);
        }
        else if (result.error === 'Transaction not found') {
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
        const validation = transactionService_1.TransactionService.validateJournalEntries(journalEntries);
        res.json({
            success: true,
            data: validation
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
//# sourceMappingURL=transactionRoutes.js.map