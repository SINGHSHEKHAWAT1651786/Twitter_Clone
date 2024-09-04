import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component }) => {
  const token = localStorage.getItem('token'); // Retrieve the token from local storage

  // If the token exists, render the component; otherwise, redirect to the login page
  return token ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
