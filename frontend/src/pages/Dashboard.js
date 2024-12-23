import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIncomes, fetchExpenses } from '../features/finance/financeSlice';
import IncomeExpenseCalendar from '../components/IncomeExpenseCalendar';
import IncomeExpenseList from '../components/IncomeExpenseList'; // Import the new component
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { incomes, expenses, loading, error } = useSelector(state => state.finance);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    dispatch(fetchIncomes());
    dispatch(fetchExpenses());
  }, [dispatch]);

  const totalIncome = incomes.reduce((acc, income) => acc + parseFloat(income.amount), 0);
  const totalExpenses = expenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
  const balance = totalIncome - totalExpenses;

  const filteredIncomes = incomes.filter(
    income => new Date(income.date).getMonth() === selectedMonth.getMonth()
  );
  const filteredExpenses = expenses.filter(
    expense => new Date(expense.date).getMonth() === selectedMonth.getMonth()
  );

  return (
    <Box sx={{ p: 4, bgcolor: '#ffffff' }}>
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
        {/* Calendar and Income/Expense List Container */}
        <Grid container spacing={2}>
          {/* Calendar Component (70%) */}
          <Grid item xs={12} md={8}>
            <IncomeExpenseCalendar setSelectedMonth={setSelectedMonth} />
          </Grid>

          {/* Income and Expense List Component (30%) */}
          <Grid item xs={12} md={4}>
            <IncomeExpenseList
              selectedMonth={selectedMonth}
              incomeData={filteredIncomes}
              expenseData={filteredExpenses}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
