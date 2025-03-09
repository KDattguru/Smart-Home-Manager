import React, { useState, useEffect } from "react";
import { Grid, TextInput } from "@mantine/core";
import InvForm from "../components/inventory/InvForm";
import InvList from "../components/inventory/InvList";
import "../styles/Inventory.css";
import axios from "axios";
import { getAuthToken } from "../utils/localStorage";

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState([]); // Manage inventory items

  // Fetch items initially
  useEffect(() => {
    fetchItems();
  }, []);

  // Fetch inventory items from the backend
  const fetchItems = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await axios.get("http://127.0.0.1:8000/api/inventory/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(response.data); // Update items state
    } catch (error) {
      console.error("Error fetching inventory:", error.response?.data);
    }
  };

  return (
    <div className="inventory-container">
      <h3>Inventory Management</h3>
      <Grid gutter="md">
        <Grid.Col span={12} md={4}>
          <InvForm setItems={setItems} fetchItems={fetchItems} />
        </Grid.Col>

        <Grid.Col span={12} md={8}>
          {/* <TextInput
            className="inv-search-bar"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          /> */}
          <div className="inv-table-container">
            <InvList items={items} setItems={setItems} searchQuery={searchQuery} />
          </div>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default Inventory;
