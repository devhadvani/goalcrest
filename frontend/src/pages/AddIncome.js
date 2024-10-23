import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addIncome, fetchCategories } from '../features/finance/financeSlice';

const AddIncome = ({ initialDate, onSuccess, onCancel }) => {
  console.log("i am here")
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceInterval, setRecurrenceInterval] = useState('');
  
  const dispatch = useDispatch();
  const { categories = [], loading } = useSelector((state) => state.finance);

  // useEffect(() => {
  //   dispatch(fetchCategories());
  // }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const incomeData = {
      amount: Number(amount),
      description,
      category,
      date: initialDate,
      is_recurring: isRecurring,
      recurrence_interval: isRecurring ? recurrenceInterval : null,
    };

    try {
      await dispatch(addIncome(incomeData)).unwrap();
      onSuccess?.();
      // Reset form
      setAmount('');
      setDescription('');
      setCategory('');
      setIsRecurring(false);
      setRecurrenceInterval('');
    } catch (error) {
      console.error('Failed to add income:', error);
    }
  };

  return (
    <div className="add-form">
      <h2>Add Income</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
            step="0.01"
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group checkbox">
          <label htmlFor="is_recurring">
            <input
              type="checkbox"
              id="is_recurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
            />
            Recurring Income
          </label>
        </div>

        {isRecurring && (
          <div className="form-group">
            <label htmlFor="recurrence_interval">Recurrence Interval</label>
            <select
              id="recurrence_interval"
              value={recurrenceInterval}
              onChange={(e) => setRecurrenceInterval(e.target.value)}
              required
            >
              <option value="">Select interval</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        )}

        <div className="button-group">
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
          <button type="submit" className="submit-button">
            Add Income
          </button>
        </div>
      </form>
      {/* Simple styling */}
      <style jsx>{`
        .add-income-container {
          padding: 20px;
          background-color: #f9f9f9;
          max-width: 500px;
          margin: auto;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .add-income-form {
          display: flex;
          flex-direction: column;
        }
        .form-group {
          margin-bottom: 15px;
        }
        label {
          margin-bottom: 5px;
          font-weight: bold;
        }
        input, select {
          padding: 10px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }
        .submit-button {
          padding: 10px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }
        .submit-button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default AddIncome;
