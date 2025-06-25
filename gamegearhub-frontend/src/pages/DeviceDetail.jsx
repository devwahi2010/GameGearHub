import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axios';

function DeviceDetail() {
  const { id } = useParams();
  const [device, setDevice] = useState(null);
  const [dates, setDates] = useState({ start_date: '', end_date: '' });
  const [status, setStatus] = useState('');

  useEffect(() => {
    axiosInstance.get(`devices/${id}/`)
      .then(res => setDevice(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`rent/${id}/`, dates);
      setStatus('✅ Rental request sent!');
    } catch (err) {
      setStatus('❌ Failed. Check dates or login again.');
    }
  };

  return device ? (
    <div className="container mt-4">
      <h2>{device.title}</h2>
      {device.image && <img src={device.image} alt={device.title} className="img-fluid my-3" style={{ maxWidth: '300px' }} />}
      <p>{device.description}</p>
      <p>City: {device.city}</p>
      <p>Price: ₹{device.price_per_day} per day</p>
      <p>Available: {device.available_from} to {device.available_to}</p>
      <form onSubmit={handleSubmit}>
        <input type="date" name="start_date" required onChange={(e) => setDates({ ...dates, start_date: e.target.value })} />
        <input type="date" name="end_date" required onChange={(e) => setDates({ ...dates, end_date: e.target.value })} />
        <button className="btn btn-success btn-sm mx-2">Request Rental</button>
      </form>
      <p>{status}</p>
    </div>
  ) : <p>Loading...</p>;
}

export default DeviceDetail;
