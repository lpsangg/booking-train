import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGift, FaTag, FaInfoCircle } from 'react-icons/fa';

const Reward = () => {
  const navigate = useNavigate();
  const username = typeof window !== 'undefined' ? localStorage.getItem('username') || 'Member' : 'Member';

  return (
    <div style={{ background: '#f7f7fa', minHeight: '100vh', width: '100vw', fontFamily: 'Montserrat, Arial, sans-serif', fontSize: 15 }}>
      {/* Header */}
      <div style={{ background: '#1976d2', color: '#fff', padding: '16px 0 12px 0', textAlign: 'left', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, fontWeight: 700, marginLeft: 12, cursor: 'pointer' }}>&#8592;</button>
        <div style={{ fontWeight: 700, fontSize: 18, flex: 1, textAlign: 'left', marginLeft: 8 }}>My Rewards</div>
        <button style={{ color: '#fff', fontWeight: 700, fontSize: 14, background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', marginRight: 12 }}>Points History</button>
      </div>
      {/* Card thành viên */}
      <div style={{ background: 'linear-gradient(90deg, #4fc3f7 0%, #1976d2 100%)', borderRadius: 14, margin: '14px 10px 0 10px', padding: '16px 14px 14px 14px', color: '#fff', boxShadow: '0 2px 12px #0001', position: 'relative', fontSize: 14 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>{username}</div>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>New Member</div>
        <div style={{ height: 7, background: '#fff6', borderRadius: 4, margin: '8px 0 6px 0', width: '100%' }}>
          <div style={{ height: 7, width: '10%', background: '#1976d2', borderRadius: 4 }}></div>
        </div>
        <div style={{ fontSize: 13, marginBottom: 2 }}>You need <b>150 points</b> to become a <b>Silver Member</b></div>
        <div style={{ fontSize: 13, textDecoration: 'underline', fontWeight: 600, marginTop: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
          View membership benefits <span style={{ fontSize: 16, marginTop: 2 }}>&#8250;</span>
        </div>
      </div>
      {/* Điểm khả dụng, chờ duyệt */}
      <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0 0 0' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#888', fontWeight: 500, fontSize: 13 }}>Available points</div>
          <div style={{ fontWeight: 700, fontSize: 22, marginTop: 2 }}>0</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#888', fontWeight: 500, fontSize: 13 }}>Pending points</div>
          <div style={{ fontWeight: 700, fontSize: 22, marginTop: 2 }}>0</div>
        </div>
      </div>
      {/* Mô tả */}
      <div style={{ background: '#fff', borderRadius: 12, margin: '16px 10px 0 10px', padding: '12px 12px 8px 12px', fontSize: 13, color: '#333', lineHeight: 1.6 }}>
        <ul style={{ paddingLeft: 16, margin: 0 }}>
          <li> Using reward points to redeem offers will not affect your membership tier.</li>
          <li> Your membership tier for the next year will be the tier just before your current year's tier.</li>
          <li> Reward points accumulated in each quarter of the current year will expire on the last day of the corresponding quarter in the next year. Updating available points may take a few days.</li>
          <li> Book tickets regularly to accumulate reward points and use them to redeem attractive offers!</li>
        </ul>
      </div>
      {/* Các mục bên dưới */}
      <div style={{ background: '#fff', borderRadius: 12, margin: '16px 10px 0 10px', overflow: 'hidden', boxShadow: '0 2px 8px #0001', fontSize: 15 }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '14px 0 14px 14px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', fontWeight: 600, fontSize: 15 }}>
          <span style={{ marginRight: 12 }}><FaGift size={18} color="#1976d2" /></span> My Promotions <span style={{ marginLeft: 'auto', color: '#bbb', fontSize: 16, marginRight: 14 }}>{'>'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', padding: '14px 0 14px 14px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', fontWeight: 600, fontSize: 15 }}>
          <span style={{ marginRight: 12 }}><FaTag size={18} color="#1976d2" /></span> Redeem Offers <span style={{ marginLeft: 'auto', color: '#bbb', fontSize: 16, marginRight: 14 }}>{'>'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', padding: '14px 0 14px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 15 }}>
          <span style={{ marginRight: 12 }}><FaInfoCircle size={18} color="#1976d2" /></span> Program Rules <span style={{ marginLeft: 'auto', color: '#bbb', fontSize: 16, marginRight: 14 }}>{'>'}</span>
        </div>
      </div>
    </div>
  );
};

export default Reward; 