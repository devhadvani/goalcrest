import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIncomes, fetchExpenses } from '../features/finance/financeSlice';
import IncomeExpenseCalendar from '../components/IncomeExpenseCalendar';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { incomes, expenses, loading, error } = useSelector(state => state.finance);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    dispatch(fetchIncomes());
    dispatch(fetchExpenses());
  }, [dispatch]);

  const totalIncome = incomes.reduce((acc, income) => acc + parseFloat(income.amount), 0);
  const totalExpenses = expenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
  const balance = totalIncome - totalExpenses;

  return (
    <Box sx={{ p: 4, bgcolor: '#fffff' }}>
      {/* <Typography variant="h4" align="center" gutterBottom>
        Dashboard
      </Typography> */}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">Error: {error}</Typography>
      ) : (
        <>
          {/* Income, Expenses, Balance Summary */}
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: '#e3f2fd', boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6">Total Income</Typography>
                  <Typography variant="h5" color="primary">Rs. {totalIncome}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: '#fce4ec', boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6">Total Expenses</Typography>
                  <Typography variant="h5" color="secondary">Rs. {totalExpenses}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: '#e8f5e9', boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6">Balance</Typography>
                  <Typography variant="h5" color="success.main">Rs. {balance}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      <Box sx={{ mt: 6 }}>
        {/* Calendar and Placeholder Container */}
        <Grid container spacing={2}>
          {/* Calendar Component (70%) */}
          <Grid item xs={12} md={8}>
            <IncomeExpenseCalendar setSelectedMonth={setSelectedMonth} />
          </Grid>

          {/* Placeholder Component (30%) */}
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" align="center" color="textSecondary">
                   Coming Soon
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
