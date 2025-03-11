import React, { useState, useEffect } from "react";
import { Card, Text, Loader, Alert, Group } from "@mantine/core";
import { IconClipboardList, IconBox, IconCurrencyDollar, IconUser, IconUsers } from "@tabler/icons-react";
import { StatsRingCard } from "./StatsRingCard";
import { getAuthToken } from "../utils/localStorage";
import "../styles/Home.css";

const Home = () => {
  const [stats, setStats] = useState({
    tasks: null,
    inventory: null,
    bills: null,
    totalAdmins: null,
    totalUsers: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = getAuthToken();

      if (!token) {
        setError("Unauthorized: Please log in.");
        setLoading(false);
        return;
      }

      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const [tasksRes, inventoryRes, billsRes, usersRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/tasks/count/", { headers }),
          fetch("http://127.0.0.1:8000/api/inventory/count/", { headers }),
          fetch("http://127.0.0.1:8000/api/bills/count/", { headers }),
          fetch("http://127.0.0.1:8000/api/users/count/", { headers }),
        ]);

        if (!tasksRes.ok || !inventoryRes.ok || !billsRes.ok || !usersRes.ok) {
          throw new Error("Unauthorized or failed to fetch data.");
        }

        const [tasksData, inventoryData, billsData, usersData] = await Promise.all([
          tasksRes.json(),
          inventoryRes.json(),
          billsRes.json(),
          usersRes.json(),
        ]);

        setStats({
          tasks: tasksData.count || 0,
          inventory: inventoryData.count || 0,
          bills: billsData.count || 0,
          totalAdmins: usersData.total_admins || 0,
          totalUsers: usersData.total_users || 0,
        });

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home-container">
      <h2 className="home-title text-center">Dashboard Overview</h2>

      {loading ? (
        <Loader size="xl" className="loading-spinner" />
      ) : error ? (
        <Alert color="red">{error}</Alert>
      ) : (
        <>
          <div className="overview-cards">
            <Card shadow="sm" padding="lg" radius="md" className="overview-card">
              <IconClipboardList size={32} className="card-icon task-icon" />
              <Text fw={700} size="lg">Pending Tasks</Text>
              <Text className="card-data">{stats.tasks} Tasks Left</Text>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" className="overview-card">
              <IconBox size={32} className="card-icon inventory-icon" />
              <Text fw={700} size="lg">Total Inventory Items</Text>
              <Text className="card-data">{stats.inventory} Items Logged</Text>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" className="overview-card">
              <IconCurrencyDollar size={32} className="card-icon bills-icon" />
              <Text fw={700} size="lg">Upcoming Bills</Text>
              <Text className="card-data">{stats.bills} Bills Due Soon</Text>
            </Card>
          </div>

          <div className="admin-stats ">
            <Card shadow="sm" padding="lg" radius="md" className="small-overview-card">
              <Text fw={700} size="lg" align="center">User Overview</Text>
              <Group position="apart">
                <div className="user-stat">
                  <IconUser size={28} className="admin-icon" />
                  <Text className="card-data">{stats.totalAdmins}</Text>
                  <Text size="sm">Admins</Text>
                </div>
                <div className="user-stat">
                  <IconUsers size={28} className="user-icon" />
                  <Text className="card-data">{stats.totalUsers}</Text>
                  <Text size="sm">Users</Text>
                </div>

              </Group>
            </Card>
          </div>
          <div className="stats-card">
            <StatsRingCard />
          </div>

        
        </>
      )}
    </div>
  );
};

export default Home;
