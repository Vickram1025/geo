import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

const UpdateMapCenter = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position]);
  return null;
};

const LiveLocationTracker = () => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });

  const watchIdRef = useRef(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          });
        },
        (error) => {
          setLocation((prev) => ({ ...prev, error: error.message }));
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000,
        }
      );
    } else {
      setLocation((prev) => ({
        ...prev,
        error: 'Geolocation not supported by your browser.',
      }));
    }

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const { latitude, longitude, error } = location;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">🛰️ Live Location Tracker</h1>

      {error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : latitude ? (
        <>
          <div className="mb-4">
            <p>Latitude: {latitude}</p>
            <p>Longitude: {longitude}</p>
          </div>

          <div className="h-[400px] w-full rounded-lg shadow border">
            <MapContainer center={[latitude, longitude]} zoom={15} className="h-full w-full">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[latitude, longitude]}>
                <Popup>You are here (live)</Popup>
              </Marker>
              <UpdateMapCenter position={[latitude, longitude]} />
            </MapContainer>
          </div>
        </>
      ) : (
        <p>Fetching location...</p>
      )}
    </div>
  );
};

export default LiveLocationTracker;
