import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function MapDisplay({ destinations }) {
  return (
    <div className="map-display">
      <h2>Map Display</h2>
      <MapContainer center={[51.505, -0.09]} zoom={3} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {destinations.map((destination, index) => (
          <Marker position={[destination.latitude, destination.longitude]} key={index}>
            <Popup>
              <div>
                <h3>{destination.name}</h3>
                <p>Arrival Date: {destination.arrivalDate}</p>
                <p>Stay Duration: {destination.stayDuration} days</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
