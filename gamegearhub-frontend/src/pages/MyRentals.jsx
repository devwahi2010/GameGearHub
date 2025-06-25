import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { Container, Card } from 'react-bootstrap';

function MyRentals() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axiosInstance.get('my-rentals/')
      .then(res => setRequests(res.data))
      .catch(console.error);
  }, []);

  return (
    <Container className="mt-4">
      <h2>My Rental Requests</h2>
      {requests.map(req => (
        <Card key={req.id} className="mb-3">
          <Card.Body>
            <Card.Title>{req.device_title}</Card.Title>
            <Card.Text>
              <strong>From:</strong> {req.start_date} <br />
              <strong>To:</strong> {req.end_date} <br />
              <strong>Status:</strong> {req.approved ? '✅ Approved' : '⏳ Pending'}
            </Card.Text>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}

export default MyRentals;
