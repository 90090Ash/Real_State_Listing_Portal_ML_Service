import React from 'react';
import { darkGlassStyle, neonBtnStyle } from '../styles/theme';

function NeuralValuationMatrix({ formData, setFormData, handleCustomFormSubmit, estimating, customPrediction }) {
  return (
    <div style={{ ...darkGlassStyle, padding: '24px', marginBottom: '30px' }}>
      <h2 style={{ fontFamily: "'Orbitron', sans-serif", color: '#38bdf8', marginTop: 0, fontSize: '18px' }}>
        ⚡ NEURAL VALUATION MATRIX
      </h2>
      
      <form onSubmit={handleCustomFormSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', alignItems: 'end' }}>
        <div>
          <label style={{ fontSize: '12px', color: '#94a3b8' }}>BEDROOMS (BHK)</label>
          <input type="number" value={formData.bedrooms} onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })} style={{ width: '100%', padding: '10px', background: '#020617', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '6px', color: '#fff' }} />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: '#94a3b8' }}>BATHROOMS</label>
          <input type="number" value={formData.bathrooms} onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })} style={{ width: '100%', padding: '10px', background: '#020617', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '6px', color: '#fff' }} />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: '#94a3b8' }}>AREA (SQFT)</label>
          <input type="number" value={formData.sqft} onChange={(e) => setFormData({ ...formData, sqft: Number(e.target.value) })} style={{ width: '100%', padding: '10px', background: '#020617', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '6px', color: '#fff' }} />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: '#94a3b8' }}>AGE (YEARS)</label>
          <input type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })} style={{ width: '100%', padding: '10px', background: '#020617', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '6px', color: '#fff' }} />
        </div>
        <button type="submit" style={neonBtnStyle}>
          {estimating ? 'CALCULATING...' : 'COMPUTE VALUATION'}
        </button>
      </form>

      {customPrediction && (
        <div style={{ marginTop: '20px', padding: '14px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', borderRadius: '8px', color: '#4ade80', fontWeight: 'bold' }}>
          ESTIMATED NEURAL MARKET VALUE: ₹{Number(customPrediction).toLocaleString('en-IN')}
        </div>
      )}
    </div>
  );
}

export default NeuralValuationMatrix;
