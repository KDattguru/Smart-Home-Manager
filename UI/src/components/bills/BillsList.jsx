import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Spinner, Alert, Dropdown, Button, Modal, Form } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import BillReminders from "./BillReminders";
import "../../styles/BillsList.css";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export const getAuthToken = () => localStorage.getItem("authToken") || null;

const fetchBills = async (setBills, setLoading, setError) => {
    setLoading(true);
    setError(null);

    try {
        let authToken = getAuthToken();
        if (!authToken) throw new Error("User is not authenticated. Please log in.");

        const response = await axios.get(`${API_BASE_URL}/bills/`, {
            headers: { Authorization: `Bearer ${authToken}` },
        });

        if (!Array.isArray(response.data)) throw new Error("Invalid data format from API.");

        setBills(response.data);
    } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
        toast.error(error.message);
    } finally {
        setLoading(false);
    }
};

const BillsList = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sortOption, setSortOption] = useState("name");
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        fetchBills(setBills, setLoading, setError);
    }, [refreshTrigger]);

    const updateBillStatus = async (billId, newStatus) => {
        let authToken = getAuthToken();
        if (!authToken) {
            toast.error("Authentication token is missing.");
            return;
        }

        try {
            const response = await axios.patch(
                `${API_BASE_URL}/bills/${billId}/`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                setRefreshTrigger(prev => prev + 1);
                toast.success(`Bill status updated to ${newStatus}.`);
            }
        } catch (error) {
            console.error("Error updating bill status:", error);
            toast.error("Failed to update bill status.");
        }
    };

    const sortedBills = [...bills].sort((a, b) => {
        if (sortOption === "name") return (a.name || "").localeCompare(b.name || "");
        if (sortOption === "amount") return (a.amount || 0) - (b.amount || 0);
        return 0;
    });

    return (
        <Container className="mt-4">
            <Toaster />
            <h2 className="text-center mb-4">All Bills</h2>
            {refreshTrigger === 0 && <BillReminders refreshTrigger={refreshTrigger} />}

            <Dropdown className="mb-3 sortbox text-center" disabled={bills.length === 0}>
                <Dropdown.Toggle variant="secondary">Sort by: {sortOption}</Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setSortOption("name")}>Name</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortOption("amount")}>Amount</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            {loading && <Spinner animation="border" className="d-block mx-auto" />}
            {error && <Alert variant="danger">{error}</Alert>}

            <div className="bills-container">
                {sortedBills.length > 0 ? (
                    sortedBills.map((bill) => (
                        <div className="bill-card" key={bill.id}>
                            <div className="bill-header">{bill.name}</div>
                            <div className="bill-body">
                                <h4>Rs. {bill.amount}</h4>
                                <div className="bill-badge">{bill.status}</div>
                                <p className="bill-description">
                                    <strong>Description:</strong> {bill.description || "No description provided"}
                                </p>
                                <p className="bill-due-date">
                                    <strong>Due Date:</strong> {new Date(bill.due_date).toLocaleDateString("en-US", {
                                        weekday: "short", year: "numeric", month: "short", day: "numeric"
                                    })}
                                </p>
                            </div>
                            <div className="bill-footer">
                                <Dropdown>
                                    <Dropdown.Toggle variant="primary" size="sm">
                                        Change Status
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {["pending", "due", "done"].map((status) => (
                                            <Dropdown.Item
                                                key={status}
                                                onClick={() => updateBillStatus(bill.id, status)}
                                            >
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                    ))
                ) : (
                    !loading && <p className="text-center">No bills available.</p>
                )}
            </div>
        </Container>
    );
};

export default BillsList;
