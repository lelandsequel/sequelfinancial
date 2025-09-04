# Finance U - Financial Education Platform

A comprehensive, gamified financial literacy platform designed to teach young people about personal finance through interactive quests, tools, and real-world examples.

## 🚀 Features

### 📚 **Learning Quests**
- **Quest 1: Money Basics** ✅ - Understanding the fundamentals of money
- **Quest 2: Art of the Budget** ✅ - Budget planning and expense tracking
- **Quest 3: Savings 101** 🟢 - Saving strategies and compound interest
- **Quest 4: Intro to Investing** 🔒 - Investment basics (upcoming)
- **Quest 5: Debt & Credit** 🔒 - Understanding debt and credit (upcoming)

### 🧪 **The Lab - Interactive Tools**
- **Budget Builder** - Create and manage personal budgets
- **Savings Goal Calculator** - Calculate time to reach savings goals
- **Compound Interest Calculator** - See the power of compound interest
- **Stock Market Simulator** - Practice investing with real-time stock data

### 🌍 **Real World Section**
- Articles connecting financial concepts to everyday life
- Practical applications and real-world scenarios

## 🎯 **Educational Goals**
- Teach fundamental financial concepts
- Build confidence in financial decision-making
- Encourage responsible money management
- Provide risk-free learning environment

## 🛠️ **Setup & Installation**

### Prerequisites
- Modern web browser
- Gemini API key (for Stock Market Simulator)

### Quick Start

1. **Clone or download the repository**
   ```bash
   git clone <repository-url>
   cd SequelFinance
   ```

2. **Set up Gemini API (Optional but Recommended)**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Open `js/config.js` and replace `'YOUR_API_KEY_HERE'` with your actual API key:
     ```javascript
     window.GEMINI_API_KEY = 'your-actual-api-key-here';
     ```

3. **Start the application**
   ```bash
   # Using Python (recommended)
   python3 -m http.server 8080

   # Or using Node.js
   npx http-server -p 8080

   # Or using PHP
   php -S localhost:8080
   ```

4. **Open in browser**
   - Navigate to `http://localhost:8080`
   - The application will load automatically

## 🔧 **Configuration**

### API Keys
- **Gemini API Key**: Required for the Stock Market Simulator
- The app will work without it, but the stock simulator will show a message to configure the API key

### Environment Settings
All configuration is handled in `js/config.js`:
- API keys and endpoints
- Default calculator values
- Available stock symbols
- Application settings

## 📱 **Usage**

### Navigation
- **Dashboard**: Overview of progress and badges
- **Quests**: Interactive learning modules
- **The Lab**: Financial calculators and simulators
- **Real World**: Practical articles and examples

### Stock Market Simulator
1. Add a stock ticker (e.g., GOOGL, AAPL, TSLA)
2. Click "Add" to include it in your portfolio
3. Use "Buy" and "Sell" buttons to trade
4. Click "Refresh Prices" to update stock data
5. View transaction history in the log

### Budget Builder
1. Add income sources and amounts
2. Add expenses with descriptions
3. Click "Add another expense" for more entries
4. View total income, expenses, and remaining balance

### Calculators
- **Savings Goal**: Enter target amount and weekly savings to see timeline
- **Compound Interest**: Input initial deposit, monthly contributions, years, and interest rate

## 🎮 **Gamification Features**

- **Progress Tracking**: Visual progress bar and completion status
- **Badge System**: Earn badges for completing quests
- **Interactive Quizzes**: Test knowledge with immediate feedback
- **Achievement Unlocking**: New content unlocks as you progress

## 🌐 **Deployment**

### Quick Deploy (Recommended)
Run the deployment script for guided deployment:
```bash
./deploy.sh
```

### Manual Deployment Options

#### GitHub Pages (Free, with CI/CD)
1. Push your code to GitHub
2. Go to repository Settings > Pages
3. Select "main" branch as source
4. **Automatic deployment** is configured via `.github/workflows/deploy.yml`
5. Access your site at `https://username.github.io/repository-name`

#### Netlify (Free, easiest)
1. Sign up at [Netlify](https://netlify.com)
2. Drag and drop the project folder or connect your GitHub repo
3. Site deploys automatically with `netlify.toml` configuration
4. Get a custom URL like `https://finance-u.netlify.app`

#### Vercel (Free, fastest)
1. Sign up at [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Deploy automatically
4. Get a custom domain

### Local Development
```bash
# Option 1: Python (recommended)
python3 -m http.server 8080

# Option 2: Node.js
npm install -g http-server
http-server -p 8080

# Option 3: PHP
php -S localhost:8080
```

Then visit `http://localhost:8080`

### Configuration for Production
- Update `js/config.js` with your Gemini API key
- Modify `window.GEMINI_API_KEY = 'YOUR_API_KEY_HERE'`
- For security, consider using environment variables on your hosting platform

## 🔒 **Security & Privacy**

- No user data is collected or stored
- All calculations happen locally in the browser
- Gemini API calls are made directly from the user's browser
- Educational content only - not financial advice

## 📖 **Educational Content**

The platform covers essential financial concepts:
- **Money Basics**: What money is and how it works
- **Budgeting**: Income vs expenses, saving strategies
- **Compound Interest**: The power of time and consistency
- **Investing**: Risk, returns, and portfolio diversification
- **Debt Management**: Good vs bad debt, credit scores

## 🤝 **Contributing**

This is an educational project. Contributions welcome:
- Additional financial calculators
- More interactive quests
- Enhanced UI/UX improvements
- Educational content expansion

## 📄 **License**

This project is for educational purposes only and is not intended as financial advice.

## 🙏 **Credits**

- Inspired by the University of Houston's financial education initiatives
- Built with modern web technologies: HTML5, CSS3, JavaScript ES6+
- Powered by Google Gemini AI for stock market data
- Styled with Tailwind CSS

## 📞 **Support**

For questions or feedback:
- Create an issue in the repository
- Contact the project maintainers

---

**Disclaimer**: This application is for educational purposes only. It is not financial advice, and users should consult with qualified financial professionals for personal financial decisions.
