import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addIncome } from '../features/finance/financeSlice';

const AddIncome = () => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addIncome({ amount, category, date }));
  };

  return (
    <div>
      <h1>Add Income</h1>
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
        <button type="submit">Add Income</button>
      </form>
    </div>
  );
};

export default AddIncome;
