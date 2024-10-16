import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom'; // for redirecting
import './Register.css';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    re_password: '',
  });

  const { first_name, last_name, email, password, re_password } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== re_password) {
      alert('Passwords do not match');
      return;
    }

    // Dispatch the registerUser action
    dispatch(registerUser({ first_name, last_name, email, password, re_password }));
  };


  return (
    <div className="register-container">
      <h1>Register</h1>
      {error && <p className="error-msg">Error: {JSON.stringify(error)}</p>}
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="first_name"
            value={first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="last_name"
            value={last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Re-enter Password</label>
          <input
            type="password"
            name="re_password"
            value={re_password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
