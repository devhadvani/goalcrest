import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addExpense } from '../features/finance/financeSlice';

const AddExpense = ({ initialDate, onSuccess, onCancel }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(initialDate || ''); // Initialize date with initialDate prop
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const expenseData = {
      amount: Number(amount),
      category,
      date,
    };

    try {
      await dispatch(addExpense(expenseData)).unwrap();
      onSuccess?.(); // Call onSuccess if provided
      // Reset form
      setAmount('');
      setCategory('');
      setDate('');
    } catch (error) {
      console.error('Failed to add expense:', error);
    }
  };

  return (
    <div>
      <h1>Add Expense</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
          step="0.01"
          min="0"
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};

export default AddExpense;
