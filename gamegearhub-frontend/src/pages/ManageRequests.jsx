// src/pages/ManageRequests.jsx

import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function ManageRequests() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const fetchRequests = () => {
    axiosInstance.get('manage-requests/')
      .then(res => setRequests(res.data))
      .catch(err => console.error('Failed to load requests', err));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = (id, action) => {
    axiosInstance.post(`manage-requests/${id}/${action}/`)
      .then(fetchRequests)
      .catch(err => console.error('Failed to update status', err));
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Manage Incoming Rental Requests</h2>

      {requests.length === 0 && (
        <p className="text-muted">You don’t have any rental requests yet.</p>
      )}

      {requests.map((req) => (
        <Card key={req.id} className="mb-3 shadow-sm">
          <Card.Body>
            <Card.Title>{req.device_title}</Card.Title>
            <Card.Text>
              <strong>Renter:</strong> {req.renter_email} <br />
              <strong>From:</strong> {req.start_date} <br />
              <strong>To:</strong> {req.end_date} <br />
              <strong>Status:</strong>{' '}
              {req.approved ? (
                <span className="text-success">✅ Approved</span>
              ) : (
                <span className="text-warning">⏳ Pending</span>
              )}
            </Card.Text>

            {req.approved ? (
              <Button
                variant="info"
                size="sm"
                className="me-2"
                onClick={() => navigate(`/chat/${req.id}`)}
              >
                💬 Chat
              </Button>
            ) : (
              <>
                <Button
                  variant="success"
                  size="sm"
                  className="me-2"
                  onClick={() => handleAction(req.id, 'approve')}
                >
                  ✅ Approve
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleAction(req.id, 'reject')}
                >
                  ❌ Reject
                </Button>
              </>
            )}
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}

export default ManageRequests;