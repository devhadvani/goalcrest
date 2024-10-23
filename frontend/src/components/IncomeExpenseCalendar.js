import React, { useState, useEffect, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchIncomes, 
  fetchExpenses, 
  fetchIncomesByDate, 
  fetchExpensesByDate 
} from '../features/finance/financeSlice';
import AddIncome from '../pages/AddIncome';
import AddExpense from '../pages/AddExpense';

const IncomeExpenseCalendar = () => {
  const dispatch = useDispatch();
  const { 
    incomes, 
    expenses,
    selectedDateIncomes = [],
    selectedDateExpenses = [],
    loading 
  } = useSelector((state) => state.finance);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [isAddingIncome, setIsAddingIncome] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch all incomes and expenses on mount
  useEffect(() => {
    dispatch(fetchIncomes());
    dispatch(fetchExpenses());
  }, [dispatch]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Memoized date maps for better performance
  const incomeDates = useMemo(() => {
    return new Set(incomes.map(income => new Date(income.date).toDateString()));
  }, [incomes]);

  const expenseDates = useMemo(() => {
    return new Set(expenses.map(expense => new Date(expense.date).toDateString()));
  }, [expenses]);

  const handleDayClick = async (date) => {
    setSelectedDate(date);
    setShowModal(true);
    
    const formattedDate = formatDate(date);
    await Promise.all([
      dispatch(fetchIncomesByDate(formattedDate)),
      dispatch(fetchExpensesByDate(formattedDate))
    ]);
  };

  const checkIfIncome = (date) => {
    return incomeDates.has(date.toDateString());
  };

  const checkIfExpense = (date) => {
    return expenseDates.has(date.toDateString());
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const hasIncome = checkIfIncome(date);
      const hasExpense = checkIfExpense(date);
      
      return (
        <div className="dot-container">
          {hasIncome && <div className="dot green-dot" />}
          {hasExpense && <div className="dot red-dot" />}
        </div>
      );
    }
  };

  return (
    <div className="calendar-container">
      <h1>Income & Expense Calendar</h1>
      <Calendar
        onClickDay={handleDayClick}
        tileContent={tileContent}
        value={selectedDate}
      />

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Records for {selectedDate.toDateString()}</h2>
            
            {loading ? (
              <div className="loading">Loading records...</div>
            ) : (
              <>
                <div className="records-section">
                  <h3>Incomes</h3>
                  {selectedDateIncomes.length > 0 ? (
                    <ul className="records-list">
                      {selectedDateIncomes.map((income) => (
                        <li key={income.id} className="record-item">
                          <span className="amount">${Number(income.amount).toFixed(2)}</span>
                          <span className="category">{income.category}</span>
                          {income.description && (
                            <span className="description">{income.description}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No incomes for this date</p>
                  )}
                </div>

                <div className="records-section">
                  <h3>Expenses</h3>
                  {selectedDateExpenses.length > 0 ? (
                    <ul className="records-list">
                      {selectedDateExpenses.map((expense) => (
                        <li key={expense.id} className="record-item">
                          <span className="amount">-${Number(expense.amount).toFixed(2)}</span>
                          <span className="category">{expense.category}</span>
                          {expense.description && (
                            <span className="description">{expense.description}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No expenses for this date</p>
                  )}
                </div>

                <div className="actions">
                  {!showAddForm ? (
                    <div className="button-group">
                      <button 
                        onClick={() => {
                          setIsAddingIncome(true);
                          setShowAddForm(true);
                        }}
                        className="action-button income"
                      >
                        Add Income
                      </button>
                      <button 
                        onClick={() => {
                          setIsAddingIncome(false);
                          setShowAddForm(true);
                        }}
                        className="action-button expense"
                      >
                        Add Expense
                      </button>
                    </div>
                  ) : (
                    <div className="add-form-container">
                      {isAddingIncome ? (
                        <AddIncome 
                        //   initialDate={formatDate(selectedDate)}
                        //   onSuccess={() => {
                        //     setShowAddForm(false);
                        //     handleDayClick(selectedDate);
                        //   }}
                        //   onCancel={() => setShowAddForm(false)}
                        />
                      ) : (
                        <AddExpense 
                          initialDate={formatDate(selectedDate)}
                          onSuccess={() => {
                            setShowAddForm(false);
                            handleDayClick(selectedDate);
                          }}
                          onCancel={() => setShowAddForm(false)}
                        />
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
            
            <button 
              className="close-button"
              onClick={() => {
                setShowModal(false);
                setShowAddForm(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .calendar-container {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }
        .dot-container {
          display: flex;
          gap: 2px;
          justify-content: center;
          margin-top: 4px;
        }
        .green-dot {
          background-color: #4CAF50;
          border-radius: 50%;
          height: 8px;
          width: 8px;
        }
        .red-dot {
          background-color: #F44336;
          border-radius: 50%;
          height: 8px;
          width: 8px;
        }
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-content {
          background-color: white;
          padding: 24px;
          border-radius: 8px;
          max-width: 600px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }
        .records-section {
          margin: 20px 0;
        }
        .records-list {
          list-style: none;
          padding: 0;
        }
        .record-item {
          display: flex;
          gap: 16px;
          padding: 12px;
          border-bottom: 1px solid #eee;
          align-items: center;
        }
        .amount {
          font-weight: bold;
          min-width: 100px;
        }
        .category {
          color: #666;
          min-width: 120px;
        }
        .description {
          color: #888;
          font-size: 0.9em;
        }
        .button-group {
          display: flex;
          gap: 12px;
          margin: 20px 0;
        }
        .action-button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        .action-button.income {
          background-color: #4CAF50;
          color: white;
        }
        .action-button.expense {
          background-color: #F44336;
          color: white;
        }
        .close-button {
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #666;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .loading {
          text-align: center;
          padding: 20px;
          color: #666;
        }
        .add-form-container {
          margin: 20px 0;
          padding: 20px;
          background-color: #f5f5f5;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default IncomeExpenseCalendar;