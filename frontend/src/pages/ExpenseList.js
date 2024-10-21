import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses } from '../features/finance/financeSlice';

const ExpenseList = () => {
  const dispatch = useDispatch();
  const { expenses, loading, error } = useSelector(state => state.finance);

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Expense List</h1>
      <ul>
        {expenses.map(expense => (
          <li key={expense.id}>{expense.amount} - {expense.category}</li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;
