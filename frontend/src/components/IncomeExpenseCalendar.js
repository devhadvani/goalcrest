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
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</h2>
              <button 
                className="close-button"
                onClick={() => {
                  setShowModal(false);
                  setShowAddForm(false);
                }}
              >
                ×
              </button>
            </div>
            
            {loading ? (
              <div className="loading">
                <div className="loading-spinner"></div>
                <p>Loading records...</p>
              </div>
            ) : (
              <div className="modal-body">
                <div className="records-grid">
                  <div className="records-section income-section">
                    <h3>Income Records</h3>
                    {selectedDateIncomes.length > 0 ? (
                      <ul className="records-list">
                        {selectedDateIncomes.map((income) => (
                          <li key={income.id} className="record-card income">
                            <div className="record-amount">₹{Number(income.amount).toLocaleString()}</div>
                            <div className="record-details">
                              <span className="record-category">{income.category}</span>
                              {income.description && (
                                <span className="record-description">{income.description}</span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="no-records">No income records for this date</p>
                    )}
                  </div>

                  <div className="records-section expense-section">
                    <h3>Expense Records</h3>
                    {selectedDateExpenses.length > 0 ? (
                      <ul className="records-list">
                        {selectedDateExpenses.map((expense) => (
                          <li key={expense.id} className="record-card expense">
                            <div className="record-amount">-₹{Number(expense.amount).toLocaleString()}</div>
                            <div className="record-details">
                              <span className="record-category">{expense.category}</span>
                              {expense.description && (
                                <span className="record-description">{expense.description}</span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="no-records">No expense records for this date</p>
                    )}
                  </div>
                </div>

                <div className="modal-actions">
                  {!showAddForm ? (
                    <div className="action-buttons">
                      <button 
                        onClick={() => {
                          setIsAddingIncome(true);
                          setShowAddForm(true);
                        }}
                        className="action-button add-income"
                      >
                        + Add Income
                      </button>
                      <button 
                        onClick={() => {
                          setIsAddingIncome(false);
                          setShowAddForm(true);
                        }}
                        className="action-button add-expense"
                      >
                        + Add Expense
                      </button>
                    </div>
                  ) : (
                    <div className="add-form">
                      {isAddingIncome ? (
                        <AddIncome />
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
              </div>
            )}
          </div>
        </div>
      )}


      <style jsx>{`
     
  .calendar-container {
  max-width: 1200px;
  margin: auto;
  margin-top:20px;
  padding: 20px;
  // background-color: #f8fafc;
  border-radius: 12px;
  // height : 800px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
}

/* Customizing the main calendar */
.react-calendar {
  width: 1220px;
  // height : 800px;
  border : none;
  font-family: Arial, sans-serif;
  font-size: 20px;
}

.react-calendar__tile {
  border-radius: 8px;
  background-color: #f8fafc;
  padding: 10px;
    height : 100px;
}

.react-calendar__tile--now {
  background-color: #e0f7fa !important;
  color: #00796b;

}

.react-calendar__tile--active {
  background-color: #c7faff !important;
  color: #000;
  border-radius:10%;
}

.react-calendar__tile:hover {
  background-color: #a7e5ff; /* Custom hover background color */
  color: #005f73; 

}

.react-calendar__tile--active:hover {
  background-color: #a7e5ff !important; /* Custom hover background color */
  color: #005f73 !important;
}



.react-calendar__navigation button {
  background: #010101;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  margin: 0 10px;
  transition: background-color 0.3s;
}

.react-calendar__navigation button:disabled {
  background: #ccc;
  color: #888;
  cursor: default;
}

.react-calendar__navigation button:hover:not(:disabled) {
  background-color: #004d40;
}

/* Header styling */
.react-calendar__month-view__weekdays {
  font-weight: bold;
  color: #37474f;
  text-transform: uppercase;
  font-size: 16px;
}

.react-calendar__month-view__weekdays__weekday {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
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




                .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 20px;
          width: 90%;
          max-width: 1100px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .modal-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          background: white;
          z-index: 1;
        }

        .modal-header h2 {
          margin: 0;
          color: #2d3748;
          font-size: 1.5rem;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 2rem;
          color: #a0aec0;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .records-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .records-section {
          background: #f7fafc;
          border-radius: 12px;
          padding: 1.5rem;
        }

        .records-section h3 {
          margin: 0 0 1rem;
          color: #2d3748;
          font-size: 1.25rem;
        }

        .records-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .record-card {
          background: white;
          border-radius: 8px;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .record-card.income {
          border-left: 4px solid #48bb78;
        }

        .record-card.expense {
          border-left: 4px solid #f56565;
        }

        .record-amount {
          font-size: 1.25rem;
          font-weight: bold;
        }

        .income .record-amount {
          color: #48bb78;
        }

        .expense .record-amount {
          color: #f56565;
        }

        .record-details {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .record-category {
          font-weight: 500;
          color: #4a5568;
        }

        .record-description {
          font-size: 0.875rem;
          color: #718096;
        }

        .no-records {
          color: #a0aec0;
          text-align: center;
          padding: 2rem;
        }

        .modal-actions {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .action-button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .action-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .add-income {
          background: #48bb78;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default IncomeExpenseCalendar;