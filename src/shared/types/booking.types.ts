export interface BookingSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: PassengerCounts;
  tripType: 'one-way' | 'round-trip';
}

export interface PassengerCounts {
  adults: number;
  children: number;
  students: number;
  elderly: number;
}

export interface Passenger {
  id?: string;
  type: PassengerType;
  fullName: string;
  dateOfBirth: string;
  idNumber: string;
  idType: 'citizen_id' | 'passport' | 'student_id';
  gender: 'male' | 'female';
  nationality: string;
}

export type PassengerType = 'adult' | 'child' | 'student' | 'elderly';

export interface BookingDetails {
  id: string;
  bookingCode: string;
  status: BookingStatus;
  train: TrainBookingInfo;
  passengers: Passenger[];
  seats: SeatSelection[];
  pricing: BookingPricing;
  contactInfo: ContactInfo;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'paid' 
  | 'cancelled' 
  | 'completed';

export interface TrainBookingInfo {
  trainId: string;
  trainName: string;
  route: {
    origin: string;
    destination: string;
  };
  schedule: {
    departureDate: string;
    departureTime: string;
    arrivalDate: string;
    arrivalTime: string;
  };
}

export interface SeatSelection {
  passengerId: string;
  coachId: string;
  coachType: string;
  carNumber: number;
  seatNumber: string;
  seatPosition: string;
  price: number;
}

export interface BookingPricing {
  subtotal: number;
  fees: Fee[];
  discounts: Discount[];
  total: number;
  currency: string;
}

export interface Fee {
  type: 'service' | 'booking' | 'payment';
  name: string;
  amount: number;
}

export interface Discount {
  type: 'promotion' | 'loyalty' | 'group';
  name: string;
  amount: number;
  code?: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  fullName: string;
}

// Import types to avoid circular dependencies
import type { Train, Seat, CoachType } from './train.types';
