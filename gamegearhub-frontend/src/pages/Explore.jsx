import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Explore() {
  const [devices, setDevices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('public-devices/')
      .then(res => setDevices(res.data))
      .catch(console.error);
  }, []);

  return (
    <Container className="mt-4">
      <h2>Explore Devices</h2>
      <Row>
        {devices.map(dev => (
          <Col key={dev.id} md={6} lg={4}>
            <Card className="mb-3">
              {dev.image && <Card.Img variant="top" src={dev.image} />}
              <Card.Body>
                <Card.Title>{dev.title}</Card.Title>
                <Card.Text>{dev.city} — ₹{dev.price_per_day}/day</Card.Text>
                <Button onClick={() => navigate(`/devices/${dev.id}`)}>View</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Explore;
