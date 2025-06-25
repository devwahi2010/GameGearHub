// src/pages/MyRentals.jsx

import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';

function MyRentals() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axiosInstance.get('my-rentals/')
      .then(res => setRequests(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>My Rental Requests</h2>
      {requests.map(req => (
        <div key={req.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <p><strong>Device:</strong> {req.device_title}</p>
          <p><strong>From:</strong> {req.start_date}</p>
          <p><strong>To:</strong> {req.end_date}</p>
          <p><strong>Status:</strong> {req.approved ? 'Approved ✅' : 'Pending ⏳'}</p>
        </div>
      ))}
    </div>
  );
}

export default MyRentals;
