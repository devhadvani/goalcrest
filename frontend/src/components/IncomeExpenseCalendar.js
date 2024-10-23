import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIncomes, fetchExpenses, addIncome, addExpense } from '../features/finance/financeSlice';

const IncomeExpenseCalendar = () => {
  const dispatch = useDispatch();
  const { incomes, expenses } = useSelector((state) => state.finance);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [isAddingIncome, setIsAddingIncome] = useState(false);

  useEffect(() => {
    dispatch(fetchIncomes());
    dispatch(fetchExpenses());
  }, [dispatch]);

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setShowModal(true); // Open modal to add income/expense
  };

  const checkIfIncome = (date) => {
    return incomes.some((income) => new Date(income.date).toDateString() === date.toDateString());
  };

  const checkIfExpense = (date) => {
    return expenses.some((expense) => new Date(expense.date).toDateString() === date.toDateString());
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      if (checkIfIncome(date)) {
        return <div className="dot green-dot"></div>;
      }
      if (checkIfExpense(date)) {
        return <div className="dot red-dot"></div>;
      }
    }
  };

  const handleAddIncome = (amount, category) => {
    dispatch(addIncome({ date: selectedDate, amount, category }));
    setShowModal(false);
  };

  const handleAddExpense = (amount, category) => {
    dispatch(addExpense({ date: selectedDate, amount, category }));
    setShowModal(false);
  };

  return (
    <div>
      <h1>Income & Expense Calendar</h1>
      <Calendar
        onClickDay={handleDayClick}
        tileContent={tileContent}
      />

      {/* Modal for adding income/expense */}
      {showModal && (
        <div className="modal">
          <h2>Add Record for {selectedDate.toDateString()}</h2>
          <button onClick={() => setIsAddingIncome(true)}>Add Income</button>
          <button onClick={() => setIsAddingIncome(false)}>Add Expense</button>

          {isAddingIncome ? (
            <form onSubmit={(e) => { e.preventDefault(); handleAddIncome(e.target.amount.value, e.target.category.value); }}>
              <input type="number" name="amount" placeholder="Amount" required />
              <input type="text" name="category" placeholder="Category" required />
              <button type="submit">Submit Income</button>
            </form>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleAddExpense(e.target.amount.value, e.target.category.value); }}>
              <input type="number" name="amount" placeholder="Amount" required />
              <input type="text" name="category" placeholder="Category" required />
              <button type="submit">Submit Expense</button>
            </form>
          )}

          <button onClick={() => setShowModal(false)}>Close</button>
        </div>
      )}

      <style>{`
        .green-dot { background-color: green; border-radius: 50%; height: 10px; width: 10px; }
        .red-dot { background-color: red; border-radius: 50%; height: 10px; width: 10px; }
        .modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; padding: 20px; }
      `}</style>
    </div>
  );
};

export default IncomeExpenseCalendar;
