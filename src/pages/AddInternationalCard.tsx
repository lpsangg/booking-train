import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddInternationalCard = () => {
  const navigate = useNavigate();
  const [cardType, setCardType] = useState('visa');
  const [cardNumber, setCardNumber] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');
  const [cvn, setCvn] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  return (
    <div style={{ background: '#f7f7fa', minHeight: '100vh', width: '100vw', fontFamily: 'Montserrat, Arial, sans-serif', fontSize: 15 }}>
      {/* Header */}
      <div style={{ background: '#1976d2', color: '#fff', padding: '16px 0 12px 0', textAlign: 'left', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, fontWeight: 700, marginLeft: 12, cursor: 'pointer' }}>&#8592;</button>
        <div style={{ fontWeight: 700, fontSize: 18, flex: 1, textAlign: 'left', marginLeft: 8 }}>Xác nhận thanh toán</div>
      </div>
     
      {/* Billing info */}
      <div style={{ background: '#fff', borderRadius: 12, margin: '0 12px 18px 12px', padding: '18px 16px', boxShadow: '0 2px 8px #0001' }}>
        <div style={{ fontWeight: 700, fontSize: 18, color: '#222', marginBottom: 8 }}>Billing Information</div>
        <div style={{ color: '#e53935', fontSize: 13, float: 'right', marginTop: -28 }}>* Required field</div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Phone Number *</div>
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="0123123123" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #bbb', fontSize: 16, marginBottom: 2, background: '#fff', color: '#222' }} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Email *</div>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #bbb', fontSize: 16, marginBottom: 2, background: '#fff', color: '#222' }} />
        </div>
      </div>
      {/* Payment details */}
      <div style={{ background: '#fff', borderRadius: 12, margin: '0 12px', padding: '18px 16px', boxShadow: '0 2px 8px #0001' }}>
        <div style={{ fontWeight: 700, fontSize: 18, color: '#222', marginBottom: 8 }}>Payment Details <span role="img" aria-label="lock">🔒</span></div>
        {/* Card type */}
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Card Type *</div>
        <div style={{ display: 'flex', gap: 18, marginBottom: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
            <input type="radio" name="cardType" checked={cardType === 'visa'} onChange={() => setCardType('visa')} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="visa" style={{ height: 24 }} /> Visa
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
            <input type="radio" name="cardType" checked={cardType === 'mastercard'} onChange={() => setCardType('mastercard')} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="mc" style={{ height: 24 }} /> Mastercard
          </label>
          
        </div>
        {/* Card number */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Card Number *</div>
          <input value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #bbb', fontSize: 16, marginBottom: 2, background: '#fff', color: '#222' }} />
        </div>
        {/* Expiry */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Expiration Month *</div>
            <select value={expMonth} onChange={e => setExpMonth(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #bbb', fontSize: 16, background: '#fff', color: '#222' }}>
              <option value="">Month</option>
              {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Expiration Year *</div>
            <select value={expYear} onChange={e => setExpYear(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #bbb', fontSize: 16, background: '#fff', color: '#222' }}>
              <option value="">Year</option>
              {[...Array(12)].map((_, i) => {
                const year = new Date().getFullYear() + i;
                return <option key={year} value={year}>{year}</option>;
              })}
            </select>
          </div>
        </div>
        {/* CVN */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>CVN *</div>
          <input value={cvn} onChange={e => setCvn(e.target.value)} placeholder="" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #bbb', fontSize: 16, marginBottom: 2, background: '#fff', color: '#222' }} />
          <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}>This code is a three or four digit number printed on the back or front of credit cards.</div>
        </div>
      </div>
      {/* Your Order */}
      <div style={{ background: '#fff', borderRadius: 12, margin: '18px 12px 0 12px', padding: '18px 16px 16px 16px', boxShadow: '0 2px 8px #0001' }}>
        <div style={{ fontWeight: 700, fontSize: 17, color: '#222', marginBottom: 8 }}>Your Order</div>
        <hr style={{ border: 'none', borderTop: '1.5px solid #eee', margin: '0 -16px 12px -16px' }} />
        <div style={{ background: '#e8f5e9', borderRadius: 8, padding: '10px 12px', display: 'flex', alignItems: 'center', marginBottom: 18 }}>
          <span style={{ color: '#1976d2', fontWeight: 700, fontSize: 15, minWidth: 110 }}>Total amount</span>
          <span style={{ color: '#1565c0', fontWeight: 700, fontSize: 20, marginLeft: 'auto' }}>₫1.000,0</span>
        </div>
        <div style={{ display: 'flex', gap: 18, marginTop: 8 }}>
          <button style={{ flex: 1, background: '#fff', color: '#222', border: '1.5px solid #bbb', borderRadius: 6, padding: '10px 0', fontWeight: 600, fontSize: 17, cursor: 'pointer' }}>Cancel</button>
          <button style={{ flex: 1, background: '#1565c0', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', fontWeight: 700, fontSize: 17, cursor: 'pointer' }}>Pay</button>
        </div>
      </div>
    </div>
  );
};

export default AddInternationalCard; 