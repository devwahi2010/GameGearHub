import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axios';

function DeviceDetail() {
  const { id } = useParams();
  const [device, setDevice] = useState(null);
  const [dates, setDates] = useState({ start_date: '', end_date: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    axiosInstance.get(`devices/${id}/`)
      .then(res => setDevice(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');
    setIsSubmitting(true);

    if (dates.start_date >= dates.end_date) {
      setError('⚠️ End date must be after start date.');
      setIsSubmitting(false);
      return;
    }

    try {
      await axiosInstance.post(`rent/${id}/`, dates);
      setStatus('✅ Rental request sent!');
      setDates({ start_date: '', end_date: '' });
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        '❌ Failed. Please check the dates or try again.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return device ? (
    <div className="container mt-4">
      <h2>{device.title}</h2>
      {device.image && (
        <img
          src={device.image}
          alt={device.title}
          className="img-fluid my-3"
          style={{ maxWidth: '300px' }}
        />
      )}
      <p>{device.description}</p>
      <p>City: {device.city}</p>
      <p>Price: ₹{device.price_per_day} per day</p>
      <p>Available: {device.available_from} to {device.available_to}</p>

      {device.is_owner ? (
        <p className="text-muted">ℹ️ This is your own device listing.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <input
              type="date"
              name="start_date"
              value={dates.start_date}
              required
              onChange={(e) => setDates({ ...dates, start_date: e.target.value })}
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <input
              type="date"
              name="end_date"
              value={dates.end_date}
              required
              onChange={(e) => setDates({ ...dates, end_date: e.target.value })}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-success btn-sm mx-2" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Request Rental'}
          </button>
        </form>
      )}

      {error && <p className="text-danger mt-2">{error}</p>}
      {status && <p className="text-success mt-2">{status}</p>}
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default DeviceDetail;