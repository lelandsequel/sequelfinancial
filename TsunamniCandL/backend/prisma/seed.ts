import { PrismaClient, AssetType, LiabilityType, EquityType, AccountType, AccountStatus, TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create Chart of Accounts
  console.log('📊 Creating chart of accounts...');

  // Create parent accounts first
  const parentAccounts = await Promise.all([
    // Asset accounts (1000-1999)
    prisma.chartOfAccounts.create({
      data: {
        accountNumber: '1000',
        name: 'Cash and Cash Equivalents',
        type: AccountType.ASSET,
        status: AccountStatus.ACTIVE,
        description: 'Primary checking accounts, petty cash, money market accounts',
        isSystem: true
      }
    }),
    prisma.chartOfAccounts.create({
      data: {
        accountNumber: '1100',
        name: 'Accounts Receivable',
        type: AccountType.ASSET,
        status: AccountStatus.ACTIVE,
        description: 'Money owed by customers for goods/services provided',
        isSystem: true
      }
    }),
    prisma.chartOfAccounts.create({
      data: {
        accountNumber: '1200',
        name: 'Inventory',
        type: AccountType.ASSET,
        status: AccountStatus.ACTIVE,
        description: 'Raw materials, work in progress, and finished goods',
        isSystem: true
      }
    }),
    prisma.chartOfAccounts.create({
      data: {
        accountNumber: '1300',
        name: 'Fixed Assets',
        type: AccountType.ASSET,
        status: AccountStatus.ACTIVE,
        description: 'Property, plant, and equipment',
        isSystem: true
      }
    }),

    // Liability accounts (2000-2999)
    prisma.chartOfAccounts.create({
      data: {
        accountNumber: '2000',
        name: 'Accounts Payable',
        type: AccountType.LIABILITY,
        status: AccountStatus.ACTIVE,
        description: 'Money owed to vendors/suppliers',
        isSystem: true
      }
    }),
    prisma.chartOfAccounts.create({
      data: {
        accountNumber: '2100',
        name: 'Loans Payable',
        type: AccountType.LIABILITY,
        status: AccountStatus.ACTIVE,
        description: 'Bank loans and other borrowings',
        isSystem: true
      }
    }),
    prisma.chartOfAccounts.create({
      data: {
        accountNumber: '2200',
        name: 'Accrued Liabilities',
        type: AccountType.LIABILITY,
        status: AccountStatus.ACTIVE,
        description: 'Wages payable, taxes payable, interest payable',
        isSystem: true
      }
    }),

    // Equity accounts (3000-3999)
    prisma.chartOfAccounts.create({
      data: {
        accountNumber: '3000',
        name: 'Common Stock',
        type: AccountType.EQUITY,
        status: AccountStatus.ACTIVE,
        description: 'Common stock issued to shareholders',
        isSystem: true
      }
    }),
    prisma.chartOfAccounts.create({
      data: {
        accountNumber: '3100',
        name: 'Retained Earnings',
        type: AccountType.EQUITY,
        status: AccountStatus.ACTIVE,
        description: 'Accumulated profits not distributed to shareholders',
        isSystem: true
      }
    }),

    // Revenue accounts (4000-4999)
    prisma.chartOfAccounts.create({
      data: {
        accountNumber: '4000',
        name: 'Sales Revenue',
        type: AccountType.REVENUE,
        status: AccountStatus.ACTIVE,
        description: 'Revenue from sale of goods and services',
        isSystem: true
      }
    }),
    prisma.chartOfAccounts.create({
      data: {
        accountNumber: '4100',
        name: 'Service Revenue',
        type: AccountType.REVENUE,
        status: AccountStatus.ACTIVE,
        description: 'Revenue from professional services',
        isSystem: true
      }
    }),
    prisma.chartOfAccounts.create({
      data: {
        accountNumber: '4200',
        name: 'Other Income',
        type: AccountType.REVENUE,
        status: AccountStatus.ACTIVE,
        description: 'Interest income, gains on asset sales, etc.',
        isSystem: true
      }
    }),

    // Expense accounts (5000-5999)
    prisma.chartOfAccounts.create({
      data: {
        accountNumber: '5000',
        name: 'Cost of Goods Sold',
        type: AccountType.EXPENSE,
        status: AccountStatus.ACTIVE,
        description: 'Direct costs associated with producing goods',
        isSystem: true
      }
    }),
    prisma.chartOfAccounts.create({
      data: {
        accountNumber: '5100',
        name: 'Operating Expenses',
        type: AccountType.EXPENSE,
        status: AccountStatus.ACTIVE,
        description: 'Day-to-day business operating costs',
        isSystem: true
      }
    }),
    prisma.chartOfAccounts.create({
      data: {
        accountNumber: '5200',
        name: 'Marketing Expenses',
        type: AccountType.EXPENSE,
        status: AccountStatus.ACTIVE,
        description: 'Advertising, promotions, and marketing costs',
        isSystem: true
      }
    }),
    prisma.chartOfAccounts.create({
      data: {
        accountNumber: '5300',
        name: 'Administrative Expenses',
        type: AccountType.EXPENSE,
        status: AccountStatus.ACTIVE,
        description: 'General and administrative costs',
        isSystem: true
      }
    })
  ]);

  // Create child accounts
  const childAccounts = await Promise.all([
    prisma.chartOfAccounts.create({
      data: {
        accountNumber: '1301',
        name: 'Office Equipment',
        type: AccountType.ASSET,
        status: AccountStatus.ACTIVE,
        description: 'Computers, furniture, and office equipment',
        parentId: parentAccounts.find(acc => acc.accountNumber === '1300')!.id,
        isSystem: true
      }
    })
  ]);

  const chartOfAccounts = [...parentAccounts, ...childAccounts];

  // Create sample assets
  console.log('📦 Creating sample assets...');
  const assets = await Promise.all([
    prisma.asset.create({
      data: {
        name: 'Cash',
        type: AssetType.CURRENT,
        currentValue: new Decimal('50000.00'),
        dateAcquired: new Date('2024-01-01'),
        description: 'Primary business checking account'
      }
    }),
    prisma.asset.create({
      data: {
        name: 'Accounts Receivable',
        type: AssetType.CURRENT,
        currentValue: new Decimal('15000.00'),
        dateAcquired: new Date('2024-01-01'),
        description: 'Outstanding customer invoices'
      }
    }),
    prisma.asset.create({
      data: {
        name: 'Inventory',
        type: AssetType.CURRENT,
        currentValue: new Decimal('25000.00'),
        dateAcquired: new Date('2024-01-01'),
        description: 'Raw materials and finished goods'
      }
    }),
    prisma.asset.create({
      data: {
        name: 'Office Equipment',
        type: AssetType.FIXED,
        currentValue: new Decimal('30000.00'),
        dateAcquired: new Date('2023-06-15'),
        description: 'Computers, furniture, and office equipment'
      }
    })
  ]);

  // Create sample liabilities
  console.log('💰 Creating sample liabilities...');
  const liabilities = await Promise.all([
    prisma.liability.create({
      data: {
        name: 'Accounts Payable',
        type: LiabilityType.CURRENT,
        amountOwed: new Decimal('8000.00'),
        dueDate: new Date('2024-02-15'),
        creditor: 'Office Supply Co.',
        description: 'Outstanding vendor invoices'
      }
    }),
    prisma.liability.create({
      data: {
        name: 'Business Loan',
        type: LiabilityType.LONG_TERM,
        amountOwed: new Decimal('100000.00'),
        dueDate: new Date('2026-12-31'),
        creditor: 'First National Bank',
        description: '5-year business expansion loan'
      }
    }),
    prisma.liability.create({
      data: {
        name: 'Credit Card Debt',
        type: LiabilityType.CURRENT,
        amountOwed: new Decimal('3200.00'),
        dueDate: new Date('2024-02-28'),
        creditor: 'Business Credit Card',
        description: 'Monthly credit card balance'
      }
    })
  ]);

  // Create sample equity
  console.log('📈 Creating sample equity...');
  const equity = await Promise.all([
    prisma.equity.create({
      data: {
        type: EquityType.COMMON_STOCK,
        sharesOutstanding: 10000,
        parValue: new Decimal('1.00'),
        description: 'Authorized and issued common stock'
      }
    }),
    prisma.equity.create({
      data: {
        type: EquityType.RETAINED_EARNINGS,
        retainedEarnings: new Decimal('25000.00'),
        description: 'Accumulated profits from operations'
      }
    })
  ]);

  // Create sample revenue
  console.log('💵 Creating sample revenue...');
  const revenues = await Promise.all([
    prisma.revenue.create({
      data: {
        source: 'Product Sales',
        amount: new Decimal('75000.00'),
        date: new Date('2024-01-15'),
        description: 'Q1 product sales revenue',
        customerId: 'CUST-001',
        isRecurring: false
      }
    }),
    prisma.revenue.create({
      data: {
        source: 'Service Revenue',
        amount: new Decimal('25000.00'),
        date: new Date('2024-01-20'),
        description: 'Consulting services provided',
        customerId: 'CUST-002',
        isRecurring: false
      }
    }),
    prisma.revenue.create({
      data: {
        source: 'Subscription Revenue',
        amount: new Decimal('5000.00'),
        date: new Date('2024-01-31'),
        description: 'Monthly software subscriptions',
        customerId: 'CUST-003',
        isRecurring: true
      }
    })
  ]);

  // Create sample expenses
  console.log('💸 Creating sample expenses...');
  const expenses = await Promise.all([
    prisma.expense.create({
      data: {
        category: 'Cost of Goods Sold',
        amount: new Decimal('30000.00'),
        date: new Date('2024-01-15'),
        description: 'Direct costs for products sold',
        vendorId: 'VEND-001',
        isRecurring: false
      }
    }),
    prisma.expense.create({
      data: {
        category: 'Operating Expenses',
        amount: new Decimal('15000.00'),
        date: new Date('2024-01-20'),
        description: 'Monthly operating costs (rent, utilities, etc.)',
        vendorId: 'VEND-002',
        isRecurring: true
      }
    }),
    prisma.expense.create({
      data: {
        category: 'Marketing',
        amount: new Decimal('8000.00'),
        date: new Date('2024-01-10'),
        description: 'Digital marketing campaign',
        vendorId: 'VEND-003',
        isRecurring: false
      }
    }),
    prisma.expense.create({
      data: {
        category: 'Administrative',
        amount: new Decimal('12000.00'),
        date: new Date('2024-01-25'),
        description: 'Office supplies and administrative costs',
        vendorId: 'VEND-004',
        isRecurring: true
      }
    })
  ]);

  console.log('✅ Database seeding completed successfully!');
  console.log(`📊 Summary:`);
  console.log(`   - Created ${assets.length} assets`);
  console.log(`   - Created ${liabilities.length} liabilities`);
  console.log(`   - Created ${equity.length} equity entries`);
  console.log(`   - Created ${revenues.length} revenue entries`);
  console.log(`   - Created ${expenses.length} expense entries`);

  // Calculate and display accounting equation
  const totalAssets = assets.reduce((sum, asset) => sum.add(asset.currentValue), new Decimal(0));
  const totalLiabilities = liabilities.reduce((sum, liability) => sum.add(liability.amountOwed), new Decimal(0));
  const totalEquity = equity.reduce((sum, eq) => sum.add(eq.retainedEarnings), new Decimal(0));

  console.log(`\n🏦 Accounting Equation Check:`);
  console.log(`   Assets: $${totalAssets.toString()}`);
  console.log(`   Liabilities: $${totalLiabilities.toString()}`);
  console.log(`   Equity: $${totalEquity.toString()}`);
  console.log(`   Equation Balanced: ${totalAssets.equals(totalLiabilities.add(totalEquity)) ? '✅' : '❌'}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
