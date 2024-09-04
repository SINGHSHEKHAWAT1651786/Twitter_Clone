import React, { useEffect, useState } from 'react'; // Importing necessary hooks from React
import { NavLink, useNavigate } from 'react-router-dom'; // Importing NavLink and useNavigate for navigation
import { FaHome, FaUser, FaSignOutAlt } from 'react-icons/fa'; // Importing FontAwesome icons
import Image from 'react-bootstrap/Image'; // Importing Image component from react-bootstrap
import '../sass/Sidebar.scss'; // Importing custom Sass styles for the Sidebar
import axios from 'axios'; // Importing axios for making HTTP requests

// Defining the base URL for the API, with a fallback to localhost if not defined in the environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Main Sidebar component
const Sidebar = () => {
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Function to handle logout by removing the token and redirecting to the login page
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        {/* Display the logo at the top of the sidebar */}
        <Image src="/assets/logo.svg" className="sidebar-logo" />
      </div>
      <div className="sidebar-menu">
        {/* Sidebar menu items */}
        <SidebarItem icon={<FaHome />} text="Home" to="/" /> {/* Home link */}
        <SidebarItem icon={<FaUser />} text="Profile" to="/profile" /> {/* Profile link */}
        <div className="sidebar-item" onClick={handleLogout}>
          {/* Logout button */}
          <FaSignOutAlt /> {/* Logout icon */}
          <span>Logout</span> {/* Logout text */}
        </div>
      </div>
      <div className="sidebar-footer">
        {/* Footer section of the sidebar */}
        <SidebarProfile /> {/* User profile information */}
      </div>
    </div>
  );
};

// Component for individual sidebar items
const SidebarItem = ({ icon, text, to }) => {
  return (
    <NavLink to={to} className="sidebar-item">
      {/* Link with icon and text */}
      {icon}
      <span>{text}</span>
    </NavLink>
  );
};

// Component to display the user's profile information in the sidebar footer
const SidebarProfile = () => {
  const [user, setUser] = useState(null); // State to store user data

  useEffect(() => {
    // Fetch user data from the server
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from local storage
        const response = await axios.get(`${API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }, // Send token in the request headers
        });
        setUser(response.data); // Set the user data in state
      } catch (err) {
        console.error('Failed to fetch user data', err); // Log any errors
      }
    };
    fetchUserData(); // Call the function to fetch user data on component mount
  }, []); // Empty dependency array to run the effect only once

  if (!user) {
    // If user data hasn't loaded yet, return an empty div
    return <div></div>;
  }

  // Set the profile picture URL, falling back to a default image if none is provided
  const profilePicUrl = user.profilePic ? `${API_URL}/${user.profilePic}` : "/assets/default_user.jpg";

  return (
    <div className="sidebar-profile">
      {/* Display the user's profile picture */}
      <img src={profilePicUrl} alt="Profile" />
      <div className="profile-info">
        {/* Display the user's name and username */}
        <div className="profile-name">{user.name}</div>
        <div className="profile-username">@{user.username}</div>
      </div>
    </div>
  );
};

export default Sidebar; // Export the Sidebar component as the default export
