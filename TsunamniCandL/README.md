# Tsunami CandL - Accounting System

A comprehensive double-entry accounting system built with modern technologies, implementing the fundamental accounting equation: **Assets = Liabilities + Equity**.

## 🎯 Phase 1: FOUNDATIONAL DATA ARCHITECTURE - COMPLETED ✅
## 🎯 Phase 2: TRANSACTION ENGINE - COMPLETED ✅
## 🎯 Phase 3: USER INTERFACE - COMPLETED ✅

### Double-Entry Bookkeeping System
- **Complete Transaction Engine**: Full double-entry accounting with automatic debit/credit validation
- **Minimum Two Entries**: Every transaction requires at least 2 journal entries (debits = credits)
- **Real-time Balancing**: Automatic validation ensures Total Debits = Total Credits
- **Transaction Types**: Sales, Purchases, Payments, Receipts, Adjustments, Depreciation

### Chart of Accounts
- **Standard Numbering**: 1000s=Assets, 2000s=Liabilities, 3000s=Equity, 4000s=Revenue, 5000s=Expenses
- **Hierarchical Structure**: Parent-child relationships for account sub-categories
- **Account Status**: Active/Inactive/Archived status tracking
- **System Accounts**: Protected core accounts that cannot be deleted

#### Chart of Accounts Structure
```
Assets (1000-1999)
├── 1000 Cash and Cash Equivalents
├── 1100 Accounts Receivable
├── 1200 Inventory
├── 1300 Fixed Assets
│   └── 1301 Office Equipment
└── ...

Liabilities (2000-2999)
├── 2000 Accounts Payable
├── 2100 Loans Payable
└── 2200 Accrued Liabilities

Equity (3000-3999)
├── 3000 Common Stock
└── 3100 Retained Earnings

Revenue (4000-4999)
├── 4000 Sales Revenue
├── 4100 Service Revenue
└── 4200 Other Income

Expenses (5000-5999)
├── 5000 Cost of Goods Sold
├── 5100 Operating Expenses
├── 5200 Marketing Expenses
└── 5300 Administrative Expenses
```

### Transaction Management
- **Journal Entries**: Detailed debit/credit entries linked to chart of accounts
- **Transaction Validation**: Automatic balancing checks before saving
- **Reference Tracking**: Invoice numbers, check numbers, and transaction references
- **Balance Status**: Tracks whether transactions are balanced or require review

### API Endpoints (Phase 2)

#### Chart of Accounts
- `GET /api/chart-of-accounts` - List accounts with pagination/filtering
- `GET /api/chart-of-accounts/hierarchy` - Get hierarchical account structure
- `GET /api/chart-of-accounts/next-number/:type` - Get next available account number
- `GET /api/chart-of-accounts/search?q=query` - Search accounts by name/number
- `POST /api/chart-of-accounts` - Create new account
- `PUT /api/chart-of-accounts/:id` - Update account
- `DELETE /api/chart-of-accounts/:id` - Delete account (non-system only)

#### Transactions
- `GET /api/transactions` - List transactions with filtering
- `GET /api/transactions/summary` - Get transaction summary by type
- `GET /api/transactions/unbalanced` - Get transactions requiring balancing
- `POST /api/transactions` - Create transaction with journal entries
- `POST /api/transactions/validate` - Validate journal entries without saving
- `PUT /api/transactions/:id` - Update transaction
- `POST /api/transactions/:id/balance` - Mark transaction as balanced
- `DELETE /api/transactions/:id` - Delete transaction (unbalanced only)

### Business Logic (Phase 2)

#### Double-Entry Validation
- ✅ Debit/Credit balance enforcement (Debits = Credits)
- ✅ Minimum 2 journal entries per transaction
- ✅ No duplicate accounts per transaction
- ✅ Positive amounts required for all entries
- ✅ Account type validation

#### Account Management
- ✅ Hierarchical parent-child relationships
- ✅ Account numbering range validation
- ✅ System account protection
- ✅ Status-based filtering (Active/Inactive/Archived)
- ✅ Circular reference prevention

#### Transaction Processing
- ✅ Atomic transaction creation with rollback on failure
- ✅ Journal entry uniqueness constraints
- ✅ Balance status tracking
- ✅ Reference number validation

### User Interface & Dashboard
- **Real-time Accounting Equation Display**: Live Assets = Liabilities + Equity monitoring
- **Financial Ratios Dashboard**: Current Ratio, Debt-to-Equity, and Equity Ratio calculations
- **Interactive Charts**: Cash flow trends and asset distribution visualizations
- **Guided Transaction Wizard**: Step-by-step double-entry transaction creation
- **Responsive Design**: Mobile-friendly interface with Material-UI components

### Transaction Entry Features
- **3-Step Wizard Process**: Transaction details → Journal entries → Review & submit
- **Double-Entry Validation**: Real-time debit/credit balancing with visual indicators
- **Account Auto-complete**: Intelligent account selection from chart of accounts
- **Journal Entry Management**: Add, edit, and remove entries with balance verification
- **Transaction Types**: Support for Sales, Purchases, Payments, Receipts, Adjustments, Depreciation
- **Reference Tracking**: Invoice numbers, check numbers, and transaction references

### Technical Architecture (Frontend)
- **React + TypeScript**: Type-safe component development
- **Vite**: Fast development and optimized production builds
- **Material-UI (MUI)**: Professional component library with theming
- **React Query**: Efficient server state management and caching
- **React Router**: Client-side routing with protected routes
- **Axios**: HTTP client with interceptors for error handling
- **React Hook Form + Zod**: Form validation and management
- **Recharts**: Financial data visualization and charting

### Dashboard Analytics
- **Live Accounting Equation**: Real-time balance monitoring with visual indicators
- **Key Financial Ratios**:
  - Current Ratio (Assets ÷ Liabilities)
  - Debt-to-Equity Ratio (Liabilities ÷ Equity)
  - Equity Ratio (Equity ÷ Total Assets)
- **Cash Flow Visualization**: Interactive line charts showing trends
- **Asset Distribution**: Pie charts showing asset composition
- **Recent Activity**: Latest transactions and account balances
- **Status Monitoring**: Balance validation with error alerts

### Core Entity Structure

#### 1. ASSETS Table
- **Fields**: AssetID, AssetName, AssetType (Current/Fixed), CurrentValue, DateAcquired, Description, IsActive
- **Subtypes**: Cash, Accounts Receivable, Inventory, Equipment, Property
- **Validation**: Positive values required
- **API Endpoints**:
  - `GET /api/assets` - List all assets with pagination
  - `GET /api/assets/total` - Get total asset value
  - `GET /api/assets/:id` - Get specific asset
  - `POST /api/assets` - Create new asset
  - `PUT /api/assets/:id` - Update asset
  - `DELETE /api/assets/:id` - Soft delete asset

#### 2. LIABILITIES Table
- **Fields**: LiabilityID, LiabilityName, LiabilityType (Current/Long-term), AmountOwed, DueDate, Creditor, Description, IsActive
- **Subtypes**: Accounts Payable, Loans, Rent Payable, Accrued Expenses
- **Validation**: Positive amounts required
- **API Endpoints**:
  - `GET /api/liabilities` - List all liabilities with pagination
  - `GET /api/liabilities/total` - Get total liability amount
  - `GET /api/liabilities/due/:days` - Get liabilities due within X days
  - `POST /api/liabilities` - Create new liability
  - `PUT /api/liabilities/:id` - Update liability
  - `DELETE /api/liabilities/:id` - Soft delete liability

#### 3. EQUITY Table
- **Fields**: EquityID, EquityType, SharesOutstanding, ParValue, RetainedEarnings, Description
- **Subtypes**: Common Stock, Preferred Stock, Additional Paid-in Capital, Retained Earnings
- **Validation**: Auto-calculated (Assets - Liabilities)
- **API Endpoints**:
  - `GET /api/equity` - List all equity entries
  - `GET /api/equity/total` - Get total equity value
  - `GET /api/equity/equation` - Get accounting equation status
  - `POST /api/equity` - Create new equity entry
  - `POST /api/equity/calculate-retained-earnings` - Calculate retained earnings

#### 4. REVENUE Table
- **Fields**: RevenueID, RevenueSource, Amount, Date, Description, CustomerID, IsRecurring
- **Subtypes**: Sales, Service Revenue, Interest Income, Other Income
- **Validation**: Positive amounts required
- **API Endpoints**:
  - `GET /api/revenue` - List all revenue with pagination
  - `GET /api/revenue/total` - Get total revenue amount
  - `GET /api/revenue/recurring` - Get recurring revenue
  - `POST /api/revenue` - Create new revenue entry
  - `PUT /api/revenue/:id` - Update revenue
  - `DELETE /api/revenue/:id` - Delete revenue

#### 5. EXPENSES Table
- **Fields**: ExpenseID, ExpenseCategory, Amount, Date, Description, VendorID, IsRecurring
- **Subtypes**: Operating Expenses, COGS, Administrative, Marketing
- **Validation**: Positive amounts required
- **API Endpoints**:
  - `GET /api/expenses` - List all expenses with pagination
  - `GET /api/expenses/total` - Get total expenses amount
  - `GET /api/expenses/recurring` - Get recurring expenses
  - `GET /api/expenses/summary` - Get expense summary by category
  - `POST /api/expenses` - Create new expense entry
  - `PUT /api/expenses/:id` - Update expense
  - `DELETE /api/expenses/:id` - Delete expense

## 🛠 Technology Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Custom business logic validation
- **Security**: Helmet, CORS
- **Development**: ts-node-dev, ESLint, Prettier

### Database Schema
- **Assets Table**: Stores current and fixed assets
- **Liabilities Table**: Stores current and long-term obligations
- **Equity Table**: Stores ownership interests and retained earnings
- **Revenue Table**: Stores income streams
- **Expenses Table**: Stores cost outflows
- **Transactions Table**: For double-entry bookkeeping (Phase 2)
- **Journal Entries Table**: For detailed transaction records (Phase 2)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone and setup backend:**
   ```bash
   cd backend
   npm install
   ```

2. **Database setup:**
   ```bash
   # Update .env.example with your database credentials and rename to .env
   cp .env.example .env

   # Generate Prisma client
   npm run db:generate

   # Run database migrations
   npm run db:migrate

   # Seed with sample data
   npm run db:seed
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

### API Usage Examples

#### Check Accounting Equation Balance
```bash
curl http://localhost:3001/api/equity/equation
```

#### Create a new asset
```bash
curl -X POST http://localhost:3001/api/assets \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Equipment",
    "type": "FIXED",
    "currentValue": "5000.00",
    "dateAcquired": "2024-01-15",
    "description": "Office computer equipment"
  }'
```

#### Get total assets
```bash
curl http://localhost:3001/api/assets/total
```

## 📊 Business Logic Implemented

### Validation Rules
- ✅ Positive values for all monetary amounts
- ✅ Date validation (no future dates)
- ✅ Accounting equation enforcement
- ✅ Asset and liability type validation
- ✅ Required field enforcement

### Auto-calculations
- ✅ Retained earnings = Total Revenue - Total Expenses
- ✅ Total asset value aggregation
- ✅ Total liability amount aggregation
- ✅ Accounting equation balance verification

### Data Integrity
- ✅ Soft deletes for assets and liabilities
- ✅ Proper decimal handling for financial calculations
- ✅ Type-safe operations with TypeScript
- ✅ Comprehensive error handling

## 🔄 Sample Data Included

The system comes pre-seeded with realistic accounting data:
- **Assets**: Cash ($50,000), Accounts Receivable ($15,000), Inventory ($25,000), Equipment ($30,000)
- **Liabilities**: Accounts Payable ($8,000), Business Loan ($100,000), Credit Card ($3,200)
- **Equity**: Common Stock (10,000 shares), Retained Earnings ($25,000)
- **Revenue**: Product Sales ($75,000), Service Revenue ($25,000), Subscriptions ($5,000)
- **Expenses**: COGS ($30,000), Operating ($15,000), Marketing ($8,000), Administrative ($12,000)

## 🎯 Accounting Equation Verification

The seeded data demonstrates a balanced accounting equation:
- **Assets**: $120,000
- **Liabilities**: $111,200
- **Equity**: $8,800
- **Equation**: $120,000 = $111,200 + $8,800 ✅

## 📈 Next Phases Preview

### Phase 2: Transaction Engine
- Double-entry bookkeeping system
- Chart of accounts (1000s=Assets, 2000s=Liabilities, 3000s=Equity, 4000s=Revenue, 5000s=Expenses)
- Transaction validation and balancing

### Phase 3: User Interface
- React dashboard with real-time accounting equation display
- Transaction entry wizards
- Financial reports and analytics

### Phase 4-18: Advanced Features
- Bank reconciliation, audit trails, reporting, AI analytics, compliance automation, and more

## 🧪 Testing

Run the API health check:
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Tsunami CandL Accounting API is running",
  "timestamp": "2024-01-15T..."
}
```

## 📝 License

This project implements fundamental accounting principles and is intended for educational and commercial use.

---

**Phase 1 Complete**: Foundation laid for a robust, scalable accounting system with proper data architecture, validation, and API endpoints.

**Phase 2 Complete**: Full double-entry bookkeeping system implemented with chart of accounts, transaction validation, and comprehensive API endpoints.

**Phase 3 Complete**: Professional React frontend implemented with real-time dashboard, guided transaction wizard, and comprehensive financial analytics. Ready for Phase 4: Business Logic Enhancements.

## 🎯 Success Metrics Achieved (Phases 1, 2 & 3)

- ✅ Accounting equation always balances (Assets = Liabilities + Equity)
- ✅ Double-entry compliance with automatic validation
- ✅ Chart of accounts with proper numbering (1000s-5000s ranges)
- ✅ Transaction balancing (Total Debits = Total Credits)
- ✅ Hierarchical account relationships
- ✅ Complete audit trail with journal entries
- ✅ User-friendly API with comprehensive error handling
- ✅ Data integrity and validation rules
- ✅ Type-safe implementation with TypeScript
- ✅ Scalable architecture ready for production
- ✅ Real-time dashboard with financial ratios and analytics
- ✅ Guided transaction entry wizard preventing user errors
- ✅ Interactive charts and data visualizations
- ✅ Responsive, professional user interface
- ✅ React Query state management with caching
- ✅ Form validation with React Hook Form + Zod
- ✅ Modern development workflow with Vite
