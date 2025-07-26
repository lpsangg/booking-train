// Central export file for all mock data
export * from './stations';
export * from './trains';
export * from './seats';
export * from './users';
export * from './tickets';
export * from './notifications';
export * from './seatPricing';
export * from './allTrainPricing';
export * from './demoSeatPricing';
export * from './completeTrainPricing';
export * from './pricingUtils';
export * from './pricingTests';
export * from './generatedPricingIntegration';
export * from './generated';
export * from './generated';
export * from './generatedPricingIntegration';
export * from './generated';
export * from './generatedPricingIntegration';

// Export all mock data as convenient grouped exports
export { 
  STATIONS,
  searchStations,
  getStationById,
  getStationByDisplay
} from './stations';

export {
  TRAINS,
  getTrainById,
  searchTrains,
  calculatePrice
} from './trains';

export {
  generateSoftSeatSeats,
  generate6BerthCabinSeats,
  generate4BerthCabinSeats,
  generateTrainSeats,
  NOISE_MATRIX_SOFT_SEAT,
  NOISE_MATRIX_6_BERTH,
  NOISE_MATRIX_4_BERTH,
  getNoiseColor,
  getSeatById,
  getSeatsByCoach,
  isCompartmentEmpty,
  findNearestEmptyCompartment,
  getDistanceFromToilet
} from './seats';

export {
  SEAT_PRICING_DATA,
  SEAT_BEHAVIOR_DATA,
  getSeatPrice,
  getSeatBehavior,
  generateDefaultSeatBehavior
} from './seatPricing';

export {
  MOCK_USERS,
  MOCK_PASSWORDS,
  authenticateUser,
  registerUser,
  getUserById,
  updateUser,
  changePassword,
  forgotPassword,
  calculateMembershipLevel,
  getMembershipDiscount
} from './users';

export {
  MOCK_TICKETS,
  generateConfirmationCode,
  generateQRCode,
  createBooking,
  getTicketsByUserId,
  getTicketById,
  cancelTicket,
  confirmPayment,
  getBookingStats
} from './tickets';

export {
  MOCK_NOTIFICATIONS,
  MOCK_REVIEWS,
  MOCK_PROMOTIONS,
  getNotificationsByUserId,
  markNotificationAsRead,
  getUnreadNotificationCount,
  getReviewsByTrainId,
  getAverageRating,
  addReview,
  voteHelpful,
  getActivePromotions,
  canApplyPromotion,
  calculatePromotionDiscount
} from './notifications';

// Version information
export const MOCK_DATA_VERSION = '1.0.0';
export const LAST_UPDATED = '2025-07-20T10:00:00Z';

// Configuration constants
export const MOCK_CONFIG = {
  DEFAULT_PAGINATION_SIZE: 10,
  MAX_SEARCH_RESULTS: 50,
  BOOKING_TIMEOUT_MINUTES: 15,
  PAYMENT_TIMEOUT_MINUTES: 10,
  DEFAULT_CURRENCY: 'VND',
  SUPPORTED_LANGUAGES: ['vi', 'en'],
  MAX_PASSENGERS_PER_BOOKING: 10,
  ADVANCE_BOOKING_DAYS: 60,
  CANCELLATION_HOURS_LIMIT: 24
};

// Helper functions for common operations
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(d);
};

export const formatTime = (time: string): string => {
  return time.substring(0, 5); // Extract HH:mm from HH:mm:ss
};

export const formatDateTime = (dateTime: string | Date): string => {
  const d = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
};

export const calculateDuration = (startTime: string, endTime: string): string => {
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  let diff = end.getTime() - start.getTime();
  
  // Handle next day arrival
  if (diff < 0) {
    diff += 24 * 60 * 60 * 1000;
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
  return phoneRegex.test(phone);
};

export const isValidVietnameseIdNumber = (idNumber: string): boolean => {
  // Vietnamese ID format: 12 digits
  const idRegex = /^[0-9]{12}$/;
  return idRegex.test(idNumber);
};

// Search and filter utilities
export const fuzzySearch = (query: string, text: string): boolean => {
  const normalizeText = (str: string) => 
    str.toLowerCase()
       .normalize('NFD')
       .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
       .replace(/đ/g, 'd');
  
  const normalizedQuery = normalizeText(query);
  const normalizedText = normalizeText(text);
  
  return normalizedText.includes(normalizedQuery);
};

export const sortByRelevance = <T>(
  items: T[], 
  query: string, 
  getSearchText: (item: T) => string
): T[] => {
  if (!query.trim()) return items;
  
  return items
    .map(item => ({
      item,
      score: calculateRelevanceScore(query, getSearchText(item))
    }))
    .sort((a, b) => b.score - a.score)
    .map(result => result.item);
};

const calculateRelevanceScore = (query: string, text: string): number => {
  const normalizedQuery = query.toLowerCase();
  const normalizedText = text.toLowerCase();
  
  // Exact match gets highest score
  if (normalizedText === normalizedQuery) return 100;
  
  // Starts with query gets high score
  if (normalizedText.startsWith(normalizedQuery)) return 80;
  
  // Contains query gets medium score
  if (normalizedText.includes(normalizedQuery)) return 60;
  
  // Word boundary match gets lower score
  const words = normalizedText.split(' ');
  for (const word of words) {
    if (word.startsWith(normalizedQuery)) return 40;
  }
  
  return 0;
};

// Data generation utilities for testing
export const generateRandomData = {
  // Generate random user for testing
  user: () => ({
    email: `user${Math.floor(Math.random() * 10000)}@example.com`,
    firstName: ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng'][Math.floor(Math.random() * 5)],
    lastName: ['Văn A', 'Thị B', 'Văn C', 'Thị D'][Math.floor(Math.random() * 4)],
    phoneNumber: `09${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
    dateOfBirth: '1990-01-01',
    gender: Math.random() > 0.5 ? 'male' : 'female' as 'male' | 'female',
    address: 'Hà Nội',
    idNumber: Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0'),
    membershipLevel: 'Basic' as 'Basic' | 'Silver' | 'Gold' | 'Platinum',
    totalSpent: 0,
    joinDate: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    isActive: true
  }),
  
  // Generate random booking for testing
  booking: (userId: string, trainId: string) => ({
    userId,
    trainId,
    departureDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    fromStationCode: 'HN',
    toStationCode: 'SG',
    passengers: [{
      id: 'pass_1',
      name: 'Nguyễn Văn A',
      type: 'adult',
      idNumber: '123456789012',
      seatNumber: 'A1'
    }],
    totalAmount: Math.floor(Math.random() * 2000000) + 500000,
    status: 'pending'
  })
};
