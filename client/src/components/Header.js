import React from 'react';
import { darkGlassStyle, neonBtnStyle } from '../styles/theme';

function Header({ user, onOpenAddModal, setViewMode, onLogout }) {
  return (
    <div style={{
      ...darkGlassStyle,
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      <div>
        <h1 style={{ fontFamily: "'Orbitron', sans-serif", color: '#38bdf8', margin: 0, fontSize: '22px', textShadow: '0 0 10px rgba(56,189,248,0.5)' }}>
          INDORE NEXUS // AI PORTAL
        </h1>
        <span style={{ fontSize: '12px', color: '#94a3b8' }}>
          OPERATOR: <strong style={{ color: '#22c55e' }}>{user.name}</strong>
        </span>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={onOpenAddModal}
          style={{ background: '#22c55e', color: '#000', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ➕ LIST PROPERTY
        </button>
        <button onClick={() => setViewMode('agent')} style={neonBtnStyle}>
          🏢 AGENT DESK
        </button>
        <button
          onClick={() => setViewMode('admin')}
          style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.4)', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ⚙️ ADMIN PANEL
        </button>
        <button
          onClick={onLogout}
          style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          LOGOUT ✕
        </button>
      </div>
    </div>
  );
}

export default Header;
