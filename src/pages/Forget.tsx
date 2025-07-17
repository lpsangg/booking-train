import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoRailway from '../assets/logo-railway.png';
import mailIcon from '../assets/mail.png';

const Forget = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <div style={{ width: 360, height: 800, position: 'relative', background: '#fff', borderRadius: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        {/* Back button */}
        <button style={{ position: 'absolute', top: 48, left: 13, width: 49, height: 49, borderRadius: 12, background: '#26457c', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, padding: 0 }} onClick={() => navigate(-1)}>
          <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        {/* Logo */}
        <img src={logoRailway} alt="Railway Logo" style={{ position: 'absolute', top: 26, left: 275, width: 79, height: 86, objectFit: 'cover' }} />
        {/* Title */}
        <h1 style={{ position: 'absolute', top: 127, left: 17, width: 331, fontFamily: 'Montserrat, Helvetica, Arial, sans-serif', fontSize: 40, fontWeight: 700, color: '#26457c', lineHeight: '43px', textAlign: 'left', margin: 0 }}>Forgot<br/>password?</h1>
        {/* Input email */}
        <div style={{ position: 'absolute', top: 265, left: 17, width: 327, height: 55, boxShadow: '0px 4px 4px #00000040', borderRadius: 10, background: '#f3f3f3', display: 'flex', alignItems: 'center' }}>
          <img src={mailIcon} alt="mail" style={{ width: 29, height: 27, marginLeft: 12, marginRight: 12, color: '#676767' }} />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email address"
            style={{ border: 'none', outline: 'none', background: 'transparent', height: '100%', flex: 1, fontFamily: 'Montserrat, Helvetica, Arial, sans-serif', fontWeight: 500, fontSize: 18, color: '#676767' }}
          />
        </div>
        {/* Note */}
        <div style={{ position: 'absolute', top: 336, left: 17, width: 325, fontFamily: 'Montserrat, Helvetica, Arial, sans-serif', fontSize: 15, color: '#ff0000', lineHeight: 'normal' }}>
          * We will send a message to set or reset your new password
        </div>
        {/* Submit button */}
        <button style={{ position: 'absolute', top: 424, left: 101, width: 157, height: 45, background: '#26457c', color: '#fff', fontFamily: 'Montserrat, Helvetica, Arial, sans-serif', fontSize: 20, fontWeight: 600, borderRadius: 22, boxShadow: '0 4px 12px rgba(35,70,160,0.13)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Send</button>
      </div>
    </div>
  );
};

export default Forget; 