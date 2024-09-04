import React, { useState } from 'react'; // Import React and useState hook
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate for routing
import Image from "react-bootstrap/Image"; // Import Image component from react-bootstrap
import axios from 'axios'; // Import axios for HTTP requests
import '../sass/Auth.scss'; // Import custom Sass styles for the authentication page

// Base URL for API requests, with a fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Login = () => {
  // State variables for email, password, and error message
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // Hook for navigation
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      // POST request to login endpoint
      const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      });

      if (response.data) {
        // Save user data and token in localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('token', response.data.token);
        // Redirect to home page
        navigate('/');
      }
    } catch (err) {
      console.error(err); // Log errors to the console
      setError('Failed to login. Please check your credentials.'); // Set error message
    }
  };

  return (
    <div className="auth-page"> {/* Container for the authentication page */}
      <div className="auth-card"> {/* Card layout for login form */}
        <div className="auth-cover"> {/* Cover section with logo and heading */}
          <Image src="assets/logo_white.svg" className="auth-logo" /> {/* Logo image */}
          <h2>Welcome back</h2> {/* Heading */}
        </div>
        <div className="auth-form"> {/* Form section */}
          <form onSubmit={handleSubmit}> {/* Form with onSubmit handler */}
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email state
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state
              required
            />
            <button type="submit" className="auth-button">Login</button> {/* Submit button */}
          </form>
          {error && <p className="error">{error}</p>} {/* Display error message if any */}
          <p>
            Don't have an account? <Link to="/register">Sign up</Link> {/* Link to register page */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; // Export Login component as default
