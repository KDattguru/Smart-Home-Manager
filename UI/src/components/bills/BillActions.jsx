import React from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';

const BillActions = ({ bill, setBills }) => {
    const handleMarkAsPaid = () => {
        axios.patch(`http://127.0.0.1:8000/api/bills/${bill.id}/mark-paid/`)
            .then(response => {
                setBills(prevBills => prevBills.map(b => (b.id === bill.id ? response.data : b)));
            })
            .catch(error => console.error('Error updating bill status:', error));
    };

    return (
        <div className="mt-3">
            {bill.status !== 'paid' && (
                <Button variant="primary" onClick={handleMarkAsPaid}>
                    Mark as Paid
                </Button>
            )}
        </div>
    );
};

export default BillActions;
