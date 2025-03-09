import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Container, Row, Col, ListGroup, Badge, Spinner, Alert } from 'react-bootstrap';
import '../styles/BillsList.css';  
import BillForm from '../components/bills/BillForm';
import BillsList from '../components/bills/BillsList';
import BillReminders from '../components/bills/BillReminders';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

const fetchData = async (url, setData, setLoading, setError) => {
    setLoading(true);
    setError(null);

    try {
        const authToken = getAuthToken();
        if (!authToken) {
            setError("User is not authenticated. Please log in.");
            setLoading(false);
            return;
        }

        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        setData(response.data || []);
    } catch (error) {
        setError(error.response ? `Error ${error.response.status}: ${error.response.statusText}` : "Network error.");
    } finally {
        setLoading(false);
    }
};

const Bills = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData(`${API_BASE_URL}/bills/`, setBills, setLoading, setError);
    }, []);

    return (
        <Container className="bills-container mt-4">
            <Row className="g-4">
                <Col md={6}>
                    <BillForm setBills={setBills} />
                </Col>
                <Col md={6}>
                    <BillReminders />
                </Col>
                
                <Col md={12}>
                    {loading && <Spinner animation="border" className="d-block mx-auto" />}
                    {error && <Alert variant="danger">{error}</Alert>}
                    <BillsList bills={bills} setBills={setBills} />
                </Col>
            </Row>
        </Container>
    );
};

export default Bills;
