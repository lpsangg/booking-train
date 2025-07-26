import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PassengerInfo = () => {
  const [name, setName] = useState('');
  const [cccd, setCccd] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Lấy thông tin chuyến đi từ localStorage hoặc query params nếu cần
  const ticketInfo = JSON.parse(localStorage.getItem('ticketInfo') || '{}');
  const from = ticketInfo.from || 'Departure station';
  const to = ticketInfo.to || 'Arrival station';
  const departDate = ticketInfo.departDate || '';
  const totalPassengers = ticketInfo.totalPassengers || 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !cccd.trim()) {
      setError('Please enter full name and ID number.');
      return;
    }
    localStorage.setItem('passengerInfo', JSON.stringify({ name, cccd }));
    navigate('/payment');
  };

  return (
    <div style={{ background: '#f7f7fa', minHeight: '100vh', width: '100vw' }}>
      {/* Header tràn viền */}
      <div style={{ background: '#1976d2', color: '#fff', padding: 16, borderRadius: '0 0 16px 16px', marginBottom: 8, width: '100%', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 520, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 26, cursor: 'pointer', marginRight: 8, borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 8 12 15 6" /></svg>
          </button>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{from} → {to}</div>
        </div>
        <div style={{ maxWidth: 520, margin: '0 auto', fontSize: 14, marginTop: 2, marginBottom: 6, padding: '0 16px' }}>{departDate} • {totalPassengers} passenger(s)</div>
        <div style={{ maxWidth: 520, margin: '0 auto', display: 'flex', gap: 8, fontSize: 13, marginTop: 2, padding: '0 16px' }}>
          <span style={{ color: '#bbdefb' }}>1 Select seat</span>
          <span style={{ color: '#bbdefb' }}>→</span>
          <span style={{ fontWeight: 700, color: '#fff', background: '#1565c0', borderRadius: 8, padding: '2px 8px' }}>2 Enter info</span>
          <span style={{ color: '#bbdefb' }}>→</span>
          <span style={{ color: '#bbdefb' }}>3 Payment</span>
        </div>
      </div>
      {/* Wrapper cho form căn giữa */}
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 16px' }}>
        {/* Form nhập thông tin */}
        <div style={{ width: '100%', maxWidth: 480, background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #2346a022', padding: '32px 24px', marginTop: 32, boxSizing: 'border-box', marginLeft: 'auto', marginRight: 'auto' }}>
          <h2 style={{ textAlign: 'center', color: '#2346a0', fontWeight: 800, marginBottom: 24 }}>Enter passenger information</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 600, color: '#2346a0', display: 'block', marginBottom: 6 }}>Full name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="E.g.: JOHN DOE" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1.5px solid #bbb', fontSize: 16, background: '#f7f7fa' }} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 600, color: '#2346a0', display: 'block', marginBottom: 6 }}>ID/Passport number</label>
              <input type="text" value={cccd} onChange={e => setCccd(e.target.value)} placeholder="E.g.: 012345678901" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1.5px solid #bbb', fontSize: 16, background: '#f7f7fa' }} />
            </div>
            {error && <div style={{ color: '#e53935', fontWeight: 600, marginBottom: 12 }}>{error}</div>}
            <button type="submit" style={{ width: '100%', background: 'linear-gradient(90deg, #2346a0 80%, #3a6cf0 100%)', color: '#fff', fontWeight: 700, fontSize: 18, borderRadius: 12, padding: '12px 0', border: 'none', cursor: 'pointer', marginTop: 8 }}>Continue</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PassengerInfo; 