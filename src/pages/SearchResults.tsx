import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import logoRailway from '../assets/logo-railway.png';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import dataTau from '../../data/data_tau.json';
import trainDataRaw from '../../data/data_tau.json';

interface Train {
  id: string;
  name: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  price: number;
  seats: number;
  recommendFor: string[];
  reason?: string;
  route: string;
  seatType: string;
  carNumber?: number;
  rowRange?: string;
  bunkLevel?: number;
  compartmentType?: string;
  stops: { station: string; time: string }[];
  delayRate?: string;
  facilities?: string[];
  segments?: { from: string; to: string; departTime: string; arriveTime: string; duration: string }[];
  from: string;
  to: string;
}

type PassengerType = 'adult' | 'child' | 'elderly' | 'student' | 'union';

// Interface cho dữ liệu JSON
interface TrainData {
  ghi_chu: string;
  routes: Route[];
}

interface Route {
  from: string;
  to: string;
  note: string;
  seat_prices?: SeatPrices;
  sleeper_prices?: SleeperPrices;
}

interface SeatPrices {
  cars: Car[];
}

interface Car {
  car_number: number;
  type: string;
  rows: Row[];
}

interface Row {
  row_range: string;
  price: number;
}

interface SleeperPrices {
  compartment_6?: CompartmentPrices;
  compartment_4?: CompartmentPrices;
}

interface CompartmentPrices {
  bunk_1?: number[];
  bunk_2?: number[];
  bunk_3?: number[];
}

// Danh sách tàu hardcode theo yêu cầu
// const HARDCODED_TRAINS = [
//   // Hà Nội -> Sài Gòn
//   {
//     id: 'SE1', name: 'Tàu SE1',
//     from: 'Hà Nội', to: 'Sài Gòn',
//     stops: [
//       { station: 'Hà Nội', time: '20:50' },
//       { station: 'Vinh', time: '02:35 (+1)' },
//       { station: 'Đà Nẵng', time: '12:27 (+1)' },
//       { station: 'Nha Trang', time: '21:44 (+1)' },
//       { station: 'Sài Gòn', time: '05:45 (+2)' },
//     ],
//     segments: [
//       { from: 'Hà Nội', to: 'Vinh', departTime: '20:50', arriveTime: '02:35 (+1)', duration: '5h 45m' },
//       { from: 'Hà Nội', to: 'Đà Nẵng', departTime: '20:50', arriveTime: '12:27 (+1)', duration: '15h 37m' },
//       { from: 'Hà Nội', to: 'Nha Trang', departTime: '20:50', arriveTime: '21:44 (+1)', duration: '24h 54m' },
//       { from: 'Hà Nội', to: 'Sài Gòn', departTime: '20:50', arriveTime: '05:45 (+2)', duration: '32h 55m' },
//     ],
//     duration: '32h 55m', price: 900000,
//     seats: 45, recommendFor: [], route: 'Hà Nội → Sài Gòn', seatType: 'Ngồi mềm',
//     delayRate: '2.5%',
//     facilities: ['Nhà ăn', 'Nhà vệ sinh', 'Kiosk', 'Điều hòa', 'Free wifi', 'Ổ cắm điện']
//   },
//   {
//     id: 'SE3', name: 'Tàu SE3',
//     from: 'Hà Nội', to: 'Sài Gòn',
//     stops: [
//       { station: 'Hà Nội', time: '19:20' },
//       { station: 'Vinh', time: '01:05 (+1)' },
//       { station: 'Đà Nẵng', time: '10:51 (+1)' },
//       { station: 'Nha Trang', time: '21:09 (+1)' },
//       { station: 'Sài Gòn', time: '05:15 (+2)' },
//     ],
//     segments: [
//       { from: 'Hà Nội', to: 'Vinh', departTime: '19:20', arriveTime: '01:05 (+1)', duration: '5h 45m' },
//       { from: 'Hà Nội', to: 'Đà Nẵng', departTime: '19:20', arriveTime: '10:51 (+1)', duration: '15h 31m' },
//       { from: 'Hà Nội', to: 'Nha Trang', departTime: '19:20', arriveTime: '21:09 (+1)', duration: '25h 49m' },
//       { from: 'Hà Nội', to: 'Sài Gòn', departTime: '19:20', arriveTime: '05:15 (+2)', duration: '33h 55m' },
//     ],
//     duration: '33h 55m', price: 900000,
//     seats: 45, recommendFor: [], route: 'Hà Nội → Sài Gòn', seatType: 'Ngồi mềm',
//     delayRate: '2.8%',
//     facilities: ['Nhà ăn', 'Kiosk', 'Điều hòa', 'Điều chỉnh ghế ngồi']
//   },
//   {
//     id: 'SE5', name: 'Tàu SE5',
//     from: 'Hà Nội', to: 'Sài Gòn',
//     stops: [
//       { station: 'Hà Nội', time: '08:55' },
//       { station: 'Vinh', time: '14:53' },
//       { station: 'Đà Nẵng', time: '01:46 (+1)' },
//       { station: 'Nha Trang', time: '11:28 (+1)' },
//       { station: 'Sài Gòn', time: '20:20 (+1)' },
//     ],
//     segments: [
//       { from: 'Hà Nội', to: 'Vinh', departTime: '08:55', arriveTime: '14:53', duration: '5h 58m' },
//       { from: 'Hà Nội', to: 'Đà Nẵng', departTime: '08:55', arriveTime: '01:46 (+1)', duration: '16h 51m' },
//       { from: 'Hà Nội', to: 'Nha Trang', departTime: '08:55', arriveTime: '11:28 (+1)', duration: '26h 33m' },
//       { from: 'Hà Nội', to: 'Sài Gòn', departTime: '08:55', arriveTime: '20:20 (+1)', duration: '35h 25m' },
//     ],
//     duration: '35h 25m', price: 900000,
//     seats: 45, recommendFor: [], route: 'Hà Nội → Sài Gòn', seatType: 'Ngồi mềm',
//     delayRate: '2.2%',
//     facilities: ['Nhà ăn', 'Nhà vệ sinh', 'Điều hòa', 'Điều chỉnh ghế ngồi']
//   },
//   {
//     id: 'SE7', name: 'Tàu SE7',
//     from: 'Hà Nội', to: 'Sài Gòn',
//     stops: [
//       { station: 'Hà Nội', time: '06:00' },
//       { station: 'Vinh', time: '12:10' },
//       { station: 'Đà Nẵng', time: '23:03' },
//       { station: 'Nha Trang', time: '09:16 (+1)' },
//       { station: 'Sài Gòn', time: '17:35 (+1)' },
//     ],
//     segments: [
//       { from: 'Hà Nội', to: 'Vinh', departTime: '06:00', arriveTime: '12:10', duration: '6h 10m' },
//       { from: 'Hà Nội', to: 'Đà Nẵng', departTime: '06:00', arriveTime: '23:03', duration: '17h 03m' },
//       { from: 'Hà Nội', to: 'Nha Trang', departTime: '06:00', arriveTime: '09:16 (+1)', duration: '27h 16m' },
//       { from: 'Hà Nội', to: 'Sài Gòn', departTime: '06:00', arriveTime: '17:35 (+1)', duration: '35h 35m' },
//     ],
//     duration: '35h 35m', price: 900000,
//     seats: 45, recommendFor: [], route: 'Hà Nội → Sài Gòn', seatType: 'Ngồi mềm',
//     delayRate: '3.0%',
//     facilities: ['Nhà ăn', 'Nhà vệ sinh', 'Điều hòa', 'Free wifi', 'Điều chỉnh ghế ngồi']
//   },
//   {
//     id: 'SE9', name: 'Tàu SE9',
//     from: 'Hà Nội', to: 'Sài Gòn',
//     stops: [
//       { station: 'Hà Nội', time: '12:50' },
//       { station: 'Vinh', time: '18:58' },
//       { station: 'Đà Nẵng', time: '06:29 (+1)' },
//       { station: 'Nha Trang', time: '17:45 (+1)' },
//       { station: 'Sài Gòn', time: '03:40 (+2)' },
//     ],
//     segments: [
//       { from: 'Hà Nội', to: 'Vinh', departTime: '12:50', arriveTime: '18:58', duration: '6h 08m' },
//       { from: 'Hà Nội', to: 'Đà Nẵng', departTime: '12:50', arriveTime: '06:29 (+1)', duration: '17h 39m' },
//       { from: 'Hà Nội', to: 'Nha Trang', departTime: '12:50', arriveTime: '17:45 (+1)', duration: '28h 55m' },
//       { from: 'Hà Nội', to: 'Sài Gòn', departTime: '12:50', arriveTime: '03:40 (+2)', duration: '38h 50m' },
//     ],
//     duration: '38h 50m', price: 900000,
//     seats: 45, recommendFor: [], route: 'Hà Nội → Sài Gòn', seatType: 'Ngồi mềm',
//     delayRate: '3.2%',
//     facilities: ['Nhà ăn', 'Nhà vệ sinh', 'Điều hòa', 'Free wifi']
//   },
//   // Sài Gòn -> Hà Nội
//   {
//     id: 'SE2', name: 'Tàu SE2',
//     from: 'Sài Gòn', to: 'Hà Nội',
//     stops: [
//       { station: 'Sài Gòn', time: '20:35' },
//       { station: 'Nha Trang', time: '03:50 (+1)' },
//       { station: 'Đà Nẵng', time: '13:33 (+1)' },
//       { station: 'Vinh', time: '23:19 (+1)' },
//       { station: 'Hà Nội', time: '05:45 (+2)' },
//     ],
//     segments: [
//       { from: 'Sài Gòn', to: 'Nha Trang', departTime: '20:35', arriveTime: '03:50 (+1)', duration: '7h 15m' },
//       { from: 'Sài Gòn', to: 'Đà Nẵng', departTime: '20:35', arriveTime: '13:33 (+1)', duration: '16h 58m' },
//       { from: 'Sài Gòn', to: 'Vinh', departTime: '20:35', arriveTime: '23:19 (+1)', duration: '26h 44m' },
//       { from: 'Sài Gòn', to: 'Hà Nội', departTime: '20:35', arriveTime: '05:45 (+2)', duration: '33h 10m' },
//     ],
//     duration: '33h 10m', price: 900000,
//     seats: 45, recommendFor: [], route: 'Sài Gòn → Hà Nội', seatType: 'Ngồi mềm',
//     delayRate: '3.1%',
//     facilities: ['Nhà vệ sinh', 'Điều hòa', 'Free wifi', 'Ổ cắm điện']
//   },
//   {
//     id: 'SE4', name: 'Tàu SE4',
//     from: 'Sài Gòn', to: 'Hà Nội',
//     stops: [
//       { station: 'Sài Gòn', time: '19:25' },
//       { station: 'Nha Trang', time: '02:52 (+1)' },
//       { station: 'Đà Nẵng', time: '12:38 (+1)' },
//       { station: 'Vinh', time: '22:31 (+1)' },
//       { station: 'Hà Nội', time: '04:45 (+2)' },
//     ],
//     segments: [
//       { from: 'Sài Gòn', to: 'Nha Trang', departTime: '19:25', arriveTime: '02:52 (+1)', duration: '7h 27m' },
//       { from: 'Sài Gòn', to: 'Đà Nẵng', departTime: '19:25', arriveTime: '12:38 (+1)', duration: '17h 13m' },
//       { from: 'Sài Gòn', to: 'Vinh', departTime: '19:25', arriveTime: '22:31 (+1)', duration: '27h 06m' },
//       { from: 'Sài Gòn', to: 'Hà Nội', departTime: '19:25', arriveTime: '04:45 (+2)', duration: '33h 20m' },
//     ],
//     duration: '33h 20m', price: 900000,
//     seats: 45, recommendFor: [], route: 'Sài Gòn → Hà Nội', seatType: 'Ngồi mềm',
//     delayRate: '3.5%',
//     facilities: ['Nhà vệ sinh', 'Kiosk', 'Điều hòa', 'Free wifi']
//   },
//   {
//     id: 'SE6', name: 'Tàu SE6',
//     from: 'Sài Gòn', to: 'Hà Nội',
//     stops: [
//       { station: 'Sài Gòn', time: '08:40' },
//       { station: 'Nha Trang', time: '16:12' },
//       { station: 'Đà Nẵng', time: '02:42 (+1)' },
//       { station: 'Vinh', time: '12:42 (+1)' },
//       { station: 'Hà Nội', time: '19:12 (+1)' },
//     ],
//     segments: [
//       { from: 'Sài Gòn', to: 'Nha Trang', departTime: '08:40', arriveTime: '16:12', duration: '7h 32m' },
//       { from: 'Sài Gòn', to: 'Đà Nẵng', departTime: '08:40', arriveTime: '02:42 (+1)', duration: '18h 02m' },
//       { from: 'Sài Gòn', to: 'Vinh', departTime: '08:40', arriveTime: '12:42 (+1)', duration: '28h 02m' },
//       { from: 'Sài Gòn', to: 'Hà Nội', departTime: '08:40', arriveTime: '19:12 (+1)', duration: '34h 32m' },
//     ],
//     duration: '34h 32m', price: 900000,
//     seats: 45, recommendFor: [], route: 'Sài Gòn → Hà Nội', seatType: 'Ngồi mềm',
//     delayRate: '2.9%',
//     facilities: ['Nhà vệ sinh', 'Kiosk', 'Điều hòa', 'Free wifi', 'Ổ cắm điện']
//   },
//   {
//     id: 'SE8', name: 'Tàu SE8',
//     from: 'Sài Gòn', to: 'Hà Nội',
//     stops: [
//       { station: 'Sài Gòn', time: '06:00' },
//       { station: 'Nha Trang', time: '13:20' },
//       { station: 'Đà Nẵng', time: '00:09 (+1)' },
//       { station: 'Vinh', time: '10:12 (+1)' },
//       { station: 'Hà Nội', time: '16:10 (+1)' },
//     ],
//     segments: [
//       { from: 'Sài Gòn', to: 'Nha Trang', departTime: '06:00', arriveTime: '13:20', duration: '7h 20m' },
//       { from: 'Sài Gòn', to: 'Đà Nẵng', departTime: '06:00', arriveTime: '00:09 (+1)', duration: '18h 09m' },
//       { from: 'Sài Gòn', to: 'Vinh', departTime: '06:00', arriveTime: '10:12 (+1)', duration: '28h 12m' },
//       { from: 'Sài Gòn', to: 'Hà Nội', departTime: '06:00', arriveTime: '16:10 (+1)', duration: '34h 10m' },
//     ],
//     duration: '34h 10m', price: 900000,
//     seats: 45, recommendFor: [], route: 'Sài Gòn → Hà Nội', seatType: 'Ngồi mềm',
//     delayRate: '2.7%',
//     facilities: ['Nhà vệ sinh', 'Kiosk', 'Điều hòa', 'Ổ cắm điện', 'Điều chỉnh ghế ngồi']
//   },
//   {
//     id: 'SE10', name: 'Tàu SE10',
//     from: 'Sài Gòn', to: 'Hà Nội',
//     stops: [
//       { station: 'Sài Gòn', time: '13:20' },
//       { station: 'Nha Trang', time: '22:30' },
//       { station: 'Đà Nẵng', time: '09:06 (+1)' },
//       { station: 'Vinh', time: '20:55 (+1)' },
//       { station: 'Hà Nội', time: '04:35 (+2)' },
//     ],
//     segments: [
//       { from: 'Sài Gòn', to: 'Nha Trang', departTime: '13:20', arriveTime: '22:30', duration: '9h 10m' },
//       { from: 'Sài Gòn', to: 'Đà Nẵng', departTime: '13:20', arriveTime: '09:06 (+1)', duration: '19h 46m' },
//       { from: 'Sài Gòn', to: 'Vinh', departTime: '13:20', arriveTime: '20:55 (+1)', duration: '31h 35m' },
//       { from: 'Sài Gòn', to: 'Hà Nội', departTime: '13:20', arriveTime: '04:35 (+2)', duration: '39h 15m' },
//     ],
//     duration: '39h 15m', price: 900000,
//     seats: 45, recommendFor: [], route: 'Sài Gòn → Hà Nội', seatType: 'Ngồi mềm',
//     delayRate: '3.3%',
//     facilities: ['Nhà ăn', 'Nhà vệ sinh', 'Điều hòa', 'Free wifi']
//   },
// ];

// Mock data cơ sở vật chất cho từng loại tàu
const FACILITIES: Record<string, any> = {
  SE1: { newness: 4.0, lastUpgrade: '2016', noise: 'Trung bình', soundproof: 4.0, antiShake: 3.5, acNewness: 4.0, toilet: 4.0, food: 3.5 },
  SE2: { newness: 4.0, lastUpgrade: '2016', noise: 'Trung bình', soundproof: 4.0, antiShake: 3.5, acNewness: 4.0, toilet: 4.0, food: 3.5 },
  SE3: { newness: 4.0, lastUpgrade: '2015', noise: 'Thấp', soundproof: 4.0, antiShake: 4.0, acNewness: 4.0, toilet: 4.0, food: 4.0 },
  SE4: { newness: 4.0, lastUpgrade: '2015', noise: 'Thấp', soundproof: 4.0, antiShake: 4.0, acNewness: 4.0, toilet: 4.0, food: 4.0 },
  SE5: { newness: 4.0, lastUpgrade: '2016', noise: 'Thấp', soundproof: 4.0, antiShake: 4.0, acNewness: 4.0, toilet: 4.0, food: 4.5 },
  SE6: { newness: 4.0, lastUpgrade: '2016', noise: 'Thấp', soundproof: 4.0, antiShake: 4.0, acNewness: 4.0, toilet: 4.0, food: 4.5 },
  SE7: { newness: 2.0, lastUpgrade: '2016', noise: 'Ồn', soundproof: 2.0, antiShake: 2.5, acNewness: 2.0, toilet: 2.0, food: 2.5 },
  SE8: { newness: 2.0, lastUpgrade: '2016', noise: 'Ồn', soundproof: 2.0, antiShake: 2.0, acNewness: 2.0, toilet: 2.0, food: 2.0 },
  SE9: { newness: 3.0, lastUpgrade: 'Không rõ', noise: 'Trung bình', soundproof: 3.0, antiShake: 3.0, acNewness: 3.0, toilet: 3.0, food: 3.0 },
  SE10: { newness: 3.0, lastUpgrade: 'Không rõ', noise: 'Trung bình', soundproof: 3.0, antiShake: 3.0, acNewness: 3.0, toilet: 3.0, food: 3.0 },
  SE22: { newness: 5.0, lastUpgrade: '04/2024', noise: 'Rất thấp', soundproof: 5.0, antiShake: 5.0, acNewness: 5.0, toilet: 5.0, food: 5.0 },
};

// Thêm mapping tiện ích sang tên tiếng Việt và icon đẹp
const FACILITY_DISPLAY_MAP: Record<string, { label: string; icon: string }> = {
  antiShake: { label: 'Anti-shake', icon: '🚄' },
  acNewness: { label: 'New air conditioner', icon: '❄️' },
  toilet: { label: 'Toilet', icon: '🛁' },
  food: { label: 'Dining/Food', icon: '🍱' },
};

// Định nghĩa interface cho review summary
interface ReviewSummary {
  avg: number | string;
  count: number;
  stars: { [key: number]: number };
  sample: string[];
  reviews: { reviewer: string; text: string }[];
}

// Mock data tổng hợp đánh giá cho từng mã tàu
const REVIEW_SUMMARY: Record<string, ReviewSummary> = {
  SE1: {
    avg: 4.7,
    count: 391,
    stars: { 5: 320, 4: 50, 3: 10, 2: 6, 1: 5 },
    sample: [
      'Tàu sạch sẽ, nhân viên thân thiện.',
      'Chuyến đi đúng giờ, tiện nghi ổn.'
    ],
    reviews: [
      { reviewer: 'ph**ng', text: 'Mình không nói chuyện với ai, nhưng chuyến đi rất bình an.' },
      { reviewer: 'du*le', text: 'Toilet k sạch lắm cuối chuyến nhưng lúc đầu ổn.' }
    ]
  },
  SE2: {
    avg: 4.3,
    count: 210,
    stars: { 5: 120, 4: 60, 3: 20, 2: 5, 1: 5 },
    sample: [
      'Tàu hơi cũ nhưng dịch vụ tốt.',
      'Nhân viên hỗ trợ nhiệt tình.'
    ],
    reviews: [
      { reviewer: 'vy**an', text: 'Chăn gối sạch, không có mùi hôi.' },
      { reviewer: 'ki**hi', text: 'Mình không nói chuyện với ai, nhưng chuyến đi rất bình an.' }
    ]
  },
  SE3: {
    avg: 4.0,
    count: 150,
    stars: { 5: 70, 4: 50, 3: 20, 2: 5, 1: 5 },
    sample: [
      'Tàu đông, hơi ồn.',
      'Chuyến đi ổn, giá hợp lý.'
    ],
    reviews: [
      { reviewer: 'bi**ph', text: 'Cảm nhận chung là Mình ngủ ngon nhờ tàu ít rung lắc.' },
      { reviewer: 'nh**oa', text: 'Tàu chạy đều, không bị xóc nhiều, dễ thư giãn.' }
    ]
  },
  SE4: {
    avg: 3.8,
    count: 80,
    stars: { 5: 30, 4: 30, 3: 10, 2: 5, 1: 5 },
    sample: [
      'Tàu cũ, cần nâng cấp.',
      'Nhân viên thân thiện.'
    ],
    reviews: [
      { reviewer: 'bi**ph', text: 'Tàu chạy đều, không bị xóc nhiều, dễ thư giãn.' },
      { reviewer: 'ki**hi', text: 'Gặp bạn cùng khoang dễ thương nên chuyến đi vui hơn.' }
    ]
  },
  SE5: {
    avg: 4.2,
    count: 60,
    stars: { 5: 25, 4: 20, 3: 10, 2: 3, 1: 2 },
    sample: [
      'Tàu hơi cũ nhưng chạy êm.',
      'Có bàn treo nhỏ khá tiện để ăn hoặc để điện thoại.'
    ],
    reviews: [
      { reviewer: 'tr***do', text: 'Tàu hơi cũ nhưng chạy êm. Nhưng cũng không đến nỗi tệ.' },
      { reviewer: 'la***am', text: 'Ổ cắm nằm trên cao nên không tiện cắm.' }
    ]
  },
  SE6: {
    avg: 4.1,
    count: 55,
    stars: { 5: 20, 4: 18, 3: 10, 2: 4, 1: 3 },
    sample: [
      'Cửa sổ sạch nên ngắm cảnh khá thích.',
      'Nhân viên hỗ trợ rất nhanh khi có sự cố.'
    ],
    reviews: [
      { reviewer: 'tu***nh', text: 'Cửa sổ sạch nên ngắm cảnh khá thích. Mình vẫn sẽ đi lại nếu cần.' },
      { reviewer: 'an*ng', text: 'nv tốt, có người tựa giúp mẹ mình xuống ga.' }
    ]
  },
  SE7: {
    avg: 3.7,
    count: 40,
    stars: { 5: 10, 4: 15, 3: 10, 2: 3, 1: 2 },
    sample: [
      'Leo lên tầng 3 hơi cực, nhưng nằm được thì ok.',
      'Ghế hơi cứng, phải gác chân lên balo cho đỡ mỏi.'
    ],
    reviews: [
      { reviewer: 'ho*****en', text: 'leo lên tầng 3 hơi cực, nhưng nằm được thì ok.' },
      { reviewer: 'ho*****en', text: 'Ghế hơi cứng, phải gác chân lên balo cho đỡ mỏi.' }
    ]
  },
  SE8: {
    avg: 3.9,
    count: 35,
    stars: { 5: 12, 4: 10, 3: 8, 2: 3, 1: 2 },
    sample: [
      'Khoang kín vừa phải, cảm giác an toàn và yên tĩnh.',
      'Đi đêm nên mình ngủ luôn, thức dậy tới nơi luôn.'
    ],
    reviews: [
      { reviewer: 'nh**oa', text: 'Khoang kín vừa phải, cảm giác an toàn và yên tĩnh.' },
      { reviewer: 'th**le', text: 'Đi đêm nên mình ngủ luôn, thức dậy tới nơi luôn.' }
    ]
  },
  SE9: {
    avg: 3.6,
    count: 20,
    stars: { 5: 5, 4: 6, 3: 5, 2: 2, 1: 2 },
    sample: [
      'Khoang giường thoáng, không bị bí.',
      'Gặp bạn cùng khoang dễ thương nên chuyến đi vui hơn.'
    ],
    reviews: [
      { reviewer: 'mi******en', text: 'Khoang giường thoáng, không bị bí.' },
      { reviewer: 'hu****ng', text: 'Gặp bạn cùng khoang dễ thương nên chuyến đi vui hơn.' }
    ]
  },
  SE10: {
    avg: 3.8,
    count: 18,
    stars: { 5: 4, 4: 6, 3: 5, 2: 2, 1: 1 },
    sample: [
      'Mình đi một mình, khoang 6 giường tầng 2 khá chill.',
      'Toa hơi cũ, nhưng tàu chạy êm.'
    ],
    reviews: [
      { reviewer: 'th**le', text: 'Mình đi một mình, khoang 6 giường tầng 2 khá chill.' },
      { reviewer: 'tu***nh', text: 'Toa hơi cũ, nhưng tàu chạy êm.' }
    ]
  },
  SE22: {
    avg: 4.5,
    count: 10,
    stars: { 5: 7, 4: 2, 3: 1, 2: 0, 1: 0 },
    sample: [
      'Chăn gối sạch, không có mùi hôi.',
      'Đi từ sáng sớm nên hơi mệt, nhưng toa yên tĩnh, không ồn ào.'
    ],
    reviews: [
      { reviewer: 'lo**do', text: 'Chăn gối sạch, không có mùi hôi.' },
      { reviewer: 'vy**an', text: 'Đi từ sáng sớm nên hơi mệt, nhưng toa yên tĩnh, không ồn ào.' }
    ]
  }
};

// TỰ ĐỘNG IMPORT NHIỀU ĐÁNH GIÁ (nếu có file all_reviews.json)
let allReviews: Record<string, { reviewer: string; text: string }[]> = {};
try {
  // @ts-ignore
  allReviews = require('../../all_reviews.json');
} catch (e) {
  // Nếu không có file hoặc lỗi import thì bỏ qua
}
Object.keys(REVIEW_SUMMARY).forEach(code => {
  if (allReviews[code]) {
    REVIEW_SUMMARY[code].reviews = allReviews[code];
    REVIEW_SUMMARY[code].count = allReviews[code].length;
  }
});

// Đưa khai báo interface lên đầu file
interface DataTauTrain {
  train_code: string;
  stations: Record<string, {
    station_name: string;
    km: number;
    departure_time: string;
    arrival_time: string;
    day_offset: number;
  }>;
}
interface DataTauDirection {
  direction: string;
  trains: { [key: string]: DataTauTrain };
}

// Hàm chuyển đổi dữ liệu từ dataTau sang Train[]
function parseTrainsFromDataTau(from: string, to: string): Train[] {
  const trains: Train[] = [];
  const normalize = (str: string) => str.replace(/^Ga /i, '').replace('TP.HCM', 'Sài Gòn').replace('TP. HCM', 'Sài Gòn').replace('Nha Trang - Khánh Hòa', 'Nha Trang').replace('Sài Gòn (TP.HCM)', 'Sài Gòn').trim().toLowerCase();
  const fromNorm = normalize(from);
  const toNorm = normalize(to);

  // Duyệt qua tất cả các tuyến trong dataTau.train_schedules
  for (const routeKey in dataTau.train_schedules as Record<string, DataTauDirection>) {
    const route = (dataTau.train_schedules as Record<string, DataTauDirection>)[routeKey];
    for (const trainKey in route.trains) {
      const train = route.trains[trainKey] as any;
      const stationsArr = Object.values(train.stations) as Array<{
        station_name: string;
        km: number;
        departure_time: string;
        arrival_time: string;
        day_offset: number;
      }>;
      // Tìm index ga đi và ga đến
      const fromIdx = stationsArr.findIndex((s) => normalize(s.station_name) === fromNorm);
      const toIdx = stationsArr.findIndex((s) => normalize(s.station_name) === toNorm);
      if (fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx) {
        const depart = stationsArr[fromIdx];
        const arrive = stationsArr[toIdx];
        // Tính duration
        const getMinutes = (t: string, d: number) => {
          const [h, m] = t.split(":").map(Number);
          return d * 24 * 60 + h * 60 + m;
        };
        const durationMin = getMinutes(arrive.arrival_time, arrive.day_offset) - getMinutes(depart.departure_time, depart.day_offset);
        const hours = Math.floor(durationMin / 60);
        const mins = durationMin % 60;
        const durationStr = `${hours}h ${mins}m`;
        // Tạo stops
        const stops = stationsArr.slice(fromIdx, toIdx + 1).map((s) => ({ station: (s as any).station_name, time: (s as any).arrival_time + ((s as any).day_offset > 0 ? ` (+${(s as any).day_offset})` : "") }));
        trains.push({
          id: train.train_code,
          name: `Tàu ${train.train_code}`,
          from: depart.station_name,
          to: arrive.station_name,
          departTime: depart.departure_time + (depart.day_offset > 0 ? ` (+${depart.day_offset})` : ""),
          arriveTime: arrive.arrival_time + (arrive.day_offset > 0 ? ` (+${arrive.day_offset})` : ""),
          duration: durationStr,
          price: 900000, // Có thể cập nhật giá động nếu có
          seats: 45,
          recommendFor: [],
          route: `${depart.station_name} → ${arrive.station_name}`,
          seatType: 'Ngồi mềm',
          stops,
          segments: [],
        });
      }
    }
  }
  return trains;
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
    return null;
  }
}

// Hàm lấy tất cả loại giá và id ghế từ file json
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
  const norm = (s: string) => s.trim().toUpperCase().replace('TP.HCM', 'SÀI GÒN');
  from = norm(from);
  to = norm(to);
  // Tìm hành trình phù hợp
  const fare = priceData.train_fares.find((f: any) => norm(f.origin) === from && norm(f.destination) === to);
  if (!fare) return result;
  // Ngồi mềm
  if (fare.fares.seating) {
    fare.fares.seating.forEach((seat: any) => {
      seat.rows.forEach((row: any) => {
        row.row_numbers.forEach((num: number) => {
          result.push({
            id: `${trainCode}-ngoi-${seat.car_number}-${num}`,
            type: seat.type === 'noise' ? 'Ngồi mềm (ồn)' : 'Ngồi mềm (yên tĩnh)',
            car: seat.car_number,
            row: num,
            price: row.price
          });
        });
      });
    });
  }
  // Khoang 6
  if (fare.fares.sleeper_6_berth) {
    fare.fares.sleeper_6_berth.forEach((car: any) => {
      car.rows.forEach((row: any) => {
        row.row_numbers.forEach((num: number) => {
          result.push({
            id: `${trainCode}-k6-${car.car_number}-${num}`,
            type: `Nằm khoang 6 (toa ${car.car_number})`,
            car: car.car_number,
            row: num,
            price: row.price
          });
        });
      });
    });
  }
  // Khoang 4
  if (fare.fares.sleeper_4_berth) {
    fare.fares.sleeper_4_berth.forEach((car: any) => {
      car.rows.forEach((row: any) => {
        row.row_numbers.forEach((num: number) => {
          result.push({
            id: `${trainCode}-k4-${car.car_number}-${num}`,
            type: `Nằm khoang 4 (toa ${car.car_number})`,
            car: car.car_number,
            row: num,
            price: row.price
          });
        });
      });
    });
  }
  return result;
}

function getTrainsBetweenStations(from: string, to: string) {
  const trains: any[] = [];
  for (const directionKey in dataTau.train_schedules as any) {
    const direction = (dataTau.train_schedules as any)[directionKey];
    for (const trainKey in direction.trains as any) {
      const train = (direction.trains as any)[trainKey];
      const stationsArr = Object.values(train.stations) as any[];
      const fromIdx = stationsArr.findIndex((s: any) => s.station_name === from);
      const toIdx = stationsArr.findIndex((s: any) => s.station_name === to);
      if (fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx) {
        trains.push({
          train_code: train.train_code,
          depart: stationsArr[fromIdx],
          arrive: stationsArr[toIdx],
        });
      }
    }
  }
  return trains;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const [dynamicPrices, setDynamicPrices] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      setLoading(true);
      const prices: Record<string, any> = {};
      for (const code of DYNAMIC_PRICE_TRAINS) {
        const data = await loadTrainPriceData(code);
        prices[code] = data;
      }
      if (!cancelled) setDynamicPrices(prices);
      setLoading(false);
    }
    fetchAll();
    return () => { cancelled = true; };
  }, [from, to]);

  const [otherTrains, setOtherTrains] = useState<Train[]>([]);
  // Xóa state sortBy
  // const [sortBy, setSortBy] = useState<'time' | 'price'>('time');
  const [showBehaviorInfo, setShowBehaviorInfo] = useState(false);

  // State cho khoảng giá (tách giá trị gốc và giá trị lọc)
  const [defaultMinPrice, setDefaultMinPrice] = useState(100000);
  const [defaultMaxPrice, setDefaultMaxPrice] = useState(2000000);
  const [filterMinPrice, setFilterMinPrice] = useState(100000);
  const [filterMaxPrice, setFilterMaxPrice] = useState(2000000);

  // State cho loại ghế/giường
  const [seatChecked, setSeatChecked] = useState(false);
  const [comp4Checked, setComp4Checked] = useState(false);
  const [comp6Checked, setComp6Checked] = useState(false);

  // State cho hành vi mong muốn
  const [quietChecked, setQuietChecked] = useState(false);
  const [socialChecked, setSocialChecked] = useState(false);

  // State cho input time
  const [arriveTimeFrom, setArriveTimeFrom] = useState('');
  const [arriveTimeTo, setArriveTimeTo] = useState('');
  const [departTimeFrom, setDepartTimeFrom] = useState('');
  const [departTimeTo, setDepartTimeTo] = useState('');

  // State cho sắp xếp
  const [sortCriterion, setSortCriterion] = useState('duration');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Responsive: xác định nếu là mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;

  // Parse passenger data (dùng useMemo để tránh tạo object mới mỗi lần render)
  const passenger: Record<PassengerType, number> = useMemo(() => JSON.parse(searchParams.get('passenger') || '{}'), [searchParams]);

  // State cho review modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTrain, setModalTrain] = useState<any>(null);
  // Thêm state cho modal danh sách đánh giá
  const [reviewListOpen, setReviewListOpen] = useState(false);
  // Thay vì mở modal phụ, dùng state để hiện/ẩn danh sách đánh giá trong modal chính
  const [showReviewList, setShowReviewList] = useState(false);

  // Tìm min/max giá thực tế từ danh sách tàu
  const getMinMaxPrice = (trains: Train[]) => {
    if (!trains || trains.length === 0) return [100000, 2000000];
    let min = trains[0].price;
    let max = trains[0].price;
    for (const t of trains) {
      if (t.price < min) min = t.price;
      if (t.price > max) max = t.price;
    }
    return [min, max];
  };

  // useEffect cập nhật min/max theo otherTrains
  useEffect(() => {
    if (otherTrains.length > 0) {
      const [realMin, realMax] = getMinMaxPrice(otherTrains);
      setDefaultMinPrice(realMin);
      setDefaultMaxPrice(realMax);
      setFilterMinPrice(realMin);
      setFilterMaxPrice(realMax);
    }
  }, [otherTrains]);

  // Khởi tạo dữ liệu tàu khi component mount
  useEffect(() => {
    const trains = parseTrainsFromDataTau(from, to);
    // Bổ sung trường facilities cho từng train nếu thiếu
    trains.forEach(train => {
      // Lấy mã tàu (SE1, SE2, ...)
      const code = train.id.split('-')[0];
      // Nếu train chưa có trường facilities, lấy từ HARDCODED_TRAINS hoặc gán mặc định
      if (!train.facilities) {
        // Nếu có HARDCODED_TRAINS thì lấy từ đó, nếu không thì lấy từ FACILITIES
        // @ts-ignore
        const hardcoded = (typeof HARDCODED_TRAINS !== 'undefined' ? HARDCODED_TRAINS : []);
        let found = hardcoded.find && hardcoded.find((t: { id: string }) => t.id === code);
        if (found && found.facilities) train.facilities = found.facilities;
        else if (FACILITIES[code]) train.facilities = Object.keys(FACILITIES[code]);
        else train.facilities = [];
      }
    });
    setOtherTrains(trains);
  }, [from, to, searchParams.get('departDate'), searchParams.get('returnDate'), searchParams.get('isRoundTrip'), searchParams.get('passenger')]);

  // Hàm tính số phút giữa hai thời điểm dạng 'hh:mm (+n)'
  function diffMinutes(start: string, end: string): number {
    // Tách giờ, phút, ngày cộng (nếu có)
    const parse = (str: string) => {
      const match = str.match(/(\d{2}):(\d{2})(?: \(\+?(\d)\))?/);
      if (!match) return { h: 0, m: 0, d: 0 };
      return {
        h: parseInt(match[1], 10),
        m: parseInt(match[2], 10),
        d: match[3] ? parseInt(match[3], 10) : 0
      };
    };
    const s = parse(start);
    const e = parse(end);
    return (e.d - s.d) * 24 * 60 + (e.h - s.h) * 60 + (e.m - s.m);
  }

  // Hàm tạo danh sách tàu từ dữ liệu JSON
  
  // Hàm chọn tàu
  const handleSelectTrain = (train: Train) => {
    console.log('=== DEBUG: handleSelectTrain được gọi ===');
    console.log('Train được chọn:', train);
    console.log('Dữ liệu từ URL params:', {
      from,
      to,
      departDate: searchParams.get('departDate'),
      returnDate: searchParams.get('returnDate'),
      isRoundTrip: searchParams.get('isRoundTrip'),
      passenger
    });
    
    // Chuyển đến trang chọn chỗ ngồi với đầy đủ thông tin
    const params = new URLSearchParams({
      trainId: train.id,
      trainName: train.name,
      from: from,
      to: to,
      departDate: searchParams.get('departDate') || '',
      returnDate: searchParams.get('returnDate') || '',
      isRoundTrip: searchParams.get('isRoundTrip') || 'false',
      adult: passenger.adult.toString(),
      child: passenger.child.toString(),
      elderly: passenger.elderly.toString(),
      student: passenger.student.toString(),
      union: passenger.union.toString()
    });
    
    const selectSeatUrl = `/select-seat?${params.toString()}`;
    console.log('URL sẽ chuyển đến:', selectSeatUrl);
    console.log('Params string:', params.toString());
    
    // Thử chuyển trang
    try {
      navigate(selectSeatUrl);
      console.log('=== Chuyển trang thành công ===');
    } catch (error) {
      console.error('Lỗi khi chuyển trang:', error);
    }
  };

  // State cho danh sách tàu đã lọc
  const [filteredTrains, setFilteredTrains] = useState<Train[]>([]);

  // Khi khởi tạo hoặc khi danh sách tàu thay đổi, reset filteredTrains
  useEffect(() => {
    setFilteredTrains(otherTrains);
  }, [otherTrains]);

  // Hàm chuẩn hóa giờ (hh:mm hoặc hh:mm (+n)) về số phút trong ngày (cộng thêm ngày nếu có)
  function parseTimeToMinutes(timeStr: string): number {
    const match = timeStr.match(/(\d{2}):(\d{2})(?: \(\+(\d)\))?/);
    if (!match) return 0;
    const h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const d = match[3] ? parseInt(match[3], 10) : 0;
    return d * 24 * 60 + h * 60 + m;
  }

  // Hàm xử lý lọc
  const handleFilter = () => {
    let trains = otherTrains;
    // Lọc theo giờ đến nơi mong muốn
    if (arriveTimeFrom && arriveTimeTo) {
      const fromMin = parseTimeToMinutes(arriveTimeFrom);
      const toMin = parseTimeToMinutes(arriveTimeTo);
      trains = trains.filter(train => {
        const arrMin = parseTimeToMinutes(train.arriveTime);
        return arrMin >= fromMin && arrMin <= toMin;
      });
    }
    // Lọc theo giờ khởi hành
    if (departTimeFrom && departTimeTo) {
      const fromMin = parseTimeToMinutes(departTimeFrom);
      const toMin = parseTimeToMinutes(departTimeTo);
      trains = trains.filter(train => {
        const depMin = parseTimeToMinutes(train.departTime);
        return depMin >= fromMin && depMin <= toMin;
      });
    }
    setFilteredTrains(trains);
  };

  // Hàm sinh dữ liệu histogram từ danh sách giá vé
  function getPriceHistogram(trains: Train[], binCount = 32) {
    if (!trains.length) return [];
    const prices = trains.map(t => t.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return Array(binCount).fill(prices.length ? prices.length : 0);
    const binSize = (max - min) / binCount;
    const bins = Array(binCount).fill(0);
    prices.forEach(price => {
      let idx = Math.floor((price - min) / binSize);
      if (idx >= binCount) idx = binCount - 1;
      bins[idx]++;
    });
    return bins;
  }

  // Hàm chuẩn hóa tên ga
  const normalize = (str: string) => str.replace(/^Ga /i, '').replace('TP.HCM', 'Sài Gòn').replace('TP. HCM', 'Sài Gòn').replace('Nha Trang - Khánh Hòa', 'Nha Trang').replace('Sài Gòn (TP.HCM)', 'Sài Gòn').trim().toLowerCase();

  // Hàm cộng thêm phút vào chuỗi giờ (ví dụ: '01:34 (+1)' + 5 phút)
  function addMinutesToTime(timeStr: string, minutesToAdd: number): string {
    // Tách giờ, phút, ngày cộng (nếu có)
    const match = timeStr.match(/(\d{2}):(\d{2})(?: \(\+?(\d)\))?/);
    if (!match) return timeStr;
    let hour = parseInt(match[1], 10);
    let min = parseInt(match[2], 10);
    let dayPlus = match[3] ? parseInt(match[3], 10) : 0;
    min += minutesToAdd;
    if (min >= 60) {
      hour += Math.floor(min / 60);
      min = min % 60;
    }
    if (hour >= 24) {
      dayPlus += Math.floor(hour / 24);
      hour = hour % 24;
    }
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hour)}:${pad(min)}${dayPlus > 0 ? ` (+${dayPlus})` : ''}`;
  }

  // 2. Tạo component nhỏ cho thanh bar từng mức sao
  const StarBar = ({ star, value, max }: { star: number, value: number, max: number }) => (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
      <span style={{ width: 16, fontSize: 13, color: '#888', marginRight: 4 }}>{star}</span>
      <span style={{ color: '#FFD600', fontSize: 14, marginRight: 2 }}>★</span>
      <div style={{ flex: 1, height: 8, background: '#eee', borderRadius: 4, margin: '0 8px', position: 'relative', minWidth: 60 }}>
        <div style={{
          width: `${max ? (value / max) * 100 : 0}%`,
          height: 8,
          background: '#FFD600',
          borderRadius: 4
        }} />
      </div>
      <span style={{ width: 28, textAlign: 'right', fontSize: 13, color: '#888' }}>{value}</span>
    </div>
  );

  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          body, #root, .search-results-root {
            min-width: 0 !important;
            width: 100vw !important;
            overflow-x: hidden;
          }
          .search-results-header {
            min-height: 48px !important;
            font-size: 15px !important;
            padding: 10px 0 6px 0 !important;
          }
          .search-results-card, .search-results-filter, .search-results-journey {
            max-width: 100vw !important;
            border-radius: 0 !important;
            padding: 10px !important;
            margin: 8px 0 0 0 !important;
            box-shadow: none !important;
          }
          .search-results-train-row {
            flex-direction: column !important;
            align-items: stretch !important;
            min-height: 0 !important;
            padding: 8px !important;
          }
          .search-results-train-row > div {
            margin-bottom: 8px !important;
          }
          .search-results-train-row button {
            width: 100% !important;
            margin-left: 0 !important;
          }
        }
        @media (max-width: 900px) and (min-width: 601px) {
          .search-results-card, .search-results-filter, .search-results-journey {
            max-width: 98vw !important;
          }
        }
      `}</style>
      <div className="search-results-root" style={{ background: '#f7f7fa', minHeight: '100vh', width: '100vw', fontFamily: 'Montserrat, Arial, sans-serif' }}>
        {/* Header */}
        <div className="search-results-header" style={{ width: '100vw', background: '#1976d2', color: '#fff', padding: '14px 0 8px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 18 }}>
            <button 
              onClick={() => navigate(-1)}
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, marginRight: 10, cursor: 'pointer' }}
            >
              ‹
            </button>
            <img src={logoRailway} alt="logo" style={{ height: 32 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginRight: 18, fontWeight: 600, fontSize: 16 }}>
            Search Results
          </div>
        </div>

        {/* Thông tin hành trình */}
        <div className="search-results-journey" style={{ background: '#fff', margin: '12px auto 0 auto', width: '100%', maxWidth: 420, padding: '16px', borderRadius: '12px 12px 0 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: 16, color: '#1976d2', marginRight: 8 }}>📍</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#222' }}>{from}</div>
                <div style={{ fontSize: 13, color: '#888' }}>Departure</div>
              </div>
            </div>
            <div style={{ fontSize: 20, color: '#1976d2' }}>→</div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: 16, color: '#e53935', marginRight: 8 }}>📍</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#222' }}>{to}</div>
                <div style={{ fontSize: 13, color: '#888' }}>Destination</div>
              </div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: '#888', textAlign: 'center' }}>
            {searchParams.get('departDate')} {searchParams.get('isRoundTrip') === 'true' && searchParams.get('returnDate') ? `- ${searchParams.get('returnDate')}` : ''}
            {(() => {
              const total = Object.values(passenger).reduce((a, b) => a + b, 0);
              return total > 0 ? ` • ${total} passenger${total > 1 ? 's' : ''}` : '';
            })()}
          </div>
        </div>

        {/* BỘ LỌC */}
        <div className="search-results-filter" style={{ background: '#fff', margin: '16px auto 0 auto', width: '100%', maxWidth: 420, borderRadius: 12, padding: 16, boxShadow: '0 2px 8px #e0e0e0', marginBottom: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 10, color: '#1976d2' }}>Filters</div>
          {/* Thời gian khởi hành (Trong khoảng) */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 14, fontWeight: 600 }}>Departure time (range):</label><br />
            <input type="time" value={departTimeFrom} onChange={e => setDepartTimeFrom(e.target.value)} style={{ marginRight: 8, background: '#fff', border: '1px solid #ccc', borderRadius: 6, padding: '4px 8px', color: '#222' }} />–<input type="time" value={departTimeTo} onChange={e => setDepartTimeTo(e.target.value)} style={{ background: '#fff', border: '1px solid #ccc', borderRadius: 6, padding: '4px 8px', color: '#222' }} />
          </div>
          {/* Giờ đến nơi mong muốn (Trong khoảng) */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 14, fontWeight: 600 }}>Arrival time (range):</label><br />
            <input type="time" value={arriveTimeFrom} onChange={e => setArriveTimeFrom(e.target.value)} style={{ marginRight: 8, background: '#fff', border: '1px solid #ccc', borderRadius: 6, padding: '4px 8px', color: '#222' }} />–<input type="time" value={arriveTimeTo} onChange={e => setArriveTimeTo(e.target.value)} style={{ background: '#fff', border: '1px solid #ccc', borderRadius: 6, padding: '4px 8px', color: '#222' }} />
          </div>
          <button onClick={handleFilter} style={{ marginTop: 16, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 32px', fontWeight: 700, fontSize: 15, cursor: 'pointer', width: '100%' }}>Filter</button>
        </div>

        {/* Danh sách tàu khác */}
        <div className="search-results-card" style={{ background: '#fff', margin: '12px auto 0 auto', width: '100%', maxWidth: 900, padding: '16px', borderRadius: '12px 12px 0 0' }}>
          {filteredTrains.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#e53935', fontWeight: 600, fontSize: 17, margin: '32px 0' }}>
              No trains found matching the filters.
            </div>
          ) : (
            filteredTrains.map((train: any) => {
              // Lấy segment phù hợp với hành trình
              const seg = train.segments?.find(
                (s: {from: string, to: string}) =>
                  normalize(s.from) === normalize(from) &&
                  normalize(s.to) === normalize(to)
              );
              // Nếu không có segments hoặc không tìm thấy segment phù hợp thì fallback dùng thông tin from/to của train
              let departTimeDisplay = train.departTime;
              let arriveTimeDisplay = train.arriveTime;
              let fromDisplay = train.from;
              let toDisplay = train.to;
              let durationDisplay = train.duration;
              // --- BỔ SUNG: Ẩn (+n) nếu departTime và arriveTime đều có cùng (+n) ---
              const departMatchRoot = departTimeDisplay.match(/\(\+\d+\)/);
              const arriveMatchRoot = arriveTimeDisplay.match(/\(\+\d+\)/);
              if (departMatchRoot && arriveMatchRoot && departMatchRoot[0] === arriveMatchRoot[0]) {
                departTimeDisplay = departTimeDisplay.replace(departMatchRoot[0], '').trim();
                arriveTimeDisplay = arriveTimeDisplay.replace(arriveMatchRoot[0], '').trim();
              }
              if (seg) {
                departTimeDisplay = seg.departTime;
                arriveTimeDisplay = seg.arriveTime;
                fromDisplay = seg.from;
                toDisplay = seg.to;
                durationDisplay = seg.duration;
                // Xử lý hiển thị giờ: nếu cả departTime và arriveTime đều có cùng (+1) thì bỏ (+1) ở cả hai
                const departMatch = departTimeDisplay.match(/\(\+\d+\)/);
                const arriveMatch = arriveTimeDisplay.match(/\(\+\d+\)/);
                if (departMatch && arriveMatch && departMatch[0] === arriveMatch[0]) {
                  departTimeDisplay = departTimeDisplay.replace(departMatch[0], '').trim();
                  arriveTimeDisplay = arriveTimeDisplay.replace(arriveMatch[0], '').trim();
                }
              }
              return (
                <div key={train.id} className="search-results-train-row" style={{
                  display: isMobile ? 'block' : 'flex',
                  alignItems: isMobile ? 'stretch' : 'center',
                  justifyContent: 'space-between',
                  border: '1px solid #e0e0e0',
                  borderRadius: 12,
                  padding: isMobile ? 10 : 16,
                  marginBottom: 16,
                  background: '#fff',
                  minHeight: 90,
                  boxSizing: 'border-box',
                  width: '100%'
                }}>
                  {/* Ga đi */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'flex-start' : 'center', minWidth: isMobile ? 0 : 100, marginBottom: isMobile ? 8 : 0 }}>
                    <div style={{ fontWeight: 700, fontSize: isMobile ? 16 : 20, color: '#222', marginBottom: 2 }}>{departTimeDisplay}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 16, color: '#1976d2' }}>📍</span>
                      <span style={{ fontWeight: 600, fontSize: isMobile ? 13 : 15, color: '#222' }}>{fromDisplay}</span>
                    </div>
                    <div style={{ fontSize: isMobile ? 10 : 12, color: '#888', marginTop: 2 }}>Departure</div>
                  </div>
                  {/* Mũi tên */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: isMobile ? '0 4px' : '0 12px' }}>
                    <span style={{ fontSize: isMobile ? 18 : 22, color: '#bbb', fontWeight: 700 }}>→</span>
                  </div>
                  {/* Ga đến */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'flex-start' : 'center', minWidth: isMobile ? 0 : 100, marginBottom: isMobile ? 8 : 0 }}>
                    <div style={{ fontWeight: 700, fontSize: isMobile ? 16 : 20, color: '#222', marginBottom: 2 }}>{arriveTimeDisplay}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 16, color: '#e53935' }}>📍</span>
                      <span style={{ fontWeight: 600, fontSize: isMobile ? 13 : 15, color: '#222' }}>{toDisplay}</span>
                    </div>
                    <div style={{ fontSize: isMobile ? 10 : 12, color: '#888', marginTop: 2 }}>Destination</div>
                  </div>
                  {/* Thông tin tàu và nút */}
                  <div style={{ flex: 1, textAlign: isMobile ? 'left' : 'center', margin: isMobile ? '8px 0' : 0, display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: isMobile ? 15 : 16, color: '#1976d2', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {train.name}
                      <button
                        onClick={() => { setModalOpen(true); setModalTrain(train); }}
                        style={{ background: 'none', border: 'none', color: '#1976d2', textDecoration: 'underline', fontWeight: 500, fontSize: isMobile ? 13 : 14, cursor: 'pointer', padding: 0, marginLeft: 6 }}
                      >
                        Details
                      </button>
                    </div>
                    <div style={{ fontSize: isMobile ? 11 : 13, color: '#888', marginBottom: 2 }}>Duration: {durationDisplay}</div>
                    {/* <div style={{ fontWeight: 700, fontSize: isMobile ? 16 : 18, color: '#e53935', marginBottom: 2 }}>{train.price.toLocaleString('vi-VN')} đ</div> */}
                    <button
                      onClick={() => handleSelectTrain(train)}
                      style={{ marginTop: isMobile ? 8 : 12, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: isMobile ? '8px 12px' : '8px 22px', fontWeight: 700, fontSize: isMobile ? 14 : 15, cursor: 'pointer', boxShadow: '0 2px 8px #e0e0e0', marginLeft: isMobile ? 0 : 0 }}
                    >
                      Book
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {/* Modal review tàu */}
        {modalOpen && modalTrain && (() => {
          const trainCode = modalTrain.id.split('-')[0];
          const review = REVIEW_SUMMARY[trainCode] || {};
          const totalPassenger = Object.values(passenger).reduce((a, b) => a + b, 0);
          const iconMap = {
            'Nhà ăn': '🍱',
            'Nhà vệ sinh': '🛁',
            'Kiosk': '��',
            'Điều hòa': '❄️',
            'Free wifi': '📶',
            'Ổ cắm điện': '🔌',
            'Điều chỉnh ghế ngồi': '💺',
          };
          const summaryStars = review.stars || {};
          const maxStar = Math.max(...[1, 2, 3, 4, 5].map(s => summaryStars[s] || 0), 1);
          const StarBar = ({ star, value, max }: { star: number, value: number, max: number }) => (
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ width: 16, fontSize: 13, color: '#888', marginRight: 4 }}>{star}</span>
              <span style={{ color: '#FFD600', fontSize: 14, marginRight: 2 }}>★</span>
              <div style={{
                flex: 1, height: 8, background: '#eee', borderRadius: 4,
                margin: '0 8px', position: 'relative', minWidth: 60
              }}>
                <div style={{
                  width: `${max ? (value / max) * 100 : 0}%`,
                  height: 8,
                  background: '#FFD600',
                  borderRadius: 4
                }} />
              </div>
              <span style={{ width: 28, textAlign: 'right', fontSize: 13, color: '#888' }}>{value}</span>
            </div>
          );
          return (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.25)', zIndex: 10000,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{
                background: '#fff', borderRadius: 16, maxWidth: 340, width: '90vw',
                padding: 24, boxShadow: '0 4px 24px #0002', position: 'relative',
                maxHeight: '80vh', overflowY: 'auto'
              }}>
                <button onClick={() => setModalOpen(false)}
                  style={{ position: 'absolute', top: 10, right: 14, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }}>
                  ×
                </button>

                <div style={{ fontWeight: 700, fontSize: 20, color: '#1976d2', marginBottom: 8 }}>{modalTrain.name}</div>

                <div style={{ marginBottom: 16, background: '#f7f7fa', borderRadius: 8, padding: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 4 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{from}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>Departure</div>
                    </div>
                    <div style={{ fontSize: 20, color: '#1976d2', fontWeight: 700 }}>→</div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{to}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>Destination</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', fontSize: 13, color: '#888', marginBottom: 2 }}>
                    {searchParams.get('departDate')} • {totalPassenger} passenger{totalPassenger > 1 ? 's' : ''}
                  </div>
                  <div style={{ textAlign: 'center', fontSize: 13, color: '#888', marginBottom: 2 }}>
                    Average delay rate: <b>{modalTrain.delayRate ?? '3%'}</b>
                  </div>

                  {/* Tiện ích */}
                  {modalTrain.facilities?.length ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 24px' }}>
                      {modalTrain.facilities.filter((f: string) => FACILITY_DISPLAY_MAP[f]).map((f: string, idx: number) => {
                        const display = FACILITY_DISPLAY_MAP[f];
                        return (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#388e3c', fontSize: 15 }}>
                            <span>{display.icon}</span>
                            <span style={{ fontWeight: 500, fontSize: 14 }}>{display.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ color: '#888', fontSize: 14 }}>No facility information.</div>
                  )}
                </div>

                {/* Tổng kết đánh giá */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 18 }}>
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: '#222' }}>Review summary</span>
                      <span title="Aggregated data from customer reviews"
                        style={{ marginLeft: 4, color: '#888', fontSize: 15, cursor: 'pointer' }}>❓</span>
                    </div>
                    {[5, 4, 3, 2, 1].map(star => (
                      <StarBar key={star} star={star} value={summaryStars[star] || 0} max={maxStar} />
                    ))}
                  </div>
                  <div style={{ minWidth: 80, textAlign: 'center', marginTop: 2 }}>
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#222', lineHeight: 1 }}>{review.avg || 'N/A'}</div>
                    <div style={{ color: '#FFD600', fontSize: 18, margin: '2px 0' }}>★★★★★</div>
                    <button
                      onClick={() => setShowReviewList(v => !v)}
                      style={{
                        background: 'none', border: 'none', color: '#1976d2',
                        textDecoration: 'underline', fontWeight: 500, fontSize: 14, cursor: 'pointer', padding: 0
                      }}>
                      {review.count || 0} review{(review.count || 0) > 1 ? 's' : ''}
                    </button>
                  </div>
                </div>
                {/* Danh sách đánh giá (hiện ngay trong modal) */}
                {showReviewList && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#1976d2', marginBottom: 8 }}>Review list</div>
                    {review.reviews && review.reviews.length > 0 ? (
                      <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                        {review.reviews.slice(-50).reverse().map((r: any, idx: number) => (
                          <div key={idx} style={{ marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid #eee' }}>
                            <div style={{ fontWeight: 600, color: '#1976d2', fontSize: 15 }}>{r.reviewer}</div>
                            <div style={{ color: '#444', fontSize: 14, marginTop: 2 }}>{r.text}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: '#888', fontSize: 14 }}>No reviews yet.</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })()}
        
      </div>
    </>
  );
};

export default SearchResults; 