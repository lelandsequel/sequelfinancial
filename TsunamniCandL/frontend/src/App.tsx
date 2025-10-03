import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Layout components
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { AssetsPage } from './pages/AssetsPage';
import { LiabilitiesPage } from './pages/LiabilitiesPage';
import { EquityPage } from './pages/EquityPage';
import { RevenuePage } from './pages/RevenuePage';
import { ExpensesPage } from './pages/ExpensesPage';
import { ChartOfAccountsPage } from './pages/ChartOfAccountsPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { TransactionWizardPage } from './pages/TransactionWizardPage';

// Create theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          <Router>
            <AppLayout>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/assets" element={<AssetsPage />} />
                <Route path="/liabilities" element={<LiabilitiesPage />} />
                <Route path="/equity" element={<EquityPage />} />
                <Route path="/revenue" element={<RevenuePage />} />
                <Route path="/expenses" element={<ExpensesPage />} />
                <Route path="/chart-of-accounts" element={<ChartOfAccountsPage />} />
                <Route path="/transactions" element={<TransactionsPage />} />
                <Route path="/transactions/new" element={<TransactionWizardPage />} />
              </Routes>
            </AppLayout>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;