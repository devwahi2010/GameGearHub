import React, { useState } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';

function CreateDevice() {
  const [formData, setFormData] = useState({
    title: '', description: '', city: '',
    price_per_day: '', available_from: '', available_to: '',
    rules: '', image: null,
  });
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, val]) => form.append(key, val));
      await axiosInstance.post('devices/', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/devices');
    } catch {
      setError('Failed to create device');
    }
  };

  return (
    <Container className="mt-4">
      <h2>Create Device</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Control name="title" placeholder="Title" onChange={handleChange} required className="mb-2" />
        <Form.Control as="textarea" name="description" placeholder="Description" onChange={handleChange} required className="mb-2" />
        <Form.Control name="city" placeholder="City" onChange={handleChange} required className="mb-2" />
        <Form.Control name="price_per_day" type="number" placeholder="Price per day" onChange={handleChange} required className="mb-2" />
        <Form.Control name="available_from" type="date" onChange={handleChange} required className="mb-2" />
        <Form.Control name="available_to" type="date" onChange={handleChange} required className="mb-2" />
        <Form.Control as="textarea" name="rules" placeholder="Rules" onChange={handleChange} className="mb-2" />
        <Form.Control name="image" type="file" accept="image/*" onChange={handleChange} className="mb-3" />
        <Button type="submit" variant="primary">Submit</Button>
      </Form>
    </Container>
  );
}

export default CreateDevice;
