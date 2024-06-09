import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Icon, divIcon, point } from 'leaflet';
import './style.css';

const customIcon = new Icon({
  iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
  iconSize: [24, 24],
});

const createClusterCustomIcon = function (cluster) {
  return new divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: 'custom-marker-cluster',
    iconSize: point(22, 22, true),
  });
};

const CustomMap = () => {
  const [itinerary, setItinerary] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [name, setName] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [duration, setDuration] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [showRoute, setShowRoute] = useState(false);

  useEffect(() => {
    const savedItinerary = localStorage.getItem('itinerary');
    const savedMarkers = localStorage.getItem('markers');

    if (savedItinerary) {
      setItinerary(JSON.parse(savedItinerary));
    }

    if (savedMarkers) {
      setMarkers(JSON.parse(savedMarkers));
    }
  }, []);

  const handleMapClick = async (e) => {
    const newMarker = {
      geocode: [e.latlng.lat, e.latlng.lng],
      popUp: `New marker at ${e.latlng.lat}, ${e.latlng.lng}`,
    };

    const newMarkers = [...markers];
    if (editIndex !== null) {
      if (newMarkers.length > 0) {
        newMarkers.pop(); // Remove the last marker
      }
      newMarkers.push(newMarker); // Add the new marker
      setMarkers(newMarkers);
      localStorage.setItem('markers', JSON.stringify(newMarkers));

      const address = await reverseGeocode(e.latlng.lat, e.latlng.lng);
      setTo(address); // Update the "to" address in the input field
    } else {
      setMarkers(prevMarkers => [...prevMarkers, newMarker]);
      localStorage.setItem('markers', JSON.stringify([...markers, newMarker]));

      const address = await reverseGeocode(e.latlng.lat, e.latlng.lng);
      if (!from) setFrom(address); // Set "from" address if it's empty
      setTo(address); // Set "to" address to the latest marker
    }
  };

  const handleAddItinerary = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updatedItinerary = [...itinerary];
      updatedItinerary[editIndex] = { name, date: arrivalDate, duration, route: `${from} - ${to}` };
      setItinerary(updatedItinerary);
      setEditIndex(null);
    } else {
      const newItineraryItem = { name, date: arrivalDate, duration, route: `${from} - ${to}` };
      setItinerary(prevItinerary => [...prevItinerary, newItineraryItem]);
    }
    localStorage.setItem('itinerary', JSON.stringify([...itinerary, { name, date: arrivalDate, duration, route: `${from} - ${to}` }]));
    setName('');
    setArrivalDate('');
    setDuration('');
    setFrom('');
    setTo('');
  };

  const handleEditItinerary = (index) => {
    const { name, date, duration, route } = itinerary[index];
    const [fromAddress, toAddress] = route.split(' - ');
    setName(name);
    setArrivalDate(date);
    setDuration(duration);
    setFrom(fromAddress);
    setTo(toAddress);
    setEditIndex(index);
  };

  const handleDeleteItinerary = (index) => {
    const updatedItinerary = [...itinerary];
    updatedItinerary.splice(index, 1);
    setItinerary(updatedItinerary);
    localStorage.setItem('itinerary', JSON.stringify(updatedItinerary));
  };

  const handleClearAll = () => {
    setItinerary([]);
    setMarkers([]);
    localStorage.removeItem('itinerary');
    localStorage.removeItem('markers');
  };

  const handleViewRoute = () => {
    setShowRoute(prevShowRoute => !prevShowRoute);
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error('Error fetching address:', error);
      return '';
    }
  };

  return (
          <div className="map-container">
        <MapContainer
          center={[48.8566, 2.3522]}
          zoom={13}
          style={{ height: '80vh', width: '100%' }}
          >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon}>
            {markers.map((marker, idx) => (
              <Marker key={idx} position={marker.geocode} icon={customIcon}>
                <Popup>{marker.popUp}</Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
          {showRoute && (
            <Polyline positions={markers.map(marker => marker.geocode)} color="blue" />
          )}
          <MapClickHandler onMapClick={handleMapClick} />
        </MapContainer>
        <div className="itinerary-panel">
          <h3>Itinerary:</h3>
          <ul>
            {itinerary.map((item, idx) => {
              const routeText = typeof item.route === 'string' ? item.route.split(' - ') : ['', ''];
              return (
                <li key={idx}>
                  <h4>Name Route: {item.name}</h4>
                  <div>From: {routeText[0]}</div>
                  <div>To: {routeText[1]}</div>
                  <div>Date: {item.date}</div>
                  <div>Duration: {item.duration} days</div>
                  <div>
                    <button onClick={() => handleEditItinerary(idx)}>Edit</button>
                    <button onClick={() => handleDeleteItinerary(idx)}>Delete</button>
                    <button onClick={handleViewRoute}>{showRoute ? 'Hide Route' : 'View Route'}</button>
                  </div>
                </li>
              );
            })}
          </ul>
          <form onSubmit={handleAddItinerary}>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Itinerary Name" required />
            <input type="date" value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)} required />
            <input 
              type="text" 
              value={from} 
              onChange={(e) => setFrom(e.target.value)} 
              placeholder="From" 
              required 
            />
            <input 
              type="text" 
              value={to} 
              onChange={(e) => setTo(e.target.value)} 
              placeholder="To" 
              required 
            />
            <input 
              type="number" 
              value={duration} 
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (value >= 0) setDuration(value);
              }} 
              placeholder="Duration (days)" 
              required 
            />
            <button type="submit">Add Itinerary</button>
          </form>
          <button onClick={handleClearAll} style={{ marginTop: '10px' }}>Clear All</button>
        </div>
      </div>

  );
};

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e);
    },
  });

  return null;
};

export default CustomMap;
