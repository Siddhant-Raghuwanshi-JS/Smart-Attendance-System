// client/src/layouts/MainLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom'; // CRITICAL: Import Outlet
import Sidebar from './Sidebar.jsx';

const MainLayout = () => {
  // MainLayout is the parent component that displays the persistent UI (Sidebar)
  // and uses <Outlet /> to render the specific page content (Dashboard, etc.)

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet /> {/* Renders the currently matched child route */}
      </main>
    </div>
  );
};

export default MainLayout;