import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import logoRailway from '../assets/logo-railway.png';
import userIcon from '../assets/user.svg';
import passIcon from '../assets/lock.svg';
import eyeIcon from '../assets/eye.svg';
import facebookIcon from '../assets/facebook.png';
import appleIcon from '../assets/apple.png';
import googleIcon from '../assets/google.png';
import twitterIcon from '../assets/twitter.png';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
      setError('');
      navigate('/main'); // Điều hướng sang trang Main sau đăng nhập
    } else {
      setError('Sai tài khoản hoặc mật khẩu!');
    }
  };

  return (
    <div className={styles.screenCenter}>
      <div className={styles.phoneCard}>
        <button style={{ position: 'absolute', top: 48, left: 13, width: 49, height: 49, borderRadius: 12, background: '#fff', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, padding: 0 }} onClick={() => navigate(-1)}>
          <svg width="24" height="24" fill="none" stroke="#26457c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <img src={logoRailway} alt="Railway Logo" style={{ position: 'absolute', top: 26, right: 6, width: 79, height: 86, objectFit: 'cover' }} />
        <h1 style={{ position: 'absolute', top: 127, left: 17, width: 331, fontFamily: 'Montserrat, Helvetica, Arial, sans-serif', fontSize: 40, fontWeight: 700, color: '#26457c', lineHeight: '43px', textAlign: 'left', margin: 0 }}>Welcome <br />back!</h1>
        <div style={{ position: 'absolute', top: 265, left: 24, width: 296, height: 55, display: 'flex', alignItems: 'center', background: '#f3f3f3', borderRadius: 10, boxShadow: '0px 4px 4px #00000040', padding: '0 16px' }}>
          <img src={userIcon} alt="user" style={{ width: 23, height: 26, marginRight: 12 }} />
          <input
            type="text"
            placeholder="Username or Email"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', height: '100%', flex: 1, fontFamily: 'Montserrat, Helvetica, Arial, sans-serif', fontWeight: 500, fontSize: 18, color: '#676767' }}
          />
        </div>
        <div style={{ position: 'absolute', top: 345, left: 24, width: 296, height: 55, display: 'flex', alignItems: 'center', background: '#f3f3f3', borderRadius: 10, boxShadow: '0px 4px 4px #00000040', padding: '0 16px' }}>
          <img src={passIcon} alt="password" style={{ width: 23, height: 26, marginRight: 12 }} />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', height: '100%', flex: 1, fontFamily: 'Montserrat, Helvetica, Arial, sans-serif', fontWeight: 500, fontSize: 18, color: '#676767' }}
          />
          <button type="button" onClick={() => setShowPassword(s => !s)} style={{ background: 'none', border: 'none', marginLeft: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
            <img src={eyeIcon} alt="show/hide" style={{ width: 22, height: 22 }} />
          </button>
        </div>
        <div className={styles.forgotRow} style={{ position: 'absolute', top: 422, right: 17 }}>
          <Link to="/forget" className={styles.forgotLink}>Forgot password?</Link>
        </div>
        <button className={styles.loginBtn} style={{ position: 'absolute', top: 493, left: 104, width: 157, height: 45, background: '#26457c', color: '#fff', fontFamily: 'Urbanist, Helvetica, Arial, sans-serif', fontSize: 20, fontWeight: 600, borderRadius: 22, boxShadow: '0 4px 12px rgba(35,70,160,0.13)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={handleLogin}>Sign in</button>
        {error && <div style={{ color: 'red', position: 'absolute', top: 550, left: 24, right: 24, textAlign: 'center', fontWeight: 600 }}>{error === 'Sai tài khoản hoặc mật khẩu!' ? 'Incorrect username or password!' : error}</div>}
        <div className={styles.orRow} style={{ position: 'absolute', top: 577, left: 17, width: 333, height: 19, display: 'flex', alignItems: 'center' }}>
          <div className={styles.line} />
          <span className={styles.orText}>Or sign in with</span>
          <div className={styles.line} />
        </div>
        <div className={styles.socialRow} style={{ position: 'absolute', top: 621, left: 17, width: 333, display: 'flex', justifyContent: 'space-between' }}>
          <button className={styles.socialBtn}><img src={facebookIcon} alt="Facebook" /></button>
          <button className={styles.socialBtn}><img src={appleIcon} alt="Apple" /></button>
          <button className={styles.socialBtn}><img src={googleIcon} alt="Google" /></button>
          <button className={styles.socialBtn}><img src={twitterIcon} alt="Twitter" /></button>
        </div>
        {/* Nút "ĐỂ SAU" */}
        <button 
          onClick={() => navigate('/main')}
          style={{ 
            position: 'absolute', 
            top: 680, 
            left: 17, 
            width: 330, 
            height: 45, 
            background: '#f0f0f0', 
            color: '#666', 
            fontFamily: 'Urbanist, Helvetica, Arial, sans-serif', 
            fontSize: 18, 
            fontWeight: 600, 
            borderRadius: 22, 
            border: '1px solid #ddd', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          Skip for now
        </button>
        <div className={styles.registerRow} style={{ position: 'absolute', top: 750, left: 17, width: 330, textAlign: 'center', fontFamily: 'Urbanist, Helvetica, Arial, sans-serif', fontSize: 18, color: '#1e232c' }}>
          Don't have an account?{' '}
          <Link to="/register" className={styles.registerLink}>Register now</Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 