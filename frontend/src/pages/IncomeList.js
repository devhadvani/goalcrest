import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIncomes } from '../features/finance/financeSlice';

const IncomeList = () => {
  const dispatch = useDispatch();
  const { incomes, loading, error } = useSelector(state => state.finance);

  useEffect(() => {
    dispatch(fetchIncomes());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Income List</h1>
      <ul>
        {incomes.map(income => (
          <li key={income.id}>{income.amount} - {income.category}</li>
        ))}
      </ul>
    </div>
  );
};

export default IncomeList;
