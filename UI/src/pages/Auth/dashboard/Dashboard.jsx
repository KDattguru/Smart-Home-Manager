import React, { useState } from "react";
import { Outlet } from "react-router-dom"; 
import "../../../styles/Dashboard.css";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar.jsx";

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard-container">
      <div className="navbar">
        <Navbar toggleSidebar={toggleSidebar} />
      </div>
      <div className="main-content">
        <div className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`}>
          <Sidebar />
        </div>
        <div className="outlet">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
