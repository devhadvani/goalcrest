import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// const API_URL = window.location.hostname === 'localhost'
//   ? 'http://localhost:8000' 
//   : 'http://ec2-13-60-166-183.eu-north-1.compute.amazonaws.com:8000';

const API_URL = `http://${window.location.hostname}:8000`

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

export const fetchCategories = createAsyncThunk('finance/fetchCategories', async (category, thunkAPI) => {
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
    console.log('cate',category)
    console.log("rd",response.data)
    return response.data;
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

export const updateIncome = createAsyncThunk('finance/updateIncome', async ({ id,updatedData }, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const accessToken = state.auth.accessToken;
    console.log("in the thunk",updatedData);
    console.log("in the thunk for the id",id);

    const response = await axios.put(`${API_URL}/incomes/${id}/`, updatedData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Async thunk for deleting income
export const deleteIncome = createAsyncThunk('finance/deleteIncome', async (id, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const accessToken = state.auth.accessToken;

    await axios.delete(`${API_URL}/incomes/${id}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Async thunk for updating expense
export const updateExpense = createAsyncThunk('finance/updateExpense', async ({ id, expenseData }, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const accessToken = state.auth.accessToken;

    const response = await axios.put(`${API_URL}/expenses/${id}/`, expenseData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("dsfkjhfkgs",response)
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Async thunk for deleting expense
export const deleteExpense = createAsyncThunk('finance/deleteExpense', async (id, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const accessToken = state.auth.accessToken;

    await axios.delete(`${API_URL}/expenses/${id}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return id;
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
