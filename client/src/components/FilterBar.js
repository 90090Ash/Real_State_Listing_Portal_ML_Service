import React from 'react';

function FilterBar({ searchQuery, setSearchQuery, selectedBhk, setSelectedBhk }) {
  return (
    <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
      <input
        type="text"
        placeholder="Search location or title (e.g. Vijay Nagar)..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ flex: 1, padding: '12px', background: '#020617', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '8px', color: '#fff', outline: 'none', minWidth: '260px' }}
      />
      <select
        value={selectedBhk}
        onChange={(e) => setSelectedBhk(e.target.value)}
        style={{ padding: '12px', background: '#020617', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '8px', color: '#fff' }}
      >
        <option value="ALL">ALL BHK TYPES</option>
        <option value="2">2 BHK</option>
        <option value="3">3 BHK</option>
        <option value="4">4 BHK</option>
      </select>
    </div>
  );
}

export default FilterBar;
