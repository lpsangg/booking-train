import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Referral = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const code = 'CODE12012321';

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div style={{ background: '#e3f0ff', minHeight: '100vh', width: '100vw', fontFamily: 'Montserrat, Arial, sans-serif', fontSize: 15 }}>
      {/* Header */}
      <div style={{ background: '#1976d2', color: '#fff', padding: '16px 0 12px 0', textAlign: 'left', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, fontWeight: 700, marginLeft: 12, cursor: 'pointer' }}>&#8592;</button>
        <div style={{ fontWeight: 700, fontSize: 18, flex: 1, textAlign: 'left', marginLeft: 8 }}>Referral Gifts</div>
        <div style={{ fontWeight: 700, fontSize: 18, flex: 1, textAlign: 'left', marginLeft: 8 }}>Referral Gifts</div>
        <button style={{ color: '#fff', fontWeight: 700, fontSize: 14, background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', marginRight: 12 }}>Enter referral code</button>
      </div>
      {/* Banner + code */}
      <div style={{ background: 'linear-gradient(120deg, #e3f0ff 60%, #fff 100%)', borderRadius: 18, margin: '18px 14px 0 14px', padding: '18px 10px 10px 10px', textAlign: 'center', boxShadow: '0 2px 12px #0001' }}>
        <div style={{ fontSize: 22, color: '#1976d2', marginBottom: 2, letterSpacing: 1 }}>REWARD EACH OTHER<br />SHARE YOUR CODE</div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '12px 0 10px 0', gap: 18 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '8px 16px', color: '#1976d2', fontWeight: 900, fontSize: 20, boxShadow: '0 2px 8px #0001' }}>+800 POINTS<br /><span style={{ fontWeight: 500, fontSize: 14 }}>for referrer</span></div>
          <div style={{ background: '#fff', borderRadius: 16, padding: '8px 16px', color: '#ffd600', fontWeight: 900, fontSize: 20, boxShadow: '0 2px 8px #0001' }}>+30K<br /><span style={{ color: '#1976d2', fontWeight: 500, fontSize: 14 }}>for new user</span></div>
        </div>
        {/* Code + copy + share */}
        <div style={{ background: '#fff', borderRadius: 12, margin: '18px auto 0 auto', padding: '10px 10px 10px 10px', maxWidth: 320, boxShadow: '0 2px 8px #0001' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1.5px solid #e0e0e0', borderRadius: 8, padding: '8px 12px', marginBottom: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: 2 }}>{code}</span>
            <button onClick={handleCopy} style={{ color: '#1976d2', background: 'none', border: 'none', fontWeight: 700, fontSize: 15, textDecoration: 'underline', cursor: 'pointer' }}>{copied ? 'Copied' : 'Copy'}</button>
          </div>
          <button style={{ width: '100%', background: '#ffd600', color: '#111', fontWeight: 700, fontSize: 18, borderRadius: 8, padding: '12px 0', border: 'none', marginTop: 2, boxShadow: '0 2px 8px #0001', cursor: 'pointer' }}>Share now</button>
        </div>
      </div>
      {/* Đối tượng tham gia */}
      <div style={{ background: '#fff', borderRadius: 12, margin: '18px 14px 0 14px', padding: '14px 14px 10px 14px', color: '#1976d2', fontWeight: 700, fontSize: 16, textAlign: 'left' }}>
        Eligible participants
        <div style={{ color: '#222', fontWeight: 400, fontSize: 14, marginTop: 6 }}>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            <li><b>Referrer:</b> is a customer with at least 1 order.</li>
            <li><b>New user:</b> is a customer who has not placed a successful order yet.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Referral; 