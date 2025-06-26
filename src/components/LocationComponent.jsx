import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { stores } from '../data/stores';
import { getDistanceFromLatLonInKm } from '../utils/distance';

const LocationComponent = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null, error: null });
  const [nearestStore, setNearestStore] = useState(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude, error: null });

          const sortedStores = stores
            .map((store) => ({
              ...store,
              distance: getDistanceFromLatLonInKm(latitude, longitude, store.lat, store.lng),
            }))
            .sort((a, b) => a.distance - b.distance);

          setNearestStore(sortedStores[0]);
        },
        (error) => {
          setLocation((prev) => ({ ...prev, error: error.message }));
        }
      );
    } else {
      setLocation((prev) => ({ ...prev, error: 'Geolocation not supported' }));
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
            {nearestStore && (
              <p className="mt-2 text-green-600 font-semibold">
                Nearest Store: {nearestStore.name} ({nearestStore.distance.toFixed(2)} km)
              </p>
            )}
          </div>

          <div className="h-[500px] w-full rounded-lg shadow border">
            <MapContainer center={[latitude, longitude]} zoom={13} className="h-full w-full">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <Marker position={[latitude, longitude]}>
                <Popup>You are here</Popup>
              </Marker>

              {stores.map((store, index) => (
                <Marker key={index} position={[store.lat, store.lng]}>
                  <Popup>
                    <strong>{store.name}</strong><br />
                    {store.address}
                  </Popup>
                </Marker>
              ))}

              {nearestStore && (
                <Polyline
                  positions={[[latitude, longitude], [nearestStore.lat, nearestStore.lng]]}
                  pathOptions={{ color: 'red' }}
                />
              )}
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
