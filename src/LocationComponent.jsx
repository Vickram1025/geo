import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

const LocationComponent = () => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          });
        },
        (error) => {
          setLocation((prev) => ({ ...prev, error: error.message }));
        }
      );
    } else {
      setLocation((prev) => ({
        ...prev,
        error: 'Geolocation not supported',
      }));
    }
  }, []);

  const { latitude, longitude, error } = location;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">📍 Your Current Location</h2>

      {error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : latitude ? (
        <>
          <div className="mb-4">
            <p>Latitude: {latitude}</p>
            <p>Longitude: {longitude}</p>
          </div>

          <div className="h-[400px] w-full rounded-lg shadow border">
            <MapContainer center={[latitude, longitude]} zoom={13} className="h-full w-full">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[latitude, longitude]}>
                <Popup>You are here</Popup>
              </Marker>
            </MapContainer>
          </div>
        </>
      ) : (
        <p className="text-gray-600">Getting location...</p>
      )}
    </div>
  );
};

export default LocationComponent;
