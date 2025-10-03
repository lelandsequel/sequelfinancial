"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const expenseService_1 = require("../services/expenseService");
const router = express_1.default.Router();
exports.expenseRoutes = router;
// GET /api/expenses - Get all expenses with pagination
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await expenseService_1.ExpenseService.getAllExpenses(page, limit);
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
// GET /api/expenses/total - Get total expenses amount
router.get('/total', async (req, res) => {
    try {
        const result = await expenseService_1.ExpenseService.getTotalExpenses();
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
// GET /api/expenses/category/:category - Get expenses by category
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const result = await expenseService_1.ExpenseService.getExpensesByCategory(decodeURIComponent(category));
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
// GET /api/expenses/recurring - Get recurring expenses
router.get('/recurring', async (req, res) => {
    try {
        const result = await expenseService_1.ExpenseService.getRecurringExpenses();
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
// GET /api/expenses/summary - Get expense summary by category
router.get('/summary', async (req, res) => {
    try {
        const result = await expenseService_1.ExpenseService.getExpenseSummaryByCategory();
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
// GET /api/expenses/:id - Get expense by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await expenseService_1.ExpenseService.getExpenseById(id);
        if (result.success) {
            res.json(result);
        }
        else if (result.error === 'Expense not found') {
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
// POST /api/expenses - Create new expense entry
router.post('/', async (req, res) => {
    try {
        const { category, amount, date, description, vendorId, isRecurring } = req.body;
        const result = await expenseService_1.ExpenseService.createExpense({
            category,
            amount,
            date: new Date(date),
            description,
            vendorId,
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
// PUT /api/expenses/:id - Update expense
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (updateData.date) {
            updateData.date = new Date(updateData.date);
        }
        const result = await expenseService_1.ExpenseService.updateExpense(id, updateData);
        if (result.success) {
            res.json(result);
        }
        else if (result.error === 'Expense not found') {
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
// DELETE /api/expenses/:id - Delete expense
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await expenseService_1.ExpenseService.deleteExpense(id);
        if (result.success) {
            res.json(result);
        }
        else if (result.error === 'Expense not found') {
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
//# sourceMappingURL=expenseRoutes.js.map