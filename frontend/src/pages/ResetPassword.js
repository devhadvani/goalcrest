// src/pages/ResetPassword.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../features/auth/authSlice';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(resetPassword({ email }));
  };

  return (
    <div>
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <button type="submit" disabled={loading}>Reset Password</button>
      </form>
      {error && <p>{error.message}</p>}
    </div>
  );
};

export default ResetPassword;
