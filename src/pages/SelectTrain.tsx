import React, { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import styles from './SelectTrain.module.css';

const tickets = [
  {
    id: 1,
    best: true,
    depart: '12:50',
    arrive: '03:40',
    from: 'Ga Hà Nội',
    to: 'Ga Sài Gòn',
    train: 'SE9',
    seat: 'Ngồi mềm',
    price: '1.017.000đ',
    duration: '1 ngày 14h 50p',
  },
  {
    id: 2,
    best: false,
    depart: '08:55',
    arrive: '20:20',
    from: 'Ga Hà Nội',
    to: 'Ga Sài Gòn',
    train: 'SE5',
    seat: 'Nằm khoang 6',
    price: '1.017.000đ',
    duration: '1 ngày 11h 25p',
  },
];

const SelectTrain = () => {
  const [selectedType, setSelectedType] = useState('all');

  return (
    <div className={styles.container}>
      {/* Top info */}
      <div className={styles.topInfo}>
        <div className={styles.route}>
          <span>Hà Nội</span>
          <span className={styles.arrow}>→</span>
          <span>Hồ Chí Minh</span>
        </div>
        <div className={styles.date}>T6, 18/07/2025</div>
        <div className={styles.passenger}>1 Hành khách</div>
      </div>
      <div className={styles.mainContent}>
        {/* Filter */}
        <div className={styles.filter}>
          <div className={styles.filterTitle}>Bộ lọc</div>
          <div className={styles.filterGroup}>
            <div className={styles.filterLabel}>Giờ đi</div>
            <div className={styles.filterOptions}>
              <label><input type="checkbox" /> Sáng sớm</label>
              <label><input type="checkbox" /> Buổi sáng</label>
              <label><input type="checkbox" /> Buổi chiều</label>
              <label><input type="checkbox" /> Buổi tối</label>
            </div>
          </div>
          <div className={styles.filterGroup}>
            <div className={styles.filterLabel}>Giờ đến</div>
            <div className={styles.filterOptions}>
              <label><input type="checkbox" /> Sáng sớm</label>
              <label><input type="checkbox" /> Buổi sáng</label>
              <label><input type="checkbox" /> Buổi chiều</label>
              <label><input type="checkbox" /> Buổi tối</label>
            </div>
          </div>
          <div className={styles.filterGroup}>
            <div className={styles.filterLabel}>Loại ghế / giường</div>
            <div className={styles.filterOptions}>
              <label><input type="radio" name="type" checked={selectedType === 'all'} onChange={() => setSelectedType('all')} /> Tất cả</label>
              <label><input type="radio" name="type" checked={selectedType === 'ngoi-cung'} onChange={() => setSelectedType('ngoi-cung')} /> Ngồi cứng</label>
              <label><input type="radio" name="type" checked={selectedType === 'ngoi-mem'} onChange={() => setSelectedType('ngoi-mem')} /> Ngồi mềm</label>
              <label><input type="radio" name="type" checked={selectedType === 'khoang-4'} onChange={() => setSelectedType('khoang-4')} /> Nằm khoang 4</label>
              <label><input type="radio" name="type" checked={selectedType === 'khoang-6'} onChange={() => setSelectedType('khoang-6')} /> Nằm khoang 6</label>
            </div>
          </div>
        </div>
        {/* Ticket list */}
        <div className={styles.ticketList}>
          {tickets.map((ticket, idx) => (
            <Card className={styles.ticketCard} key={ticket.id}>
              {ticket.best && <div className={styles.bestLabel}>Chọn vé đi Hồ Chí Minh tốt nhất</div>}
              <div className={styles.ticketRow}>
                <div className={styles.timeCol}>
                  <div className={styles.depart}>{ticket.depart}</div>
                  <div className={styles.from}>{ticket.from}</div>
                </div>
                <div className={styles.arrowCol}>
                  <span className={styles.arrowBig}>→</span>
                  <div className={styles.duration}>{ticket.duration}</div>
                </div>
                <div className={styles.timeCol}>
                  <div className={styles.arrive}>{ticket.arrive}</div>
                  <div className={styles.to}>{ticket.to}</div>
                </div>
                <div className={styles.infoCol}>
                  <div className={styles.train}>Tàu {ticket.train}</div>
                  <div className={styles.seat}>{ticket.seat}</div>
                </div>
                <div className={styles.priceCol}>
                  <div className={styles.price}>{ticket.price}</div>
                  <Button className={styles.bookBtn}>Đặt vé</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectTrain; 