import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import styles from './TripDetails.module.css';

const TripDetails = () => {
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState('2023-09-10 to 2023-09-19');
  const [guests, setGuests] = useState(4);
  const [roomType, setRoomType] = useState(['shared']);
  const [sortBy, setSortBy] = useState('relevance');
  const [rating, setRating] = useState('any');
  const [price, setPrice] = useState([0, 1250]);
  const [freeCancel, setFreeCancel] = useState(true);

  const handleRoomType = (type: string) => {
    setRoomType(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.headerRow}>
          <h2 className={styles.title}>Trip details</h2>
          <label className={styles.cancelBox}>
            <input type="checkbox" checked={freeCancel} onChange={() => setFreeCancel(f => !f)} />
            <span>Free cancellation</span>
          </label>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Where to go</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Destination"
              value={destination}
              onChange={e => setDestination(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Dates</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Dates"
              value={dates}
              onChange={e => setDates(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Guests</label>
            <input
              className={styles.input}
              type="number"
              min={1}
              value={guests}
              onChange={e => setGuests(Number(e.target.value))}
            />
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Room type</label>
            <div className={styles.checkboxRow}>
              <label><input type="checkbox" checked={roomType.includes('entire')} onChange={() => handleRoomType('entire')} /> Entire home</label>
              <label><input type="checkbox" checked={roomType.includes('private')} onChange={() => handleRoomType('private')} /> Private room</label>
              <label><input type="checkbox" checked={roomType.includes('shared')} onChange={() => handleRoomType('shared')} /> Shared room</label>
            </div>
          </div>
        </div>
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <label className={styles.label}>Sort by</label>
            <div className={styles.sortRow}>
              <button className={sortBy === 'relevance' ? styles.active : ''} onClick={() => setSortBy('relevance')}>Relevance</button>
              <button className={sortBy === 'distance' ? styles.active : ''} onClick={() => setSortBy('distance')}>Distance</button>
              <button className={sortBy === 'rating' ? styles.active : ''} onClick={() => setSortBy('rating')}>Rating</button>
              <button className={sortBy === 'match' ? styles.active : ''} onClick={() => setSortBy('match')}>Your match</button>
            </div>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.label}>Rating</label>
            <div className={styles.ratingRow}>
              <button className={rating === 'any' ? styles.active : ''} onClick={() => setRating('any')}>Any</button>
              <button className={rating === '3' ? styles.active : ''} onClick={() => setRating('3')}>3.0 ★</button>
              <button className={rating === '3.5' ? styles.active : ''} onClick={() => setRating('3.5')}>3.5 ★</button>
              <button className={rating === '4' ? styles.active : ''} onClick={() => setRating('4')}>4.0 ★</button>
              <button className={rating === '4.5' ? styles.active : ''} onClick={() => setRating('4.5')}>4.5 ★</button>
            </div>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.label}>Price range</label>
            <div className={styles.priceRow}>
              <input
                type="range"
                min={0}
                max={1250}
                value={price[0]}
                onChange={e => setPrice([Number(e.target.value), price[1]])}
                className={styles.slider}
              />
              <input
                type="range"
                min={0}
                max={1250}
                value={price[1]}
                onChange={e => setPrice([price[0], Number(e.target.value)])}
                className={styles.slider}
              />
              <span className={styles.priceValue}>${price[0]}</span>
              <span className={styles.priceValue}>${price[1]}+</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TripDetails; 