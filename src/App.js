import "./styles.css";
import React, { useState } from 'react';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import { Icon, divIcon, point } from "leaflet";

// create custom icon
const customIcon = new Icon({
  iconUrl: require("./icons/placeholder.png"),
  iconSize: [38, 38]
});

// custom cluster icon
const createClusterCustomIcon = function (cluster) {
  return new divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true)
  });
};

export default function App() {
  const [markers, setMarkers] = useState([]);

  const handleMapClick = (event) => {
    const { lat, lng } = event.latlng;
    const newMarker = {
      geocode: [lat, lng],
      popUp: `New Marker at (${lat.toFixed(4)}, ${lng.toFixed(4)})`
    };
    setMarkers(prevMarkers => [...prevMarkers, newMarker]);
  };

  return (
    <MapContainer center={[48.8566, 2.3522]} zoom={13}>
      <ChangeView center={[48.8566, 2.3522]} zoom={13} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterCustomIcon}
      >
        {/* Mapping through the markers */}
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.geocode} icon={customIcon}>
            <Popup>{marker.popUp}</Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
      <MapClickHandler onMapClick={handleMapClick} />
    </MapContainer>
  );
}

function ChangeView({ center, zoom }) {
  const map = useMapEvents({
    moveend: () => {
      map.setView(center, zoom);
    },
  });
  return null;
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e);
    },
  });
  return null;
}
