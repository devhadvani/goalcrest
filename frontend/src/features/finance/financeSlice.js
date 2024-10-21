import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL for API (adjust based on your backend configuration)
const API_URL = 'http://localhost:8000';

// Async thunk for fetching incomes
export const fetchIncomes = createAsyncThunk('finance/fetchIncomes', async (_, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const accessToken = state.auth.accessToken;

    const response = await axios.get(`${API_URL}/incomes/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Async thunk for adding income
export const addIncome = createAsyncThunk('finance/addIncome', async (incomeData, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const accessToken = state.auth.accessToken;

    const response = await axios.post(`${API_URL}/incomes/`, incomeData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("nm",response.data)
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Async thunk for fetching expenses
export const fetchExpenses = createAsyncThunk('finance/fetchExpenses', async (_, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const accessToken = state.auth.accessToken;

    const response = await axios.get(`${API_URL}/expenses/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Async thunk for adding expense
export const addExpense = createAsyncThunk('finance/addExpense', async (expenseData, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const accessToken = state.auth.accessToken;

    const response = await axios.post(`${API_URL}/expenses/`, expenseData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Finance slice
const financeSlice = createSlice({
  name: 'finance',
  initialState: {
    incomes: [],
    expenses: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    // Handle fetching incomes
    builder.addCase(fetchIncomes.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchIncomes.fulfilled, (state, action) => {
      state.loading = false;
      state.incomes = action.payload;
    });
    builder.addCase(fetchIncomes.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle adding income
    builder.addCase(addIncome.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addIncome.fulfilled, (state, action) => {
      state.loading = false;
      state.incomes.push(action.payload); // Add the new income to the list
    });
    builder.addCase(addIncome.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle fetching expenses
    builder.addCase(fetchExpenses.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchExpenses.fulfilled, (state, action) => {
      state.loading = false;
      state.expenses = action.payload;
    });
    builder.addCase(fetchExpenses.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle adding expense
    builder.addCase(addExpense.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addExpense.fulfilled, (state, action) => {
      state.loading = false;
      state.expenses.push(action.payload); // Add the new expense to the list
    });
    builder.addCase(addExpense.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default financeSlice.reducer;
