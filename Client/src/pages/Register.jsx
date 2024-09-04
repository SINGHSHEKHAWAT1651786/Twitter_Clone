import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Image from "react-bootstrap/Image";
import axios from 'axios';
import '../sass/Auth.scss';

// API URL from environment variables or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Register = () => {
  // State variables for form fields and error message
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      // Send POST request to register user
      const response = await axios.post(`${API_URL}/users/register`, {
        username,
        email,
        password,
        name,
      });
      if (response.data) {
        // On success, navigate to login page
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      // Set error message on failure
      setError('Failed to register. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-cover">
          <Image src="assets/logo_white.svg" className="auth-logo" />
          <h2>Join us</h2>
        </div>
        <div className="auth-form">
          <form onSubmit={handleSubmit}>
            {/* Input fields for registration */}
            <input
              type="text"
              placeholder="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {/* Submit button */}
            <button type="submit" className="auth-button">Sign Up</button>
          </form>
          {/* Display error message if any */}
          {error && <p className="error">{error}</p>}
          {/* Link to login page */}
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
