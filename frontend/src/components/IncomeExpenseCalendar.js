import React, { useState, useEffect, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchIncomes, 
  fetchExpenses, 
  fetchIncomesByDate, 
  fetchExpensesByDate,
  updateIncome,
  deleteIncome,
  updateExpense,
  deleteExpense
} from '../features/finance/financeSlice';
import AddIncome from '../pages/AddIncome';
import AddExpense from '../pages/AddExpense';
import './IncomeExpenseCalendar.css';

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
  const [hoveredRecord, setHoveredRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  console.log(editingRecord);
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

  const formatMonthKey = (date) => {
    const year = new Date(date).getFullYear();
    const month = String(new Date(date).getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

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

  const handleUpdate = (record, type) => {
    setEditingRecord({ ...record, type });
  };

  const handleUpdateSubmit = async (updatedData) => {
    try {
      if (editingRecord.type === 'income') {
        console.log("updated data",updatedData);

        await dispatch(updateIncome({ id: editingRecord.id, updatedData }));
      } else {
        await dispatch(updateExpense({ id: editingRecord.id, updatedData }));
      }
      
      // Refresh the data for the selected date
      const formattedDate = formatDate(selectedDate);
      await Promise.all([
        dispatch(fetchIncomesByDate(formattedDate)),
        dispatch(fetchExpensesByDate(formattedDate))
      ]);
      
      setEditingRecord(null);
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };

  const handleDelete = async (record, type) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        if (type === 'income') {
          await dispatch(deleteIncome(record.id));
        } else {
          await dispatch(deleteExpense(record.id));
        }
        
        // Refresh the data for the selected date
        const formattedDate = formatDate(selectedDate);
        await Promise.all([
          dispatch(fetchIncomesByDate(formattedDate)),
          dispatch(fetchExpensesByDate(formattedDate))
        ]);
      } catch (error) {
        console.error('Error deleting record:', error);
      }
    }
  };

  const monthlyTotals = useMemo(() => {
    const totals = {};
    
    incomes.forEach(income => {
      const monthKey = formatMonthKey(income.date);
      if (!totals[monthKey]) totals[monthKey] = { income: 0, expense: 0 };
      totals[monthKey].income += Number(income.amount);
    });

    expenses.forEach(expense => {
      const monthKey = formatMonthKey(expense.date);
      if (!totals[monthKey]) totals[monthKey] = { income: 0, expense: 0 };
      totals[monthKey].expense += Number(expense.amount);
    });

    return totals;
  }, [incomes, expenses]);

  const tileContent = ({ date, view }) => {
    if (view === 'year') {
      const monthKey = formatMonthKey(date);
      const monthData = monthlyTotals[monthKey] || { income: 0, expense: 0 };

      return (
        <div className="monthly-totals">
          <span className="income-total">+₹{monthData.income.toLocaleString()}</span>
          <span className="expense-total">-₹{monthData.expense.toLocaleString()}</span>
        </div>
      );
    }
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

  const checkIfIncome = (date) => {
    return incomeDates.has(date.toDateString());
  };

  const checkIfExpense = (date) => {
    return expenseDates.has(date.toDateString());
  };

  const RecordCard = ({ record, type }) => {
    const isHovered = hoveredRecord?.id === record.id && hoveredRecord?.type === type;
    
    return (
      <div
        className={`record-card ${type}`}
        onMouseEnter={() => setHoveredRecord({ id: record.id, type })}
        onMouseLeave={() => setHoveredRecord(null)}
      >
        <div className="record-amount">
          {type === 'expense' ? '-' : '+'}₹{record.amount}
        </div>
        <div className="record-details">
          {record.description && (
            <span className="record-description">{record.description}</span>
          )}
          <span className="record-category">{record.category_name}</span>
        </div>
        {isHovered && (
          <div className="action-buttons">
            <button 
              className="update-btn"
              onClick={() => handleUpdate(record, type)}
            >
              Update
            </button>
            <button 
              className="delete-btn"
              onClick={() => handleDelete(record, type)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    );
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
              <h2>{selectedDate.toLocaleDateString()}</h2>
              <button className="close-button" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="records-container">
                <div className="records-section income-section">
                  <h3>Income Records</h3>
                  <div className="records-list">
                    {selectedDateIncomes.map((income) => (
                      <RecordCard 
                        key={`income-${income.id}`}
                        record={income}
                        type="income"
                      />
                    ))}
                    {selectedDateIncomes.length === 0 && (
                      <div className="no-records">No income records for this date</div>
                    )}
                  </div>
                </div>

                <div className="records-section expense-section">
                  <h3>Expense Records</h3>
                  <div className="records-list">
                    {selectedDateExpenses.map((expense) => (
                      <RecordCard 
                        key={`expense-${expense.id}`}
                        record={expense}
                        type="expense"
                      />
                    ))}
                    {selectedDateExpenses.length === 0 && (
                      <div className="no-records">No expense records for this date</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

{editingRecord && (
  <div className="modal-overlay">
    <div className="modal-content">
      <div className="modal-header">
        <h2>Edit {editingRecord.type === 'income' ? 'Income' : 'Expense'}</h2>
        <button className="close-button" onClick={() => setEditingRecord(null)}>×</button>
      </div>
      <div className="modal-body">
        {editingRecord.type === 'income' ? (
          <AddIncome 
            initialData={editingRecord}
            onSubmit={(updatedData) => {
              handleUpdateSubmit(updatedData);
              setEditingRecord(null);
            }}
            onCancel={() => setEditingRecord(null)}
          />
        ) : (
          <AddExpense
            initialData={editingRecord}
            onSubmit={(updatedData) => {
              handleUpdateSubmit(updatedData);
              setEditingRecord(null);
            }}
            onCancel={() => setEditingRecord(null)}
          />
        )}
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default IncomeExpenseCalendar;