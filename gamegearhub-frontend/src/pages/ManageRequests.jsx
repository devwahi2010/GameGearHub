// src/pages/ManageRequests.jsx

import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { Container, Card, Button } from 'react-bootstrap';

function ManageRequests() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = () => {
    axiosInstance.get('manage-requests/')
      .then(res => setRequests(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = (id, action) => {
    axiosInstance.post(`manage-requests/${id}/${action}/`)  // ✅ fixed interpolation
      .then(fetchRequests)
      .catch(err => console.error(err));
  };

  return (
    <Container className="mt-4">
      <h2>Manage Incoming Rental Requests</h2>
      {requests.map(req => (
        <Card key={req.id} className="mb-3">
          <Card.Body>
            <Card.Title>{req.device_title}</Card.Title>
            <Card.Text><strong>Renter:</strong> {req.renter_email}</Card.Text>
            <Card.Text><strong>From:</strong> {req.start_date}</Card.Text>
            <Card.Text><strong>To:</strong> {req.end_date}</Card.Text>
            <Card.Text><strong>Status:</strong> {req.approved ? '✅ Approved' : '⏳ Pending'}</Card.Text>
            {!req.approved && (
              <>
                <Button variant="success" size="sm" onClick={() => handleAction(req.id, 'approve')} className="me-2">Approve</Button>
                <Button variant="danger" size="sm" onClick={() => handleAction(req.id, 'reject')}>Reject</Button>
              </>
            )}
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}

export default ManageRequests;
