import React from "react";
import { NavLink } from "react-router-dom";
import {
  IconBellRinging,
  IconClipboardList,
  IconHome, 
  IconBox,
} from "@tabler/icons-react";
import logo from "../assets/logo-3.png";
import "../styles/Sidebar.css";

const menuItems = [
  { path: "/dashboard/", label: "Dashboard Overview", icon: <IconHome size={22} /> },
  { path: "/dashboard/tasks", label: "Task Assignment", icon: <IconClipboardList size={22} /> },
  { path: "/dashboard/inventory", label: "Home Inventory", icon: <IconBox size={22} /> },
  { path: "/dashboard/bills", label: "Bills", icon: <IconBellRinging size={22} /> },
];

export function Sidebar() {
  return (
    <nav className="">
      <div className="sidebar-header text-center">
        <img src={logo} alt="Logo" className="logo" />
        <h3>Home Manager</h3>
      </div>

      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default Sidebar;
