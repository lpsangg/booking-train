import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegCreditCard } from 'react-icons/fa';
import { MdCreditCard, MdAtm } from 'react-icons/md';

const Cards = () => {
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = React.useState(false);
  return (
    <div style={{ background: '#f7f7fa', minHeight: '100vh', width: '100vw', fontFamily: 'Montserrat, Arial, sans-serif', fontSize: 15 }}>
      {/* Header */}
      <div style={{ background: '#1976d2', color: '#fff', padding: '16px 0 12px 0', textAlign: 'left', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <button onClick={() => showAdd ? setShowAdd(false) : navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, fontWeight: 700, marginLeft: 12, cursor: 'pointer' }}>&#8592;</button>
        <div style={{ fontWeight: 700, fontSize: 18, flex: 1, textAlign: 'left', marginLeft: 8 }}>{showAdd ? 'Add new card' : 'Card Management'}</div>
      </div>
      {/* Nội dung chính */}
      {!showAdd ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 60 }}>
          <div style={{ marginBottom: 18 }}>
            <FaRegCreditCard size={80} color="#90caf9" />
          </div>
          <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8, color: '#222', textAlign: 'center' }}>You have not saved any cards</div>
          <div style={{ fontSize: 15, color: '#444', textAlign: 'center', marginBottom: 28, maxWidth: 320 }}>
            Save your card for quick and convenient payment when booking tickets
          </div>
          <button style={{ width: '90%', maxWidth: 350, background: '#0a1e5e', color: '#fff', fontWeight: 700, fontSize: 18, borderRadius: 10, padding: '14px 0', border: 'none', marginTop: 2, boxShadow: '0 2px 8px #0001', cursor: 'pointer' }} onClick={() => setShowAdd(true)}>Add new card</button>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, margin: '24px 12px 0 12px', boxShadow: '0 2px 8px #0001', padding: '8px 0' }}>
          {/* Quốc tế */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '18px 16px 12px 16px', borderBottom: '1.5px solid #eee', cursor: 'pointer' }} onClick={() => navigate('/add-international-card')}>
            <div style={{ marginTop: 2 }}><MdCreditCard size={32} color="#1976d2" /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 18, color: '#222', marginBottom: 2 }}>International payment card</div>
              <div style={{ color: '#888', fontSize: 15, marginBottom: 2 }}>VISA, MasterCard, JCB</div>
              <div style={{ color: '#666', fontSize: 14 }}>A small fee will be temporarily charged for verification and refunded within 7-30 business days.</div>
            </div>
            <span style={{ color: '#bbb', fontSize: 22, marginLeft: 8, marginTop: 8 }}>{'>'}</span>
          </div>
          {/* ATM nội địa */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '18px 16px 12px 16px', cursor: 'pointer' }} onClick={() => navigate('/add-domestic-card')}>
            <div style={{ marginTop: 2 }}><MdAtm size={32} color="#1976d2" /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 18, color: '#222', marginBottom: 2 }}>Domestic ATM card</div>
              <div style={{ color: '#666', fontSize: 14 }}>A small fee will be temporarily charged for verification.</div>
            </div>
            <span style={{ color: '#bbb', fontSize: 22, marginLeft: 8, marginTop: 8 }}>{'>'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards; 