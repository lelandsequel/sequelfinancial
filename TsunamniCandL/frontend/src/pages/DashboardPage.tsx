import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Equalizer as EqualizerIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import { equityApi, assetApi, liabilityApi, transactionApi } from '../services/api';
import type { AccountingEquation } from '../types/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const DashboardPage: React.FC = () => {
  // Fetch accounting equation
  const { data: equationData, isLoading: equationLoading } = useQuery({
    queryKey: ['accounting-equation'],
    queryFn: () => equityApi.getEquation(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch recent assets
  const { data: assetsData } = useQuery({
    queryKey: ['assets-dashboard'],
    queryFn: () => assetApi.getAll(1, 5, true),
  });

  // Fetch recent liabilities
  const { data: liabilitiesData } = useQuery({
    queryKey: ['liabilities-dashboard'],
    queryFn: () => liabilityApi.getAll(1, 5, true),
  });

  // Fetch recent transactions
  const { data: transactionsData } = useQuery({
    queryKey: ['transactions-dashboard'],
    queryFn: () => transactionApi.getAll(1, 10),
  });

  const equation = equationData?.data?.data;
  const assets = assetsData?.data?.data?.data || [];
  const liabilities = liabilitiesData?.data?.data?.data || [];
  const transactions = transactionsData?.data?.data?.data || [];

  // Calculate financial ratios
  const calculateRatios = (equation: AccountingEquation | undefined) => {
    if (!equation) return null;

    const totalAssets = parseFloat(equation.totalAssets || '0');
    const totalLiabilities = parseFloat(equation.totalLiabilities || '0');
    const totalEquity = parseFloat(equation.totalEquity || '0');

    return {
      currentRatio: totalAssets > 0 ? (totalAssets / totalLiabilities).toFixed(2) : '0.00',
      debtToEquityRatio: totalEquity > 0 ? (totalLiabilities / totalEquity).toFixed(2) : '0.00',
      equityRatio: totalAssets > 0 ? ((totalEquity / totalAssets) * 100).toFixed(1) : '0.0',
    };
  };

  const ratios = calculateRatios(equation);

  // Mock cash flow data (in a real app, this would come from the API)
  const cashFlowData = [
    { month: 'Jan', inflow: 50000, outflow: 35000 },
    { month: 'Feb', inflow: 55000, outflow: 40000 },
    { month: 'Mar', inflow: 60000, outflow: 38000 },
    { month: 'Apr', inflow: 58000, outflow: 42000 },
    { month: 'May', inflow: 65000, outflow: 39000 },
    { month: 'Jun', inflow: 62000, outflow: 41000 },
  ];

  // Asset distribution data for pie chart
  const assetDistribution = assets.slice(0, 5).map(asset => ({
    name: asset.name,
    value: parseFloat(asset.currentValue),
  }));

  if (equationLoading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Accounting Dashboard
      </Typography>

      {/* Accounting Equation Display */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountBalanceIcon />
            Accounting Equation
          </Typography>

          {equation ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                    ${parseFloat(equation.totalAssets).toLocaleString()}
                  </Typography>
                  <Typography variant="h6">Assets</Typography>
                </Box>

                <Typography variant="h2" sx={{ color: equation.isBalanced ? '#4caf50' : '#f44336' }}>
                  {equation.isBalanced ? '=' : '≠'}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4">
                      ${parseFloat(equation.totalLiabilities).toLocaleString()}
                    </Typography>
                    <Typography variant="body1">Liabilities</Typography>
                  </Box>

                  <Typography variant="h4">+</Typography>

                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4">
                      ${parseFloat(equation.totalEquity).toLocaleString()}
                    </Typography>
                    <Typography variant="body1">Equity</Typography>
                  </Box>
                </Box>
              </Box>

              {equation.isBalanced ? (
                <Alert severity="success" sx={{ mt: 2, color: 'white', backgroundColor: 'rgba(76, 175, 80, 0.2)' }}>
                  ✓ Accounting equation is balanced
                </Alert>
              ) : (
                <Alert severity="error" sx={{ mt: 2, color: 'white', backgroundColor: 'rgba(244, 67, 54, 0.2)' }}>
                  ⚠ Accounting equation is not balanced - requires attention
                </Alert>
              )}
            </Box>
          ) : (
            <Typography>Loading accounting equation...</Typography>
          )}
        </CardContent>
      </Card>

      {/* Financial Ratios */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon />
                Current Ratio
              </Typography>
              <Typography variant="h3" color="primary">
                {ratios?.currentRatio || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Assets ÷ Liabilities
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssessmentIcon />
                Debt-to-Equity
              </Typography>
              <Typography variant="h3" color="secondary">
                {ratios?.debtToEquityRatio || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Liabilities ÷ Equity
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EqualizerIcon />
                Equity Ratio
              </Typography>
              <Typography variant="h3" color="success.main">
                {ratios?.equityRatio || 'N/A'}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Equity ÷ Total Assets
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cash Flow Trend
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
                    <Line type="monotone" dataKey="inflow" stroke="#4caf50" strokeWidth={2} name="Cash Inflow" />
                    <Line type="monotone" dataKey="outflow" stroke="#f44336" strokeWidth={2} name="Cash Outflow" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Asset Distribution
              </Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {assetDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={assetDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {assetDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography color="text.secondary">No asset data available</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Assets
              </Typography>
              {assets.length > 0 ? (
                assets.map((asset) => (
                  <Box key={asset.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{asset.name}</Typography>
                    <Chip
                      label={`$${parseFloat(asset.currentValue).toLocaleString()}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                ))
              ) : (
                <Typography color="text.secondary">No assets found</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Liabilities
              </Typography>
              {liabilities.length > 0 ? (
                liabilities.map((liability) => (
                  <Box key={liability.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{liability.name}</Typography>
                    <Chip
                      label={`$${parseFloat(liability.amountOwed).toLocaleString()}`}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </Box>
                ))
              ) : (
                <Typography color="text.secondary">No liabilities found</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
