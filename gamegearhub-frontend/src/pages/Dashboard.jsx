import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('devices/')
      .then(res => setDevices(res.data))
      .catch(err => console.error(err));

    axiosInstance.get('my-rentals/')
      .then(res => setRequests(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Welcome to GameGearHub 🎮</h2>
      <button onClick={() => navigate('/create-device')} className="btn btn-primary mt-3">+ List New Device</button>

      <h4 className="mt-4">Your Devices</h4>
      {devices.map(d => (
        <div key={d.id} className="card mb-2 p-2" onClick={() => navigate(`/devices/${d.id}`)} style={{ cursor: 'pointer' }}>
          <strong>{d.title}</strong> - {d.city} | ₹{d.price_per_day}/day
        </div>
      ))}

      <h4 className="mt-4">Your Rental Requests</h4>
      {requests.map(r => (
        <div key={r.id} className="border p-2 mb-2">
          <p><strong>{r.device_title}</strong></p>
          <p>{r.start_date} → {r.end_date}</p>
          <p>Status: {r.approved ? '✅ Approved' : '⏳ Pending'}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
