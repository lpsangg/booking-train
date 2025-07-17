import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { SEAT_LAYOUT } from '../layouts/seatLayout';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface Seat {
  id: string;
  row: string;
  column: number;
  floor: 1 | 2 | 3;
  price: number;
  status: 'available' | 'occupied' | 'reserved' | 'selected';
  behavior: 'quiet' | 'social';
  nearWC: boolean;
  nearSimilarBehavior: boolean;
  passengersNearby: number;
}

// Danh sách mã tàu có file giá động
const DYNAMIC_PRICE_TRAINS = [
  'SE1', 'SE2', 'SE3', 'SE4', 'SE5', 'SE6', 'SE7', 'SE8', 'SE9', 'SE10', 'SE22'
];

// Hàm load file json giá động cho từng tàu
async function loadTrainPriceData(trainCode: string): Promise<any | null> {
  try {
    const data = await fetch(`/data/${trainCode}.json`).then(res => res.json());
    return data;
  } catch (e) {
    console.error(`Error loading ${trainCode}.json:`, e);
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
  priceData: any,
  from: string,
  to: string
): DynamicPriceItem[] {
  const result: DynamicPriceItem[] = [];
  if (!priceData || !priceData.train_fares) return result;
  
  // Chuẩn hóa tên ga
  const norm = (s: string) => {
    return s
      .trim()
      .toUpperCase()
      .replace(/^GA\s+/, '') // Loại bỏ "GA " ở đầu
      .replace(/\s+/g, ' ') // Chuẩn hóa khoảng trắng
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Loại bỏ dấu
  };
  from = norm(from);
  to = norm(to);
  
  // Tìm hành trình phù hợp
  const fare = priceData.train_fares.find((f: any) => norm(f.origin) === from && norm(f.destination) === to);
  if (!fare) {
    console.log(`Không tìm thấy hành trình ${from} → ${to} trong ${trainCode}.json`);
    return result;
  }
  
  // Chỉ lấy dữ liệu từ flat_seats
  if (fare.flat_seats && Array.isArray(fare.flat_seats)) {
    return fare.flat_seats.map((item: any) => ({
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
  { id: 3, type: '6-berth cabin', seats: 42, price: 1200000 },
  { id: 4, type: '6-berth cabin', seats: 42, price: 1200000 },
  { id: 5, type: '6-berth cabin', seats: 42, price: 1200000 },
  { id: 6, type: '4-berth cabin', seats: 28, price: 1500000 },
  { id: 7, type: '4-berth cabin', seats: 28, price: 1500000 },
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
const SeatIconOccupied = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <rect x="4" y="8" width="24" height="16" rx="4" fill="#ededed" />
    <rect x="8" y="24" width="4" height="6" rx="2" fill="#ededed" />
    <rect x="20" y="24" width="4" height="6" rx="2" fill="#ededed" />
    <line x1="8" y1="12" x2="24" y2="24" stroke="#bbb" strokeWidth="2"/>
    <line x1="24" y1="12" x2="8" y2="24" stroke="#bbb" strokeWidth="2"/>
  </svg>
);

// Bảng noise và màu tương ứng cho toa 1 (Ngồi mềm)
// const NOISE_COLORS = [ ... ];
// const NOISE_MATRIX = [ ... ];
// function getNoiseColor(value: number) { ... }

// Bảng noise cho từng khoang/tầng của toa 2 (Gối mềm)
// const NOISE_MATRIX_2 = [ ... ];
// function getNoiseColor2(value: number) { ... }

// Bảng noise cho từng khoang/tầng của toa 3 (Nằm khoang 6)
const NOISE_KHOANGS_1 = [
  // Hàng 1
  [1200, 1205, 1210, 1215, 1220, 1225, 1230],
  // Hàng 2
  [1235, 1240, 1245, 1250, 1255, 1260, 1265],
  // Hàng 3
  [1270, 1275, 1280, 1285, 1290, 1295, 1300],
  // Hàng 4
  [1305, 1310, 1315, 1320, 1325, 1330, 1335],
];

// Bảng noise cho từng khoang/tầng của toa 4 (Nằm khoang 6)
const NOISE_KHOANGS_2 = [
  // Hàng 1
  [1340, 1345, 1350, 1355, 1360, 1365, 1370],
  // Hàng 2
  [1375, 1380, 1385, 1390, 1395, 1400, 1405],
  // Hàng 3
  [1410, 1415, 1420, 1425, 1430, 1435, 1440],
  // Hàng 4
  [1445, 1450, 1455, 1460, 1465, 1470, 1475],
];
// Màu sắc: gradient cam-xanh lá


// Bảng noise cho từng khoang/tầng của toa 5 (Nằm khoang 6)
const NOISE_KHOANGS_3 = [
  // Khoang 1
  [642, 635, 628, 647, 640, 633],
  // Khoang 2
  [652, 645, 638, 657, 650, 643],
  // Khoang 3
  [662, 655, 648, 667, 660, 653],
  // Khoang 4
  [672, 665, 658, 677, 670, 663],
  // Khoang 5
  [682, 675, 668, 687, 680, 673],
  // Khoang 6
  [692, 685, 678, 697, 690, 683],
  // Khoang 7
  [702, 700, 693, 707, 700, 693],
];
// Màu sắc: cam đậm đến cam nhạt (tự động tính theo giá trị, hoặc bạn có thể bổ sung mã màu cụ thể nếu muốn)
function getNoiseColor3_v2(value: number) {
  // Gradient từ #f97316 (cam đậm) đến #fde68a (cam nhạt)
  // Giá trị nhỏ nhất: 628, lớn nhất: 707
  const min = 628, max = 707;
  const percent = (value - min) / (max - min);
  // Interpolate màu cam đậm (#f97316) đến cam nhạt (#fde68a)
  function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
  const c1 = { r: 249, g: 115, b: 22 }, c2 = { r: 253, g: 230, b: 138 };
  const r = Math.round(lerp(c1.r, c2.r, percent));
  const g = Math.round(lerp(c1.g, c2.g, percent));
  const b = Math.round(lerp(c1.b, c2.b, percent));
  return `rgb(${r},${g},${b})`;
}

// Bảng noise cho từng khoang/tầng của toa 6 (Nằm khoang 4)
const NOISE_KHOANGS_4 = [
  // Khoang 1
  [712, 705, 698, 717, 710, 703],
  // Khoang 2
  [722, 715, 708, 727, 720, 713],
  // Khoang 3
  [732, 725, 718, 737, 730, 723],
  // Khoang 4
  [742, 735, 728, 747, 740, 733],
  // Khoang 5
  [752, 745, 738, 757, 750, 743],
  // Khoang 6
  [762, 755, 748, 767, 760, 753],
  // Khoang 7
  [772, 765, 758, 777, 770, 763],
];
// Màu sắc: gradient vàng-xanh lá
function getNoiseColor4_v2(value: number) {
  // Gradient từ #fde68a (vàng nhạt) đến #22c55e (xanh lá)
  // Giá trị nhỏ nhất: 698, lớn nhất: 777
  const min = 698, max = 777;
  const percent = (value - min) / (max - min);
  function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
  const c1 = { r: 253, g: 230, b: 138 }, c2 = { r: 34, g: 197, b: 94 };
  const r = Math.round(lerp(c1.r, c2.r, percent));
  const g = Math.round(lerp(c1.g, c2.g, percent));
  const b = Math.round(lerp(c1.b, c2.b, percent));
  return `rgb(${r},${g},${b})`;
}

// Bảng noise cho từng khoang/tầng của toa 7 (Nằm khoang 4)
const NOISE_KHOANGS_5 = [
  // Khoang 1
  [782, 775, 768, 787, 780, 773],
  // Khoang 2
  [792, 785, 778, 797, 790, 783],
  // Khoang 3
  [802, 795, 788, 807, 800, 793],
  // Khoang 4
  [812, 805, 798, 817, 810, 803],
  // Khoang 5
  [822, 815, 808, 827, 820, 813],
  // Khoang 6
  [832, 825, 818, 837, 830, 823],
  // Khoang 7
  [842, 835, 828, 847, 840, 833],
];
// Màu sắc: gradient xanh lá nhạt đến xanh lá đậm
function getNoiseColor5_v2(value: number) {
  // Gradient từ #bbf7d0 (xanh lá nhạt) đến #22c55e (xanh lá đậm)
  // Giá trị nhỏ nhất: 768, lớn nhất: 847
  const min = 768, max = 847;
  const percent = (value - min) / (max - min);
  function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
  const c1 = { r: 187, g: 247, b: 208 }, c2 = { r: 34, g: 197, b: 94 };
  const r = Math.round(lerp(c1.r, c2.r, percent));
  const g = Math.round(lerp(c1.g, c2.g, percent));
  const b = Math.round(lerp(c1.b, c2.b, percent));
  return `rgb(${r},${g},${b})`;
}

// Bảng noise cho từng khoang/tầng của toa 8 (Nằm khoang 4)
const NOISE_KHOANGS_4_5 = [
  // Khoang 1
  [1487, 1476, 1487, 1476],
  // Khoang 2
  [1490, 1476, 1490, 1476],
  // Khoang 3
  [1494, 1477, 1494, 1477],
  // Khoang 4
  [1498, 1478, 1502, 1480],
  // Khoang 5
  [1502, 1480, 1507, 1482],
  // Khoang 6
  [1507, 1482, 1511, 1484],
  // Khoang 7
  [1511, 1484, 1511, 1484],
];
// Màu sắc: cam đậm đến cam nhạt (giống Nằm khoang 6)
function getNoiseColor4_5_v2(value: number) {
  // Gradient từ #f97316 (cam đậm) đến #fde68a (cam nhạt)
  // Giá trị nhỏ nhất: 1476, lớn nhất: 1511
  const min = 1476, max = 1511;
  const percent = (value - min) / (max - min);
  function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
  const c1 = { r: 249, g: 115, b: 22 }, c2 = { r: 253, g: 230, b: 138 };
  const r = Math.round(lerp(c1.r, c2.r, percent));
  const g = Math.round(lerp(c1.g, c2.g, percent));
  const b = Math.round(lerp(c1.b, c2.b, percent));
  return `rgb(${r},${g},${b})`;
}



// Bảng noise cho từng khoang/tầng của toa 6 (Nằm khoang 4)
const NOISE_KHOANGS_4_6 = [
  // Khoang 1
  [1520, 1484, 1524, 1485],
  // Khoang 2
  [1524, 1486, 1528, 1487],
  // Khoang 3
  [1528, 1488, 1532, 1489],
  // Khoang 4
  [1532, 1490, 1536, 1491],
  // Khoang 5
  [1536, 1492, 1540, 1493],
  // Khoang 6
  [1540, 1494, 1544, 1495],
  // Khoang 7
  [1544, 1496, 1548, 1497],
];
// Màu sắc: gradient cam-xanh lá
function getNoiseColor4_6_v2(value: number) {
  // Gradient từ #f97316 (cam đậm) đến #22c55e (xanh lá)
  // Giá trị nhỏ nhất: 1484, lớn nhất: 1548
  const min = 1484, max = 1548;
  const percent = (value - min) / (max - min);
  function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
  const c1 = { r: 249, g: 115, b: 22 }, c2 = { r: 34, g: 197, b: 94 };
  const r = Math.round(lerp(c1.r, c2.r, percent));
  const g = Math.round(lerp(c1.g, c2.g, percent));
  const b = Math.round(lerp(c1.b, c2.b, percent));
  return `rgb(${r},${g},${b})`;
}

// Bảng noise cho từng khoang/tầng của toa 7 (Nằm khoang 4)
const NOISE_KHOANGS_4_7 = [
  // Khoang 1
  [1552, 1498, 1556, 1499],
  // Khoang 2
  [1556, 1500, 1560, 1501],
  // Khoang 3
  [1560, 1502, 1564, 1503],
  // Khoang 4
  [1564, 1504, 1568, 1505],
  // Khoang 5
  [1568, 1506, 1572, 1507],
  // Khoang 6
  [1572, 1508, 1576, 1509],
  // Khoang 7
  [1576, 1510, 1580, 1511],
];
// Màu sắc: gradient cam-xanh lá
function getNoiseColor4_7_v2(value: number) {
  // Gradient từ #f97316 (cam đậm) đến #22c55e (xanh lá)
  // Giá trị nhỏ nhất: 1498, lớn nhất: 1580
  const min = 1498, max = 1580;
  const percent = (value - min) / (max - min);
  function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
  const c1 = { r: 249, g: 115, b: 22 }, c2 = { r: 34, g: 197, b: 94 };
  const r = Math.round(lerp(c1.r, c2.r, percent));
  const g = Math.round(lerp(c1.g, c2.g, percent));
  const b = Math.round(lerp(c1.b, c2.b, percent));
  return `rgb(${r},${g},${b})`;
}

// Bảng noise cho từng khoang/tầng của toa 8 (Nằm khoang 4)
const NOISE_KHOANGS_4_8 = [
  // Khoang 1
  [1584, 1512, 1588, 1513],
  // Khoang 2
  [1588, 1514, 1592, 1515],
  // Khoang 3
  [1592, 1516, 1596, 1517],
  // Khoang 4
  [1596, 1518, 1600, 1519],
  // Khoang 5
  [1600, 1520, 1604, 1521],
  // Khoang 6
  [1604, 1522, 1608, 1523],
  // Khoang 7
  [1608, 1524, 1612, 1525],
];
// Màu sắc: gradient cam-xanh lá
function getNoiseColor4_8_v2(value: number) {
  // Gradient từ #f97316 (cam đậm) đến #22c55e (xanh lá)
  // Giá trị nhỏ nhất: 1512, lớn nhất: 1612
  const min = 1512, max = 1612;
  const percent = (value - min) / (max - min);
  function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
  const c1 = { r: 249, g: 115, b: 22 }, c2 = { r: 34, g: 197, b: 94 };
  const r = Math.round(lerp(c1.r, c2.r, percent));
  const g = Math.round(lerp(c1.g, c2.g, percent));
  const b = Math.round(lerp(c1.b, c2.b, percent));
  return `rgb(${r},${g},${b})`;
}

// Bảng noise cho từng khoang/tầng của toa 9 (Nằm khoang 4)
const NOISE_KHOANGS_4_9 = [
  // Khoang 1
  [1616, 1526, 1620, 1527],
  // Khoang 2
  [1620, 1528, 1624, 1529],
  // Khoang 3
  [1624, 1530, 1628, 1531],
  // Khoang 4
  [1628, 1532, 1632, 1533],
  // Khoang 5
  [1632, 1534, 1636, 1535],
  // Khoang 6
  [1636, 1536, 1640, 1537],
  // Khoang 7
  [1640, 1538, 1644, 1539],
];
// Màu sắc: gradient cam-xanh lá
function getNoiseColor4_9_v2(value: number) {
  // Gradient từ #f97316 (cam đậm) đến #22c55e (xanh lá)
  // Giá trị nhỏ nhất: 1526, lớn nhất: 1644
  const min = 1526, max = 1644;
  const percent = (value - min) / (max - min);
  function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
  const c1 = { r: 249, g: 115, b: 22 }, c2 = { r: 34, g: 197, b: 94 };
  const r = Math.round(lerp(c1.r, c2.r, percent));
  const g = Math.round(lerp(c1.g, c2.g, percent));
  const b = Math.round(lerp(c1.b, c2.b, percent));
  return `rgb(${r},${g},${b})`;
}

// Bảng noise cho từng khoang/tầng của toa 10 (Nằm khoang 4)
const NOISE_KHOANGS_4_10 = [
  // Khoang 1
  [1648, 1540, 1652, 1541],
  // Khoang 2
  [1652, 1542, 1656, 1543],
  // Khoang 3
  [1656, 1544, 1660, 1545],
  // Khoang 4
  [1660, 1546, 1664, 1547],
  // Khoang 5
  [1664, 1548, 1668, 1549],
  // Khoang 6
  [1668, 1550, 1672, 1551],
  // Khoang 7
  [1672, 1552, 1676, 1553],
];
// Màu sắc: gradient cam-xanh lá
function getNoiseColor4_10_v2(value: number) {
  // Gradient từ #f97316 (cam đậm) đến #22c55e (xanh lá)
  // Giá trị nhỏ nhất: 1540, lớn nhất: 1676
  const min = 1540, max = 1676;
  const percent = (value - min) / (max - min);
  function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
  const c1 = { r: 249, g: 115, b: 22 }, c2 = { r: 34, g: 197, b: 94 };
  const r = Math.round(lerp(c1.r, c2.r, percent));
  const g = Math.round(lerp(c1.g, c2.g, percent));
  const b = Math.round(lerp(c1.b, c2.b, percent));
  return `rgb(${r},${g},${b})`;
}

// Hàm flatten đúng thứ tự UI cho các toa 6-10 (3 tầng, 2 giường mỗi khoang, 7 khoang, 5 toa)
function flattenNoiseMatrixForCoaches6to10_strictOrder() {
  const matrices = [NOISE_KHOANGS_4_6, NOISE_KHOANGS_4_7, NOISE_KHOANGS_4_8, NOISE_KHOANGS_4_9, NOISE_KHOANGS_4_10];
  const result: number[] = [];
  // Toa (6→10)
  for (let m = 0; m < matrices.length; m++) {
    const matrix = matrices[m];
    // Khoang (1→7)
    for (let khoang = 0; khoang < matrix.length; khoang++) {
      // Tầng (2→1)
      for (let tang = 1; tang >= 0; tang--) {
        // Lấy trung bình 2 giường của tầng này
        const v1 = matrix[khoang][tang*2];
        const v2 = matrix[khoang][tang*2+1];
        const avg = (v1 + v2) / 2;
        result.push(avg);
      }
    }
  }
  return result;
}

const SelectSeat: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Lấy dữ liệu từ URL params
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const departDate = searchParams.get('departDate') || '';
  const trainId = searchParams.get('trainId') || '';
  
  // Lấy dữ liệu hành khách từ params
  const passenger = {
    adult: Number(searchParams.get('adult') || 0),
    child: Number(searchParams.get('child') || 0),
    elderly: Number(searchParams.get('elderly') || 0),
    student: Number(searchParams.get('student') || 0),
    union: Number(searchParams.get('union') || 0),
  };
  const totalPassengers = Object.values(passenger).reduce((sum, count) => sum + count, 0);
  
  // State cho giá động
  const [dynamicPrices, setDynamicPrices] = useState<DynamicPriceItem[]>([]);
  // const [loadingPrices, setLoadingPrices] = useState(false);
  
  // Tạo mô tả hành khách
  const getPassengerDescription = () => {
    const parts = [];
    if (passenger.adult > 0) parts.push(`${passenger.adult} người lớn`);
    if (passenger.child > 0) parts.push(`${passenger.child} trẻ em`);
    if (passenger.elderly > 0) parts.push(`${passenger.elderly} người già`);
    if (passenger.student > 0) parts.push(`${passenger.student} học sinh`);
    if (passenger.union > 0) parts.push(`${passenger.union} đoàn viên`);
    return parts.join(', ');
  };
  
  // Load giá động từ file JSON
  useEffect(() => {
    async function loadDynamicPrices() {
      if (!DYNAMIC_PRICE_TRAINS.includes(trainId)) {
        console.log(`Tàu ${trainId} không có file giá động, sử dụng mock data`);
        return;
      }
      
      // const setLoadingPrices = true;
      try {
        const priceData = await loadTrainPriceData(trainId);
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
  
  // State cho ghế và bộ lọc
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [selectedCoachIdx, setSelectedCoachIdx] = useState(0);

// Sinh dữ liệu ghế cho từng toa dựa trên COACHES và giá động
const [coachSeats, setCoachSeats] = useState<Record<number, Seat[]>>({});
useEffect(() => {
  const newCoachSeats: Record<number, Seat[]> = {};
  COACHES.forEach(coach => {
    const seats: Seat[] = [];
    if (coach.type === '6-berth cabin') {
      // 7 khoang, mỗi khoang 3 tầng, mỗi tầng 2 ghế
      for (let khoang = 0; khoang < 7; khoang++) {
        // Số ghế đầu tiên của khoang này
        const soGheDauKhoang = khoang * 6 + 1;
        const seatIdDauKhoang = `${trainId}-k6-${coach.id}-${soGheDauKhoang}`;
        let giaGoc = 0;
        if (dynamicPrices.length > 0) {
          const item = dynamicPrices.find(item => item.id === seatIdDauKhoang);
          if (item) giaGoc = item.price;
        }
        
        // Tầng 1
        for (let viTri = 0; viTri < 2; viTri++) {
          const soGheThucTe = khoang * 6 + viTri + 1;
          let price = giaGoc;
          
          // Phân biệt ghế bên trái (viTri = 0) và bên phải (viTri = 1)
          if (viTri === 1) price = giaGoc + 5000; // Ghế bên phải tầng 1
          
          console.log(`[K6] Khoang ${khoang+1} - Tầng 1 - Ghế ${soGheThucTe} (seatId: ${seatIdDauKhoang}): giá gốc = ${giaGoc}, giá thực tế = ${price}`);
          seats.push({
            id: `${coach.id}-${soGheThucTe}`,
            row: '',
            column: soGheThucTe,
            floor: 1,
            price: price,
            status: Math.random() > 0.85 ? 'occupied' : 'available',
            behavior: Math.random() > 0.5 ? 'quiet' : 'social',
            nearWC: false,
            nearSimilarBehavior: false,
            passengersNearby: 0
          });
        }
        
        // Tầng 2
        for (let viTri = 0; viTri < 2; viTri++) {
          const soGheThucTe = khoang * 6 + 2 + viTri + 1;
          let price;
          
          // Tính giá dựa trên ghế tầng 1 tương ứng
          if (viTri === 0) {
            // Ghế bên trái tầng 2 = ghế bên trái tầng 1 - 7000
            price = giaGoc - 7000;
          } else {
            // Ghế bên phải tầng 2 = ghế bên phải tầng 1 - 7000
            price = (giaGoc + 5000) - 7000; // = giaGoc - 2000
          }
          
          console.log(`[K6] Khoang ${khoang+1} - Tầng 2 - Ghế ${soGheThucTe} (seatId: ${seatIdDauKhoang}): giá gốc = ${giaGoc}, giá thực tế = ${price}`);
          seats.push({
            id: `${coach.id}-${soGheThucTe}`,
            row: '',
            column: soGheThucTe,
            floor: 2,
            price: price,
            status: Math.random() > 0.85 ? 'occupied' : 'available',
            behavior: Math.random() > 0.5 ? 'quiet' : 'social',
            nearWC: false,
            nearSimilarBehavior: false,
            passengersNearby: 0
          });
        }
        
        // Tầng 3
        for (let viTri = 0; viTri < 2; viTri++) {
          const soGheThucTe = khoang * 6 + 4 + viTri + 1;
          let price;
          
          // Tính giá dựa trên ghế tầng 2 tương ứng
          if (viTri === 0) {
            // Ghế bên trái tầng 3 = ghế bên trái tầng 2 - 7000
            price = (giaGoc - 7000) - 7000; // = giaGoc - 14000
          } else {
            // Ghế bên phải tầng 3 = ghế bên phải tầng 2 - 7000
            price = (giaGoc - 2000) - 7000; // = giaGoc - 9000
          }
          
          console.log(`[K6] Khoang ${khoang+1} - Tầng 3 - Ghế ${soGheThucTe} (seatId: ${seatIdDauKhoang}): giá gốc = ${giaGoc}, giá thực tế = ${price}`);
          seats.push({
            id: `${coach.id}-${soGheThucTe}`,
            row: '',
            column: soGheThucTe,
            floor: 3,
            price: price,
            status: Math.random() > 0.85 ? 'occupied' : 'available',
            behavior: Math.random() > 0.5 ? 'quiet' : 'social',
            nearWC: false,
            nearSimilarBehavior: false,
            passengersNearby: 0
          });
        }
      }
    } else if (coach.type === '4-berth cabin') {
      // 7 khoang, mỗi khoang 2 tầng, mỗi tầng 2 ghế
      for (let khoang = 0; khoang < 7; khoang++) {
        // Số ghế đầu tiên của khoang này
        const soGheDauKhoang = khoang * 4 + 1;
        const seatIdDauKhoang = `${trainId}-k4-${coach.id}-${soGheDauKhoang}`;
        let giaGoc = 0;
        if (dynamicPrices.length > 0) {
          const item = dynamicPrices.find(item => item.id === seatIdDauKhoang);
          if (item) giaGoc = item.price;
        }
        // Tầng 1
        for (let viTri = 0; viTri < 2; viTri++) {
          const soGheThucTe = khoang * 4 + viTri + 1;
          let price = giaGoc;
          console.log(`[K4] Khoang ${khoang+1} - Tầng 1 - Ghế ${soGheThucTe} (seatId: ${seatIdDauKhoang}): giá gốc = ${giaGoc}, giá thực tế = ${price}`);
          seats.push({
            id: `${coach.id}-${soGheThucTe}`,
            row: '',
            column: soGheThucTe,
            floor: 1,
            price: price,
            status: Math.random() > 0.85 ? 'occupied' : 'available',
            behavior: Math.random() > 0.5 ? 'quiet' : 'social',
            nearWC: false,
            nearSimilarBehavior: false,
            passengersNearby: 0
          });
        }
        // Tầng 2
        for (let viTri = 0; viTri < 2; viTri++) {
          const soGheThucTe = khoang * 4 + 2 + viTri + 1;
          let price = giaGoc - 8000;
          console.log(`[K4] Khoang ${khoang+1} - Tầng 2 - Ghế ${soGheThucTe} (seatId: ${seatIdDauKhoang}): giá gốc = ${giaGoc}, giá thực tế = ${price}`);
          seats.push({
            id: `${coach.id}-${soGheThucTe}`,
            row: '',
            column: soGheThucTe,
            floor: 2,
            price: price,
            status: Math.random() > 0.85 ? 'occupied' : 'available',
            behavior: Math.random() > 0.5 ? 'quiet' : 'social',
            nearWC: false,
            nearSimilarBehavior: false,
            passengersNearby: 0
          });
        }
      }
    } else {
      // Toa ngồi mềm, gối mềm: giữ nguyên logic cũ
      for (let i = 1; i <= coach.seats; i++) {
        let dynamicPrice = 0;
        let seatId = '';
        if (coach.type === 'Soft seat' || coach.type === 'Gối mềm') {
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
          behavior: Math.random() > 0.5 ? 'quiet' : 'social',
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
  const getAvailableCount = (coachId: number) =>
    coachSeats[coachId]?.filter(s => s.status === 'available').length || 0;

  // Hàm tính toán màu sắc cho ghế dựa trên toa và vị trí
  const getSeatColor = (coachId: number, seatIndex: number) => {
    const coach = COACHES.find(c => c.id === coachId);
    if (!coach) return "#e0e0e0";

    // Toa 1,2: dùng chung 1 dải màu
    if ([1,2].includes(coachId)) {
      // Ghép noise của toa 1 và 2
      const noise1 = NOISE_KHOANGS_1.flat();
      const noise2 = NOISE_KHOANGS_2.flat();
      const flatNoise = [...noise1, ...noise2];
      let globalIdx = seatIndex;
      if (coachId === 2) globalIdx += noise1.length;
      const min = Math.min(...flatNoise);
      const max = Math.max(...flatNoise);
      const value = flatNoise[globalIdx];
      const percent = (value - min) / (max - min);
      function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
      const c1 = { r: 249, g: 115, b: 22 }, c2 = { r: 34, g: 197, b: 94 };
      const r = Math.round(lerp(c1.r, c2.r, percent));
      const g = Math.round(lerp(c1.g, c2.g, percent));
      const b = Math.round(lerp(c1.b, c2.b, percent));
      return `rgb(${r},${g},${b})`;
    }

    // Toa 3,4,5: dùng chung 1 dải màu
    if ([3,4,5].includes(coachId)) {
      const noise3 = NOISE_KHOANGS_3.flat();
      const noise4 = NOISE_KHOANGS_4.flat();
      const noise5 = NOISE_KHOANGS_5.flat();
      const flatNoise = [...noise3, ...noise4, ...noise5];
      let globalIdx = seatIndex;
      if (coachId === 4) globalIdx += noise3.length;
      if (coachId === 5) globalIdx += noise3.length + noise4.length;
      const min = Math.min(...flatNoise);
      const max = Math.max(...flatNoise);
      const value = flatNoise[globalIdx];
      const percent = (value - min) / (max - min);
      function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
      const c1 = { r: 249, g: 115, b: 22 }, c2 = { r: 34, g: 197, b: 94 };
      const r = Math.round(lerp(c1.r, c2.r, percent));
      const g = Math.round(lerp(c1.g, c2.g, percent));
      const b = Math.round(lerp(c1.b, c2.b, percent));
      return `rgb(${r},${g},${b})`;
    }
    // Toa 6-10: dùng chung 1 dải màu, flatten theo Toa→Khoang→Tầng (2→1), không phân biệt giường
    if ([6,7,8,9,10].includes(coachId)) {
      const flatNoise = flattenNoiseMatrixForCoaches6to10_strictOrder();
      // Mỗi toa: 7 khoang, 2 tầng
      const floorsPerCoach = 7 * 2;
      // Tính vị trí khoang, tầng từ seatIndex
      const khoang = Math.floor(seatIndex / 4);
      const seatInKhoang = seatIndex % 4;
      const tang = Math.floor(seatInKhoang / 2); // 0: tầng 1, 1: tầng 2
      const tangInFlatten = 1 - tang;
      const coachOffset = (coachId - 6) * floorsPerCoach;
      const globalIdx = coachOffset + khoang * 2 + tangInFlatten;
      if (globalIdx >= flatNoise.length) return "#e0e0e0";
      const min = Math.min(...flatNoise);
      const max = Math.max(...flatNoise);
      const value = flatNoise[globalIdx];
      const percent = (value - min) / (max - min);
      function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
      const c1 = { r: 249, g: 115, b: 22 }, c2 = { r: 34, g: 197, b: 94 };
      const r = Math.round(lerp(c1.r, c2.r, percent));
      const g = Math.round(lerp(c1.g, c2.g, percent));
      const b = Math.round(lerp(c1.b, c2.b, percent));
      return `rgb(${r},${g},${b})`;
    }
    // ... giữ nguyên logic cũ cho các toa khác ...

    // Xác định loại toa và lấy ma trận noise tương ứng
    let noiseMatrix: number[][] = [];
    let colorFunction: (value: number) => string = () => "#e0e0e0";

    if (coach.type === 'Soft seat' || coach.type === 'Gối mềm') {
      // Toa ngồi: sử dụng ma trận noise cơ bản và gradient cam-xanh lá
      if (coachId === 1) {
        noiseMatrix = NOISE_KHOANGS_1;
        colorFunction = (value: number) => {
          const min = 1200, max = 1335;
          const percent = (value - min) / (max - min);
          function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
          const c1 = { r: 249, g: 115, b: 22 }, c2 = { r: 34, g: 197, b: 94 };
          const r = Math.round(lerp(c1.r, c2.r, percent));
          const g = Math.round(lerp(c1.g, c2.g, percent));
          const b = Math.round(lerp(c1.b, c2.b, percent));
          return `rgb(${r},${g},${b})`;
        };
      } else if (coachId === 2) {
        noiseMatrix = NOISE_KHOANGS_2;
        colorFunction = (value: number) => {
          const min = 1340, max = 1475;
          const percent = (value - min) / (max - min);
          function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
          const c1 = { r: 249, g: 115, b: 22 }, c2 = { r: 34, g: 197, b: 94 };
          const r = Math.round(lerp(c1.r, c2.r, percent));
          const g = Math.round(lerp(c1.g, c2.g, percent));
          const b = Math.round(lerp(c1.b, c2.b, percent));
          return `rgb(${r},${g},${b})`;
        };
      }
    } else if (coach.type === '6-berth cabin') {
      if (coachId === 3) {
        noiseMatrix = NOISE_KHOANGS_3;
        colorFunction = getNoiseColor3_v2;
      } else if (coachId === 4) {
        noiseMatrix = NOISE_KHOANGS_4;
        colorFunction = getNoiseColor4_v2;
      } else if (coachId === 5) {
        noiseMatrix = NOISE_KHOANGS_5;
        colorFunction = getNoiseColor5_v2;
      }
    } else if (coach.type === '4-berth cabin') {
      if (coachId === 5) {
        noiseMatrix = NOISE_KHOANGS_4_5;
        colorFunction = getNoiseColor4_5_v2;
      } else if (coachId === 6) {
        noiseMatrix = NOISE_KHOANGS_4_6;
        colorFunction = getNoiseColor4_6_v2;
      } else if (coachId === 7) {
        noiseMatrix = NOISE_KHOANGS_4_7;
        colorFunction = getNoiseColor4_7_v2;
      } else if (coachId === 8) {
        noiseMatrix = NOISE_KHOANGS_4_8;
        colorFunction = getNoiseColor4_8_v2;
      } else if (coachId === 9) {
        noiseMatrix = NOISE_KHOANGS_4_9;
        colorFunction = getNoiseColor4_9_v2;
      } else if (coachId === 10) {
        noiseMatrix = NOISE_KHOANGS_4_10;
        colorFunction = getNoiseColor4_10_v2;
      }
    }

    if (noiseMatrix.length === 0) {
      return "#e0e0e0";
    }

    let khoangIdx = 0;
    let tangIdx = 0;
    let seatInTang = 0;

    if (coach.type === '4-berth cabin') {
      // 7 khoang, mỗi khoang 2 tầng, mỗi tầng 2 ghế (4 ghế/khoang)
      khoangIdx = Math.floor(seatIndex / 4);
      const seatInKhoang = seatIndex % 4;
      // Đảo ngược chiều index để dải màu chuyển đều từ đỏ sang xanh
      seatInTang = Math.floor(seatInKhoang / 2); // cột
      tangIdx = seatInKhoang % 2; // hàng
    } else if (coach.type === '6-berth cabin') {
      khoangIdx = Math.floor(seatIndex / 6);
      const seatInKhoang = seatIndex % 6;
      tangIdx = Math.floor(seatInKhoang / 2);
      seatInTang = seatInKhoang % 2;
    } else if (coach.type === 'Soft seat' || coach.type === 'Gối mềm') {
      khoangIdx = Math.floor(seatIndex / 7);
      seatInTang = seatIndex % 7;
      tangIdx = 0;
    }

    if (
      khoangIdx < noiseMatrix.length &&
      ((coach.type === '4-berth cabin' && tangIdx < 2 && seatInTang < 2) ||
       (coach.type === '6-berth cabin' && tangIdx < 3 && seatInTang < 2) ||
       (coach.type === 'Soft seat' || coach.type === 'Gối mềm'))
    ) {
      const noiseValue = noiseMatrix[khoangIdx][tangIdx * 2 + seatInTang];
      return colorFunction(noiseValue);
    }

    return "#e0e0e0";
  };

  // Xử lý chọn ghế theo toa
  const handleSeatSelect = (seatId: string) => {
    const seat = coachSeats[COACHES[selectedCoachIdx].id]?.find(s => s.id === seatId);
    if (!seat || seat.status !== 'available') return;
    setSelectedSeatIds(prev => {
      const newSelected = [...prev];
      const idx = newSelected.indexOf(seatId);
      if (idx > -1) newSelected.splice(idx, 1);
      else if (newSelected.length < totalPassengers) newSelected.push(seatId);
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
    params.append('adult', passenger.adult.toString());
    params.append('child', passenger.child.toString());
    params.append('elderly', passenger.elderly.toString());
    params.append('student', passenger.student.toString());
    params.append('union', passenger.union.toString());
    navigate(`/passenger-info?${params.toString()}`);
  };

  // Lấy mã tàu, loại bỏ chữ 'Tàu' nếu có
  let trainName = searchParams.get('trainName') || 'SE?';
  trainName = trainName.replace(/^Tàu\s*/i, '');

  // ====== BỘ LỌC (COPY TỪ SearchResults) ======
  // State cho bộ lọc
  const [seatChecked, setSeatChecked] = useState(false);
  const [comp4Checked, setComp4Checked] = useState(false);
  const [comp6Checked, setComp6Checked] = useState(false);
  const [quietChecked, setQuietChecked] = useState(false);
  const [socialChecked, setSocialChecked] = useState(false);
  const [defaultMinPrice, setDefaultMinPrice] = useState(100000);
  const [defaultMaxPrice, setDefaultMaxPrice] = useState(2000000);
  const [filterMinPrice, setFilterMinPrice] = useState(100000);
  const [filterMaxPrice, setFilterMaxPrice] = useState(2000000);

  // State cho loại ghế/giường: chỉ cho phép chọn 1
  const [seatType, setSeatType] = useState<'seat' | 'k4' | 'k6' | null>(null);

  // Lấy tất cả giá ghế hiện tại
  const allPrices = Object.values(coachSeats).flat().map(s => s.price).filter(Boolean);
  const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
  const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 0;

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
  const maxBin = Math.max(...bins, 1);

  // Hàm lọc ghế theo bộ lọc
  const handleFilterSeats = () => {
    let coachIds: number[] = [];
    if (seatType === 'seat') coachIds = [1, 2];
    if (seatType === 'k6') coachIds = [3, 4, 5];
    if (seatType === 'k4') coachIds = [6, 7, 8, 9, 10];
    if (coachIds.length > 0) {
      const currentIdx = coachIds.indexOf(COACHES[selectedCoachIdx].id);
      const nextIdx = (currentIdx + 1) % coachIds.length;
      const nextCoachId = coachIds[nextIdx];
      setSelectedCoachIdx(COACHES.findIndex(c => c.id === nextCoachId));
    }
  };

  // Đảm bảo chỉ có 1 khai báo:
  const [showBehaviorInfo, setShowBehaviorInfo] = useState(false);

  // State cho hành vi mong muốn: chỉ cho phép chọn 1
  const [behavior, setBehavior] = useState<'quiet' | 'social' | null>(null);

  // Hàm lọc ghế tổng hợp
  function filterSeats(seats: Seat[]) {
    return seats.filter(seat => {
      // Lọc theo giá
      if (seat.price < filterMinPrice || seat.price > filterMaxPrice) return false;
      // Logic đặc biệt theo yêu cầu:
      if (behavior === 'quiet' && seatType === 'seat') {
        // Chỉ cho phép toa 2
        if (selectedCoachIdx !== COACHES.findIndex(c => c.id === 2)) return false;
      }
      if (behavior === 'social' && seatType === 'seat') {
        // Chỉ cho phép toa 1
        if (selectedCoachIdx !== COACHES.findIndex(c => c.id === 1)) return false;
      }
      if (behavior === 'quiet' && seatType === 'k4') {
        // Chỉ cho phép toa 10
        if (selectedCoachIdx !== COACHES.findIndex(c => c.id === 10)) return false;
      }
      if (behavior === 'social' && seatType === 'k4') {
        // Chỉ cho phép toa 6
        if (selectedCoachIdx !== COACHES.findIndex(c => c.id === 6)) return false;
      }
      if (behavior === 'quiet' && seatType === 'k6') {
        // Chỉ cho phép toa 5
        if (selectedCoachIdx !== COACHES.findIndex(c => c.id === 5)) return false;
      }
      if (behavior === 'social' && seatType === 'k6') {
        // Chỉ cho phép toa 3
        if (selectedCoachIdx !== COACHES.findIndex(c => c.id === 3)) return false;
      }
      // Lọc theo loại ghế/giường
      if (seatType === 'seat' && !(seat.floor === 1 && seat.behavior)) return false;
      if (seatType === 'k4' && !(seat.floor === 2 || seat.floor === 1 && seat.behavior)) return false;
      if (seatType === 'k6' && !(seat.floor === 3 || seat.floor === 2)) return false;
      // Lọc theo hành vi
      if (behavior && seat.behavior !== behavior) return false;
      // ... các filter khác nếu có
      return true;
    });
  }

  // State cho popup cảnh báo chọn ghế gần nhà vệ sinh
  const [showWcSuggest, setShowWcSuggest] = useState(false);

  // Khi trang load, nếu có trẻ em hoặc người cao tuổi thì hiện popup
  useEffect(() => {
    if ((passenger.child > 0 || passenger.elderly > 0)) {
      setShowWcSuggest(true);
    }
  }, []);

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', background: '#f7f7fa', minHeight: '100vh', paddingBottom: 80 }}>
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
          spaceBetween={0}
          style={{ padding: '0 0 8px 0', minHeight: 70 }}
          // Không dùng navigation, pagination
        >
          {/* Đầu tàu SVG */}
          <SwiperSlide key="train-head" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 48, minWidth: 48, maxWidth: 48, padding: 0, margin: 0, marginLeft: 4 }}>
            <svg width="48" height="48" viewBox="0 0 48 40">
              <path d="M0,40 Q0,0 34,0 H48 V40 Z" fill="#ccc"/>
              <text x="50%" y="65%" textAnchor="middle" fill="#fff" fontWeight="bold" fontSize="13" fontFamily="inherit">{trainName}</text>
            </svg>
          </SwiperSlide>
          {COACHES.map((coach, idx) => (
            <SwiperSlide key={coach.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: idx === 0 ? 0 : -10 }}>
              <div
                onClick={() => setSelectedCoachIdx(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#fff',
                  border: idx === selectedCoachIdx ? '2px solid #1976d2' : '2px solid #e0e0e0',
                  borderRadius: 12,
                  boxShadow: 'none',
                  cursor: 'pointer',
                  minWidth: 120,
                  maxWidth: 150,
                  padding: '4px 8px',
                  transition: 'all 0.2s',
                  position: 'relative',
                  fontWeight: 600,
                  height: 48
                }}
              >
                {/* Số thứ tự khoang */}
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: idx === selectedCoachIdx ? '#1976d2' : '#e0e0e0',
                  color: idx === selectedCoachIdx ? '#fff' : '#888',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 12, flexShrink: 0,
                  marginRight: 4
                }}>{idx + 1}</div>
                {/* Thông tin khoang */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 12, color: idx === selectedCoachIdx ? '#1976d2' : '#222', marginBottom: 1 }}>{coach.type}</div>
                  <div style={{ fontSize: 10, color: '#888', display: 'flex', alignItems: 'center', gap: 4 }}>
                    {coach.seats} seats <span style={{ fontSize: 13, lineHeight: 1 }}>•</span> From {Math.round(coach.price/1000)}K
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* Thông tin toa */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 16, marginBottom: 8, boxShadow: '0 1px 4px #0001' }}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>Coach {COACHES[selectedCoachIdx].id}: {COACHES[selectedCoachIdx].type}</div>
        <div style={{ fontSize: 13, color: '#666', margin: '4px 0 8px 0' }}>Displayed price is for 1 adult.</div>
        {/* Seat status legend */}
        <div style={{ display: 'flex', gap: 16, fontSize: 14, marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input type="checkbox" checked={false} readOnly style={{ accentColor: '#10b981' }} /> Available
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input type="checkbox" checked={true} readOnly style={{ accentColor: '#4caf50' }} /> Selected
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input type="checkbox" checked={true} disabled readOnly style={{ accentColor: '#bdbdbd' }} /> Sold
          </div>
        </div>
      </div>
      {/* Sơ đồ ghế */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 12, marginBottom: 8, minHeight: 320, boxShadow: '0 1px 4px #0001' }}>
        {/* Layout ghế cho từng loại toa */}
        {(() => {
          const coach = COACHES[selectedCoachIdx];
          // Nếu là Nằm khoang 6 - Toa 3
          if (coach.type === '6-berth cabin' && coach.id === 3) {
            return (
              <div>
                <div key="empty-row-wc" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                  <span style={{ fontSize: 12, color: '#1976d2', fontWeight: 600, background: '#e3f2fd', borderRadius: 8, padding: '2px 8px' }}>Toilet</span>
                </div>
                {Array.from({ length: 7 }, (_, khoangIdx) => (
                  <div key={khoangIdx} style={{ marginBottom: 20, background: '#f7f7fa', borderRadius: 8, padding: 12 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>Compartment {khoangIdx + 1}</div>
                    {[2,1,0].map(tangIdx => (
                      <div key={tangIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                        {[0,1].map(seatInTang => {
                          const seatIdx = tangIdx*2 + seatInTang;
                          const seat = (coachSeats[coach.id] || [])[khoangIdx*6 + seatIdx];
                          if (!seat) return <div key={seatIdx} style={{ width: 40 }} />;
                          const isOccupied = seat.status === 'occupied';
                          const seatColor = getSeatColor(coach.id, khoangIdx * 6 + seatIdx);
                          return (
                            <button
                              key={seat.id}
                              onClick={() => handleSeatSelect(seat.id)}
                              disabled={isOccupied}
                              style={{
                                background: '#fff',
                                border: '2px solid #e0e0e0',
                                borderRadius: 8,
                                padding: 0,
                                cursor: isOccupied ? 'not-allowed' : 'pointer',
                                opacity: isOccupied ? 0.4 : 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                position: 'relative',
                                minWidth: 40
                              }}
                            >
                              {isOccupied ? <SeatIconOccupied size={32} /> : <SeatIcon size={32} color={seatColor} />}
                              <span style={{ fontWeight: 700, fontSize: 13, color: '#222', marginTop: 2 }}>{seat.column}</span>
                              <span style={{ fontSize: 11, color: '#888' }}>{formatPrice(seat.price)}</span>
                            </button>
                          );
                        })}
                        <span style={{ marginLeft: 8, fontSize: 12, color: '#888' }}>Level {tangIdx + 1}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            );
          }
          // Nếu là Nằm khoang 6 - Toa 4
          if (coach.type === '6-berth cabin' && coach.id === 4) {
            return (
              <div>
                <div key="empty-row-wc" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                  <span style={{ fontSize: 12, color: '#1976d2', fontWeight: 600, background: '#e3f2fd', borderRadius: 8, padding: '2px 8px' }}>Toilet</span>
                </div>
                {Array.from({ length: 7 }, (_, khoangIdx) => (
                  <div key={khoangIdx} style={{ marginBottom: 20, background: '#f7f7fa', borderRadius: 8, padding: 12 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>Compartment {khoangIdx + 1}</div>
                    {[2,1,0].map(tangIdx => (
                      <div key={tangIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                        {[0,1].map(seatInTang => {
                          const seatIdx = tangIdx*2 + seatInTang;
                          const seat = (coachSeats[coach.id] || [])[khoangIdx*6 + seatIdx];
                          if (!seat) return <div key={seatIdx} style={{ width: 40 }} />;
                          const isOccupied = seat.status === 'occupied';
                          const seatColor = getSeatColor(coach.id, khoangIdx * 6 + seatIdx);
                          return (
                            <button
                              key={seat.id}
                              onClick={() => handleSeatSelect(seat.id)}
                              disabled={isOccupied}
                              style={{
                                background: '#fff',
                                border: '2px solid #e0e0e0',
                                borderRadius: 8,
                                padding: 0,
                                cursor: isOccupied ? 'not-allowed' : 'pointer',
                                opacity: isOccupied ? 0.4 : 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                position: 'relative',
                                minWidth: 40
                              }}
                            >
                              {isOccupied ? <SeatIconOccupied size={32} /> : <SeatIcon size={32} color={seatColor} />}
                              <span style={{ fontWeight: 700, fontSize: 13, color: '#222', marginTop: 2 }}>{seat.column}</span>
                              <span style={{ fontSize: 11, color: '#888' }}>{formatPrice(seat.price)}</span>
                            </button>
                          );
                        })}
                        <span style={{ marginLeft: 8, fontSize: 12, color: '#888' }}>Level {tangIdx + 1}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            );
          }
          // Nếu là Nằm khoang 6 - Toa 5
          if (coach.type === '6-berth cabin' && coach.id === 5) {
            return (
              <div>
                <div key="empty-row-wc" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                  <span style={{ fontSize: 12, color: '#1976d2', fontWeight: 600, background: '#e3f2fd', borderRadius: 8, padding: '2px 8px' }}>Toilet</span>
                </div>
                {Array.from({ length: 7 }, (_, khoangIdx) => (
                  <div key={khoangIdx} style={{ marginBottom: 20, background: '#f7f7fa', borderRadius: 8, padding: 12 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>Compartment {khoangIdx + 1}</div>
                    {[2,1,0].map(tangIdx => (
                      <div key={tangIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                        {[0,1].map(seatInTang => {
                          const seatIdx = tangIdx*2 + seatInTang;
                          const seat = (coachSeats[coach.id] || [])[khoangIdx*6 + seatIdx];
                          if (!seat) return <div key={seatIdx} style={{ width: 40 }} />;
                          const isOccupied = seat.status === 'occupied';
                          const seatColor = getSeatColor(coach.id, khoangIdx * 6 + seatIdx);
                          return (
                            <button
                              key={seat.id}
                              onClick={() => handleSeatSelect(seat.id)}
                              disabled={isOccupied}
                              style={{
                                background: '#fff',
                                border: '2px solid #e0e0e0',
                                borderRadius: 8,
                                padding: 0,
                                cursor: isOccupied ? 'not-allowed' : 'pointer',
                                opacity: isOccupied ? 0.4 : 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                position: 'relative',
                                minWidth: 40
                              }}
                            >
                              {isOccupied ? <SeatIconOccupied size={32} /> : <SeatIcon size={32} color={seatColor} />}
                              <span style={{ fontWeight: 700, fontSize: 13, color: '#222', marginTop: 2 }}>{seat.column}</span>
                              <span style={{ fontSize: 11, color: '#888' }}>{formatPrice(seat.price)}</span>
                            </button>
                          );
                        })}
                        <span style={{ marginLeft: 8, fontSize: 12, color: '#888' }}>Level {tangIdx + 1}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            );
          }
          // Nếu là Nằm khoang 4 (toa 6-10)
          if (coach.type === '4-berth cabin' && coach.id >= 6 && coach.id <= 10) {
            // 7 khoang, mỗi khoang 2 tầng, mỗi tầng 2 ghế
            return (
              <div>
                <div key="empty-row-wc" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                  <span style={{ fontSize: 12, color: '#1976d2', fontWeight: 600, background: '#e3f2fd', borderRadius: 8, padding: '2px 8px' }}>Toilet</span>
                </div>
                {Array.from({ length: 7 }, (_, khoangIdx) => (
                  <div key={khoangIdx} style={{ marginBottom: 20, background: '#f7f7fa', borderRadius: 8, padding: 12 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>Compartment {khoangIdx + 1}</div>
                    {[1,0].map(tangIdx => (
                      <div key={tangIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                        {[0,1].map(seatInTang => {
                          // Mapping đúng số ghế thực tế
                          const soGheThucTe = khoangIdx * 4 + tangIdx * 2 + seatInTang + 1;
                          const seat = (coachSeats[coach.id] || []).find(s => s.column === soGheThucTe);
                          if (!seat) return <div key={seatInTang} style={{ width: 40 }} />;
                          const isOccupied = seat.status === 'occupied';
                          const seatColor = getSeatColor(coach.id, soGheThucTe - 1);
                          return (
                            <button
                              key={seat.id}
                              onClick={() => handleSeatSelect(seat.id)}
                              disabled={isOccupied}
                              style={{
                                background: '#fff',
                                border: '2px solid #e0e0e0',
                                borderRadius: 8,
                                padding: 0,
                                cursor: isOccupied ? 'not-allowed' : 'pointer',
                                opacity: isOccupied ? 0.4 : 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                position: 'relative',
                                minWidth: 40
                              }}
                            >
                              {isOccupied ? <SeatIconOccupied size={32} /> : <SeatIcon size={32} color={seatColor} />}
                              <span style={{ fontWeight: 700, fontSize: 13, color: '#222', marginTop: 2 }}>{seat.column}</span>
                              <span style={{ fontSize: 11, color: '#888' }}>{formatPrice(seat.price)}</span>
                            </button>
                          );
                        })}
                        <span style={{ marginLeft: 8, fontSize: 12, color: '#888' }}>Level {tangIdx + 1}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            );
          }
          // Mặc định: layout ghế ngồi
          if (coach.type === 'Soft seat' && coach.id === 1) {
            // Toa 1: sử dụng giá động
            return (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 16,
                  justifyItems: 'center',
                  minHeight: 320,
                  background: '#fff'
                }}
              >
                {[0, 1, 2].map(idx => <div key={'empty-row-' + idx} />)}
                <div key="empty-row-wc" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                  <span style={{ fontSize: 12, color: '#1976d2', fontWeight: 600, background: '#e3f2fd', borderRadius: 8, padding: '2px 8px' }}>Toilet</span>
                </div>
                {(coachSeats[coach.id] || []).map((seat, idx) => {
                  if (!seat) return <div key={idx} />;
                  const isOccupied = seat.status === 'occupied';
                  const seatColor = getSeatColor(coach.id, idx);
                  return (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatSelect(seat.id)}
                      disabled={isOccupied}
                      style={{
                        background: '#fff',
                        border: '2px solid #e0e0e0',
                        borderRadius: 8,
                        padding: 0,
                        cursor: isOccupied ? 'not-allowed' : 'pointer',
                        opacity: isOccupied ? 0.4 : 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                        minWidth: 40
                      }}
                    >
                      {isOccupied ? <SeatIconOccupied size={32} /> : <SeatIcon size={32} color={seatColor} />}
                      <span style={{ fontWeight: 700, fontSize: 13, color: '#222', marginTop: 2 }}>{seat.column}</span>
                      <span style={{ fontSize: 11, color: '#888' }}>{formatPrice(seat.price)}</span>
                    </button>
                  );
                })}
              </div>
            );
          }
          if (coach.type === 'Gối mềm' && coach.id === 2) {
            // Toa 2: sử dụng giá động
            return (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 16,
                  justifyItems: 'center',
                  minHeight: 320,
                  background: '#fff'
                }}
              >
                {[0, 1, 2].map(idx => <div key={'empty-row-' + idx} />)}
                <div key="empty-row-wc" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                  <span style={{ fontSize: 12, color: '#1976d2', fontWeight: 600, background: '#e3f2fd', borderRadius: 8, padding: '2px 8px' }}>Toilet</span>
                </div>
                {(coachSeats[coach.id] || []).map((seat, idx) => {
                  if (!seat) return <div key={idx} />;
                  const isOccupied = seat.status === 'occupied';
                  const seatColor = getSeatColor(coach.id, idx);
                  return (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatSelect(seat.id)}
                      disabled={isOccupied}
                      style={{
                        background: '#fff',
                        border: '2px solid #e0e0e0',
                        borderRadius: 8,
                        padding: 0,
                        cursor: isOccupied ? 'not-allowed' : 'pointer',
                        opacity: isOccupied ? 0.4 : 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                        minWidth: 40
                      }}
                    >
                      {isOccupied ? <SeatIconOccupied size={32} /> : <SeatIcon size={32} color={seatColor} />}
                      <span style={{ fontWeight: 700, fontSize: 13, color: '#222', marginTop: 2 }}>{seat.column}</span>
                      <span style={{ fontSize: 11, color: '#888' }}>{formatPrice(seat.price)}</span>
                    </button>
                  );
                })}
              </div>
            );
          }
          // Mặc định: layout ghế ngồi
          if (coach.type === '6-berth cabin' && coach.id === 4) {
            // Toa 4: sử dụng giá động
            // 7 khoang, mỗi khoang 3 tầng, mỗi tầng 2 ghế
            return (
              <div>
                <div key="empty-row-wc" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                  <span style={{ fontSize: 12, color: '#1976d2', fontWeight: 600, background: '#e3f2fd', borderRadius: 8, padding: '2px 8px' }}>Toilet</span>
                </div>
                {Array.from({ length: 7 }, (_, khoangIdx) => (
                  <div key={khoangIdx} style={{ marginBottom: 20, background: '#f7f7fa', borderRadius: 8, padding: 12 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>Compartment {khoangIdx + 1}</div>
                    {[2,1,0].map(tangIdx => (
                      <div key={tangIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                        {[0,1].map(seatInTang => {
                          const seatIdx = tangIdx*2 + seatInTang;
                          const seat = (coachSeats[coach.id] || [])[khoangIdx*6 + seatIdx];
                          if (!seat) return <div key={seatIdx} style={{ width: 40 }} />;
                          const isOccupied = seat.status === 'occupied';
                          return (
                            <button
                              key={seat.id}
                              onClick={() => handleSeatSelect(seat.id)}
                              disabled={isOccupied}
                              style={{
                                background: '#fff',
                                border: '2px solid #e0e0e0',
                                borderRadius: 8,
                                padding: 0,
                                cursor: isOccupied ? 'not-allowed' : 'pointer',
                                opacity: isOccupied ? 0.4 : 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                position: 'relative',
                                minWidth: 40
                              }}
                            >
                              {isOccupied ? <SeatIconOccupied size={32} /> : <SeatIcon size={32} color="#e0e0e0" />}
                              <span style={{ fontWeight: 700, fontSize: 13, color: '#222', marginTop: 2 }}>{seat.column}</span>
                              <span style={{ fontSize: 11, color: '#888' }}>{formatPrice(seat.price)}</span>
                            </button>
                          );
                        })}
                        <span style={{ marginLeft: 8, fontSize: 12, color: '#888' }}>Level {tangIdx + 1}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            );
          }
          // Mặc định: layout ghế ngồi
          if (coach.type === '6-berth cabin' && coach.id === 5) {
            // Toa 5: sử dụng giá động
            // 7 khoang, mỗi khoang 3 tầng, mỗi tầng 2 ghế
            return (
              <div>
                <div key="empty-row-wc" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                  <span style={{ fontSize: 12, color: '#1976d2', fontWeight: 600, background: '#e3f2fd', borderRadius: 8, padding: '2px 8px' }}>Toilet</span>
                </div>
                {Array.from({ length: 7 }, (_, khoangIdx) => (
                  <div key={khoangIdx} style={{ marginBottom: 20, background: '#f7f7fa', borderRadius: 8, padding: 12 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>Compartment {khoangIdx + 1}</div>
                    {[2,1,0].map(tangIdx => (
                      <div key={tangIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                        {[0,1].map(seatInTang => {
                          const seatIdx = tangIdx*2 + seatInTang;
                          const seat = (coachSeats[coach.id] || [])[khoangIdx*6 + seatIdx];
                          if (!seat) return <div key={seatIdx} style={{ width: 40 }} />;
                          const isOccupied = seat.status === 'occupied';
                          return (
                            <button
                              key={seat.id}
                              onClick={() => handleSeatSelect(seat.id)}
                              disabled={isOccupied}
                              style={{
                                background: '#fff',
                                border: '2px solid #e0e0e0',
                                borderRadius: 8,
                                padding: 0,
                                cursor: isOccupied ? 'not-allowed' : 'pointer',
                                opacity: isOccupied ? 0.4 : 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                position: 'relative',
                                minWidth: 40
                              }}
                            >
                              {isOccupied ? <SeatIconOccupied size={32} /> : <SeatIcon size={32} color="#e0e0e0" />}
                              <span style={{ fontWeight: 700, fontSize: 13, color: '#222', marginTop: 2 }}>{seat.column}</span>
                              <span style={{ fontSize: 11, color: '#888' }}>{formatPrice(seat.price)}</span>
                            </button>
                          );
                        })}
                        <span style={{ marginLeft: 8, fontSize: 12, color: '#888' }}>Level {tangIdx + 1}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            );
          }
          // Mặc định: layout ghế ngồi
          return (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 16,
                justifyItems: 'center',
                minHeight: 320,
                background: '#fff'
              }}
            >
              {/* Hàng rỗng phía trên */}
              {[0, 1, 2].map(idx => <div key={'empty-row-' + idx} />)}
              <div key="empty-row-wc" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                <span style={{ fontSize: 12, color: '#1976d2', fontWeight: 600, background: '#e3f2fd', borderRadius: 8, padding: '2px 8px' }}>Toilet</span>
              </div>
              {SEAT_LAYOUT.flat().map((seatIdx, idx) => {
                if (seatIdx === null) {
                  // Lối đi/trống: không render gì cả
                  return <div key={idx} />;
                }
                const seat = (coachSeats[COACHES[selectedCoachIdx].id] || [])[seatIdx];
                if (!seat) return <div key={idx} />;
                const isOccupied = seat.status === 'occupied';
                const seatColor = getSeatColor(COACHES[selectedCoachIdx].id, seatIdx);
                return (
                  <button
                    key={seat.id}
                    onClick={() => handleSeatSelect(seat.id)}
                    disabled={isOccupied}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: isOccupied ? 'not-allowed' : 'pointer',
                      opacity: isOccupied ? 0.4 : 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      minWidth: 40
                    }}
                  >
                    {isOccupied ? <SeatIconOccupied size={32} /> : <SeatIcon size={32} color={seatColor} />}
                    <span style={{ fontWeight: 700, fontSize: 13, color: '#222', marginTop: 2 }}>{seat.column}</span>
                    <span style={{ fontSize: 11, color: '#888' }}>{formatPrice(seat.price)}</span>
            </button>
                );
              })}
        </div>
          );
        })()}
      </div>
      {/* Chọn người */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 12, marginBottom: 8, boxShadow: '0 1px 4px #0001', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ fontWeight: 600, fontSize: 15 }}>Adult 1</div>
        <button style={{ background: '#e3f2fd', color: '#1976d2', border: 'none', borderRadius: 8, padding: '6px 12px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Click to select seat</button>
      </div>
      {/* Tổng tiền + nút tiếp tục */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px #0001', position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
          <span>Total for {selectedSeatIds.length} passenger(s)</span>
          <span style={{ color: '#e53935', fontWeight: 700, fontSize: 18 }}>{selectedSeatIds.reduce((total, seatId) => {
            const seat = Object.values(coachSeats).flat().find(s => s.id === seatId);
            return total + (seat?.price || 0);
          }, 0).toLocaleString()}đ</span>
        </div>
        <button
          onClick={handleProceedToPassengerInfo}
          disabled={selectedSeatIds.length < totalPassengers}
          style={{ width: '100%', background: '#0d47a1', color: '#fff', fontWeight: 700, fontSize: 18, borderRadius: 8, padding: '14px 0', border: 'none', boxShadow: '0 2px 8px #0001', cursor: selectedSeatIds.length < totalPassengers ? 'not-allowed' : 'pointer', opacity: selectedSeatIds.length < totalPassengers ? 0.6 : 1 }}
        >
          Continue
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

      {/* BỘ LỌC (COPY TỪ SearchResults) */}
      <div style={{ background: '#fff', margin: '16px auto 0 auto', width: '100%', maxWidth: 420, borderRadius: 12, padding: 16, boxShadow: '0 2px 8px #e0e0e0', marginBottom: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 10, color: '#1976d2' }}>Filter</div>
        {/* Price range with histogram and rc-slider */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>Price range</div>
          <div style={{ color: '#888', fontSize: 13, marginBottom: 18 }}>Trip price, includes all fees</div>
          {allPrices.length > 0 ? (
            <>
              {/* Histogram */}
              <div style={{ display: 'flex', alignItems: 'flex-end', height: 48, margin: '0 0 0 0', width: '100%', background: 'none', padding: 0 }}>
                {bins.map((count, i) => {
                  const binStart = minPrice + i * binWidth;
                  const binEnd = minPrice + (i + 1) * binWidth;
                  const isActive = binEnd > filterMinPrice && binStart < filterMaxPrice;
                  return (
                    <div
                      key={i}
                      style={{
                        width: `calc(${100 / BIN_COUNT}% - 2px)` ,
                        height: `${(count / maxBin) * 40 || 2}px`,
                        background: isActive ? '#ec407a' : '#e0e0e0',
                        margin: '0 1px',
                        borderRadius: 8,
                        transition: 'height 0.2s, background 0.2s',
                        opacity: count > 0 ? 1 : 0.2,
                        boxShadow: isActive ? '0 2px 8px #ec407a22' : 'none',
                        position: 'relative',
                      }}
                      title={`Price: ${Math.round(minPrice + i * binWidth).toLocaleString()}đ - ${Math.round(minPrice + (i + 1) * binWidth).toLocaleString()}đ\nSeats: ${count}`}
                    />
                  );
                })}
              </div>
              {/* Slider */}
              <div style={{ position: 'relative', width: '100%', margin: '0 0 0 0', padding: 0, background: 'none', height: 40 }}>
                <Slider
                  min={minPrice}
                  max={maxPrice}
                  value={[filterMinPrice, filterMaxPrice]}
                  onChange={(value) => {
                    if (Array.isArray(value) && value.length === 2) {
                      setFilterMinPrice(value[0]);
                      setFilterMaxPrice(value[1]);
                    }
                  }}
                  range
                  trackStyle={[{ background: '#ec407a', height: 6, borderRadius: 6 }]}
                  handleStyle={[
                    { border: '3px solid #ec407a', background: '#fff', width: 24, height: 24, marginTop: -9, boxShadow: '0 2px 8px #ec407a33' },
                    { border: '3px solid #ec407a', background: '#fff', width: 24, height: 24, marginTop: -9, boxShadow: '0 2px 8px #ec407a33' }
                  ]}
                  railStyle={{ background: '#f3f3f3', height: 6, borderRadius: 6 }}
                />
              </div>
              {/* Min/max price and label */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 8 }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ color: '#888', fontWeight: 500, fontSize: 15, marginBottom: 2 }}>Minimum</div>
                  <div style={{ color: '#222', fontWeight: 700, fontSize: 22, letterSpacing: 0.5 }}>đ{filterMinPrice.toLocaleString()}</div>
                </div>
                <div style={{ width: 32 }} />
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ color: '#888', fontWeight: 500, fontSize: 15, marginBottom: 2 }}>Maximum</div>
                  <div style={{ color: '#222', fontWeight: 700, fontSize: 22, letterSpacing: 0.5 }}>đ{filterMaxPrice.toLocaleString()}</div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ color: '#e53935', fontWeight: 600, fontSize: 15, margin: '12px 0' }}>
              No price data to filter
            </div>
          )}
        </div>
        {/* Desired behavior */}
        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', position: 'relative', fontSize: 14 }}>
          <label style={{ fontSize: 14, fontWeight: 600, marginRight: 8 }}>Desired behavior:</label>
          <label style={{ display: 'inline-flex', alignItems: 'center', marginRight: 12, cursor: 'pointer', fontSize: 14 }}>
            <input type="radio" name="behavior" checked={behavior === 'quiet'} onChange={() => setBehavior('quiet')} style={{ marginRight: 4 }} />
            Quiet
          </label>
          <label style={{ display: 'inline-flex', alignItems: 'center', marginRight: 12, cursor: 'pointer', fontSize: 14 }}>
            <input type="radio" name="behavior" checked={behavior === 'social'} onChange={() => setBehavior('social')} style={{ marginRight: 4 }} />
            Noise
          </label>
          <span style={{ marginLeft: 8, color: '#888', fontSize: 14, cursor: 'pointer' }} onClick={() => setShowBehaviorInfo(true)}>ⓘ</span>
        </div>
        <div style={{ marginBottom: 12, marginTop: -8, fontSize: 14 }}>
          <span style={{ fontSize: 14, color: '#888' }}>The color range from <span style={{ color: '#f87171', fontWeight: 600 }}>red</span> (noisy) to <span style={{ color: '#10b981', fontWeight: 600 }}>green</span> (quiet) indicates the noise level of the seat.</span>
        </div>
        {/* Desired seat/bed type */}
        <div style={{ marginBottom: 0, fontSize: 14 }}>
          <label style={{ fontSize: 14, fontWeight: 600, marginRight: 8 }}>Seat/bed type:</label>
          <label style={{ display: 'inline-flex', alignItems: 'center', marginRight: 12, cursor: 'pointer', fontSize: 14 }}>
            <input type="radio" name="seatType" checked={seatType === 'seat'} onChange={() => setSeatType('seat')} style={{ marginRight: 4 }} />
            Seat
          </label>
          <label style={{ display: 'inline-flex', alignItems: 'center', marginRight: 12, cursor: 'pointer', fontSize: 14 }}>
            <input type="radio" name="seatType" checked={seatType === 'k4'} onChange={() => setSeatType('k4')} style={{ marginRight: 4 }} />
            Compartment 4
          </label>
          <label style={{ display: 'inline-flex', alignItems: 'center', marginRight: 12, cursor: 'pointer', fontSize: 14 }}>
            <input type="radio" name="seatType" checked={seatType === 'k6'} onChange={() => setSeatType('k6')} style={{ marginRight: 4 }} />
            Compartment 6
          </label>
        </div>
        <button onClick={handleFilterSeats} style={{ marginTop: 16, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 32px', fontWeight: 700, fontSize: 15, cursor: 'pointer', width: '100%' }}>Filter</button>
      </div>

      {showBehaviorInfo && (
        <div onClick={() => setShowBehaviorInfo(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: 40, left: 0, right: 0, margin: 'auto', width: 320, background: '#fff', borderRadius: 10, boxShadow: '0 4px 24px #888', padding: 18, zIndex: 1001 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1976d2', marginBottom: 8 }}>Behavior filter meaning</div>
            <div style={{ fontSize: 14, color: '#222', marginBottom: 8 }}>
              Passengers often complain when placed in a noisy area they do not want. Choosing the right noise level helps avoid behavioral conflicts and increases trip satisfaction.<br /><br />
              If there is not enough behavior data, the system will temporarily filter by train structure (quiet/regular coach).
            </div>
            <button onClick={() => setShowBehaviorInfo(false)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginTop: 8 }}>Close</button>
          </div>
        </div>
      )}
      <style>{`
        input[type='radio'] {
          appearance: none;
          -webkit-appearance: none;
          width: 22px;
          height: 22px;
          border: 2px solid #000;
          border-radius: 50%;
          background: #fff;
          outline: none;
          cursor: pointer;
          position: relative;
          margin-right: 4px;
          vertical-align: middle;
          box-shadow: none;
          transition: border 0.2s, box-shadow 0.2s;
        }
        input[type='radio']:checked::before {
          content: '';
          display: block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #000;
          position: absolute;
          top: 3px;
          left: 3px;
        }
        input[type='radio']:not(:checked)::before {
          content: '';
          display: block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: transparent;
          position: absolute;
          top: 3px;
          left: 3px;
        }
        input[type='radio']:focus {
          box-shadow: 0 0 0 2px #1976d233;
        }
      `}</style>
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
              You should select a seat near the toilet because your group includes elderly or children.
            </div>
            <button onClick={() => setShowWcSuggest(false)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 32px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectSeat; 