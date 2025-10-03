"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const assetRoutes_1 = require("./routes/assetRoutes");
const liabilityRoutes_1 = require("./routes/liabilityRoutes");
const equityRoutes_1 = require("./routes/equityRoutes");
const revenueRoutes_1 = require("./routes/revenueRoutes");
const expenseRoutes_1 = require("./routes/expenseRoutes");
const chartOfAccountsRoutes_1 = require("./routes/chartOfAccountsRoutes");
const transactionRoutes_1 = require("./routes/transactionRoutes");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Tsunami CandL Accounting API is running',
        timestamp: new Date().toISOString()
    });
});
// API Routes
app.use('/api/assets', assetRoutes_1.assetRoutes);
app.use('/api/liabilities', liabilityRoutes_1.liabilityRoutes);
app.use('/api/equity', equityRoutes_1.equityRoutes);
app.use('/api/revenue', revenueRoutes_1.revenueRoutes);
app.use('/api/expenses', expenseRoutes_1.expenseRoutes);
app.use('/api/chart-of-accounts', chartOfAccountsRoutes_1.chartOfAccountsRoutes);
app.use('/api/transactions', transactionRoutes_1.transactionRoutes);
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});
// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Tsunami CandL Accounting API server running on port ${PORT}`);
    console.log(`📊 Health check available at: http://localhost:${PORT}/health`);
});
//# sourceMappingURL=server.js.map