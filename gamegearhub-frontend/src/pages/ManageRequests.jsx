// src/pages/ManageRequests.jsx

import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';

function ManageRequests() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = () => {
    axiosInstance.get('manage-requests/')
      .then(res => setRequests(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = (id, action) => {
    axiosInstance.post(`manage-requests/${id}/${action}/`)
      .then(() => fetchRequests())
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Manage Incoming Rental Requests</h2>
      {requests.map(req => (
        <div key={req.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <p><strong>Device:</strong> {req.device_title}</p>
          <p><strong>Renter:</strong> {req.renter_email}</p>
          <p><strong>From:</strong> {req.start_date}</p>
          <p><strong>To:</strong> {req.end_date}</p>
          <p><strong>Status:</strong> {req.approved ? 'Approved ✅' : 'Pending ⏳'}</p>
          {!req.approved && (
            <>
              <button onClick={() => handleAction(req.id, 'approve')}>Approve</button>
              <button onClick={() => handleAction(req.id, 'reject')}>Reject</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default ManageRequests;
