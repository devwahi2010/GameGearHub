// src/pages/Explore.jsx

import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 🛠️ Fix Leaflet icon loading in Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// 🔍 Component to programmatically move map
function MapFlyTo({ coords }) {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.flyTo([parseFloat(coords.latitude), parseFloat(coords.longitude)], 14, {
        duration: 1.5,
      });
    }
  }, [coords, map]);

  return null;
}

function Explore() {
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [search, setSearch] = useState('');
  const [focusedCoords, setFocusedCoords] = useState(null);
  const navigate = useNavigate();

  // 🔄 Fetch devices on load
  useEffect(() => {
    axiosInstance.get('public-devices/')
      .then(res => {
        setDevices(res.data);
        setFilteredDevices(res.data);
      })
      .catch(console.error);
  }, []);

  // 🔍 Search filter
  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearch(keyword);
    const filtered = devices.filter(d =>
      d.title.toLowerCase().includes(keyword) ||
      d.city.toLowerCase().includes(keyword)
    );
    setFilteredDevices(filtered);
  };

  return (
    <Container fluid className="mt-4">
      <h2 className="mb-3 text-center">🔍 Explore Rentable Devices Near You</h2>

      <Row>
        {/* Left Column: Search & List */}
        <Col md={4} className="pe-md-0 mb-3">
          <Form.Control
            type="text"
            placeholder="Search by title or city..."
            value={search}
            onChange={handleSearch}
            className="mb-3"
          />

          {filteredDevices.map((dev) => (
            <Card key={dev.id} className="mb-3 shadow-sm">
              {dev.image && (
                <Card.Img
                  variant="top"
                  src={dev.image}
                  alt={`${dev.title} image`}
                  style={{ height: '160px', objectFit: 'cover' }}
                />
              )}
              <Card.Body>
                <Card.Title>{dev.title}</Card.Title>
                <Card.Text>
                  {dev.city} • ₹{dev.price_per_day}/day
                </Card.Text>
                <div className="d-flex justify-content-between">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/devices/${dev.id}`)}
                  >
                    View
                  </Button>
                  {dev.latitude && dev.longitude && (
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() =>
                        setFocusedCoords({
                          latitude: parseFloat(dev.latitude),
                          longitude: parseFloat(dev.longitude),
                        })
                      }
                    >
                      📍 Locate
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          ))}
        </Col>

        {/* Right Column: Leaflet Map */}
        <Col md={8}>
          <MapContainer
            center={[20.5937, 78.9629]} // Default: India
            zoom={5}
            scrollWheelZoom={true}
            style={{ height: '80vh', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            />
            {focusedCoords && <MapFlyTo coords={focusedCoords} />}
            {filteredDevices.map((dev) => (
              dev.latitude && dev.longitude && (
                <Marker
                  key={dev.id}
                  position={[parseFloat(dev.latitude), parseFloat(dev.longitude)]}
                >
                  <Popup>
                    <strong>{dev.title}</strong><br />
                    ₹{dev.price_per_day}/day<br />
                    {dev.city}
                  </Popup>
                </Marker>
              )
            ))}
          </MapContainer>
        </Col>
      </Row>
    </Container>
  );
}

export default Explore;