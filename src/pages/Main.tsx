import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userIcon from '../assets/user.svg';
import adultIcon from '../assets/adult.png';
import childIcon from '../assets/child.png';
import elderlyIcon from '../assets/elderly.png';
import studentIcon from '../assets/student.png';
import unionIcon from '../assets/union member.png';
import logoRailway from '../assets/logo-railway.png';

interface Station {
  name: string;
  fullName: string;
  station: string;
  display: string;
}

type PassengerType = 'adult' | 'child' | 'elderly' | 'student' | 'union';

const Main = () => {
  // Lấy thông tin người dùng từ localStorage
  const userInfo = localStorage.getItem('userInfo');
  const userName = userInfo ? JSON.parse(userInfo).username : 'Khách';

  // State cho search
  const [fromSearch, setFromSearch] = useState('');
  const [toSearch, setToSearch] = useState('');
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [selectedFrom, setSelectedFrom] = useState('');
  const [selectedTo, setSelectedTo] = useState('');

  // State cho date picker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [departDate, setDepartDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // State cho hành lý
  const [showLuggageInfo, setShowLuggageInfo] = useState<string | null>(null);
  const [luggageItems, setLuggageItems] = useState({
    handLuggage: 0,
    bulkyLuggage: 0,
    pets: 0
  });

  // State cho modal hành khách
  const [showPassengerModal, setShowPassengerModal] = useState(false);
  const [passenger, setPassenger] = useState<Record<PassengerType, number>>({
    adult: 0,
    child: 0,
    elderly: 0,
    student: 0,
    union: 0
  });

  // State cho thông báo Report
  const [showReportInfo, setShowReportInfo] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportActive, setReportActive] = useState(true);
  const [reportTimer, setReportTimer] = useState(60); // 1 phút đầu sáng

  // Dữ liệu gợi ý địa điểm với AI mapping
  const stationData: Station[] = [
    { name: 'Hanoi', fullName: 'Hà Nội', station: 'Ga Hà Nội', display: 'Hà Nội' },
    { name: 'Vinh', fullName: 'Vinh', station: 'Ga Vinh', display: 'Vinh' },
    { name: 'Danang', fullName: 'Đà Nẵng', station: 'Ga Đà Nẵng', display: 'Đà Nẵng' },
    { name: 'Nhatrang', fullName: 'Nha Trang', station: 'Ga Nha Trang', display: 'Nha Trang' },
    { name: 'Saigon', fullName: 'Sài Gòn', station: 'Ga Sài Gòn', display: 'Sài Gòn' },
  ];

  // Hàm tìm kiếm thông minh cho nơi xuất phát (loại trừ nơi đến đã chọn)
  const searchStationsFrom = (query: string): Station[] => {
    let filteredStations = stationData;
    
    // Loại trừ nơi đến đã chọn
    if (selectedTo) {
      filteredStations = filteredStations.filter(station => station.station !== selectedTo);
    }
    
    if (!query) return filteredStations;
    
    const lowerQuery = query.toLowerCase();
    return filteredStations.filter(station => 
      station.name.toLowerCase().includes(lowerQuery) ||
      station.fullName.toLowerCase().includes(lowerQuery) ||
      station.station.toLowerCase().includes(lowerQuery) ||
      station.display.toLowerCase().includes(lowerQuery)
    );
  };

  // Hàm tìm kiếm thông minh cho nơi đến (loại trừ nơi xuất phát đã chọn)
  const searchStationsTo = (query: string): Station[] => {
    let filteredStations = stationData;
    
    // Loại trừ nơi xuất phát đã chọn
    if (selectedFrom) {
      filteredStations = filteredStations.filter(station => station.station !== selectedFrom);
    }
    
    if (!query) return filteredStations;
    
    const lowerQuery = query.toLowerCase();
    return filteredStations.filter(station => 
      station.name.toLowerCase().includes(lowerQuery) ||
      station.fullName.toLowerCase().includes(lowerQuery) ||
      station.station.toLowerCase().includes(lowerQuery) ||
      station.display.toLowerCase().includes(lowerQuery)
    );
  };

  // Hàm xử lý chọn địa điểm
  const handleSelectFrom = (station: Station) => {
    setSelectedFrom(station.station);
    setFromSearch(station.display);
    setShowFromSuggestions(false);
    
    // Reset nơi đến nếu trùng với nơi xuất phát mới
    if (selectedTo === station.station) {
      setSelectedTo('');
      setToSearch('');
    }
  };

  const handleSelectTo = (station: Station) => {
    setSelectedTo(station.station);
    setToSearch(station.display);
    setShowToSuggestions(false);
    
    // Reset nơi xuất phát nếu trùng với nơi đến mới
    if (selectedFrom === station.station) {
      setSelectedFrom('');
      setFromSearch('');
    }
  };

  // Hàm format ngày
  const formatDate = (date: Date) => {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const dayName = days[date.getDay()];
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${dayName}, ${day}/${month}/${year}`;
  };

  // Hàm tính số ngày
  const getDaysCount = () => {
    if (departDate && returnDate) {
      const diffTime = returnDate.getTime() - departDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  // Hàm tạo lịch âm (giả lập)
  const getLunarDate = (date: Date) => {
    // Giả lập lịch âm - trong thực tế cần API hoặc thư viện
    const lunarDays = ['Mùng 1', 'Mùng 2', 'Mùng 3', 'Mùng 4', 'Mùng 5', 'Mùng 6', 'Mùng 7', 'Mùng 8', 'Mùng 9', 'Mùng 10',
                      '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
                      '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'];
    return lunarDays[date.getDate() - 1] || '';
  };

  // Hàm tạo calendar
  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const calendar = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      calendar.push(date);
    }
    return calendar;
  };

  // Hàm kiểm tra ngày đã qua
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Hàm kiểm tra ngày hôm nay
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Hàm kiểm tra ngày được chọn
  const isSelectedDate = (date: Date) => {
    if (!departDate) return false;
    return date.toDateString() === departDate.toDateString() || 
           (returnDate && date.toDateString() === returnDate.toDateString());
  };

  // Hàm kiểm tra ngày trong range
  const isInRange = (date: Date) => {
    if (!departDate || !returnDate) return false;
    return date >= departDate && date <= returnDate;
  };

  // Hàm xử lý chọn ngày
  const handleDateSelect = (date: Date) => {
    if (isPastDate(date)) return;

    if (!isRoundTrip) {
      // Nếu không phải khứ hồi, chỉ cho chọn ngày đi
      setDepartDate(date);
      setReturnDate(null);
      return;
    }

    // Nếu là khứ hồi
    if (!departDate || (departDate && returnDate)) {
      setDepartDate(date);
      setReturnDate(null);
    } else {
      if (date > departDate) {
        setReturnDate(date);
      } else {
        setDepartDate(date);
        setReturnDate(null);
      }
    }
  };

  // Cảnh báo trẻ em
  const showChildWarning = passenger.adult === 1 && passenger.child > 3;
  // Gợi ý khoang nhóm
  const totalPeople = passenger.adult + passenger.child + passenger.elderly + passenger.student + passenger.union;
  const showGroupSuggest = totalPeople === 4;
  const showGroupWarning = totalPeople > 4 && totalPeople % 4 !== 0;

  // Tổng số người lớn (bao gồm: adult, elderly, student, union)
  const totalAdult = passenger.adult + passenger.elderly + passenger.student + passenger.union;

  const navigate = useNavigate();
  // Kiểm tra đã có e-ticket chưa
  const hasETicket = (() => {
    try {
      const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
      return Array.isArray(tickets) && tickets.length > 0;
    } catch {
      return false;
    }
  })();

  useEffect(() => {
    if (!hasETicket) return;
    let phase = 'active'; // 'active' (1 phút), 'cooldown' (5 phút)
    let timer = 60;
    setReportActive(true);
    setReportTimer(60);
    const interval = setInterval(() => {
      timer--;
      setReportTimer(timer);
      if (phase === 'active' && timer === 0) {
        phase = 'cooldown';
        timer = 300; // 5 phút
        setReportActive(false);
        setReportTimer(300);
      } else if (phase === 'cooldown' && timer === 0) {
        phase = 'active';
        timer = 60;
        setReportActive(true);
        setReportTimer(60);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [hasETicket]);

  // Kiểm tra điều kiện tìm kiếm
  const canSearch = () => {
    // Kiểm tra nơi xuất phát và nơi đến
    if (!selectedFrom || !selectedTo || selectedFrom === selectedTo) {
      return false;
    }
    // Kiểm tra ngày đi
    if (!departDate) {
      return false;
    }
    // Kiểm tra khứ hồi: nếu bật khứ hồi thì phải có ngày về
    if (isRoundTrip && !returnDate) {
      return false;
    }
    // Kiểm tra hành khách: phải có ít nhất 1 người
    if (totalPeople === 0) {
      return false;
    }
    // Kiểm tra trẻ em phải đi cùng người lớn (tính cả elderly, student, union)
    if (passenger.child > 0 && totalAdult === 0) {
      return false;
    }
    // Phải chọn ít nhất 1 loại hành lý
    if (luggageItems.handLuggage === 0 && luggageItems.bulkyLuggage === 0 && luggageItems.pets === 0) {
      return false;
    }
    return true;
  };

  // Thông báo nếu chỉ còn thiếu hành lý
  const showLuggageWarning =
    // Đã đủ các điều kiện khác, chỉ còn thiếu hành lý
    (!luggageItems.handLuggage && !luggageItems.bulkyLuggage && !luggageItems.pets) &&
    selectedFrom && selectedTo && selectedFrom !== selectedTo &&
    departDate &&
    (!isRoundTrip || (isRoundTrip && returnDate)) &&
    totalPeople > 0 &&
    !(passenger.child > 0 && totalAdult === 0);

  // Lấy thông báo lỗi validation
  const getValidationMessage = () => {
    if (!selectedFrom || !selectedTo) {
      return 'Please select departure and destination';
    }
    if (selectedFrom === selectedTo) {
      return 'Departure and destination cannot be the same';
    }
    if (!departDate) {
      return 'Please select departure date';
    }
    if (isRoundTrip && !returnDate) {
      return 'Please select return date for round trip';
    }
    if (totalPeople === 0) {
      return 'Please select at least one passenger';
    }
    if (passenger.child > 0 && totalAdult === 0) {
      return 'Children must travel with an adult. Please add at least one adult.';
    }
    return '';
  };

  // Khi bấm tìm kiếm
  function handleSearch() {
    if (!canSearch()) {
      // Hiển thị thông báo lỗi
      alert(getValidationMessage());
      return;
    }
    // Cảnh báo nếu chỉ có 1 người lớn (tính cả elderly, student, union) và quá 3 trẻ em
    if (totalAdult === 1 && passenger.child > 3) {
      alert('To ensure safety for children, one adult should only accompany 3 children. Please pay attention to the children and add an adult if possible.');
    }
    // Tạo URL params với thông tin tìm kiếm
    const params = new URLSearchParams({
      from: selectedFrom,
      to: selectedTo,
      departDate: departDate ? formatDate(departDate) : '',
      returnDate: returnDate ? formatDate(returnDate) : '',
      isRoundTrip: isRoundTrip.toString(),
      passenger: JSON.stringify(passenger)
    });
    // Chuyển hướng sang trang SearchResults
    navigate(`/search-results?${params.toString()}`);
  }

  // CustomCheckbox component
  const CustomCheckbox = ({ checked, onChange }: { checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <label style={{ position: 'relative', display: 'inline-block', width: 24, height: 24, marginRight: 8, cursor: 'pointer' }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ opacity: 0, width: 24, height: 24, position: 'absolute', left: 0, top: 0, margin: 0, zIndex: 2, cursor: 'pointer' }}
      />
      <span
        style={{
          display: 'inline-block',
          width: 24,
          height: 24,
          background: '#fff',
          border: '1.5px solid #bdbdbd',
          borderRadius: 6,
          boxSizing: 'border-box',
          position: 'absolute',
          left: 0,
          top: 0,
          zIndex: 1,
        }}
      >
        {checked && (
          <svg width="18" height="18" viewBox="0 0 18 18" style={{ position: 'absolute', top: 2, left: 3 }}>
            <polyline points="2,10 7,15 16,4" style={{ fill: 'none', stroke: '#1976d2', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' }} />
          </svg>
        )}
      </span>
    </label>
  );

  return (
    <>
      <div style={{ background: '#f7f7fa', minHeight: '100vh', width: '100vw', fontFamily: 'Montserrat, Arial, sans-serif' }}>
        {/* Header */}
      <div style={{ width: '100vw', background: '#1976d2', color: '#fff', padding: '14px 0 8px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 56 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 18 }}>
          <img src={logoRailway} alt="logo" style={{ height: 32, marginRight: 10 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: 18, fontWeight: 600, fontSize: 16 }}>
          Hello {userName} <span style={{ fontSize: 18, marginLeft: 4 }}>›</span>
        </div>
        </div>

      {/* Tabs phương tiện */}
      <div style={{ background: '#fff', borderRadius: '0 0 32px 32px', boxShadow: '0 2px 8px #0001', margin: '0 auto', width: '100%', maxWidth: 420, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 12px', position: 'relative', top: 0, zIndex: 2 }}>
        <div style={{ flex: 1, textAlign: 'center', padding: '14px 0 6px 0', color: '#1976d2', fontWeight: 700, fontSize: 15, borderBottom: '3px solid #1976d2', background: 'none', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <span style={{ fontSize: 20, marginRight: 4 }}>🚆</span> Train
          <span style={{ fontSize: 11, background: '#1976d2', color: '#fff', borderRadius: 8, padding: '2px 6px', marginLeft: 4, fontWeight: 700, verticalAlign: 'middle' }}>New</span>
          {hasETicket && (
            <>
              <button
                style={{
                  marginLeft: 12,
                  background: reportActive ? '#e53935' : '#f3f3f3',
                  color: reportActive ? '#fff' : '#bbb',
                  border: 'none',
                  borderRadius: 8,
                  padding: '4px 14px',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: reportActive ? 'pointer' : 'not-allowed',
                  boxShadow: reportActive ? '0 2px 8px #e5393522' : 'none',
                  transition: 'background 0.2s, color 0.2s',
                  opacity: reportActive ? 1 : 0.6
                }}
                onClick={() => reportActive && setShowReportModal(true)}
                disabled={!reportActive}
              >
                Report
                {reportActive ? (
                  <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 400 }}>
                    ({reportTimer}s)
                  </span>
                ) : (
                  <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 400 }}>
                    (wait {reportTimer}s)
                  </span>
                )}
              </button>
              <button
                style={{ marginLeft: 6, background: 'transparent', color: '#1976d2', border: '1.5px solid #90caf9', borderRadius: '50%', width: 28, height: 28, fontWeight: 900, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
                onClick={() => setShowReportInfo(v => !v)}
                title="Report button info"
              >
                ⓘ
              </button>
              {showReportInfo && (
                <div style={{ position: 'absolute', top: 44, right: 0, left: '50%', transform: 'translateX(-50%)', background: '#fffbe6', color: '#222', border: '1.5px solid #ffe082', borderRadius: 10, padding: '12px 18px', fontSize: 14, fontWeight: 500, boxShadow: '0 4px 16px #0002', zIndex: 1000, minWidth: 320, maxWidth: 380 }}>
                  Reports will work normally with internet. If your phone has no internet or the train is in a tunnel, please connect to the train's local wifi for stable reporting.
                  <div style={{ textAlign: 'right', marginTop: 8 }}>
                    <button style={{ background: 'none', border: 'none', color: '#e67c00', fontWeight: 700, fontSize: 15, cursor: 'pointer' }} onClick={() => setShowReportInfo(false)}>Close</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* Card tìm kiếm */}
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 16px #0002', margin: '18px auto 0 auto', width: '100%', maxWidth: 420, padding: '18px 16px 16px 16px', position: 'relative', zIndex: 1 }}>
        {/* Nơi xuất phát */}
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 20, color: '#1976d2', marginRight: 10 }}>📍</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>Departure</div>
                  <input
                    type="text"
                placeholder="Enter city or station name..."
                value={fromSearch}
                onChange={(e) => {
                  setFromSearch(e.target.value);
                  setShowFromSuggestions(true);
                }}
                onFocus={() => setShowFromSuggestions(true)}
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  fontWeight: 700,
                  fontSize: 17,
                  color: '#222',
                  background: 'transparent',
                  padding: '4px 0'
                }}
              />
              <div style={{ fontSize: 13, color: '#888' }}>{selectedFrom}</div>
            </div>
          </div>
          {/* Dropdown gợi ý */}
          {showFromSuggestions && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 30,
              right: 0,
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 4px 16px #0002',
              zIndex: 1000,
              maxHeight: 200,
              overflowY: 'auto'
            }}>
              {searchStationsFrom(fromSearch).map((station, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectFrom(station)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f0f0f0',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f7f7fa'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                >
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#222' }}>{station.display}</div>
                  <div style={{ fontSize: 13, color: '#888' }}>{station.station}</div>
                </div>
              ))}
            </div>
          )}
              </div>

        {/* Nơi đến */}
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 20, color: '#1976d2', marginRight: 10 }}>📍</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>Destination</div>
                  <input
                    type="text"
                placeholder="Enter city or station name..."
                value={toSearch}
                onChange={(e) => {
                  setToSearch(e.target.value);
                  setShowToSuggestions(true);
                }}
                onFocus={() => setShowToSuggestions(true)}
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  fontWeight: 700,
                  fontSize: 17,
                  color: '#e53935',
                  background: 'transparent',
                  padding: '4px 0'
                }}
              />
              <div style={{ fontSize: 13, color: '#888' }}>{selectedTo}</div>
            </div>
          </div>
          {/* Dropdown gợi ý */}
          {showToSuggestions && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 30,
              right: 0,
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 4px 16px #0002',
              zIndex: 1000,
              maxHeight: 200,
              overflowY: 'auto'
            }}>
              {searchStationsTo(toSearch).map((station, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectTo(station)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f0f0f0',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f7f7fa'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                >
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#222' }}>{station.display}</div>
                  <div style={{ fontSize: 13, color: '#888' }}>{station.station}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ngày đi + khứ hồi */}
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 20, color: '#1976d2', marginRight: 10 }}>📅</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>Departure date</div>
              <div 
                style={{ 
                  fontWeight: 700, 
                  fontSize: 17, 
                  color: departDate ? '#222' : '#ccc',
                  cursor: 'pointer',
                  padding: '4px 0'
                }}
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                {departDate ? formatDate(departDate) : 'Select departure date'}
              </div>
              {returnDate && (
                <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
                  Return: {formatDate(returnDate)} ({getDaysCount()} days)
                </div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 90, justifyContent: 'flex-end' }}>
              <span style={{ fontSize: 15, color: '#222', fontWeight: 600, marginRight: 6 }}>Round trip</span>
              <label style={{ position: 'relative', display: 'inline-block', width: 40, height: 22, verticalAlign: 'middle' }}>
                <input type="checkbox" checked={isRoundTrip} onChange={e => setIsRoundTrip(e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: isRoundTrip ? '#1976d2' : '#e0e0e0',
                  borderRadius: 22,
                  transition: 'background 0.2s',
                  display: 'block'
                }}></span>
                <span style={{
                  position: 'absolute',
                  left: isRoundTrip ? 20 : 2,
                  top: 2,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: '#fff',
                  boxShadow: '0 1px 4px #0002',
                  transition: 'left 0.2s',
                  display: 'block'
                }}></span>
              </label>
            </div>
          </div>

          {/* Date Picker Modal */}
          {showDatePicker && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 8px 32px #0003',
              zIndex: 1000,
              padding: '16px',
              marginTop: 8
            }}>
              {/* Header Calendar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <button 
                  onClick={() => {
                    const prevMonth = new Date(currentMonth);
                    prevMonth.setMonth(prevMonth.getMonth() - 1);
                    setCurrentMonth(prevMonth);
                  }}
                  style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#1976d2' }}
                >
                  ‹
                </button>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#222' }}>
                  {currentMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
                </div>
                      <button
                  onClick={() => {
                    const nextMonth = new Date(currentMonth);
                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                    setCurrentMonth(nextMonth);
                  }}
                  style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#1976d2' }}
                >
                  ›
                      </button>
                    </div>

              {/* Days of week */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} style={{ textAlign: 'center', fontSize: 12, color: '#888', fontWeight: 600, padding: '8px 0' }}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                {generateCalendar().map((date, index) => {
                  const isPast = isPastDate(date);
                  const isTodayDate = isToday(date);
                  const isSelected = isSelectedDate(date);
                  const inRange = isInRange(date);
                  const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                  
                  return (
                    <div
                      key={index}
                      onClick={() => handleDateSelect(date)}
                      style={{
                        aspectRatio: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: isPast ? 'not-allowed' : 'pointer',
                        borderRadius: 8,
                        background: isSelected ? '#1976d2' : inRange ? '#e3f2fd' : 'transparent',
                        color: isPast ? '#ccc' : isSelected ? '#fff' : isTodayDate ? '#1976d2' : isCurrentMonth ? '#222' : '#ccc',
                        fontWeight: isTodayDate || isSelected ? 700 : 400,
                        fontSize: 14,
                        border: isTodayDate ? '2px solid #1976d2' : 'none',
                        position: 'relative'
                      }}
                    >
                      <div>{date.getDate()}</div>
                      {isCurrentMonth && (
                        <div style={{ fontSize: 10, color: isSelected ? '#fff' : '#888', marginTop: 2 }}>
                          {getLunarDate(date)}
                        </div>
                      )}
                    </div>
                  );
                })}
                </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                <button
                  onClick={() => setShowDatePicker(false)}
                  style={{
                    background: '#f5f5f5',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#666',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowDatePicker(false)}
                  style={{
                    background: '#1976d2',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Hành khách */}
        <div style={{ background: '#f7f7fa', borderRadius: 12, padding: '12px', marginBottom: 10, cursor: 'pointer' }} onClick={() => setShowPassengerModal(true)}>
          <div style={{ fontSize: 13, color: '#888', fontWeight: 500, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <img src={userIcon} alt="user" style={{ width: 20, height: 20, marginRight: 4 }} />
            Passengers
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            {/* Người lớn */}
            <div style={{ background: '#fff', borderRadius: 8, padding: '4px 8px', minWidth: 44, display: 'flex', alignItems: 'center', gap: 6 }}>
              <img src={adultIcon} alt="adult" style={{ width: 28, height: 28 }} />
              <span style={{ fontWeight: 700, fontSize: 17, color: '#222' }}>{passenger.adult}</span>
            </div>
            {/* Trẻ em */}
            <div style={{ background: '#fff', borderRadius: 8, padding: '4px 8px', minWidth: 44, display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}>
              <span style={{ position: 'absolute', top: -12, left: 28, background: '#ffd600', color: '#a67c00', fontWeight: 700, fontSize: 12, borderRadius: 6, padding: '0 6px', lineHeight: '18px', zIndex: 2 }}>-25%</span>
              <img src={childIcon} alt="child" style={{ width: 28, height: 28 }} />
              <span style={{ fontWeight: 700, fontSize: 17, color: '#222' }}>{passenger.child}</span>
            </div>
            {/* Người già */}
            <div style={{ background: '#fff', borderRadius: 8, padding: '4px 8px', minWidth: 44, display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}>
              <span style={{ position: 'absolute', top: -12, left: 28, background: '#ffd600', color: '#a67c00', fontWeight: 700, fontSize: 12, borderRadius: 6, padding: '0 6px', lineHeight: '18px', zIndex: 2 }}>-15%</span>
              <img src={elderlyIcon} alt="elderly" style={{ width: 28, height: 28 }} />
              <span style={{ fontWeight: 700, fontSize: 17, color: '#222' }}>{passenger.elderly}</span>
            </div>
            {/* Sinh viên */}
            <div style={{ background: '#fff', borderRadius: 8, padding: '4px 8px', minWidth: 44, display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}>
              <span style={{ position: 'absolute', top: -12, left: 28, background: '#ffd600', color: '#a67c00', fontWeight: 700, fontSize: 12, borderRadius: 6, padding: '0 6px', lineHeight: '18px', zIndex: 2 }}>-10%</span>
              <img src={studentIcon} alt="student" style={{ width: 28, height: 28 }} />
              <span style={{ fontWeight: 700, fontSize: 17, color: '#222' }}>{passenger.student}</span>
            </div>
            {/* Công đoàn */}
            <div style={{ background: '#fff', borderRadius: 8, padding: '4px 8px', minWidth: 44, display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}>
              <span style={{ position: 'absolute', top: -12, left: 28, background: '#ffd600', color: '#a67c00', fontWeight: 700, fontSize: 12, borderRadius: 6, padding: '0 6px', lineHeight: '18px', zIndex: 2 }}>-5%</span>
              <img src={unionIcon} alt="union" style={{ width: 28, height: 28 }} />
              <span style={{ fontWeight: 700, fontSize: 17, color: '#222' }}>{passenger.union}</span>
            </div>
          </div>
        </div>

        {/* Hành lý */}
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '12px', marginBottom: 10, border: '1px solid #e0e0e0' }}>
          <div style={{ fontSize: 13, color: '#888', fontWeight: 500, marginBottom: 8 }}>Luggage declaration</div>
          {/* Hành lý xách tay */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 120 }}>
              <span style={{ fontSize: 18, color: '#6d4c41' }}>💼</span>
              <span style={{ fontSize: 15, color: '#222', fontWeight: 500 }}>Hand luggage</span>
              <span 
                style={{ fontSize: 13, color: '#bbb', cursor: 'pointer', marginLeft: 2 }}
                onClick={() => setShowLuggageInfo(showLuggageInfo === 'hand' ? null : 'hand')}
              >
                !
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CustomCheckbox checked={luggageItems.handLuggage > 0} onChange={e => setLuggageItems(prev => ({ ...prev, handLuggage: e.target.checked ? 1 : 0 }))} />
              <button 
                onClick={() => setLuggageItems(prev => ({ ...prev, handLuggage: Math.max(0, prev.handLuggage - 1) }))}
                style={{ width: 28, height: 28, borderRadius: 14, border: '1px solid #e0e0e0', background: '#ffffff', fontSize: 18, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, color: '#333' }}
              >
                -
              </button>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#222', minWidth: 20, textAlign: 'center' }}>
                {luggageItems.handLuggage}
              </span>
              <button 
                onClick={() => setLuggageItems(prev => ({ ...prev, handLuggage: prev.handLuggage + 1 }))}
                style={{ width: 28, height: 28, borderRadius: 14, border: '1px solid #e0e0e0', background: '#ffffff', fontSize: 18, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, color: '#333' }}
              >
                +
              </button>
            </div>
          </div>
          {/* Hành lý cồng kềnh */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 120 }}>
              <span style={{ fontSize: 18, color: '#8d6e63' }}>📦</span>
              <span style={{ fontSize: 15, color: '#222', fontWeight: 500 }}>Bulky luggage</span>
              <span 
                style={{ fontSize: 13, color: '#bbb', cursor: 'pointer', marginLeft: 2 }}
                onClick={() => setShowLuggageInfo(showLuggageInfo === 'bulky' ? null : 'bulky')}
              >
                !
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CustomCheckbox checked={luggageItems.bulkyLuggage > 0} onChange={e => setLuggageItems(prev => ({ ...prev, bulkyLuggage: e.target.checked ? 1 : 0 }))} />
              <button 
                onClick={() => setLuggageItems(prev => ({ ...prev, bulkyLuggage: Math.max(0, prev.bulkyLuggage - 1) }))}
                style={{ width: 28, height: 28, borderRadius: 14, border: '1px solid #e0e0e0', background: '#ffffff', fontSize: 18, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, color: '#333' }}
              >
                -
              </button>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#222', minWidth: 20, textAlign: 'center' }}>
                {luggageItems.bulkyLuggage}
              </span>
              <button 
                onClick={() => setLuggageItems(prev => ({ ...prev, bulkyLuggage: prev.bulkyLuggage + 1 }))}
                style={{ width: 28, height: 28, borderRadius: 14, border: '1px solid #e0e0e0', background: '#ffffff', fontSize: 18, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, color: '#333' }}
              >
                +
              </button>
        </div>
      </div>
          {/* Thú cưng */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 120 }}>
              <span style={{ fontSize: 18, color: '#bc8f6f' }}>🐕</span>
              <span style={{ fontSize: 15, color: '#222', fontWeight: 500 }}>Pet</span>
              <span 
                style={{ fontSize: 13, color: '#bbb', cursor: 'pointer', marginLeft: 2 }}
                onClick={() => setShowLuggageInfo(showLuggageInfo === 'pets' ? null : 'pets')}
              >
                !
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CustomCheckbox checked={luggageItems.pets > 0} onChange={e => setLuggageItems(prev => ({ ...prev, pets: e.target.checked ? 1 : 0 }))} />
              <button 
                onClick={() => setLuggageItems(prev => ({ ...prev, pets: Math.max(0, prev.pets - 1) }))}
                style={{ width: 28, height: 28, borderRadius: 14, border: '1px solid #e0e0e0', background: '#ffffff', fontSize: 18, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, color: '#333' }}
              >
                -
              </button>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#222', minWidth: 20, textAlign: 'center' }}>
                {luggageItems.pets}
              </span>
              <button 
                onClick={() => setLuggageItems(prev => ({ ...prev, pets: prev.pets + 1 }))}
                style={{ width: 28, height: 28, borderRadius: 14, border: '1px solid #e0e0e0', background: '#ffffff', fontSize: 18, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, color: '#333' }}
              >
                +
              </button>
            </div>
          </div>
          {/* Thông tin chi tiết hành lý */}
          {showLuggageInfo && (
            <div style={{
              background: '#fff',
              borderRadius: 8,
              padding: '12px',
              marginTop: 8,
              border: '1px solid #e0e0e0',
              fontSize: 13,
              color: '#666',
              lineHeight: 1.4
            }}>
              {showLuggageInfo === 'hand' && (
                <div>
                  <div style={{ fontWeight: 600, color: '#222', marginBottom: 4 }}>Hand luggage:</div>
                  <div>Hand luggage must be under 56x36x23cm and 7kg. Click here to see where you can store your hand luggage in the cabin/seat.</div>
                  <button 
                    onClick={() => navigate('/faq/luggage')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#1976d2',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      fontSize: 13,
                      marginTop: 4
                    }}
                  >
                    See details →
                  </button>
                </div>
              )}
              {showLuggageInfo === 'bulky' && (
                <div>
                  <div style={{ fontWeight: 600, color: '#222', marginBottom: 4 }}>Bulky luggage:</div>
                  <div>Any luggage exceeding hand luggage limits or not classified as hand luggage is considered bulky.</div>
                  <button
                    onClick={() => navigate('/faq/luggage')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#1976d2',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      fontSize: 13,
                      marginTop: 4
                    }}
                  >
                    See details →
                  </button>
                </div>
              )}
              {showLuggageInfo === 'pets' && (
                <div>
                  <div style={{ fontWeight: 600, color: '#222', marginBottom: 4 }}>Pet ⚠️</div>
                  <div>Pets must have vaccination papers, weigh under 10kg, and be kept in a cage. Some pets may be prohibited.</div>
                  <button
                    onClick={() => navigate('/faq/pets')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#1976d2',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      fontSize: 13,
                      marginTop: 4
                    }}
                  >
                    See details →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Nút tìm kiếm */}
        <button
          onClick={handleSearch}
          disabled={!canSearch()}
          style={{
            width: '100%',
            background: canSearch() ? '#1976d2' : '#e0e0e0',
            color: canSearch() ? '#fff' : '#888',
            border: 'none',
            borderRadius: 8,
            padding: '14px 0',
            fontWeight: 700,
            fontSize: 17,
            marginTop: 18,
            cursor: canSearch() ? 'pointer' : 'not-allowed',
            transition: 'background 0.2s, color 0.2s'
          }}
        >
          Search
        </button>
        {showLuggageWarning && (
          <div style={{ background: '#fff7e6', color: '#e67c00', fontWeight: 500, marginTop: 10, fontSize: 15, borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            Please select at least one type of luggage to continue.
          </div>
        )}
        
        {/* Hiển thị thông báo lỗi nếu có */}
        {!canSearch() && getValidationMessage() && (
          <div style={{ 
            background: '#fff3e0', 
            color: '#e65100', 
            borderRadius: 8, 
            padding: 10, 
            marginTop: 8, 
            fontSize: 14, 
            fontWeight: 500, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8 
          }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            {getValidationMessage()}
          </div>
        )}
      </div>
      

      
      {/* Bottom bar giữ nguyên */}
      <div style={{ position: 'fixed', left: 0, bottom: 0, width: '100%', background: '#fff', borderTop: '1.5px solid #e0e0e0', display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: 62, zIndex: 10 }}>
        <div style={{ flex: 1, textAlign: 'center', color: window.location.pathname === '/main' ? '#1976d2' : '#888', fontWeight: window.location.pathname === '/main' ? 700 : 400, cursor: 'pointer' }} onClick={() => window.location.pathname !== '/main' && window.location.assign('/main')}><div style={{ fontSize: 22 }}>🔍</div><div style={{ fontSize: 13 }}>Search</div></div>
        <div style={{ flex: 1, textAlign: 'center', color: window.location.pathname === '/tickets' ? '#1976d2' : '#888', fontWeight: window.location.pathname === '/tickets' ? 700 : 400, cursor: 'pointer' }} onClick={() => window.location.pathname !== '/tickets' && window.location.assign('/tickets')}><div style={{ fontSize: 22 }}>📅</div><div style={{ fontSize: 13 }}>My tickets</div></div>
        <div style={{ flex: 1, textAlign: 'center', color: window.location.pathname === '/notifications' ? '#1976d2' : '#888', fontWeight: window.location.pathname === '/notifications' ? 700 : 400, cursor: 'pointer' }} onClick={() => window.location.pathname !== '/notifications' && window.location.assign('/notifications')}><div style={{ fontSize: 22 }}>🔔</div><div style={{ fontSize: 13 }}>Notifications</div></div>
        <div style={{ flex: 1, textAlign: 'center', color: window.location.pathname === '/account' ? '#1976d2' : '#888', fontWeight: window.location.pathname === '/account' ? 700 : 400, cursor: 'pointer' }} onClick={() => window.location.pathname !== '/account' && window.location.assign('/account')}><div style={{ fontSize: 22 }}>👤</div><div style={{ fontSize: 13 }}>Account</div></div>
          </div>
    </div>

      {/* Modal chọn hành khách */}
      {showPassengerModal && (
        <div style={{
          position: 'fixed', left: 0, right: 0, bottom: 0, top: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', transition: 'all 0.3s'
        }}>
          <div style={{ background: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 20, minHeight: 420, maxWidth: 480, margin: '0 auto', width: '100%', boxShadow: '0 -2px 16px #0002', animation: 'slideUp .3s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontWeight: 700, fontSize: 18 }}>Passengers</span>
              <span style={{ color: '#1976d2', fontWeight: 600, fontSize: 16, cursor: 'pointer' }} onClick={() => setShowPassengerModal(false)}>Close</span>
            </div>
            <div style={{ background: '#f7f7fa', borderRadius: 8, padding: 12, marginBottom: 14, fontSize: 14, color: '#1976d2', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>ℹ️</span>
              Each adult can accompany a maximum of 1 child under 6 years old (free ticket). Children from the second onwards must purchase an additional child ticket.
            </div>
            {/* Danh sách loại hành khách */}
            {[
              { key: 'adult', label: 'Adult', desc: 'Traveling from departure date, aged 10-59', color: '#222', badge: '', icon: adultIcon },
              { key: 'child', label: 'Child', desc: 'Traveling from departure date, aged 0-10, applies to Vietnamese citizens', color: '#388e3c', badge: 'DISCOUNT 25%', icon: childIcon },
              { key: 'elderly', label: 'Elderly', desc: 'Traveling from departure date, aged 60 and above, applies to Vietnamese citizens', color: '#1976d2', badge: 'DISCOUNT 15%', icon: elderlyIcon },
              { key: 'student', label: 'Student', desc: 'Applies to Vietnamese citizens with a Student ID when traveling by train', color: '#0288d1', badge: 'DISCOUNT 10%', icon: studentIcon },
              { key: 'union', label: 'Union Member', desc: 'Applies to Vietnamese citizens with a valid Union ID when traveling by train', color: '#fbc02d', badge: 'DISCOUNT 5%', icon: unionIcon },
            ].map((item) => (
              <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderRadius: 8, padding: '10px 0 10px 0', marginBottom: 8, boxShadow: '0 1px 4px #0001' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={item.icon} alt={item.label} style={{ width: 32, height: 32 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: item.color, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {item.label}
                      {item.badge && <span style={{ background: '#e3f2fd', color: '#388e3c', fontWeight: 700, fontSize: 12, borderRadius: 6, padding: '2px 8px', marginLeft: 4 }}>{item.badge}</span>}
                    </div>
                    <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>{item.desc}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={() => setPassenger(p => ({ ...p, [item.key as PassengerType]: Math.max(0, p[item.key as PassengerType] - 1) }))} style={{ width: 32, height: 32, borderRadius: 16, border: '1px solid #ddd', background: '#fff', fontSize: 20, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>-</button>
                  <span style={{ fontWeight: 700, fontSize: 18, color: '#222', minWidth: 20, textAlign: 'center' }}>{passenger[item.key as PassengerType]}</span>
                  <button onClick={() => setPassenger(p => ({ ...p, [item.key as PassengerType]: p[item.key as PassengerType] + 1 }))} style={{ width: 32, height: 32, borderRadius: 16, border: '1px solid #ddd', background: '#fff', fontSize: 20, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>+</button>
                </div>
              </div>
            ))}
            {/* Cảnh báo trẻ em */}
            {showChildWarning && (
              <div style={{ background: '#fff3e0', color: '#e65100', borderRadius: 8, padding: 10, margin: '8px 0', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>⚠️</span>
                To ensure safety for children, one adult should only accompany 3 children. Please pay attention to the children and add an adult if possible.
              </div>
            )}
            {/* Gợi ý khoang nhóm */}
            {showGroupSuggest && (
              <div style={{ background: '#e3f2fd', color: '#1976d2', borderRadius: 8, padding: 10, margin: '8px 0', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>💡</span>
                Suggestion: Find 4 consecutive beds or seats that are empty.
              </div>
            )}
            {/* Cảnh báo chia phòng */}
            {showGroupWarning && (
              <div style={{ background: '#fff3e0', color: '#e65100', borderRadius: 8, padding: 10, margin: '8px 0', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>⚠️</span>
                No more 4-bed empty compartments for the group. Would you like to split into 2 adjacent rooms?
              </div>
            )}
            <button onClick={() => setShowPassengerModal(false)} style={{ width: '100%', background: '#1976d2', color: '#fff', fontWeight: 700, fontSize: 18, borderRadius: 12, padding: '14px 0', border: 'none', marginTop: 18, boxShadow: '0 2px 8px #1976d255', cursor: 'pointer' }}>Confirm</button>
          </div>
        </div>
      )}

      {/* Modal báo cáo */}
      {showReportModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(255,255,255,0.95)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 320, maxWidth: 400, boxShadow: '0 4px 24px #0003', position: 'relative' }}>
            <div style={{ fontWeight: 700, fontSize: 20, color: '#e53935', marginBottom: 18 }}>Report passenger noise</div>
            <div style={{ fontSize: 15, color: '#222', marginBottom: 18 }}>If there is passenger noise, bothering you, please report it to the train staff for handling.</div>
            <textarea placeholder="Describe the incident, location, seat number, carriage..." style={{ width: '100%', minHeight: 80, borderRadius: 8, border: '1.5px solid #bbb', padding: 10, fontSize: 15, marginBottom: 18 }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setShowReportModal(false)} style={{ background: '#eee', color: '#222', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Close</button>
              <button onClick={() => { setShowReportModal(false); alert('Your report has been sent to the train staff!'); }} style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Send report</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Main; 