import React from 'react';
import CustomMap from './components/CustomMap'; // Importe o componente CustomMap

export default function App() {
  const markers = [
    { position: [51.505, -0.09] },
    { position: [51.51, -0.1] },
    // Adicione mais marcadores conforme necessário
  ];

  return (
    <div>
      <h1>Itinerary Creator</h1>
      <CustomMap markers={markers} /> {/* Renderize o componente CustomMap aqui */}
      {/* Aqui você pode adicionar outros componentes, como ItineraryCreator */}
    </div>
  );
}
