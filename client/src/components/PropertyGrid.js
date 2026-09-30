import React from 'react';
import PropertyCard from './PropertyCard';

function PropertyGrid({ loading, filteredProperties, predictions, onPredictPrice, onOpenTour, onOpenChat }) {
  if (loading) {
    return <p style={{ textAlign: 'center', color: '#38bdf8' }}>SCANNING DATABASE MATRIX...</p>;
  }

  if (filteredProperties.length === 0) {
    return <p style={{ textAlign: 'center', color: '#94a3b8' }}>NO MATCHING PROPERTIES FOUND.</p>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
      {filteredProperties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          prediction={predictions[property.id]}
          onPredictPrice={onPredictPrice}
          onOpenTour={onOpenTour}
          onOpenChat={onOpenChat}
        />
      ))}
    </div>
  );
}

export default PropertyGrid;
