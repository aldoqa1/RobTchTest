import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';

//it avoids to have mistakes when it comes to loading those icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapCam({ data, setCurrentView, setLastView, setChoosenId }) {

  //it becomes the center of the map
  const center = [14.6928, -17.4467]; // senegal

  //it changes from DMS to decimal coords
  function dmsToDecimal(date) {
    const regex = /(\d+)°(\d+)'(\d+)"([NSEW])/;
    const match = date.match(regex);
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
              setLastView("StatisticsView");
              setCurrentView("CameraView");
              setChoosenId(cam.id);
            },
          }}
          key={cam.id + "map"}
          position={[dmsToDecimal(cam.latitude),
          dmsToDecimal(cam.longitude)]}>
          <Tooltip permanent direction="top" offset={[0, -10]}>
            <div className="d-flex flex-column">
              <span>
               {cam.name}
              </span>
              <span>
                {`Alertas: ${cam.alerts.length}`}
              </span>
         
            </div>
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapCam;