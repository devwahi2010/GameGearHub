// src/pages/Register.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [full_name, setFullName] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('register/', { email, password, full_name });
      setMessage('✅ Registered successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setMessage('❌ Registration failed. Try again.');
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4">Register</h2>
      {message && <Alert variant={message.startsWith('✅') ? 'success' : 'danger'}>{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="registerName">
          <Form.Control
            type="text"
            placeholder="Full Name"
            value={full_name}
            onChange={e => setFullName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="registerEmail">
          <Form.Control
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="registerPassword">
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit" variant="success" className="w-100">Register</Button>
      </Form>
    </Container>
  );
}

export default Register;
