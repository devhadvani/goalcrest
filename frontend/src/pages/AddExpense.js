import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense ,fetchCategories} from '../features/finance/financeSlice';

const AddExpense = ({ initialDate, onSuccess, onCancel }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(initialDate || ''); // Initialize date with initialDate prop
  const dispatch = useDispatch();
  const { categories = [], loading } = useSelector((state) => state.finance);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const expenseData = {
      amount: Number(amount),
      category,
      date,
    };
    console.log("expense data",expenseData)
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


  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories("expense"));
    
    }
    console.log("categories length",categories);
  }, [dispatch, categories.length]);



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
        {/* <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          required
        /> */}

<div className="form-group">
  <label htmlFor="category">Category:</label>
  <select
    id="category"
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    required
  >
    <option value="">Select category</option>
    {loading ? (
      <option>Loading...</option>
    ) : (
      categories
        .filter((cat) => cat.type === "expense") // Filter only expense categories
        .map((cat) => (          
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))
    )}
  </select>
</div>


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
