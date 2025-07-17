import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BANKS = [
    { name: 'Vietcombank', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Vietcombank_logo_fixed.svg' },
    { name: 'BIDV',       logo: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Logo_BIDV.svg' },
    { name: 'VPBank',     logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/VPBank_logo.svg' },
    { name: 'Sacombank',  logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Logo-Sacombank-new.png' },
    { name: 'VietinBank', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Vietinbank.png' },
  ];
  

const AddDomesticCard = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const filtered = BANKS.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ background: '#f7f7fa', minHeight: '100vh', width: '100vw', fontFamily: 'Montserrat, Arial, sans-serif', fontSize: 15 }}>
      {/* Header */}
      <div style={{ background: '#1976d2', color: '#fff', padding: '16px 0 12px 0', textAlign: 'left', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, fontWeight: 700, marginLeft: 12, cursor: 'pointer' }}>&#8592;</button>
        <div style={{ fontWeight: 700, fontSize: 18, flex: 1, textAlign: 'left', marginLeft: 8 }}>Thêm thẻ mới</div>
      </div>
      {/* Search */}
      <div style={{ margin: '18px 14px 0 14px' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm ngân hàng trong danh sách dưới" style={{ width: '100%', padding: '12px 16px', borderRadius: 24, border: 'none', background: '#f3f3f3', fontSize: 17, outline: 'none', marginBottom: 8 }} />
      </div>
      {/* Grid bank */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, padding: '10px 14px 0 14px' }}>
        {filtered.map(bank => (
          <div key={bank.name} onClick={() => setSelected(bank.name)} style={{ background: '#fff', borderRadius: 12, border: selected === bank.name ? '2.5px solid #1976d2' : '1.5px solid #eee', boxShadow: '0 2px 8px #0001', padding: '18px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: 60 }}>
            <img src={bank.logo} alt={bank.name} style={{ maxHeight: 32, maxWidth: 90, objectFit: 'contain' }} />
          </div>
        ))}
      </div>
      {/* Button tiếp tục */}
      <div style={{ position: 'fixed', left: 0, bottom: 0, width: '100%', background: '#fafbfc', borderTop: '1.5px solid #eee', padding: '16px 0', zIndex: 10 }}>
        <button disabled={!selected} style={{ width: '92%', margin: '0 4%', background: selected ? '#1976d2' : '#e0e0e0', color: selected ? '#fff' : '#aaa', fontWeight: 700, fontSize: 20, borderRadius: 12, padding: '14px 0', border: 'none', boxShadow: selected ? '0 2px 8px #1976d2aa' : 'none', cursor: selected ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }} onClick={() => selected && navigate(`/atm-domestic-confirm?bank=${encodeURIComponent(selected)}`)}>Tiếp tục</button>
      </div>
    </div>
  );
};

export default AddDomesticCard; 