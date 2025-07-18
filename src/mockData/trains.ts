export interface Train {
  id: string;
  name: string;
  type: 'SE' | 'TN' | 'SNT';
  route: {
    from: string;
    to: string;
  };
  // Thêm thông tin về các ga trung gian mà tàu phục vụ
  intermediateStations?: string[];
  schedule: {
    departureTime: string;
    arrivalTime: string;
    duration: string;
  };
  coaches: {
    id: string;
    type: string;
    available: number;
    total: number;
    basePrice: number;
  }[];
  amenities: string[];
  status: 'on-time' | 'delayed' | 'cancelled';
}

export const TRAINS: Train[] = [
  {
    id: 'SE1',
    name: 'SE1',
    type: 'SE',
    route: {
      from: 'Hà Nội',
      to: 'Hồ Chí Minh'
    },
    // Tàu dài: dừng tất cả 5 ga
    intermediateStations: ['Hà Nội', 'Vinh', 'Đà Nẵng', 'Nha Trang', 'Hồ Chí Minh'],
    schedule: {
      departureTime: '19:30',
      arrivalTime: '04:30+1',
      duration: '33h 00m'
    },
    coaches: [
      { id: 'hard_seat', type: 'Hard seat', available: 45, total: 64, basePrice: 553000 },
      { id: 'soft_seat', type: 'Soft seat', available: 32, total: 48, basePrice: 663000 },
      { id: '6_berth_cabin', type: 'Hard sleeper', available: 28, total: 36, basePrice: 773000 },
      { id: '4_berth_cabin', type: 'Soft sleeper', available: 15, total: 24, basePrice: 1103000 }
    ],
    amenities: ['AC', 'WiFi', 'Restaurant', 'Toilet'],
    status: 'on-time'
  },
  {
    id: 'SE2',
    name: 'SE2',
    type: 'SE',
    route: {
      from: 'Hồ Chí Minh',
      to: 'Hà Nội'
    },
    // Tàu dài: dừng tất cả 5 ga (chiều ngược lại)
    intermediateStations: ['Hồ Chí Minh', 'Nha Trang', 'Đà Nẵng', 'Vinh', 'Hà Nội'],
    schedule: {
      departureTime: '19:30',
      arrivalTime: '04:30+1',
      duration: '33h 00m'
    },
    coaches: [
      { id: 'hard_seat', type: 'Hard seat', available: 42, total: 64, basePrice: 553000 },
      { id: 'soft_seat', type: 'Soft seat', available: 28, total: 48, basePrice: 663000 },
      { id: '6_berth_cabin', type: 'Hard sleeper', available: 25, total: 36, basePrice: 773000 },
      { id: '4_berth_cabin', type: 'Soft sleeper', available: 12, total: 24, basePrice: 1103000 }
    ],
    amenities: ['AC', 'WiFi', 'Restaurant', 'Toilet'],
    status: 'on-time'
  },
  {
    id: 'SE3',
    name: 'SE3',
    type: 'SE',
    route: {
      from: 'Hà Nội',
      to: 'Hồ Chí Minh'
    },
    // Tàu dài: dừng tất cả 5 ga
    intermediateStations: ['Hà Nội', 'Vinh', 'Đà Nẵng', 'Nha Trang', 'Hồ Chí Minh'],
    schedule: {
      departureTime: '06:00',
      arrivalTime: '14:00+1',
      duration: '32h 00m'
    },
    coaches: [
      { id: 'hard_seat', type: 'Hard seat', available: 38, total: 64, basePrice: 553000 },
      { id: 'soft_seat', type: 'Soft seat', available: 35, total: 48, basePrice: 663000 },
      { id: '6_berth_cabin', type: 'Hard sleeper', available: 30, total: 36, basePrice: 773000 },
      { id: '4_berth_cabin', type: 'Soft sleeper', available: 18, total: 24, basePrice: 1103000 }
    ],
    amenities: ['AC', 'WiFi', 'Restaurant', 'Toilet'],
    status: 'on-time'
  },
  {
    id: 'SE4',
    name: 'SE4',
    type: 'SE',
    route: {
      from: 'Hồ Chí Minh',
      to: 'Hà Nội'
    },
    // Tàu dài: dừng tất cả 5 ga (chiều ngược lại)
    intermediateStations: ['Hồ Chí Minh', 'Nha Trang', 'Đà Nẵng', 'Vinh', 'Hà Nội'],
    schedule: {
      departureTime: '06:00',
      arrivalTime: '14:00+1',
      duration: '32h 00m'
    },
    coaches: [
      { id: 'hard_seat', type: 'Hard seat', available: 40, total: 64, basePrice: 553000 },
      { id: 'soft_seat', type: 'Soft seat', available: 30, total: 48, basePrice: 663000 },
      { id: '6_berth_cabin', type: 'Hard sleeper', available: 22, total: 36, basePrice: 773000 },
      { id: '4_berth_cabin', type: 'Soft sleeper', available: 16, total: 24, basePrice: 1103000 }
    ],
    amenities: ['AC', 'WiFi', 'Restaurant', 'Toilet'],
    status: 'on-time'
  },
  {
    id: 'SE5',
    name: 'SE5',
    type: 'SE',
    route: {
      from: 'Hà Nội',
      to: 'Đà Nẵng'
    },
    // Tàu đoạn ngắn: chỉ dừng 3 ga
    intermediateStations: ['Hà Nội', 'Vinh', 'Đà Nẵng'],
    schedule: {
      departureTime: '05:15',
      arrivalTime: '18:30',
      duration: '13h 15m'
    },
    coaches: [
      { id: 'hard_seat', type: 'Hard seat', available: 52, total: 64, basePrice: 351000 },
      { id: 'soft_seat', type: 'Soft seat', available: 44, total: 48, basePrice: 421000 },
      { id: '6_berth_cabin', type: 'Hard sleeper', available: 34, total: 36, basePrice: 491000 },
      { id: '4_berth_cabin', type: 'Soft sleeper', available: 22, total: 24, basePrice: 701000 }
    ],
    amenities: ['AC', 'WiFi', 'Toilet'],
    status: 'on-time'
  },
  {
    id: 'SE6',
    name: 'SE6',
    type: 'SE',
    route: {
      from: 'Đà Nẵng',
      to: 'Hà Nội'
    },
    // Tàu đoạn ngắn: chỉ dừng 3 ga (chiều ngược lại)
    intermediateStations: ['Đà Nẵng', 'Vinh', 'Hà Nội'],
    schedule: {
      departureTime: '21:05',
      arrivalTime: '10:20+1',
      duration: '13h 15m'
    },
    coaches: [
      { id: 'hard_seat', type: 'Hard seat', available: 48, total: 64, basePrice: 351000 },
      { id: 'soft_seat', type: 'Soft seat', available: 40, total: 48, basePrice: 421000 },
      { id: '6_berth_cabin', type: 'Hard sleeper', available: 31, total: 36, basePrice: 491000 },
      { id: '4_berth_cabin', type: 'Soft sleeper', available: 19, total: 24, basePrice: 701000 }
    ],
    amenities: ['AC', 'WiFi', 'Toilet'],
    status: 'on-time'
  },
  {
    id: 'SE7',
    name: 'SE7',
    type: 'SE',
    route: {
      from: 'Hà Nội',
      to: 'Hồ Chí Minh'
    },
    // Tàu dài: dừng tất cả 5 ga
    intermediateStations: ['Hà Nội', 'Vinh', 'Đà Nẵng', 'Nha Trang', 'Hồ Chí Minh'],
    schedule: {
      departureTime: '14:35',
      arrivalTime: '04:50+1',
      duration: '14h 15m'
    },
    coaches: [
      { id: 'hard_seat', type: 'Hard seat', available: 46, total: 64, basePrice: 368000 },
      { id: 'soft_seat', type: 'Soft seat', available: 38, total: 48, basePrice: 442000 },
      { id: '6_berth_cabin', type: 'Hard sleeper', available: 29, total: 36, basePrice: 516000 },
      { id: '4_berth_cabin', type: 'Soft sleeper', available: 17, total: 24, basePrice: 738000 }
    ],
    amenities: ['AC', 'WiFi', 'Restaurant', 'Toilet'],
    status: 'on-time'
  },
  {
    id: 'SE8',
    name: 'SE8',
    type: 'SE',
    route: {
      from: 'Hồ Chí Minh',
      to: 'Hà Nội'
    },
    // Tàu dài: dừng tất cả 5 ga (chiều ngược lại)
    intermediateStations: ['Hồ Chí Minh', 'Nha Trang', 'Đà Nẵng', 'Vinh', 'Hà Nội'],
    schedule: {
      departureTime: '22:00',
      arrivalTime: '12:15+1',
      duration: '14h 15m'
    },
    coaches: [
      { id: 'hard_seat', type: 'Hard seat', available: 44, total: 64, basePrice: 368000 },
      { id: 'soft_seat', type: 'Soft seat', available: 36, total: 48, basePrice: 442000 },
      { id: '6_berth_cabin', type: 'Hard sleeper', available: 27, total: 36, basePrice: 516000 },
      { id: '4_berth_cabin', type: 'Soft sleeper', available: 15, total: 24, basePrice: 738000 }
    ],
    amenities: ['AC', 'WiFi', 'Restaurant', 'Toilet'],
    status: 'on-time'
  },
  {
    id: 'SE9',
    name: 'SE9',
    type: 'SE',
    route: {
      from: 'Hà Nội',
      to: 'Hồ Chí Minh'
    },
    // Tàu dài: dừng tất cả 5 ga
    intermediateStations: ['Hà Nội', 'Vinh', 'Đà Nẵng', 'Nha Trang', 'Hồ Chí Minh'],
    schedule: {
      departureTime: '11:00',
      arrivalTime: '18:40+1',
      duration: '31h 40m'
    },
    coaches: [
      { id: 'hard_seat', type: 'Hard seat', available: 41, total: 64, basePrice: 503000 },
      { id: 'soft_seat', type: 'Soft seat', available: 33, total: 48, basePrice: 603000 },
      { id: '6_berth_cabin', type: 'Hard sleeper', available: 26, total: 36, basePrice: 703000 },
      { id: '4_berth_cabin', type: 'Soft sleeper', available: 14, total: 24, basePrice: 1003000 }
    ],
    amenities: ['AC', 'WiFi', 'Restaurant', 'Toilet'],
    status: 'on-time'
  },
  {
    id: 'SE10',
    name: 'SE10',
    type: 'SE',
    route: {
      from: 'Hồ Chí Minh',
      to: 'Hà Nội'
    },
    // Tàu dài: dừng tất cả 5 ga (chiều ngược lại)
    intermediateStations: ['Hồ Chí Minh', 'Nha Trang', 'Đà Nẵng', 'Vinh', 'Hà Nội'],
    schedule: {
      departureTime: '15:20',
      arrivalTime: '23:00+1',
      duration: '31h 40m'
    },
    coaches: [
      { id: 'hard_seat', type: 'Hard seat', available: 39, total: 64, basePrice: 503000 },
      { id: 'soft_seat', type: 'Soft seat', available: 31, total: 48, basePrice: 603000 },
      { id: '6_berth_cabin', type: 'Hard sleeper', available: 24, total: 36, basePrice: 703000 },
      { id: '4_berth_cabin', type: 'Soft sleeper', available: 12, total: 24, basePrice: 1003000 }
    ],
    amenities: ['AC', 'WiFi', 'Restaurant', 'Toilet'],
    status: 'on-time'
  },
  {
    id: 'SE22',
    name: 'SE22',
    type: 'SE',
    route: {
      from: 'Hồ Chí Minh',
      to: 'Đà Nẵng'
    },
    // Tàu đoạn ngắn: chỉ dừng 3 ga
    intermediateStations: ['Hồ Chí Minh', 'Nha Trang', 'Đà Nẵng'],
    schedule: {
      departureTime: '08:45',
      arrivalTime: '15:30+1',
      duration: '30h 45m'
    },
    coaches: [
      { id: 'hard_seat', type: 'Hard seat', available: 43, total: 64, basePrice: 480000 },
      { id: 'soft_seat', type: 'Soft seat', available: 37, total: 48, basePrice: 576000 },
      { id: '6_berth_cabin', type: 'Hard sleeper', available: 28, total: 36, basePrice: 672000 },
      { id: '4_berth_cabin', type: 'Soft sleeper', available: 16, total: 24, basePrice: 960000 }
    ],
    amenities: ['AC', 'WiFi', 'Restaurant', 'Toilet'],
    status: 'on-time'
  }
];

export function searchTrains(from: string, to: string, date?: string): Train[] {
  return TRAINS.filter(train => {
    return train.route.from === from && train.route.to === to;
  });
}

export function getTrainById(id: string): Train | undefined {
  return TRAINS.find(train => train.id === id);
}

export function calculatePrice(from: string, to: string, coachType: string): number {
  // Tìm tàu có tuyến phù hợp
  const train = TRAINS.find(t => t.route.from === from && t.route.to === to);

  if (!train) return 0;

  const coach = train.coaches.find(c => c.id === coachType);
  if (!coach) return 0;

  return coach.basePrice;
}
