import React, { useState, useEffect } from "react";
import { Container, Grid, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import TaskForm from "../components/tasks/Taskform";
import TaskList from "../components/tasks/TaskList";
import TaskCards from "../components/tasks/TaskCards";
import axios from "axios";
import { getAuthToken } from "../utils/localStorage";
import "../styles/Tasks.css";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const token = getAuthToken();
    if (!token) {
      console.error("No auth token found");
      return;
    }

    try {
      const response = await axios.get("http://127.0.0.1:8000/api/tasks/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  return (
    <Container size="lg" className="task-container">
      <Title align="center" mb="lg">
        Task Management
      </Title>

    
      <Grid className="task-grid">
        <Grid.Col span={isMobile ? 12 : 4} className="task-form">
          <TaskForm onTaskAdded={fetchTasks} />
        </Grid.Col>

        <Grid.Col span={isMobile ? 12 : 8} className="task-list">
          <TaskList tasks={tasks} onTaskUpdated={fetchTasks} />
        </Grid.Col>
      </Grid>

      <div className="task-cards">
        <TaskCards tasks={tasks} onTaskUpdated={fetchTasks} />
      </div>
    </Container>
  );
};

export default Tasks;
