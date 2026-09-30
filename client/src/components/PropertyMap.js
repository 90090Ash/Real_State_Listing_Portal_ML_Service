import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { darkGlassStyle, customIcon } from '../styles/theme';

function PropertyMap({ filteredProperties }) {
  return (
    <div style={{ ...darkGlassStyle, height: '380px', marginBottom: '30px', overflow: 'hidden' }}>
      <MapContainer key={filteredProperties.length} center={[22.7196, 75.8577]} zoom={12} style={{ width: '100%', height: '100%' }}>
        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {filteredProperties.map((property) => {
          const lat = parseFloat(property.latitude);
          const lng = parseFloat(property.longitude);
          return !isNaN(lat) && !isNaN(lng) ? (
            <Marker key={property.id} position={[lat, lng]} icon={customIcon}>
              <Popup>
                <strong>{property.title}</strong><br />₹{property.price ? Number(property.price).toLocaleString('en-IN') : 'N/A'}
              </Popup>
            </Marker>
          ) : null;
        })}
      </MapContainer>
    </div>
  );
}

export default PropertyMap;
