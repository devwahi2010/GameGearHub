// src/pages/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import HeroSection from '../components/HeroSection';

function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('devices/')
      .then(res => setDevices(res.data))
      .catch(err => console.error(err));

    axiosInstance.get('my-rentals/')
      .then(res => setRequests(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <HeroSection
        title="Welcome to GameGearHub 🎮"
        subtitle="List your gaming gear or rent from others. Connect, chat, and play smarter!"
      />

      <Container className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Your Devices</h4>
          <Button onClick={() => navigate('/create-device')} variant="primary">
            + List New Device
          </Button>
        </div>

        <Row>
          {devices.length > 0 ? (
            devices.map((d) => (
              <Col key={d.id} md={6} lg={4}>
                <Card
                  className="mb-3 shadow-sm"
                  onClick={() => navigate(`/devices/${d.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {d.image ? (
                    <Card.Img
                      variant="top"
                      src={d.image}
                      alt={`${d.title} image`}
                      style={{ maxHeight: '200px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        height: '200px',
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#999',
                      }}
                    >
                      No image available
                    </div>
                  )}
                  <Card.Body>
                    <Card.Title>{d.title}</Card.Title>
                    <Card.Text>
                      {d.city} • ₹{d.price_per_day}/day
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-muted">No devices listed yet.</p>
          )}
        </Row>

        <h4 className="mt-4">Your Rental Requests</h4>
        <Row>
          {requests.length > 0 ? (
            requests.map((r) => (
              <Col key={r.id} md={6} lg={4}>
                <Card className="mb-3">
                  <Card.Body>
                    <Card.Title>{r.device_title}</Card.Title>
                    <Card.Text>
                      {r.start_date} → {r.end_date} <br />
                      Status: {r.approved ? '✅ Approved' : '⏳ Pending'}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-muted">No rental requests made yet.</p>
          )}
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;