import React from 'react';

function DeviceCard({ device }) {
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      maxWidth: '400px'
    }}>
      <h3>{device.title}</h3>
      <p>{device.description}</p>
      <p><strong>City:</strong> {device.city}</p>
      <p><strong>Price/Day:</strong> ₹{device.price_per_day}</p>
      <p><strong>Available:</strong> {device.available_from} to {device.available_to}</p>
      <p><strong>Rules:</strong> {device.rules || 'None'}</p>
    </div>
  );
}

export default DeviceCard;
