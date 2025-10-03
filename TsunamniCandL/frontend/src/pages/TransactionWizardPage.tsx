import React, { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';

import {
  transactionApi,
  chartOfAccountsApi,
} from '../services/api';
import type {
  CreateTransactionForm,
  CreateJournalEntryForm,
  ChartOfAccounts,
} from '../types/api';
import {
  TransactionType,
  AccountType,
} from '../types/api';
import { useNavigate } from 'react-router-dom';

const steps = ['Transaction Details', 'Journal Entries', 'Review & Submit'];

const transactionSchema = z.object({
  type: z.nativeEnum(TransactionType),
  description: z.string().min(1, 'Description is required'),
  amount: z.string().min(1, 'Amount is required'),
  date: z.string().min(1, 'Date is required'),
  reference: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export const TransactionWizardPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [journalEntries, setJournalEntries] = useState<CreateJournalEntryForm[]>([]);
  const [showAddEntryDialog, setShowAddEntryDialog] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { control, handleSubmit, watch, formState: { errors } } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: TransactionType.SALES,
      description: '',
      amount: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      reference: '',
    },
  });

  // Fetch chart of accounts for journal entry selection
  const { data: accountsData } = useQuery({
    queryKey: ['chart-of-accounts'],
    queryFn: () => chartOfAccountsApi.getAll(1, 100),
  });

  const accounts = accountsData?.data?.data?.data || [];

  // Mutation for creating transaction
  const createTransactionMutation = useMutation({
    mutationFn: (data: CreateTransactionForm) => transactionApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounting-equation'] });
      navigate('/transactions');
    },
  });

  // Validate journal entries
  const validateEntries = async () => {
    if (journalEntries.length === 0) return { isValid: false, message: 'At least one journal entry is required' };

    try {
      const result = await transactionApi.validate(journalEntries);
      return result.data?.data;
    } catch (error) {
      return { isValid: false, message: 'Validation failed' };
    }
  };

  const handleNext = async () => {
    if (activeStep === 1) {
      const validation = await validateEntries();
      if (!validation?.isValid) {
        return; // Stay on current step
      }
    }

    if (activeStep === steps.length - 1) {
      // Submit the transaction
      const formData = watch();
      const transactionData: CreateTransactionForm = {
        type: formData.type,
        description: formData.description,
        amount: formData.amount,
        date: formData.date,
        reference: formData.reference,
        journalEntries,
      };

      createTransactionMutation.mutate(transactionData);
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleAddJournalEntry = (entry: CreateJournalEntryForm) => {
    setJournalEntries([...journalEntries, entry]);
    setShowAddEntryDialog(false);
  };

  const handleRemoveJournalEntry = (index: number) => {
    setJournalEntries(journalEntries.filter((_, i) => i !== index));
  };

  const getTotalDebits = () => {
    return journalEntries.reduce((sum, entry) => sum + (parseFloat(entry.debit || '0') || 0), 0);
  };

  const getTotalCredits = () => {
    return journalEntries.reduce((sum, entry) => sum + (parseFloat(entry.credit || '0') || 0), 0);
  };

  const isBalanced = getTotalDebits() === getTotalCredits();

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Enter Transaction Details
            </Typography>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Transaction Type</InputLabel>
                      <Select {...field} label="Transaction Type">
                        {Object.values(TransactionType).map((type) => (
                          <MenuItem key={type} value={type}>
                            {type.replace('_', ' ')}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Transaction Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.date}
                      helperText={errors.date?.message}
                    />
                  )}
                />
              </Grid>
              <Grid xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Description"
                      multiline
                      rows={3}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  )}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Transaction Amount"
                      type="number"
                      error={!!errors.amount}
                      helperText={errors.amount?.message}
                    />
                  )}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <Controller
                  name="reference"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Reference (Optional)"
                      placeholder="Invoice #, Check #, etc."
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Journal Entries (Double-Entry Bookkeeping)
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowAddEntryDialog(true)}
              >
                Add Entry
              </Button>
            </Box>

            <Alert severity="info" sx={{ mb: 2 }}>
              Remember: Total Debits must equal Total Credits for the transaction to balance.
            </Alert>

            {journalEntries.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Account</TableCell>
                      <TableCell align="right">Debit</TableCell>
                      <TableCell align="right">Credit</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {journalEntries.map((entry, index) => {
                      const account = accounts.find(acc => acc.id === entry.accountId);
                      return (
                        <TableRow key={index}>
                          <TableCell>{account?.name || 'Unknown Account'}</TableCell>
                          <TableCell align="right">
                            {entry.debit ? `$${parseFloat(entry.debit).toLocaleString()}` : '-'}
                          </TableCell>
                          <TableCell align="right">
                            {entry.credit ? `$${parseFloat(entry.credit).toLocaleString()}` : '-'}
                          </TableCell>
                          <TableCell>{entry.description || '-'}</TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveJournalEntry(index)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow sx={{ backgroundColor: 'grey.100' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>TOTALS</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        ${getTotalDebits().toLocaleString()}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        ${getTotalCredits().toLocaleString()}
                      </TableCell>
                      <TableCell colSpan={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {isBalanced ? (
                            <>
                              <CheckCircleIcon color="success" />
                              <Typography variant="body2" color="success.main">
                                Balanced
                              </Typography>
                            </>
                          ) : (
                            <>
                              <ErrorIcon color="error" />
                              <Typography variant="body2" color="error.main">
                                Not Balanced
                              </Typography>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography color="text.secondary">
                No journal entries added yet. Click "Add Entry" to begin.
              </Typography>
            )}

            <JournalEntryDialog
              open={showAddEntryDialog}
              onClose={() => setShowAddEntryDialog(false)}
              onAdd={handleAddJournalEntry}
              accounts={accounts}
            />
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Review Transaction
            </Typography>

            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Transaction Details
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Type</Typography>
                      <Typography>{watch('type').replace('_', ' ')}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Date</Typography>
                      <Typography>{watch('date')}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Amount</Typography>
                      <Typography>${parseFloat(watch('amount') || '0').toLocaleString()}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Description</Typography>
                      <Typography>{watch('description')}</Typography>
                    </Box>
                    {watch('reference') && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">Reference</Typography>
                        <Typography>{watch('reference')}</Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Journal Entries Summary
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Total Entries</Typography>
                      <Typography>{journalEntries.length}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Total Debits</Typography>
                      <Typography>${getTotalDebits().toLocaleString()}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Total Credits</Typography>
                      <Typography>${getTotalCredits().toLocaleString()}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Status</Typography>
                      <Chip
                        label={isBalanced ? 'Balanced' : 'Not Balanced'}
                        color={isBalanced ? 'success' : 'error'}
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {!isBalanced && (
              <Alert severity="error" sx={{ mt: 2 }}>
                This transaction is not balanced and cannot be submitted. Please adjust the journal entries.
              </Alert>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        New Transaction Wizard
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card>
        <CardContent>
          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, mt: 4 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button
              variant="contained"
              onClick={handleSubmit(handleNext)}
              disabled={createTransactionMutation.isPending}
            >
              {activeStep === steps.length - 1 ? 'Submit Transaction' : 'Next'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

// Journal Entry Dialog Component
interface JournalEntryDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (entry: CreateJournalEntryForm) => void;
  accounts: ChartOfAccounts[];
}

const JournalEntryDialog: React.FC<JournalEntryDialogProps> = ({
  open,
  onClose,
  onAdd,
  accounts,
}) => {
  const [accountId, setAccountId] = useState('');
  const [debit, setDebit] = useState('');
  const [credit, setCredit] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!accountId || (!debit && !credit)) return;

    onAdd({
      accountId,
      debit: debit || undefined,
      credit: credit || undefined,
      description: description || undefined,
    });

    // Reset form
    setAccountId('');
    setDebit('');
    setCredit('');
    setDescription('');
  };

  const handleDebitChange = (value: string) => {
    setDebit(value);
    if (value) setCredit(''); // Can't have both debit and credit
  };

  const handleCreditChange = (value: string) => {
    setCredit(value);
    if (value) setDebit(''); // Can't have both debit and credit
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Journal Entry</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid xs={12}>
            <FormControl fullWidth>
              <InputLabel>Account</InputLabel>
              <Select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                label="Account"
              >
                {accounts.map((account) => (
                  <MenuItem key={account.id} value={account.id}>
                    {account.accountNumber} - {account.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={6}>
            <TextField
              fullWidth
              label="Debit Amount"
              type="number"
              value={debit}
              onChange={(e) => handleDebitChange(e.target.value)}
              disabled={!!credit}
            />
          </Grid>
          <Grid xs={6}>
            <TextField
              fullWidth
              label="Credit Amount"
              type="number"
              value={credit}
              onChange={(e) => handleCreditChange(e.target.value)}
              disabled={!!debit}
            />
          </Grid>
          <Grid xs={12}>
            <TextField
              fullWidth
              label="Description (Optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!accountId || (!debit && !credit)}
        >
          Add Entry
        </Button>
      </DialogActions>
    </Dialog>
  );
};
