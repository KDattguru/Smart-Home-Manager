import React from "react";
import { Outlet } from "react-router-dom"; 
import "../../../styles/Dashboard.css";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar.jsx";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="main-content">
        <div className="sidebar-one">
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
