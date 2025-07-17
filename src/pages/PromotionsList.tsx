import React from 'react';
import { useNavigate } from 'react-router-dom';

const promotions = [
  {
    value: 50,
    label: 'Discount 50K',
    points: 2000,
    expiry: 'Valid: 30 days from redemption',
  },
  {
    value: 30,
    label: 'Discount 30K',
    points: 1200,
    expiry: 'Valid: 30 days from redemption',
  },
  {
    value: 20,
    label: 'Discount 20K',
    points: 800,
    expiry: 'Valid: 30 days from redemption',
  },
];

const PromotionsList = () => {
  const navigate = useNavigate();
  return (
    <div style={{ background: '#f7f7fa', minHeight: '100vh', width: '100vw', fontFamily: 'Montserrat, Arial, sans-serif', fontSize: 15 }}>
      {/* Header */}
      <div style={{ background: '#1976d2', color: '#fff', padding: '16px 0 12px 0', textAlign: 'left', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, fontWeight: 700, marginLeft: 12, cursor: 'pointer' }}>&#8592;</button>
        <div style={{ fontWeight: 700, fontSize: 18, flex: 1, textAlign: 'left', marginLeft: 8 }}>Promotions</div>
      </div>
      {/* Điểm khả dụng và nút ưu đãi của tôi */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '18px 14px 0 14px' }}>
        <div style={{ color: '#fff', background: '#1976d2', borderRadius: 16, padding: '8px 16px', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          Usable points <span style={{ fontWeight: 700, fontSize: 17, marginLeft: 6 }}>0 pts</span>
        </div>
        <button style={{ background: '#fff', color: '#1976d2', border: '2px solid #1976d2', borderRadius: 18, fontWeight: 700, fontSize: 15, padding: '7px 18px', position: 'relative' }}>
          My Promotions <span style={{ background: '#e53935', color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, padding: '2px 8px', marginLeft: 6, position: 'relative', top: -2 }}>0</span>
        </button>
      </div>
      {/* Danh sách coupon */}
      <div style={{ margin: '18px 0 0 0', padding: '0 10px' }}>
        {promotions.map((promo, idx) => (
          <div key={idx} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #0001', marginBottom: 18, overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)', padding: '18px 0 10px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 19, marginRight: 12, letterSpacing: 1 }}>DISCOUNT COUPON</span>
              <span style={{ color: '#ffd600', fontWeight: 900, fontSize: 38, marginRight: 2 }}>{promo.value}</span>
              <span style={{ color: '#ffd600', fontWeight: 900, fontSize: 22, marginLeft: 0 }}>K</span>
            </div>
            <div style={{ padding: '10px 16px 12px 16px', borderTop: '1px solid #f0f0f0' }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>{promo.label}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}>
                <span style={{ color: '#1976d2', fontWeight: 700 }}>{promo.points.toLocaleString()} pts</span>
                <span style={{ color: '#888', fontSize: 15 }}>⏱</span>
                <span style={{ color: '#888', fontSize: 14 }}>{promo.expiry}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromotionsList; 