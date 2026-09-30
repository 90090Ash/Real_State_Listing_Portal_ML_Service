import L from 'leaflet';

export const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const darkGlassStyle = {
  background: 'rgba(15, 23, 42, 0.75)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(56, 189, 248, 0.2)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
};

export const neonBtnStyle = {
  background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
  color: '#fff',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  letterSpacing: '0.5px',
  boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)',
  transition: 'all 0.3s ease'
};
