// Dữ liệu giá ghế chi tiết cho từng tàu và vị trí
export interface SeatPricing {
  trainId: string;
  routes: {
    origin: string;
    destination: string;
    fares: {
      seating?: CarPricing[];
      sleeper_6_berth?: CarPricing[];
      sleeper_4_berth?: CarPricing[];
    };
  }[];
}

export interface CarPricing {
  car_number: number;
  rows: {
    row_numbers: number[];
    price: number;
  }[];
}

// Dữ liệu hành vi khách hàng cho từng ghế
export interface SeatBehavior {
  trainId: string;
  coachId: string;
  seatId: string;
  behavior: 'quiet' | 'social';
  nearWC: boolean;
  nearSimilarBehavior: boolean;
  passengersNearby: number;
  noiseLevel: number; // 1200-1500 range
}

// Dữ liệu giá ghế chi tiết cho tàu SE9 (Hà Nội - Nha Trang)
export const SE9_PRICING: SeatPricing = {
  trainId: 'SE9',
  routes: [
    {
      origin: 'Hà Nội',
      destination: 'Vinh',
      fares: {
        seating: [
          {
            car_number: 1,
            rows: [
              { row_numbers: [1, 2], price: 373000 },
              { row_numbers: [3, 4], price: 387000 },
              { row_numbers: [5, 6], price: 401000 },
              { row_numbers: [7, 8], price: 416000 },
              { row_numbers: [9, 10], price: 430000 },
              { row_numbers: [11, 12], price: 444000 },
              { row_numbers: [13, 14], price: 459000 },
              { row_numbers: [15, 16], price: 473000 },
              { row_numbers: [17, 18], price: 488000 },
              { row_numbers: [19, 20], price: 502000 },
              { row_numbers: [21, 22], price: 516000 },
              { row_numbers: [23, 24], price: 530000 },
              { row_numbers: [25, 26], price: 544000 },
              { row_numbers: [27, 28], price: 558000 }
            ]
          },
          {
            car_number: 2,
            rows: [
              { row_numbers: [1, 2], price: 572000 },
              { row_numbers: [3, 4], price: 586000 },
              { row_numbers: [5, 6], price: 600000 },
              { row_numbers: [7, 8], price: 614000 },
              { row_numbers: [9, 10], price: 628000 },
              { row_numbers: [11, 12], price: 642000 },
              { row_numbers: [13, 14], price: 656000 },
              { row_numbers: [15, 16], price: 670000 },
              { row_numbers: [17, 18], price: 684000 },
              { row_numbers: [19, 20], price: 698000 },
              { row_numbers: [21, 22], price: 712000 },
              { row_numbers: [23, 24], price: 726000 },
              { row_numbers: [25, 26], price: 740000 },
              { row_numbers: [27, 28], price: 754000 }
            ]
          }
        ],
        sleeper_6_berth: [
          {
            car_number: 3,
            rows: [
              { row_numbers: [1, 2, 3, 4, 5, 6], price: 642000 },
              { row_numbers: [7, 8, 9, 10, 11, 12], price: 647000 },
              { row_numbers: [13, 14, 15, 16, 17, 18], price: 652000 },
              { row_numbers: [19, 20, 21, 22, 23, 24], price: 657000 },
              { row_numbers: [25, 26, 27, 28, 29, 30], price: 662000 },
              { row_numbers: [31, 32, 33, 34, 35, 36], price: 667000 },
              { row_numbers: [37, 38, 39, 40, 41, 42], price: 672000 }
            ]
          }
        ],
        sleeper_4_berth: [
          {
            car_number: 4,
            rows: [
              { row_numbers: [1, 2, 3, 4], price: 872000 },
              { row_numbers: [5, 6, 7, 8], price: 877000 },
              { row_numbers: [9, 10, 11, 12], price: 882000 },
              { row_numbers: [13, 14, 15, 16], price: 887000 },
              { row_numbers: [17, 18, 19, 20], price: 892000 },
              { row_numbers: [21, 22, 23, 24], price: 897000 },
              { row_numbers: [25, 26, 27, 28], price: 902000 }
            ]
          }
        ]
      }
    },
    {
      origin: 'Hà Nội',
      destination: 'Nha Trang',
      fares: {
        seating: [
          {
            car_number: 1,
            rows: [
              { row_numbers: [1, 2], price: 503000 },
              { row_numbers: [3, 4], price: 518000 },
              { row_numbers: [5, 6], price: 533000 },
              { row_numbers: [7, 8], price: 548000 },
              { row_numbers: [9, 10], price: 563000 },
              { row_numbers: [11, 12], price: 578000 },
              { row_numbers: [13, 14], price: 593000 },
              { row_numbers: [15, 16], price: 608000 },
              { row_numbers: [17, 18], price: 623000 },
              { row_numbers: [19, 20], price: 638000 },
              { row_numbers: [21, 22], price: 653000 },
              { row_numbers: [23, 24], price: 668000 },
              { row_numbers: [25, 26], price: 683000 },
              { row_numbers: [27, 28], price: 698000 }
            ]
          }
        ],
        sleeper_6_berth: [
          {
            car_number: 3,
            rows: [
              { row_numbers: [1, 2, 3, 4, 5, 6], price: 703000 },
              { row_numbers: [7, 8, 9, 10, 11, 12], price: 708000 },
              { row_numbers: [13, 14, 15, 16, 17, 18], price: 713000 },
              { row_numbers: [19, 20, 21, 22, 23, 24], price: 718000 },
              { row_numbers: [25, 26, 27, 28, 29, 30], price: 723000 },
              { row_numbers: [31, 32, 33, 34, 35, 36], price: 728000 },
              { row_numbers: [37, 38, 39, 40, 41, 42], price: 733000 }
            ]
          }
        ],
        sleeper_4_berth: [
          {
            car_number: 4,
            rows: [
              { row_numbers: [1, 2, 3, 4], price: 1003000 },
              { row_numbers: [5, 6, 7, 8], price: 1008000 },
              { row_numbers: [9, 10, 11, 12], price: 1013000 },
              { row_numbers: [13, 14, 15, 16], price: 1018000 },
              { row_numbers: [17, 18, 19, 20], price: 1023000 },
              { row_numbers: [21, 22, 23, 24], price: 1028000 },
              { row_numbers: [25, 26, 27, 28], price: 1033000 }
            ]
          }
        ]
      }
    }
  ]
};

// Dữ liệu hành vi cho tàu SE9
export const SE9_SEAT_BEHAVIORS: SeatBehavior[] = [
  // Hard Seat Car 1
  { trainId: 'SE9', coachId: 'hard_seat', seatId: 'A1', behavior: 'quiet', nearWC: true, nearSimilarBehavior: true, passengersNearby: 2, noiseLevel: 1200 },
  { trainId: 'SE9', coachId: 'hard_seat', seatId: 'A2', behavior: 'quiet', nearWC: true, nearSimilarBehavior: true, passengersNearby: 3, noiseLevel: 1205 },
  { trainId: 'SE9', coachId: 'hard_seat', seatId: 'A3', behavior: 'social', nearWC: true, nearSimilarBehavior: false, passengersNearby: 2, noiseLevel: 1210 },
  { trainId: 'SE9', coachId: 'hard_seat', seatId: 'A4', behavior: 'social', nearWC: true, nearSimilarBehavior: true, passengersNearby: 1, noiseLevel: 1215 },
  
  { trainId: 'SE9', coachId: 'hard_seat', seatId: 'B1', behavior: 'quiet', nearWC: false, nearSimilarBehavior: true, passengersNearby: 3, noiseLevel: 1235 },
  { trainId: 'SE9', coachId: 'hard_seat', seatId: 'B2', behavior: 'quiet', nearWC: false, nearSimilarBehavior: true, passengersNearby: 4, noiseLevel: 1240 },
  { trainId: 'SE9', coachId: 'hard_seat', seatId: 'B3', behavior: 'social', nearWC: false, nearSimilarBehavior: false, passengersNearby: 2, noiseLevel: 1245 },
  { trainId: 'SE9', coachId: 'hard_seat', seatId: 'B4', behavior: 'quiet', nearWC: false, nearSimilarBehavior: true, passengersNearby: 1, noiseLevel: 1250 },
  
  // 6-berth cabin
  { trainId: 'SE9', coachId: '6_berth_cabin', seatId: '1-1', behavior: 'quiet', nearWC: true, nearSimilarBehavior: true, passengersNearby: 5, noiseLevel: 1180 },
  { trainId: 'SE9', coachId: '6_berth_cabin', seatId: '1-2', behavior: 'quiet', nearWC: true, nearSimilarBehavior: true, passengersNearby: 4, noiseLevel: 1185 },
  { trainId: 'SE9', coachId: '6_berth_cabin', seatId: '1-3', behavior: 'social', nearWC: true, nearSimilarBehavior: false, passengersNearby: 3, noiseLevel: 1190 },
  { trainId: 'SE9', coachId: '6_berth_cabin', seatId: '1-4', behavior: 'quiet', nearWC: true, nearSimilarBehavior: true, passengersNearby: 2, noiseLevel: 1195 },
  { trainId: 'SE9', coachId: '6_berth_cabin', seatId: '1-5', behavior: 'quiet', nearWC: true, nearSimilarBehavior: true, passengersNearby: 1, noiseLevel: 1200 },
  { trainId: 'SE9', coachId: '6_berth_cabin', seatId: '1-6', behavior: 'social', nearWC: true, nearSimilarBehavior: false, passengersNearby: 0, noiseLevel: 1205 },
  
  // 4-berth cabin
  { trainId: 'SE9', coachId: '4_berth_cabin', seatId: '1-1', behavior: 'quiet', nearWC: true, nearSimilarBehavior: true, passengersNearby: 3, noiseLevel: 1150 },
  { trainId: 'SE9', coachId: '4_berth_cabin', seatId: '1-2', behavior: 'quiet', nearWC: true, nearSimilarBehavior: true, passengersNearby: 2, noiseLevel: 1155 },
  { trainId: 'SE9', coachId: '4_berth_cabin', seatId: '1-3', behavior: 'social', nearWC: true, nearSimilarBehavior: false, passengersNearby: 1, noiseLevel: 1160 },
  { trainId: 'SE9', coachId: '4_berth_cabin', seatId: '1-4', behavior: 'quiet', nearWC: true, nearSimilarBehavior: true, passengersNearby: 0, noiseLevel: 1165 },
];

// Tập hợp tất cả dữ liệu giá ghế
import { 
  SE1_GENERATED_PRICING, 
  SE2_GENERATED_PRICING,
  SE3_GENERATED_PRICING,
  SE4_GENERATED_PRICING,
  SE5_GENERATED_PRICING,
  SE6_GENERATED_PRICING,
  SE7_GENERATED_PRICING,
  SE8_GENERATED_PRICING,
  SE9_GENERATED_PRICING,
  SE10_GENERATED_PRICING,
  SE22_GENERATED_PRICING,
  ALL_GENERATED_PRICING_DATA
} from './generated';

export const SEAT_PRICING_DATA: SeatPricing[] = [
  SE1_GENERATED_PRICING,
  SE2_GENERATED_PRICING,
  SE3_GENERATED_PRICING,
  SE4_GENERATED_PRICING,
  SE5_GENERATED_PRICING,
  SE6_GENERATED_PRICING,
  SE7_GENERATED_PRICING,
  SE8_GENERATED_PRICING,
  SE9_GENERATED_PRICING,
  SE10_GENERATED_PRICING,
  SE22_GENERATED_PRICING,
];

// Export cho backward compatibility
export { ALL_GENERATED_PRICING_DATA as ALL_TRAIN_PRICING };

// Tập hợp tất cả dữ liệu hành vi
export const SEAT_BEHAVIOR_DATA: SeatBehavior[] = [
  ...SE9_SEAT_BEHAVIORS,
  // Có thể thêm dữ liệu của các tàu khác ở đây
];

// Hàm utility để lấy giá ghế
export const getSeatPrice = (trainId: string, origin: string, destination: string, coachType: string, carNumber: number, seatNumber: number): number => {
  const trainPricing = SEAT_PRICING_DATA.find(p => p.trainId === trainId);
  if (!trainPricing) return 0;
  
  const route = trainPricing.routes.find(r => r.origin === origin && r.destination === destination);
  if (!route) return 0;
  
  let fareType: 'seating' | 'sleeper_6_berth' | 'sleeper_4_berth';
  if (coachType === 'hard_seat' || coachType === 'soft_seat') {
    fareType = 'seating';
  } else if (coachType === '6_berth_cabin') {
    fareType = 'sleeper_6_berth';
  } else if (coachType === '4_berth_cabin') {
    fareType = 'sleeper_4_berth';
  } else {
    return 0;
  }
  
  const cars = route.fares[fareType];
  if (!cars) return 0;
  
  const car = cars.find(c => c.car_number === carNumber);
  if (!car) return 0;
  
  const row = car.rows.find(r => r.row_numbers.includes(seatNumber));
  return row ? row.price : 0;
};

// Hàm utility để lấy hành vi ghế
export const getSeatBehavior = (trainId: string, coachId: string, seatId: string): SeatBehavior | undefined => {
  return SEAT_BEHAVIOR_DATA.find(b => 
    b.trainId === trainId && 
    b.coachId === coachId && 
    b.seatId === seatId
  );
};

// Hàm tạo dữ liệu hành vi mặc định
export const generateDefaultSeatBehavior = (trainId: string, coachId: string, seatId: string): SeatBehavior => {
  return {
    trainId,
    coachId,
    seatId,
    behavior: Math.random() < 0.7 ? 'quiet' : 'social',
    nearWC: Math.random() < 0.3,
    nearSimilarBehavior: Math.random() < 0.5,
    passengersNearby: Math.floor(Math.random() * 6),
    noiseLevel: 1200 + Math.floor(Math.random() * 300)
  };
};
