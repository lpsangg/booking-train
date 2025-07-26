export const APP_ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forget',
  
  // Booking flow
  MAIN: '/main',
  SEARCH_RESULTS: '/search-results',
  SELECT_TRAIN: '/select-train',
  SELECT_SEAT: '/select-seat',
  PASSENGER_INFO: '/passenger-info',
  PAYMENT: '/payment',
  E_TICKET: '/e-ticket',
  
  // User account
  ACCOUNT: '/account',
  TICKETS: '/tickets',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
  
  // Additional features
  PROMOTIONS: '/promotions',
  PROMOTIONS_LIST: '/promotions-list',
  REWARD: '/reward',
  REFERRAL: '/referral',
  CARDS: '/cards',
  REVIEW: '/review',
  
  // Payment methods
  ADD_INTERNATIONAL_CARD: '/add-international-card',
  ADD_DOMESTIC_CARD: '/add-domestic-card',
  ATM_DOMESTIC_CONFIRM: '/atm-domestic-confirm',
  
  // Support
  SUPPORT_CENTER: '/support-center',
  FAQ: '/faq/:id',
  FEEDBACK: '/feedback',
  TRIP_DETAILS: '/trip-details'
} as const;

export const COACH_TYPES = {
  SEATING: 'seating',
  SLEEPER_6_BERTH: 'sleeper_6_berth',
  SLEEPER_4_BERTH: 'sleeper_4_berth'
} as const;

export const RECORD_TYPES = {
  STANDARD_SEATS: 'standard',
  MEDIUM_PRIORITY: 'medium_priority', 
  HIGH_PRIORITY: 'high_priority'
} as const;

export const SEAT_CATEGORIES = {
  STANDARD_SEATS: {
    key: 'standard',
    label: 'Standard Seats',
    description: 'Regular seating without sleeping',
    coaches: [1, 2],
    priority: 1
  },
  BERTH_6_CABINS: {
    key: 'medium_priority', 
    label: '6-Berth Cabins',
    description: 'Shared sleeper compartments (6 beds)',
    coaches: [3, 4, 5],
    priority: 2
  },
  BERTH_4_CABINS: {
    key: 'high_priority',
    label: '4-Berth Cabins', 
    description: 'Premium sleeper compartments (4 beds)',
    coaches: [6, 7, 8, 9, 10],
    priority: 3
  }
} as const;

export const PASSENGER_TYPES = {
  ADULT: 'adult',
  CHILD: 'child', 
  STUDENT: 'student',
  ELDERLY: 'elderly',
  EXPECTANT_NURSING_MOTHER: 'expectant_nursing_mother'
} as const;

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PAID: 'paid',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
} as const;

export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  BANK_TRANSFER: 'bank_transfer',
  E_WALLET: 'e_wallet',
  CASH: 'cash'
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
} as const;
