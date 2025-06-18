// gamegearhub-frontend/src/pages/Register.jsx

import React, { useState } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [full_name, setFullName] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('register/', { email, password, full_name });
      setSuccess('Registered! You can now login.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setSuccess('Error occurred. Try again.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {success && <p>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={full_name}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
          required
        /><br />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        /><br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        /><br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
