export interface Station {
  id: string;
  name: string;
  display: string;
  province?: string;
  region?: string;
}

export interface Train {
  id: string;
  name: string;
  route: {
    from: string;
    to: string;
  };
  departure: string;
  arrival: string;
  duration: string;
  coaches: Coach[];
  status: 'active' | 'inactive' | 'delayed';
}

export interface Coach {
  id: string;
  name: string;
  type: CoachType;
  totalSeats: number;
  availableSeats: number;
  basePrice: number;
  amenities: string[];
}

export type CoachType = 
  | 'seating'
  | 'sleeper_6_berth' 
  | 'sleeper_4_berth';

export interface Seat {
  id: string;
  coachId: string;
  car: number;
  row: number;
  position: SeatPosition;
  isOccupied: boolean;
  price: number;
  features?: string[];
}

export type SeatPosition = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface SeatPricing {
  trainId: string;
  routes: RoutePrice[];
}

export interface RoutePrice {
  origin: string;
  destination: string;
  fares: {
    seating?: CarPricing[];
    sleeper_6_berth?: CarPricing[];
    sleeper_4_berth?: CarPricing[];
  };
}

export interface CarPricing {
  car_number: number;
  rows: RowPricing[];
}

export interface RowPricing {
  row_numbers: number[];
  price: number;
}
