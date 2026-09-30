import React from 'react';
import { darkGlassStyle } from '../styles/theme';

function MortgageCalculator({
  homePrice, setHomePrice,
  downPaymentPercent, setDownPaymentPercent,
  interestRate, setInterestRate,
  loanTermYears, setLoanTermYears,
  mortgageResult,
  calculatorRef
}) {
  return (
    <div ref={calculatorRef} style={{ ...darkGlassStyle, padding: '24px', marginBottom: '30px' }}>
      <h2 style={{ fontFamily: "'Orbitron', sans-serif", color: '#38bdf8', marginTop: 0, fontSize: '18px' }}>
        🧮 FINANCIAL SIMULATOR (EMI)
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div>
          <label style={{ fontSize: '12px', color: '#94a3b8' }}>PRINCIPAL VALUE (₹)</label>
          <input type="number" value={homePrice} onChange={(e) => setHomePrice(Number(e.target.value))} style={{ width: '100%', padding: '10px', background: '#020617', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '6px', color: '#fff' }} />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: '#94a3b8' }}>DOWN PAYMENT ({downPaymentPercent}%)</label>
          <input type="range" min="5" max="50" value={downPaymentPercent} onChange={(e) => setDownPaymentPercent(Number(e.target.value))} style={{ width: '100%', accentColor: '#38bdf8' }} />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: '#94a3b8' }}>INTEREST RATE (% P.A.)</label>
          <input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} style={{ width: '100%', padding: '10px', background: '#020617', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '6px', color: '#fff' }} />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: '#94a3b8' }}>TENURE ({loanTermYears} YEARS)</label>
          <select value={loanTermYears} onChange={(e) => setLoanTermYears(Number(e.target.value))} style={{ width: '100%', padding: '10px', background: '#020617', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '6px', color: '#fff' }}>
            <option value={10}>10 YEARS</option>
            <option value={15}>15 YEARS</option>
            <option value={20}>20 YEARS</option>
            <option value={25}>25 YEARS</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(2, 6, 23, 0.8)', borderRadius: '8px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>ESTIMATED EMI</span>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#38bdf8' }}>₹{mortgageResult.emi.toLocaleString('en-IN')}/mo</div>
        </div>
        <div>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>PRINCIPAL AMOUNT</span>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>₹{mortgageResult.principal.toLocaleString('en-IN')}</div>
        </div>
        <div>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>TOTAL INTEREST</span>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f43f5e' }}>₹{mortgageResult.totalInterest.toLocaleString('en-IN')}</div>
        </div>
      </div>
    </div>
  );
}

export default MortgageCalculator;
