import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FAQ_CATEGORIES } from './faqData';

const SupportCenter = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Lọc chủ đề theo search (nếu không có search)
  const filteredCategories = FAQ_CATEGORIES.filter(cat =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  // Lọc tất cả câu hỏi theo search
  const searchResults = search.trim()
    ? FAQ_CATEGORIES.flatMap(cat =>
        cat.faqs
          .map((faq, idx) => ({
            ...faq,
            catId: cat.id,
            catName: cat.name,
            catIcon: cat.icon,
            idx,
          }))
          .filter(faq =>
            faq.q.toLowerCase().includes(search.toLowerCase()) ||
            faq.a.toLowerCase().includes(search.toLowerCase())
          )
      )
    : [];

  return (
    <div style={{ background: '#f7f7fa', minHeight: '100vh', width: '100vw', fontFamily: 'Montserrat, Arial, sans-serif', fontSize: 15 }}>
      {/* Header với nút back và tag FAQ */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '18px 0 0 0' }}>
        <button
          onClick={() => navigate('/account')}
          style={{ background: 'none', border: 'none', color: '#1976d2', fontSize: 22, fontWeight: 700, marginLeft: 8, marginRight: 8, cursor: 'pointer' }}
        >&#8592;</button>
        <span style={{ background: '#e3f2fd', color: '#1976d2', fontWeight: 700, fontSize: 13, borderRadius: 8, padding: '4px 16px', letterSpacing: 1 }}>FAQ</span>
      </div>
      {/* Thanh tìm kiếm */}
      <div style={{ margin: '18px 12px 0 12px' }}>
        <input
          type="text"
          placeholder="Search questions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1.5px solid #b3c6e0', fontSize: 15, outline: 'none', boxSizing: 'border-box', background: '#fff' }}
        />
      </div>
      {/* Kết quả tìm kiếm câu hỏi */}
      {search.trim() ? (
        <div style={{ margin: '24px 0 0 0' }}>
          {searchResults.length === 0 && (
            <div style={{ color: '#888', textAlign: 'center', marginTop: 32 }}>No matching questions found.</div>
          )}
          {searchResults.map(faq => (
            <div
              key={faq.catId + '-' + faq.idx}
              style={{ background: '#fff', borderRadius: 12, margin: '0 12px 16px 12px', boxShadow: '0 2px 8px #0001', padding: '16px 18px', cursor: 'pointer', fontWeight: 500, fontSize: 15, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
              onClick={() => navigate(`/faq/${faq.catId}?q=${faq.idx}`)}
            >
              <div style={{ color: '#1976d2', fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
                {faq.catIcon} {faq.catName}
              </div>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{faq.q}</div>
              <div style={{ color: '#444', fontSize: 14, opacity: 0.85, whiteSpace: 'pre-line', maxHeight: 48, overflow: 'hidden', textOverflow: 'ellipsis' }}>{faq.a.slice(0, 80)}{faq.a.length > 80 ? '...' : ''}</div>
            </div>
          ))}
        </div>
      ) : (
        // Danh sách chủ đề
        <div style={{ margin: '24px 0 0 0' }}>
          {filteredCategories.map(cat => (
            <div
              key={cat.id}
              style={{ background: '#fff', borderRadius: 12, margin: '0 12px 16px 12px', boxShadow: '0 2px 8px #0001', display: 'flex', alignItems: 'center', padding: '16px 18px', cursor: 'pointer', fontWeight: 600, fontSize: 16 }}
              onClick={() => navigate(`/faq/${cat.id}`)}
            >
              <span style={{ fontSize: 26, marginRight: 16 }}>{cat.icon}</span>
              <span style={{ flex: 1 }}>{cat.name}</span>
              <span style={{ color: '#bbb', fontSize: 20 }}>{'>'}</span>
            </div>
          ))}
          {filteredCategories.length === 0 && (
            <div style={{ color: '#888', textAlign: 'center', marginTop: 32 }}>No matching topics found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SupportCenter; 