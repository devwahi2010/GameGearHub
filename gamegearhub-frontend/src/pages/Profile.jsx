import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { Container, Button, Card } from 'react-bootstrap';

function Profile() {
  const { logout } = useAuth();

  return (
    <Container className="mt-4 d-flex justify-content-center">
      <Card style={{ width: '24rem' }} className="text-center shadow">
        <Card.Body>
          <Card.Title>🎮 Welcome to Your Profile</Card.Title>
          <Card.Text>
            You are successfully logged in. Use the navigation to explore devices, rentals, and chats.
          </Card.Text>
          <Button variant="danger" onClick={logout}>Logout</Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Profile;
