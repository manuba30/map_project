// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import CustomMap from './components/CustomMap';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CustomMap />
  </React.StrictMode>
);
