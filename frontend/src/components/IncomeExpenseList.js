import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Box, Divider } from '@mui/material';

const IncomeExpenseList = ({ selectedDate }) => {
  const { incomes, expenses } = useSelector((state) => state.finance);
  
  // Filter transactions for selected month
  const monthlyTransactions = useMemo(() => {
    if (!selectedDate || !incomes || !expenses) return { monthlyIncomes: [], monthlyExpenses: [] };
    
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();
    
    const monthlyIncomes = incomes.filter(income => {
      const incomeDate = new Date(income.date);
      return incomeDate.getMonth() === selectedMonth && 
             incomeDate.getFullYear() === selectedYear;
    });

    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === selectedMonth && 
             expenseDate.getFullYear() === selectedYear;
    });

    return { monthlyIncomes, monthlyExpenses };
  }, [selectedDate, incomes, expenses]);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const { monthlyIncomes, monthlyExpenses } = monthlyTransactions;
  
  const totals = useMemo(() => {
    const incomeTotal = monthlyIncomes.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const expenseTotal = monthlyExpenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
    return {
      incomeTotal,
      expenseTotal,
      balance: incomeTotal - expenseTotal
    };
  }, [monthlyIncomes, monthlyExpenses]);

  return (
    <Card className="h-full bg-white shadow-lg">
      <CardContent>
        <Typography variant="h6" className="text-gray-700 text-center mb-4">
          Transactions for {selectedDate?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Typography>

        <Box className="mb-4 p-4 bg-gray-50 rounded-lg">
          <Typography className="text-sm font-medium mb-2">Monthly Summary</Typography>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Typography className="text-xs text-gray-500">Income</Typography>
              <Typography className="text-green-600 font-medium">
                {formatAmount(totals.incomeTotal)}
              </Typography>
            </div>
            <div>
              <Typography className="text-xs text-gray-500">Expense</Typography>
              <Typography className="text-red-600 font-medium">
                {formatAmount(totals.expenseTotal)}
              </Typography>
            </div>
            <div>
              <Typography className="text-xs text-gray-500">Balance</Typography>
              <Typography className={`font-medium ${totals.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatAmount(totals.balance)}
              </Typography>
            </div>
          </div>
        </Box>

        <Divider className="mb-4" />

        <div className="space-y-4">
          {monthlyIncomes.length > 0 && (
            <div>
              <Typography className="text-sm font-medium mb-2">Income</Typography>
              <List className="space-y-2">
                {monthlyIncomes.map((income) => (
                  <ListItem key={income.id} className="bg-green-50 rounded-lg">
                    <ListItemText
                      primary={
                        <div className="flex justify-between">
                          <span>{income.description || 'Income'}</span>
                          <span className="text-green-600 font-medium">
                            {formatAmount(income.amount)}
                          </span>
                        </div>
                      }
                      secondary={
                        <div className="flex justify-between text-xs">
                          <span>{income.category_name || 'Uncategorized'}</span>
                          <span>{new Date(income.date).toLocaleDateString()}</span>
                        </div>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </div>
          )}

          {monthlyExpenses.length > 0 && (
            <div>
              <Typography className="text-sm font-medium mb-2">Expenses</Typography>
              <List className="space-y-2">
                {monthlyExpenses.map((expense) => (
                  <ListItem key={expense.id} className="bg-red-50 rounded-lg">
                    <ListItemText
                      primary={
                        <div className="flex justify-between">
                          <span>{expense.description || 'Expense'}</span>
                          <span className="text-red-600 font-medium">
                            {formatAmount(expense.amount)}
                          </span>
                        </div>
                      }
                      secondary={
                        <div className="flex justify-between text-xs">
                          <span>{expense.category_name || 'Uncategorized'}</span>
                          <span>{new Date(expense.date).toLocaleDateString()}</span>
                        </div>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </div>
          )}

          {(!monthlyIncomes.length && !monthlyExpenses.length) && (
            <Typography className="text-center text-gray-500">
              No transactions found for this month
            </Typography>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeExpenseList;