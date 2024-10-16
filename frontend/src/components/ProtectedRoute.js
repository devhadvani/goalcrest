import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, redirectTo }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // If the user is authenticated, redirect to the provided route (e.g., dashboard)
  if (isAuthenticated) {
    console.log("here ")
    return <Navigate to={redirectTo || '/dashboard'} />;
  }

  // If not authenticated, show the requested page
  return children;
};

export default ProtectedRoute;
