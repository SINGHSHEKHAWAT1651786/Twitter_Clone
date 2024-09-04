import React from 'react'; // Import React
import ReactDOM from 'react-dom/client'; // Import ReactDOM for rendering
import { RouterProvider, createBrowserRouter } from 'react-router-dom'; // Import RouterProvider and createBrowserRouter for routing
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Home from './pages/Home.jsx'; // Import Home page component
import Profile from './pages/Profile.jsx'; // Import Profile page component
import Error from './pages/Error.jsx'; // Import Error page component
import App from './App'; // Import the main App component
import Login from './pages/Login.jsx'; // Import Login page component
import Register from './pages/Register.jsx'; // Import Register page component
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute component for guarding routes
import TweetDetails from './pages/TweetDetails.jsx'; // Import TweetDetails page component
import UserProfile from './pages/UserProfile.jsx'; // Import UserProfile page component

// Define the router configuration
const router = createBrowserRouter([
  {
    path: '/', // Root path
    element: <App />, // Main layout component
    errorElement: <Error />, // Component to display on route errors
    children: [
      {
        path: '/', // Home page route
        element: <ProtectedRoute element={Home} />, // Protected route component for Home
      },
      {
        path: 'profile', // Profile page route
        element: <ProtectedRoute element={Profile} />, // Protected route component for Profile
      },
      {
        path: '/login', // Login page route
        element: <Login />, // Login page component
      },
      {
        path: '/register', // Register page route
        element: <Register />, // Register page component
      },
      {
        path: '/tweets/:id', // Dynamic route for Tweet details
        element: <ProtectedRoute element={TweetDetails} />, // Protected route component for TweetDetails
      },
      {
        path: '/users/:id', // Dynamic route for User profile
        element: <UserProfile /> // UserProfile page component
      }
    ],
  },
]);

// Render the application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} /> {/* Provide the router configuration to the application */}
  </React.StrictMode>
);
