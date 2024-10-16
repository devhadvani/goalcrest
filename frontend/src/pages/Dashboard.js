import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../features/auth/authSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  if (loading) {
    return <p>Loading...</p>;
  }

  // If error is an object, we need to handle it properly
  if (error) {
    // Check if error has a 'detail' field, otherwise display the error as a string
    return <p>Error loading user data: {error.detail ? error.detail : error.toString()}</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <div>
          <p>Welcome, {user.first_name}!</p>
          <p>Email: {user.email}</p>
          {/* Add more user details as needed */}
        </div>
      ) : (
        <p>No user information available.</p>
      )}
    </div>
  );
};

export default Dashboard;
