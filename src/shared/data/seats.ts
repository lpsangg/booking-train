// Mock data cho ghế ngồi
export interface Seat {
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
  trainId: string;
  coachId: number;
  compartment?: number; // for cabin types
}

// Hàm tạo ghế cho toa ngồi mềm
export const generateSoftSeatSeats = (trainId: string, coachId: number): Seat[] => {
  const seats: Seat[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  
  for (let i = 0; i < rows.length; i++) {
    for (let col = 1; col <= 4; col++) {
      const seatId = `${trainId}-${coachId}-${rows[i]}${col}`;
      const isOccupied = Math.random() < 0.3; // 30% ghế đã có người
      
      seats.push({
        id: seatId,
        row: rows[i],
        column: col,
        floor: 1,
        price: 990000 + Math.floor(Math.random() * 100000),
        status: isOccupied ? 'occupied' : 'available',
        behavior: Math.random() < 0.6 ? 'quiet' : 'social',
        nearWC: (i === 0 || i === rows.length - 1) && (col === 1 || col === 4),
        nearSimilarBehavior: Math.random() < 0.4,
        passengersNearby: Math.floor(Math.random() * 4),
        trainId,
        coachId
      });
    }
  }
  
  return seats;
};

// Hàm tạo ghế cho toa nằm 6
export const generate6BerthCabinSeats = (trainId: string, coachId: number): Seat[] => {
  const seats: Seat[] = [];
  const compartments = 7; // 7 khoang
  
  for (let comp = 1; comp <= compartments; comp++) {
    for (let bed = 1; bed <= 6; bed++) {
      const floor = bed <= 2 ? 1 : bed <= 4 ? 2 : 3;
      const seatId = `${trainId}-${coachId}-${comp}-${bed}`;
      const isOccupied = Math.random() < 0.25; // 25% giường đã có người
      
      seats.push({
        id: seatId,
        row: comp.toString(),
        column: bed,
        floor: floor as 1 | 2 | 3,
        price: 1200000 + Math.floor(Math.random() * 150000),
        status: isOccupied ? 'occupied' : 'available',
        behavior: Math.random() < 0.7 ? 'quiet' : 'social',
        nearWC: comp === 1 || comp === compartments,
        nearSimilarBehavior: Math.random() < 0.5,
        passengersNearby: Math.floor(Math.random() * 6),
        trainId,
        coachId,
        compartment: comp
      });
    }
  }
  
  return seats;
};

// Hàm tạo ghế cho toa nằm 4
export const generate4BerthCabinSeats = (trainId: string, coachId: number): Seat[] => {
  const seats: Seat[] = [];
  const compartments = 7; // 7 khoang
  
  for (let comp = 1; comp <= compartments; comp++) {
    for (let bed = 1; bed <= 4; bed++) {
      const floor = bed <= 2 ? 1 : 2;
      const seatId = `${trainId}-${coachId}-${comp}-${bed}`;
      const isOccupied = Math.random() < 0.2; // 20% giường đã có người
      
      seats.push({
        id: seatId,
        row: comp.toString(),
        column: bed,
        floor: floor as 1 | 2,
        price: 1500000 + Math.floor(Math.random() * 200000),
        status: isOccupied ? 'occupied' : 'available',
        behavior: Math.random() < 0.8 ? 'quiet' : 'social',
        nearWC: comp === 1 || comp === compartments,
        nearSimilarBehavior: Math.random() < 0.6,
        passengersNearby: Math.floor(Math.random() * 4),
        trainId,
        coachId,
        compartment: comp
      });
    }
  }
  
  return seats;
};

// Hàm tạo tất cả ghế cho một chuyến tàu
export const generateTrainSeats = (trainId: string, coaches: { id: number; type: string; seats: number }[]): Seat[] => {
  const allSeats: Seat[] = [];
  
  coaches.forEach(coach => {
    let coachSeats: Seat[] = [];
    
    switch (coach.type) {
      case 'Soft seat':
        coachSeats = generateSoftSeatSeats(trainId, coach.id);
        break;
      case '6-berth cabin':
        coachSeats = generate6BerthCabinSeats(trainId, coach.id);
        break;
      case '4-berth cabin':
        coachSeats = generate4BerthCabinSeats(trainId, coach.id);
        break;
    }
    
    allSeats.push(...coachSeats);
  });
  
  return allSeats;
};

// Mock dữ liệu noise matrix cho các toa
export const NOISE_MATRIX_SOFT_SEAT = [
  [1200, 1205, 1210, 1215],
  [1235, 1240, 1245, 1250],
  [1270, 1275, 1280, 1285],
  [1305, 1310, 1315, 1320],
  [1335, 1340, 1345, 1350],
  [1365, 1370, 1375, 1380],
  [1395, 1400, 1405, 1410]
];

export const NOISE_MATRIX_6_BERTH = [
  [1200, 1205, 1210, 1215, 1220, 1225],
  [1235, 1240, 1245, 1250, 1255, 1260],
  [1270, 1275, 1280, 1285, 1290, 1295],
  [1305, 1310, 1315, 1320, 1325, 1330],
  [1335, 1340, 1345, 1350, 1355, 1360],
  [1365, 1370, 1375, 1380, 1385, 1390],
  [1395, 1400, 1405, 1410, 1415, 1420]
];

export const NOISE_MATRIX_4_BERTH = [
  [1150, 1155, 1160, 1165],
  [1185, 1190, 1195, 1200],
  [1220, 1225, 1230, 1235],
  [1255, 1260, 1265, 1270],
  [1285, 1290, 1295, 1300],
  [1315, 1320, 1325, 1330],
  [1345, 1350, 1355, 1360]
];

// Hàm lấy màu noise dựa trên giá trị
export const getNoiseColor = (value: number): string => {
  if (value < 1200) return '#4caf50'; // green - quiet
  if (value < 1300) return '#ffeb3b'; // yellow - moderate
  if (value < 1400) return '#ff9800'; // orange - noisy
  return '#f44336'; // red - very noisy
};

// Hàm lấy ghế theo ID
export const getSeatById = (seatId: string, trainSeats: Seat[]): Seat | undefined => {
  return trainSeats.find(seat => seat.id === seatId);
};

// Hàm lấy ghế theo toa
export const getSeatsByCoach = (coachId: number, trainSeats: Seat[]): Seat[] => {
  return trainSeats.filter(seat => seat.coachId === coachId);
};

// Hàm kiểm tra khoang trống
export const isCompartmentEmpty = (compartmentNumber: number, coachSeats: Seat[]): boolean => {
  const compartmentSeats = coachSeats.filter(seat => seat.compartment === compartmentNumber);
  return compartmentSeats.every(seat => seat.status === 'available');
};

// Hàm tìm khoang trống gần nhất
export const findNearestEmptyCompartment = (coachSeats: Seat[], targetCompartment: number = 1): number => {
  const compartments = [...new Set(coachSeats.map(seat => seat.compartment).filter(Boolean))];
  
  for (let i = 0; i < compartments.length; i++) {
    const comp = compartments[i];
    if (comp && isCompartmentEmpty(comp, coachSeats)) {
      return comp;
    }
  }
  
  return -1; // Không tìm thấy khoang trống
};

// Hàm tính khoảng cách đến toilet
export const getDistanceFromToilet = (seatRow: string, seatColumn: number): number => {
  // Toilet thường ở đầu và cuối toa
  const rowIndex = parseInt(seatRow) || seatRow.charCodeAt(0) - 'A'.charCodeAt(0);
  const distanceFromStart = rowIndex + (seatColumn - 1) * 0.1;
  const distanceFromEnd = Math.abs(7 - rowIndex) + (seatColumn - 1) * 0.1;
  
  return Math.min(distanceFromStart, distanceFromEnd);
};
