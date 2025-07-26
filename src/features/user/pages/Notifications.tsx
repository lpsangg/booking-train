import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { MdNotificationsNone } from 'react-icons/md';

const Notifications = () => {
  const [tab, setTab] = useState('trip');
  const navigate = useNavigate();
  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('isLoggedIn') === 'true';

  // Giao diện đã đăng nhập nhưng chưa có thông báo (theo hình user gửi)
  const renderEmptyState = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 90 }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ background: '#90caf9', borderRadius: 16, width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MdNotificationsNone size={48} color="#fff" />
        </div>
      </div>
      <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8, color: '#222', textAlign: 'center' }}>You have no notifications</div>
      <div style={{ fontSize: 16, color: '#666', textAlign: 'center', maxWidth: 320 }}>
        You will receive notifications about trip updates, reward points, or promotions here.
      </div>
    </div>
  );

  // Giao diện chưa đăng nhập (giữ nguyên)
  if (!isLoggedIn) {
    return (
      <div style={{ background: '#f7f7fa', minHeight: '100vh', width: '100vw', fontFamily: 'Montserrat, Arial, sans-serif' }}>
        {/* Header */}
        <div style={{ background: '#1976d2', color: '#fff', padding: '24px 0 10px 0', textAlign: 'left', position: 'relative' }}>
          <div style={{ fontWeight: 700, fontSize: 22, paddingLeft: 18 }}>Notifications</div>
          {/* Tabs */}
          <div style={{ display: 'flex', background: '#fff', borderRadius: 0, marginTop: 18 }}>
            <div
              onClick={() => setTab('trip')}
              style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 17, padding: '12px 0 10px 0', color: tab === 'trip' ? '#1976d2' : '#888', borderBottom: tab === 'trip' ? '3px solid #1976d2' : '3px solid transparent', cursor: 'pointer', transition: 'color 0.2s' }}
            >
              Trip
            </div>
            <div
              onClick={() => setTab('promo')}
              style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 17, padding: '12px 0 10px 0', color: tab === 'promo' ? '#1976d2' : '#888', borderBottom: tab === 'promo' ? '3px solid #1976d2' : '3px solid transparent', cursor: 'pointer', transition: 'color 0.2s' }}
            >
              Promotions
            </div>
          </div>
        </div>
        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 64 }}>
          <div style={{ marginBottom: 18 }}><FaUserCircle size={90} color="#90caf9" /></div>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, color: '#222' }}>You are not logged in</div>
          <div style={{ fontSize: 15, color: '#444', textAlign: 'center', marginBottom: 28, maxWidth: 320 }}>
            Log in to view notifications about your trips, reward points, or promotions.
          </div>
          <button
            style={{ background: '#0a1e5e', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 12, padding: '12px 48px', boxShadow: '0 2px 8px #0001', cursor: 'pointer' }}
            onClick={() => navigate('/login')}
          >
            Log in
          </button>
        </div>
        {/* Bottom bar */}
        <div style={{ position: 'fixed', left: 0, bottom: 0, width: '100%', background: '#fff', borderTop: '1.5px solid #e0e0e0', display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: 62, zIndex: 10 }}>
          <div style={{ flex: 1, textAlign: 'center', color: '#888', cursor: 'pointer' }} onClick={() => navigate('/main')}><div style={{ fontSize: 22 }}>🔍</div><div style={{ fontSize: 13 }}>Search</div></div>
          <div style={{ flex: 1, textAlign: 'center', color: '#888', cursor: 'pointer' }} onClick={() => navigate('/tickets')}><div style={{ fontSize: 22 }}>📅</div><div style={{ fontSize: 13 }}>My Tickets</div></div>
          <div style={{ flex: 1, textAlign: 'center', color: '#1976d2', fontWeight: 700 }}><div style={{ fontSize: 22 }}>🔔</div><div style={{ fontSize: 13 }}>Notifications</div></div>
          <div style={{ flex: 1, textAlign: 'center', color: '#888', cursor: 'pointer' }} onClick={() => navigate('/account')}><div style={{ fontSize: 22 }}>👤</div><div style={{ fontSize: 13 }}>Account</div></div>
        </div>
      </div>
    );
  }

  // Đã đăng nhập: giao diện theo UI user gửi
  return (
    <div style={{ background: '#f7f7fa', minHeight: '100vh', width: '100vw', fontFamily: 'Montserrat, Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#1976d2', color: '#fff', padding: '24px 0 10px 0', textAlign: 'left', position: 'relative' }}>
        <div style={{ fontWeight: 700, fontSize: 22, paddingLeft: 18 }}>Notifications</div>
      </div>
      {/* Tabs */}
      <div style={{ display: 'flex', background: '#fff', borderRadius: 12, margin: '18px 12px 0 12px', border: '1.5px solid #e0e0e0', overflow: 'hidden' }}>
        <div
          onClick={() => setTab('trip')}
          style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 17, padding: '12px 0 10px 0', color: tab === 'trip' ? '#1976d2' : '#888', borderBottom: tab === 'trip' ? '3px solid #1976d2' : '3px solid transparent', background: tab === 'trip' ? '#f3f8fd' : '#fff', cursor: 'pointer', transition: 'color 0.2s, background 0.2s' }}
        >
          Trip
        </div>
        <div
          onClick={() => setTab('promo')}
          style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 17, padding: '12px 0 10px 0', color: tab === 'promo' ? '#1976d2' : '#888', borderBottom: tab === 'promo' ? '3px solid #1976d2' : '3px solid transparent', background: tab === 'promo' ? '#f3f8fd' : '#fff', cursor: 'pointer', transition: 'color 0.2s, background 0.2s' }}
        >
          Promotions
        </div>
      </div>
      {/* Content */}
      {renderEmptyState()}
      {/* Bottom bar */}
      <div style={{ position: 'fixed', left: 0, bottom: 0, width: '100%', background: '#fff', borderTop: '1.5px solid #e0e0e0', display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: 62, zIndex: 10 }}>
        <div style={{ flex: 1, textAlign: 'center', color: window.location.pathname === '/main' ? '#1976d2' : '#888', fontWeight: window.location.pathname === '/main' ? 700 : 400, cursor: 'pointer' }} onClick={() => navigate('/main')}><div style={{ fontSize: 22 }}>🔍</div><div style={{ fontSize: 13 }}>Search</div></div>
        <div style={{ flex: 1, textAlign: 'center', color: window.location.pathname === '/tickets' ? '#1976d2' : '#888', fontWeight: window.location.pathname === '/tickets' ? 700 : 400, cursor: 'pointer' }} onClick={() => navigate('/tickets')}><div style={{ fontSize: 22 }}>📅</div><div style={{ fontSize: 13 }}>My Tickets</div></div>
        <div style={{ flex: 1, textAlign: 'center', color: window.location.pathname === '/notifications' ? '#1976d2' : '#888', fontWeight: window.location.pathname === '/notifications' ? 700 : 400, cursor: 'pointer' }} onClick={() => navigate('/notifications')}><div style={{ fontSize: 22 }}>🔔</div><div style={{ fontSize: 13 }}>Notifications</div></div>
        <div style={{ flex: 1, textAlign: 'center', color: window.location.pathname === '/account' ? '#1976d2' : '#888', fontWeight: window.location.pathname === '/account' ? 700 : 400, cursor: 'pointer' }} onClick={() => navigate('/account')}><div style={{ fontSize: 22 }}>👤</div><div style={{ fontSize: 13 }}>Account</div></div>
      </div>
    </div>
  );
};

export default Notifications; 