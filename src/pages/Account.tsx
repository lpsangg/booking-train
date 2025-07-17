import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaGift, FaCreditCard, FaRegCommentDots, FaCog, FaQuestionCircle, FaUserFriends, FaLock } from 'react-icons/fa';
import { MdOutlineRateReview } from 'react-icons/md';
import { BsFillGiftFill } from 'react-icons/bs';
import './Account.module.css';

const menu = [
  {
    icon: <FaStar size={22} color="#1976d2" />,
    title: 'My Rewards',
    desc: 'Accumulate reward points for exclusive offers',
    lock: true,
  },
  {
    icon: <BsFillGiftFill size={22} color="#1976d2" />,
    title: 'Promotions',
    desc: 'View your personalized promotions',
    lock: true,
  },
  {
    icon: <FaGift size={22} color="#1976d2" />,
    title: 'Referral Gifts',
    desc: '',
    badge: 'New',
    lock: true,
  },
  {
    icon: <FaCreditCard size={22} color="#1976d2" />,
    title: 'Card Management',
    desc: 'Save cards and pay with one tap',
    lock: true,
  },
  {
    icon: <MdOutlineRateReview size={22} color="#1976d2" />,
    title: 'Trip Reviews',
    desc: 'Share your experience to earn points',
    lock: true,
  },
];

const menu2 = [
  {
    icon: <FaCog size={22} color="#1976d2" />,
    title: 'Settings',
    desc: 'v1.0',
    right: true,
  },
  {
    icon: <FaQuestionCircle size={22} color="#1976d2" />,
    title: 'FAQ',
    right: true,
  },
  {
    icon: <FaRegCommentDots size={22} color="#1976d2" />,
    title: 'Feedback',
    right: true,
  },
];

const Account = () => {
  const navigate = useNavigate();
  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('isLoggedIn') === 'true';
  const username = typeof window !== 'undefined' ? localStorage.getItem('username') || 'admin' : 'admin';

  // Nếu chưa đăng nhập, giữ giao diện cũ
  if (!isLoggedIn) {
    return (
      <div style={{ background: '#f7f7fa', minHeight: '100vh', width: '100vw', fontFamily: 'Montserrat, Arial, sans-serif' }}>
        <div style={{ background: '#1976d2', color: '#fff', padding: '24px 0 16px 0', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 24, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1976d2', fontWeight: 700, fontSize: 24 }}> <FaUserFriends size={28} color="#1976d2" /> </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: 18 }}>Become a member</div>
                <div style={{ fontSize: 13, opacity: 0.9 }}>To enjoy more benefits</div>
              </div>
            </div>
            <button style={{ color: '#fff', fontWeight: 700, fontSize: 16, background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate('/login')}>Log in</button>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, margin: '16px 12px 0 12px', boxShadow: '0 2px 8px #0001', overflow: 'hidden' }}>
          {menu.map((item, idx) => (
            <div key={item.title} style={{ display: 'flex', alignItems: 'center', padding: '14px 0 14px 18px', borderBottom: idx === menu.length - 1 ? 'none' : '1px solid #f0f0f0', position: 'relative' }}>
              {item.icon}
              <div style={{ flex: 1, marginLeft: 14 }}>
                <div style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {item.title}
                  {item.badge && <span style={{ background: '#e53935', color: '#fff', fontSize: 11, fontWeight: 700, borderRadius: 8, padding: '2px 7px', marginLeft: 4 }}>{item.badge}</span>}
                </div>
                {item.desc && <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{item.desc}</div>}
              </div>
              {item.lock && <div style={{ marginRight: 18, opacity: 0.7 }}><FaLock size={18} color="#222" /></div>}
            </div>
          ))}
        </div>
        <div style={{ background: '#fff', borderRadius: 16, margin: '16px 12px 0 12px', boxShadow: '0 2px 8px #0001', overflow: 'hidden' }}>
          {menu2.map((item, idx) => (
            <div key={item.title} style={{ display: 'flex', alignItems: 'center', padding: '14px 0 14px 18px', borderBottom: idx === menu2.length - 1 ? 'none' : '1px solid #f0f0f0', position: 'relative' }}>
              {item.icon}
              <div style={{ flex: 1, marginLeft: 14, fontWeight: 600, fontSize: 15 }}>{item.title}</div>
              {item.desc && <div style={{ color: '#888', fontSize: 12, marginRight: 8 }}>{item.desc}</div>}
              <span style={{ color: '#bbb', fontSize: 18, marginRight: 18 }}>{'>'}</span>
            </div>
          ))}
        </div>
        {/* Bottom bar */}
        <div style={{ position: 'fixed', left: 0, bottom: 0, width: '100%', background: '#fff', borderTop: '1.5px solid #e0e0e0', display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: 62, zIndex: 10 }}>
          <div style={{ flex: 1, textAlign: 'center', color: '#888', cursor: 'pointer' }} onClick={() => navigate('/main')}><div style={{ fontSize: 22 }}>🔍</div><div style={{ fontSize: 13 }}>Search</div></div>
          <div style={{ flex: 1, textAlign: 'center', color: '#888', cursor: 'pointer' }} onClick={() => navigate('/tickets')}><div style={{ fontSize: 22 }}>📅</div><div style={{ fontSize: 13 }}>My Tickets</div></div>
          <div style={{ flex: 1, textAlign: 'center', color: '#888', cursor: 'pointer' }} onClick={() => navigate('/notifications')}><div style={{ fontSize: 22 }}>🔔</div><div style={{ fontSize: 13 }}>Notifications</div></div>
          <div style={{ flex: 1, textAlign: 'center', color: '#1976d2', fontWeight: 700 }}><div style={{ fontSize: 22 }}>👤</div><div style={{ fontSize: 13 }}>Account</div></div>
        </div>
      </div>
    );
  }

  // Đã đăng nhập: mở khóa toàn bộ chức năng, hiện avatar và tên user
  return (
    <div style={{ background: '#f7f7fa', minHeight: '100vh', width: '100vw', fontFamily: 'Montserrat, Arial, sans-serif' }}>
      <div style={{ background: '#1976d2', color: '#fff', padding: '24px 0 16px 0', textAlign: 'center', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=1976d2&color=fff&size=96`} alt="avatar" style={{ width: 48, height: 48, borderRadius: 24, background: '#fff', objectFit: 'cover', border: '2px solid #fff' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{username}</div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>Member</div>
            </div>
          </div>
          <button style={{ color: '#fff', fontWeight: 700, fontSize: 16, background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            window.location.reload();
          }}>Log out</button>
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 16, margin: '16px 12px 0 12px', boxShadow: '0 2px 8px #0001', overflow: 'hidden' }}>
        {menu.map((item, idx) => (
          <div key={item.title} style={{ display: 'flex', alignItems: 'center', padding: '14px 0 14px 18px', borderBottom: idx === menu.length - 1 ? 'none' : '1px solid #f0f0f0', position: 'relative', cursor: 'pointer' }}
            onClick={() => {
              if (item.title === 'My Rewards') navigate('/reward');
              if (item.title === 'Promotions') navigate('/promotions-list');
              if (item.title === 'Referral Gifts') navigate('/referral');
              if (item.title === 'Card Management') navigate('/cards');
              if (item.title === 'Trip Reviews') navigate('/review');
              if (item.title === 'Settings') navigate('/settings');
            }}>
            {item.icon}
            <div style={{ flex: 1, marginLeft: 14 }}>
              <div style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
                {item.title}
                {item.badge && <span style={{ background: '#e53935', color: '#fff', fontSize: 11, fontWeight: 700, borderRadius: 8, padding: '2px 7px', marginLeft: 4 }}>{item.badge}</span>}
              </div>
              {item.desc && <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{item.desc}</div>}
            </div>
            {/* Không hiện icon khoá khi đã đăng nhập */}
          </div>
        ))}
      </div>
      <div style={{ background: '#fff', borderRadius: 16, margin: '16px 12px 0 12px', boxShadow: '0 2px 8px #0001', overflow: 'hidden' }}>
        {menu2.map((item, idx) => (
          <div key={item.title} style={{ display: 'flex', alignItems: 'center', padding: '14px 0 14px 18px', borderBottom: idx === menu2.length - 1 ? 'none' : '1px solid #f0f0f0', position: 'relative', cursor: 'pointer' }}
            onClick={() => {
              if (item.title === 'Settings') navigate('/settings');
              if (item.title === 'FAQ') navigate('/support-center');
              if (item.title === 'Feedback') navigate('/feedback');
            }}>
            {item.icon}
            <div style={{ flex: 1, marginLeft: 14, fontWeight: 600, fontSize: 15 }}>{item.title}</div>
            {item.desc && <div style={{ color: '#888', fontSize: 12, marginRight: 8 }}>{item.desc}</div>}
            <span style={{ color: '#bbb', fontSize: 18, marginRight: 18 }}>{'>'}</span>
          </div>
        ))}
      </div>
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

export default Account; 