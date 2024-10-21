import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addExpense } from '../features/finance/financeSlice';

const AddExpense = () => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const op = dispatch(addExpense({ amount, category, date }));
    console.log(op)
  };

  return (
    <div>
      <h1>Add Expense</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
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
