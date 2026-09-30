import React from 'react';
import { darkGlassStyle, neonBtnStyle } from '../styles/theme';

function AddPropertyModal({ showAddModal, onClose, newProp, setNewProp, handleAddPropertySubmit }) {
  if (!showAddModal) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
      <div style={{ ...darkGlassStyle, maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: "'Orbitron', sans-serif", color: '#38bdf8', margin: 0, fontSize: '18px' }}>
            ➕ LIST PROPERTY & CONTACT DETAILS
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>

        <form onSubmit={handleAddPropertySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input
            type="text" required placeholder="Property Title (e.g. 3 BHK Luxury Apartment, Vijay Nagar)"
            value={newProp.title} onChange={(e) => setNewProp({ ...newProp, title: e.target.value })}
            style={{ padding: '10px', background: '#020617', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '6px', color: '#fff' }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input
              type="number" required placeholder="Price in ₹"
              value={newProp.price} onChange={(e) => setNewProp({ ...newProp, price: e.target.value })}
              style={{ padding: '10px', background: '#020617', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '6px', color: '#fff' }}
            />
            <input
              type="number" required placeholder="Area in Sqft"
              value={newProp.sqft} onChange={(e) => setNewProp({ ...newProp, sqft: e.target.value })}
              style={{ padding: '10px', background: '#020617', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '6px', color: '#fff' }}
            />
          </div>
          <input
            type="text" required placeholder="Full Address / Location in Indore"
            value={newProp.address} onChange={(e) => setNewProp({ ...newProp, address: e.target.value })}
            style={{ padding: '10px', background: '#020617', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '6px', color: '#fff' }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input
              type="number" placeholder="Bedrooms (BHK)"
              value={newProp.bedrooms} onChange={(e) => setNewProp({ ...newProp, bedrooms: e.target.value })}
              style={{ padding: '10px', background: '#020617', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '6px', color: '#fff' }}
            />
            <input
              type="number" placeholder="Bathrooms"
              value={newProp.bathrooms} onChange={(e) => setNewProp({ ...newProp, bathrooms: e.target.value })}
              style={{ padding: '10px', background: '#020617', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '6px', color: '#fff' }}
            />
          </div>

          <div style={{ borderTop: '1px solid rgba(56,189,248,0.2)', paddingTop: '10px', marginTop: '6px' }}>
            <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 'bold' }}>SELLER / AGENT CONTACT INFO</span>
          </div>

          <input
            type="text" required placeholder="Your Name / Agency Name"
            value={newProp.agent_name} onChange={(e) => setNewProp({ ...newProp, agent_name: e.target.value })}
            style={{ padding: '10px', background: '#020617', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '6px', color: '#fff' }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input
              type="text" required placeholder="Phone (+91 XXXXX XXXXX)"
              value={newProp.contact_phone} onChange={(e) => setNewProp({ ...newProp, contact_phone: e.target.value })}
              style={{ padding: '10px', background: '#020617', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '6px', color: '#fff' }}
            />
            <input
              type="email" required placeholder="Contact Email"
              value={newProp.contact_email} onChange={(e) => setNewProp({ ...newProp, contact_email: e.target.value })}
              style={{ padding: '10px', background: '#020617', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '6px', color: '#fff' }}
            />
          </div>

          <button type="submit" style={{ ...neonBtnStyle, marginTop: '10px', width: '100%', padding: '12px' }}>
            PUBLISH PROPERTY TO NEXUS MATRIX 🚀
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPropertyModal;
