import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIncomes, fetchExpenses } from '../features/finance/financeSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { incomes, expenses, loading, error } = useSelector(state => state.finance);

  useEffect(() => {
    dispatch(fetchIncomes());
    dispatch(fetchExpenses());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const totalIncome = incomes.reduce((acc, income) => acc + parseFloat(income.amount), 0);
  const totalExpenses = expenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
  const balance = totalIncome - totalExpenses;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Income: ${totalIncome}</p>
      <p>Total Expenses: ${totalExpenses}</p>
      <p>Balance: ${balance}</p>
    </div>
  );
};

export default Dashboard;
