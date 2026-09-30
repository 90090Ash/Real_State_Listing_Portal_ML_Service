import React from 'react';
import { darkGlassStyle } from '../styles/theme';

function PropertyCard({ property, prediction, onPredictPrice, onOpenTour, onOpenChat }) {
  return (
    <div style={{ ...darkGlassStyle, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '16px', color: '#38bdf8', margin: '0 0 10px 0' }}>
          {property.title}
        </h3>
        <p style={{ margin: '4px 0', fontSize: '14px', color: '#cbd5e1' }}>
          <strong>LISTED PRICE:</strong> ₹{property.price ? Number(property.price).toLocaleString('en-IN') : 'N/A'}
        </p>
        <p style={{ margin: '4px 0', fontSize: '13px', color: '#94a3b8' }}>{property.address}</p>
        <p style={{ margin: '4px 0', fontSize: '13px', color: '#94a3b8' }}>
          {property.bedrooms} BED | {property.bathrooms} BATH | {property.sqft} SQFT
        </p>

        {/* Contact Info Box */}
        <div style={{ marginTop: '12px', padding: '10px 12px', background: 'rgba(2, 6, 23, 0.6)', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
          <p style={{ margin: '0 0 6px 0', fontSize: '11px', color: '#38bdf8', fontWeight: 'bold' }}>📞 CONTACT PERSON</p>
          <p style={{ margin: '2px 0', fontSize: '13px', color: '#f8fafc' }}>👤 <strong>{property.agent_name || 'Rajesh Sharma'}</strong></p>
          <p style={{ margin: '2px 0', fontSize: '12px', color: '#cbd5e1' }}>📱 {property.contact_phone || '+91 98260 12345'}</p>
          <p style={{ margin: '2px 0', fontSize: '12px', color: '#cbd5e1' }}>✉️ {property.contact_email || 'contact@nexus.ai'}</p>
        </div>
      </div>

      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={() => onPredictPrice(property)}
          style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          🤖 NEURAL PRICE ESTIMATE
        </button>

        {property.virtual_tour_url && (
          <button
            onClick={() => onOpenTour(property.virtual_tour_url)}
            style={{ background: '#6f42c1', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            🕶️ 360° VIRTUAL TOUR
          </button>
        )}

        <button
          onClick={() => onOpenChat(property)}
          style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          💬 CONNECT AGENT CHAT
        </button>

        {prediction && (
          <div style={{ padding: '8px', background: 'rgba(2, 6, 23, 0.9)', border: '1px solid #38bdf8', borderRadius: '6px', textAlign: 'center', fontSize: '13px', color: '#38bdf8' }}>
            AI ESTIMATE: ₹{Number(prediction).toLocaleString('en-IN')}
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertyCard;
