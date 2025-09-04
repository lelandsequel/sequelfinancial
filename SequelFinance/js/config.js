// Configuration file for Finance U
// This file contains environment-specific settings

// Gemini API Configuration
// To get a Gemini API key, visit: https://makersuite.google.com/app/apikey
// Your API key has been configured for real stock prices!
window.GEMINI_API_KEY = 'AIzaSyDczuxnJ0RWFdK6tkpM3R9QRdG1mJhIpvM';

// Demo mode disabled - using real API
window.DEMO_MODE = false;

// For development/testing, you can also set the API key in localStorage:
// localStorage.setItem('GEMINI_API_KEY', 'your-api-key-here');

// Application Settings
window.APP_CONFIG = {
    version: '1.0.0',
    environment: 'production', // 'development' or 'production'
    debug: false
};

// User Tier Management
window.USER_CONFIG = {
    currentTier: 'free', // 'free', 'premium', 'enterprise'
    features: {
        free: {
            maxStocks: 10,
            stockUpdatesPerDay: 50,
            calculatorAccess: true,
            basicQuizzes: true,
            demoTrading: true,
            realTimePrices: false,
            internationalStocks: false,
            portfolioAnalytics: false,
            exportData: false,
            premiumSupport: false,
            questAccess: 'basic',
            maxQuestLevel: 5,
            achievements: false,
            leaderboards: false
        },
        premium: {
            maxStocks: 100,
            stockUpdatesPerDay: 1000,
            calculatorAccess: true,
            basicQuizzes: true,
            demoTrading: true,
            realTimePrices: true,
            internationalStocks: true,
            portfolioAnalytics: true,
            exportData: true,
            premiumSupport: true,
            questAccess: 'full',
            maxQuestLevel: 50,
            achievements: true,
            leaderboards: true,
            customQuests: true
        },
        enterprise: {
            maxStocks: 500,
            stockUpdatesPerDay: 10000,
            calculatorAccess: true,
            basicQuizzes: true,
            demoTrading: true,
            realTimePrices: true,
            internationalStocks: true,
            portfolioAnalytics: true,
            exportData: true,
            premiumSupport: true,
            customFeatures: true,
            questAccess: 'enterprise',
            maxQuestLevel: 100,
            achievements: true,
            leaderboards: true,
            customQuests: true,
            teamQuests: true,
            analytics: true
        }
    },
    pricing: {
        premium: {
            monthly: 9.99,
            yearly: 99.99,
            currency: 'USD'
        },
        enterprise: {
            monthly: 29.99,
            yearly: 299.99,
            currency: 'USD'
        }
    }
};

// Comprehensive Quest System
window.QUEST_CONFIG = {
    userProgress: {
        level: 1,
        xp: 0,
        xpToNext: 100,
        totalXP: 0,
        completedQuests: [],
        activeQuests: [],
        achievements: [],
        streaks: {
            daily: 0,
            weekly: 0,
            monthly: 0
        },
        stats: {
            questsCompleted: 0,
            perfectScores: 0,
            timeSpent: 0,
            badgesEarned: 0
        }
    },

    categories: {
        financialLiteracy: {
            name: 'Financial Literacy',
            icon: '📚',
            description: 'Master the fundamentals of personal finance',
            color: '#3B82F6'
        },
        marketAnalysis: {
            name: 'Market Analysis',
            icon: '📊',
            description: 'Learn to analyze markets and make informed decisions',
            color: '#10B981'
        },
        portfolioManagement: {
            name: 'Portfolio Management',
            icon: '💼',
            description: 'Build and manage investment portfolios',
            color: '#F59E0B'
        },
        riskManagement: {
            name: 'Risk Management',
            icon: '⚠️',
            description: 'Understand and manage investment risks',
            color: '#EF4444'
        },
        globalMarkets: {
            name: 'Global Markets',
            icon: '🌍',
            description: 'Explore international investment opportunities',
            color: '#8B5CF6'
        },
        advancedStrategies: {
            name: 'Advanced Strategies',
            icon: '🚀',
            description: 'Master sophisticated trading and investment strategies',
            color: '#EC4899'
        }
    },

    questTiers: {
        beginner: { level: 1, name: 'Beginner', color: '#10B981' },
        intermediate: { level: 10, name: 'Intermediate', color: '#3B82F6' },
        advanced: { level: 25, name: 'Advanced', color: '#F59E0B' },
        expert: { level: 40, name: 'Expert', color: '#EF4444' },
        master: { level: 60, name: 'Master', color: '#8B5CF6' }
    },

    quests: [
        // BEGINNER QUESTS (Levels 1-5)
        {
            id: 'budget_basics',
            title: 'Budget Basics Master',
            description: 'Create your first budget and track expenses for a week',
            category: 'financialLiteracy',
            tier: 'beginner',
            type: 'tutorial',
            xpReward: 50,
            requirements: {
                minLevel: 1,
                prerequisites: []
            },
            steps: [
                'Use the budget calculator to create a monthly budget',
                'Track your actual expenses for 7 days',
                'Identify one area for improvement',
                'Create a savings goal'
            ],
            rewards: ['Budget Master Badge', '50 XP', 'Savings Calculator Unlock'],
            timeLimit: null,
            isPremium: false
        },
        {
            id: 'first_investment',
            title: 'First Investment Journey',
            description: 'Make your first simulated investment in the stock market',
            category: 'portfolioManagement',
            tier: 'beginner',
            type: 'simulation',
            xpReward: 75,
            requirements: {
                minLevel: 1,
                prerequisites: []
            },
            steps: [
                'Open the Stock Market Simulator',
                'Research and select a stock',
                'Make your first purchase',
                'Monitor your investment for 24 hours'
            ],
            rewards: ['First Trader Badge', '75 XP', 'Portfolio Tracker Unlock'],
            timeLimit: 86400000, // 24 hours
            isPremium: false
        },
        {
            id: 'compound_interest_explorer',
            title: 'Compound Interest Explorer',
            description: 'Discover the power of compound interest through calculations',
            category: 'financialLiteracy',
            tier: 'beginner',
            type: 'calculation',
            xpReward: 60,
            requirements: {
                minLevel: 2,
                prerequisites: ['budget_basics']
            },
            steps: [
                'Use the compound interest calculator',
                'Compare different interest rates',
                'Calculate long-term growth projections',
                'Understand the rule of 72'
            ],
            rewards: ['Math Wizard Badge', '60 XP', 'Investment Calculator Unlock'],
            timeLimit: null,
            isPremium: false
        },
        {
            id: 'emergency_fund_builder',
            title: 'Emergency Fund Builder',
            description: 'Build a 3-month emergency fund plan',
            category: 'financialLiteracy',
            tier: 'beginner',
            type: 'planning',
            xpReward: 80,
            requirements: {
                minLevel: 3,
                prerequisites: ['budget_basics', 'compound_interest_explorer']
            },
            steps: [
                'Calculate your monthly expenses',
                'Determine emergency fund target (3-6 months)',
                'Create a savings plan',
                'Set up automatic transfers'
            ],
            rewards: ['Security Builder Badge', '80 XP', 'Emergency Fund Template'],
            timeLimit: 604800000, // 1 week
            isPremium: false
        },
        {
            id: 'quiz_champion',
            title: 'Quiz Champion',
            description: 'Score 100% on 5 different financial quizzes',
            category: 'financialLiteracy',
            tier: 'beginner',
            type: 'challenge',
            xpReward: 100,
            requirements: {
                minLevel: 1,
                prerequisites: []
            },
            steps: [
                'Complete 5 different financial quizzes',
                'Achieve 100% score on each',
                'Review incorrect answers',
                'Teach a concept to someone else'
            ],
            rewards: ['Quiz Master Badge', '100 XP', 'Advanced Quiz Unlock'],
            timeLimit: 2592000000, // 30 days
            isPremium: false
        },

        // INTERMEDIATE QUESTS (Levels 6-15)
        {
            id: 'portfolio_diversifier',
            title: 'Portfolio Diversifier',
            description: 'Build a diversified portfolio across multiple sectors',
            category: 'portfolioManagement',
            tier: 'intermediate',
            type: 'simulation',
            xpReward: 150,
            requirements: {
                minLevel: 6,
                prerequisites: ['first_investment']
            },
            steps: [
                'Create a portfolio with at least 5 stocks',
                'Ensure representation across 3+ sectors',
                'Balance risk and return',
                'Rebalance based on performance'
            ],
            rewards: ['Diversification Expert Badge', '150 XP', 'Advanced Analytics'],
            timeLimit: 1209600000, // 2 weeks
            isPremium: true
        },
        {
            id: 'market_analyst',
            title: 'Market Analyst',
            description: 'Analyze market trends and predict movements',
            category: 'marketAnalysis',
            tier: 'intermediate',
            type: 'analysis',
            xpReward: 200,
            requirements: {
                minLevel: 8,
                prerequisites: ['first_investment']
            },
            steps: [
                'Track a stock for 5 trading days',
                'Identify key support/resistance levels',
                'Analyze volume patterns',
                'Make and document a price prediction'
            ],
            rewards: ['Market Analyst Badge', '200 XP', 'Technical Analysis Tools'],
            timeLimit: 432000000, // 5 days
            isPremium: true
        },
        {
            id: 'global_explorer',
            title: 'Global Market Explorer',
            description: 'Explore and invest in international markets',
            category: 'globalMarkets',
            tier: 'intermediate',
            type: 'simulation',
            xpReward: 180,
            requirements: {
                minLevel: 10,
                prerequisites: ['first_investment']
            },
            steps: [
                'Research 3 international markets',
                'Invest in stocks from 2 different countries',
                'Compare performance with US markets',
                'Analyze currency impacts'
            ],
            rewards: ['Global Trader Badge', '180 XP', 'International Market Access'],
            timeLimit: 604800000, // 1 week
            isPremium: true
        },
        {
            id: 'risk_manager',
            title: 'Risk Manager',
            description: 'Implement comprehensive risk management strategies',
            category: 'riskManagement',
            tier: 'intermediate',
            type: 'planning',
            xpReward: 160,
            requirements: {
                minLevel: 12,
                prerequisites: ['portfolio_diversifier']
            },
            steps: [
                'Calculate portfolio volatility',
                'Implement stop-loss orders',
                'Diversify across asset classes',
                'Create a risk management plan'
            ],
            rewards: ['Risk Manager Badge', '160 XP', 'Risk Analysis Tools'],
            timeLimit: 864000000, // 10 days
            isPremium: true
        },

        // ADVANCED QUESTS (Levels 16-30)
        {
            id: 'hedge_fund_manager',
            title: 'Hedge Fund Manager',
            description: 'Manage a $100K portfolio with advanced strategies',
            category: 'advancedStrategies',
            tier: 'advanced',
            type: 'simulation',
            xpReward: 500,
            requirements: {
                minLevel: 16,
                prerequisites: ['portfolio_diversifier', 'risk_manager']
            },
            steps: [
                'Start with $100K virtual capital',
                'Implement hedging strategies',
                'Use options and derivatives',
                'Achieve 15% return in 30 days'
            ],
            rewards: ['Hedge Fund Manager Badge', '500 XP', 'Advanced Trading Tools'],
            timeLimit: 2592000000, // 30 days
            isPremium: true
        },
        {
            id: 'market_timing_expert',
            title: 'Market Timing Expert',
            description: 'Master the art of market timing and entry/exit strategies',
            category: 'marketAnalysis',
            tier: 'advanced',
            type: 'challenge',
            xpReward: 400,
            requirements: {
                minLevel: 20,
                prerequisites: ['market_analyst']
            },
            steps: [
                'Identify market cycles',
                'Time entries and exits perfectly',
                'Beat the market by 10% in a month',
                'Document your timing strategy'
            ],
            rewards: ['Timing Expert Badge', '400 XP', 'Market Timing Indicators'],
            timeLimit: 2592000000, // 30 days
            isPremium: true
        },
        {
            id: 'wealth_builder',
            title: 'Wealth Builder',
            description: 'Build wealth through systematic investing and compounding',
            category: 'portfolioManagement',
            tier: 'advanced',
            type: 'longterm',
            xpReward: 600,
            requirements: {
                minLevel: 25,
                prerequisites: ['compound_interest_explorer', 'emergency_fund_builder']
            },
            steps: [
                'Set up systematic investment plan',
                'Invest consistently for 3 months',
                'Track compound growth',
                'Achieve portfolio growth target'
            ],
            rewards: ['Wealth Builder Badge', '600 XP', 'Automated Investment Tools'],
            timeLimit: 7776000000, // 90 days
            isPremium: true
        },

        // EXPERT QUESTS (Levels 31-50)
        {
            id: 'quant_trader',
            title: 'Quant Trader',
            description: 'Develop and test quantitative trading strategies',
            category: 'advancedStrategies',
            tier: 'expert',
            type: 'development',
            xpReward: 800,
            requirements: {
                minLevel: 31,
                prerequisites: ['hedge_fund_manager', 'market_timing_expert']
            },
            steps: [
                'Develop a quantitative strategy',
                'Backtest over historical data',
                'Paper trade the strategy',
                'Achieve consistent returns'
            ],
            rewards: ['Quant Trader Badge', '800 XP', 'Algorithmic Trading Tools'],
            timeLimit: 5184000000, // 60 days
            isPremium: true
        },
        {
            id: 'portfolio_optimizer',
            title: 'Portfolio Optimizer',
            description: 'Optimize portfolios using modern portfolio theory',
            category: 'portfolioManagement',
            tier: 'expert',
            type: 'optimization',
            xpReward: 700,
            requirements: {
                minLevel: 35,
                prerequisites: ['portfolio_diversifier', 'risk_manager']
            },
            steps: [
                'Calculate efficient frontier',
                'Optimize risk-adjusted returns',
                'Rebalance for optimal allocation',
                'Maintain Sharpe ratio above 1.5'
            ],
            rewards: ['Optimization Expert Badge', '700 XP', 'Portfolio Optimization Suite'],
            timeLimit: 2592000000, // 30 days
            isPremium: true
        },
        {
            id: 'market_predictor',
            title: 'Market Predictor',
            description: 'Predict market movements with 70%+ accuracy',
            category: 'marketAnalysis',
            tier: 'expert',
            type: 'prediction',
            xpReward: 1000,
            requirements: {
                minLevel: 40,
                prerequisites: ['market_analyst', 'market_timing_expert']
            },
            steps: [
                'Make 20 market predictions',
                'Achieve 70%+ accuracy',
                'Document methodology',
                'Share insights with community'
            ],
            rewards: ['Market Prophet Badge', '1000 XP', 'Predictive Analytics Platform'],
            timeLimit: 5184000000, // 60 days
            isPremium: true
        },

        // MASTER QUESTS (Levels 51-100)
        {
            id: 'legendary_investor',
            title: 'Legendary Investor',
            description: 'Achieve legendary status with exceptional returns',
            category: 'advancedStrategies',
            tier: 'master',
            type: 'legendary',
            xpReward: 2000,
            requirements: {
                minLevel: 51,
                prerequisites: ['quant_trader', 'wealth_builder']
            },
            steps: [
                'Start with $10K virtual capital',
                'Grow to $1M in 6 months',
                'Maintain Sharpe ratio > 2.0',
                'Document your journey'
            ],
            rewards: ['Legendary Investor Badge', '2000 XP', 'Hall of Fame Entry'],
            timeLimit: 15552000000, // 180 days
            isPremium: true
        },
        {
            id: 'market_mage',
            title: 'Market Mage',
            description: 'Master all aspects of market magic and wisdom',
            category: 'marketAnalysis',
            tier: 'master',
            type: 'mastery',
            xpReward: 1500,
            requirements: {
                minLevel: 60,
                prerequisites: ['market_predictor', 'portfolio_optimizer']
            },
            steps: [
                'Complete all advanced quests',
                'Mentor 5 fellow traders',
                'Develop a proprietary strategy',
                'Achieve consistent alpha generation'
            ],
            rewards: ['Market Mage Badge', '1500 XP', 'Ultimate Trading Platform'],
            timeLimit: null,
            isPremium: true
        },

        // DAILY QUESTS
        {
            id: 'daily_budget_check',
            title: 'Daily Budget Check',
            description: 'Review and update your budget today',
            category: 'financialLiteracy',
            tier: 'beginner',
            type: 'daily',
            xpReward: 10,
            requirements: {
                minLevel: 1,
                prerequisites: []
            },
            steps: ['Use the budget calculator', 'Review spending', 'Update goals'],
            rewards: ['Consistent Badge', '10 XP'],
            timeLimit: 86400000, // 24 hours
            isPremium: false
        },
        {
            id: 'daily_market_watch',
            title: 'Daily Market Watch',
            description: 'Monitor market trends and key indicators',
            category: 'marketAnalysis',
            tier: 'intermediate',
            type: 'daily',
            xpReward: 15,
            requirements: {
                minLevel: 5,
                prerequisites: []
            },
            steps: ['Check major indices', 'Read market news', 'Update watchlist'],
            rewards: ['Market Watcher Badge', '15 XP'],
            timeLimit: 86400000,
            isPremium: true
        }
    ],

    achievements: [
        {
            id: 'first_quest',
            title: 'Quest Beginner',
            description: 'Complete your first quest',
            icon: '🎯',
            rarity: 'common',
            requirement: { questsCompleted: 1 }
        },
        {
            id: 'quest_master',
            title: 'Quest Master',
            description: 'Complete 50 quests',
            icon: '🏆',
            rarity: 'rare',
            requirement: { questsCompleted: 50 }
        },
        {
            id: 'perfect_score',
            title: 'Perfectionist',
            description: 'Score 100% on 10 quizzes',
            icon: '💯',
            rarity: 'uncommon',
            requirement: { perfectScores: 10 }
        },
        {
            id: 'wealth_creator',
            title: 'Wealth Creator',
            description: 'Grow a $10K portfolio to $50K',
            icon: '💰',
            rarity: 'epic',
            requirement: { portfolioGrowth: 500 }
        },
        {
            id: 'global_trader',
            title: 'Global Trader',
            description: 'Trade in 10 different international markets',
            icon: '🌍',
            rarity: 'rare',
            requirement: { internationalTrades: 10 }
        },
        {
            id: 'streak_master',
            title: 'Streak Master',
            description: 'Complete daily quests for 30 consecutive days',
            icon: '🔥',
            rarity: 'epic',
            requirement: { dailyStreak: 30 }
        }
    ],

    xpSystem: {
        baseXP: 10,
        questMultiplier: 1.5,
        streakBonus: 0.2,
        perfectBonus: 1.0,
        levelXPRequirement: function(level) {
            return Math.floor(100 * Math.pow(1.2, level - 1));
        }
    }
};

// Stock Market Simulator Settings
window.STOCK_CONFIG = {
    defaultCash: 10000,
    // Top 200+ stocks by market cap (NYSE/NASDAQ)
    availableStocks: {
        // Tech Giants
        'AAPL': { name: 'Apple Inc.', sector: 'Technology', price: 0 },
        'MSFT': { name: 'Microsoft Corporation', sector: 'Technology', price: 0 },
        'GOOGL': { name: 'Alphabet Inc.', sector: 'Technology', price: 0 },
        'AMZN': { name: 'Amazon.com Inc.', sector: 'Consumer Discretionary', price: 0 },
        'TSLA': { name: 'Tesla Inc.', sector: 'Consumer Discretionary', price: 0 },
        'NVDA': { name: 'NVIDIA Corporation', sector: 'Technology', price: 0 },
        'META': { name: 'Meta Platforms Inc.', sector: 'Technology', price: 0 },

        // Financials
        'JPM': { name: 'JPMorgan Chase & Co.', sector: 'Financials', price: 0 },
        'BAC': { name: 'Bank of America Corp.', sector: 'Financials', price: 0 },
        'WFC': { name: 'Wells Fargo & Company', sector: 'Financials', price: 0 },
        'GS': { name: 'Goldman Sachs Group Inc.', sector: 'Financials', price: 0 },
        'MS': { name: 'Morgan Stanley', sector: 'Financials', price: 0 },
        'V': { name: 'Visa Inc.', sector: 'Financials', price: 0 },
        'MA': { name: 'Mastercard Incorporated', sector: 'Financials', price: 0 },
        'AXP': { name: 'American Express Company', sector: 'Financials', price: 0 },

        // Healthcare
        'JNJ': { name: 'Johnson & Johnson', sector: 'Healthcare', price: 0 },
        'PFE': { name: 'Pfizer Inc.', sector: 'Healthcare', price: 0 },
        'UNH': { name: 'United Health Group Inc.', sector: 'Healthcare', price: 0 },
        'ABBV': { name: 'AbbVie Inc.', sector: 'Healthcare', price: 0 },
        'TMO': { name: 'Thermo Fisher Scientific Inc.', sector: 'Healthcare', price: 0 },
        'ABT': { name: 'Abbott Laboratories', sector: 'Healthcare', price: 0 },
        'MRNA': { name: 'Moderna Inc.', sector: 'Healthcare', price: 0 },
        'GILD': { name: 'Gilead Sciences Inc.', sector: 'Healthcare', price: 0 },

        // Consumer Goods
        'PG': { name: 'Procter & Gamble Co.', sector: 'Consumer Staples', price: 0 },
        'KO': { name: 'Coca-Cola Company', sector: 'Consumer Staples', price: 0 },
        'PEP': { name: 'PepsiCo Inc.', sector: 'Consumer Staples', price: 0 },
        'COST': { name: 'Costco Wholesale Corporation', sector: 'Consumer Staples', price: 0 },
        'WMT': { name: 'Walmart Inc.', sector: 'Consumer Discretionary', price: 0 },
        'HD': { name: 'Home Depot Inc.', sector: 'Consumer Discretionary', price: 0 },
        'MCD': { name: "McDonald's Corporation", sector: 'Consumer Discretionary', price: 0 },
        'NKE': { name: 'NIKE Inc.', sector: 'Consumer Discretionary', price: 0 },
        'SBUX': { name: 'Starbucks Corporation', sector: 'Consumer Discretionary', price: 0 },
        'DIS': { name: 'Walt Disney Company', sector: 'Communication Services', price: 0 },

        // Energy
        'XOM': { name: 'Exxon Mobil Corporation', sector: 'Energy', price: 0 },
        'CVX': { name: 'Chevron Corporation', sector: 'Energy', price: 0 },
        'COP': { name: 'ConocoPhillips', sector: 'Energy', price: 0 },

        // Industrials
        'BA': { name: 'Boeing Company', sector: 'Industrials', price: 0 },
        'CAT': { name: 'Caterpillar Inc.', sector: 'Industrials', price: 0 },
        'HON': { name: 'Honeywell International Inc.', sector: 'Industrials', price: 0 },
        'GE': { name: 'General Electric Company', sector: 'Industrials', price: 0 },

        // Materials
        'LIN': { name: 'Linde plc', sector: 'Materials', price: 0 },
        'APD': { name: 'Air Products and Chemicals Inc.', sector: 'Materials', price: 0 },

        // Communication Services
        'NFLX': { name: 'Netflix Inc.', sector: 'Communication Services', price: 0 },
        'CMCSA': { name: 'Comcast Corporation', sector: 'Communication Services', price: 0 },
        'VZ': { name: 'Verizon Communications Inc.', sector: 'Communication Services', price: 0 },

        // Utilities
        'NEE': { name: 'NextEra Energy Inc.', sector: 'Utilities', price: 0 },
        'DUK': { name: 'Duke Energy Corporation', sector: 'Utilities', price: 0 },

        // Real Estate
        'AMT': { name: 'American Tower Corporation', sector: 'Real Estate', price: 0 },
        'PLD': { name: 'Prologis Inc.', sector: 'Real Estate', price: 0 },

        // More Tech
        'CRM': { name: 'Salesforce Inc.', sector: 'Technology', price: 0 },
        'ADBE': { name: 'Adobe Inc.', sector: 'Technology', price: 0 },
        'INTC': { name: 'Intel Corporation', sector: 'Technology', price: 0 },
        'AMD': { name: 'Advanced Micro Devices Inc.', sector: 'Technology', price: 0 },
        'IBM': { name: 'International Business Machines', sector: 'Technology', price: 0 },
        'ORCL': { name: 'Oracle Corporation', sector: 'Technology', price: 0 },
        'CSCO': { name: 'Cisco Systems Inc.', sector: 'Technology', price: 0 },
        'QCOM': { name: 'QUALCOMM Incorporated', sector: 'Technology', price: 0 },

        // More Financials
        'BLK': { name: 'BlackRock Inc.', sector: 'Financials', price: 0 },
        'SPGI': { name: 'S&P Global Inc.', sector: 'Financials', price: 0 },
        'COF': { name: 'Capital One Financial Corp.', sector: 'Financials', price: 0 },

        // More Healthcare
        'BMY': { name: 'Bristol-Myers Squibb Company', sector: 'Healthcare', price: 0 },
        'CI': { name: 'Cigna Corporation', sector: 'Healthcare', price: 0 },
        'HUM': { name: 'Humana Inc.', sector: 'Healthcare', price: 0 },

        // More Consumer
        'LMT': { name: 'Lockheed Martin Corporation', sector: 'Industrials', price: 0 },
        'RTX': { name: 'RTX Corporation', sector: 'Industrials', price: 0 },
        'MMM': { name: '3M Company', sector: 'Industrials', price: 0 },

        // Gaming/Entertainment
        'GME': { name: 'GameStop Corp.', sector: 'Consumer Discretionary', price: 0 },
        'EA': { name: 'Electronic Arts Inc.', sector: 'Communication Services', price: 0 },

        // Crypto/Blockchain related
        'SQ': { name: 'Block Inc.', sector: 'Financials', price: 0 },
        'PYPL': { name: 'PayPal Holdings Inc.', sector: 'Financials', price: 0 },
        'COIN': { name: 'Coinbase Global Inc.', sector: 'Financials', price: 0 },

        // Transportation
        'UPS': { name: 'United Parcel Service Inc.', sector: 'Industrials', price: 0 },
        'FDX': { name: 'FedEx Corporation', sector: 'Industrials', price: 0 },

        // Retail
        'TGT': { name: 'Target Corporation', sector: 'Consumer Discretionary', price: 0 },
        'LOW': { name: 'Lowe\'s Companies Inc.', sector: 'Consumer Discretionary', price: 0 },

        // Telecom
        'T': { name: 'AT&T Inc.', sector: 'Communication Services', price: 0 },

        // Semiconductors
        'TXN': { name: 'Texas Instruments Incorporated', sector: 'Technology', price: 0 },
        'AVGO': { name: 'Broadcom Inc.', sector: 'Technology', price: 0 },
        'ADI': { name: 'Analog Devices Inc.', sector: 'Technology', price: 0 },

        // Biotech
        'REGN': { name: 'Regeneron Pharmaceuticals Inc.', sector: 'Healthcare', price: 0 },
        'VRTX': { name: 'Vertex Pharmaceuticals Inc.', sector: 'Healthcare', price: 0 },

        // Insurance
        'AIG': { name: 'American International Group Inc.', sector: 'Financials', price: 0 },
        'MET': { name: 'MetLife Inc.', sector: 'Financials', price: 0 },

        // Chemicals
        'DD': { name: 'DuPont de Nemours Inc.', sector: 'Materials', price: 0 },
        'DOW': { name: 'Dow Inc.', sector: 'Materials', price: 0 },

        // Additional Technology (Cloud, AI, Cybersecurity)
        'NOW': { name: 'ServiceNow Inc.', sector: 'Technology', price: 0 },
        'PANW': { name: 'Palo Alto Networks Inc.', sector: 'Technology', price: 0 },
        'ZS': { name: 'Zscaler Inc.', sector: 'Technology', price: 0 },
        'OKTA': { name: 'Okta Inc.', sector: 'Technology', price: 0 },
        'DOCU': { name: 'DocuSign Inc.', sector: 'Technology', price: 0 },
        'SHOP': { name: 'Shopify Inc.', sector: 'Technology', price: 0 },
        'UBER': { name: 'Uber Technologies Inc.', sector: 'Technology', price: 0 },
        'LYFT': { name: 'Lyft Inc.', sector: 'Technology', price: 0 },
        'SPOT': { name: 'Spotify Technology S.A.', sector: 'Communication Services', price: 0 },

        // Additional Financials
        'SCHW': { name: 'Charles Schwab Corporation', sector: 'Financials', price: 0 },
        'CBOE': { name: 'Cboe Global Markets Inc.', sector: 'Financials', price: 0 },
        'ICE': { name: 'Intercontinental Exchange Inc.', sector: 'Financials', price: 0 },
        'MSCI': { name: 'MSCI Inc.', sector: 'Financials', price: 0 },
        'FICO': { name: 'Fair Isaac Corporation', sector: 'Technology', price: 0 },

        // Additional Healthcare
        'ELV': { name: 'Elevance Health Inc.', sector: 'Healthcare', price: 0 },
        'HCA': { name: 'HCA Healthcare Inc.', sector: 'Healthcare', price: 0 },
        'CVS': { name: 'CVS Health Corporation', sector: 'Healthcare', price: 0 },
        'ANTM': { name: 'Anthem Inc.', sector: 'Healthcare', price: 0 },
        'ISRG': { name: 'Intuitive Surgical Inc.', sector: 'Healthcare', price: 0 },

        // Additional Consumer Discretionary
        'TJX': { name: 'TJX Companies Inc.', sector: 'Consumer Discretionary', price: 0 },
        'ROST': { name: 'Ross Stores Inc.', sector: 'Consumer Discretionary', price: 0 },
        'ULTA': { name: 'Ulta Beauty Inc.', sector: 'Consumer Discretionary', price: 0 },
        'DPZ': { name: 'Domino\'s Pizza Inc.', sector: 'Consumer Discretionary', price: 0 },
        'BKNG': { name: 'Booking Holdings Inc.', sector: 'Consumer Discretionary', price: 0 },

        // Additional Industrials
        'EMR': { name: 'Emerson Electric Company', sector: 'Industrials', price: 0 },
        'ETN': { name: 'Eaton Corporation plc', sector: 'Industrials', price: 0 },
        'ROP': { name: 'Roper Technologies Inc.', sector: 'Industrials', price: 0 },
        'WM': { name: 'Waste Management Inc.', sector: 'Industrials', price: 0 },
        'RSG': { name: 'Republic Services Inc.', sector: 'Industrials', price: 0 },

        // Additional Energy
        'SLB': { name: 'Schlumberger Limited', sector: 'Energy', price: 0 },
        'EOG': { name: 'EOG Resources Inc.', sector: 'Energy', price: 0 },
        'PXD': { name: 'Pioneer Natural Resources Company', sector: 'Energy', price: 0 },

        // Additional Materials
        'NEM': { name: 'Newmont Corporation', sector: 'Materials', price: 0 },
        'FCX': { name: 'Freeport-McMoRan Inc.', sector: 'Materials', price: 0 },
        'MOS': { name: 'Mosaic Company', sector: 'Materials', price: 0 },

        // Additional Communication Services
        'TMUS': { name: 'T-Mobile US Inc.', sector: 'Communication Services', price: 0 },
        'CHTR': { name: 'Charter Communications Inc.', sector: 'Communication Services', price: 0 },
        'DISH': { name: 'DISH Network Corporation', sector: 'Communication Services', price: 0 },

        // Additional Real Estate
        'WELL': { name: 'Welltower Inc.', sector: 'Real Estate', price: 0 },
        'PSA': { name: 'Public Storage', sector: 'Real Estate', price: 0 },
        'O': { name: 'Realty Income Corporation', sector: 'Real Estate', price: 0 },

        // Biotech & Pharmaceuticals
        'AMGN': { name: 'Amgen Inc.', sector: 'Healthcare', price: 0 },
        'BIIB': { name: 'Biogen Inc.', sector: 'Healthcare', price: 0 },
        'ILMN': { name: 'Illumina Inc.', sector: 'Healthcare', price: 0 },

        // Semiconductors & Chips
        'KLAC': { name: 'KLA Corporation', sector: 'Technology', price: 0 },
        'LRCX': { name: 'Lam Research Corporation', sector: 'Technology', price: 0 },
        'ASML': { name: 'ASML Holding N.V.', sector: 'Technology', price: 0 },

        // Cloud Computing & Software
        'SNOW': { name: 'Snowflake Inc.', sector: 'Technology', price: 0 },
        'DDOG': { name: 'Datadog Inc.', sector: 'Technology', price: 0 },
        'NET': { name: 'Cloudflare Inc.', sector: 'Technology', price: 0 },
        'MDB': { name: 'MongoDB Inc.', sector: 'Technology', price: 0 },

        // E-commerce & Digital
        'MELI': { name: 'MercadoLibre Inc.', sector: 'Consumer Discretionary', price: 0 },
        'JD': { name: 'JD.com Inc.', sector: 'Consumer Discretionary', price: 0 },
        'BABA': { name: 'Alibaba Group Holding Limited', sector: 'Consumer Discretionary', price: 0 },

        // Electric Vehicles & Clean Energy
        'ENPH': { name: 'Enphase Energy Inc.', sector: 'Technology', price: 0 },
        'SEDG': { name: 'SolarEdge Technologies Inc.', sector: 'Technology', price: 0 },
        'PLTR': { name: 'Palantir Technologies Inc.', sector: 'Technology', price: 0 },

        // ========== MAJOR EUROPEAN STOCKS ==========
        // FTSE 100 (UK)
        'HSBA.L': { name: 'HSBC Holdings plc', sector: 'Financials', price: 0, exchange: 'LSE' },
        'BP.L': { name: 'BP plc', sector: 'Energy', price: 0, exchange: 'LSE' },
        'RDSA.L': { name: 'Royal Dutch Shell plc', sector: 'Energy', price: 0, exchange: 'LSE' },
        'VOD.L': { name: 'Vodafone Group plc', sector: 'Communication Services', price: 0, exchange: 'LSE' },
        'GSK.L': { name: 'GSK plc', sector: 'Healthcare', price: 0, exchange: 'LSE' },
        'AZN.L': { name: 'AstraZeneca plc', sector: 'Healthcare', price: 0, exchange: 'LSE' },
        'ULVR.L': { name: 'Unilever plc', sector: 'Consumer Staples', price: 0, exchange: 'LSE' },
        'DGE.L': { name: 'Diageo plc', sector: 'Consumer Staples', price: 0, exchange: 'LSE' },
        'BARC.L': { name: 'Barclays plc', sector: 'Financials', price: 0, exchange: 'LSE' },
        'RIO.L': { name: 'Rio Tinto plc', sector: 'Materials', price: 0, exchange: 'LSE' },

        // DAX 40 (Germany)
        'SAP.DE': { name: 'SAP SE', sector: 'Technology', price: 0, exchange: 'XETRA' },
        'SIE.DE': { name: 'Siemens AG', sector: 'Industrials', price: 0, exchange: 'XETRA' },
        'ALV.DE': { name: 'Allianz SE', sector: 'Financials', price: 0, exchange: 'XETRA' },
        'BAS.DE': { name: 'BASF SE', sector: 'Materials', price: 0, exchange: 'XETRA' },
        'BMW.DE': { name: 'BMW AG', sector: 'Consumer Discretionary', price: 0, exchange: 'XETRA' },
        'DBK.DE': { name: 'Deutsche Bank AG', sector: 'Financials', price: 0, exchange: 'XETRA' },
        'DTE.DE': { name: 'Deutsche Telekom AG', sector: 'Communication Services', price: 0, exchange: 'XETRA' },
        'VOW3.DE': { name: 'Volkswagen AG', sector: 'Consumer Discretionary', price: 0, exchange: 'XETRA' },
        'MRK.DE': { name: 'Merck KGaA', sector: 'Healthcare', price: 0, exchange: 'XETRA' },
        'HEN3.DE': { name: 'Henkel AG & Co. KGaA', sector: 'Consumer Staples', price: 0, exchange: 'XETRA' },

        // CAC 40 (France)
        'SAN.PA': { name: 'Sanofi SA', sector: 'Healthcare', price: 0, exchange: 'Euronext' },
        'MC.PA': { name: 'LVMH Moët Hennessy Louis Vuitton SE', sector: 'Consumer Discretionary', price: 0, exchange: 'Euronext' },
        'OR.PA': { name: 'L\'Oréal SA', sector: 'Consumer Staples', price: 0, exchange: 'Euronext' },
        'BNP.PA': { name: 'BNP Paribas SA', sector: 'Financials', price: 0, exchange: 'Euronext' },
        'AIR.PA': { name: 'Airbus SE', sector: 'Industrials', price: 0, exchange: 'Euronext' },
        'SU.PA': { name: 'Schneider Electric SE', sector: 'Industrials', price: 0, exchange: 'Euronext' },
        'DG.PA': { name: 'VINCI SA', sector: 'Industrials', price: 0, exchange: 'Euronext' },
        'KER.PA': { name: 'Kering SA', sector: 'Consumer Discretionary', price: 0, exchange: 'Euronext' },

        // IBEX 35 (Spain)
        'SAN.MC': { name: 'Banco Santander SA', sector: 'Financials', price: 0, exchange: 'BME' },
        'BBVA.MC': { name: 'Banco Bilbao Vizcaya Argentaria SA', sector: 'Financials', price: 0, exchange: 'BME' },
        'ITX.MC': { name: 'Industria de Diseño Textil SA', sector: 'Consumer Discretionary', price: 0, exchange: 'BME' },
        'REP.MC': { name: 'Repsol SA', sector: 'Energy', price: 0, exchange: 'BME' },
        'TEF.MC': { name: 'Telefónica SA', sector: 'Communication Services', price: 0, exchange: 'BME' },

        // AEX (Netherlands)
        'ASML.AS': { name: 'ASML Holding NV', sector: 'Technology', price: 0, exchange: 'Euronext' },
        'UNA.AS': { name: 'Unilever NV', sector: 'Consumer Staples', price: 0, exchange: 'Euronext' },
        'INGA.AS': { name: 'ING Groep NV', sector: 'Financials', price: 0, exchange: 'Euronext' },
        'PHIA.AS': { name: 'Koninklijke Philips NV', sector: 'Healthcare', price: 0, exchange: 'Euronext' },

        // ========== MAJOR ASIAN STOCKS (non-Japan) ==========
        // Hang Seng (Hong Kong)
        '0005.HK': { name: 'HSBC Holdings plc', sector: 'Financials', price: 0, exchange: 'HKEX' },
        '0001.HK': { name: 'CK Hutchison Holdings Ltd', sector: 'Industrials', price: 0, exchange: 'HKEX' },
        '0002.HK': { name: 'CLP Holdings Ltd', sector: 'Utilities', price: 0, exchange: 'HKEX' },
        '0003.HK': { name: 'The Hong Kong and China Gas Company Ltd', sector: 'Utilities', price: 0, exchange: 'HKEX' },
        '0006.HK': { name: 'Power Assets Holdings Ltd', sector: 'Utilities', price: 0, exchange: 'HKEX' },
        '0011.HK': { name: 'Hang Seng Bank Ltd', sector: 'Financials', price: 0, exchange: 'HKEX' },
        '0012.HK': { name: 'Henderson Land Development Co. Ltd', sector: 'Real Estate', price: 0, exchange: 'HKEX' },
        '0016.HK': { name: 'Sun Hung Kai Properties Ltd', sector: 'Real Estate', price: 0, exchange: 'HKEX' },
        '0017.HK': { name: 'New World Development Company Ltd', sector: 'Real Estate', price: 0, exchange: 'HKEX' },
        '0027.HK': { name: 'Galaxy Entertainment Group Ltd', sector: 'Consumer Discretionary', price: 0, exchange: 'HKEX' },
        '0066.HK': { name: 'MTR Corporation Ltd', sector: 'Industrials', price: 0, exchange: 'HKEX' },
        '0083.HK': { name: 'Sino Land Company Ltd', sector: 'Real Estate', price: 0, exchange: 'HKEX' },
        '0101.HK': { name: 'Hang Lung Properties Ltd', sector: 'Real Estate', price: 0, exchange: 'HKEX' },
        '0175.HK': { name: 'Geely Automobile Holdings Ltd', sector: 'Consumer Discretionary', price: 0, exchange: 'HKEX' },
        '0233.HK': { name: 'Great Wall Motor Company Ltd', sector: 'Consumer Discretionary', price: 0, exchange: 'HKEX' },
        '0267.HK': { name: 'CITIC Pacific Ltd', sector: 'Industrials', price: 0, exchange: 'HKEX' },
        '0293.HK': { name: 'Cathay Pacific Airways Ltd', sector: 'Industrials', price: 0, exchange: 'HKEX' },
        '0322.HK': { name: 'Tingyi (Cayman Islands) Holding Corp', sector: 'Consumer Staples', price: 0, exchange: 'HKEX' },
        '0388.HK': { name: 'Hong Kong Exchanges and Clearing Ltd', sector: 'Financials', price: 0, exchange: 'HKEX' },
        '0494.HK': { name: 'Li Ning Company Ltd', sector: 'Consumer Discretionary', price: 0, exchange: 'HKEX' },
        '0688.HK': { name: 'China Overseas Land & Investment Ltd', sector: 'Real Estate', price: 0, exchange: 'HKEX' },
        '0700.HK': { name: 'Tencent Holdings Ltd', sector: 'Communication Services', price: 0, exchange: 'HKEX' },
        '0857.HK': { name: 'PetroChina Company Ltd', sector: 'Energy', price: 0, exchange: 'HKEX' },
        '0883.HK': { name: 'CNOOC Ltd', sector: 'Energy', price: 0, exchange: 'HKEX' },
        '0939.HK': { name: 'China Construction Bank Corp', sector: 'Financials', price: 0, exchange: 'HKEX' },
        '0941.HK': { name: 'China Mobile Ltd', sector: 'Communication Services', price: 0, exchange: 'HKEX' },
        '0968.HK': { name: 'Xinyi Glass Holdings Ltd', sector: 'Industrials', price: 0, exchange: 'HKEX' },
        '0992.HK': { name: 'Lenovo Group Ltd', sector: 'Technology', price: 0, exchange: 'HKEX' },
        '1038.HK': { name: 'CK Infrastructure Holdings Ltd', sector: 'Utilities', price: 0, exchange: 'HKEX' },
        '1044.HK': { name: 'Hengan International Group Company Ltd', sector: 'Consumer Staples', price: 0, exchange: 'HKEX' },
        '1088.HK': { name: 'China Shenhua Energy Company Ltd', sector: 'Energy', price: 0, exchange: 'HKEX' },
        '1093.HK': { name: 'CSPC Pharmaceutical Group Ltd', sector: 'Healthcare', price: 0, exchange: 'HKEX' },
        '1099.HK': { name: 'Sinopharm Group Co. Ltd', sector: 'Healthcare', price: 0, exchange: 'HKEX' },
        '1109.HK': { name: 'China Resources Land Ltd', sector: 'Real Estate', price: 0, exchange: 'HKEX' },
        '1113.HK': { name: 'CK Asset Holdings Ltd', sector: 'Real Estate', price: 0, exchange: 'HKEX' },
        '1177.HK': { name: 'Sino Biopharmaceutical Ltd', sector: 'Healthcare', price: 0, exchange: 'HKEX' },
        '1211.HK': { name: 'BYD Company Ltd', sector: 'Consumer Discretionary', price: 0, exchange: 'HKEX' },
        '1288.HK': { name: 'Agricultural Bank of China Ltd', sector: 'Financials', price: 0, exchange: 'HKEX' },
        '1299.HK': { name: 'AIA Group Ltd', sector: 'Financials', price: 0, exchange: 'HKEX' },
        '1398.HK': { name: 'Industrial and Commercial Bank of China Ltd', sector: 'Financials', price: 0, exchange: 'HKEX' },
        '1928.HK': { name: 'Sands China Ltd', sector: 'Consumer Discretionary', price: 0, exchange: 'HKEX' },
        '1929.HK': { name: 'Chow Tai Fook Jewellery Group Ltd', sector: 'Consumer Discretionary', price: 0, exchange: 'HKEX' },
        '1988.HK': { name: 'China Minsheng Banking Corp Ltd', sector: 'Financials', price: 0, exchange: 'HKEX' },
        '2007.HK': { name: 'Country Garden Holdings Company Ltd', sector: 'Real Estate', price: 0, exchange: 'HKEX' },
        '2313.HK': { name: 'Shenzhou International Group Holdings Ltd', sector: 'Consumer Discretionary', price: 0, exchange: 'HKEX' },
        '2318.HK': { name: 'Ping An Insurance (Group) Company of China Ltd', sector: 'Financials', price: 0, exchange: 'HKEX' },
        '2319.HK': { name: 'China Mengniu Dairy Company Ltd', sector: 'Consumer Staples', price: 0, exchange: 'HKEX' },
        '2331.HK': { name: 'Li Ning Company Ltd', sector: 'Consumer Discretionary', price: 0, exchange: 'HKEX' },
        '2382.HK': { name: 'Sunny Optical Technology (Group) Company Ltd', sector: 'Technology', price: 0, exchange: 'HKEX' },
        '2388.HK': { name: 'BOC Hong Kong (Holdings) Ltd', sector: 'Financials', price: 0, exchange: 'HKEX' },
        '2628.HK': { name: 'China Life Insurance Company Ltd', sector: 'Financials', price: 0, exchange: 'HKEX' },
        '2688.HK': { name: 'ENN Energy Holdings Ltd', sector: 'Utilities', price: 0, exchange: 'HKEX' },
        '3690.HK': { name: 'Meituan Dianping', sector: 'Consumer Discretionary', price: 0, exchange: 'HKEX' },
        '3968.HK': { name: 'China Merchants Bank Co., Ltd', sector: 'Financials', price: 0, exchange: 'HKEX' },
        '9988.HK': { name: 'Alibaba Group Holding Ltd', sector: 'Consumer Discretionary', price: 0, exchange: 'HKEX' },

        // Shanghai Composite (China)
        '600036.SS': { name: 'China Merchants Bank Co., Ltd', sector: 'Financials', price: 0, exchange: 'SSE' },
        '600000.SS': { name: 'Shanghai Pudong Development Bank Co., Ltd', sector: 'Financials', price: 0, exchange: 'SSE' },
        '600276.SS': { name: 'Hengrui Medicine Co., Ltd', sector: 'Healthcare', price: 0, exchange: 'SSE' },
        '600519.SS': { name: 'Kweichow Moutai Co., Ltd', sector: 'Consumer Staples', price: 0, exchange: 'SSE' },
        '600887.SS': { name: 'Inner Mongolia Yili Industrial Group Co., Ltd', sector: 'Consumer Staples', price: 0, exchange: 'SSE' },
        '600309.SS': { name: 'Wanhua Chemical Group Co., Ltd', sector: 'Materials', price: 0, exchange: 'SSE' },
        '600585.SS': { name: 'Conch Cement Company Ltd', sector: 'Materials', price: 0, exchange: 'SSE' },
        '600585.SS': { name: 'Conch Cement Company Ltd', sector: 'Materials', price: 0, exchange: 'SSE' },

        // KOSPI (South Korea)
        '005930.KS': { name: 'Samsung Electronics Co., Ltd', sector: 'Technology', price: 0, exchange: 'KRX' },
        '000660.KS': { name: 'SK Hynix Inc.', sector: 'Technology', price: 0, exchange: 'KRX' },
        '207940.KS': { name: 'Samsung Biologics Co., Ltd', sector: 'Healthcare', price: 0, exchange: 'KRX' },
        '051910.KS': { name: 'LG Chem Ltd', sector: 'Materials', price: 0, exchange: 'KRX' },
        '005935.KS': { name: 'Samsung Electronics Co., Ltd', sector: 'Technology', price: 0, exchange: 'KRX' },
        '006400.KS': { name: 'Samsung SDI Co., Ltd', sector: 'Technology', price: 0, exchange: 'KRX' },
        '035420.KS': { name: 'NAVER Corp', sector: 'Communication Services', price: 0, exchange: 'KRX' },
        '035720.KS': { name: 'Kakao Corp', sector: 'Communication Services', price: 0, exchange: 'KRX' },
        '000270.KS': { name: 'Kia Corporation', sector: 'Consumer Discretionary', price: 0, exchange: 'KRX' },
        '105560.KS': { name: 'KB Financial Group Inc.', sector: 'Financials', price: 0, exchange: 'KRX' },

        // ========== NIKKEI 225 - Japanese Market Leaders ==========
        // Major Japanese Technology & Electronics
        '7203.T': { name: 'Toyota Motor Corporation', sector: 'Consumer Discretionary', price: 0, exchange: 'Nikkei' },
        '6758.T': { name: 'Sony Group Corporation', sector: 'Technology', price: 0, exchange: 'Nikkei' },
        '7974.T': { name: 'Nintendo Co., Ltd.', sector: 'Communication Services', price: 0, exchange: 'Nikkei' },
        '9984.T': { name: 'SoftBank Group Corp.', sector: 'Communication Services', price: 0, exchange: 'Nikkei' },
        '6861.T': { name: 'Keyence Corporation', sector: 'Technology', price: 0, exchange: 'Nikkei' },
        '6954.T': { name: 'Fanuc Corporation', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '6501.T': { name: 'Hitachi, Ltd.', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '6752.T': { name: 'Panasonic Holdings Corporation', sector: 'Consumer Discretionary', price: 0, exchange: 'Nikkei' },

        // Japanese Telecom & Media
        '9432.T': { name: 'Nippon Telegraph and Telephone Corporation', sector: 'Communication Services', price: 0, exchange: 'Nikkei' },
        '9433.T': { name: 'KDDI Corporation', sector: 'Communication Services', price: 0, exchange: 'Nikkei' },
        '9434.T': { name: 'SoftBank Corp.', sector: 'Communication Services', price: 0, exchange: 'Nikkei' },

        // Japanese Banking & Financials
        '8306.T': { name: 'Mitsubishi UFJ Financial Group, Inc.', sector: 'Financials', price: 0, exchange: 'Nikkei' },
        '8316.T': { name: 'Sumitomo Mitsui Financial Group, Inc.', sector: 'Financials', price: 0, exchange: 'Nikkei' },
        '8411.T': { name: 'Mizuho Financial Group, Inc.', sector: 'Financials', price: 0, exchange: 'Nikkei' },
        '8591.T': { name: 'ORIX Corporation', sector: 'Financials', price: 0, exchange: 'Nikkei' },

        // Japanese Automobiles
        '7267.T': { name: 'Honda Motor Co., Ltd.', sector: 'Consumer Discretionary', price: 0, exchange: 'Nikkei' },
        '7201.T': { name: 'Nissan Motor Co., Ltd.', sector: 'Consumer Discretionary', price: 0, exchange: 'Nikkei' },
        '7261.T': { name: 'Mazda Motor Corporation', sector: 'Consumer Discretionary', price: 0, exchange: 'Nikkei' },
        '7211.T': { name: 'Mitsubishi Motors Corporation', sector: 'Consumer Discretionary', price: 0, exchange: 'Nikkei' },
        '7270.T': { name: 'Subaru Corporation', sector: 'Consumer Discretionary', price: 0, exchange: 'Nikkei' },

        // Japanese Industrials & Manufacturing
        '6503.T': { name: 'Mitsubishi Electric Corporation', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '8058.T': { name: 'Mitsubishi Corporation', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '8031.T': { name: 'Mitsui & Co., Ltd.', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '8053.T': { name: 'Sumitomo Corporation', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '8001.T': { name: 'ITOCHU Corporation', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '8002.T': { name: 'Marubeni Corporation', sector: 'Industrials', price: 0, exchange: 'Nikkei' },

        // Japanese Real Estate
        '8802.T': { name: 'Mitsubishi Estate Co., Ltd.', sector: 'Real Estate', price: 0, exchange: 'Nikkei' },
        '8801.T': { name: 'Mitsui Fudosan Co., Ltd.', sector: 'Real Estate', price: 0, exchange: 'Nikkei' },

        // Japanese Insurance
        '8725.T': { name: 'MS&AD Insurance Group Holdings, Inc.', sector: 'Financials', price: 0, exchange: 'Nikkei' },
        '8630.T': { name: 'SOMPO Holdings, Inc.', sector: 'Financials', price: 0, exchange: 'Nikkei' },
        '8766.T': { name: 'Tokio Marine Holdings, Inc.', sector: 'Financials', price: 0, exchange: 'Nikkei' },

        // Japanese Materials & Chemicals
        '6981.T': { name: 'Murata Manufacturing Co., Ltd.', sector: 'Technology', price: 0, exchange: 'Nikkei' },
        '4063.T': { name: 'Shin-Etsu Chemical Co., Ltd.', sector: 'Materials', price: 0, exchange: 'Nikkei' },
        '3407.T': { name: 'Asahi Kasei Corporation', sector: 'Materials', price: 0, exchange: 'Nikkei' },
        '4021.T': { name: 'Nissan Chemical Corporation', sector: 'Materials', price: 0, exchange: 'Nikkei' },

        // Japanese Energy & Utilities
        '5020.T': { name: 'ENEOS Holdings, Inc.', sector: 'Energy', price: 0, exchange: 'Nikkei' },
        '1605.T': { name: 'Inpex Corporation', sector: 'Energy', price: 0, exchange: 'Nikkei' },
        '9531.T': { name: 'Tokyo Gas Co., Ltd.', sector: 'Utilities', price: 0, exchange: 'Nikkei' },
        '9532.T': { name: 'Osaka Gas Co., Ltd.', sector: 'Utilities', price: 0, exchange: 'Nikkei' },
        '9501.T': { name: 'Tokyo Electric Power Company Holdings, Inc.', sector: 'Utilities', price: 0, exchange: 'Nikkei' },
        '9503.T': { name: 'The Kansai Electric Power Co., Inc.', sector: 'Utilities', price: 0, exchange: 'Nikkei' },

        // Japanese Consumer Goods
        '2502.T': { name: 'Asahi Group Holdings, Ltd.', sector: 'Consumer Staples', price: 0, exchange: 'Nikkei' },
        '2503.T': { name: 'Kirin Holdings Company, Limited', sector: 'Consumer Staples', price: 0, exchange: 'Nikkei' },
        '2269.T': { name: 'Meiji Holdings Co., Ltd.', sector: 'Consumer Staples', price: 0, exchange: 'Nikkei' },
        '2002.T': { name: 'Nissin Foods Holdings Co., Ltd.', sector: 'Consumer Staples', price: 0, exchange: 'Nikkei' },
        '2802.T': { name: 'Ajinomoto Co., Inc.', sector: 'Consumer Staples', price: 0, exchange: 'Nikkei' },
        '2914.T': { name: 'Japan Tobacco Inc.', sector: 'Consumer Staples', price: 0, exchange: 'Nikkei' },
        '3382.T': { name: 'Seven & i Holdings Co., Ltd.', sector: 'Consumer Staples', price: 0, exchange: 'Nikkei' },

        // Japanese Transportation
        '9202.T': { name: 'ANA Holdings, Inc.', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '9201.T': { name: 'Japan Airlines Co., Ltd.', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '9064.T': { name: 'Yamato Holdings Co., Ltd.', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '9147.T': { name: 'Nippon Express Co., Ltd.', sector: 'Industrials', price: 0, exchange: 'Nikkei' },

        // Japanese Railroads
        '9007.T': { name: 'Otsuka Corporation', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '9009.T': { name: 'Kyushu Railway Company', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '9005.T': { name: 'East Japan Railway Company', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '9001.T': { name: 'Central Japan Railway Company', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '9020.T': { name: 'West Japan Railway Company', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '9022.T': { name: 'Hokkaido Railway Company', sector: 'Industrials', price: 0, exchange: 'Nikkei' },

        // Japanese Technology Companies
        '6702.T': { name: 'Fujitsu Limited', sector: 'Technology', price: 0, exchange: 'Nikkei' },
        '6701.T': { name: 'NEC Corporation', sector: 'Technology', price: 0, exchange: 'Nikkei' },
        '6724.T': { name: 'Seiko Epson Corporation', sector: 'Technology', price: 0, exchange: 'Nikkei' },
        '6723.T': { name: 'Renesas Electronics Corporation', sector: 'Technology', price: 0, exchange: 'Nikkei' },
        '7751.T': { name: 'Canon Inc.', sector: 'Technology', price: 0, exchange: 'Nikkei' },
        '7731.T': { name: 'Nikon Corporation', sector: 'Technology', price: 0, exchange: 'Nikkei' },
        '7741.T': { name: 'HOYA Corporation', sector: 'Healthcare', price: 0, exchange: 'Nikkei' },

        // Japanese Auto Parts & Components
        '6902.T': { name: 'Denso Corporation', sector: 'Consumer Discretionary', price: 0, exchange: 'Nikkei' },
        '7259.T': { name: 'Aisin Seiki Co., Ltd.', sector: 'Consumer Discretionary', price: 0, exchange: 'Nikkei' },
        '6471.T': { name: 'NSK Ltd.', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '6473.T': { name: 'JTEKT Corporation', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '6645.T': { name: 'Omron Corporation', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '6506.T': { name: 'Yaskawa Electric Corporation', sector: 'Industrials', price: 0, exchange: 'Nikkei' },

        // Japanese Heavy Industry
        '7011.T': { name: 'Mitsubishi Heavy Industries, Ltd.', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '7012.T': { name: 'Kawasaki Heavy Industries, Ltd.', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '6361.T': { name: 'Ebara Corporation', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '6367.T': { name: 'Daikin Industries, Ltd.', sector: 'Industrials', price: 0, exchange: 'Nikkei' },

        // Japanese Tire & Rubber
        '5108.T': { name: 'Bridgestone Corporation', sector: 'Consumer Discretionary', price: 0, exchange: 'Nikkei' },
        '5101.T': { name: 'The Yokohama Rubber Co., Ltd.', sector: 'Consumer Discretionary', price: 0, exchange: 'Nikkei' },

        // Japanese Entertainment & Gaming
        '9684.T': { name: 'Square Enix Holdings Co., Ltd.', sector: 'Communication Services', price: 0, exchange: 'Nikkei' },
        '3659.T': { name: 'Nexon Co., Ltd.', sector: 'Communication Services', price: 0, exchange: 'Nikkei' },
        '4689.T': { name: 'Z Holdings Corporation', sector: 'Communication Services', price: 0, exchange: 'Nikkei' },
        '4755.T': { name: 'Rakuten Group, Inc.', sector: 'Consumer Discretionary', price: 0, exchange: 'Nikkei' },

        // Japanese Metals & Mining
        '5711.T': { name: 'Mitsubishi Materials Corporation', sector: 'Materials', price: 0, exchange: 'Nikkei' },
        '5713.T': { name: 'Sumitomo Metal Mining Co., Ltd.', sector: 'Materials', price: 0, exchange: 'Nikkei' },
        '5706.T': { name: 'Mitsubishi Materials Corporation', sector: 'Materials', price: 0, exchange: 'Nikkei' },
        '5707.T': { name: 'Toho Zinc Co., Ltd.', sector: 'Materials', price: 0, exchange: 'Nikkei' },
        '5802.T': { name: 'Sumitomo Electric Industries, Ltd.', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '5801.T': { name: 'Furukawa Electric Co., Ltd.', sector: 'Industrials', price: 0, exchange: 'Nikkei' },

        // Japanese Electronics Components
        '6770.T': { name: 'Alps Alpine Co., Ltd.', sector: 'Technology', price: 0, exchange: 'Nikkei' },
        '5444.T': { name: 'Yamaha Corporation', sector: 'Consumer Discretionary', price: 0, exchange: 'Nikkei' },
        '6479.T': { name: 'MinebeaMitsumi Inc.', sector: 'Technology', price: 0, exchange: 'Nikkei' },
        '7735.T': { name: 'SCREEN Holdings Co., Ltd.', sector: 'Technology', price: 0, exchange: 'Nikkei' },
        '7762.T': { name: 'Citizen Watch Co., Ltd.', sector: 'Consumer Discretionary', price: 0, exchange: 'Nikkei' },

        // Japanese Printing & Media
        '7912.T': { name: 'Dai Nippon Printing Co., Ltd.', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '7911.T': { name: 'Toppan Printing Co., Ltd.', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '9613.T': { name: 'NTT DATA Corporation', sector: 'Technology', price: 0, exchange: 'Nikkei' },

        // Japanese Postal Services & Government-Related
        '7182.T': { name: 'Japan Post Holdings Co., Ltd.', sector: 'Financials', price: 0, exchange: 'Nikkei' },
        '6178.T': { name: 'Japan Post Bank Co., Ltd.', sector: 'Financials', price: 0, exchange: 'Nikkei' },
        '7181.T': { name: 'Japan Post Insurance Co., Ltd.', sector: 'Financials', price: 0, exchange: 'Nikkei' },
        '7186.T': { name: 'Japan Post Insurance Co., Ltd.', sector: 'Financials', price: 0, exchange: 'Nikkei' },

        // More Key Nikkei 225 Companies
        '7974.T': { name: 'Nintendo Co., Ltd.', sector: 'Communication Services', price: 0, exchange: 'Nikkei' },
        '6861.T': { name: 'Keyence Corporation', sector: 'Technology', price: 0, exchange: 'Nikkei' },
        '6954.T': { name: 'Fanuc Corporation', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '6501.T': { name: 'Hitachi, Ltd.', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '7751.T': { name: 'Canon Inc.', sector: 'Technology', price: 0, exchange: 'Nikkei' },
        '7731.T': { name: 'Nikon Corporation', sector: 'Technology', price: 0, exchange: 'Nikkei' },
        '7741.T': { name: 'HOYA Corporation', sector: 'Healthcare', price: 0, exchange: 'Nikkei' },
        '6902.T': { name: 'Denso Corporation', sector: 'Consumer Discretionary', price: 0, exchange: 'Nikkei' },
        '7259.T': { name: 'Aisin Seiki Co., Ltd.', sector: 'Consumer Discretionary', price: 0, exchange: 'Nikkei' },
        '6471.T': { name: 'NSK Ltd.', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '6473.T': { name: 'JTEKT Corporation', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '6645.T': { name: 'Omron Corporation', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '6506.T': { name: 'Yaskawa Electric Corporation', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '6273.T': { name: 'SMC Corporation', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '6361.T': { name: 'Ebara Corporation', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '6367.T': { name: 'Daikin Industries, Ltd.', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '7011.T': { name: 'Mitsubishi Heavy Industries, Ltd.', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '7012.T': { name: 'Kawasaki Heavy Industries, Ltd.', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '5108.T': { name: 'Bridgestone Corporation', sector: 'Consumer Discretionary', price: 0, exchange: 'Nikkei' },
        '5101.T': { name: 'The Yokohama Rubber Co., Ltd.', sector: 'Consumer Discretionary', price: 0, exchange: 'Nikkei' },
        '6981.T': { name: 'Murata Manufacturing Co., Ltd.', sector: 'Technology', price: 0, exchange: 'Nikkei' },
        '4063.T': { name: 'Shin-Etsu Chemical Co., Ltd.', sector: 'Materials', price: 0, exchange: 'Nikkei' },
        '3407.T': { name: 'Asahi Kasei Corporation', sector: 'Materials', price: 0, exchange: 'Nikkei' },
        '2502.T': { name: 'Asahi Group Holdings, Ltd.', sector: 'Consumer Staples', price: 0, exchange: 'Nikkei' },
        '2503.T': { name: 'Kirin Holdings Company, Limited', sector: 'Consumer Staples', price: 0, exchange: 'Nikkei' },
        '2269.T': { name: 'Meiji Holdings Co., Ltd.', sector: 'Consumer Staples', price: 0, exchange: 'Nikkei' },
        '2002.T': { name: 'Nissin Foods Holdings Co., Ltd.', sector: 'Consumer Staples', price: 0, exchange: 'Nikkei' },
        '2802.T': { name: 'Ajinomoto Co., Inc.', sector: 'Consumer Staples', price: 0, exchange: 'Nikkei' },
        '2914.T': { name: 'Japan Tobacco Inc.', sector: 'Consumer Staples', price: 0, exchange: 'Nikkei' },
        '3382.T': { name: 'Seven & i Holdings Co., Ltd.', sector: 'Consumer Staples', price: 0, exchange: 'Nikkei' },
        '9202.T': { name: 'ANA Holdings, Inc.', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '9201.T': { name: 'Japan Airlines Co., Ltd.', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '9064.T': { name: 'Yamato Holdings Co., Ltd.', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '6702.T': { name: 'Fujitsu Limited', sector: 'Technology', price: 0, exchange: 'Nikkei' },
        '6701.T': { name: 'NEC Corporation', sector: 'Technology', price: 0, exchange: 'Nikkei' },
        '6724.T': { name: 'Seiko Epson Corporation', sector: 'Technology', price: 0, exchange: 'Nikkei' },
        '6723.T': { name: 'Renesas Electronics Corporation', sector: 'Technology', price: 0, exchange: 'Nikkei' },
        '6770.T': { name: 'Alps Alpine Co., Ltd.', sector: 'Technology', price: 0, exchange: 'Nikkei' },
        '6479.T': { name: 'MinebeaMitsumi Inc.', sector: 'Technology', price: 0, exchange: 'Nikkei' },
        '7735.T': { name: 'SCREEN Holdings Co., Ltd.', sector: 'Technology', price: 0, exchange: 'Nikkei' },
        '7762.T': { name: 'Citizen Watch Co., Ltd.', sector: 'Consumer Discretionary', price: 0, exchange: 'Nikkei' },
        '7912.T': { name: 'Dai Nippon Printing Co., Ltd.', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '7911.T': { name: 'Toppan Printing Co., Ltd.', sector: 'Industrials', price: 0, exchange: 'Nikkei' },
        '9613.T': { name: 'NTT DATA Corporation', sector: 'Technology', price: 0, exchange: 'Nikkei' },
        '4689.T': { name: 'Z Holdings Corporation', sector: 'Communication Services', price: 0, exchange: 'Nikkei' },
        '4755.T': { name: 'Rakuten Group, Inc.', sector: 'Consumer Discretionary', price: 0, exchange: 'Nikkei' },
        '3659.T': { name: 'Nexon Co., Ltd.', sector: 'Communication Services', price: 0, exchange: 'Nikkei' },
        '9684.T': { name: 'Square Enix Holdings Co., Ltd.', sector: 'Communication Services', price: 0, exchange: 'Nikkei' }
    },
    defaultVisibleStocks: ['AAPL', 'TSLA', 'MSFT', 'AMZN', '7203.T', '6758.T', '005930.KS', '0005.HK', 'HSBA.L'], // Include international stocks
    sectors: ['Technology', 'Financials', 'Healthcare', 'Consumer Discretionary', 'Consumer Staples', 'Energy', 'Industrials', 'Materials', 'Communication Services', 'Utilities', 'Real Estate', 'Nikkei', 'Europe', 'Asia']
};

// Budget Calculator Settings
window.BUDGET_CONFIG = {
    defaultIncome: {
        name: 'Allowance',
        amount: 50
    },
    defaultExpense: {
        name: 'Snacks',
        amount: 10
    }
};

// Compound Interest Calculator Settings
window.COMPOUND_CONFIG = {
    defaultInitial: 100,
    defaultMonthly: 25,
    defaultYears: 10,
    defaultRate: 5
};

// Savings Goal Calculator Settings
window.SAVINGS_CONFIG = {
    defaultGoal: 500,
    defaultWeekly: 25
};
