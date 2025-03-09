import React, { useState, useEffect } from "react";
import { Card, Button, Text, Badge, Group, SimpleGrid, Avatar } from "@mantine/core";
import axios from "axios";
import toast from "react-hot-toast";
import "../../styles/TaskCards.css";
import { getAuthToken } from "../../utils/localStorage";

const TaskCards = ({ tasks, onTaskUpdated }) => {
  const [token, setToken] = useState(getAuthToken());

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(getAuthToken());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

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
      console.error("Error updating task:", error);
      toast.error("Failed to update task.");
    }
  };

  return (
    <SimpleGrid
      cols={3}
      spacing="lg"
      mt="lg"
      breakpoints={[
        { maxWidth: "lg", cols: 2 },
        { maxWidth: "md", cols: 2 },
        { maxWidth: "sm", cols: 1 },
      ]}
    >
      {tasks && tasks.length > 0 ? (
        tasks.map((task) => (
          <Card  className="task-card"
            key={task.id} 
            shadow="lg" 
            padding="lg" 
            radius="md" 
            border="default"
            style={{ backgroundColor: "linear-gradient(135deg, #0d0f13, #7ea8d6)", borderLeft: `4px solid ${task.status === "Done" ? "green" : "#ffcc00"}` }}
          >
            <Group position="apart">
              <Text weight={600} size="lg" >{task.title}</Text>
              <Badge size="lg" color={task.status === "Done" ? "green" : "yellow"}>{task.status}</Badge>
            </Group>
            <Text size="sm" mt="sm" color="white">{task.description}</Text>
            <Group mt="md">
              <Avatar size="sm" radius="xl" src={task.assigned_user?.profile_picture || "https://via.placeholder.com/40"} />
              <Text size="sm" color="blue" weight={500}>{task.assigned_user?.username || "Unassigned"}</Text>
            </Group>
            {task.status !== "Done" && (
              <Button mt="md" color="blue" fullWidth onClick={() => task.id && markAsDone(task.id)}>
                Mark as Done
              </Button>
            )}
          </Card>
        ))
      ) : (
        <Text align="center" size="lg" >No tasks available</Text>
      )}
    </SimpleGrid>
  );
};

export default TaskCards;
