import React, { useState, useEffect } from "react";
import { TextInput, Button, Card } from "@mantine/core";
import axios from "axios";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "../../styles/Invform.css";
import { getUser, getAuthToken, removeAuthToken } from "../../utils/localStorage"; // ✅ Import getAuthToken

const InvForm = ({ onItemAdded }) => {
  const [item, setItem] = useState({
    name: "",
    category: "",
    purchase_date: "",
    warranty_expiry: "",
    quantity: 1,
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(getAuthToken()); 
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  
  const isTokenValid = (token) => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  }
  const formatDate = (date) => (date ? new Date(date).toISOString().split("T")[0] : null);

  useEffect(() => {
    const storedToken = getAuthToken();
    if (storedToken !== token) {
      setToken(storedToken);
    }

    const user = getUser();
    if (user && user.id && storedToken && isTokenValid(storedToken)) {
      setUserId(user.id);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [token]); 

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("User not authenticated. Please log in.");
      navigate("/login");
      return;
    }

    if (!isTokenValid(token)) {
      toast.error("Session expired. Please log in again.");
      removeAuthToken(); // 
      navigate("/login");
      return;
    }

    const toastId = toast.loading("Adding item...");

    const payload = {
      ...item,
      user: userId, 
      purchase_date: formatDate(item.purchase_date),
      warranty_expiry: formatDate(item.warranty_expiry),
      quantity: Number(item.quantity),
    };

    console.log("Payload being sent:", payload);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/inventory/", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Item added successfully!", { id: toastId });
      if (onItemAdded) onItemAdded();

      setItem({
        name: "",
        category: "",
        purchase_date: "",
        warranty_expiry: "",
        quantity: 1,
      });
    } catch (error) {
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.detail || "Failed to add item. Please try again.", { id: toastId });
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <Card className="inv-form-container" shadow="sm" padding="lg">
      <form onSubmit={handleSubmit}>
        <div className="inv-form-row">
          <TextInput label="Item Name" name="name" value={item.name} onChange={handleChange} required />
          <TextInput label="Category" name="category" value={item.category} onChange={handleChange} required />
        </div>

        <div className="inv-form-row">
          <TextInput
            label="Purchase Date"
            name="purchase_date"
            type="date"
            value={item.purchase_date}
            onChange={handleChange}
            required
          />
          <TextInput
            label="Warranty Expiry"
            name="warranty_expiry"
            type="date"
            value={item.warranty_expiry}
            onChange={handleChange}
          />
        </div>

        <TextInput
          label="Quantity"
          name="quantity"
          type="number"
          min="1"
          value={item.quantity}
          onChange={handleChange}
          required
        />

        <Button type="submit" mt="sm" fullWidth disabled={!isAuthenticated}>
          {isAuthenticated ? "Add Item" : "Login to Add Item"}
        </Button>
      </form>
    </Card>
  );
};

export default InvForm;
