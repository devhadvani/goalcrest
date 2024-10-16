import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ResetPassword from './pages/ResetPassword';
import ActivatePage from './pages/ActivatePage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <ProtectedRoute redirectTo="/dashboard">
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute redirectTo="/dashboard">
              <Register />
            </ProtectedRoute>
          }
        />

        {/* Dashboard route is protected */}
        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        /> */}


        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/activate/:uid/:token" element={<ActivatePage />} />
      </Routes>
    </Router>
  );
}

export default App;
