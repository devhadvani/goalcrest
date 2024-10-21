// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import financeReducer from './features/finance/financeSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    finance: financeReducer,
  },
});


export default store;
