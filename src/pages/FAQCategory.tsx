import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { FAQ_CATEGORIES } from './faqData';

const FAQCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const category = FAQ_CATEGORIES.find(cat => cat.id === id);
  const qIdx = parseInt(searchParams.get('q') || '', 10);
  const faqRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!isNaN(qIdx) && faqRefs.current[qIdx]) {
      faqRefs.current[qIdx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [qIdx]);

  if (!category) {
    return <div style={{ padding: 32, color: '#e53935', fontWeight: 600 }}>FAQ topic not found.</div>;
  }

  return (
    <div style={{ background: '#f7f7fa', minHeight: '100vh', width: '100vw', fontFamily: 'Montserrat, Arial, sans-serif', fontSize: 15 }}>
      {/* Header */}
      <div style={{ background: '#1976d2', color: '#fff', padding: '16px 0 12px 0', textAlign: 'left', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, fontWeight: 700, marginLeft: 12, cursor: 'pointer' }}>&#8592;</button>
        <div style={{ fontWeight: 700, fontSize: 18, flex: 1, textAlign: 'left', marginLeft: 8 }}>{category.icon} {category.name}</div>
      </div>
      {/* Danh sách câu hỏi/đáp */}
      <div style={{ margin: '24px 0 0 0' }}>
        {category.faqs.map((faq, idx) => (
          <div
            key={idx}
            ref={el => { faqRefs.current[idx] = el; }}
            style={{ background: '#fff', borderRadius: 12, margin: '0 12px 18px 12px', boxShadow: '0 2px 8px #0001', padding: '18px 18px' }}
          >
            <div style={{ fontWeight: 600, fontSize: 16, color: '#1976d2', marginBottom: 8 }}>{faq.q}</div>
            <div style={{ color: '#222', fontSize: 15, whiteSpace: 'pre-line' }}>{faq.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQCategory; 