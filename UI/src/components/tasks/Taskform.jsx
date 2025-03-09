import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextInput, Textarea, Button, Select, Card } from "@mantine/core";
import toast from "react-hot-toast";
import { getAuthToken } from "../../utils/localStorage";
import "../../styles/Taskform.css";

const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("Pending");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [token, setToken] = useState(getAuthToken());

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(getAuthToken());
    };

    window.addEventListener("storage", handleStorageChange);
    if (token) {
      fetchUsers();
    } else {
      toast.error("Authentication required. Please log in.");
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [token]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/users/list-users/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        toast.error("Invalid user data received!");
      }
    } catch (error) {
      toast.error("Failed to fetch users! Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      toast.error("Please select a user!");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/tasks/",
        { title, description, due_date: dueDate, status, user: parseInt(selectedUser) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTitle("");
      setDescription("");
      setDueDate("");
      setStatus("Pending");
      setSelectedUser("");

      toast.success("Task assigned successfully!");
      onTaskAdded();
    } catch (error) {
      toast.error("Failed to assign task. Please try again.");
    }
  };

  return (
    <Card className="formbox text-start" shadow="sm" padding="lg" radius="md" >
      <form onSubmit={handleSubmit}>
        <TextInput label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} required mt="sm" />
        <Select
          label="Assign To"
          data={users.map((user) => ({ value: user.id.toString(), label: user.username }))}
          value={selectedUser}
          onChange={setSelectedUser}
          mt="sm"
          required
          placeholder="Select a user"
        />
        <TextInput label="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required mt="sm" />
        <Select
          label="Status"
          data={[
            { value: "Pending", label: "Pending" },
            { value: "In Progress", label: "In Progress" },
            { value: "Done", label: "Done" },
          ]}
          value={status}
          onChange={setStatus}
          mt="sm"
        />
        <Button type="submit" mt="md" fullWidth>
          Assign Task
        </Button>
      </form>
    </Card>
  );
};

export default TaskForm;
