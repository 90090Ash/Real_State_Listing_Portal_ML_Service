import React from 'react';

function VirtualTourModal({ activeTourUrl, onClose }) {
  if (!activeTourUrl) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
      <div style={{ backgroundColor: '#fff', width: '90%', maxWidth: '900px', height: '600px', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '10px', right: '15px', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold', zIndex: 10001 }}
        >
          ✕
        </button>
        <iframe
          src={activeTourUrl}
          title="360 Virtual Tour"
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          allow="xr-spatial-tracking; accelerometer; magnetometer; gyroscope"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default VirtualTourModal;
