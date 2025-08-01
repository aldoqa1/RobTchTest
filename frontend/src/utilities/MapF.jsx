// src/components/Mapa.js//
//import React from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Arregla el ícono de los marcadores (bug común en Leaflet con React)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapF({ data, setCurrentView, setLastView, setChoosenId }) {
  const center = [14.6928, -17.4467]; // senegal

  function dmsToDecimal(dmsStr) {
    const regex = /(\d+)°(\d+)'(\d+)"([NSEW])/;
    const match = dmsStr.match(regex);
    if (!match) return null;

    const degrees = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const seconds = parseInt(match[3], 10);
    const direction = match[4];

    let decimal = degrees + minutes / 60 + seconds / 3600;
    if (direction === 'S' || direction === 'W') {
      decimal *= -1;
    }

    return decimal;
  }

  return (
    <MapContainer center={center} zoom={2} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {data.cameras.map((cam) => (
        <Marker
          eventHandlers={{
            click: () => {
              console.log("Cámara clickeada:", cam.name);
              setLastView("StatisticsView");
              setCurrentView("CameraView");
              setChoosenId(cam.id);
              // Aquí puedes hacer más cosas: navegar, mostrar modal, etc.
            },
          }}
          key={cam.id + "map"}
          position={[dmsToDecimal(cam.latitude),
          dmsToDecimal(cam.longitude)]}>
          <Tooltip permanent direction="top" offset={[0, -10]}>
            {cam.name}
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapF;