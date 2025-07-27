import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import Input from '../../../components/Input';
import styles from './Payment.module.css';

const Payment = () => {
  const [method, setMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [countdown, setCountdown] = useState(600); // 10 phút = 600 giây
  const [showCardError, setShowCardError] = useState(false);
  
  // Lấy dữ liệu từ localStorage (ưu tiên) hoặc URL params (fallback)
  const ticketInfo = JSON.parse(localStorage.getItem('ticketInfo') || '{}');
  const [searchParams] = useSearchParams();
  const trainId = ticketInfo.trainId || searchParams.get('trainId');
  const trainName = ticketInfo.trainName || searchParams.get('trainName');
  const selectedSeats = (ticketInfo.selectedSeats ? ticketInfo.selectedSeats.split(',') : (searchParams.get('selectedSeats')?.split(',') || []));
  const totalPrice = ticketInfo.totalPrice || parseInt(searchParams.get('totalPrice') || '0');
  const from = ticketInfo.from || searchParams.get('from');
  const to = ticketInfo.to || searchParams.get('to');
  const departDate = ticketInfo.departDate || searchParams.get('departDate');
  const returnDate = ticketInfo.returnDate || searchParams.get('returnDate');
  const isRoundTrip = typeof ticketInfo.isRoundTrip === 'boolean' ? ticketInfo.isRoundTrip : (searchParams.get('isRoundTrip') === 'true');
  const passenger = ticketInfo.passenger || {
    adult: parseInt(searchParams.get('adult') || '0'),
    child: parseInt(searchParams.get('child') || '0'),
    elderly: parseInt(searchParams.get('elderly') || '0'),
    student: parseInt(searchParams.get('student') || '0'),
    union: parseInt(searchParams.get('union') || '0')
  };
  const totalPassengers = ticketInfo.totalPassengers || Object.values(passenger).reduce((sum, count) => Number(sum) + Number(count), 0);

  // Lấy thông tin hành khách từ localStorage
  const passengerInfo = JSON.parse(localStorage.getItem('passengerInfo') || '{}');
  const passengerName = passengerInfo.name || '';
  const passengerCccd = passengerInfo.cccd || '';

  // Debug: log dữ liệu nhận được
  console.log('Payment component received data:', {
    trainId,
    trainName,
    selectedSeats,
    totalPrice,
    from,
    to,
    departDate,
    returnDate,
    isRoundTrip,
    passenger,
    totalPassengers
  });

  // Format thông tin ghế đã chọn
  const formatSelectedSeats = () => {
    if (selectedSeats.length === 0) return 'No seat selected';
    
    // Nếu chỉ có 1 ghế
    if (selectedSeats.length === 1) {
      const seat = selectedSeats[0];
      const parts = seat.split('-');
      if (parts.length === 2) {
        const coachId = parseInt(parts[0]);
        const seatNumber = parseInt(parts[1]);
          return `Coach ${coachId} - Seat ${seatNumber}`;
      }
      return seat;
    }
    
    // Nếu có nhiều ghế, nhóm theo toa
    const seatsByCoach: { [key: string]: { seats: number[] } } = {};
    selectedSeats.forEach((seat: string) => {
      const parts = seat.split('-');
      if (parts.length === 2) {
        const coachId = parts[0];
        const seatNumber = parseInt(parts[1]);
        
        if (!seatsByCoach[coachId]) {
          seatsByCoach[coachId] = {
            seats: []
          };
        }
        seatsByCoach[coachId].seats.push(seatNumber);
      }
    });
    
    // Format theo từng toa
    const coachInfo = Object.entries(seatsByCoach).map(([coachId, info]) => {
      const sortedSeats = info.seats.sort((a, b) => a - b);
      
      // Hiển thị tên ghế cho tất cả các toa
        let seatDisplay = '';
        
        // Kiểm tra nếu là dãy liên tiếp
        if (sortedSeats.length > 1 && sortedSeats[sortedSeats.length - 1] - sortedSeats[0] === sortedSeats.length - 1) {
          seatDisplay = `${sortedSeats[0]}-${sortedSeats[sortedSeats.length - 1]}`;
        } else {
          seatDisplay = sortedSeats.join(', ');
        }
        
      return `Coach ${coachId} - Seat ${seatDisplay}`;
    });
    
    return coachInfo.join('; ');
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Thêm biến kiểm tra đủ điều kiện thanh toán với Visa/Mastercard
  const isCardInfoValid = method !== 'card' || (
    cardNumber.trim() && cardName.trim() && expiry.trim() && cvv.trim()
  );

  return (
    <div style={{ background: '#f7f7fa', minHeight: '100vh', width: '100vw' }}>
      {/* Header tràn viền, nội dung căn giữa */}
      <div style={{ background: '#1976d2', color: '#fff', padding: 16, borderRadius: '0 0 16px 16px', marginBottom: 8, width: '100%', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{from} → {to}</div>
          <div style={{ fontSize: 14, margin: '2px 0 6px 0' }}>{departDate}{isRoundTrip && returnDate ? ` • ${returnDate}` : ''} • {totalPassengers} passenger(s)</div>
          <div style={{ display: 'flex', gap: 8, fontSize: 13, marginTop: 2 }}>
            <span style={{ color: '#bbdefb' }}>1 Select seat</span>
            <span style={{ color: '#bbdefb' }}>→</span>
            <span style={{ color: '#bbdefb' }}>2 Enter info</span>
            <span style={{ color: '#bbdefb' }}>→</span>
            <span style={{ fontWeight: 700, color: '#fff', background: '#1565c0', borderRadius: 8, padding: '2px 8px' }}>3 Payment</span>
          </div>
        </div>
      </div>
      {/* Main content wrapper */}
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 16px' }}>
        {/* Trip summary */}
        <Card className={styles.summaryCard}>
          <div className={styles.summaryRow}><span>Train:</span> <b>{trainName}</b></div>
          <div className={styles.summaryRow}><span>From:</span> <b>{from}</b></div>
          <div className={styles.summaryRow}><span>To:</span> <b>{to}</b></div>
          <div className={styles.summaryRow}><span>Departure date:</span> <b>{departDate}</b></div>
          {isRoundTrip && returnDate && (
            <div className={styles.summaryRow}><span>Return date:</span> <b>{returnDate}</b></div>
          )}
          <div className={styles.summaryRow}><span>Selected seat(s):</span> <b>{formatSelectedSeats()}</b></div>
          <div className={styles.summaryRow}><span>Ticket(s):</span> <b>{totalPassengers}</b></div>
          <div className={styles.summaryRow}><span>Full name:</span> <b>{passengerName}</b></div>
          <div className={styles.summaryRow}><span>ID/Passport:</span> <b>{passengerCccd}</b></div>
          <div className={styles.summaryRow}><span>Total price:</span> <b className={styles.total}>{totalPrice.toLocaleString()}đ</b></div>
        </Card>

        {/* Payment method */}
        <div className={styles.methodSection}>
          <div className={styles.methodTitle}>Payment Method</div>
          <div className={styles.methodOptions}>
            <label onClick={() => setMethod('card')} style={{ cursor: 'pointer' }}>
              <div style={{ 
                width: 16, 
                height: 16, 
                background: method === 'card' ? '#1976d2' : '#fff', 
                border: '2px solid #1976d2',
                borderRadius: '50%',
                marginRight: 8,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {method === 'card' && (
                  <div style={{ 
                    width: 6, 
                    height: 6, 
                    background: '#fff', 
                    borderRadius: '50%' 
                  }}></div>
                )}
              </div>
              Visa/Mastercard
            </label>
            <label onClick={() => setMethod('momo')} style={{ cursor: 'pointer' }}>
              <div style={{ 
                width: 16, 
                height: 16, 
                background: method === 'momo' ? '#1976d2' : '#fff', 
                border: '2px solid #1976d2',
                borderRadius: '50%',
                marginRight: 8,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {method === 'momo' && (
                  <div style={{ 
                    width: 6, 
                    height: 6, 
                    background: '#fff', 
                    borderRadius: '50%' 
                  }}></div>
                )}
              </div>
              Momo
            </label>
            <label onClick={() => setMethod('zalopay')} style={{ cursor: 'pointer' }}>
              <div style={{ 
                width: 16, 
                height: 16, 
                background: method === 'zalopay' ? '#1976d2' : '#fff', 
                border: '2px solid #1976d2',
                borderRadius: '50%',
                marginRight: 8,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {method === 'zalopay' && (
                  <div style={{ 
                    width: 6, 
                    height: 6, 
                    background: '#fff', 
                    borderRadius: '50%' 
                  }}></div>
                )}
              </div>
              ZaloPay
            </label>
          </div>
        </div>

        {/* Card info */}
        {method === 'card' && (
          <Card className={styles.cardForm}>
            <Input
              type="text"
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
              placeholder="Card Number"
              className={styles.input}
              icon={<span role="img" aria-label="card">💳</span>}
            />
            <Input
              type="text"
              value={cardName}
              onChange={e => setCardName(e.target.value)}
              placeholder="Cardholder Name"
              className={styles.input}
              icon={<span role="img" aria-label="user">👤</span>}
            />
            <div className={styles.row2}>
              <Input
                type="text"
                value={expiry}
                onChange={e => setExpiry(e.target.value)}
                placeholder="MM/YY"
                className={styles.input}
                icon={<span role="img" aria-label="calendar">📅</span>}
              />
              <Input
                type="password"
                value={cvv}
                onChange={e => setCvv(e.target.value)}
                placeholder="CVV"
                className={styles.input}
                icon={<span role="img" aria-label="lock">🔒</span>}
              />
            </div>
          </Card>
        )}

        {method === 'momo' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/img/image.png" alt="Momo QR" style={{ width: 180, height: 180, borderRadius: 16, boxShadow: '0 2px 12px #0001', marginBottom: 8 }} />
            <div style={{ color: '#a50064', fontWeight: 600, fontSize: 16, marginTop: 4, textAlign: 'center' }}>Scan QR code with Momo app to pay</div>
          </div>
        )}
        {method === 'zalopay' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/img/image1.png" alt="ZaloPay QR" style={{ width: 180, height: 180, borderRadius: 16, boxShadow: '0 2px 12px #0001', marginBottom: 8 }} />
            <div style={{ color: '#008fe5', fontWeight: 600, fontSize: 16, marginTop: 4, textAlign: 'center' }}>Scan QR code with ZaloPay app to pay</div>
          </div>
        )}

        {/* Chính sách đổi/hoàn vé */}
        <div className={styles.policySection}>
          <div className={styles.policyIcon}>💡</div>
          <div className={styles.policyText}>
            You can change seat/cancel ticket up to 24 hours before departure – <span className={styles.policyLink}>see policy</span>
          </div>
        </div>

        {/* Hướng dẫn hàng cồng kềnh */}
        <div className={styles.luggageSection}>
          <div className={styles.luggageIcon}>🧳</div>
          <div className={styles.luggageText}>
            If you have bulky luggage, please go to the cargo coach after the train stops
          </div>
        </div>

        {/* Pay button */}
        <Button
          className={styles.payBtn}
          onClick={() => {
            if (countdown <= 0) return;
            if (method === 'card' && !isCardInfoValid) {
              setShowCardError(true);
              setTimeout(() => setShowCardError(false), 2500);
              return;
            }
            // Save ticket info to localStorage
            localStorage.setItem('ticketInfo', JSON.stringify({
              trainName,
              from,
              to,
              departDate,
              returnDate,
              isRoundTrip,
              selectedSeats: formatSelectedSeats(),
              totalPassengers,
              totalPrice
            }));
            navigate('/e-ticket');
          }}
          disabled={countdown <= 0}
        >
          {countdown > 0
            ? `Pay now (${formatTime(countdown)})`
            : 'Reservation expired'}
        </Button>
        {showCardError && (
          <div style={{
            position: 'fixed', top: 24, left: 0, right: 0, zIndex: 2000, display: 'flex', justifyContent: 'center', pointerEvents: 'none'
          }}>
            <div style={{ background: '#fffbe6', color: '#bfa100', border: '1.5px solid #ffe082', borderRadius: 8, padding: '12px 24px', fontWeight: 600, fontSize: 16, boxShadow: '0 4px 16px #0002', pointerEvents: 'auto' }}>
              Please enter all Visa/Mastercard information
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment; 