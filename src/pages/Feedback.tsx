import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const issues = [
  'Booking issue',
  'Payment issue',
  'Account issue',
  'Other',
];

const Feedback = () => {
  const navigate = useNavigate();
  const [type, setType] = useState<'feedback' | 'bug'>('feedback');
  const [issue, setIssue] = useState('');
  const [content, setContent] = useState('');

  return (
    <div style={{ background: '#f7f7fa', minHeight: '100vh', width: '100vw', fontFamily: 'Montserrat, Arial, sans-serif', fontSize: 15 }}>
      {/* Header */}
      <div style={{ background: '#1976d2', color: '#fff', padding: '16px 0 12px 0', textAlign: 'left', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, fontWeight: 700, marginLeft: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
      </div>
      {/* Card nội dung */}
      <div style={{ background: '#fff', borderRadius: 16, margin: '18px 12px 0 12px', boxShadow: '0 2px 8px #0001', padding: '18px 0 24px 0' }}>
        {/* Title */}
        <div style={{ fontSize: 22, margin: '0 0 6px 0', color: '#111', textAlign: 'center' }}>We are always listening</div>
        <div style={{ color: '#666', fontSize: 15, margin: '0 0 18px 0', maxWidth: 340, textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
          We value all feedback and continuously improve to serve you better.
        </div>
        {/* Chọn loại */}
        <div style={{ fontWeight: 700, fontSize: 16, margin: '0 0 10px 18px', color: '#222' }}>I want to</div>
        <div style={{ display: 'flex', gap: 16, margin: '0 18px 18px 18px' }}>
          <div onClick={() => setType('feedback')} style={{ flex: 1, border: type === 'feedback' ? '2px solid #1976d2' : '1.5px solid #ddd', borderRadius: 10, padding: '16px 0', textAlign: 'center', fontWeight: 700, color: type === 'feedback' ? '#1976d2' : '#888', background: type === 'feedback' ? '#f3f8fd' : '#fff', cursor: 'pointer', fontSize: 16, transition: 'all 0.2s' }}>
            <span style={{ fontSize: 18, marginRight: 6 }}>❗</span> Feedback
          </div>
          <div onClick={() => setType('bug')} style={{ flex: 1, border: type === 'bug' ? '2px solid #1976d2' : '1.5px solid #ddd', borderRadius: 10, padding: '16px 0', textAlign: 'center', fontWeight: 700, color: type === 'bug' ? '#1976d2' : '#888', background: type === 'bug' ? '#f3f8fd' : '#fff', cursor: 'pointer', fontSize: 16, transition: 'all 0.2s', opacity: 0.5 }}>
            <span style={{ fontSize: 18, marginRight: 6 }}>⚠️</span> Report bug
          </div>
        </div>
        {/* Chọn vấn đề */}
        <div style={{ fontWeight: 700, fontSize: 16, margin: '0 0 10px 18px', color: '#222' }}>About</div>
        <div style={{ margin: '0 18px 18px 18px' }}>
          <select value={issue} onChange={e => setIssue(e.target.value)} style={{ width: '100%', padding: '14px 12px', borderRadius: 10, border: '1.5px solid #bbb', fontSize: 15, color: issue ? '#222' : '#888', background: '#fff' }}>
            <option value="">Select the issue you encountered</option>
            {issues.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        {/* Nội dung góp ý */}
        <div style={{ fontWeight: 700, fontSize: 16, margin: '0 0 10px 18px', color: '#222' }}>Feedback content</div>
        <div style={{ margin: '0 18px 18px 18px' }}>
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Please describe in detail" style={{ width: '100%', minHeight: 90, borderRadius: 10, border: '1.5px solid #bbb', fontSize: 15, padding: '12px', background: '#fff', color: '#222', resize: 'vertical' }} />
        </div>
        {/* Nút gửi */}
        <div style={{ margin: '24px 18px 0 18px' }}>
          <button style={{ width: '100%', background: '#1976d2', color: '#fff', fontWeight: 700, fontSize: 18, borderRadius: 10, padding: '16px 0', border: 'none', boxShadow: '0 2px 8px #0001', cursor: 'pointer' }}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default Feedback; 