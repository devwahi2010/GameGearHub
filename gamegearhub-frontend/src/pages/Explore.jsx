import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';

function Explore() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('public-devices/')
      .then(res => setDevices(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <HeroSection
        title="🔎 Explore Devices Near You"
        subtitle="Browse gaming consoles, PCs, and gear listed by fellow gamers. Click to view and send rental requests!"
      />

      <Container>
        {loading ? (
          <p>Loading devices...</p>
        ) : devices.length === 0 ? (
          <Alert variant="info">No devices available for rent at the moment.</Alert>
        ) : (
          <Row>
            {devices.map(dev => (
              <Col key={dev.id} md={6} lg={4}>
                <Card className="mb-3 h-100 shadow-sm">
                  {dev.image && (
                    <Card.Img
                      variant="top"
                      src={dev.image}
                      alt={dev.title}
                      style={{ objectFit: 'cover', height: '200px' }}
                    />
                  )}
                  <Card.Body>
                    <Card.Title>{dev.title}</Card.Title>
                    <Card.Text>
                      <strong>📍 {dev.city}</strong> <br />
                      ₹{dev.price_per_day} / day
                    </Card.Text>
                    <Button variant="primary" onClick={() => navigate(`/devices/${dev.id}`)}>
                      View Device
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
}

export default Explore;