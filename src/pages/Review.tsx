import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const Review = () => {
  const [tab, setTab] = useState<'pending' | 'done'>('pending');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [points, setPoints] = useState(0);
  const navigate = useNavigate();

  // Mock data cho chuyến đi cần review
  const pendingTrip = {
    id: 'trip-001',
    from: 'Hà Nội',
    to: 'TP.HCM',
    date: '15/12/2024',
    train: 'SE1',
    seats: ['A12-1', 'A13-1']
  };

  const handleSubmitReview = () => {
    // Tính điểm dựa trên rating
    const earnedPoints = rating * 10;
    setPoints(earnedPoints);
    setShowReward(true);
    setShowReviewForm(false);
    
    // Simulate API call
    setTimeout(() => {
      setTab('done');
    }, 2000);
  };

  return (
    <div style={{ background: '#f7f7fa', minHeight: '100vh', width: '100vw', fontFamily: 'Montserrat, Arial, sans-serif', fontSize: 15 }}>
      {/* Header */}
      <div style={{ background: '#1976d2', color: '#fff', padding: '16px 0 12px 0', textAlign: 'left', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, fontWeight: 700, marginLeft: 12, cursor: 'pointer' }}>&#8592;</button>
        <div style={{ fontWeight: 700, fontSize: 18, flex: 1, textAlign: 'left', marginLeft: 8 }}>Trip Reviews</div>
      </div>
      {/* Tabs */}
      <div style={{ display: 'flex', background: '#fff', borderBottom: '1.5px solid #e0e0e0', marginTop: 2 }}>
        <div
          onClick={() => setTab('pending')}
          style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 17, padding: '12px 0 8px 0', color: tab === 'pending' ? '#222' : '#888', borderBottom: tab === 'pending' ? '2.5px solid #1976d2' : '2.5px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          Pending
        </div>
        <div
          onClick={() => setTab('done')}
          style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 17, padding: '12px 0 8px 0', color: tab === 'done' ? '#222' : '#888', borderBottom: tab === 'done' ? '2.5px solid #1976d2' : '2.5px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          Reviewed
        </div>
      </div>
      {/* Content based on tab */}
      {tab === 'pending' ? (
        <div style={{ padding: '20px' }}>
          {/* Trip card */}
          <div style={{ 
            background: '#fff', 
            borderRadius: 12, 
            padding: 16, 
            marginBottom: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#222' }}>
                  {pendingTrip.from} → {pendingTrip.to}
                </div>
                <div style={{ fontSize: 14, color: '#666' }}>
                  {pendingTrip.date} • Train {pendingTrip.train}
                </div>
                <div style={{ fontSize: 13, color: '#888' }}>
                  Seat(s): {pendingTrip.seats.join(', ')}
                </div>
              </div>
              <button
                onClick={() => setShowReviewForm(true)}
                style={{
                  background: '#1976d2',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 16px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Review now
              </button>
            </div>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div style={{ 
              background: '#fff', 
              borderRadius: 12, 
              padding: 20,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ margin: '0 0 16px 0', color: '#222' }}>Trip Review</h3>
              
              {/* Rating */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 8, fontWeight: 600 }}>Overall rating:</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 24,
                        color: star <= rating ? '#ffc107' : '#ddd'
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ marginBottom: 8, fontWeight: 600 }}>Comment:</div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience about the trip..."
                  style={{
                    width: '100%',
                    minHeight: 80,
                    padding: 12,
                    border: '1px solid #ddd',
                    borderRadius: 8,
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmitReview}
                disabled={rating === 0}
                style={{
                  background: rating === 0 ? '#ccc' : '#1976d2',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 24px',
                  fontWeight: 600,
                  cursor: rating === 0 ? 'not-allowed' : 'pointer',
                  width: '100%'
                }}
              >
                Submit review
              </button>
            </div>
          )}

          {/* Reward Modal */}
          {showReward && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: '#fff',
                borderRadius: 16,
                padding: 24,
                textAlign: 'center',
                maxWidth: 320,
                width: '90%'
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                <h3 style={{ margin: '0 0 8px 0', color: '#222' }}>Thank you!</h3>
                <p style={{ margin: '0 0 16px 0', color: '#666' }}>
                  You have received <strong>{points} points</strong> for this review.
                </p>
                <p style={{ margin: '0 0 20px 0', fontSize: 14, color: '#888' }}>
                  Points can be used to redeem discount codes for your next trip.
                </p>
                <button
                  onClick={() => setShowReward(false)}
                  style={{
                    background: '#1976d2',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '12px 24px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 90 }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ background: '#4caf50', borderRadius: 16, width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={48} color="#fff" />
            </div>
          </div>
          <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8, color: '#222', textAlign: 'center' }}>
            You have completed your review
          </div>
          <div style={{ fontSize: 16, color: '#666', textAlign: 'center', maxWidth: 320 }}>
            Thank you for sharing your experience! Reward points have been added to your account.
          </div>
        </div>
      )}
    </div>
  );
};

export default Review; 