import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import styles from './Home.module.css';
import logoVNR from "../assets/logo-vnr.png";
import logoRailway from "../assets/logo-railway.png";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.screenCenter}>
      <div className={styles.phoneCard}>
        <img src={logoRailway} alt="Railway Logo" className={styles.logoRailway} />
        <img src={logoVNR} alt="VNR Logo" className={styles.logoVNR} />
        <button className={styles.registerBtn} onClick={() => navigate('/register')}>REGISTER</button>
        <div className={styles.bottomText}>
          Already a user? <Link to="/login" className={styles.bold}>Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 