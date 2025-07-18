import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import { TRAINS, searchTrains, getTrainById, type Train } from '../mockData';
import styles from './SelectTrain.module.css';

const SelectTrain = () => {
  const [selectedType, setSelectedType] = useState('all');
  const [availableTrains, setAvailableTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy thông tin từ URL search params
  const searchParams = new URLSearchParams(location.search);
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';
  const passengers = searchParams.get('passengers') || '[]';

  const parsedPassengers = JSON.parse(decodeURIComponent(passengers));
  const totalPassengers = Object.values(parsedPassengers).reduce((sum: number, count) => sum + (count as number), 0);

  useEffect(() => {
    // Tìm kiếm tàu dựa trên route
    const trains = searchTrains(from, to);
    setAvailableTrains(trains);
    setLoading(false);
  }, [from, to]);

  const formatDuration = (duration: string): string => {
    // Convert duration like "32h30m" to "1 ngày 8h 30p"
    const hours = parseInt(duration.match(/(\d+)h/)?.[1] || '0');
    const minutes = parseInt(duration.match(/(\d+)m/)?.[1] || '0');
    
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    if (days > 0) {
      return `${days} ngày ${remainingHours}h ${minutes}p`;
    }
    return `${remainingHours}h ${minutes}p`;
  };

  const calculatePrice = (train: Train, coachType: string): string => {
    const coach = train.coaches.find(c => c.type.toLowerCase().replace(/[-\s]/g, '_') === coachType);
    const price = coach?.basePrice || 500000;
    const finalPrice = price * totalPassengers;
    
    return finalPrice.toLocaleString('vi-VN') + 'đ';
  };

  const getCoachDisplayName = (coachType: string): string => {
    switch (coachType) {
      case 'soft_seat': return 'Ngồi mềm';
      case '6_berth_cabin': return 'Nằm khoang 6';
      case '4_berth_cabin': return 'Nằm khoang 4';
      default: return coachType;
    }
  };

  const getRouteDisplay = (route: { from: string; to: string }) => {
    return `${route.from} → ${route.to}`;
  };

  const handleSelectTrain = (trainId: string, coachType: string) => {
    const selectedTrain = getTrainById(trainId);
    if (!selectedTrain) return;

    const params = new URLSearchParams({
      from,
      to,
      date,
      passengers,
      trainId,
      coachType
    });

    navigate(`/select-seat?${params.toString()}`);
  };

  if (loading) {
    return <div className={styles.container}>Đang tìm kiếm tàu...</div>;
  }

  return (
    <div className={styles.container}>
      {/* Top info */}
      <div className={styles.topInfo}>
        <div className={styles.route}>
          <span>{from}</span>
          <span className={styles.arrow}>→</span>
          <span>{to}</span>
        </div>
        <div className={styles.date}>{new Date(date).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
        <div className={styles.passenger}>{totalPassengers} Hành khách</div>
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
          {availableTrains.length === 0 ? (
            <div className={styles.noResults}>Không tìm thấy chuyến tàu phù hợp</div>
          ) : (
            availableTrains.map((train, idx) => (
              train.coaches.map((coach, coachIdx) => (
                <Card className={styles.ticketCard} key={`${train.id}-${coach.id}`}>
                  {idx === 0 && coachIdx === 0 && <div className={styles.bestLabel}>Chọn vé đi {to} tốt nhất</div>}
                  <div className={styles.ticketRow}>
                    <div className={styles.timeCol}>
                      <div className={styles.depart}>{train.schedule.departureTime}</div>
                      <div className={styles.from}>{train.route.from}</div>
                    </div>
                    <div className={styles.arrowCol}>
                      <span className={styles.arrowBig}>→</span>
                      <div className={styles.duration}>{formatDuration(train.schedule.duration)}</div>
                    </div>
                    <div className={styles.timeCol}>
                      <div className={styles.arrive}>{train.schedule.arrivalTime}</div>
                      <div className={styles.to}>{train.route.to}</div>
                    </div>
                    <div className={styles.infoCol}>
                      <div className={styles.train}>Tàu {train.id}</div>
                      <div className={styles.seat}>{coach.type}</div>
                    </div>
                    <div className={styles.priceCol}>
                      <div className={styles.price}>{calculatePrice(train, coach.type.toLowerCase().replace(/[-\s]/g, '_'))}</div>
                      <Button 
                        className={styles.bookBtn}
                        onClick={() => handleSelectTrain(train.id, coach.type.toLowerCase().replace(/[-\s]/g, '_'))}
                      >
                        Đặt vé
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectTrain; 