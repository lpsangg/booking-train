import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import styles from './ETicket.module.css';
import { useNavigate } from 'react-router-dom';

const ETicket = () => {
  const [ticket, setTicket] = useState<any>(null);
  const [passengerInfo, setPassengerInfo] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('ticketInfo');
    if (data) setTicket(JSON.parse(data));
    const pInfo = localStorage.getItem('passengerInfo');
    if (pInfo) setPassengerInfo(JSON.parse(pInfo));
  }, []);

  const handleHome = () => {
    if (ticket) {
      // Lưu vé vào danh sách tickets trong localStorage
      const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
      // Gắn thêm thông tin hành khách vào vé
      const ticketWithPassenger = { ...ticket, passengerName: passengerInfo?.name || '' };
      // Tránh lưu trùng vé (dựa vào thời gian hoặc selectedSeats)
      const isDuplicate = tickets.some((t: any) => t.selectedSeats === ticket.selectedSeats && t.departDate === ticket.departDate);
      if (!isDuplicate) {
        tickets.unshift(ticketWithPassenger);
        localStorage.setItem('tickets', JSON.stringify(tickets));
      }
    }
    navigate('/tickets');
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => window.history.back()} aria-label="Go back">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 8 12 15 6" />
          </svg>
        </button>
        <span className={styles.headerTitle}>E-Ticket</span>
        <div className={styles.headerRight}></div>
      </div>

      {/* Ticket Card */}
      <div className={styles.ticketWrapper}>
        <Card className={styles.ticketCard}>
          <div className={styles.ticketTop}>
            <div className={styles.trainInfo}>
              <div className={styles.trainCode}>{ticket?.trainName || '-'}</div>
              <div className={styles.date}>{ticket?.departDate || '-'}</div>
            </div>
            <div className={styles.timeRow}>
              <div className={styles.timeCol}>
                <div className={styles.time}>--</div>
                <div className={styles.station}>{ticket?.from || '-'}</div>
              </div>
              <div className={styles.duration}>
                <div className={styles.trainIcon}>🚆</div>
                <div className={styles.durationText}></div>
              </div>
              <div className={styles.timeCol}>
                <div className={styles.time}>--</div>
                <div className={styles.station}>{ticket?.to || '-'}</div>
              </div>
            </div>
            {/* Passenger info */}
            <div className={styles.infoRow}>
              <div>Full name: <b>{passengerInfo?.name || '-'}</b></div>
            </div>
            <div className={styles.infoRow}>
              <div>Ticket(s): <b>{ticket?.totalPassengers || '-'}</b></div>
              <div>Seat(s): <b>{ticket?.selectedSeats || '-'}</b></div>
              <div>Total price: <b>{ticket?.totalPrice?.toLocaleString() || '-'}đ</b></div>
            </div>
          </div>
          <div className={styles.qrSection}>
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=SampleTicket123"
              alt="QR Code"
              className={styles.qr}
            />
            <span>Scan this code at the gate or on the train</span>
          </div>
        </Card>
      </div>
      <Button className={styles.printBtn} onClick={handleHome}>Home</Button>
    </div>
  );
};

export default ETicket; 