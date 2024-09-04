import React from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet for nested routing
import Sidebar from './components/Sidebar'; // Import Sidebar component
import './sass/App.scss'; // Import styles for the App component

const App = () => {
  return (
    <div className="app">
      {/* Sidebar component is rendered on the left side */}
      <Sidebar />
      <main className="content">
        {/* The Outlet component renders the matched child route */}
        <Outlet />
      </main>
    </div>
  );
};

export default App;
