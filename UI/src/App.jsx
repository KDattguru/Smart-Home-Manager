import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { isAuthenticated } from "./utils/auth"; 
import { ClimbingBoxLoader } from "react-spinners";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./pages/Auth/login/Login";
import Register from "./pages/Auth/Register/Register";
import Dashboard from "./pages/Auth/dashboard/Dashboard";
import Home from "./components/Home";
import TaskAssignment from "./pages/Tasks";
import Inventory from "./pages/Inventory";
import Bills from "./pages/Bills";

function ProtectedRoute({ element }) {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(isAuthenticated()); 

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 1000);
    }
  }, [loading]);

  useEffect(() => {
    const handleStorageChange = () => setIsAuth(isAuthenticated());

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <>
    <div className="app">
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      {loading ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <ClimbingBoxLoader color="#36D7B7" size={20} />
        </div>
      ) : (
        <Routes>
          <Route
            path="/"
            element={isAuth ? <Navigate to="/dashboard" replace /> : <Login setAuthTokenState={setIsAuth} />}
          />
          <Route path="/login" element={<Login setAuthTokenState={setIsAuth} />} />
          <Route path="/register" element={<Register />} />

          
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />}>
            <Route index element={<Home />} />
            <Route path="tasks" element={<TaskAssignment />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="bills" element={<Bills />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
    </div>
    </>
    
  );
}

export default App;
