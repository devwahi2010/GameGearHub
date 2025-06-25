import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { useAuth } from '../auth/AuthContext';
import DeviceCard from '../components/DeviceCard';
import { Container, Row, Col, Alert } from 'react-bootstrap';

function Devices() {
  const [devices, setDevices] = useState([]);
  const { authTokens } = useAuth();

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await axiosInstance.get('devices/', {
          headers: { Authorization: `Bearer ${authTokens?.access}` }
        });
        setDevices(res.data);
      } catch (err) {
        console.error('Error fetching devices:', err);
      }
    };
    fetchDevices();
  }, [authTokens]);

  return (
    <Container className="mt-4">
      <h2>Your Listed Devices</h2>
      {devices.length === 0 ? (
        <Alert variant="warning">No devices listed yet.</Alert>
      ) : (
        <Row>
          {devices.map(device => (
            <Col key={device.id} md={6} lg={4}>
              <DeviceCard device={device} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Devices;
