import React, { useEffect, useRef, useState } from 'react';
import axiosInstance from '../api/axios';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

function Explore() {
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [search, setSearch] = useState('');
  const mapRef = useRef(null);
  const mapContainer = useRef(null);
  const navigate = useNavigate();

  // 🔄 Fetch all public devices
  useEffect(() => {
    axiosInstance.get('public-devices/')
      .then(res => {
        setDevices(res.data);
        setFilteredDevices(res.data);
      })
      .catch(console.error);
  }, []);

  // 🗺️ Initialize Bangalore-only MapLibre
  useEffect(() => {
    const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`,
      center: [77.5946, 12.9716], // Bangalore center
      zoom: 11,
      maxZoom: 16,
      minZoom: 10,
      maxBounds: [
        [77.45, 12.80], // Southwest bounds of Bangalore
        [77.75, 13.10]  // Northeast bounds of Bangalore
      ]
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    mapRef.current = map;

    return () => map.remove();
  }, []);

  // 📍 Render markers for filtered devices
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // Remove old markers
    if (map._deviceMarkers) {
      map._deviceMarkers.forEach(marker => marker.remove());
    }

    // Add new markers
    map._deviceMarkers = filteredDevices.map(dev => {
      if (!dev.latitude || !dev.longitude) return null;

      const marker = new maplibregl.Marker()
        .setLngLat([parseFloat(dev.longitude), parseFloat(dev.latitude)])
        .setPopup(
          new maplibregl.Popup({ offset: 25 }).setHTML(`
            <strong>${dev.title}</strong><br/>
            ₹${dev.price_per_day}/day<br/>
            ${dev.city}<br/>
            <button id="view-${dev.id}" class="btn btn-sm btn-link p-0 mt-1">View</button>
          `)
        )
        .addTo(map);

      marker.getElement().addEventListener('click', () => {
        setTimeout(() => {
          const btn = document.getElementById(`view-${dev.id}`);
          if (btn) {
            btn.onclick = () => navigate(`/devices/${dev.id}`);
          }
        }, 200);
      });

      return marker;
    }).filter(Boolean);
  }, [filteredDevices, navigate]);

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearch(keyword);
    const filtered = devices.filter(d =>
      d.title.toLowerCase().includes(keyword) ||
      d.city.toLowerCase().includes(keyword)
    );
    setFilteredDevices(filtered);
  };

  const handleFlyTo = (lat, lng) => {
    if (mapRef.current) {
      mapRef.current.flyTo({ center: [lng, lat], zoom: 13, speed: 1.2 });
    }
  };

  return (
    <Container fluid className="mt-4">
      <h2 className="mb-3 text-center">🔍 Explore Rentable Devices in Bangalore</h2>

      <Row>
        {/* Sidebar */}
        <Col md={4}>
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
                  alt={dev.title}
                  style={{ height: '160px', objectFit: 'cover' }}
                />
              )}
              <Card.Body>
                <Card.Title>{dev.title}</Card.Title>
                <Card.Text>{dev.city} • ₹{dev.price_per_day}/day</Card.Text>
                <div className="d-flex justify-content-between">
                  <Button size="sm" variant="primary" onClick={() => navigate(`/devices/${dev.id}`)}>View</Button>
                  {dev.latitude && dev.longitude && (
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => handleFlyTo(parseFloat(dev.latitude), parseFloat(dev.longitude))}
                    >
                      📍 Locate
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          ))}
        </Col>

        {/* Map Container */}
        <Col md={8}>
          <div
            ref={mapContainer}
            style={{ height: '80vh', width: '100%', borderRadius: '6px', overflow: 'hidden' }}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Explore;