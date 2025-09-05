// Finance U - Main Application JavaScript
// --- State Management ---
let questsCompleted = 2;
const userAnswers = {};

// --- Global Variables (will be initialized in initializeApp) ---
let mobileMenuButton, mobileMenu, allSections, navLinks;
let simCashEl, simPortfolioValueEl, stockListEl, logEl, addStockTickerInput, addStockBtn, refreshBtn;
let stockSearchInput, sectorFilter, stockSuggestions;

// Budget calculator elements
let budgetItemsContainer, addExpenseBtn, totalIncomeEl, totalExpensesEl, remainingBalanceEl;

// Savings calculator elements
let goalAmountInput, weeklySavingInput, savingsResultEl;

// Compound interest elements
let ciInputs;

function showSection(sectionId, clickedLink = null) {
    console.log('🔄 showSection called with:', sectionId);

    if (!allSections || allSections.length === 0) {
        console.error('❌ allSections not found or empty');
        allSections = document.querySelectorAll('.app-section');
        console.log('🔄 Re-initialized allSections:', allSections.length, 'sections found');
    }

    allSections.forEach(section => {
        section.classList.add('hidden');
    });

    const targetSection = document.getElementById(sectionId);
    if (!targetSection) {
        console.error('❌ Target section not found:', sectionId);
        console.log('📋 Available sections:', Array.from(allSections).map(s => s.id));
        return;
    }
    targetSection.classList.remove('hidden');
    console.log('✅ Section shown:', sectionId);

    navLinks.forEach(link => {
        link.classList.remove('nav-link-active');
    });

    const activeLink = clickedLink || document.querySelector(`.nav-link[href="#${sectionId}"]`);
    if (activeLink) {
         activeLink.classList.add('nav-link-active');
    }

    if(!mobileMenu.classList.contains('hidden')){
        mobileMenu.classList.add('hidden');
    }

    // Update quest display when quests section is shown
    if (sectionId === 'quests') {
        updateQuestDisplay();
    }

    window.scrollTo(0, 0);
}

function showQuestDetail(questId) {
    showSection(`quest-detail-${questId}`);
}

// --- Interactive Tools ---
// DOM elements will be initialized in initializeApp()

function calculateBudget() {
    let totalIncome = 0;
    let totalExpenses = 0;
    budgetItemsContainer.querySelectorAll('[data-type="income-amount"]').forEach(input => totalIncome += parseFloat(input.value) || 0);
    budgetItemsContainer.querySelectorAll('[data-type="expense-amount"]').forEach(input => totalExpenses += parseFloat(input.value) || 0);
    const remaining = totalIncome - totalExpenses;

    totalIncomeEl.textContent = `$${totalIncome.toFixed(2)}`;
    totalExpensesEl.textContent = `$${totalExpenses.toFixed(2)}`;
    remainingBalanceEl.textContent = `$${remaining.toFixed(2)}`;

    remainingBalanceEl.classList.toggle('text-red-500', remaining < 0);
    remainingBalanceEl.classList.toggle('text-green-500', remaining > 0);
    remainingBalanceEl.classList.toggle('text-slate-800', remaining === 0);
}

budgetItemsContainer.addEventListener('input', calculateBudget);

addExpenseBtn.addEventListener('click', () => {
    const expenseRow = document.createElement('div');
    expenseRow.className = 'flex gap-4 mt-2';
    expenseRow.innerHTML = `<input type="text" placeholder="Expense" class="w-2/3 p-3 border border-slate-300 rounded-lg" data-type="expense-name"><input type="number" placeholder="Amount" class="w-1/3 p-3 border border-slate-300 rounded-lg" data-type="expense-amount">`;
    budgetItemsContainer.appendChild(expenseRow);
});

// Savings Goal Calculator - DOM elements initialized in initializeApp()

function calculateSavings() {
    const goal = parseFloat(goalAmountInput.value);
    const saving = parseFloat(weeklySavingInput.value);
    if (goal > 0 && saving > 0) {
        savingsResultEl.textContent = `${Math.ceil(goal / saving)} weeks`;
    } else {
        savingsResultEl.textContent = '-- weeks';
    }
}
goalAmountInput.addEventListener('input', calculateSavings);
weeklySavingInput.addEventListener('input', calculateSavings);

// Compound Interest Calculator - DOM elements initialized in initializeApp()

function calculateCI() {
    const principal = parseFloat(document.getElementById('ci-initial').value) || 0;
    const monthly = parseFloat(document.getElementById('ci-monthly').value) || 0;
    const years = parseInt(document.getElementById('ci-years').value) || 0;
    const rate = parseFloat(document.getElementById('ci-rate').value) || 0;

    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    let futureValue = principal * Math.pow(1 + monthlyRate, months);
    if (monthly > 0) {
        futureValue += monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    }

    const totalDeposits = principal + (monthly * months);
    const totalInterest = futureValue - totalDeposits;

    document.getElementById('ci-result').textContent = `$${futureValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('ci-breakdown').textContent = `which is $${totalDeposits.toLocaleString()} in deposits and $${totalInterest.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} in interest.`;
}

// --- Stock Market Simulator v2 (with Gemini API) ---
const allStockData = {
    'AAPL': { name: 'Apple Inc.', price: 0 },
    'TSLA': { name: 'Tesla, Inc.', price: 0 },
    'GME': { name: 'GameStop Corp.', price: 0 },
    'NKE': { name: 'NIKE, Inc.', price: 0 },
    'GOOGL': { name: 'Alphabet Inc.', price: 0 },
    'AMZN': { name: 'Amazon.com, Inc.', price: 0 },
    'MSFT': { name: 'Microsoft Corp.', price: 0 },
    'DIS': { name: 'The Walt Disney Co.', price: 0 },
    'SBUX': { name: 'Starbucks Corp.', price: 0 },
    'MCD': { name: "McDonald's Corp.", price: 0 },
    'NVDA': { name: 'NVIDIA Corp.', price: 0 },
    'META': { name: 'Meta Platforms, Inc.', price: 0 },
};
let simCash = 10000;
const portfolio = {};
let visibleStocks = [...window.STOCK_CONFIG.defaultVisibleStocks]; // Stocks visible in the UI
let userTier = window.USER_CONFIG.currentTier;
let dailyStockUpdates = 0;
let monthlyStockUpdates = 0;

// DOM elements will be initialized in initializeApp()

// Gemini API Call Function with Exponential Backoff
// Demo stock prices for when API key isn't configured
const demoStockPrices = {
    // Tech Giants
    'AAPL': 175.43, 'MSFT': 408.49, 'GOOGL': 141.80, 'AMZN': 144.05, 'TSLA': 248.42,
    'NVDA': 116.14, 'META': 542.81, 'CRM': 390.25, 'ADBE': 485.50, 'INTC': 19.85,
    'AMD': 122.84, 'IBM': 221.15, 'ORCL': 176.80, 'CSCO': 58.95, 'QCOM': 165.74,
    'TXN': 198.45, 'AVGO': 1789.50, 'ADI': 226.30,

    // Financials
    'JPM': 221.75, 'BAC': 45.12, 'WFC': 68.94, 'GS': 524.30, 'MS': 116.85,
    'V': 315.20, 'MA': 509.85, 'AXP': 277.40, 'BLK': 1028.75, 'SPGI': 511.60,
    'COF': 170.25, 'AIG': 79.80, 'MET': 85.65,

    // Healthcare
    'JNJ': 164.20, 'PFE': 25.48, 'UNH': 586.75, 'ABBV': 193.85, 'TMO': 609.40,
    'ABT': 116.50, 'MRNA': 58.92, 'GILD': 91.75, 'BMY': 46.28, 'CI': 370.15,
    'HUM': 375.40, 'REGN': 1148.20, 'VRTX': 474.85,

    // Consumer Goods
    'PG': 167.80, 'KO': 67.25, 'PEP': 165.50, 'COST': 891.75, 'WMT': 92.85,
    'HD': 415.30, 'MCD': 294.31, 'NKE': 82.91, 'SBUX': 94.85, 'DIS': 90.12,
    'TGT': 149.45, 'LOW': 278.60, 'GME': 21.15, 'EA': 163.20,

    // Energy
    'XOM': 121.75, 'CVX': 157.80, 'COP': 111.45,

    // Industrials
    'BA': 169.80, 'CAT': 394.25, 'HON': 213.45, 'GE': 181.20, 'LMT': 595.30,
    'RTX': 128.75, 'MMM': 136.85, 'UPS': 131.50, 'FDX': 247.60,

    // Materials
    'LIN': 477.50, 'APD': 312.85, 'DD': 86.45, 'DOW': 52.80,

    // Communication Services
    'NFLX': 896.75, 'CMCSA': 42.15, 'VZ': 41.25, 'T': 20.85,

    // Utilities
    'NEE': 84.75, 'DUK': 113.20,

    // Real Estate
    'AMT': 240.50, 'PLD': 135.80,

    // Crypto/Fintech
    'SQ': 89.45, 'PYPL': 83.20, 'COIN': 275.90,

    // Semiconductors
    'INTC': 19.85, 'AMD': 122.84, 'QCOM': 165.74, 'TXN': 198.45, 'AVGO': 1789.50, 'ADI': 226.30,

    // Japanese Stocks - Nikkei 225
    '7203.T': 3150.50, '6758.T': 12850.75, '7974.T': 7850.25, '9984.T': 12450.80,
    '6861.T': 68900.90, '6954.T': 2450.60, '6501.T': 1420.35, '6752.T': 1680.45,
    '9432.T': 168.70, '9433.T': 4890.25, '9434.T': 1890.80,
    '8306.T': 1420.90, '8316.T': 4650.75, '8411.T': 1890.45, '8591.T': 2340.60,
    '7267.T': 1780.25, '7201.T': 480.35, '7261.T': 1290.70, '7211.T': 890.45,
    '6503.T': 1890.80, '8058.T': 3670.25, '8031.T': 4250.90, '8053.T': 2890.60,
    '8802.T': 2450.75, '8801.T': 3670.35, '8725.T': 4980.90, '8630.T': 3120.45,
    '6981.T': 2890.70, '4063.T': 1780.25, '3407.T': 1240.60, '4021.T': 890.35,
    '5020.T': 580.45, '1605.T': 2340.80, '9531.T': 2890.25, '9532.T': 1980.70,
    '2502.T': 4560.90, '2503.T': 1890.45, '2269.T': 3450.75, '2002.T': 1240.35,
    '2802.T': 3670.80, '2914.T': 2890.25, '3382.T': 4560.60,
    '9202.T': 2980.45, '9201.T': 2340.75, '9064.T': 3450.90, '9147.T': 1890.25,
    '9005.T': 2980.70, '9001.T': 2340.35, '9020.T': 3450.80, '9022.T': 1890.45,
    '6702.T': 1980.60, '6701.T': 2890.75, '6724.T': 2340.90, '6723.T': 1240.25,
    '6902.T': 2340.70, '7259.T': 3450.85, '6471.T': 1890.40, '6473.T': 1240.65,
    '7011.T': 7890.25, '7012.T': 4560.80, '6361.T': 2980.45, '6367.T': 23400.75,
    '5108.T': 5890.90, '5101.T': 3450.25,         '9684.T': 6780.60, '3659.T': 2340.45,
        '5711.T': 2890.75, '5713.T': 4560.80, '5802.T': 1980.35, '5801.T': 2340.60,
        '6770.T': 1240.25, '6479.T': 3450.70, '7912.T': 2890.85, '9613.T': 1980.40,
        '7182.T': 890.25, '6178.T': 1240.60, '7181.T': 1560.35, '7186.T': 1890.75,

        // European Stocks
        'HSBA.L': 680.50, 'BP.L': 450.80, 'RDSA.L': 1250.40, 'VOD.L': 75.60,
        'GSK.L': 1520.30, 'AZN.L': 9850.70, 'ULVR.L': 4250.90, 'DGE.L': 2800.60,
        'BARC.L': 220.40, 'RIO.L': 4800.50,
        'SAP.DE': 16850.75, 'SIE.DE': 14500.25, 'ALV.DE': 245.80, 'BAS.DE': 47.60,
        'BMW.DE': 95.40, 'DBK.DE': 15.80, 'DTE.DE': 22.30, 'VOW3.DE': 105.20,
        'MRK.DE': 145.60, 'HEN3.DE': 65.80,
        'SAN.PA': 85.70, 'MC.PA': 650.40, 'OR.PA': 350.60, 'BNP.PA': 58.90,
        'AIR.PA': 125.80, 'SU.PA': 120.50, 'DG.PA': 165.40, 'KER.PA': 450.20,
        'SAN.MC': 3.80, 'BBVA.MC': 8.90, 'ITX.MC': 40.60, 'REP.MC': 12.80,
        'TEF.MC': 4.20,
        'ASML.AS': 650.80, 'UNA.AS': 45.60, 'INGA.AS': 15.40, 'PHIA.AS': 16.80,

        // Asian Stocks (Hong Kong, China, Korea)
        '0005.HK': 65.80, '0001.HK': 45.20, '0002.HK': 75.60, '0003.HK': 7.80,
        '0006.HK': 45.90, '0011.HK': 155.40, '0012.HK': 25.80, '0016.HK': 115.60,
        '0017.HK': 75.40, '0027.HK': 42.80, '0066.HK': 125.60, '0083.HK': 10.80,
        '0101.HK': 35.40, '0175.HK': 12.60, '0233.HK': 3.80, '0267.HK': 8.90,
        '0293.HK': 9.60, '0322.HK': 2.40, '0388.HK': 295.60, '0494.HK': 22.40,
        '0688.HK': 5.80, '0700.HK': 320.60, '0857.HK': 6.80, '0883.HK': 18.40,
        '0939.HK': 5.60, '0941.HK': 3.80, '0968.HK': 3.20, '0992.HK': 8.90,
        '1038.HK': 42.60, '1044.HK': 32.80, '1088.HK': 20.40, '1093.HK': 6.80,
        '1099.HK': 8.90, '1109.HK': 8.60, '1113.HK': 105.40, '1177.HK': 4.20,
        '1211.HK': 230.60, '1288.HK': 3.40, '1299.HK': 80.60, '1398.HK': 3.60,
        '1928.HK': 35.80, '1929.HK': 18.40, '1988.HK': 7.80, '2007.HK': 3.20,
        '2313.HK': 68.40, '2318.HK': 45.60, '2319.HK': 25.80, '2331.HK': 95.40,
        '2382.HK': 165.80, '2388.HK': 6.20, '2628.HK': 3.80, '2688.HK': 8.90,
        '3690.HK': 180.60, '3968.HK': 12.60, '9988.HK': 85.40,
        '600036.SS': 6.80, '600000.SS': 8.90, '600276.SS': 45.20, '600519.SS': 1680.60,
        '600887.SS': 25.80, '600309.SS': 12.60, '600585.SS': 8.40,
        '005930.KS': 68000.50, '000660.KS': 125000.75, '207940.KS': 650000.90,
        '051910.KS': 485000.25, '005935.KS': 68000.40, '006400.KS': 320000.60,
        '035420.KS': 285000.80, '035720.KS': 85000.35, '000270.KS': 65000.90,
        '105560.KS': 58000.45
};

async function fetchStockPrice(ticker) {
    // Check user tier access - free users get demo prices, premium+ get real prices
    const hasRealPriceAccess = canAccessFeature('realTimePrices');
    const apiKey = window.GEMINI_API_KEY || localStorage.getItem('GEMINI_API_KEY') || '';

    if (!hasRealPriceAccess || !apiKey) {
        // Use demo prices with some randomization for realism
        const basePrice = demoStockPrices[ticker] || 100;
        const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
        const price = basePrice * (1 + variation);

        logTransaction(`Demo mode: Using simulated price for ${ticker}`, 'info');
        return Math.round(price * 100) / 100; // Round to 2 decimal places
    }

    // Real API call
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const payload = {
        contents: [{ parts: [{ text: `What is the current stock price of ${ticker}? Respond with only the price, like '$123.45'.` }] }],
        tools: [{ "google_search": {} }],
    };

    let response;
    let delay = 1000; // Start with 1 second
    for (let i = 0; i < 5; i++) { // Retry up to 5 times
        try {
            response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const result = await response.json();
                const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                    const priceMatch = text.match(/\$?([\d,]+\.\d+)/);
                    if (priceMatch && priceMatch[1]) {
                        return parseFloat(priceMatch[1].replace(/,/g, ''));
                    }
                }
                throw new Error("Could not parse price from API response.");
            } else if (response.status === 429) { // Throttling
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Double the delay for the next retry
            } else {
                throw new Error(`API request failed with status ${response.status}`);
            }
        } catch (error) {
            if (i === 4) { // Last retry failed
                 logTransaction(`Error fetching price for ${ticker}: ${error.message}`, 'error');
                 return null;
            }
             await new Promise(resolve => setTimeout(resolve, delay));
             delay *= 2;
        }
    }
    return null;
}

function renderSimulator() {
    simCashEl.textContent = `$${simCash.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

    let portfolioValue = 0;
    stockListEl.innerHTML = '';

    visibleStocks.forEach(ticker => {
        const stock = allStockData[ticker];
        const sharesOwned = portfolio[ticker] || 0;
         if (stock.price > 0) {
            portfolioValue += sharesOwned * stock.price;
        }

        const priceDisplay = stock.price > 0 ? `$${stock.price.toFixed(2)}` : 'Fetching...';

        stockListEl.innerHTML += `
            <div class="grid grid-cols-1 md:grid-cols-5 gap-2 items-center p-2 rounded-lg hover:bg-slate-50">
                <div class="md:col-span-2">
                    <div class="font-bold">${ticker}</div>
                    <div class="text-sm text-slate-500">${stock.name}</div>
                </div>
                <div class="font-semibold text-center">${priceDisplay}</div>
                <div class="text-center font-bold">${sharesOwned} Shares</div>
                <div class="flex gap-2 items-center">
                    <input type="number" value="1" min="1" class="w-16 p-2 border border-slate-300 rounded-md text-center" id="qty-${ticker}">
                    <div class="flex flex-col gap-1 w-full">
                        <button onclick="buyStock('${ticker}')" class="w-full bg-green-500 text-white text-xs font-bold p-1 rounded-md hover:bg-green-600 disabled:opacity-50" ${stock.price <= 0 ? 'disabled' : ''}>Buy</button>
                        <button onclick="sellStock('${ticker}')" class="w-full bg-red-500 text-white text-xs font-bold p-1 rounded-md hover:bg-red-600 ${sharesOwned > 0 && stock.price > 0 ? '' : 'opacity-50 cursor-not-allowed'}" ${sharesOwned > 0 && stock.price > 0 ? '' : 'disabled'}>Sell</button>
                    </div>
                </div>
            </div>`;
    });
    simPortfolioValueEl.textContent = `$${portfolioValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

function logTransaction(message, type = 'info') {
     const color = type === 'error' ? 'text-red-500' : 'text-slate-600';
    logEl.innerHTML = `<div class="${color}">${new Date().toLocaleTimeString()}: ${message}</div>` + logEl.innerHTML;
}

function buyStock(ticker) {
    const qty = parseInt(document.getElementById(`qty-${ticker}`).value) || 1;
    const price = allStockData[ticker].price;
    if (price <= 0) {
         logTransaction(`Cannot buy ${ticker}, price not available.`, 'error');
         return;
    }
    const cost = price * qty;

    if (simCash >= cost) {
        simCash -= cost;
        portfolio[ticker] = (portfolio[ticker] || 0) + qty;
        logTransaction(`Bought ${qty} share(s) of ${ticker} for $${cost.toFixed(2)}.`);
        renderSimulator();
    } else {
        logTransaction(`Not enough cash to buy ${qty} share(s) of ${ticker}.`, 'error');
    }
}
function sellStock(ticker) {
    const qty = parseInt(document.getElementById(`qty-${ticker}`).value) || 1;
    const sharesOwned = portfolio[ticker] || 0;

     if (qty > sharesOwned) {
        logTransaction(`You can't sell more ${ticker} shares than you own.`, 'error');
        return;
    }

    const price = allStockData[ticker].price;
     if (price <= 0) {
         logTransaction(`Cannot sell ${ticker}, price not available.`, 'error');
         return;
    }

    if (sharesOwned > 0 && qty > 0) {
        const value = price * qty;
        simCash += value;
        portfolio[ticker] -= qty;
        logTransaction(`Sold ${qty} share(s) of ${ticker} for $${value.toFixed(2)}.`);
        renderSimulator();
    }
}

async function addStockToSimulator() {
    const ticker = addStockTickerInput.value.toUpperCase().trim();
    if (!ticker) return;

    addStockBtn.disabled = true;
    addStockBtn.textContent = 'Adding...';

    if (allStockData[ticker]) {
        if (!visibleStocks.includes(ticker)) {
            visibleStocks.push(ticker);
            logTransaction(`Added ${ticker} to the simulator. Fetching price...`);
            renderSimulator(); // Render immediately to show "Fetching..."
            const price = await fetchStockPrice(ticker);
            if (price !== null) {
                allStockData[ticker].price = price;
                logTransaction(`Initial price for ${ticker} is $${price.toFixed(2)}.`);
            } else {
                 visibleStocks.pop(); // remove if fetch fails
            }
            renderSimulator();
        } else {
            logTransaction(`${ticker} is already in the simulator.`, 'error');
        }
    } else {
        logTransaction(`${ticker} is not an available stock in this simulation.`, 'error');
    }
    addStockTickerInput.value = '';
    addStockBtn.disabled = false;
    addStockBtn.textContent = 'Add';
}

addStockBtn.addEventListener('click', addStockToSimulator);
addStockTickerInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addStockToSimulator();
    }
});

async function refreshAllStockPrices() {
    // Check daily update limits for free users
    if (!canUpdateStocks()) {
        const maxUpdates = window.USER_CONFIG.features[userTier].stockUpdatesPerDay;
        showUpgradePrompt('stockUpdatesPerDay', `You've reached your daily limit of ${maxUpdates} stock updates. Upgrade to unlimited updates!`);
        return;
    }

    // Check if real-time prices are available for free users
    if (!canAccessFeature('realTimePrices')) {
        showUpgradePrompt('realTimePrices', 'Real-time stock prices are only available in Premium. Upgrade to get live market data!');
        return;
    }

    refreshBtn.disabled = true;
    refreshBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin mr-2 h-5 w-5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Refreshing...`;
    logTransaction('Refreshing all stock prices...');

    // Track daily updates
    dailyStockUpdates += visibleStocks.length;

    const pricePromises = visibleStocks.map(ticker => fetchStockPrice(ticker));
    const prices = await Promise.all(pricePromises);

    prices.forEach((price, index) => {
        const ticker = visibleStocks[index];
        if (price !== null) {
            allStockData[ticker].price = price;
        }
    });

    renderSimulator();
    logTransaction('Finished refreshing prices.');
    refreshBtn.disabled = false;
    refreshBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-5 w-5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Refresh Prices`;
}

refreshBtn.addEventListener('click', refreshAllStockPrices);

// --- Quest System Functions ---

// Initialize quest system
let questProgress = JSON.parse(localStorage.getItem('questProgress')) || window.QUEST_CONFIG.userProgress;
let availableQuests = [];
let completedQuests = questProgress.completedQuests;

// Load user quest progress from localStorage
function loadQuestProgress() {
    const saved = localStorage.getItem('questProgress');
    if (saved) {
        questProgress = { ...window.QUEST_CONFIG.userProgress, ...JSON.parse(saved) };
    } else {
        questProgress = { ...window.QUEST_CONFIG.userProgress };
    }
    // Initialize completedQuests from loaded progress
    completedQuests = questProgress.completedQuests || [];
    updateQuestDisplay();
}

// Save quest progress to localStorage
function saveQuestProgress() {
    localStorage.setItem('questProgress', JSON.stringify(questProgress));
}

// Calculate XP required for next level
function getXPForLevel(level) {
    return window.QUEST_CONFIG.xpSystem.levelXPRequirement(level);
}

// Add XP and handle leveling up
function addXP(amount, reason = '') {
    questProgress.xp += amount;
    questProgress.totalXP += amount;

    // Check for level up
    while (questProgress.xp >= questProgress.xpToNext) {
        questProgress.xp -= questProgress.xpToNext;
        questProgress.level++;
        questProgress.xpToNext = getXPForLevel(questProgress.level + 1);

        // Level up notification
        showLevelUpNotification(questProgress.level);
    }

    saveQuestProgress();
    updateQuestDisplay();
}

// Show level up notification
function showLevelUpNotification(newLevel) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-bounce';
    notification.innerHTML = `
        <div class="flex items-center space-x-3">
            <div class="text-2xl">🎉</div>
            <div>
                <div class="font-bold">Level Up!</div>
                <div class="text-sm">You reached Level ${newLevel}</div>
            </div>
        </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Complete a quest
function completeQuest(questId) {
    const quest = window.QUEST_CONFIG.quests.find(q => q.id === questId);
    if (!quest) return;

    if (!completedQuests.includes(questId)) {
        completedQuests.push(questId);
        questProgress.completedQuests = completedQuests;
        questProgress.stats.questsCompleted++;

        // Award XP
        addXP(quest.xpReward, `Completed quest: ${quest.title}`);

        // Check for achievements
        checkAchievements();

        // Show completion notification
        showQuestCompletion(quest);

        saveQuestProgress();
        updateQuestDisplay();
    }
}

// Show quest completion notification
function showQuestCompletion(quest) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-sm';
    notification.innerHTML = `
        <div class="flex items-start space-x-3">
            <div class="text-2xl">${window.QUEST_CONFIG.categories[quest.category].icon}</div>
            <div class="flex-1">
                <div class="font-bold">Quest Completed!</div>
                <div class="text-sm font-medium">${quest.title}</div>
                <div class="text-xs mt-1">+${quest.xpReward} XP</div>
            </div>
        </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Check for achievement unlocks
function checkAchievements() {
    window.QUEST_CONFIG.achievements.forEach(achievement => {
        if (!questProgress.achievements.includes(achievement.id)) {
            let unlocked = false;

            switch (achievement.requirement.questsCompleted) {
                case 1:
                    if (questProgress.stats.questsCompleted >= 1) unlocked = true;
                    break;
                case 50:
                    if (questProgress.stats.questsCompleted >= 50) unlocked = true;
                    break;
            }

            if (achievement.requirement.perfectScores && questProgress.stats.perfectScores >= achievement.requirement.perfectScores) {
                unlocked = true;
            }

            if (achievement.requirement.dailyStreak && questProgress.streaks.daily >= achievement.requirement.dailyStreak) {
                unlocked = true;
            }

            if (unlocked) {
                questProgress.achievements.push(achievement.id);
                questProgress.stats.badgesEarned++;
                showAchievementUnlock(achievement);
            }
        }
    });
}

// Show achievement unlock notification
function showAchievementUnlock(achievement) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-purple-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-sm';
    notification.innerHTML = `
        <div class="flex items-start space-x-3">
            <div class="text-3xl">${achievement.icon}</div>
            <div class="flex-1">
                <div class="font-bold">Achievement Unlocked!</div>
                <div class="text-sm font-medium">${achievement.title}</div>
                <div class="text-xs mt-1">${achievement.description}</div>
            </div>
        </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 7000);
}

// Get available quests for current user
function getAvailableQuests() {
    const userTier = window.USER_CONFIG.currentTier;
    const userFeatures = window.USER_CONFIG.features[userTier];

    const filtered = window.QUEST_CONFIG.quests.filter(quest => {
        // Check if quest is available for user's tier
        if (quest.isPremium && userTier === 'free') return false;

        // Check level requirements
        if (quest.requirements.minLevel > questProgress.level) return false;

        // Check max level limits for free users
        if (userTier === 'free' && quest.requirements.minLevel > userFeatures.maxQuestLevel) return false;

        // Check prerequisites
        if (quest.requirements.prerequisites.length > 0) {
            return quest.requirements.prerequisites.every(prereq =>
                completedQuests.includes(prereq)
            );
        }

        // Check if already completed
        return !completedQuests.includes(quest.id);
    });

    return filtered;
}

// Update quest display
function updateQuestDisplay() {
    const questSection = document.getElementById('quests');
    if (!questSection) return;

    const userTier = window.USER_CONFIG.currentTier;
    const userFeatures = window.USER_CONFIG.features[userTier];

    // Update level display
    const levelDisplay = document.getElementById('quest-level-display');
    if (levelDisplay) {
        levelDisplay.textContent = `Level ${questProgress.level}`;
    }

    // Update XP progress
    const xpProgress = document.getElementById('quest-xp-progress');
    if (xpProgress) {
        const progressPercent = (questProgress.xp / questProgress.xpToNext) * 100;
        xpProgress.style.width = `${progressPercent}%`;
    }

    // Update XP text
    const xpText = document.getElementById('quest-xp-text');
    if (xpText) {
        xpText.textContent = `${questProgress.xp} / ${questProgress.xpToNext} XP`;
    }

    // Update quest list
    const questList = document.getElementById('quest-list');
    if (questList) {
        // Get all available quests first
        if (availableQuests.length === 0) {
            availableQuests = getAvailableQuests();
        }

        // Use filtered quests if available, otherwise get all available
        const questsToShow = availableQuests.length > 0 ? availableQuests : getAvailableQuests();

        questList.innerHTML = questsToShow.slice(0, 6).map(quest => {
            const category = window.QUEST_CONFIG.categories[quest.category];
            const tier = window.QUEST_CONFIG.questTiers[quest.tier];

            return `
                <div class="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
                    <div class="flex items-start justify-between mb-2">
                        <div class="flex items-center space-x-2">
                            <span class="text-lg">${category.icon}</span>
                            <span class="font-medium text-gray-800">${quest.title}</span>
                        </div>
                        <span class="text-xs px-2 py-1 rounded-full" style="background-color: ${tier.color}; color: white;">
                            ${tier.name}
                        </span>
                    </div>
                    <p class="text-sm text-gray-600 mb-3">${quest.description}</p>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-1">
                            <span class="text-yellow-500">⭐</span>
                            <span class="text-sm font-medium">${quest.xpReward} XP</span>
                        </div>
                        <button onclick="startQuest('${quest.id}')" class="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600 transition-colors">
                            Start Quest
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        if (questsToShow.length === 0) {
            questList.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <div class="text-4xl mb-4">🎯</div>
                    <div class="font-medium mb-2">No quests available</div>
                    <div class="text-sm">Complete current quests to unlock new ones!</div>
                </div>
            `;
        }
    }

    // Update achievements display
    const achievementsList = document.getElementById('achievements-list');
    if (achievementsList) {
        const unlockedAchievements = window.QUEST_CONFIG.achievements.filter(achievement =>
            questProgress.achievements.includes(achievement.id)
        );

        achievementsList.innerHTML = unlockedAchievements.map(achievement => `
            <div class="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                <div class="flex items-center space-x-3">
                    <div class="text-3xl">${achievement.icon}</div>
                    <div>
                        <div class="font-medium text-gray-800">${achievement.title}</div>
                        <div class="text-sm text-gray-600">${achievement.description}</div>
                    </div>
                </div>
            </div>
        `).join('');

        if (unlockedAchievements.length === 0) {
            achievementsList.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <div class="text-4xl mb-4">🏆</div>
                    <div class="font-medium mb-2">No achievements yet</div>
                    <div class="text-sm">Complete quests to earn achievements!</div>
                </div>
            `;
        }
    }
}

// Start a quest
function startQuest(questId) {
    const quest = window.QUEST_CONFIG.quests.find(q => q.id === questId);
    if (!quest) return;

    // Show quest details modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center space-x-3">
                        <span class="text-3xl">${window.QUEST_CONFIG.categories[quest.category].icon}</span>
                        <div>
                            <h3 class="text-xl font-bold text-gray-800">${quest.title}</h3>
                            <p class="text-gray-600">${quest.description}</p>
                        </div>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div class="mb-6">
                    <h4 class="font-medium text-gray-800 mb-3">Quest Steps:</h4>
                    <ol class="list-decimal list-inside space-y-2">
                        ${quest.steps.map(step => `<li class="text-gray-700">${step}</li>`).join('')}
                    </ol>
                </div>

                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div class="flex items-center space-x-4">
                        <div class="text-center">
                            <div class="text-2xl text-yellow-500">⭐</div>
                            <div class="text-sm font-medium">${quest.xpReward} XP</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl">🏆</div>
                            <div class="text-sm font-medium">${quest.rewards.join(', ')}</div>
                        </div>
                    </div>
                    <button onclick="completeQuest('${quest.id}'); this.closest('.fixed').remove()" class="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors">
                        Mark Complete
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Quest filtering function
function filterQuestsByCategory(category) {
    // Update active filter button styling
    const buttons = document.querySelectorAll('[onclick*="filterQuestsByCategory"]');
    buttons.forEach(button => {
        button.className = button.className.replace('bg-blue-500 text-white', 'bg-gray-200 text-gray-800');
        button.className = button.className.replace('hover:bg-blue-600', 'hover:bg-gray-300');
    });

    // Set active button
    const activeButton = document.querySelector(`[onclick="filterQuestsByCategory('${category}')"]`);
    if (activeButton) {
        activeButton.className = activeButton.className.replace('bg-gray-200 text-gray-800 hover:bg-gray-300', 'bg-blue-500 text-white hover:bg-blue-600');
    }

    // Filter quests
    if (category === 'all') {
        availableQuests = getAvailableQuests();
    } else {
        availableQuests = getAvailableQuests().filter(quest => quest.category === category);
    }

    // Update display
    updateQuestDisplay();
}

// --- User Tier and Monetization Functions ---

// Check if user can access a feature
function canAccessFeature(feature) {
    const userFeatures = window.USER_CONFIG.features[userTier];
    return userFeatures[feature] === true;
}

// Check stock limits
function canAddStock() {
    const userFeatures = window.USER_CONFIG.features[userTier];
    return visibleStocks.length < userFeatures.maxStocks;
}

// Check daily update limits
function canUpdateStocks() {
    const userFeatures = window.USER_CONFIG.features[userTier];
    return dailyStockUpdates < userFeatures.stockUpdatesPerDay;
}

// Show upgrade prompt
function showUpgradePrompt(feature, message) {
    const upgradeModal = document.createElement('div');
    upgradeModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    upgradeModal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
            <div class="text-4xl mb-4">🚀</div>
            <h3 class="text-xl font-bold text-gray-800 mb-4">Upgrade to Premium</h3>
            <p class="text-gray-600 mb-6">${message}</p>
            <div class="space-y-3">
                <div class="bg-blue-50 p-4 rounded-lg">
                    <div class="text-lg font-bold text-blue-600">$9.99/month</div>
                    <div class="text-sm text-gray-600">or $99.99/year (17% savings)</div>
                </div>
                <div class="text-xs text-gray-500">
                    ✓ Unlimited stock updates<br>
                    ✓ 630+ global stocks<br>
                    ✓ Real-time pricing<br>
                    ✓ Advanced analytics<br>
                    ✓ Export capabilities
                </div>
            </div>
            <div class="flex space-x-3 mt-6">
                <button onclick="this.closest('.fixed').remove()" class="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">
                    Maybe Later
                </button>
                <button onclick="upgradeToPremium()" class="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    Upgrade Now
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(upgradeModal);
}

// Handle upgrade to premium
function upgradeToPremium() {
    // In a real app, this would integrate with Stripe/PayPal
    alert('Redirecting to payment processor... (This would integrate with Stripe/PayPal in production)');
    // Simulate upgrade for demo
    userTier = 'premium';
    window.USER_CONFIG.currentTier = 'premium';
    localStorage.setItem('userTier', 'premium');

    // Remove upgrade modal
    document.querySelector('.fixed').remove();

    // Refresh the interface
    initializeStockSimulator();
    updateUI();
}

// Update UI based on user tier
function updateUI() {
    const tierIndicator = document.getElementById('user-tier-indicator');
    if (tierIndicator) {
        tierIndicator.textContent = userTier.charAt(0).toUpperCase() + userTier.slice(1);
        tierIndicator.className = userTier === 'premium' ? 'text-green-600 font-bold' : 'text-gray-600';
    }

    // Update upgrade buttons visibility
    const upgradeButtons = document.querySelectorAll('.upgrade-btn');
    upgradeButtons.forEach(btn => {
        btn.style.display = userTier === 'free' ? 'inline-block' : 'none';
    });
}

// --- Stock Search and Filter Functions ---
function updateStockSuggestions(searchTerm = '') {
    const suggestionsDiv = document.getElementById('stock-suggestions');
    const sectorFilter = document.getElementById('sector-filter').value;

    if (!searchTerm.trim() && !sectorFilter) {
        suggestionsDiv.classList.add('hidden');
        return;
    }

    const stocks = window.STOCK_CONFIG.availableStocks;
    let filteredStocks = Object.keys(stocks).filter(ticker => {
        const stock = stocks[ticker];
        const matchesSearch = !searchTerm ||
            ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            // For Japanese stocks, also search by company name without legal suffixes
            (ticker.endsWith('.T') && stock.name.toLowerCase().replace(/ co., ltd.| corporation| holdings| group| inc./gi, '').includes(searchTerm.toLowerCase()));
        const matchesSector = !sectorFilter || stock.sector === sectorFilter ||
            (sectorFilter === 'Nikkei' && stock.exchange === 'Nikkei') ||
            (sectorFilter === 'Europe' && (stock.exchange === 'LSE' || stock.exchange === 'XETRA' || stock.exchange === 'Euronext' || stock.exchange === 'BME')) ||
            (sectorFilter === 'Asia' && (stock.exchange === 'HKEX' || stock.exchange === 'SSE' || stock.exchange === 'KRX' || stock.exchange === 'Nikkei'));

        // For free users, only show NYSE/NASDAQ stocks in search results (unless they specifically search for international)
        if (userTier === 'free' && !sectorFilter && stock.exchange !== 'NYSE' && stock.exchange !== 'NASDAQ') {
            return false;
        }

        return matchesSearch && matchesSector && !visibleStocks.includes(ticker);
    });

    if (filteredStocks.length === 0) {
        suggestionsDiv.classList.add('hidden');
        return;
    }

    // Limit to top 10 results for performance
    filteredStocks = filteredStocks.slice(0, 10);

    suggestionsDiv.innerHTML = filteredStocks.map(ticker => {
        const stock = stocks[ticker];
        return `
            <div class="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                 onclick="addStockFromSuggestion('${ticker}')">
                <div class="flex justify-between items-center">
                    <div>
                        <div class="font-bold text-blue-600">${ticker}</div>
                        <div class="text-sm text-slate-600">${stock.name}</div>
                        <div class="text-xs text-slate-500">${stock.sector}</div>
                    </div>
                    <button class="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                        Add
                    </button>
                </div>
            </div>
        `;
    }).join('');

    suggestionsDiv.classList.remove('hidden');
}

function addStockFromSuggestion(ticker) {
    document.getElementById('stock-search').value = '';
    document.getElementById('stock-suggestions').classList.add('hidden');
    addStockToSimulatorInternal(ticker);
}

function clearFilters() {
    document.getElementById('stock-search').value = '';
    document.getElementById('sector-filter').value = '';
    document.getElementById('stock-suggestions').classList.add('hidden');
}

function showAllStocks() {
    const stocks = window.STOCK_CONFIG.availableStocks;
    const allTickers = Object.keys(stocks).slice(0, 20); // Show first 20 to avoid overload

    allTickers.forEach(ticker => {
        if (!visibleStocks.includes(ticker)) {
            visibleStocks.push(ticker);
        }
    });

    renderSimulator();
    logTransaction(`Added ${allTickers.length} popular stocks to simulator`);
}

// Update addStockToSimulator to use internal function
async function addStockToSimulator() {
    const ticker = addStockTickerInput.value.toUpperCase().trim();
    if (!ticker) return;
    addStockToSimulatorInternal(ticker);
}

async function addStockToSimulatorInternal(ticker) {
    addStockBtn.disabled = true;
    addStockBtn.textContent = 'Adding...';

    // Check if user can add more stocks
    if (!canAddStock()) {
        const maxStocks = window.USER_CONFIG.features[userTier].maxStocks;
        showUpgradePrompt('maxStocks', `You've reached the ${maxStocks} stock limit for the ${userTier} plan. Upgrade to add unlimited stocks!`);
        addStockBtn.disabled = false;
        addStockBtn.textContent = 'Add Stock';
        return;
    }

    // Check if international stocks are allowed for free users
    const stock = window.STOCK_CONFIG.availableStocks[ticker];
    if (stock && userTier === 'free' && stock.exchange !== 'NYSE' && stock.exchange !== 'NASDAQ') {
        showUpgradePrompt('internationalStocks', 'International stocks (Japan, Europe, Asia) are only available in Premium. Upgrade to access global markets!');
        addStockBtn.disabled = false;
        addStockBtn.textContent = 'Add Stock';
        return;
    }

    if (window.STOCK_CONFIG.availableStocks[ticker]) {
        if (!visibleStocks.includes(ticker)) {
            visibleStocks.push(ticker);
            logTransaction(`Added ${ticker} to the simulator. Fetching price...`);
            renderSimulator(); // Render immediately to show "Fetching..."
            const price = await fetchStockPrice(ticker);
            if (price !== null) {
                window.STOCK_CONFIG.availableStocks[ticker].price = price;
                logTransaction(`Initial price for ${ticker} is $${price.toFixed(2)}.`);
            } else {
                visibleStocks.pop(); // remove if fetch fails
            }
            renderSimulator();
        } else {
            logTransaction(`${ticker} is already in the simulator.`, 'error');
        }
    } else {
        logTransaction(`${ticker} is not an available stock in this simulation.`, 'error');
    }
    addStockTickerInput.value = '';
    addStockBtn.disabled = false;
    addStockBtn.textContent = 'Add';
}

// Event listeners for search and filters
if (stockSearchInput) {
    stockSearchInput.addEventListener('input', (e) => {
        updateStockSuggestions(e.target.value);
    });

    stockSearchInput.addEventListener('focus', () => {
        updateStockSuggestions(stockSearchInput.value);
    });

    stockSearchInput.addEventListener('blur', () => {
        // Delay hiding to allow clicks on suggestions
        setTimeout(() => {
            document.getElementById('stock-suggestions').classList.add('hidden');
        }, 200);
    });
}

if (sectorFilter) {
    sectorFilter.addEventListener('change', () => {
        updateStockSuggestions(stockSearchInput ? stockSearchInput.value : '');
    });
}

// Click outside to close suggestions
document.addEventListener('click', (e) => {
    const suggestions = document.getElementById('stock-suggestions');
    const searchInput = document.getElementById('stock-search');
    if (suggestions && searchInput && !suggestions.contains(e.target) && e.target !== searchInput) {
        suggestions.classList.add('hidden');
    }
});

// --- Quest & Quiz Logic ---
function selectAnswer(element, questionNumber, answer) {
    userAnswers[questionNumber] = answer;
    const questionDiv = element.closest('.quiz-question');
    questionDiv.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');

    // Enable submit button when all questions are answered
    if (Object.keys(userAnswers).length === questionDiv.parentElement.querySelectorAll('.quiz-question').length) {
        document.getElementById('submit-quiz-btn').disabled = false;
    }
}

function submitQuiz(quizId) {
    const quizEl = document.getElementById(`quiz-${quizId}`);
    let score = 0;
    quizEl.querySelectorAll('.quiz-question').forEach(q => {
        const questionNumber = q.dataset.question;
        const correctAnswer = q.dataset.answer;
        const userAnswer = userAnswers[questionNumber];
        const options = q.querySelectorAll('.quiz-option');

        options.forEach(opt => {
            const optAnswer = opt.getAttribute('onclick').split("'")[3];
            opt.classList.remove('selected');
            opt.style.pointerEvents = 'none'; // Disable clicking after submission
            if (optAnswer === correctAnswer) {
                opt.classList.add('correct');
            } else if (optAnswer === userAnswer) {
                opt.classList.add('incorrect');
            }
        });

        if (userAnswer === correctAnswer) {
            score++;
        }
    });

    const totalQuestions = quizEl.querySelectorAll('.quiz-question').length;
    showQuizResult(score, totalQuestions, quizId);
}

function showQuizResult(score, total, quizId) {
    const modal = document.getElementById('quiz-modal');
    const iconEl = document.getElementById('modal-icon');
    const titleEl = document.getElementById('modal-title');
    const messageEl = document.getElementById('modal-message');
    const buttonEl = document.getElementById('modal-button');

    if (score === total) {
        iconEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
        iconEl.className = 'w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 bg-green-500';
        titleEl.textContent = 'Quest Complete!';
        messageEl.textContent = `Amazing! You scored ${score}/${total}. You've earned the "Savings Star" badge!`;
        buttonEl.textContent = 'Back to Quests';
        buttonEl.className = 'bg-green-500 text-white font-bold py-3 px-8 rounded-full text-lg';
        buttonEl.onclick = () => { completeQuest(quizId); modal.classList.add('hidden'); };
    } else {
        iconEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
        iconEl.className = 'w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 bg-yellow-500';
        titleEl.textContent = 'Almost There!';
        messageEl.textContent = `You scored ${score}/${total}. Review the answers and try again to earn your badge!`;
        buttonEl.textContent = 'Try Again';
        buttonEl.className = 'bg-yellow-500 text-white font-bold py-3 px-8 rounded-full text-lg';
        buttonEl.onclick = () => { resetQuiz(quizId); modal.classList.add('hidden'); };
    }

    modal.classList.remove('hidden');
    setTimeout(() => modal.querySelector('div > div').classList.remove('scale-95'), 10);
}

function completeQuest(questId) {
    if (questId === 'savings-101') {
        questsCompleted = 3;
        document.getElementById('quest-card-savings').innerHTML = `
            <div class="flex items-center mb-4">
                <div class="bg-teal-100 text-teal-500 p-3 rounded-full mr-4"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg></div>
                <h3 class="text-xl font-bold">Quest 3: Savings 101</h3>
            </div>
            <p class="text-slate-600 mb-4 flex-grow">It's not about how much you make, it's about how much you keep. We'll show you how.</p>
            <div class="flex justify-between items-center text-green-500 font-bold">
                <span>Completed!</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>`;

        const badge = document.getElementById('savings-star-badge');
        badge.classList.remove('bg-slate-200', 'opacity-60');
        badge.classList.add('bg-teal-100');
        badge.querySelector('svg').classList.remove('text-slate-500');
        badge.querySelector('svg').classList.add('text-teal-500');

        updateProgress();
        showSection('quests');
    }
}

function updateProgress() {
    document.getElementById('quests-completed-text').textContent = `${questsCompleted} / 5`;
    document.getElementById('progress-bar').style.width = `${(questsCompleted / 5) * 100}%`;
}

function resetQuiz(quizId) {
     const quizEl = document.getElementById(`quiz-${quizId}`);
     quizEl.querySelectorAll('.quiz-question').forEach(q => {
        q.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('selected', 'correct', 'incorrect');
            opt.style.pointerEvents = 'auto';
        });
     });
     userAnswers = {};
     document.getElementById('submit-quiz-btn').disabled = true;
}


// --- Initialize On Load ---
function initializeApp() {
    console.log('🚀 Finance U initializing...');

    // Initialize DOM element references
    mobileMenuButton = document.getElementById('mobile-menu-button');
    mobileMenu = document.getElementById('mobile-menu');
    allSections = document.querySelectorAll('.app-section');
    navLinks = document.querySelectorAll('.nav-link');

    // Stock simulator elements
    simCashEl = document.getElementById('sim-cash');
    simPortfolioValueEl = document.getElementById('sim-portfolio-value');
    stockListEl = document.getElementById('stock-market-list');
    logEl = document.getElementById('transaction-log');
    addStockTickerInput = document.getElementById('add-stock-ticker');
    addStockBtn = document.getElementById('add-stock-btn');
    refreshBtn = document.getElementById('refresh-prices-btn');
    stockSearchInput = document.getElementById('stock-search');
    sectorFilter = document.getElementById('sector-filter');
    stockSuggestions = document.getElementById('stock-suggestions');

    // Budget calculator elements
    budgetItemsContainer = document.getElementById('budget-items');
    addExpenseBtn = document.getElementById('add-expense-btn');
    totalIncomeEl = document.getElementById('total-income');
    totalExpensesEl = document.getElementById('total-expenses');
    remainingBalanceEl = document.getElementById('remaining-balance');

    // Savings calculator elements
    goalAmountInput = document.getElementById('goal-amount');
    weeklySavingInput = document.getElementById('weekly-saving');
    savingsResultEl = document.getElementById('savings-result');

    // Compound interest elements
    ciInputs = ['ci-initial', 'ci-monthly', 'ci-years', 'ci-rate'];

    // Set up mobile menu event listener
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Set up event listeners
    if (addExpenseBtn) {
        addExpenseBtn.addEventListener('click', () => {
            const expenseRow = document.createElement('div');
            expenseRow.className = 'flex gap-4 mt-2';
            expenseRow.innerHTML = `<input type="text" placeholder="Expense" class="w-2/3 p-3 border border-slate-300 rounded-lg" data-type="expense-name"><input type="number" placeholder="Amount" class="w-1/3 p-3 border border-slate-300 rounded-lg" data-type="expense-amount">`;
            if (budgetItemsContainer) budgetItemsContainer.appendChild(expenseRow);
        });
    }

    if (goalAmountInput) goalAmountInput.addEventListener('input', calculateSavings);
    if (weeklySavingInput) weeklySavingInput.addEventListener('input', calculateSavings);

    if (ciInputs) {
        ciInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.addEventListener('input', calculateCI);
        });
    }

    if (addStockBtn) addStockBtn.addEventListener('click', addStockToSimulator);
    if (addStockTickerInput) {
        addStockTickerInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                addStockToSimulator();
            }
        });
    }
    if (refreshBtn) refreshBtn.addEventListener('click', refreshAllStockPrices);

    // Search and filter event listeners
    if (stockSearchInput) {
        stockSearchInput.addEventListener('input', (e) => {
            updateStockSuggestions(e.target.value);
        });
        stockSearchInput.addEventListener('focus', () => {
            if (stockSuggestions) stockSuggestions.classList.remove('hidden');
        });
        stockSearchInput.addEventListener('blur', () => {
            setTimeout(() => {
                if (stockSuggestions) stockSuggestions.classList.add('hidden');
            }, 150);
        });
    }

    if (sectorFilter) {
        sectorFilter.addEventListener('change', () => {
            updateStockSuggestions(stockSearchInput ? stockSearchInput.value : '');
        });
    }

    // Click outside to close suggestions
    document.addEventListener('click', (e) => {
        if (stockSuggestions && !stockSuggestions.contains(e.target) && e.target !== stockSearchInput) {
            stockSuggestions.classList.add('hidden');
        }
    });

    calculateBudget();
    calculateSavings();
    calculateCI();
    renderSimulator();
    updateProgress();
    updateUI(); // Update UI based on user tier
    loadQuestProgress(); // Load quest system
    updateQuestDisplay(); // Update quest UI

    // Check API key configuration
    const apiKey = window.GEMINI_API_KEY || localStorage.getItem('GEMINI_API_KEY');
    const isDemoMode = window.DEMO_MODE || apiKey === 'YOUR_API_KEY_HERE' || !apiKey;

    if (isDemoMode) {
        logTransaction('🎮 Demo Mode: Using simulated stock prices. Get a Gemini API key for real prices!', 'info');
        // Still try to load demo prices
        setTimeout(() => {
            refreshAllStockPrices();
        }, 500);
    } else {
        logTransaction('🔗 Connected to Gemini API. Loading real stock prices...', 'info');
        refreshAllStockPrices(); // Fetch initial prices on load
    }

    console.log('✅ Finance U initialization complete!');
}

// Initialize on load
window.onload = function() {
    console.log('📱 Window loaded, starting Finance U...');
    initializeApp();
};

// Fallback initialization in case window.onload doesn't fire
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📄 DOM loaded, initializing Finance U...');
        if (!window.financeUInitialized) {
            initializeApp();
            window.financeUInitialized = true;
        }
    });
} else {
    // DOM already loaded
    console.log('📄 DOM already loaded, initializing Finance U...');
    if (!window.financeUInitialized) {
        initializeApp();
        window.financeUInitialized = true;
    }
}
