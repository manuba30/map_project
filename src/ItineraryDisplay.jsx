import React from 'react';
import MapDisplay from './MapDisplay';

export default function ItineraryDisplay({ destinations }) {
  return (
    <div className="itinerary-display">
      <h2>Affichage de l'Itinéraire</h2>
      <MapDisplay destinations={destinations} />
      <ul>
        {destinations.map((destination, index) => (
          <li key={index}>
            <span>{destination.name}</span>
            <span>{destination.arrivalDate}</span>
            <span>{destination.stayDuration} jours</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
