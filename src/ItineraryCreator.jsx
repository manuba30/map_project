import React, { useState } from 'react';

export default function ItineraryCreator({ onAddDestination }) {
  const [destination, setDestination] = useState({
    name: '',
    arrivalDate: '',
    stayDuration: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDestination(prevDestination => ({
      ...prevDestination,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!destination.name || !destination.arrivalDate || !destination.stayDuration) return;
    onAddDestination(destination);
    setDestination({ name: '', arrivalDate: '', stayDuration: '' });
  };

  return (
    <div className="itinerary-creator">
      <h2>Création d'un Itinéraire</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nom de la destination:
          <input
            type="text"
            name="name"
            value={destination.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Date d'arrivée:
          <input
            type="date"
            name="arrivalDate"
            value={destination.arrivalDate}
            onChange={handleChange}
          />
        </label>
        <label>
          Durée du séjour (en jours):
          <input
            type="number"
            name="stayDuration"
            value={destination.stayDuration}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Ajouter Destination</button>
      </form>
    </div>
  );
}
