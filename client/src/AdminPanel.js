import React, { useState, useEffect } from 'react';
import axios from 'axios';


const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function AdminPanel({ onBack }) {
  const [stats, setStats] = useState({ totalProperties: 0, totalInquiries: 0, averagePrice: 0 });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const [statsRes, propsRes] = await Promise.all([
        axios.get(API_URL + '/api/admin/stats'),
        axios.get(API_URL + '/api/properties')
      ]);
      setStats(statsRes.data);
      setProperties(propsRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to remove Property #${id}?`)) return;
    try {
      await axios.delete(``$ {process.env.REACT_APP_API_URL || "API_URL"}/api/admin/properties/${id}`);
      fetchAdminData();
    } catch (err) {
      alert('Failed to delete property');
    }
  };

  const cardStyle = {
    background: 'rgba(15, 23, 42, 0.75)',
    border: '1px solid rgba(56, 189, 248, 0.2)',
    borderRadius: '12px',
    padding: '20px',
    color: '#fff'
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', fontFamily: "'Rajdhani', sans-serif" }}>
      <button
        onClick={onBack}
        style={{
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          padding: '8px 16px',
          borderRadius: '6px',
          cursor: 'pointer',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}
      >
        ← Back to Buyer View
      </button>

      <h1 style={{ fontFamily: "'Orbitron', sans-serif", color: '#38bdf8', fontSize: '24px', margin: '0 0 24px 0' }}>
        ⚙️ SYSTEM CONTROL CENTER & ADMIN METRICS
      </h1>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={cardStyle}>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>TOTAL PROPERTIES LISTED</span>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#38bdf8', marginTop: '6px' }}>{stats.totalProperties}</div>
        </div>
        <div style={cardStyle}>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>TOTAL CHAT INQUIRIES LOGGED</span>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#22c55e', marginTop: '6px' }}>{stats.totalInquiries}</div>
        </div>
        <div style={cardStyle}>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>AVERAGE LISTING VALUE</span>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b', marginTop: '6px' }}>
            ₹{stats.averagePrice.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Properties Moderation Table */}
      <div style={cardStyle}>
        <h2 style={{ fontFamily: "'Orbitron', sans-serif", color: '#38bdf8', fontSize: '18px', marginTop: 0 }}>
          ACTIVE PROPERTY NODES MODERATION
        </h2>

        {loading ? (
          <p>Scanning Nodes...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>
                  <th style={{ padding: '12px' }}>ID</th>
                  <th style={{ padding: '12px' }}>Title</th>
                  <th style={{ padding: '12px' }}>Listed Price</th>
                  <th style={{ padding: '12px' }}>Contact Person</th>
                  <th style={{ padding: '12px' }}>Phone</th>
                  <th style={{ padding: '12px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px', color: '#94a3b8' }}>#{p.id}</td>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{p.title}</td>
                    <td style={{ padding: '12px', color: '#22c55e' }}>₹{Number(p.price).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '12px' }}>{p.agent_name || 'N/A'}</td>
                    <td style={{ padding: '12px', color: '#94a3b8' }}>{p.contact_phone || 'N/A'}</td>
                    <td style={{ padding: '12px' }}>
                      <button
                        onClick={() => handleDelete(p.id)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.2)',
                          color: '#ef4444',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        Delete Listing
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
