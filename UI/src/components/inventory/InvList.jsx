import React, { useState, useEffect } from "react";
import { Table, TextInput, ActionIcon, Tooltip, Badge, Button, Modal } from "@mantine/core";
import { IconEdit, IconTrash, IconAlertCircle, IconSearch, IconCheck, IconX } from "@tabler/icons-react";
import axios from "axios";
import toast from "react-hot-toast";
import "../../styles/InvList.css";
import { getAuthToken, removeAuthToken } from "../../utils/localStorage";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const InvList = ({ onItemUpdated }) => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [editData, setEditData] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const token = getAuthToken();

  const isTokenValid = (token) => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    if (!token || !isTokenValid(token)) {
      toast.error("Session expired. Please log in again.");
      removeAuthToken();
      navigate("/login");
      return;
    }
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/inventory/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(response.data);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to fetch inventory items.");
      if (error.response?.status === 401) {
        removeAuthToken();
        navigate("/login");
      }
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const deleteItem = async (itemId) => {
    toast.loading("Deleting item...", { id: "delete-item" });
    try {
      await axios.delete(`http://127.0.0.1:8000/api/inventory/${itemId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Item deleted successfully!", { id: "delete-item" });
      fetchItems();
      onItemUpdated();
    } catch (error) {
      toast.error("Failed to delete item.", { id: "delete-item" });
    }
  };

  const startEdit = (item) => {
    setEditingItem(item.id);
    setEditData({ ...item });
    setModalOpen(true);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const saveEdit = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/inventory/${editingItem}/`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Item updated successfully!");
      setModalOpen(false);
      setEditingItem(null);
      fetchItems();
      onItemUpdated();
    } catch (error) {
      toast.error("Failed to update item.");
    }
  };

  const isWarrantyExpired = (expiryDate) => {
    const today = new Date().toISOString().split("T")[0];
    return expiryDate === today;
  };

  return (
    <div className="inventory-list-container">
      <div className="search-container">
        <TextInput icon={<IconSearch size={88} />} placeholder="Search..." value={search} onChange={handleSearch} className="search-bar small" />
      </div>

      <Table striped highlightOnHover border="default">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Purchase Date</th>
            <th>Warranty Expiry</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())).map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.purchase_date}</td>
              <td>
                {item.warranty_expiry ? (
                  <>
                    <Badge color={isWarrantyExpired(item.warranty_expiry) ? "red" : "blue"}>
                      {item.warranty_expiry}
                    </Badge>
                    <span style={{ marginLeft: "8px" }}></span>
                  </>
                ) : (
                  "No Warranty"
                )}
                {isWarrantyExpired(item.warranty_expiry) && (
                  <Tooltip label="Warranty Expired!">
                    <ActionIcon color="red">
                      <IconAlertCircle size={18} />
                    </ActionIcon>
                  </Tooltip>
                )}
              </td>
              <td>{item.quantity}</td>
              <td className="action-buttons">
                <Tooltip label="Edit">
                  <ActionIcon color="blue" onClick={() => startEdit(item)}>
                    <IconEdit size={18} />
                  </ActionIcon>
                </Tooltip>
                <span style={{ margin: "0 8px" }}></span>
                <Tooltip label="Delete">
                  <ActionIcon color="red" onClick={() => deleteItem(item.id)}>
                    <IconTrash size={18} />
                  </ActionIcon>
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Edit Item">
        <TextInput label="Name" name="name" value={editData.name} onChange={handleEditChange} />
        <TextInput label="Category" name="category" value={editData.category} onChange={handleEditChange} />
        <TextInput label="Purchase Date" name="purchase_date" value={editData.purchase_date} onChange={handleEditChange} type="date" />
        <TextInput label="Warranty Expiry" name="warranty_expiry" value={editData.warranty_expiry} onChange={handleEditChange} type="date" />
        <TextInput label="Quantity" name="quantity" value={editData.quantity} onChange={handleEditChange} />
        <Button color="green" onClick={saveEdit} mt="md" mr="sm">Save</Button>
        <Button color="gray" onClick={() => setModalOpen(false)} mt="md">Cancel</Button>
      </Modal>
    </div>
  );
};

export default InvList;
