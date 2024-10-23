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

export const fetchCategories = createAsyncThunk('finance/fetchCategories', async (_, thunkAPI) => {
  try {
    console.log("printitn v")
    const state = thunkAPI.getState();
    const accessToken = state.auth.accessToken;

    const response = await axios.get(`${API_URL}/categories/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    // Filter only 'income' categories
    const incomeCategories = response.data.filter(category => category.type === 'income');
    console.log("income",incomeCategories)
    return incomeCategories;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Async thunk for fetching incomes by date
export const fetchIncomesByDate = createAsyncThunk('finance/fetchIncomesByDate', async (date, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const accessToken = state.auth.accessToken;

    const response = await axios.get(`${API_URL}/incomes/?date=${date}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Async thunk for fetching expenses by date
export const fetchExpensesByDate = createAsyncThunk('finance/fetchExpensesByDate', async (date, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const accessToken = state.auth.accessToken;

    const response = await axios.get(`${API_URL}/expenses/?date=${date}`, {
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


    builder.addCase(fetchCategories.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.categories = action.payload;
    });
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

 // Handle fetching all incomes
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

// Handle fetching all expenses
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

// Handle fetching incomes by date
builder.addCase(fetchIncomesByDate.pending, (state) => {
  state.loading = true;
});
builder.addCase(fetchIncomesByDate.fulfilled, (state, action) => {
  state.loading = false;
  state.selectedDateIncomes = action.payload;
});
builder.addCase(fetchIncomesByDate.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
});

// Handle fetching expenses by date
builder.addCase(fetchExpensesByDate.pending, (state) => {
  state.loading = true;
});
builder.addCase(fetchExpensesByDate.fulfilled, (state, action) => {
  state.loading = false;
  state.selectedDateExpenses = action.payload;
});
builder.addCase(fetchExpensesByDate.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
});

// Handle adding income
builder.addCase(addIncome.pending, (state) => {
  state.loading = true;
});
builder.addCase(addIncome.fulfilled, (state, action) => {
  state.loading = false;
  state.incomes.push(action.payload);
  state.selectedDateIncomes.push(action.payload);
});
builder.addCase(addIncome.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
});

// Handle adding expense
builder.addCase(addExpense.pending, (state) => {
  state.loading = true;
});
builder.addCase(addExpense.fulfilled, (state, action) => {
  state.loading = false;
  state.expenses.push(action.payload);
  state.selectedDateExpenses.push(action.payload);
});
builder.addCase(addExpense.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
});
  },
});

export default financeSlice.reducer;
