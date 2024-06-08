import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Icon, divIcon, point } from 'leaflet';

const customIcon = new Icon({
  iconUrl: '()', // Coloque o caminho correto do seu ícone aqui
  iconSize: [38, 38],
});

const createClusterCustomIcon = function (cluster) {
  return new divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: 'custom-marker-cluster',
    iconSize: point(33, 33, true),
  });
};

const CustomMap = () => {
  const [itinerary, setItinerary] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [name, setName] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [duration, setDuration] = useState('');
  const [route, setRoute] = useState([]);
  const [locations, setLocations] = useState('');
  const [itineraryName, setItineraryName] = useState('');
  const [editIndex, setEditIndex] = useState(null);

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

  useEffect(() => {
    localStorage.setItem('itinerary', JSON.stringify(itinerary));
    localStorage.setItem('markers', JSON.stringify(markers));
  }, [itinerary, markers]);

  const handleMapClick = async (e) => {
    const newMarker = {
      geocode: [e.latlng.lat, e.latlng.lng],
      popUp: `New marker at ${e.latlng.lat}, ${e.latlng.lng}`,
    };
    setMarkers(prevMarkers => [...prevMarkers, newMarker]);

    const address = await reverseGeocode(e.latlng.lat, e.latlng.lng);
    setRoute(prevRoute => [...prevRoute, e.latlng]);
    setName(address);
    setLocations(prevLocations => prevLocations ? `${prevLocations}, ${address}` : address);
  };

  const handleAddItinerary = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updatedItinerary = [...itinerary];
      updatedItinerary[editIndex] = { name: locations, date: arrivalDate, duration, route, itineraryName };
      setItinerary(updatedItinerary);
      setEditIndex(null);
    } else {
      const newItineraryItem = { name: locations, date: arrivalDate, duration, route, itineraryName };
      setItinerary(prevItinerary => [...prevItinerary, newItineraryItem]);
    }
    setName('');
    setArrivalDate('');
    setDuration('');
    setRoute([]);
    setLocations('');
    setItineraryName('');
  };

  const handleEditItinerary = (index) => {
    const { name, date, duration, route, itineraryName } = itinerary[index];
    setName(name);
    setArrivalDate(date);
    setDuration(duration);
    setRoute(route);
    setLocations(name);
    setItineraryName(itineraryName);
    setEditIndex(index);
  };

  const handleDeleteItinerary = (index) => {
    const updatedItinerary = [...itinerary];
    updatedItinerary.splice(index, 1);
    setItinerary(updatedItinerary);
  };

  const handleClearAll = () => {
    setItinerary([]);
    setMarkers([]);
    setRoute([]);
    localStorage.removeItem('itinerary');
    localStorage.removeItem('markers');
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
        <Polyline pathOptions={{ color: 'red' }} positions={route} />
        <MapClickHandler onMapClick={handleMapClick} />
      </MapContainer>
      <div className="itinerary-panel">
        <h3>Itinerary:</h3>
        <ul>
          {itinerary.map((item, idx) => (
            <li key={idx}>
              {item.itineraryName} - {item.name} - {item.date} - {item.duration} days
              <button onClick={() => handleEditItinerary(idx)}>Edit</button>
              <button onClick={() => handleDeleteItinerary(idx)}>Delete</button>
            </li>
          ))}
        </ul>
        <form onSubmit={handleAddItinerary}>
          <input type="text" value={itineraryName} onChange={(e) => setItineraryName(e.target.value)} placeholder="Itinerary Name" required />
          <input type="text" value={locations} onChange={(e) => setLocations(e.target.value)} placeholder="Locations" required />
          <input type="date" value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)} required />
          <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duration (days)" required />
          <button type="submit">{editIndex !== null ? 'Edit Itinerary' : 'Add Itinerary'}</button>
        </form>
        <button onClick={handleClearAll}>Clear All</button>
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
