import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import PriceFilter from '../../../shared/components/PriceFilter';
// Local interface for this component (to maintain compatibility with existing logic)
interface LocalSeat {
  id: string;
  row: string;
  column: number;
  floor: 1 | 2 | 3;
  price: number;
  status: 'available' | 'occupied' | 'reserved' | 'selected';
  behavior: 'quiet' | 'social' | 'kidzone';
  nearWC: boolean;
  nearSimilarBehavior: boolean;
  passengersNearby: number;
}

interface TrainPricingData {
  trainId: string;
  routes: Array<{
    origin: string;
    destination: string;
    fares: {
      seating?: Array<{
        car_number: number;
        rows: Array<{
          row_numbers: number[];
          price: number;
        }>;
      }>;
      sleeper_6_berth?: Array<{
        car_number: number;
        rows: Array<{
          row_numbers: number[];
          price: number;
        }>;
      }>;
      sleeper_4_berth?: Array<{
        car_number: number;
        rows: Array<{
          row_numbers: number[];
          price: number;
        }>;
      }>;
    };
  }>;
}

interface TrainFareData {
  origin: string;
  destination: string;
  flat_seats: Array<{
    id: string;
    car: number;
    row: number;
    price: number;
  }>;
}

interface LegacyTrainPricingData {
  train_fares: TrainFareData[];
}

interface Coach {
  id: number;
  type: string;
}

// Danh sách mã tàu có file giá động
const DYNAMIC_PRICE_TRAINS = [
  'SE1', 'SE2', 'SE3', 'SE4', 'SE5', 'SE6', 'SE7', 'SE8', 'SE9', 'SE10', 'SE22'
];

// Hàm load file json giá động cho từng tàu
async function loadTrainPriceData(trainCode: string): Promise<LegacyTrainPricingData | null> {
  try {
    console.log(`Loading generated pricing data for train ${trainCode}...`);
    
    // Import generated pricing data instead of fetching from JSON
    try {
      const { ALL_GENERATED_PRICING_DATA } = await import('../../../shared/data/mockData/generated');
      console.log(`Imported pricing data for ${ALL_GENERATED_PRICING_DATA.length} trains`);
      console.log('Available train IDs:', ALL_GENERATED_PRICING_DATA.map(t => t.trainId));
      
      const trainPricing = ALL_GENERATED_PRICING_DATA.find(t => t.trainId === trainCode);
      
      if (!trainPricing) {
        console.error(`No generated pricing data found for train ${trainCode}`);
        console.log('Available trains:', ALL_GENERATED_PRICING_DATA.map(t => t.trainId));
        return null;
      }
      
      console.log(`Found pricing data for ${trainCode} with ${trainPricing.routes.length} routes`);
      
      // Convert to format expected by parseDynamicPrices
      const train_fares = trainPricing.routes.map(route => {
        const flat_seats: Array<{
          id: string;
          car: number;
          row: number;
          price: number;
        }> = [];
        
        // Convert seating cars
        if (route.fares.seating) {
          route.fares.seating.forEach(car => {
            car.rows.forEach(row => {
              row.row_numbers.forEach(seatNum => {
                flat_seats.push({
                  id: `${trainCode}-ngoi-${car.car_number}-${seatNum}`,
                  car: car.car_number,
                  row: Math.ceil(seatNum / 2),
                  price: row.price
                });
              });
            });
          });
        }
        
        // Convert 6-berth sleeper cars
        if (route.fares.sleeper_6_berth) {
          route.fares.sleeper_6_berth.forEach(car => {
            car.rows.forEach(row => {
              row.row_numbers.forEach(seatNum => {
                flat_seats.push({
                  id: `${trainCode}-k6-${car.car_number}-${seatNum}`,
                  car: car.car_number,
                  row: Math.ceil(seatNum / 6),
                  price: row.price
                });
              });
            });
          });
        }
        
        // Add mock data for coaches 6 and 7 (6-berth cabin)
        for (let coachIndex = 0; coachIndex < 2; coachIndex++) {
          const coachId = 6 + coachIndex;
          const basePrice = 850000 + (coachIndex * 5000);
          for (let seatIndex = 0; seatIndex < 42; seatIndex++) {
            const seatNum = seatIndex + 1;
            const priceVariation = Math.floor(seatNum / 6) * 5000;
            flat_seats.push({
              id: `${trainCode}-k6-${coachId}-${seatNum}`,
              car: coachId,
              row: Math.ceil(seatNum / 6),
              price: basePrice + priceVariation
            });
          }
        }
        
        // Convert 4-berth sleeper cars
        if (route.fares.sleeper_4_berth) {
          route.fares.sleeper_4_berth.forEach(car => {
            car.rows.forEach(row => {
              row.row_numbers.forEach(seatNum => {
                flat_seats.push({
                  id: `${trainCode}-k4-${car.car_number}-${seatNum}`,
                  car: car.car_number,
                  row: Math.ceil(seatNum / 4),
                  price: row.price
                });
              });
            });
          });
        }
        
        return {
          origin: route.origin,
          destination: route.destination,
          flat_seats: flat_seats
        };
      });
      
      console.log(`Converted to train_fares format with ${train_fares.length} routes`);
      train_fares.forEach(fare => {
        console.log(`  Route ${fare.origin} -> ${fare.destination}: ${fare.flat_seats.length} seats`);
      });
      
      return { train_fares };
      
    } catch (importError) {
      console.error('Error importing generated pricing data:', importError);
      return null;
    }
    
  } catch (e) {
    console.error(`Error loading generated pricing data for ${trainCode}:`, e);
    return null;
  }
}

// Hàm lấy giá cho từng ghế từ file json
interface DynamicPriceItem {
  id: string;
  type: string;
  car: number | null;
  row: number;
  price: number;
}

function parseDynamicPrices(
  trainCode: string,
  priceData: TrainPricingData | LegacyTrainPricingData,
  from: string,
  to: string
): DynamicPriceItem[] {
  const result: DynamicPriceItem[] = [];
  
  // Handle new format (TrainPricingData)
  if ('routes' in priceData) {
    // Convert new format to legacy format for compatibility
    const legacyData: LegacyTrainPricingData = {
      train_fares: priceData.routes.map(route => ({
        origin: route.origin,
        destination: route.destination,
        flat_seats: []
      }))
    };
    return parseDynamicPrices(trainCode, legacyData, from, to);
  }
  
  // Handle legacy format (LegacyTrainPricingData)
  if (!priceData || !priceData.train_fares) return result;
  
  // Chuẩn hóa tên ga
  const norm = (s: string) => {
    let normalized = s
      .trim()
      .toUpperCase()
      .replace(/^GA\s+/, '') // Loại bỏ "GA " ở đầu
      .replace(/\s+/g, ' ') // Chuẩn hóa khoảng trắng
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Loại bỏ dấu
    
    // Mapping tên ga đặc biệt
    if (normalized === 'SAI GON') {
      normalized = 'HO CHI MINH';
    }
    
    return normalized;
  };
  from = norm(from);
  to = norm(to);
  
  console.log(`Looking for route: "${from}" → "${to}" in ${trainCode}`);
  console.log('Available routes in data:', priceData.train_fares.map((f: TrainFareData) => `"${norm(f.origin)}" → "${norm(f.destination)}"`));
  
  // Tìm hành trình phù hợp
  const fare = priceData.train_fares.find((f: TrainFareData) => norm(f.origin) === from && norm(f.destination) === to);
  if (!fare) {
    console.log(`Không tìm thấy hành trình ${from} → ${to} trong ${trainCode}.json`);
    return result;
  }
  
  // Chỉ lấy dữ liệu từ flat_seats
  if (fare.flat_seats && Array.isArray(fare.flat_seats)) {
    return fare.flat_seats.map((item) => ({
      id: item.id,
      type: '',
      car: item.car,
      row: item.row,
      price: item.price
    }));
  }
  // Nếu không có flat_seats thì trả về rỗng
  return result;
}

// Hàm format giá thành dạng K
const formatPrice = (price: number) => {
  return `${Math.round(price / 1000)}K`;
};

// Cấu trúc toa chuẩn cho mọi tàu
const COACHES = [
  { id: 1, type: 'Soft seat', seats: 28, price: 990000 },
  { id: 2, type: 'Soft seat', seats: 28, price: 990000 },
  { id: 3, type: '2-berth Pregnant mother & newborn cabin', seats: 14, price: 1800000 },
  { id: 4, type: '4-berth Family cabin', seats: 28, price: 1500000 },
  { id: 5, type: '6-berth Family cabin', seats: 42, price: 1200000 },
  { id: 6, type: '6-berth cabin', seats: 42, price: 1200000 }, // Giống cấu trúc toa 5
  { id: 7, type: '6-berth cabin', seats: 42, price: 1200000 }, // Giống cấu trúc toa 5
  { id: 8, type: '4-berth cabin', seats: 28, price: 1500000 },
  { id: 9, type: '4-berth cabin', seats: 28, price: 1500000 },
  { id: 10, type: '4-berth cabin', seats: 28, price: 1500000 },
];

// SVG ghế vuông
const SeatIcon = ({ size = 32, color = "#e0e0e0" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <rect x="4" y="8" width="24" height="16" rx="4" fill={color} />
    <rect x="8" y="24" width="4" height="6" rx="2" fill={color} />
    <rect x="20" y="24" width="4" height="6" rx="2" fill={color} />
  </svg>
);

// SVG giường nằm
const BedIcon = ({ size = 32, color = "#e0e0e0" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <rect x="2" y="12" width="28" height="12" rx="2" fill={color} />
    <rect x="2" y="8" width="28" height="4" rx="2" fill={color} />
    <circle cx="8" cy="16" r="1.5" fill="#fff" opacity="0.3" />
    <circle cx="24" cy="16" r="1.5" fill="#fff" opacity="0.3" />
  </svg>
);

const SeatIconOccupied = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <rect x="4" y="8" width="24" height="16" rx="4" fill="#ededed" />
    <rect x="8" y="24" width="4" height="6" rx="2" fill="#ededed" />
    <rect x="20" y="24" width="4" height="6" rx="2" fill="#ededed" />
    <line x1="8" y1="12" x2="24" y2="24" stroke="#bbb" strokeWidth="2"/>
    <line x1="24" y1="12" x2="8" y2="24" stroke="#bbb" strokeWidth="2"/>
  </svg>
);

const BedIconOccupied = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <rect x="2" y="12" width="28" height="12" rx="2" fill="#ededed" />
    <rect x="2" y="8" width="28" height="4" rx="2" fill="#ededed" />
    <line x1="6" y1="14" x2="26" y2="22" stroke="#bbb" strokeWidth="2"/>
    <line x1="26" y1="14" x2="6" y2="22" stroke="#bbb" strokeWidth="2"/>
  </svg>
);

// Bảng noise và màu tương ứng cho toa 1 (Ngồi mềm)
// const NOISE_COLORS = [ ... ];
// const NOISE_MATRIX = [ ... ];
// function getNoiseColor(value: number) { ... }

// Bảng noise cho từng khoang/tầng của toa 2 (Gối mềm)
// const NOISE_MATRIX_2 = [ ... ];


const SelectSeat: React.FC = () => {
  console.log('🚀 SelectSeat component loaded!');
  console.log('📅 Current time:', new Date().toLocaleTimeString());
  
  // Add tooltip CSS styles
  useEffect(() => {
    const tooltipStyles = `
      .special-zone-tooltip {
        position: relative;
        display: inline-block;
      }
      
      .special-zone-tooltip:hover .tooltip-content {
        opacity: 1 !important;
        visibility: visible !important;
        transform: translateX(-50%) translateY(-4px) !important;
      }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = tooltipStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Lấy dữ liệu từ URL params
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const departDate = searchParams.get('departDate') || '';
  const trainId = searchParams.get('trainId') || '';
  
  // Lấy dữ liệu hành khách từ params
  const passengerData = searchParams.get('passengers');
  const passenger = passengerData ? JSON.parse(decodeURIComponent(passengerData)) : {
    adult: 0,
    child: 0,
    elderly: 0,
    student: 0,
    union: 0,
    expectant_nursing_mother: 0, // Sửa từ nursing thành expectant_nursing_mother
  };
  const totalPassengers = passenger.adult + passenger.child + passenger.elderly + passenger.student + passenger.union + (passenger.expectant_nursing_mother || 0);
  
  // State cho giá động
  const [dynamicPrices, setDynamicPrices] = useState<DynamicPriceItem[]>([]);
  // const [loadingPrices, setLoadingPrices] = useState(false);
  
  // State cho ghế và bộ lọc
  const [seats] = useState<LocalSeat[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [selectedCoachIdx, setSelectedCoachIdx] = useState(0);
  const [autoSelectMessage, setAutoSelectMessage] = useState<string>('');
  const [showFamilyWarningModal, setShowFamilyWarningModal] = useState(false);
  const [showLevelWarningModal, setShowLevelWarningModal] = useState(false);

  // Tạo mô tả hành khách
  const getPassengerDescription = () => {
    const parts: string[] = [];
    if (passenger.adult > 0) parts.push(`${passenger.adult} người lớn`);
    if (passenger.child > 0) parts.push(`${passenger.child} trẻ em`);
    if (passenger.elderly > 0) parts.push(`${passenger.elderly} người già`);
    if (passenger.student > 0) parts.push(`${passenger.student} học sinh`);
    if (passenger.union > 0) parts.push(`${passenger.union} đoàn viên`);
    if (passenger.expectant_nursing_mother > 0) parts.push(`${passenger.expectant_nursing_mother} mẹ cho con bú`);
    return parts.join(', ');
  };

  // Function để render toàn bộ layout ghế của một toa
  const renderCoachSeats = (coach: Coach) => {
    const coachSeatsData = coachSeats[coach.id] || [];
    
    // Logic render khác nhau cho từng loại toa
    // Toa 1-2: Soft seat
    if (coach.type === 'Soft seat' && (coach.id === 1 || coach.id === 2)) {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, justifyItems: 'center', minHeight: 320, background: '#fff' }}>
          {[0, 1, 2].map(idx => <div key={'empty-row-' + idx} />)}
          <div key="empty-row-wc" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
            <span style={{ fontSize: 12, color: '#1976d2', fontWeight: 600, background: '#e3f2fd', borderRadius: 8, padding: '2px 8px' }}>Toilet</span>
          </div>
          {coachSeatsData.map((seat, idx) => {
            if (!seat) return <div key={idx} />;
            const seatColor = getSeatColor(coach.id, idx);
            return <SeatButton key={seat.id} seat={seat} seatColor={seatColor} coachType={coach.type} />;
          })}
        </div>
      );
    }
    
    // Toa 3: 2-berth Pregnant mother & newborn cabin
    if (coach.type === '2-berth Pregnant mother & newborn cabin' && coach.id === 3) {
      return (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: '#1976d2', fontWeight: 600, background: '#e3f2fd', borderRadius: 8, padding: '2px 8px' }}>Toilet</span>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#e91e63' }}>
              🤱 Pregnant mother & newborn zone
            </div>
            <span style={{ fontSize: 12, color: '#1976d2', fontWeight: 600, background: '#e3f2fd', borderRadius: 8, padding: '2px 8px' }}>Toilet</span>
          </div>
          {Array.from({ length: 7 }, (_, khoangIdx) => (
            <div key={khoangIdx} style={{ marginBottom: 20, background: '#f5f5f5', borderRadius: 8, padding: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 4, color: '#e91e63' }}>
                Pregnant mother & newborn Compartment {khoangIdx + 1}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                {[0,1].map(seatInTang => {
                  const seat = coachSeatsData[khoangIdx*2 + seatInTang];
                  if (!seat) return <div key={seatInTang} style={{ width: 40 }} />;
                  const seatColor = "#fce4ec"; // Màu nền của compartment
                  return <SeatButton key={seat.id} seat={seat} seatColor={seatColor} coachType={coach.type} />;
                })}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Toa 4: 4-berth Family cabin
    if (coach.type === '4-berth Family cabin' && coach.id === 4) {
      return (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: '#1976d2', fontWeight: 600, background: '#e3f2fd', borderRadius: 8, padding: '2px 8px' }}>Toilet</span>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#ff9800' }}>
              👨‍👩‍👧‍👦 4-berth Family zone
            </div>
            <span style={{ fontSize: 12, color: '#1976d2', fontWeight: 600, background: '#e3f2fd', borderRadius: 8, padding: '2px 8px' }}>Toilet</span>
          </div>
          {Array.from({ length: 7 }, (_, khoangIdx) => (
            <div key={khoangIdx} style={{ marginBottom: 20, background: '#f5f5f5', borderRadius: 8, padding: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 4, color: '#ff9800' }}>
                Family Compartment {khoangIdx + 1}
              </div>
              {[1,0].map(tangIdx => (
                <div key={tangIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                  {[0,1].map(seatInTang => {
                    const seatIdx = tangIdx*2 + seatInTang;
                    const seat = coachSeatsData[khoangIdx*4 + seatIdx];
                    if (!seat) return <div key={seatIdx} style={{ width: 40 }} />;
                    const seatColor = "#fff3e0"; // Màu nền của compartment
                    return <SeatButton key={seat.id} seat={seat} seatColor={seatColor} coachType={coach.type} />;
                  })}
                  <span style={{ marginLeft: 8, fontSize: 12, color: '#888' }}>Level {tangIdx + 1}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }

    // Toa 5: 6-berth Family cabin
    if (coach.type === '6-berth Family cabin' && coach.id === 5) {
      return (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: '#1976d2', fontWeight: 600, background: '#e3f2fd', borderRadius: 8, padding: '2px 8px' }}>Toilet</span>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#4caf50' }}>
              👨‍👩‍👧‍👦 6-berth Family zone
            </div>
            <span style={{ fontSize: 12, color: '#1976d2', fontWeight: 600, background: '#e3f2fd', borderRadius: 8, padding: '2px 8px' }}>Toilet</span>
          </div>
          {Array.from({ length: 7 }, (_, khoangIdx) => (
            <div key={khoangIdx} style={{ marginBottom: 20, background: '#f5f5f5', borderRadius: 8, padding: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 4, color: '#4caf50' }}>
                Family Compartment {khoangIdx + 1}
              </div>
              {[2,1,0].map(tangIdx => (
                <div key={tangIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                  {[0,1].map(seatInTang => {
                    const seatIdx = tangIdx*2 + seatInTang;
                    const seat = coachSeatsData[khoangIdx*6 + seatIdx];
                    if (!seat) return <div key={seatIdx} style={{ width: 40 }} />;
                    const seatColor = "#e8f5e8"; // Màu nền của compartment
                    return <SeatButton key={seat.id} seat={seat} seatColor={seatColor} coachType={coach.type} />;
                  })}
                  <span style={{ marginLeft: 8, fontSize: 12, color: '#888' }}>Level {tangIdx + 1}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }
    

    // Toa 6-7: 6-berth cabin
    if (coach.type === '6-berth cabin' && (coach.id === 6 || coach.id === 7)) {
      return (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
            <span style={{ fontSize: 12, color: '#1976d2', fontWeight: 600, background: '#e3f2fd', borderRadius: 8, padding: '2px 8px' }}>Toilet</span>
          </div>
          {Array.from({ length: 7 }, (_, khoangIdx) => (
            <div key={khoangIdx} style={{ marginBottom: 20, background: '#f7f7fa', borderRadius: 8, padding: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Compartment {khoangIdx + 1}</div>
              {[2,1,0].map(tangIdx => (
                <div key={tangIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                  {[0,1].map(seatInTang => {
                    const seatIdx = tangIdx*2 + seatInTang;
                    const seat = coachSeatsData[khoangIdx*6 + seatIdx];
                    if (!seat) return <div key={seatIdx} style={{ width: 40 }} />;
                    const seatColor = getSeatColor(coach.id, khoangIdx * 6 + seatIdx);
                    return <SeatButton key={seat.id} seat={seat} seatColor={seatColor} coachType={coach.type} />;
                  })}
                  <span style={{ marginLeft: 8, fontSize: 12, color: '#888' }}>Level {tangIdx + 1}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }
    
    // Toa 8-10: 4-berth cabin
    if (coach.type === '4-berth cabin' && (coach.id >= 8 && coach.id <= 10)) {
      return (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
            <span style={{ fontSize: 12, color: '#1976d2', fontWeight: 600, background: '#e3f2fd', borderRadius: 8, padding: '2px 8px' }}>Toilet</span>
          </div>
          {Array.from({ length: 7 }, (_, khoangIdx) => (
            <div key={khoangIdx} style={{ marginBottom: 20, background: '#f7f7fa', borderRadius: 8, padding: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Compartment {khoangIdx + 1}</div>
              {[1,0].map(tangIdx => (
                <div key={tangIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                  {[0,1].map(seatInTang => {
                    const seatIdx = tangIdx*2 + seatInTang;
                    const seat = coachSeatsData[khoangIdx*4 + seatIdx];
                    if (!seat) return <div key={seatIdx} style={{ width: 40 }} />;
                    const seatColor = getSeatColor(coach.id, khoangIdx * 4 + seatIdx);
                    return <SeatButton key={seat.id} seat={seat} seatColor={seatColor} coachType={coach.type} />;
                  })}
                  <span style={{ marginLeft: 8, fontSize: 12, color: '#888' }}>Level {tangIdx + 1}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }
    
    // Fallback cho loại toa khác
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, justifyItems: 'center', minHeight: 320, background: '#fff' }}>
        {coachSeatsData.map((seat, idx) => {
          if (!seat) return <div key={idx} />;
          const seatColor = getSeatColor(coach.id, idx);
          return <SeatButton key={seat.id} seat={seat} seatColor={seatColor} coachType={coach.type} />;
        })}
      </div>
    );
  };

  // Component render ghế đơn giản hóa tất cả logic với filter highlight
  const SeatButton = ({ seat, seatColor, size = 32, coachType }: { seat: LocalSeat; seatColor: string; size?: number; coachType?: string }) => {
    const isOccupied = seat.status === 'occupied';
    const isSelected = selectedSeatIds.includes(seat.id);
    const isFiltered = isFilterActive && filteredSeatIds.includes(seat.id);
    const isFilteredOut = isFilterActive && !filteredSeatIds.includes(seat.id) && seat.status === 'available';
    
    // Chọn icon phù hợp: ghế cho soft seat, giường cho cabin
    const isSeatingCoach = coachType === 'Soft seat';
    const SeatIconComponent = isSeatingCoach ? SeatIcon : BedIcon;
    const SeatIconOccupiedComponent = isSeatingCoach ? SeatIconOccupied : BedIconOccupied;
    
    // Debug logging for seat visibility
    if (isFilterActive) {
      console.log(`🪑 Seat ${seat.id}:`, {
        isOccupied,
        isSelected,
        isFiltered,
        isFilteredOut,
        inFilteredList: filteredSeatIds.includes(seat.id),
        status: seat.status
      });
    }
    
    return (
      <button
        key={seat.id}
        onClick={() => handleSeatSelect(seat.id)}
        disabled={isOccupied}
        style={{
          background: isSelected ? '#e3f2fd' : isFiltered ? '#fff8e1' : '#fff',
          border: isSelected ? '3px solid #1976d2' : isFiltered ? '3px solid #ff9800' : '2px solid #e0e0e0',
          borderRadius: 8,
          padding: 0,
          cursor: isOccupied ? 'not-allowed' : 'pointer',
          // Improved opacity logic - don't make filtered out seats too dim
          opacity: isOccupied ? 0.4 : isFilteredOut ? 0.6 : 1, // Changed from 0.3 to 0.6
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          minWidth: 40,
          boxShadow: isSelected ? '0 2px 8px rgba(25, 118, 210, 0.3)' : isFiltered ? '0 2px 8px rgba(255, 152, 0, 0.3)' : 'none',
          transform: isSelected ? 'scale(1.05)' : isFiltered ? 'scale(1.02)' : 'scale(1)',
          transition: 'all 0.2s ease',
          // Add visual indicator for filter state
          outline: isFilteredOut ? '1px dashed #ccc' : 'none'
        }}
      >
        {isSelected && (
          <div style={{
            position: 'absolute',
            top: -8,
            right: -8,
            background: '#4caf50',
            color: '#fff',
            borderRadius: '50%',
            width: 20,
            height: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
            zIndex: 10
          }}>
            ✓
          </div>
        )}
        {isFiltered && !isSelected && (
          <div style={{
            position: 'absolute',
            top: -8,
            right: -8,
            background: '#ff9800',
            color: '#fff',
            borderRadius: '50%',
            width: 20,
            height: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
            zIndex: 10
          }}>
            ★
          </div>
        )}
        {isOccupied ? <SeatIconOccupiedComponent size={size} /> : <SeatIconComponent size={size} color={seatColor} />}
        <span style={{ fontWeight: 700, fontSize: 13, color: isSelected ? '#1976d2' : isFiltered ? '#ff9800' : '#222', marginTop: 2 }}>{seat.column}</span>
        <span style={{ fontSize: 11, color: '#888' }}>{formatPrice(seat.price)}</span>
      </button>
    );
  };



  // Load giá động từ file JSON
  useEffect(() => {
    async function loadDynamicPrices() {
      if (!DYNAMIC_PRICE_TRAINS.includes(trainId)) {
        console.log(`Tàu ${trainId} không có file giá động, sử dụng mock data`);
        return;
      }
      
      console.log(`Starting loadDynamicPrices for ${trainId}: ${from} → ${to}`);
      
      // const setLoadingPrices = true;
      try {
        const priceData = await loadTrainPriceData(trainId);
        console.log(`loadTrainPriceData returned:`, priceData ? 'success' : 'null');
        
        if (priceData) {
          const prices = parseDynamicPrices(trainId, priceData, from, to);
          setDynamicPrices(prices);
          console.log(`Loaded ${prices.length} dynamic prices for ${trainId}:`, prices);
          
          // Debug: log một số ví dụ seatId để kiểm tra
          if (prices.length > 0) {
            console.log('Sample dynamic prices:');
            prices.slice(0, 10).forEach(price => {
              console.log(`  ${price.id}: ${price.price}`);
            });
            
            // Debug: log số lượng giá cho từng loại
            const seatingCount = prices.filter(p => p.id.includes('-ngoi-')).length;
            const k6Count = prices.filter(p => p.id.includes('-k6-')).length;
            const k4Count = prices.filter(p => p.id.includes('-k4-')).length;
            console.log(`Dynamic prices breakdown: seating=${seatingCount}, k6=${k6Count}, k4=${k4Count}`);
          }
        } else {
          console.log(`Không load được file ${trainId}.json`);
        }
      } catch (error) {
        console.error('Error loading dynamic prices:', error);
      } finally {
        // setLoadingPrices(false);
      }
    }
    
    loadDynamicPrices();
  }, [trainId, from, to]);
  
  console.log('SelectSeat component loaded with dynamic prices:', { trainId, from, to, dynamicPrices });

// Sinh dữ liệu ghế cho từng toa dựa trên COACHES và giá động
const [coachSeats, setCoachSeats] = useState<Record<number, LocalSeat[]>>({});
useEffect(() => {
  const newCoachSeats: Record<number, LocalSeat[]> = {};
  COACHES.forEach(coach => {
    const seats: LocalSeat[] = [];
    
    if (coach.type === '2-berth Pregnant mother & newborn cabin') {
      // 7 khoang, mỗi khoang 2 giường
      for (let khoang = 0; khoang < 7; khoang++) {
        for (let viTri = 0; viTri < 2; viTri++) {
          const soGheThucTe = khoang * 2 + viTri + 1;
          const seatId = `${trainId}-k2-${coach.id}-${soGheThucTe}`;
          
          let price = 1800000; // default price
          if (dynamicPrices.length > 0) {
            const item = dynamicPrices.find(item => item.id === seatId);
            if (item) price = item.price;
          }
          
          console.log(`[K2] Khoang ${khoang+1} - Giường ${soGheThucTe} (seatId: ${seatId}): giá = ${price}`);
          seats.push({
            id: `${coach.id}-${soGheThucTe}`,
            row: '',
            column: soGheThucTe,
            floor: 1,
            price: price,
            status: Math.random() > 0.85 ? 'occupied' : 'available',
            behavior: getBehaviorFromColor(coach.id, soGheThucTe - 1),
            nearWC: false,
            nearSimilarBehavior: false,
            passengersNearby: 0
          });
        }
      }
    } else if (coach.type === '6-berth cabin') {
      // 7 khoang, mỗi khoang 3 tầng, mỗi tầng 2 ghế
      for (let khoang = 0; khoang < 7; khoang++) {
        // Tầng 1
        for (let viTri = 0; viTri < 2; viTri++) {
          const soGheThucTe = khoang * 6 + viTri + 1;
          const seatId = `${trainId}-k6-${coach.id}-${soGheThucTe}`;
          
          let price = 850000; // default price
          if (dynamicPrices.length > 0) {
            const item = dynamicPrices.find(item => item.id === seatId);
            if (item) price = item.price;
          }
          
          console.log(`[K6] Khoang ${khoang+1} - Tầng 1 - Ghế ${soGheThucTe} (seatId: ${seatId}): giá = ${price}`);
          seats.push({
            id: `${coach.id}-${soGheThucTe}`,
            row: '',
            column: soGheThucTe,
            floor: 1,
            price: price,
            status: Math.random() > 0.85 ? 'occupied' : 'available',
            behavior: getBehaviorFromColor(coach.id, soGheThucTe - 1),
            nearWC: false,
            nearSimilarBehavior: false,
            passengersNearby: 0
          });
        }
        
        // Tầng 2
        for (let viTri = 0; viTri < 2; viTri++) {
          const soGheThucTe = khoang * 6 + 2 + viTri + 1;
          const seatId = `${trainId}-k6-${coach.id}-${soGheThucTe}`;
          
          let price = 850000; // default price
          if (dynamicPrices.length > 0) {
            const item = dynamicPrices.find(item => item.id === seatId);
            if (item) price = item.price;
          }
          
          console.log(`[K6] Khoang ${khoang+1} - Tầng 2 - Ghế ${soGheThucTe} (seatId: ${seatId}): giá = ${price}`);
          seats.push({
            id: `${coach.id}-${soGheThucTe}`,
            row: '',
            column: soGheThucTe,
            floor: 2,
            price: price,
            status: Math.random() > 0.85 ? 'occupied' : 'available',
            behavior: getBehaviorFromColor(coach.id, soGheThucTe - 1),
            nearWC: false,
            nearSimilarBehavior: false,
            passengersNearby: 0
          });
        }
        
        // Tầng 3
        for (let viTri = 0; viTri < 2; viTri++) {
          const soGheThucTe = khoang * 6 + 4 + viTri + 1;
          const seatId = `${trainId}-k6-${coach.id}-${soGheThucTe}`;
          
          let price = 850000; // default price
          if (dynamicPrices.length > 0) {
            const item = dynamicPrices.find(item => item.id === seatId);
            if (item) price = item.price;
          }
          
          console.log(`[K6] Khoang ${khoang+1} - Tầng 3 - Ghế ${soGheThucTe} (seatId: ${seatId}): giá = ${price}`);
          seats.push({
            id: `${coach.id}-${soGheThucTe}`,
            row: '',
            column: soGheThucTe,
            floor: 3,
            price: price,
            status: Math.random() > 0.85 ? 'occupied' : 'available',
            behavior: getBehaviorFromColor(coach.id, soGheThucTe - 1),
            nearWC: false,
            nearSimilarBehavior: false,
            passengersNearby: 0
          });
        }
      }
    } else if (coach.type === '4-berth Family cabin') {
      // 7 khoang, mỗi khoang 2 tầng, mỗi tầng 2 ghế (Family compartment)
      for (let khoang = 0; khoang < 7; khoang++) {
        // Random cho từng hàng (level) - 2 ghế cùng hàng cùng trạng thái
        const isLevel1Occupied = Math.random() > 0.85;
        const isLevel2Occupied = Math.random() > 0.85;
        
        // Tầng 1
        for (let viTri = 0; viTri < 2; viTri++) {
          const soGheThucTe = khoang * 4 + viTri + 1;
          const seatId = `${trainId}-k4f-${coach.id}-${soGheThucTe}`;
          
          let price = 1700000; // default price for family cabin
          if (dynamicPrices.length > 0) {
            const item = dynamicPrices.find(item => item.id === seatId);
            if (item) price = item.price;
          }
          
          console.log(`[K4F] Khoang ${khoang+1} - Tầng 1 - Ghế ${soGheThucTe} (seatId: ${seatId}): giá = ${price}`);
          seats.push({
            id: `${coach.id}-${soGheThucTe}`,
            row: '',
            column: soGheThucTe,
            floor: 1,
            price: price,
            status: isLevel1Occupied ? 'occupied' : 'available',
            behavior: getBehaviorFromColor(coach.id, soGheThucTe - 1),
            nearWC: false,
            nearSimilarBehavior: false,
            passengersNearby: 0
          });
        }
        // Tầng 2
        for (let viTri = 0; viTri < 2; viTri++) {
          const soGheThucTe = khoang * 4 + 2 + viTri + 1;
          const seatId = `${trainId}-k4f-${coach.id}-${soGheThucTe}`;
          
          let price = 1700000; // default price for family cabin
          if (dynamicPrices.length > 0) {
            const item = dynamicPrices.find(item => item.id === seatId);
            if (item) price = item.price;
          }
          
          console.log(`[K4F] Khoang ${khoang+1} - Tầng 2 - Ghế ${soGheThucTe} (seatId: ${seatId}): giá = ${price}`);
          seats.push({
            id: `${coach.id}-${soGheThucTe}`,
            row: '',
            column: soGheThucTe,
            floor: 2,
            price: price,
            status: isLevel2Occupied ? 'occupied' : 'available',
            behavior: getBehaviorFromColor(coach.id, soGheThucTe - 1),
            nearWC: false,
            nearSimilarBehavior: false,
            passengersNearby: 0
          });
        }
      }
    } else if (coach.type === '6-berth Family cabin') {
      // 7 khoang, mỗi khoang 3 tầng, mỗi tầng 2 ghế (Family compartment)
      for (let khoang = 0; khoang < 7; khoang++) {
        // Random cho từng hàng (level) - 2 ghế cùng hàng cùng trạng thái
        const isLevel1Occupied = Math.random() > 0.85;
        const isLevel2Occupied = Math.random() > 0.85;
        const isLevel3Occupied = Math.random() > 0.85;
        
        // Tầng 1
        for (let viTri = 0; viTri < 2; viTri++) {
          const soGheThucTe = khoang * 6 + viTri + 1;
          const seatId = `${trainId}-k6f-${coach.id}-${soGheThucTe}`;
          
          let price = 1400000; // default price for family cabin
          if (dynamicPrices.length > 0) {
            const item = dynamicPrices.find(item => item.id === seatId);
            if (item) price = item.price;
          }
          
          console.log(`[K6F] Khoang ${khoang+1} - Tầng 1 - Ghế ${soGheThucTe} (seatId: ${seatId}): giá = ${price}`);
          seats.push({
            id: `${coach.id}-${soGheThucTe}`,
            row: '',
            column: soGheThucTe,
            floor: 1,
            price: price,
            status: isLevel1Occupied ? 'occupied' : 'available',
            behavior: getBehaviorFromColor(coach.id, soGheThucTe - 1),
            nearWC: false,
            nearSimilarBehavior: false,
            passengersNearby: 0
          });
        }
        
        // Tầng 2
        for (let viTri = 0; viTri < 2; viTri++) {
          const soGheThucTe = khoang * 6 + 2 + viTri + 1;
          const seatId = `${trainId}-k6f-${coach.id}-${soGheThucTe}`;
          
          let price = 1400000; // default price for family cabin
          if (dynamicPrices.length > 0) {
            const item = dynamicPrices.find(item => item.id === seatId);
            if (item) price = item.price;
          }
          
          console.log(`[K6F] Khoang ${khoang+1} - Tầng 2 - Ghế ${soGheThucTe} (seatId: ${seatId}): giá = ${price}`);
          seats.push({
            id: `${coach.id}-${soGheThucTe}`,
            row: '',
            column: soGheThucTe,
            floor: 2,
            price: price,
            status: isLevel2Occupied ? 'occupied' : 'available',
            behavior: getBehaviorFromColor(coach.id, soGheThucTe - 1),
            nearWC: false,
            nearSimilarBehavior: false,
            passengersNearby: 0
          });
        }
        
        // Tầng 3
        for (let viTri = 0; viTri < 2; viTri++) {
          const soGheThucTe = khoang * 6 + 4 + viTri + 1;
          const seatId = `${trainId}-k6f-${coach.id}-${soGheThucTe}`;
          
          let price = 1400000; // default price for family cabin
          if (dynamicPrices.length > 0) {
            const item = dynamicPrices.find(item => item.id === seatId);
            if (item) price = item.price;
          }
          
          console.log(`[K6F] Khoang ${khoang+1} - Tầng 3 - Ghế ${soGheThucTe} (seatId: ${seatId}): giá = ${price}`);
          seats.push({
            id: `${coach.id}-${soGheThucTe}`,
            row: '',
            column: soGheThucTe,
            floor: 3,
            price: price,
            status: isLevel3Occupied ? 'occupied' : 'available',
            behavior: getBehaviorFromColor(coach.id, soGheThucTe - 1),
            nearWC: false,
            nearSimilarBehavior: false,
            passengersNearby: 0
          });
        }
      }
    } else if (coach.type === '4-berth cabin') {
      // 7 khoang, mỗi khoang 2 tầng, mỗi tầng 2 ghế
      for (let khoang = 0; khoang < 7; khoang++) {
        // Tầng 1
        for (let viTri = 0; viTri < 2; viTri++) {
          const soGheThucTe = khoang * 4 + viTri + 1;
          const seatId = `${trainId}-k4-${coach.id}-${soGheThucTe}`;
          
          let price = 1200000; // default price
          if (dynamicPrices.length > 0) {
            const item = dynamicPrices.find(item => item.id === seatId);
            if (item) price = item.price;
          }
          
          console.log(`[K4] Khoang ${khoang+1} - Tầng 1 - Ghế ${soGheThucTe} (seatId: ${seatId}): giá = ${price}`);
          seats.push({
            id: `${coach.id}-${soGheThucTe}`,
            row: '',
            column: soGheThucTe,
            floor: 1,
            price: price,
            status: Math.random() > 0.85 ? 'occupied' : 'available',
            behavior: getBehaviorFromColor(coach.id, soGheThucTe - 1),
            nearWC: false,
            nearSimilarBehavior: false,
            passengersNearby: 0
          });
        }
        // Tầng 2
        for (let viTri = 0; viTri < 2; viTri++) {
          const soGheThucTe = khoang * 4 + 2 + viTri + 1;
          const seatId = `${trainId}-k4-${coach.id}-${soGheThucTe}`;
          
          let price = 1200000; // default price
          if (dynamicPrices.length > 0) {
            const item = dynamicPrices.find(item => item.id === seatId);
            if (item) price = item.price;
          }
          
          console.log(`[K4] Khoang ${khoang+1} - Tầng 2 - Ghế ${soGheThucTe} (seatId: ${seatId}): giá = ${price}`);
          seats.push({
            id: `${coach.id}-${soGheThucTe}`,
            row: '',
            column: soGheThucTe,
            floor: 2,
            price: price,
            status: Math.random() > 0.85 ? 'occupied' : 'available',
            behavior: getBehaviorFromColor(coach.id, soGheThucTe - 1),
            nearWC: false,
            nearSimilarBehavior: false,
            passengersNearby: 0
          });
        }
      }
    } else {
      // Toa ngồi mềm: giữ nguyên logic cũ
      for (let i = 1; i <= coach.seats; i++) {
        let dynamicPrice = 0;
        let seatId = '';
        if (coach.type === 'Soft seat') {
          const carNumber = coach.id;
          seatId = `${trainId}-ngoi-${carNumber}-${i}`;
        }
        if (seatId && dynamicPrices.length > 0) {
          const dynamicItem = dynamicPrices.find(item => item.id === seatId);
          if (dynamicItem) {
            dynamicPrice = dynamicItem.price;
          }
        }
        const defaultPrice = 850000;
        const price = dynamicPrice || defaultPrice;
        seats.push({
          id: `${coach.id}-${i}`,
          row: '',
          column: i,
          floor: 1,
          price: price,
          status: Math.random() > 0.85 ? 'occupied' : 'available',
          behavior: getBehaviorFromColor(coach.id, i - 1),
          nearWC: false,
          nearSimilarBehavior: false,
          passengersNearby: 0
        });
      }
    }
    newCoachSeats[coach.id] = seats;
  });
  setCoachSeats(newCoachSeats);
}, [dynamicPrices, trainId]);

  // Tổng số ghế còn lại cho từng toa


  // ==================== COLOR & BEHAVIOR LOGIC ====================
  
  // Hàm tạo màu gradient từ đỏ đến xanh
  const createGradientColor = (percent: number) => {
    // Clamp percent between 0 and 1
    const normalizedPercent = Math.max(0, Math.min(1, percent));
    
    // Màu đỏ cam (start): #F97316 (249, 115, 22)
    // Màu xanh lá (end): #22C55E (34, 197, 94)
    const startColor = { r: 249, g: 115, b: 22 };
    const endColor = { r: 34, g: 197, b: 94 };
    
    const r = Math.round(startColor.r + (endColor.r - startColor.r) * normalizedPercent);
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * normalizedPercent);
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * normalizedPercent);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Hàm tính toán màu sắc cho ghế với dải màu "chảy" từ đỏ đến xanh theo khu vực
  const getSeatColor = (coachId: number, seatIndex: number) => {
    const coach = COACHES.find(c => c.id === coachId);
    if (!coach) return "#e0e0e0";

    // Khu ghế ngồi: Toa 1-2 (dải màu chảy liên tục)
    if ([1, 2].includes(coachId)) {
      // Giả sử mỗi toa có khoảng 64 ghế (8 hàng x 8 ghế)
      const seatsPerCoach = 64;
      const totalSeatsInZone = seatsPerCoach * 2; // 2 toa
      
      let globalSeatIndex = seatIndex;
      if (coachId === 2) {
        globalSeatIndex += seatsPerCoach; // Offset cho toa 2
      }
      
      const percent = globalSeatIndex / (totalSeatsInZone - 1);
      return createGradientColor(percent);
    }

    // Khu 6 giường 1 cabin: Toa 6-7 (dải màu chảy riêng)
    if ([6, 7].includes(coachId)) {
      // Giả sử mỗi toa 6-berth có khoảng 42 chỗ (7 cabin x 6 ghế)
      const seatsPerCoach = 42;
      const totalSeatsInZone = seatsPerCoach * 2; // 2 toa
      
      let globalSeatIndex = seatIndex;
      if (coachId === 7) {
        globalSeatIndex += seatsPerCoach; // Offset cho toa 7
      }
      
      const percent = globalSeatIndex / (totalSeatsInZone - 1);
      return createGradientColor(percent);
    }

    // Khu 4 giường 1 cabin: Toa 8-10 (dải màu chảy riêng)
    if ([8, 9, 10].includes(coachId)) {
      // Giả sử mỗi toa 4-berth có khoảng 28 chỗ (7 cabin x 4 ghế)
      const seatsPerCoach = 28;
      const totalSeatsInZone = seatsPerCoach * 3; // 3 toa
      
      let globalSeatIndex = seatIndex;
      if (coachId === 9) {
        globalSeatIndex += seatsPerCoach; // Offset cho toa 9
      } else if (coachId === 10) {
        globalSeatIndex += seatsPerCoach * 2; // Offset cho toa 10
      }
      
      const percent = globalSeatIndex / (totalSeatsInZone - 1);
      return createGradientColor(percent);
    }

    // Các toa đặc biệt khác
    if (coachId === 3) {
      // Toa 3: 2 giường 1 cabin - Màu hồng cho kidzone
      return "#E91E63";
    }
    
    if ([4, 5].includes(coachId)) {
      // Toa 4,5: Các loại cabin khác - Màu tím nhẹ
      return "#9C27B0";
    }

    // Fallback cho các toa không xác định
    return "#e0e0e0";
  };

  // Hàm phân tích màu để xác định behavior
  const analyzeColorForBehavior = (colorString: string): 'quiet' | 'social' | 'kidzone' => {
    if (!colorString || colorString === "#e0e0e0") return 'social'; // Default
    
    // Special colors
    if (colorString === "#E91E63" || colorString === "#9C27B0") {
      return 'kidzone';
    }
    
    let r, g, b;
    
    if (colorString.startsWith('rgb')) {
      // Parse rgb(r, g, b) format
      const match = colorString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        r = parseInt(match[1]);
        g = parseInt(match[2]);
        b = parseInt(match[3]);
      } else {
        return 'social'; // Default
      }
    } else if (colorString.startsWith('#')) {
      // Parse hex format
      const hex = colorString.replace('#', '');
      r = parseInt(hex.substr(0, 2), 16);
      g = parseInt(hex.substr(2, 2), 16);
      b = parseInt(hex.substr(4, 2), 16);
    } else {
      return 'social'; // Default
    }
    
    // Calculate distance to reference colors
    const redReference = { r: 249, g: 115, b: 22 }; // Orange-red (social/noise)
    const greenReference = { r: 34, g: 197, b: 94 }; // Green (quiet)
    
    const distanceToRed = Math.sqrt(
      Math.pow(r - redReference.r, 2) + 
      Math.pow(g - redReference.g, 2) + 
      Math.pow(b - redReference.b, 2)
    );
    
    const distanceToGreen = Math.sqrt(
      Math.pow(r - greenReference.r, 2) + 
      Math.pow(g - greenReference.g, 2) + 
      Math.pow(b - greenReference.b, 2)
    );
    
    // Closer to green = quiet, closer to red = social
    if (distanceToGreen < distanceToRed) {
      return 'quiet';
    } else {
      return 'social';
    }
  };

  // Hàm tính behavior dựa trên coach ID và vị trí ghế (theo màu gradient)
  const getBehaviorFromColor = (coachId: number, seatIndex: number): 'quiet' | 'social' | 'kidzone' => {
    console.log(`🎯 getBehaviorFromColor called for Coach ${coachId}, Seat Index ${seatIndex}`);
    
    // RULE 1: Toa 3,4,5 = kidzone (Family & Pregnant mother cabins)
    if ([3, 4, 5].includes(coachId)) {
      console.log(`✅ Coach ${coachId} is kidzone (family/pregnant mother area)`);
      return 'kidzone';
    }
    
    // RULE 2: Toa có gradient (1-2, 6-7, 8-10) - behavior dựa trên màu
    if ([1, 2, 6, 7, 8, 9, 10].includes(coachId)) {
      // Lấy màu của ghế
      const seatColor = getSeatColor(coachId, seatIndex);
      
      // Phân tích màu để xác định behavior
      const colorAnalysis = analyzeColorForBehavior(seatColor);
      console.log(`🎨 Coach ${coachId} Seat ${seatIndex}: color=${seatColor} → behavior=${colorAnalysis}`);
      
      return colorAnalysis;
    }
    
    // Default fallback
    console.log(`⚠️ Coach ${coachId} not in predefined ranges, defaulting to social`);
    return 'social';
  };

  // ==================== AUTO SEAT SELECTION LOGIC ====================
  
  // Tính khoảng cách ghế từ vị trí toilet (toilet ở góc phải trên)
  const getDistanceFromToilet = (seatIndex: number, coachType: string) => {
    if (coachType === 'Soft seat') {
      // Toa ngồi: toilet ở vị trí (0,3) trong grid 4 cột
      const row = Math.floor(seatIndex / 4);
      const col = seatIndex % 4;
      return Math.sqrt((row - 0) * (row - 0) + (col - 3) * (col - 3));
    } else if (coachType === '6-berth cabin') {
      // Toa nằm 6: toilet ở đầu toa, ưu tiên khoang 1
      const compartment = Math.floor(seatIndex / 6);
      return compartment; // Khoang càng gần 0 càng gần toilet
    } else if (coachType === '4-berth cabin') {
      // Toa nằm 4: toilet ở đầu toa, ưu tiên khoang 1
      const compartment = Math.floor(seatIndex / 4);
      return compartment; // Khoang càng gần 0 càng gần toilet
    }
    return seatIndex;
  };

  // Kiểm tra khoang có đủ chỗ trống không
  const isCompartmentEmpty = (coachId: number, compartmentIndex: number, seatCount: number) => {
    const seats = coachSeats[coachId] || [];
    const compartmentSeats = seats.slice(compartmentIndex * seatCount, (compartmentIndex + 1) * seatCount);
    return compartmentSeats.every(seat => seat && seat.status === 'available');
  };

  // Tìm khoang trống gần nhất cho nhóm
  const findNearestEmptyCompartment = (coachId: number, seatCount: number) => {
    const coach = COACHES.find(c => c.id === coachId);
    if (!coach) return -1;

    const compartmentCount = Math.floor(coach.seats / seatCount);
    
    for (let i = 0; i < compartmentCount; i++) {
      if (isCompartmentEmpty(coachId, i, seatCount)) {
        return i;
      }
    }
    return -1;
  };

  // Chọn ghế cho nhóm có trẻ em/người già (gần toilet)
  const selectSeatsNearToilet = (totalSeats: number) => {
    const selectedSeats: string[] = [];
    
    // Tìm toa có chỗ và ưu tiên toa ngồi (gần toilet hơn)
    for (const coach of COACHES) {
      const availableSeats = (coachSeats[coach.id] || [])
        .map((seat, index) => ({ seat, index }))
        .filter(({seat}) => seat && seat.status === 'available')
        .sort((a, b) => getDistanceFromToilet(a.index, coach.type) - getDistanceFromToilet(b.index, coach.type));

      if (availableSeats.length >= totalSeats) {
        for (let i = 0; i < totalSeats; i++) {
          selectedSeats.push(availableSeats[i].seat.id);
        }
        setSelectedCoachIdx(COACHES.findIndex(c => c.id === coach.id));
        break;
      }
    }
    
    return selectedSeats;
  };

  // Chọn khoang trống cho nhóm 4 người
  const selectGroup4Compartment = (numPassengers = 4) => {
    // Ưu tiên toa nằm 4
    for (const coach of COACHES.filter(c => c.type === '4-berth cabin')) {
      const compartmentIndex = findNearestEmptyCompartment(coach.id, 4);
      if (compartmentIndex !== -1) {
        const seats = coachSeats[coach.id] || [];
        const compartmentSeats = seats.slice(compartmentIndex * 4, (compartmentIndex + 1) * 4);
        setSelectedCoachIdx(COACHES.findIndex(c => c.id === coach.id));
        // Chỉ chọn đúng số ghế bằng số hành khách
        return compartmentSeats.slice(0, numPassengers).map(seat => seat.id);
      }
    }

    // Nếu không có toa 4, tìm ghế liền kề trong toa khác
    for (const coach of COACHES) {
      const availableSeats = (coachSeats[coach.id] || [])
        .filter(seat => seat && seat.status === 'available');
      
      if (availableSeats.length >= numPassengers) {
        setSelectedCoachIdx(COACHES.findIndex(c => c.id === coach.id));
        return availableSeats.slice(0, numPassengers).map(seat => seat.id);
      }
    }
    
    return [];
  };

  // Chọn khoang trống cho nhóm 6 người
  const selectGroup6Compartment = (numPassengers = 6) => {
    // Ưu tiên toa nằm 6
    for (const coach of COACHES.filter(c => c.type === '6-berth cabin')) {
      const compartmentIndex = findNearestEmptyCompartment(coach.id, 6);
      if (compartmentIndex !== -1) {
        const seats = coachSeats[coach.id] || [];
        const compartmentSeats = seats.slice(compartmentIndex * 6, (compartmentIndex + 1) * 6);
        setSelectedCoachIdx(COACHES.findIndex(c => c.id === coach.id));
        // Chỉ chọn đúng số ghế bằng số hành khách
        return compartmentSeats.slice(0, numPassengers).map(seat => seat.id);
      }
    }

    // Nếu không có toa 6, tìm ghế liền kề trong toa khác
    for (const coach of COACHES) {
      const availableSeats = (coachSeats[coach.id] || [])
        .filter(seat => seat && seat.status === 'available');
      
      if (availableSeats.length >= numPassengers) {
        setSelectedCoachIdx(COACHES.findIndex(c => c.id === coach.id));
        return availableSeats.slice(0, numPassengers).map(seat => seat.id);
      }
    }
    
    return [];
  };

  // Chọn ghế cho nhóm lẻ (cùng toa)
  const selectSameCoachSeats = (totalSeats: number) => {
    for (const coach of COACHES) {
      const availableSeats = (coachSeats[coach.id] || [])
        .filter(seat => seat && seat.status === 'available');
      
      if (availableSeats.length >= totalSeats) {
        setSelectedCoachIdx(COACHES.findIndex(c => c.id === coach.id));
        return availableSeats.slice(0, totalSeats).map(seat => seat.id);
      }
    }
    return [];
  };

  // Chọn ghế cho nhóm lớn (chia nhóm)
  const selectMixedGroupSeats = (totalSeats: number) => {
    const selectedSeats: string[] = [];
    
    if (totalSeats === 5) {
      // Chia 4 + 1: Chọn đầy đủ 4 ghế của khoang và tìm 1 ghế gần nhất
      const group4Seats = selectGroup4Compartment(4);
      if (group4Seats.length === 4) {
        selectedSeats.push(...group4Seats);
        
        // Tìm 1 ghế gần nhất với khoang 4 giường đã chọn
        const mainCoachId = COACHES[selectedCoachIdx].id;
        const allSeats = coachSeats[mainCoachId] || [];
        const availableSeats = allSeats.filter(seat => 
          seat && seat.status === 'available' && !selectedSeats.includes(seat.id)
        );
        
        if (availableSeats.length > 0) {
          // Tính khoảng cách từ mỗi ghế available đến khoang 4 giường đã chọn
          const group4SeatIndices = group4Seats.map(seatId => 
            allSeats.findIndex(seat => seat && seat.id === seatId)
          ).filter(index => index !== -1);
          
          if (group4SeatIndices.length > 0) {
            // Tìm range của khoang 4 giường
            const minIndex = Math.min(...group4SeatIndices);
            const maxIndex = Math.max(...group4SeatIndices);
            const compartmentCenter = (minIndex + maxIndex) / 2;
            
            // Tìm ghế available gần compartment center nhất
            let nearestSeat = availableSeats[0];
            let minDistance = Math.abs(allSeats.findIndex(s => s && s.id === nearestSeat.id) - compartmentCenter);
            
            for (const seat of availableSeats) {
              const seatIndex = allSeats.findIndex(s => s && s.id === seat.id);
              const distance = Math.abs(seatIndex - compartmentCenter);
              if (distance < minDistance) {
                minDistance = distance;
                nearestSeat = seat;
              }
            }
            
            selectedSeats.push(nearestSeat.id);
          } else {
            // Fallback: chọn ghế đầu tiên nếu không tìm được khoảng cách
            selectedSeats.push(availableSeats[0].id);
          }
        }
      }
    } else if (totalSeats === 7) {
      // Chia 6 + 1: Chọn đầy đủ 6 ghế của khoang và tìm 1 ghế gần nhất
      const group6Seats = selectGroup6Compartment(6);
      if (group6Seats.length === 6) {
        selectedSeats.push(...group6Seats);
        
        // Tìm 1 ghế gần nhất với khoang 6 giường đã chọn
        const mainCoachId = COACHES[selectedCoachIdx].id;
        const allSeats = coachSeats[mainCoachId] || [];
        const availableSeats = allSeats.filter(seat => 
          seat && seat.status === 'available' && !selectedSeats.includes(seat.id)
        );
        
        if (availableSeats.length > 0) {
          // Tính khoảng cách từ mỗi ghế available đến khoang 6 giường đã chọn
          // Giả sử ghế được sắp xếp theo thứ tự trong compartment
          const group6SeatIndices = group6Seats.map(seatId => 
            allSeats.findIndex(seat => seat && seat.id === seatId)
          ).filter(index => index !== -1);
          
          if (group6SeatIndices.length > 0) {
            // Tìm range của khoang 6 giường
            const minIndex = Math.min(...group6SeatIndices);
            const maxIndex = Math.max(...group6SeatIndices);
            const compartmentCenter = (minIndex + maxIndex) / 2;
            
            // Tìm ghế available gần compartment center nhất
            let nearestSeat = availableSeats[0];
            let minDistance = Math.abs(allSeats.findIndex(s => s && s.id === nearestSeat.id) - compartmentCenter);
            
            for (const seat of availableSeats) {
              const seatIndex = allSeats.findIndex(s => s && s.id === seat.id);
              const distance = Math.abs(seatIndex - compartmentCenter);
              if (distance < minDistance) {
                minDistance = distance;
                nearestSeat = seat;
              }
            }
            
            selectedSeats.push(nearestSeat.id);
          } else {
            // Fallback: chọn ghế đầu tiên nếu không tìm được khoảng cách
            selectedSeats.push(availableSeats[0].id);
          }
        }
      }
    } else {
      // Nhóm khác: chọn cùng toa
      return selectSameCoachSeats(totalSeats);
    }
    
    return selectedSeats;
  };

  // Function chính để tự động chọn ghế
  const autoSelectSeats = () => {
    if (totalPassengers === 0) return;

    let selectedSeats: string[] = [];
    const hasChildrenOrElderly = passenger.child > 0 || passenger.elderly > 0 || passenger.nursing > 0;

    console.log('Auto selecting seats for:', {
      totalPassengers,
      hasChildrenOrElderly,
      passenger
    });

    if (hasChildrenOrElderly) {
      // Có trẻ em hoặc người già -> chọn gần toilet
      selectedSeats = selectSeatsNearToilet(totalPassengers);
      console.log('Selected seats near toilet:', selectedSeats);
    } else if (totalPassengers === 3) {
      // Nhóm 3 người (không có trẻ em/người già) -> ưu tiên khoang 4 giường nhưng chỉ chọn 3 ghế
      selectedSeats = selectGroup4Compartment(3);
      console.log('Selected 3 seats in 4-bed compartment:', selectedSeats);
    } else if (totalPassengers === 4) {
      // Nhóm 4 người -> ưu tiên khoang 4
      selectedSeats = selectGroup4Compartment(4);
      console.log('Selected group 4 compartment:', selectedSeats);
    } else if (totalPassengers === 5) {
      // Nhóm 5 người (không có trẻ em/người già) -> ưu tiên khoang 6 giường nhưng chỉ chọn 5 ghế
      selectedSeats = selectGroup6Compartment(5);
      console.log('Selected 5 seats in 6-bed compartment:', selectedSeats);
    } else if (totalPassengers === 6) {
      // Nhóm 6 người -> ưu tiên khoang 6
      selectedSeats = selectGroup6Compartment(6);
      console.log('Selected group 6 compartment:', selectedSeats);
    } else if (totalPassengers === 7) {
      // Nhóm 7 người (không có trẻ em/người già) -> ưu tiên khoang 6 giường + 1 ghế kế bên
      selectedSeats = selectMixedGroupSeats(totalPassengers);
      console.log('Selected 6+1 arrangement for 7 people:', selectedSeats);
    } else {
      // Các trường hợp khác -> chọn cùng toa
      selectedSeats = selectSameCoachSeats(totalPassengers);
      console.log('Selected default seats:', selectedSeats);
    }

    if (selectedSeats.length > 0) {
      setSelectedSeatIds(selectedSeats);
      
      // Hiển thị thông báo về chiến lược đã áp dụng
      const message = hasChildrenOrElderly 
        ? `🎯 Auto-selected ${selectedSeats.length} seats near toilet for children/elderly comfort.`
        : totalPassengers === 3
        ? `🎯 Auto-selected 4-bed compartment for your group of 3.`
        : totalPassengers === 4
        ? `🎯 Auto-selected 4-bed compartment for your group.`
        : totalPassengers === 5
        ? `🎯 Auto-selected 6-bed compartment for your group of 5.`
        : totalPassengers === 6
        ? `🎯 Auto-selected 6-bed compartment for your group.`
        : totalPassengers === 7
        ? `🎯 Auto-selected 6-bed compartment + 1 adjacent seat for your group of 7.`
        : `🎯 Auto-selected ${selectedSeats.length} seats with optimal arrangement.`;
      
      setAutoSelectMessage(message);
      
      // Xóa thông báo sau 5 giây
      setTimeout(() => {
        setAutoSelectMessage('');
      }, 5000);
    } else {
      setAutoSelectMessage('❌ Unable to find optimal seat arrangement. Please select seats manually.');
      setTimeout(() => {
        setAutoSelectMessage('');
      }, 3000);
    }
  };

  // ==================== END AUTO SEAT SELECTION LOGIC ====================

  const handleSeatSelect = (seatId: string) => {
    const seat = coachSeats[COACHES[selectedCoachIdx].id]?.find(s => s.id === seatId);
    if (!seat || seat.status !== 'available') return;
    
    // Kiểm tra quy tắc Family cabin
    const currentCoach = COACHES[selectedCoachIdx];
    const isFamilyCabin = currentCoach.type.includes('Family');
    
          if (isFamilyCabin) {
        // Kiểm tra số lượng hành khách cho Family cabin
        if (totalPassengers < 2) {
          setShowFamilyWarningModal(true);
          return;
        }
        
        // Kiểm tra nếu đang chọn ghế trong Family cabin
        const selectedSeatsInFamilyCabin = selectedSeatIds.filter(id => {
          const parts = id.split('-');
          const coachId = parseInt(parts[0]);
          return coachId === currentCoach.id;
        });
        
        // Nếu đã chọn ghế trong Family cabin, chỉ cho phép chọn thêm ghế cùng level hoặc bỏ chọn ghế đã chọn
        if (selectedSeatsInFamilyCabin.length > 0) {
          // Kiểm tra xem có phải đang bỏ chọn ghế không
          const isUnselecting = selectedSeatIds.includes(seatId);
          if (!isUnselecting) {
            // Nếu đã có 2 ghế được chọn trong Family cabin, không cho phép chọn thêm
            if (selectedSeatsInFamilyCabin.length >= 2) {
              setShowLevelWarningModal(true);
              return;
            }
            
            // Kiểm tra xem ghế mới có cùng level với ghế đã chọn không
            const selectedSeatId = selectedSeatsInFamilyCabin[0];
            const selectedSeatParts = selectedSeatId.split('-');
            const selectedSeatNumber = parseInt(selectedSeatParts[1]);
            
            const newSeatParts = seatId.split('-');
            const newSeatNumber = parseInt(newSeatParts[1]);
            
            // Tính level dựa trên loại coach
            let selectedSeatLevel, newSeatLevel;
            if (currentCoach.type === '4-berth Family cabin') {
              // Coach 4: 4 ghế/compartment, 2 levels
              selectedSeatLevel = Math.floor((selectedSeatNumber - 1) % 4 / 2) + 1;
              newSeatLevel = Math.floor((newSeatNumber - 1) % 4 / 2) + 1;
            } else if (currentCoach.type === '6-berth Family cabin') {
              // Coach 5: 6 ghế/compartment, 3 levels
              selectedSeatLevel = Math.floor((selectedSeatNumber - 1) % 6 / 2) + 1;
              newSeatLevel = Math.floor((newSeatNumber - 1) % 6 / 2) + 1;
            } else {
              // Fallback cho các coach khác
              selectedSeatLevel = Math.floor((selectedSeatNumber - 1) % 6 / 2) + 1;
              newSeatLevel = Math.floor((newSeatNumber - 1) % 6 / 2) + 1;
            }
            
            if (selectedSeatLevel !== newSeatLevel) {
              // Hiển thị thông báo lỗi
              setShowLevelWarningModal(true);
              return;
            }
            
            console.log('Adding another berth to family cabin booking - same level');
          }
        }
        
        // Nếu đây là ghế đầu tiên được chọn trong Family cabin, tự động chọn thêm 1 ghế nữa
        if (selectedSeatsInFamilyCabin.length === 0) {
          const seatParts = seatId.split('-');
          const seatNumber = parseInt(seatParts[1]);
          
          // Tìm ghế cùng compartment
          let compartment, compartmentStart, compartmentEnd, seatLevel;
          if (currentCoach.type === '4-berth Family cabin') {
            // Coach 4: 4 ghế/compartment
            compartment = Math.floor((seatNumber - 1) / 4) + 1;
            compartmentStart = (compartment - 1) * 4 + 1;
            compartmentEnd = compartment * 4;
            seatLevel = Math.floor((seatNumber - 1) % 4 / 2) + 1; // Level 1 hoặc 2
          } else if (currentCoach.type === '6-berth Family cabin') {
            // Coach 5: 6 ghế/compartment
            compartment = Math.floor((seatNumber - 1) / 6) + 1;
            compartmentStart = (compartment - 1) * 6 + 1;
            compartmentEnd = compartment * 6;
            seatLevel = Math.floor((seatNumber - 1) % 6 / 2) + 1; // Level 1, 2 hoặc 3
          } else {
            // Fallback cho các coach khác
            compartment = Math.floor((seatNumber - 1) / 6) + 1;
            compartmentStart = (compartment - 1) * 6 + 1;
            compartmentEnd = compartment * 6;
            seatLevel = Math.floor((seatNumber - 1) % 6 / 2) + 1;
          }
          
          // Tìm ghế trống khác trong cùng compartment, ưu tiên ghế nằm ngang
          const availableSeatsInCompartment: Array<{seatId: string; isSameLevel: boolean; seatNumber: number}> = [];
          
          for (let i = compartmentStart; i <= compartmentEnd; i++) {
            const otherSeatId = `${currentCoach.id}-${i}`;
            const otherSeat = coachSeats[currentCoach.id]?.find(s => s.id === otherSeatId);
            if (otherSeat && otherSeat.status === 'available' && otherSeatId !== seatId) {
              let otherSeatLevel;
              if (currentCoach.type === '4-berth Family cabin') {
                otherSeatLevel = Math.floor((i - 1) % 4 / 2) + 1;
              } else if (currentCoach.type === '6-berth Family cabin') {
                otherSeatLevel = Math.floor((i - 1) % 6 / 2) + 1;
              } else {
                otherSeatLevel = Math.floor((i - 1) % 6 / 2) + 1;
              }
              const isSameLevel = otherSeatLevel === seatLevel;
              
              availableSeatsInCompartment.push({
                seatId: otherSeatId,
                isSameLevel,
                seatNumber: i
              });
            }
          }
          
          // Nếu có ghế trống, ưu tiên chọn ghế cùng level
          if (availableSeatsInCompartment.length > 0) {
            // Sắp xếp: ghế cùng level trước, sau đó theo số thứ tự
            availableSeatsInCompartment.sort((a, b) => {
              if (a.isSameLevel && !b.isSameLevel) return -1;
              if (!a.isSameLevel && b.isSameLevel) return 1;
              return a.seatNumber - b.seatNumber;
            });
            
            const autoSelectSeatId = availableSeatsInCompartment[0].seatId;
            setSelectedSeatIds(prev => {
              const newSelected = [...prev, seatId, autoSelectSeatId];
              return newSelected;
            });
            return;
          }
        }
      }
    
    setSelectedSeatIds(prev => {
      const newSelected = [...prev];
      const idx = newSelected.indexOf(seatId);
      
      if (idx > -1) {
        // Bỏ chọn ghế
        newSelected.splice(idx, 1);
      } else {
        // Chọn ghế mới - thay thế ghế cũ nếu đã đủ số lượng
        if (newSelected.length >= totalPassengers) {
          // Thay thế ghế đầu tiên bằng ghế mới
          newSelected[0] = seatId;
        } else {
          // Thêm ghế mới
          newSelected.push(seatId);
        }
      }
      
      return newSelected;
    });
  };

  // Chuyển sang nhập thông tin hành khách
  const handleProceedToPassengerInfo = () => {
    if (selectedSeatIds.length === 0 || selectedSeatIds.length < totalPassengers) return;
    const seatParams = selectedSeatIds.join(',');
    const totalPrice = selectedSeatIds.reduce((total, seatId) => {
      const seat = Object.values(coachSeats).flat().find(s => s.id === seatId);
      return total + (seat?.price || 0);
    }, 0);
    // Lưu ticketInfo vào localStorage để các bước sau dùng lại
    localStorage.setItem('ticketInfo', JSON.stringify({
      trainId: searchParams.get('trainId'),
      trainName: searchParams.get('trainName'),
      selectedSeats: seatParams,
      totalPrice,
      from,
      to,
      departDate,
      returnDate: searchParams.get('returnDate'),
      isRoundTrip: searchParams.get('isRoundTrip') === 'true',
      passenger,
      totalPassengers
    }));
    // Điều hướng sang trang nhập thông tin hành khách
    const params = new URLSearchParams();
    if (searchParams.get('trainId')) params.append('trainId', searchParams.get('trainId') || '');
    if (searchParams.get('trainName')) params.append('trainName', searchParams.get('trainName') || '');
    if (seatParams) params.append('selectedSeats', seatParams);
    params.append('totalPrice', totalPrice.toString());
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    if (departDate) params.append('departDate', departDate);
    if (searchParams.get('returnDate')) params.append('returnDate', searchParams.get('returnDate') || '');
    params.append('isRoundTrip', searchParams.get('isRoundTrip') || 'false');
    params.append('passenger', JSON.stringify(passenger));
    navigate(`/passenger-info?${params.toString()}`);
  };

  // Lấy mã tàu, loại bỏ chữ 'Tàu' nếu có
  let trainName = searchParams.get('trainName') || 'SE?';
  trainName = trainName.replace(/^Tàu\s*/i, '');

  // ====== SALESFORCE-STYLE FILTERING SYSTEM ======
  // State cho bộ lọc nâng cao (Salesforce-style)
  const [filterMinPrice, setFilterMinPrice] = useState(100000);
  const [filterMaxPrice, setFilterMaxPrice] = useState(2000000);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [filteredSeatIds, setFilteredSeatIds] = useState<string[]>([]);
  const [filterDebounceTimer, setFilterDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Salesforce-style Record Type filtering - Default to none selected
  const [selectedRecordTypes, setSelectedRecordTypes] = useState<string[]>([]);
  
  // Salesforce-style Priority Preference
  const [priorityPreference, setPriorityPreference] = useState<'all' | 'high_only'>('all');
  
  // Noise Level filter
  const [selectedNoiseLevel, setSelectedNoiseLevel] = useState<'quiet' | 'noise' | 'kidzone' | null>(null);


  React.useEffect(() => {
    console.log('🔄 Selected Record Types changed:', selectedRecordTypes);
  }, [selectedRecordTypes]);

  React.useEffect(() => {
    console.log('🔄 Priority Preference changed:', priorityPreference);
  }, [priorityPreference]);

  React.useEffect(() => {
    console.log('🔄 Filter active state changed:', isFilterActive);
  }, [isFilterActive]);

  // Debug logging for coachSeats changes
  React.useEffect(() => {
    console.log('🚂 CoachSeats data changed:');
    console.log('Available coaches:', Object.keys(coachSeats));
    Object.keys(coachSeats).forEach(coachIdStr => {
      const coachId = parseInt(coachIdStr);
      console.log(`Coach ${coachId}: ${coachSeats[coachId]?.length || 0} seats`);
    });
  }, [coachSeats]);

  // Debug logging for seats data changes  
  React.useEffect(() => {
    console.log('💺 Seats data changed:', seats.length, 'seats total');
    if (seats.length > 0) {
      console.log('💺 Sample seat structure:', seats[0]);
      console.log('💺 Sample seat properties:', Object.keys(seats[0]));
      // Log seats from different coaches to see structure variety
      const seatsByCoach: Record<string, LocalSeat[]> = {};
      seats.forEach(seat => {
        const coachId = (seat as LocalSeat & { coachId?: string; coach?: string }).coachId || 
                       (seat as LocalSeat & { coachId?: string; coach?: string }).coach || 
                       seat.id?.split('-')[1];
        if (!seatsByCoach[coachId]) seatsByCoach[coachId] = [];
        seatsByCoach[coachId].push(seat);
      });
      console.log('💺 Seats grouped by coach:', Object.keys(seatsByCoach).map(coachId => 
        `Coach ${coachId}: ${seatsByCoach[coachId].length} seats`
      ));
      
      // Log sample seats from different coach types
      if (seatsByCoach['1']) console.log('💺 Coach 1 sample seat (should be seating):', seatsByCoach['1'][0]);
      if (seatsByCoach['3']) console.log('💺 Coach 3 sample seat (should be k6):', seatsByCoach['3'][0]);
      if (seatsByCoach['6']) console.log('💺 Coach 6 sample seat (should be k4):', seatsByCoach['6'][0]);
    }
  }, [seats]);

  // Record Type Configuration (updated to match PriceFilter.tsx)
  const recordTypeConfig = {
    standard: {
      label: 'Ghế ngồi',
      description: 'Ghế ngồi thường (toa 1, 2)',
      criteria: {
        seatTypes: ['seat'],
        noiseLevel: ['quiet', 'social'],
        coachPosition: [1, 2], // Toa 1-2: Ghế ngồi
        priorityScore: 1
      }
    },
    medium_priority: {
      label: '6 giường 1 cabin',
      description: 'Cabin ngủ 6 giường (toa 5, 6, 7)',
      criteria: {
        seatTypes: ['compartment_6'],
        noiseLevel: ['quiet', 'social', 'kidzone'],
        coachPosition: [5, 6, 7], // Toa 5,6,7: 6 giường 1 cabin
        priorityScore: 2
      }
    },
    high_priority: {
      label: '4 giường 1 cabin',
      description: 'Cabin ngủ 4 giường (toa 4, 8, 9, 10)',
      criteria: {
        seatTypes: ['compartment_4'],
        noiseLevel: ['quiet', 'social', 'kidzone'], // Toa 4 cũng hỗ trợ kidzone
        coachPosition: [4, 8, 9, 10], // Toa 4,8,9,10: 4 giường 1 cabin
        priorityScore: 3
      }
    },
    two_berth: {
      label: '2 giường 1 cabin',
      description: 'Cabin ngủ 2 giường (toa 3)',
      criteria: {
        seatTypes: ['compartment_2'],
        noiseLevel: ['quiet', 'social', 'kidzone'], // Toa 3 hỗ trợ kidzone
        coachPosition: [3], // Toa 3: 2 giường 1 cabin
        priorityScore: 4
      }
    }
  };

  // Legacy compatibility state (để giữ tương thích với code cũ)
  const [behavior] = useState<'quiet' | 'noise' | 'kidzone' | null>(null);
  const [seatTypeFilters] = useState({
    seat: true,
    compartment_4: true,
    compartment_6: true
  });

  // Salesforce-style priority scoring function
  const getPriorityScore = (seat: LocalSeat): number => {
    let score = 0;
    
    // Noise level scoring (decreases by coach position as requested)
    const coachId = COACHES[selectedCoachIdx].id;
    if (seat.behavior === 'quiet') {
      score += Math.max(0, 11 - coachId); // Decreasing noise by coach position
    } else if (seat.behavior === 'social') {
      score += Math.max(0, coachId - 1); // Increasing noise by coach position
    } else if (seat.behavior === 'kidzone') {
      score += 15; // Special scoring for kidzone (family-friendly areas)
    }
    
    // Seat type scoring
    if (seat.id.includes('-k2-')) score += 35; // 2-berth cabin (highest priority)
    else if (seat.id.includes('-k4-')) score += 30; // 4-berth cabin (high priority)
    else if (seat.id.includes('-k6-')) score += 20; // 6-berth cabin (medium priority)
    else if (seat.id.includes('-ngoi-')) score += 10; // Seat (standard priority)
    
    // Comfort factors
    if (!seat.nearWC) score += 5; // Bonus for not being near toilet
    if (seat.nearSimilarBehavior) score += 3; // Bonus for being near similar behavior passengers
    
    return score;
  };

  // Function to check if seat matches Record Type criteria
  const matchesRecordTypeCriteria = (seat: LocalSeat, recordType: string): boolean => {
    const config = recordTypeConfig[recordType as keyof typeof recordTypeConfig];
    if (!config) {
      console.log(`⚠️ No config found for record type: ${recordType}`);
      return false;
    }
    
    const coachId = COACHES[selectedCoachIdx].id;
    console.log(`🔍 Checking seat ${seat.id} against ${recordType} for coach ${coachId}`);
    
    // Check coach position criteria
    if (!config.criteria.coachPosition.includes(coachId)) {
      console.log(`❌ Coach ${coachId} not in allowed positions:`, config.criteria.coachPosition);
      return false;
    }
    console.log(`✅ Coach ${coachId} matches position criteria`);
    
    // Check seat type criteria - improved logic with better detection
    let seatTypeMatches = false;
    
    // Debug: First let's see what the actual seat object looks like
    console.log(`🔍 DEBUGGING SEAT OBJECT:`, JSON.stringify(seat, null, 2));
    
    // Determine actual seat type from multiple sources
    let actualSeatType = '';
    
    // Method 1: Check seat ID patterns
    if (seat.id.includes('-ngoi-') || seat.id.includes('ngoi')) {
      actualSeatType = 'seat';
    } else if (seat.id.includes('-k2-') || seat.id.includes('k2')) {
      actualSeatType = 'compartment_2';
    } else if (seat.id.includes('-k4-') || seat.id.includes('k4')) {
      actualSeatType = 'compartment_4';
    } else if (seat.id.includes('-k6-') || seat.id.includes('k6')) {
      actualSeatType = 'compartment_6';
    }
    
    // Method 2: If ID pattern fails, determine by coach position (more reliable)
    if (!actualSeatType) {
      if (coachId === 1 || coachId === 2) {
        actualSeatType = 'seat'; // Toa 1-2: Ghế ngồi
      } else if (coachId === 3) {
        actualSeatType = 'compartment_2'; // Toa 3: 2 giường 1 cabin
      } else if (coachId === 4 || coachId === 8 || coachId === 9 || coachId === 10) {
        actualSeatType = 'compartment_4'; // Toa 4,8,9,10: 4 giường 1 cabin
      } else if (coachId === 5 || coachId === 6 || coachId === 7) {
        actualSeatType = 'compartment_6'; // Toa 5,6,7: 6 giường 1 cabin
      }
    }
    
    console.log(`🪑 Seat ${seat.id} determined type: ${actualSeatType} (Coach ${coachId})`);
    console.log(`📋 Record type ${recordType} allows:`, config.criteria.seatTypes);
    
    // Check if actual seat type is in the allowed types for this record type
    seatTypeMatches = config.criteria.seatTypes.includes(actualSeatType);
    
    if (!seatTypeMatches) {
      console.log(`❌ Seat type ${actualSeatType} not allowed for ${recordType}`);
      return false;
    }
    console.log(`✅ Seat type ${actualSeatType} matches criteria`);
    
    // Check noise level criteria (if behavior filter is applied)
    if (behavior) {
      const noiseLevel = behavior === 'quiet' ? 'quiet' : behavior === 'noise' ? 'social' : 'kidzone';
      console.log(`🔊 Checking noise level: ${noiseLevel} against allowed:`, config.criteria.noiseLevel);
      if (!config.criteria.noiseLevel.includes(noiseLevel)) {
        console.log(`❌ Noise level ${noiseLevel} not allowed for ${recordType}`);
        return false;
      }
      console.log(`✅ Noise level ${noiseLevel} matches criteria`);
    }
    
    console.log(`🎉 Seat ${seat.id} PASSES all criteria for ${recordType}`);
    return true;
  };

  // Salesforce-style Record Type filtering
  const filterRecordsByType = (seats: LocalSeat[]): LocalSeat[] => {
    console.log('🏷️ Starting Record Type filtering...');
    console.log('Selected Record Types:', selectedRecordTypes);
    console.log('Total seats to filter:', seats.length);
    
    if (selectedRecordTypes.length === 0) {
      console.log('⚠️ No record types selected, returning empty array (user must select at least one type)');
      return [];
    }
    
    const filtered = seats.filter(seat => {
      console.log(`\n--- Checking seat ${seat.id} ---`);
      
      const matchesAnyType = selectedRecordTypes.some(recordType => {
        console.log(`Testing against ${recordType}...`);
        const matches = matchesRecordTypeCriteria(seat, recordType);
        console.log(`Result for ${recordType}:`, matches ? '✅ MATCH' : '❌ NO MATCH');
        return matches;
      });
      
      console.log(`Final result for seat ${seat.id}:`, matchesAnyType ? '🎯 INCLUDED' : '🚫 EXCLUDED');
      return matchesAnyType;
    });
    
    console.log(`\n📊 Record Type filtering results: ${filtered.length}/${seats.length} seats passed`);
    return filtered;
  };

  // Salesforce-style Priority Preference filtering
  const filterRecordsByPriority = (seats: LocalSeat[]): LocalSeat[] => {
    console.log('🎯 Starting Priority Preference filtering...');
    console.log('Priority Preference:', priorityPreference);
    console.log('Input seats:', seats.length);
    
    if (priorityPreference === 'all') {
      console.log('✅ Priority = "all", returning all seats');
      return seats;
    }
    
    if (priorityPreference === 'high_only') {
      // Only show high priority seats (score >= threshold)
      const threshold = 25; // Adjustable threshold
      console.log(`🔍 Filtering for high priority only (score >= ${threshold})`);
      
      const filtered = seats.filter(seat => {
        const score = getPriorityScore(seat);
        const passes = score >= threshold;
        console.log(`Seat ${seat.id}: score=${score}, passes=${passes}`);
        return passes;
      });
      
      console.log(`📊 Priority filtering results: ${filtered.length}/${seats.length} seats are high priority`);
      return filtered;
    }
    
    console.log('⚠️ Unknown priority preference, returning all seats');
    return seats;
  };
  const allPrices = Object.values(coachSeats).flat().map(s => s.price).filter(Boolean);
  const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : 100000;
  const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 2000000;
  // Khởi tạo giá trị filter dựa trên dữ liệu thực tế
  useEffect(() => {
    if (allPrices.length > 0) {
      const realMinPrice = Math.min(...allPrices);
      const realMaxPrice = Math.max(...allPrices);
      setFilterMinPrice(realMinPrice);
      setFilterMaxPrice(realMaxPrice);
    }
  }, [allPrices, setFilterMinPrice, setFilterMaxPrice]);
  
  // Debounced filter update khi user kéo slider
  const handlePriceRangeChange = (value: number | number[]) => {
    if (Array.isArray(value) && value.length === 2) {
      const [min, max] = value;
      
      // Validate: min_price <= max_price
      if (min <= max) {
        setFilterMinPrice(min);
        setFilterMaxPrice(max);
        
        // Clear existing timer
        if (filterDebounceTimer) {
          clearTimeout(filterDebounceTimer);
        }
        
        // Set new debounced timer (300ms) - chỉ khi filter đang active
        if (isFilterActive) {
          const timer = setTimeout(() => {
            triggerFilterUpdate(min, max, behavior, seatTypeFilters);
          }, 300);
          
          setFilterDebounceTimer(timer);
        }
      }
    }
  };
  

  
  // Salesforce-style trigger filter update function
  const triggerFilterUpdate = (minPrice: number, maxPrice: number, behaviorFilter: 'quiet' | 'noise' | 'kidzone' | null, seatTypes: typeof seatTypeFilters) => {
    if (!isFilterActive) return;
    
    console.log('Salesforce-style auto-filtering with:', {
      recordTypes: selectedRecordTypes,
      priorityPreference,
      priceRange: [minPrice, maxPrice],
      behavior: behaviorFilter,
      seatTypes
    });
    
    applyFilters(minPrice, maxPrice, behaviorFilter, seatTypes);
  };

  // Histogram cho biểu đồ cột mật độ giá
  const BIN_COUNT = 20;
  const binWidth = maxPrice > minPrice ? (maxPrice - minPrice) / BIN_COUNT : 1;
  const bins = Array(BIN_COUNT).fill(0);
  allPrices.forEach(price => {
    const idx = Math.min(
      BIN_COUNT - 1,
      Math.floor((price - minPrice) / binWidth)
    );
    bins[idx]++;
  });
  // const maxBin = Math.max(...bins, 1); // Removed unused variable

  // Salesforce-style filter application function
  const applyFilters = (minPrice: number, maxPrice: number, behaviorFilter: 'quiet' | 'noise' | 'kidzone' | null, seatTypes: typeof seatTypeFilters) => {
    console.log('\n🚀 ===== STARTING SALESFORCE-STYLE FILTERING =====');
    console.log('Filter parameters:', {
      selectedRecordTypes,
      priorityPreference,
      priceRange: [minPrice, maxPrice],
      behavior: behaviorFilter,
      seatTypes
    });

    const allFilteredSeats: LocalSeat[] = [];
    let bestCoachInfo: { id: number | null; seats: LocalSeat[]; seatCount: number; avgScore: number } = { id: null, seats: [], seatCount: 0, avgScore: 0 };

    // Lặp qua TẤT CẢ các toa để tìm ghế tốt nhất
    Object.keys(coachSeats).forEach(coachIdStr => {
      const coachId = Number(coachIdStr);
      const currentCoachSeats = coachSeats[coachId] || [];
      
      if (currentCoachSeats.length === 0) return;

      // Special logic for noise level filtering: only check relevant coaches
      if (behaviorFilter === 'kidzone' && ![3, 4, 5].includes(coachId)) {
        console.log(`⏭️ Skipping Coach ${coachId} - kidzone filter only applies to coaches 3, 4, 5`);
        return;
      }
      
      if (behaviorFilter === 'quiet' && ![1, 2, 6, 7, 8, 9, 10].includes(coachId)) {
        console.log(`⏭️ Skipping Coach ${coachId} - quiet filter only applies to coaches with quiet zones`);
        return;
      }
      
      if (behaviorFilter === 'noise' && ![1, 2, 6, 7, 8, 9, 10].includes(coachId)) {
        console.log(`⏭️ Skipping Coach ${coachId} - noise filter only applies to coaches with social zones`);
        return;
      }

      console.log(`\n📍 Checking Coach ${coachId} with ${currentCoachSeats.length} total seats`);
      
      // Step 1: Apply Record Type filtering (Salesforce-style)
      console.log(`\n📋 STEP 1: Record Type Filtering for Coach ${coachId}`);
      let filtered = filterRecordsByType(currentCoachSeats);
      console.log(`After Record Type filtering: ${filtered.length} seats remain in Coach ${coachId}`);
      
      if (filtered.length === 0) return;
      
      // Step 2: Apply Priority Preference filtering
      console.log(`\n🎯 STEP 2: Priority Preference Filtering for Coach ${coachId}`);
      filtered = filterRecordsByPriority(filtered);
      console.log(`After Priority filtering: ${filtered.length} seats remain in Coach ${coachId}`);
      
      if (filtered.length === 0) return;
      
      // Step 3: Apply price range filtering
      console.log(`\n💰 STEP 3: Price Range Filtering for Coach ${coachId}`);
      const beforePriceCount = filtered.length;
      filtered = filtered.filter(seat => {
        const inRange = seat.price >= minPrice && seat.price <= maxPrice;
        return inRange;
      });
      console.log(`After Price filtering: ${filtered.length}/${beforePriceCount} seats remain in Coach ${coachId}`);
      
      if (filtered.length === 0) return;
      
      // Step 4: Apply behavior filtering (if specified)
      if (behaviorFilter) {
        console.log(`\n🔊 STEP 4: Behavior Filtering for Coach ${coachId} (Looking for: ${behaviorFilter})`);
        const beforeBehaviorCount = filtered.length;
        
        // Log seat behaviors in this coach
        console.log(`Coach ${coachId} seat behaviors:`, filtered.map(seat => `${seat.id}: ${seat.behavior}`));
        
        filtered = filtered.filter(seat => {
          if (behaviorFilter === 'quiet') {
            return seat.behavior === 'quiet';
          } else if (behaviorFilter === 'noise') {
            return seat.behavior === 'social';
          } else if (behaviorFilter === 'kidzone') {
            console.log(`Checking seat ${seat.id} in coach ${coachId}: behavior=${seat.behavior}, isKidzone=${seat.behavior === 'kidzone'}`);
            return seat.behavior === 'kidzone';
          }
          return true;
        });
        console.log(`After Behavior filtering: ${filtered.length}/${beforeBehaviorCount} seats remain in Coach ${coachId}`);
        
        // If kidzone filter and no seats found in this coach, explain why
        if (behaviorFilter === 'kidzone' && filtered.length === 0 && beforeBehaviorCount > 0) {
          console.log(`❌ Coach ${coachId} has no kidzone seats. Expected only coaches 3,4,5 to have kidzone behavior.`);
        }
      }
      
      // Step 5: Legacy seat type filtering (for backward compatibility)
      console.log(`\n🪑 STEP 5: Legacy Seat Type Filtering for Coach ${coachId}`);
      if (!seatTypes.seat || !seatTypes.compartment_4 || !seatTypes.compartment_6) {
        const beforeLegacyCount = filtered.length;
        filtered = filtered.filter(seat => {
          let seatTypeMatch = false;
          if (seatTypes.seat && seat.id.includes('-ngoi-')) {
            seatTypeMatch = true;
          }
          if (seatTypes.compartment_4 && seat.id.includes('-k4-')) {
            seatTypeMatch = true;
          }
          if (seatTypes.compartment_6 && seat.id.includes('-k6-')) {
            seatTypeMatch = true;
          }
          return seatTypeMatch;
        });
        console.log(`After Legacy filtering: ${filtered.length}/${beforeLegacyCount} seats remain in Coach ${coachId}`);
      }
      
      // Step 6: Only show available seats
      console.log(`\n✅ STEP 6: Availability Filtering for Coach ${coachId}`);
      const beforeAvailabilityCount = filtered.length;
      filtered = filtered.filter(seat => {
        const isAvailable = seat.status === 'available';
        if (!isAvailable) {
          console.log(`Seat ${seat.id}: status is ${seat.status}, not available`);
        }
        return isAvailable;
      });
      console.log(`After Availability filtering: ${filtered.length}/${beforeAvailabilityCount} seats remain in Coach ${coachId}`);
      
      if (filtered.length === 0) return;
      
      // Sort by priority score (highest first)
      console.log(`\n📊 STEP 7: Priority Sorting for Coach ${coachId}`);
      filtered.sort((a, b) => {
        const scoreA = getPriorityScore(a);
        const scoreB = getPriorityScore(b);
        return scoreB - scoreA;
      });
      
      // Tính điểm trung bình của toa
      const avgScore = filtered.reduce((sum, seat) => sum + getPriorityScore(seat), 0) / filtered.length;
      
      // Thêm ghế vào danh sách tổng
      allFilteredSeats.push(...filtered.map(seat => ({ ...seat, coachId })));
      
      // Kiểm tra xem đây có phải toa tốt nhất không
      if (filtered.length > bestCoachInfo.seatCount || 
          (filtered.length === bestCoachInfo.seatCount && avgScore > bestCoachInfo.avgScore)) {
        bestCoachInfo = {
          id: coachId,
          seats: filtered,
          seatCount: filtered.length,
          avgScore: avgScore
        };
      }
      
      console.log(`🎉 Coach ${coachId} final results: ${filtered.length} seats, avg score: ${avgScore.toFixed(1)}`);
    });

    // Sắp xếp tất cả ghế theo priority score
    allFilteredSeats.sort((a, b) => getPriorityScore(b) - getPriorityScore(a));
    
    setFilteredSeatIds(allFilteredSeats.map(seat => seat.id));
    
    console.log('\n🎉 ===== FILTERING COMPLETE =====');
    console.log(`Total results: ${allFilteredSeats.length} seats match all criteria across all coaches`);
    console.log(`Best coach: ${bestCoachInfo.id} with ${bestCoachInfo.seatCount} seats`);
    
    if (allFilteredSeats.length > 0 && bestCoachInfo.id) {
      // TỰ ĐỘNG CHUYỂN ĐẾN TOA TỐT NHẤT
      const currentCoachId = COACHES[selectedCoachIdx].id;
      if (bestCoachInfo.id !== currentCoachId) {
        console.log(`🚂 Auto-switching from Coach ${currentCoachId} to Coach ${bestCoachInfo.id}`);
        
        // Tìm index của coach tốt nhất
        const bestCoachIndex = COACHES.findIndex(coach => coach.id === bestCoachInfo.id);
        if (bestCoachIndex !== -1) {
          setSelectedCoachIdx(bestCoachIndex);
          
          // Hiển thị thông báo - bỏ alert khi kéo slider
          // alert(`🎯 Tìm thấy ${allFilteredSeats.length} ghế phù hợp! Đã chuyển đến Toa ${bestCoachInfo.id} có ${bestCoachInfo.seatCount} ghế tốt nhất.`);
        }
      } else {
        // alert(`🎯 Tìm thấy ${allFilteredSeats.length} ghế phù hợp trong toa hiện tại!`);
      }
      
      // Display results with Salesforce-style messaging
      const message = `✅ Found ${allFilteredSeats.length} records matching criteria across all coaches`;
      showToast(message, '#4caf50');
    } else {
      // Không tìm thấy ghế nào
      const message = `❌ No records found. Try adjusting Record Types or Priority Preferences.`;
      showToast(message, '#f44336');
      // alert('❌ Không tìm thấy ghế nào phù hợp với tiêu chí lọc trong toàn bộ tàu.');
    }
    
    console.log('Filter summary:', {
      recordTypes: selectedRecordTypes,
      priorityPreference,
      priceRange: [minPrice, maxPrice],
      behavior: behaviorFilter,
      seatTypes,
      matchedSeats: allFilteredSeats.length,
      bestCoach: bestCoachInfo.id
    });
    
    return allFilteredSeats.length;
  };

  // Salesforce-style filter handler function
  const handleFilterSeats = () => {
    console.log('🚨🚨🚨 FILTER BUTTON CLICKED! 🚨🚨🚨');
    
    console.log('=== SALESFORCE-STYLE RECORD FILTER CLICKED ===');
    console.log('Current filter settings:', {
      recordTypes: selectedRecordTypes,
      priorityPreference,
      priceRange: [filterMinPrice, filterMaxPrice],
      noiseLevel: selectedNoiseLevel,
      behavior,
      seatTypeFilters
    });
    
    console.log('🔍 Available coach seats:', coachSeats);
    console.log('🎯 Selected coach index:', selectedCoachIdx);
    console.log('🏠 Current coach data:', COACHES[selectedCoachIdx]);
    
    // Validate Record Types selection
    if (selectedRecordTypes.length === 0) {
      console.log('⚠️ ERROR: No Record Types selected!');
      showToast('⚠️ Please select at least one Record Type', '#ff9800');
      return;
    }
    
    console.log('✅ Record Types validation passed');
    
    // Activate filter
    setIsFilterActive(true);
    console.log('🔥 Filter activated, calling applyFilters...');
    
    // Apply Salesforce-style filtering
    const matchCount = applyFilters(filterMinPrice, filterMaxPrice, selectedNoiseLevel, seatTypeFilters);
    
    // Log results with Salesforce-style terminology
    console.log(`🎉 Salesforce-style Record Filter applied successfully. Found ${matchCount} matching records.`);
    
    // Show popup instead of alert
    setFilterResultMessage(`Filter complete! Found ${matchCount} matching records.`);
    setShowFilterResult(true);
  };
  

  
  // Hàm hiển thị toast
  const showToast = (message: string, color: string) => {
    const toastDiv = document.createElement('div');
    toastDiv.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: ${color};
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      animation: slideDown 0.3s ease;
    `;
    toastDiv.textContent = message;
    document.body.appendChild(toastDiv);
    
    setTimeout(() => {
      if (document.body.contains(toastDiv)) {
        document.body.removeChild(toastDiv);
      }
    }, 3000);
  };


  
    // State cho filter result popup
  const [showFilterResult, setShowFilterResult] = useState(false);
  const [filterResultMessage, setFilterResultMessage] = useState('');
  


  // State cho popup cảnh báo chọn ghế gần nhà vệ sinh
  const [showWcSuggest, setShowWcSuggest] = useState(false);

  // Khi trang load, nếu có trẻ em hoặc người cao tuổi thì hiện popup
  useEffect(() => {
    if ((passenger.child > 0 || passenger.elderly > 0 || passenger.nursing > 0)) {
      setShowWcSuggest(true);
    }
  }, [passenger.child, passenger.elderly, passenger.nursing]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scrollText {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      ` }} />
      <div style={{ maxWidth: 480, margin: '0 auto', background: '#f7f7fa', minHeight: '100vh', paddingBottom: 120 }}>
      {/* Header + Stepper */}
      <div style={{ background: '#1976d2', color: '#fff', padding: 16, borderRadius: '0 0 16px 16px', marginBottom: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>{from} → {to}</div>
        <div style={{ fontSize: 14, margin: '2px 0 6px 0' }}>{departDate} • {totalPassengers} passenger(s)</div>
        <div style={{ display: 'flex', gap: 8, fontSize: 13, marginTop: 2 }}>
          <span style={{ fontWeight: 700, color: '#fff', background: '#1565c0', borderRadius: 8, padding: '2px 8px' }}>1 Select seat</span>
          <span style={{ color: '#bbdefb' }}>→</span>
          <span style={{ color: '#bbdefb' }}>2 Enter info</span>
          <span style={{ color: '#bbdefb' }}>→</span>
          <span style={{ color: '#bbdefb' }}>3 Payment</span>
        </div>
      </div>
      {/* Swiper chọn khoang */}
      <div style={{ margin: '8px 0 8px 0', background: '#f5f6fa', borderRadius: 12, padding: '8px 0' }}>
        <Swiper
          slidesPerView={3.2}
          spaceBetween={8}
          style={{ padding: '0 8px 8px 8px', minHeight: 80 }}
          // Không dùng navigation, pagination
        >
          {/* Đầu tàu SVG */}
          <SwiperSlide key="train-head" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 48, minWidth: 48, maxWidth: 48, padding: 0, margin: 0 }}>
            <svg width="48" height="48" viewBox="0 0 48 40">
              <path d="M0,40 Q0,0 34,0 H48 V40 Z" fill="#ccc"/>
              <text x="50%" y="65%" textAnchor="middle" fill="#fff" fontWeight="bold" fontSize="13" fontFamily="inherit">{trainName}</text>
            </svg>
          </SwiperSlide>
          {COACHES.map((coach, idx) => (
            <SwiperSlide key={coach.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div
                onClick={() => setSelectedCoachIdx(idx)}
                className={(coach.type.includes('Family') || coach.type.includes('Pregnant')) ? 'special-zone-tooltip' : ''}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#fff',
                  border: idx === selectedCoachIdx ? '2px solid #1976d2' : '2px solid #e0e0e0',
                  borderRadius: 12,
                  boxShadow: idx === selectedCoachIdx ? '0 2px 8px rgba(25, 118, 210, 0.2)' : '0 1px 3px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  minWidth: 110,
                  maxWidth: 140,
                  padding: '6px 8px',
                  transition: 'all 0.2s',
                  position: 'relative',
                  fontWeight: 600,
                  height: 56,
                  overflow: 'visible'
                }}
              >
                {/* Icon cho toa Pregnant mother & newborn cabin */}
                {coach.type.includes('Pregnant') && (
                  <div style={{
                    position: 'absolute',
                    top: -5,
                    right: -10,
                    width: 28,
                    height: 28,
                    background: '#e91e63',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    color: '#fff',
                    border: '3px solid #fff',
                    boxShadow: '0 3px 6px rgba(0,0,0,0.3)',
                    zIndex: 1000
                  }}>
                    🤱
                  </div>
                )}
                
                {/* Icon cho toa Family cabin */}
                {coach.type.includes('Family') && (
                  <div style={{
                    position: 'absolute',
                    top: -5,
                    right: -10,
                    width: 28,
                    height: 28,
                    background: '#4caf50',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    color: '#fff',
                    border: '3px solid #fff',
                    boxShadow: '0 3px 6px rgba(0,0,0,0.3)',
                    zIndex: 1000
                  }}>
                    👨‍👩‍👧‍👦
                  </div>
                )}
                {/* Số thứ tự khoang */}
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: idx === selectedCoachIdx ? '#1976d2' : '#e0e0e0',
                  color: idx === selectedCoachIdx ? '#fff' : '#888',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 11, flexShrink: 0
                }}>{idx + 1}</div>
                {/* Thông tin khoang */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    fontWeight: 700, 
                    fontSize: 11, 
                    color: idx === selectedCoachIdx ? '#1976d2' : '#222', 
                    marginBottom: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    width: '100%',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    {(coach.type.includes('Family') || coach.type.includes('Pregnant')) ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        whiteSpace: 'nowrap',
                        width: '200%',
                        animation: 'scrollText 7s linear infinite',
                      }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                          {coach.type}
                          <span style={{ fontSize: 9, flexShrink: 0, marginLeft: 3 }}>{coach.type.includes('Family') ? '👨‍👩‍👧‍👦' : '🤱'}</span>
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 40 }}>
                          {coach.type}
                          <span style={{ fontSize: 9, flexShrink: 0, marginLeft: 3 }}>{coach.type.includes('Family') ? '👨‍👩‍👧‍👦' : '🤱'}</span>
                        </span>
                      </div>
                    ) : (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        width: '100%'
                      }}>
                        {coach.type}
                      </div>
                    )}
                  </div>
                  <div style={{ 
                    fontSize: 9, 
                    color: '#888', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 3,
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {coach.seats} seats <span style={{ fontSize: 11, lineHeight: 1 }}>•</span> From {Math.round(coach.price/1000)}K
                  </div>
                </div>
                
                {/* Tab tooltip for special zones */}
                {(coach.type.includes('Family') || coach.type.includes('Pregnant')) && (
                  <div className="tooltip-content" style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 8px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#1976d2',
                    color: '#fff',
                    padding: '12px 16px',
                    borderRadius: 8,
                    fontSize: 12,
                    lineHeight: 1.4,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    minWidth: 220,
                    maxWidth: 280,
                    opacity: 0,
                    visibility: 'hidden',
                    transition: 'all 0.2s',
                    pointerEvents: 'none'
                  }}>
                    {coach.type.includes('Pregnant') ? (
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: 6 }}>🤱 Pregnant Mother Zone</div>
                        <div style={{ marginBottom: 4 }}>✓ Priority for expectant mothers</div>
                        <div style={{ marginBottom: 4 }}>✓ Comfortable & quiet</div>
                        <div>✓ Easy facility access</div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: 6 }}>👨‍👩‍👧‍👦 Family Zone</div>
                        <div style={{ marginBottom: 4 }}>✓ Private family compartments</div>
                        <div style={{ marginBottom: 4 }}>✓ Safe space for children</div>
                        <div>✓ Family-friendly amenities</div>
                      </div>
                    )}
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      border: '5px solid transparent',
                      borderTopColor: '#1976d2'
                    }}></div>
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* Thông tin toa */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 16, marginBottom: 8, boxShadow: '0 1px 4px #0001' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
          <div style={{ fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap' }}>Coach {COACHES[selectedCoachIdx].id}: {COACHES[selectedCoachIdx].type}</div>
          {/* Special zone tooltip */}
          {(COACHES[selectedCoachIdx].type.includes('Family') || COACHES[selectedCoachIdx].type.includes('Pregnant')) && (
            <div className="special-zone-tooltip" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap', marginLeft: 4 }}>
              <div style={{
                background: '#e3f2fd',
                color: '#1976d2',
                borderRadius: 16,
                padding: '4px 8px',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'help',
                border: '1px solid #bbdefb',
                display: 'inline-flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                lineHeight: 1
              }}>
                ℹ️ Special Zone
              </div>
              <div className="tooltip-content" style={{
                position: 'absolute',
                bottom: 'calc(100% + 8px)',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#1976d2',
                color: '#fff',
                padding: '12px 16px',
                borderRadius: 8,
                fontSize: 13,
                lineHeight: 1.4,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 1000,
                minWidth: 250,
                maxWidth: 300,
                opacity: 0,
                visibility: 'hidden',
                transition: 'all 0.2s',
                pointerEvents: 'none'
              }}>
                {COACHES[selectedCoachIdx].type.includes('Pregnant') ? (
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>🤱 Pregnant Mother & Newborn Zone</div>
                    <div style={{ marginBottom: 6 }}>✓ Priority space for expectant mothers</div>
                    <div style={{ marginBottom: 6 }}>✓ Larger beds for comfort</div>
                    <div style={{ marginBottom: 6 }}>✓ Easy access to facilities</div>
                    <div>✓ Quiet environment for rest</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>👨‍👩‍👧‍👦 Family Zone</div>
                    <div style={{ marginBottom: 6 }}>✓ Private family compartments</div>
                    <div style={{ marginBottom: 6 }}>✓ Safe space for children</div>
                    <div style={{ marginBottom: 6 }}>✓ Family-friendly amenities</div>
                    <div>✓ Book entire compartment together</div>
                  </div>
                )}
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  border: '6px solid transparent',
                  borderTopColor: '#1976d2'
                }}></div>
              </div>
            </div>
          )}
        </div>
        <div style={{ fontSize: 13, color: '#666', margin: '4px 0 8px 0' }}>Displayed price is for 1 adult.</div>
        
        {/* Special zone booking rules */}
        {COACHES[selectedCoachIdx].type.includes('Family') && (
          <div style={{
            background: '#fff3e0',
            border: '1px solid #ffcc02',
            borderRadius: 8,
            padding: '12px',
            marginTop: 8
          }}>
            <div style={{ fontWeight: 600, color: '#f57f17', marginBottom: 6, fontSize: 14 }}>
              👨‍👩‍👧‍👦 Family Zone Booking Rules
            </div>
            <div style={{ fontSize: 13, color: '#bf8900', lineHeight: 1.4 }}>
              <div>• Minimum 2 passengers required for family cabins</div>
              <div>• Must book at least 2 berths together (no individual bookings)</div>
              <div>• For groups of 3-4: Pay for 4 berths (4-berth family cabin)</div>
              <div>• For groups of 5-6: Pay for 6 berths (6-berth family cabin)</div>
              <div>• Entire compartment is reserved for your family</div>
            </div>
          </div>
        )}
        
        {COACHES[selectedCoachIdx].type.includes('Pregnant') && (
          <div style={{
            background: '#f3e5f5',
            border: '1px solid #ce93d8',
            borderRadius: 8,
            padding: '12px',
            marginTop: 8
          }}>
            <div style={{ fontWeight: 600, color: '#7b1fa2', marginBottom: 6, fontSize: 14 }}>
              🤱 Priority Booking for Expectant Mothers
            </div>
            <div style={{ fontSize: 13, color: '#6a1b9a', lineHeight: 1.4 }}>
              <div>• Reserved for pregnant women and nursing mothers</div>
              <div>• Includes companion accommodation</div>
              <div>• Priority boarding and assistance</div>
              <div>• Quiet, comfortable environment</div>
            </div>
          </div>
        )}
        {/* Seat status legend */}
        <div style={{ display: 'flex', gap: 16, fontSize: 14, marginBottom: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ 
              width: 16, 
              height: 16, 
              background: '#fff', 
              border: '2px solid #10b981',
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}></div>
            Available
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ 
              width: 16, 
              height: 16, 
              background: '#4caf50', 
              border: '2px solid #4caf50',
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 10,
              fontWeight: 700
            }}>✓</div>
            Selected
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ 
              width: 16, 
              height: 16, 
              background: '#fff', 
              border: '2px solid #bdbdbd',
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#bdbdbd',
              fontSize: 10,
              fontWeight: 700
            }}>✓</div>
            Sold
          </div>
          {isFilterActive && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ 
                width: 16, 
                height: 16, 
                background: '#ff9800', 
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 10,
                fontWeight: 700
              }}>★</div>
              <span>Record Match</span>
            </div>
          )}
        </div>
      </div>
      {/* Sơ đồ ghế */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 12, marginBottom: 8, minHeight: 320, boxShadow: '0 1px 4px #0001' }}>
        {renderCoachSeats(COACHES[selectedCoachIdx])}
      </div>
      {/* Thông tin chọn ghế */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 16, marginBottom: 8, boxShadow: '0 1px 4px #0001' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#222' }}>Seat Selection</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Nút Auto Select */}
            <button
              onClick={autoSelectSeats}
              disabled={selectedSeatIds.length === totalPassengers}
              style={{
                background: selectedSeatIds.length === totalPassengers ? '#f5f5f5' : '#1976d2',
                color: selectedSeatIds.length === totalPassengers ? '#999' : '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 600,
                cursor: selectedSeatIds.length === totalPassengers ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              🎯 Auto Select
            </button>
            
            {selectedSeatIds.length > 0 && (
              <button
                onClick={() => setSelectedSeatIds([])}
                style={{
                  background: '#f5f5f5',
                  color: '#666',
                  border: 'none',
                  borderRadius: 6,
                  padding: '4px 8px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Clear All
              </button>
            )}
            <div style={{ 
              fontSize: 14, 
              fontWeight: 600,
              color: selectedSeatIds.length === totalPassengers ? '#4caf50' : selectedSeatIds.length > 0 ? '#ff9800' : '#666',
              background: selectedSeatIds.length === totalPassengers ? '#e8f5e8' : selectedSeatIds.length > 0 ? '#fff3e0' : '#f5f5f5',
              padding: '4px 12px',
              borderRadius: 8
            }}>
              {selectedSeatIds.length}/{totalPassengers} seats
            </div>
          </div>
        </div>
        
        {/* Hiển thị danh sách hành khách */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>Passengers: {getPassengerDescription()}</div>
          
          {/* Mô tả chiến lược Auto Select */}
          {selectedSeatIds.length === 0 && (
            <div style={{ 
              background: '#f0f8ff', 
              color: '#1976d2', 
              padding: '10px', 
              borderRadius: 6, 
              fontSize: 13,
              marginBottom: 8,
              border: '1px solid #e3f2fd'
            }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>🎯 Auto Select Strategy:</div>
              <div>
                {passenger.child > 0 || passenger.elderly > 0 || passenger.nursing > 0 
                  ? "Will select seats near toilet for children/elderly comfort"
                  : totalPassengers === 3
                  ? "Will find 4-bed compartment for your group of 3"
                  : totalPassengers === 4
                  ? "Will find 4-bed compartment for your group"
                  : totalPassengers === 5
                  ? "Will find 6-bed compartment for your group of 5"
                  : totalPassengers === 6
                  ? "Will find 6-bed compartment for your group"
                  : totalPassengers === 7
                  ? "Will find 6-bed compartment + 1 adjacent seat for your group of 7"
                  : "Will select seats in same coach when possible"
                }
              </div>
            </div>
          )}
          
          {/* Hiển thị ghế đã chọn */}
          {selectedSeatIds.length > 0 && (
            <div style={{ fontSize: 14, color: '#1976d2', marginBottom: 8 }}>
              Selected seats: {selectedSeatIds.map(seatId => seatId.split('-').pop()).join(', ')}
            </div>
          )}
          
          {/* Hiển thị thông báo Auto Select */}
          {autoSelectMessage && (
            <div style={{ 
              fontSize: 14, 
              color: autoSelectMessage.startsWith('❌') ? '#d32f2f' : '#1976d2',
              background: autoSelectMessage.startsWith('❌') ? '#ffebee' : '#e3f2fd',
              padding: '8px 12px',
              borderRadius: 6,
              marginBottom: 8,
              border: `1px solid ${autoSelectMessage.startsWith('❌') ? '#ffcdd2' : '#bbdefb'}`
            }}>
              {autoSelectMessage}
            </div>
          )}
        </div>

        {/* Thông báo trạng thái */}
        {selectedSeatIds.length === 0 && (
          <div style={{ 
            background: '#e3f2fd', 
            color: '#1976d2', 
            padding: '12px', 
            borderRadius: 8, 
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span style={{ fontSize: 16 }}>👆</span>
            Please select {totalPassengers} seat{totalPassengers > 1 ? 's' : ''} for your passenger{totalPassengers > 1 ? 's' : ''}
          </div>
        )}
        
        {selectedSeatIds.length > 0 && selectedSeatIds.length < totalPassengers && (
          <div style={{ 
            background: '#fff3e0', 
            color: '#f57c00', 
            padding: '12px', 
            borderRadius: 8, 
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            You need to select {totalPassengers - selectedSeatIds.length} more seat{totalPassengers - selectedSeatIds.length > 1 ? 's' : ''}
          </div>
        )}
        
        {selectedSeatIds.length === totalPassengers && (
          <div style={{ 
            background: '#e8f5e8', 
            color: '#4caf50', 
            padding: '12px', 
            borderRadius: 8, 
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span style={{ fontSize: 16 }}>✅</span>
            Perfect! You have selected all required seats. Click Continue to proceed.
          </div>
        )}

        {/* Gợi ý cho trẻ em và người già */}
        {(passenger.child > 0 || passenger.elderly > 0 || passenger.nursing > 0) && selectedSeatIds.length === 0 && (
          <div style={{ 
            background: '#fff3e0', 
            color: '#f57c00', 
            padding: '12px', 
            borderRadius: 8, 
            fontSize: 14,
            marginTop: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span style={{ fontSize: 16 }}>👴</span>
            <span>
              You should select a seat near the toilet because your group includes elderly, children, or nursing mothers.
            </span>
          </div>
        )}
      </div>
      {/* Tổng tiền + nút tiếp tục */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px #0001', position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
          <span>Total for {selectedSeatIds.length}/{totalPassengers} passenger(s)</span>
          <span style={{ color: '#e53935', fontWeight: 700, fontSize: 18 }}>{selectedSeatIds.reduce((total, seatId) => {
            const seat = Object.values(coachSeats).flat().find(s => s.id === seatId);
            return total + (seat?.price || 0);
          }, 0).toLocaleString()}đ</span>
        </div>
        
        {/* Thông báo trạng thái trước nút */}
        {selectedSeatIds.length < totalPassengers && (
          <div style={{ 
            fontSize: 14, 
            color: '#666', 
            textAlign: 'center', 
            marginBottom: 8,
            padding: '8px 12px',
            background: '#f5f5f5',
            borderRadius: 6
          }}>
            Please select {totalPassengers - selectedSeatIds.length} more seat{totalPassengers - selectedSeatIds.length > 1 ? 's' : ''} to continue
          </div>
        )}
        
        <button
          onClick={handleProceedToPassengerInfo}
          disabled={selectedSeatIds.length < totalPassengers}
          style={{ 
            width: '100%', 
            background: selectedSeatIds.length < totalPassengers ? '#e0e0e0' : '#0d47a1', 
            color: selectedSeatIds.length < totalPassengers ? '#888' : '#fff', 
            fontWeight: 700, 
            fontSize: 18, 
            borderRadius: 8, 
            padding: '14px 0', 
            border: 'none', 
            boxShadow: selectedSeatIds.length < totalPassengers ? 'none' : '0 2px 8px #0001', 
            cursor: selectedSeatIds.length < totalPassengers ? 'not-allowed' : 'pointer', 
            opacity: selectedSeatIds.length < totalPassengers ? 0.6 : 1,
            transition: 'all 0.3s ease'
          }}
        >
          {selectedSeatIds.length < totalPassengers 
            ? `Select ${totalPassengers - selectedSeatIds.length} more seat${totalPassengers - selectedSeatIds.length > 1 ? 's' : ''}` 
            : 'Continue'
          }
        </button>
      </div>

      {/* Dialog thông tin hành vi */}
      <Dialog open={false} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Behavior information</DialogTitle>
          </DialogHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 600, color: '#1f2937' }}>Quiet Zone</h4>
              <p style={{ margin: 0, fontSize: 14, color: '#6b7280', lineHeight: 1.5 }}>
                Quiet area, suitable for those who want to rest, read, or work.
              </p>
            </div>
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 600, color: '#1f2937' }}>Social Zone</h4>
              <p style={{ margin: 0, fontSize: 14, color: '#6b7280', lineHeight: 1.5 }}>
                Lively area, suitable for those who want to chat and connect with other passengers.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chú thích noise */}
      <div style={{ fontSize: 12, color: '#888', margin: '4px 0 8px 0', textAlign: 'right' }}>
        Color indicates noise level on the train
      </div>

      {/* BỘ LỌC - Sử dụng PriceFilter component with integrated logic */}
      <PriceFilter
        minPrice={minPrice}
        maxPrice={maxPrice}
        onPriceChange={(min, max) => {
          setFilterMinPrice(min);
          setFilterMaxPrice(max);
          if (isFilterActive) {
            handlePriceRangeChange([min, max]);
          }
        }}
        // New integrated props
        coachSeats={coachSeats}
        coaches={COACHES}
        selectedCoachIdx={selectedCoachIdx}
        onFilteredSeatsChange={(seatIds) => {
          setFilteredSeatIds(seatIds);
          setIsFilterActive(seatIds.length > 0);
        }}
        onBestCoachSwitch={(coachIndex) => {
          setSelectedCoachIdx(coachIndex);
        }}
        onShowToast={showToast}
        // Keep existing functionality for backward compatibility
        onApplyFilter={(filterData) => {
          console.log('Filter callback triggered with:', filterData);
          
          // Sync record types from PriceFilter to SelectSeat if needed
          if (filterData.recordTypes) {
            setSelectedRecordTypes(filterData.recordTypes);
          }
          
          // Handle noise level filter
          if (filterData.noiseLevel) {
            console.log('🎯 Setting noise level filter to:', filterData.noiseLevel);
            setSelectedNoiseLevel(filterData.noiseLevel);
          } else {
            console.log('🔄 Clearing noise level filter (reset or null)');
            setSelectedNoiseLevel(null);
          }
          
          // Handle priority preference
          if (filterData.priority) {
            setPriorityPreference(filterData.priority);
          }
          
          // Handle price range
          if (filterData.priceRange) {
            setFilterMinPrice(filterData.priceRange.min);
            setFilterMaxPrice(filterData.priceRange.max);
          }
          
          // Only trigger old filter logic if integrated logic is not available
          if (!coachSeats || Object.keys(coachSeats).length === 0) {
            handleFilterSeats();
          }
        }}
        onResetFilters={() => {
          // Reset to initial state like when first entering Select Seat page
          console.log('🔄 Reset filters called - returning to initial state like when first entering page');
          setFilteredSeatIds([]);
          setIsFilterActive(false); // Disable filtering to return to initial state
          
          // Reset all filter states to default (none selected)
          setSelectedRecordTypes([]);
          setPriorityPreference('all');
          setSelectedNoiseLevel(null);
          setFilterMinPrice(minPrice);
          setFilterMaxPrice(maxPrice);
        }}
        selectedRecordTypes={selectedRecordTypes}
        priorityPreference={priorityPreference}
        onRecordTypesChange={setSelectedRecordTypes}
        onPriorityChange={setPriorityPreference}
        priceData={allPrices}
        className="mb-35"
      />

      {/* Popup gợi ý chọn ghế gần nhà vệ sinh nếu có trẻ em hoặc người cao tuổi */}
      {showWcSuggest && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.25)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: '32px 24px',
            boxShadow: '0 4px 24px #0002',
            maxWidth: 340,
            textAlign: 'center',
          }}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Suggestion</div>
            <div style={{ fontSize: 15, marginBottom: 20 }}>
              You should select a seat near the toilet because your group includes elderly, children, or nursing mothers.
            </div>
            <button onClick={() => setShowWcSuggest(false)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 32px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Filter Result Popup */}
      {showFilterResult && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.4)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: '32px 24px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            maxWidth: 400,
            textAlign: 'center',
            transform: 'scale(1)',
            animation: 'slideUp 0.3s ease'
          }}>
            <div style={{ 
              fontSize: 24, 
              marginBottom: 8,
              color: '#4caf50'
            }}>
              ✅
            </div>
            <div style={{ 
              fontWeight: 700, 
              fontSize: 18, 
              marginBottom: 12,
              color: '#1976d2'
            }}>
              Filter Applied Successfully
            </div>
            <div style={{ 
              fontSize: 15, 
              marginBottom: 24,
              color: '#666',
              lineHeight: 1.5
            }}>
              {filterResultMessage}
            </div>
            <button 
              onClick={() => setShowFilterResult(false)} 
              style={{ 
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 12, 
                padding: '12px 32px', 
                fontWeight: 700, 
                fontSize: 15, 
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(25, 118, 210, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(25, 118, 210, 0.3)';
              }}
            >
              OK, Got it!
            </button>
          </div>
        </div>
      )}

      {/* Family Warning Modal */}
      {showFamilyWarningModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.4)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: '32px 24px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            maxWidth: 400,
            textAlign: 'center',
            transform: 'scale(1)',
            animation: 'slideUp 0.3s ease'
          }}>
            <div style={{ 
              fontSize: 48, 
              marginBottom: 16,
              color: '#ff9800'
            }}>
              👨‍👩‍👧‍👦
            </div>
            <div style={{ 
              fontWeight: 700, 
              fontSize: 20, 
              marginBottom: 12,
              color: '#e65100'
            }}>
              Family Cabin Requirements
            </div>
            <div style={{ 
              fontSize: 15, 
              marginBottom: 24,
              color: '#666',
              lineHeight: 1.5
            }}>
              Family cabins require at least 2 passengers. Single passengers cannot book family compartments.
            </div>
            <button 
              onClick={() => setShowFamilyWarningModal(false)} 
              style={{ 
                background: 'linear-gradient(45deg, #ff9800, #ffb74d)', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 12, 
                padding: '12px 32px', 
                fontWeight: 700, 
                fontSize: 15, 
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 152, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 152, 0, 0.3)';
              }}
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* Level Warning Modal */}
      {showLevelWarningModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.4)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: '32px 24px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            maxWidth: 400,
            textAlign: 'center',
            transform: 'scale(1)',
            animation: 'slideUp 0.3s ease'
          }}>
            <div style={{ 
              fontSize: 48, 
              marginBottom: 16,
              color: '#ff9800'
            }}>
              🚫
            </div>
            <div style={{ 
              fontWeight: 700, 
              fontSize: 20, 
              marginBottom: 12,
              color: '#e65100'
            }}>
              Same Level Required
            </div>
            <div style={{ 
              fontSize: 15, 
              marginBottom: 24,
              color: '#666',
              lineHeight: 1.5
            }}>
              Trong Family cabin, bạn chỉ có thể chọn tối đa 2 ghế cùng level (cùng hàng). Vui lòng bỏ chọn ghế hiện tại trước khi chọn ghế khác.
            </div>
            <button 
              onClick={() => setShowLevelWarningModal(false)} 
              style={{ 
                background: 'linear-gradient(45deg, #ff9800, #ffb74d)', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 12, 
                padding: '12px 32px', 
                fontWeight: 700, 
                fontSize: 15, 
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 152, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 152, 0, 0.3)';
              }}
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default SelectSeat; 
