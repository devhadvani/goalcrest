import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL for API (adjust based on your backend configuration)
const API_URL = 'http://localhost:8000';

// Async thunk for login
export const loginUser = createAsyncThunk('auth/loginUser', async (loginData, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/auth/jwt/create/`, loginData);
    // Store the access token in localStorage
    localStorage.setItem('accessToken', response.data.access);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Async thunk for registration
export const registerUser = createAsyncThunk('auth/registerUser', async (userData, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/auth/users/`, userData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Async thunk for password reset (optional)
export const resetPassword = createAsyncThunk('auth/resetPassword', async (emailData, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/auth/users/reset_password/`, emailData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Async thunk to get user profile
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const accessToken = state.auth.accessToken;

      if (!accessToken) {
        return thunkAPI.rejectWithValue('No access token found');
      }

      // Configure Axios to send the Authorization header
      const response = await axios.get(`${API_URL}/auth/users/me/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Error fetching user profile');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null, // User state
    isAuthenticated: !!localStorage.getItem('accessToken'),
    accessToken: localStorage.getItem('accessToken') || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
      // Clear the token from localStorage
      localStorage.removeItem('accessToken');
    },
    tokenReceived: (state, action) => {
      state.accessToken = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Handle login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.accessToken = action.payload.access;
      state.isAuthenticated = true;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle registration
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle password reset
    builder.addCase(resetPassword.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle fetching user profile
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload; // Store the fetched user info
    });
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { logout, tokenReceived } = authSlice.actions;
export default authSlice.reducer;


