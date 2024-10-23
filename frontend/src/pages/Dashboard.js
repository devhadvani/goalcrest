import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIncomes, fetchExpenses } from '../features/finance/financeSlice';
import IncomeExpenseCalendar from '../components/IncomeExpenseCalendar';
import AddIncome from './AddIncome'; // Your existing AddIncome component
import AddExpense from './AddExpense'; // Your existing AddExpense component
import { useState } from 'react';
import Modal from '../components/Modal';


const Dashboard = () => {
  const dispatch = useDispatch();
  const { incomes, expenses, loading, error } = useSelector(state => state.finance);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);


  useEffect(() => {
    dispatch(fetchIncomes());
    dispatch(fetchExpenses());
  }, [dispatch]);

  // if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const totalIncome = incomes.reduce((acc, income) => acc + parseFloat(income.amount), 0);
  const totalExpenses = expenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
  const balance = totalIncome - totalExpenses;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Income: Rs. {totalIncome}</p>
      <p>Total Expenses: Rs. {totalExpenses}</p>
      <p>Balance: Rs. {balance}</p>

       
      <button onClick={() => setShowIncomeModal(true)}>Add Income</button>
      <button onClick={() => setShowExpenseModal(true)}>Add Expense</button>

      {/* Modal for Add Income */}
      <Modal show={showIncomeModal} onClose={() => setShowIncomeModal(false)}>
        <AddIncome />
      </Modal>

      {/* Modal for Add Expense */}
      <Modal show={showExpenseModal} onClose={() => setShowExpenseModal(false)}>
        <AddExpense />
      </Modal>

      <IncomeExpenseCalendar />
    </div>
  );
};

export default Dashboard;
