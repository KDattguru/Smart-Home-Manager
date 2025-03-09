import React, { useState } from "react";
import { Table, Badge, Group, ActionIcon, Tooltip, Modal, TextInput, Textarea, Button } from "@mantine/core";
import { IconCheck, IconEdit, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import toast from "react-hot-toast";
import { getAuthToken } from "../../utils/localStorage";
import "../../styles/Tasks.css";

const TaskList = ({ tasks, onTaskUpdated }) => {
  const token = getAuthToken();
  const [opened, setOpened] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const markAsDone = async (taskId) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/tasks/${taskId}/`,
        { status: "Done" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Task marked as done!");
      onTaskUpdated();
    } catch (error) {
      toast.error("Failed to update task.");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Task deleted successfully!");
      onTaskUpdated();
    } catch (error) {
      toast.error("Failed to delete task.");
    }
  };

  const openUpdateModal = (task) => {
    setCurrentTask({ ...task });
    setOpened(true);
  };

  const handleUpdate = async () => {
    if (!currentTask) return;

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/tasks/${currentTask.id}/`,
        currentTask,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Task updated successfully!");
      setOpened(false);
      onTaskUpdated();
    } catch (error) {
      toast.error("Failed to update task.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "yellow";
      case "In Progress":
        return "blue";
      case "Done":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <div className="task-list-container">
      <Table striped highlightOnHover border="default">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td className="task-description">{task.description}</td>
              <td>
                <Badge color={getStatusColor(task.status)}>{task.status}</Badge>
              </td>
              <td>{task.due_date}</td>
              <td>
                <Group spacing="xs">
                  {task.status !== "Done" && (
                    <Tooltip label="Mark as Done">
                      <ActionIcon color="green" onClick={() => markAsDone(task.id)}>
                        <IconCheck size={18} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                  <Tooltip label="Update">
                    <ActionIcon color="blue" onClick={() => openUpdateModal(task)}>
                      <IconEdit size={18} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Delete">
                    <ActionIcon color="red" onClick={() => deleteTask(task.id)}>
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal opened={opened} onClose={() => setOpened(false)} title="Update Task">
        <TextInput label="Title" value={currentTask?.title || ""} onChange={(e) => setCurrentTask((prev) => ({ ...prev, title: e.target.value }))} />
        <Textarea label="Description" value={currentTask?.description || ""} onChange={(e) => setCurrentTask((prev) => ({ ...prev, description: e.target.value }))} />
        <TextInput label="Due Date" type="date" value={currentTask?.due_date || ""} onChange={(e) => setCurrentTask((prev) => ({ ...prev, due_date: e.target.value }))} />
        <Button fullWidth mt="md" onClick={handleUpdate}>
          Update Task
        </Button>
      </Modal>
    </div>
  );
};

export default TaskList;
