import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { useAuth } from '../auth/AuthContext';
import DeviceCard from '../components/DeviceCard';

function Devices() {
  const [devices, setDevices] = useState([]);
  const { authTokens } = useAuth();

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await axiosInstance.get('devices/', {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`
          }
        });
        setDevices(res.data);
      } catch (err) {
        console.error('Error fetching devices:', err);
      }
    };

    fetchDevices();
  }, [authTokens]);

  return (
    <div>
      <h2>Your Listed Devices</h2>
      {devices.length === 0 ? (
        <p>No devices listed yet.</p>
      ) : (
        devices.map(device => (
          <DeviceCard key={device.id} device={device} />
        ))
      )}
    </div>
  );
}

export default Devices;
