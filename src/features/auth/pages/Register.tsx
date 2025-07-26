import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import logoRailway from '../../../assets/logo-railway.png';
import userIcon from '../../../assets/user.svg';
import phoneIcon from '../../../assets/phone.png';
import passIcon from '../../../assets/lock.svg';
import eyeIcon from '../../../assets/eye.svg';
import facebookIcon from '../../../assets/facebook.png';
import appleIcon from '../../../assets/apple.png';
import googleIcon from '../../../assets/google.png';
import twitterIcon from '../../../assets/twitter.png';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();

  return (
    <div className={styles.screenCenter}>
      <div className={styles.phoneCard}>
        <img src={logoRailway} alt="Railway Logo" className={styles.logoRailway} />
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          &#8592;
        </button>
        <h1 className={styles.title}>Create <br />Account</h1>
        <div className={styles.inputGroup} style={{ top: 199 }}>
          <img src={userIcon} alt="user" className={styles.inputIcon} />
          <input
            type="text"
            placeholder="Username or Email"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup} style={{ top: 272 }}>
          <img src={phoneIcon} alt="phone" className={styles.inputIcon} />
          <input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup} style={{ top: 345 }}>
          <img src={passIcon} alt="password" className={styles.inputIcon} />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={styles.input}
          />
          <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(s => !s)}>
            <img src={eyeIcon} alt="show/hide" />
          </button>
        </div>
        <div className={styles.inputGroup} style={{ top: 418 }}>
          <img src={passIcon} alt="confirm password" className={styles.inputIcon} />
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Confirm password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className={styles.input}
          />
          <button type="button" className={styles.eyeBtn} onClick={() => setShowConfirm(s => !s)}>
            <img src={eyeIcon} alt="show/hide" />
          </button>
        </div>
        <button className={styles.createBtn}>Create Account</button>
        <div className={styles.socialSection}>
          <div className={styles.orRow}>
            <div className={styles.line} />
            <span className={styles.orText}>Or sign up with</span>
            <div className={styles.line} />
          </div>
          <div className={styles.socialRow}>
            <button className={styles.socialBtn}><img src={facebookIcon} alt="Facebook" /></button>
            <button className={styles.socialBtn}><img src={appleIcon} alt="Apple" /></button>
            <button className={styles.socialBtn}><img src={googleIcon} alt="Google" /></button>
            <button className={styles.socialBtn}><img src={twitterIcon} alt="Twitter" /></button>
          </div>
          <div className={styles.loginRow}>
            Already have an account?{' '}
            <Link to="/login" className={styles.loginLink}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 