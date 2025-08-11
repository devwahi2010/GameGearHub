import React, { useState } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Image } from 'react-bootstrap';
import BangaloreMapPicker from '../components/BangaloreMapPicker';

function CreateDevice() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    price_per_day: '',
    available_from: '',
    available_to: '',
    rules: '',
    image: null,
    latitude: '',
    longitude: '',
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files.length > 0) {
      setFormData((prev) => ({ ...prev, image: files[0] }));
      setPreviewUrl(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMapSelect = ({ latitude, longitude }) => {
    setFormData((prev) => ({
      ...prev,
      latitude,
      longitude,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, val]) => form.append(key, val));
      await axiosInstance.post('devices/', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/devices');
    } catch {
      setError('❌ Failed to create device. Please try again.');
    }
  };

  return (
    <Container className="mt-4">
      <h2>Create New Device Listing</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Control
          name="title"
          placeholder="Title"
          onChange={handleChange}
          required
          className="mb-2"
        />
        <Form.Control
          as="textarea"
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
          className="mb-2"
        />
        <Form.Control
          name="city"
          placeholder="City"
          onChange={handleChange}
          required
          className="mb-2"
        />
        <Form.Control
          name="price_per_day"
          type="number"
          placeholder="Price per day"
          onChange={handleChange}
          required
          className="mb-2"
        />
        <Form.Control
          name="available_from"
          type="date"
          onChange={handleChange}
          required
          className="mb-2"
        />
        <Form.Control
          name="available_to"
          type="date"
          onChange={handleChange}
          required
          className="mb-2"
        />
        <Form.Control
          as="textarea"
          name="rules"
          placeholder="Rules (optional)"
          onChange={handleChange}
          className="mb-2"
        />
        <Form.Control
          name="image"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="mb-3"
        />

        {previewUrl && (
          <div className="mb-3">
            <Image src={previewUrl} alt="Preview" thumbnail style={{ maxWidth: '200px' }} />
          </div>
        )}

        {/* 📍 Replaced with Bangalore-only map */}
        <div className="mb-3">
          <BangaloreMapPicker setCoords={handleMapSelect} />
          {formData.latitude && formData.longitude && (
            <small className="text-muted">
              Selected Location: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
            </small>
          )}
        </div>

        <Button type="submit" variant="primary">Submit</Button>
      </Form>
    </Container>
  );
}

export default CreateDevice;