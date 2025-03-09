import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import '../../styles/BillForm.css'
import { toast } from 'react-hot-toast';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const getAuthToken = () => localStorage.getItem('authToken');

const BillForm = ({ setBills }) => {
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        description: '',
        due_date: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
    
        try {
            let authToken = getAuthToken();
            if (!authToken) {
                toast.error('User is not authenticated. Please log in.');
                setLoading(false);
                return;
            }
    
            const requestData = {
                ...formData,
                amount: parseFloat(formData.amount),
                status: 'pending',
                isdeleted: false,
            };
    
            const response = await axios.post(`${API_BASE_URL}/bills/`, requestData, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
    
            setBills(prevBills => [response.data, ...prevBills]);
            toast.success('Bill created successfully!');
            setFormData({ name: '', amount: '', description: '', due_date: '' });
    
        } catch (error) {
            console.error('Error:', error.response?.data);
            toast.error('Failed to create bill. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    
    return (
        <Card className="bill-form-card shadow-sm ">
            <Card.Body>
                <Card.Title className="bill-form-title">Create a New Bill</Card.Title>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="">
                        <Form.Label className="bill-form-label">Bill Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="bill-form-input"
                        />
                    </Form.Group>

                    <Form.Group className="">
                        <Form.Label className="bill-form-label">Amount (Rs.)</Form.Label>
                        <Form.Control
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            className="bill-form-input"
                        />
                    </Form.Group>

                    <Form.Group className="">
                        <Form.Label className="bill-form-label">Description</Form.Label>
                        <Form.Control
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="bill-form-input"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="bill-form-label">Due Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="due_date"
                            value={formData.due_date}
                            onChange={handleChange}
                            required
                            className="bill-form-input"
                        />
                    </Form.Group>

                    <Button type="submit" className="bill-form-button" disabled={loading}>
                        {loading ? <Spinner size="sm" animation="border" /> : 'Create Bill'}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default BillForm;
