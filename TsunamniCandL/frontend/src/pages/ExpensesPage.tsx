import React from 'react';
import { Typography, Box } from '@mui/material';

export const ExpensesPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Expenses Management
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Expenses functionality will be implemented here.
      </Typography>
    </Box>
  );
};
