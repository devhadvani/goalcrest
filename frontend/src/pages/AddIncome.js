import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addIncome, updateIncome, fetchCategories } from '../features/finance/financeSlice';

const AddIncome = ({ initialData = null, onSubmit, onCancel }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceInterval, setRecurrenceInterval] = useState('');
  
  const dispatch = useDispatch();
  const { categories = [], loading } = useSelector((state) => state.finance);

  // Initialize form with data if provided
  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount.toString());
      setDescription(initialData.description || '');
      setCategory(initialData.category_id || initialData.category || '');
      // Format date to YYYY-MM-DD for input
      const formattedDate = new Date(initialData.date).toISOString().split('T')[0];
      setDate(formattedDate);
      setIsRecurring(initialData.is_recurring || false);
      setRecurrenceInterval(initialData.recurrence_interval || '');
    }
  }, [initialData]);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories("income"));
    }
  }, [dispatch, categories.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const incomeData = {
      amount: Number(amount),
      description,
      category,
      date,
      is_recurring: isRecurring,
      recurrence_interval: isRecurring ? recurrenceInterval : null,
    };
    try{
    if (initialData) {
      // If we're updating, include the ID
      const id = initialData.id;
      console.log("updates",incomeData);
      // await dispatch(updateIncome(incomeData,id,));
    } else {
      // If we're creating a new record
      await dispatch(addIncome(incomeData));
    }
  }
    catch (error) {
      console.error("Error occurred:", error);
  }

    // Call the onSubmit callback if provided
    if (onSubmit) {
      onSubmit(incomeData);
    }

    // Reset form if it's not an update
    if (!initialData) {
      resetForm();
    }
  };

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setCategory('');
    setDate('');
    setIsRecurring(false);
    setRecurrenceInterval('');
  };

  return (
    <div className="add-income-container">
      <h1>{initialData ? 'Update Income' : 'Add Income'}</h1>
      <form onSubmit={handleSubmit} className="add-income-form">
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
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
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group checkbox-group">
          <label htmlFor="is_recurring">
            <input
              type="checkbox"
              id="is_recurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
            />
            Recurring Income?
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
          <button type="submit" className="submit-button">
            {initialData ? 'Update Income' : 'Add Income'}
          </button>
          {initialData && (
            <button 
              type="button" 
              className="cancel-button"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

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
          gap: 15px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .checkbox-group {
          flex-direction: row;
          align-items: center;
          gap: 10px;
        }
        .checkbox-group input {
          width: auto;
          margin-right: 8px;
        }
        label {
          font-weight: 500;
          color: #333;
        }
        input, select {
          padding: 10px;
          border-radius: 5px;
          border: 1px solid #ddd;
          font-size: 14px;
        }
        input:focus, select:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
        }
        .button-group {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }
        .submit-button, .cancel-button {
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          border: none;
          flex: 1;
          transition: background-color 0.2s;
        }
        .submit-button {
          background-color: #007bff;
          color: white;
        }
        .submit-button:hover {
          background-color: #0056b3;
        }
        .cancel-button {
          background-color: #6c757d;
          color: white;
        }
        .cancel-button:hover {
          background-color: #5a6268;
        }
      `}</style>
    </div>
  );
};

export default AddIncome;