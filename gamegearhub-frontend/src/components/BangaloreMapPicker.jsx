import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const BangaloreMapPicker = ({ setCoords }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

    if (!apiKey) {
      console.error("❌ MapTiler API key missing in .env");
      return;
    }

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`,
      center: [77.5946, 12.9716], // Center on Bangalore [lng, lat]
      zoom: 12,
      minZoom: 11,
      maxZoom: 16,
      maxBounds: [
        [77.35, 12.80], // Southwest (Bangalore bounding box)
        [77.75, 13.10]  // Northeast
      ]
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.on('click', (e) => {
      const { lng, lat } = e.lngLat;

      if (markerRef.current) {
        markerRef.current.setLngLat([lng, lat]);
      } else {
        markerRef.current = new maplibregl.Marker({ color: '#d00' })
          .setLngLat([lng, lat])
          .addTo(map);
      }

      setCoords({ latitude: lat, longitude: lng });
    });

    return () => map.remove();
  }, [setCoords]);

  return (
    <>
      <div
        ref={mapRef}
        style={{
          height: '300px',
          width: '100%',
          borderRadius: '8px',
          border: '1px solid #ccc'
        }}
      />
      <p style={{ fontSize: '12px', textAlign: 'center', marginTop: '4px' }}>
        Map data © OpenStreetMap contributors via MapTiler (Bangalore only)
      </p>
    </>
  );
};

export default BangaloreMapPicker;