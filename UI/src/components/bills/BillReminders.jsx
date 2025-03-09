import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, ListGroup, Spinner, Alert } from 'react-bootstrap';
import '../../styles/BillsList.css';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const getAuthToken = () => localStorage.getItem('authToken');

const fetchReminders = async (setReminders, setLoading, setError) => {
    setLoading(true);
    setError(null);
    try {
        let authToken = getAuthToken();
        if (!authToken) {
            setError("User is not authenticated. Please log in.");
            setLoading(false);
            return;
        }

        const response = await axios.get(`${API_BASE_URL}/bills/reminders/`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        if (!Array.isArray(response.data)) throw new Error("Invalid API response format.");
        
        setReminders(response.data);
    } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message || "Error fetching reminders. Please try again.");
    } finally {
        setLoading(false);
    }
};

const BillReminders = ({ refreshTrigger }) => {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReminders(setReminders, setLoading, setError);
    }, [refreshTrigger]);  // Refetch when refreshTrigger updates

    return (
        <Container className="mt-4">
            <Card className="bill-reminder-card">
                <Card.Body>
                    <Card.Title>Upcoming Due Bills</Card.Title>
                    {loading && <Spinner animation="border" />}
                    {error && <Alert variant="danger" className="bill-reminder-alert">{error}</Alert>}
                    <ListGroup variant="flush">
                        {reminders.length > 0 ? (
                            reminders.map(reminder => (
                                <ListGroup.Item className='bill-reminder-list' key={reminder.id}>
                                    <strong>{reminder.name}</strong> - Due on{" "}
                                    {new Date(reminder.due_date).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </ListGroup.Item>
                            ))
                        ) : (
                            !loading && <Alert variant="info">No upcoming due bills.</Alert>
                        )}
                    </ListGroup>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default BillReminders;
