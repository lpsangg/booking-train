import React from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  return (
    <div style={{ background: '#f7f7fa', minHeight: '100vh', width: '100vw', fontFamily: 'Montserrat, Arial, sans-serif', fontSize: 15 }}>
      {/* Header */}
      <div style={{ background: '#1976d2', color: '#fff', padding: '16px 0 12px 0', textAlign: 'left', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, fontWeight: 700, marginLeft: 12, cursor: 'pointer' }}>&#8592;</button>
        <div style={{ fontWeight: 700, fontSize: 18, flex: 1, textAlign: 'left', marginLeft: 8 }}>Settings</div>
      </div>
      {/* Options */}
      <div style={{ background: '#fff', borderRadius: 12, margin: '18px 12px 0 12px', boxShadow: '0 2px 8px #0001', padding: '18px 0' }}>
        <div style={{ padding: '12px 18px', borderBottom: '1.5px solid #eee', fontWeight: 600, fontSize: 16, color: '#1976d2', cursor: 'pointer' }}>
          Change language
        </div>
        <div style={{ padding: '12px 18px', borderBottom: '1.5px solid #eee', fontWeight: 600, fontSize: 16, color: '#1976d2', cursor: 'pointer' }}>
          Change theme
        </div>
        <div style={{ padding: '12px 18px', fontWeight: 600, fontSize: 16, color: '#e53935', cursor: 'pointer' }} onClick={() => {
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('username');
          window.location.reload();
        }}>
          Log out
        </div>
      </div>
    </div>
  );
};

export default Settings; 