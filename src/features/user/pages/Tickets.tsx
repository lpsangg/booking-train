import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { MdConfirmationNumber } from 'react-icons/md';

const tabList = [
  { id: 'current', label: 'Current' },
  { id: 'used', label: 'Used' },
  { id: 'cancelled', label: 'Cancelled' },
];

const Tickets = () => {
  const [tab, setTab] = useState('current');
  const [refreshing, setRefreshing] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const navigate = useNavigate();
  const startY = useRef<number | null>(null);
  const pulling = useRef(false);
  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('isLoggedIn') === 'true';

  useEffect(() => {
    const data = localStorage.getItem('tickets');
    if (data) setTickets(JSON.parse(data));
  }, []);

  // Xử lý pull-to-refresh cho tab Đã huỷ
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (tab === 'cancelled' && window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
      pulling.current = true;
    }
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!pulling.current || refreshing) return;
    const deltaY = e.touches[0].clientY - (startY.current ?? 0);
    if (deltaY > 60) {
      setRefreshing(true);
      pulling.current = false;
      setTimeout(() => setRefreshing(false), 1200);
    }
  };
  const handleTouchEnd = () => {
    pulling.current = false;
  };

  // Giao diện khi đã đăng nhập nhưng chưa có vé (theo UI user gửi)
  const renderEmptyState = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 90 }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ background: '#90caf9', borderRadius: 16, width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MdConfirmationNumber size={48} color="#fff" />
        </div>
      </div>
      <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8, color: '#222', textAlign: 'center' }}>You have no orders yet</div>
      <div style={{ fontSize: 16, color: '#666', textAlign: 'center', maxWidth: 320 }}>
        Try pulling down to refresh your orders from the last 3 months
      </div>
    </div>
  );

  // Giao diện tab "Đã huỷ" với hiệu ứng animate cho mũi tên và pull-to-refresh
  const renderCancelledTab = () => (
    <div
      style={{ marginTop: 90, textAlign: 'center', color: '#444', fontSize: 16, minHeight: 120 }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {refreshing ? (
        <>
          <span style={{
            fontSize: 28,
            marginRight: 6,
            display: 'inline-block',
            animation: 'spin 1s linear infinite',
            verticalAlign: 'middle',
          }}>↻</span> Refreshing...
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </>
      ) : (
        <>
          <span style={{
            fontSize: 28,
            marginRight: 6,
            display: 'inline-block',
            animation: 'arrowBounce 1.2s infinite',
            verticalAlign: 'middle',
          }}>↓</span> Pull down to refresh tickets from the last 3 months
          <style>{`
            @keyframes arrowBounce {
              0% { transform: translateY(0); }
              30% { transform: translateY(10px); }
              60% { transform: translateY(0); }
              100% { transform: translateY(0); }
            }
          `}</style>
        </>
      )}
    </div>
  );

  // Luôn render giao diện chính bên dưới (không cần kiểm tra isLoggedIn)
  return (
    <div style={{ background: '#f7f7fa', minHeight: '100vh', width: '100vw', fontFamily: 'Montserrat, Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#1976d2', color: '#fff', padding: '24px 0 10px 0', textAlign: 'left', position: 'relative', display: 'flex', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 22, paddingLeft: 18 }}>My Tickets</div>
      </div>
      {/* Tabs */}
      <div style={{ display: 'flex', background: '#fff', borderRadius: 12, margin: '18px 12px 0 12px', border: '1.5px solid #e0e0e0', overflow: 'hidden' }}>
        {tabList.map(t => (
          <div
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 17, padding: '12px 0 10px 0', color: tab === t.id ? '#1976d2' : '#888', borderBottom: tab === t.id ? '3px solid #1976d2' : '3px solid transparent', background: tab === t.id ? '#f3f8fd' : '#fff', cursor: 'pointer', transition: 'color 0.2s, background 0.2s' }}
          >
            {t.label}
          </div>
        ))}
      </div>
      {/* Danh sách vé */}
      <div style={{ maxWidth: 420, margin: '32px auto 0 auto', width: '100%' }}>
        {tickets.length === 0 ? (
          <div style={{ color: '#888', textAlign: 'center', marginTop: 48, fontSize: 18 }}>You have no tickets</div>
        ) : (
          tickets.map((ticket, idx) => (
            <div key={idx} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #e0e0e0', marginBottom: 18, padding: 18, cursor: 'pointer', transition: 'box-shadow 0.2s' }}
              onClick={() => {
                localStorage.setItem('ticketInfo', JSON.stringify(ticket));
                navigate('/e-ticket');
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 17, color: '#2346a0', marginBottom: 4 }}>{ticket.trainName || 'Train ?'}</div>
              <div style={{ color: '#3a6cf0', fontWeight: 600, marginBottom: 2 }}>{ticket.departDate}</div>
              <div style={{ color: '#222', fontSize: 15, marginBottom: 2 }}>Full name: <b>{ticket.passengerName || '-'}</b></div>
              <div style={{ color: '#888', fontSize: 14 }}>Seat(s): {ticket.selectedSeats || '-'}</div>
              <div style={{ color: '#e53935', fontWeight: 700, fontSize: 15 }}>Total price: {ticket.totalPrice?.toLocaleString() || '-'}đ</div>
            </div>
          ))
        )}
      </div>
      {/* Bottom bar */}
      <div style={{ position: 'fixed', left: 0, bottom: 0, width: '100%', background: '#fff', borderTop: '1.5px solid #e0e0e0', display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: 62, zIndex: 10 }}>
        <div style={{ flex: 1, textAlign: 'center', color: window.location.pathname === '/main' ? '#1976d2' : '#888', fontWeight: window.location.pathname === '/main' ? 700 : 400, cursor: 'pointer' }} onClick={() => window.location.pathname !== '/main' && window.location.assign('/main')}><div style={{ fontSize: 22 }}>🔍</div><div style={{ fontSize: 13 }}>Search</div></div>
        <div style={{ flex: 1, textAlign: 'center', color: window.location.pathname === '/tickets' ? '#1976d2' : '#888', fontWeight: window.location.pathname === '/tickets' ? 700 : 400, cursor: 'pointer' }} onClick={() => window.location.pathname !== '/tickets' && window.location.assign('/tickets')}><div style={{ fontSize: 22 }}>📅</div><div style={{ fontSize: 13 }}>My Tickets</div></div>
        <div style={{ flex: 1, textAlign: 'center', color: window.location.pathname === '/notifications' ? '#1976d2' : '#888', fontWeight: window.location.pathname === '/notifications' ? 700 : 400, cursor: 'pointer' }} onClick={() => window.location.pathname !== '/notifications' && window.location.assign('/notifications')}><div style={{ fontSize: 22 }}>🔔</div><div style={{ fontSize: 13 }}>Notifications</div></div>
        <div style={{ flex: 1, textAlign: 'center', color: window.location.pathname === '/account' ? '#1976d2' : '#888', fontWeight: window.location.pathname === '/account' ? 700 : 400, cursor: 'pointer' }} onClick={() => window.location.pathname !== '/account' && window.location.assign('/account')}><div style={{ fontSize: 22 }}>👤</div><div style={{ fontSize: 13 }}>Account</div></div>
      </div>
    </div>
  );
};

export default Tickets; 