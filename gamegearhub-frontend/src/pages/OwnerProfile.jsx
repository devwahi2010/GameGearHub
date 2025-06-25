import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { Container, Card } from 'react-bootstrap';

function OwnerProfile() {
  const { ownerId } = useParams();
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    axiosInstance.get(`owner/${ownerId}/`)
      .then(res => setOwner(res.data))
      .catch(console.error);
  }, [ownerId]);

  if (!owner) return <p>Loading owner profile...</p>;

  return (
    <Container className="mt-4">
      <h2>{owner.full_name}'s Profile</h2>
      <p>Email: {owner.email}</p>
      <h4>Listed Devices:</h4>
      {owner.devices.map(dev => (
        <Card key={dev.id} className="mb-3">
          <Card.Body>
            <Card.Title>{dev.title}</Card.Title>
            <Card.Text>{dev.description}</Card.Text>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}

export default OwnerProfile;
