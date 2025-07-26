export interface User {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: Address;
  loyaltyPoints: number;
  membershipLevel: MembershipLevel;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  province: string;
  country: string;
  postalCode?: string;
}

export type MembershipLevel = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface UserPreferences {
  language: 'vi' | 'en';
  currency: 'VND' | 'USD';
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  seatPreferences: {
    preferredCoachType: string[];
    preferredSeatPosition: string[];
  };
}

export interface UserProfile {
  user: User;
  recentBookings: string[]; // booking IDs
  savedRoutes: SavedRoute[];
  paymentMethods: PaymentMethod[];
}

export interface SavedRoute {
  id: string;
  name: string;
  origin: string;
  destination: string;
  createdAt: string;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'bank_transfer' | 'e_wallet';
  name: string;
  lastFourDigits?: string;
  isDefault: boolean;
}
