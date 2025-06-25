// src/pages/MyRentals.jsx

import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { Container, Card, ButtonGroup, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function MyRentals() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('my-rentals/')
      .then(res => setRequests(res.data))
      .catch(console.error);
  }, []);

  const filteredRequests = requests.filter(req => {
    if (filter === 'approved') return req.approved;
    if (filter === 'pending') return !req.approved;
    return true;
  });

  return (
    <Container className="mt-4">
      <h2>My Rental Requests</h2>

      <ButtonGroup className="mb-3">
        <Button variant={filter === 'all' ? 'dark' : 'outline-dark'} onClick={() => setFilter('all')}>All</Button>
        <Button variant={filter === 'approved' ? 'success' : 'outline-success'} onClick={() => setFilter('approved')}>Approved</Button>
        <Button variant={filter === 'pending' ? 'warning' : 'outline-warning'} onClick={() => setFilter('pending')}>Pending</Button>
      </ButtonGroup>

      {filteredRequests.map(req => (
        <Card key={req.id} className="mb-3">
          <Card.Body>
            <Card.Title>{req.device_title}</Card.Title>
            <Card.Text>
              <strong>From:</strong> {req.start_date} <br />
              <strong>To:</strong> {req.end_date} <br />
              <strong>Status:</strong> {req.approved ? '✅ Approved' : '⏳ Pending'}
            </Card.Text>

            {req.approved && (
              <Button variant="info" size="sm" onClick={() => navigate(`/chat/${req.id}`)}>
                💬 Chat
              </Button>
            )}
          </Card.Body>
        </Card>
      ))}

      {filteredRequests.length === 0 && <p>No rental requests match this filter.</p>}
    </Container>
  );
}

export default MyRentals;
