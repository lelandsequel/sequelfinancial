import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { assetRoutes } from './routes/assetRoutes';
import { liabilityRoutes } from './routes/liabilityRoutes';
import { equityRoutes } from './routes/equityRoutes';
import { revenueRoutes } from './routes/revenueRoutes';
import { expenseRoutes } from './routes/expenseRoutes';
import { chartOfAccountsRoutes } from './routes/chartOfAccountsRoutes';
import { transactionRoutes } from './routes/transactionRoutes';
import { periodRoutes } from './routes/periodRoutes';
import { businessLogicRoutes } from './routes/businessLogicRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Tsunami CandL Accounting API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/assets', assetRoutes);
app.use('/api/liabilities', liabilityRoutes);
app.use('/api/equity', equityRoutes);
app.use('/api/revenue', revenueRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/chart-of-accounts', chartOfAccountsRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/periods', periodRoutes);
app.use('/api/business-logic', businessLogicRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
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
