import React, { useState } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';

function CreateDevice() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    price_per_day: '',
    available_from: '',
    available_to: '',
    rules: ''
  });

  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('devices/', formData);
      navigate('/devices');
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError('Failed to create device');
    }
  };

  return (
    <div>
      <h2>Create Device</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" onChange={handleChange} required /><br />
        <textarea name="description" placeholder="Description" onChange={handleChange} required /><br />
        <input name="city" placeholder="City" onChange={handleChange} required /><br />
        <input name="price_per_day" type="number" placeholder="Price per day" onChange={handleChange} required /><br />
        <input name="available_from" type="date" onChange={handleChange} required /><br />
        <input name="available_to" type="date" onChange={handleChange} required /><br />
        <textarea name="rules" placeholder="Rules" onChange={handleChange} /><br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default CreateDevice;
