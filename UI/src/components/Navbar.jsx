import React, { useState, useEffect } from "react";
import { Navbar, Container, Nav, Dropdown, Image } from "react-bootstrap";
import { IconLogout, IconUser, IconMail, IconShield, IconMenu2 } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import profilePlaceholder from "../assets/profile_1.jpeg";
import "../styles/Navbar.css";
import { getAuthToken, removeAuthToken, getUser, removeUser } from "../utils/localStorage";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/";

function AppNavbar({ toggleSidebar }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          setUser(null);
          return;
        }

        const storedUser = getUser();
        if (storedUser) {
          setUser(storedUser);
        }

        const response = await axios.get(`${BASE_URL}api/users/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        removeUser();
        removeAuthToken();
        setUser(null);
      }
    };

    fetchUser();

    const handleStorageChange = () => {
      fetchUser();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    removeAuthToken();
    removeUser();
    toast.success("Logged out successfully!");
    setUser(null);
    window.dispatchEvent(new Event("storage"));
    setTimeout(() => navigate("/login"), 100);
  };

  return (
    <Navbar expand="lg" className="container navbox py-3">
      <Container className="d-flex justify-content-between align-items-center">
        {/* Sidebar Toggle Button for Mobile */}
        <button className="menu-btn btn btn-dark d-lg-none" onClick={toggleSidebar}>
          <IconMenu2 size={24} />
        </button>

        <Navbar.Collapse className="justify-content-center">
          <Nav className="mx-auto"></Nav>
        </Navbar.Collapse>

        {user ? (
          <>
            <h2 className="d-none d-md-block ">Welcome {user?.username || "Unknown"}</h2>
            <Dropdown align="end">
              <Dropdown.Toggle variant="dark" className="d-flex align-items-center border-0 bg-transparent">
                <Image
                  src={user?.profile_picture ? `${BASE_URL}${user.profile_picture}` : profilePlaceholder}
                  roundedCircle
                  className="border profilelogo border-white"
                  alt="Profile"
                />
              </Dropdown.Toggle>

              <Dropdown.Menu className="custom-dropdown text-center">
                <Dropdown.ItemText className="fw-bold d-flex align-items-center">
                  <IconUser className="me-2" size={16} />
                  {user?.username || "Unknown"}
                </Dropdown.ItemText>
                <Dropdown.ItemText className="d-flex align-items-center">
                  <IconMail className="me-2" size={16} />
                  {user?.email || "No Email"}
                </Dropdown.ItemText>
                <Dropdown.ItemText className="d-flex align-items-center">
                  <IconShield className="me-2" size={16} />
                  {user?.role || "No Role"}
                </Dropdown.ItemText>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} className="d-flex align-items-center justify-content-center">
                  <IconLogout className="me-2" size={18} />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </>
        ) : (
          <button className="btn btn-outline-light  btnbox" onClick={() => navigate("/sidebar")}>
          Sidebar
        </button>
        )}
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
