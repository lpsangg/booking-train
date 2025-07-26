// Mock data cho thông báo và reviews
export interface Notification {
  id: string;
  userId: string;
  type: 'booking' | 'promotion' | 'system' | 'reminder' | 'alert';
  title: string;
  message: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  expiresAt?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface Review {
  id: string;
  userId: string;
  trainId: string;
  tripDate: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  pros: string[];
  cons: string[];
  wouldRecommend: boolean;
  categories: {
    cleanliness: number;
    comfort: number;
    service: number;
    punctuality: number;
    valueForMoney: number;
  };
  helpfulVotes: number;
  isVerifiedPurchase: boolean;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumAmount?: number;
  validFrom: string;
  validTo: string;
  applicableTrains?: string[];
  applicableRoutes?: string[];
  maxUsage?: number;
  currentUsage: number;
  isActive: boolean;
  termsAndConditions: string[];
}

// Mock notifications
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_001',
    userId: 'user_001',
    type: 'booking',
    title: 'Booking Confirmed',
    message: 'Your train ticket SE1 for July 20, 2025 has been confirmed. Have a safe journey!',
    isRead: false,
    priority: 'medium',
    createdAt: '2025-07-15T14:35:00Z',
    actionUrl: '/tickets/TCK_001'
  },
  {
    id: 'notif_002',
    userId: 'user_001',
    type: 'reminder',
    title: 'Journey Reminder',
    message: 'Your train SE1 departs tomorrow at 19:20 from Ga Hà Nội. Please arrive 30 minutes early.',
    isRead: false,
    priority: 'high',
    createdAt: '2025-07-19T08:00:00Z',
    actionUrl: '/tickets/TCK_001'
  },
  {
    id: 'notif_003',
    userId: 'user_002',
    type: 'promotion',
    title: 'Summer Special - 20% Off',
    message: 'Book your summer vacation now! Get 20% off on all routes. Valid until July 31, 2025.',
    isRead: true,
    priority: 'low',
    createdAt: '2025-07-01T10:00:00Z',
    expiresAt: '2025-07-31T23:59:59Z',
    actionUrl: '/promotions/SUMMER2025'
  },
  {
    id: 'notif_004',
    userId: 'user_001',
    type: 'system',
    title: 'Maintenance Notice',
    message: 'System maintenance scheduled for July 22, 2025 from 01:00 to 03:00. Online booking may be unavailable.',
    isRead: true,
    priority: 'medium',
    createdAt: '2025-07-18T12:00:00Z'
  },
  {
    id: 'notif_005',
    userId: 'user_002',
    type: 'alert',
    title: 'Weather Alert',
    message: 'Heavy rain expected on your travel route. Train SE5 may experience delays. We will keep you updated.',
    isRead: false,
    priority: 'urgent',
    createdAt: '2025-07-24T16:30:00Z',
    metadata: { trainId: 'SE5', affectedRoute: 'HN-DN' }
  }
];

// Mock reviews
export const MOCK_REVIEWS: Review[] = [
  {
    id: 'review_001',
    userId: 'user_001',
    trainId: 'SE1',
    tripDate: '2025-06-15',
    rating: 4,
    title: 'Comfortable journey with minor delays',
    comment: 'Overall good experience. The 4-berth cabin was clean and comfortable. Staff was friendly and helpful. Only complaint is the train was 30 minutes late arriving in Sài Gòn.',
    pros: ['Clean cabin', 'Friendly staff', 'Comfortable beds', 'Good air conditioning'],
    cons: ['Late arrival', 'Limited food options', 'Noisy at night'],
    wouldRecommend: true,
    categories: {
      cleanliness: 5,
      comfort: 4,
      service: 4,
      punctuality: 3,
      valueForMoney: 4
    },
    helpfulVotes: 12,
    isVerifiedPurchase: true,
    createdAt: '2025-06-16T10:30:00Z',
    status: 'approved'
  },
  {
    id: 'review_002',
    userId: 'user_002',
    trainId: 'SE5',
    tripDate: '2025-06-20',
    rating: 5,
    title: 'Excellent service and punctuality',
    comment: 'Perfect trip from Hà Nội to Đà Nẵng. Train was on time, staff was professional, and the 6-berth cabin was surprisingly comfortable for the price.',
    pros: ['On time', 'Professional staff', 'Good value for money', 'Scenic route'],
    cons: ['Cabin a bit cramped with 6 people'],
    wouldRecommend: true,
    categories: {
      cleanliness: 4,
      comfort: 4,
      service: 5,
      punctuality: 5,
      valueForMoney: 5
    },
    helpfulVotes: 8,
    isVerifiedPurchase: true,
    createdAt: '2025-06-21T14:15:00Z',
    status: 'approved'
  },
  {
    id: 'review_003',
    userId: 'user_003',
    trainId: 'SE22',
    tripDate: '2025-07-01',
    rating: 3,
    title: 'Average experience, needs improvement',
    comment: 'The high-speed train was fast but the soft seats could be more comfortable for the 2.5 hour journey. WiFi was spotty.',
    pros: ['Fast journey', 'Modern train', 'Good air conditioning'],
    cons: ['Uncomfortable seats', 'Poor WiFi', 'Expensive'],
    wouldRecommend: false,
    categories: {
      cleanliness: 4,
      comfort: 2,
      service: 3,
      punctuality: 4,
      valueForMoney: 2
    },
    helpfulVotes: 3,
    isVerifiedPurchase: true,
    createdAt: '2025-07-02T09:20:00Z',
    status: 'approved'
  }
];

// Mock promotions
export const MOCK_PROMOTIONS: Promotion[] = [
  {
    id: 'SUMMER2025',
    title: 'Summer Special 2025',
    description: 'Get 20% off on all train tickets for your summer vacation',
    discountType: 'percentage',
    discountValue: 20,
    minimumAmount: 500000,
    validFrom: '2025-07-01T00:00:00Z',
    validTo: '2025-07-31T23:59:59Z',
    maxUsage: 1000,
    currentUsage: 234,
    isActive: true,
    termsAndConditions: [
      'Valid for bookings made between July 1-31, 2025',
      'Minimum booking amount: 500,000 VND',
      'Cannot be combined with other promotions',
      'Valid for all routes and train types'
    ]
  },
  {
    id: 'STUDENT15',
    title: 'Student Discount',
    description: 'Additional 15% off for students (on top of regular student discount)',
    discountType: 'percentage',
    discountValue: 15,
    validFrom: '2025-01-01T00:00:00Z',
    validTo: '2025-12-31T23:59:59Z',
    maxUsage: 5000,
    currentUsage: 1456,
    isActive: true,
    termsAndConditions: [
      'Valid student ID required',
      'Cannot be combined with other promotions',
      'Valid for all routes'
    ]
  },
  {
    id: 'WEEKEND50',
    title: 'Weekend Getaway',
    description: 'Fixed 50,000 VND discount for weekend trips',
    discountType: 'fixed',
    discountValue: 50000,
    minimumAmount: 300000,
    validFrom: '2025-07-01T00:00:00Z',
    validTo: '2025-08-31T23:59:59Z',
    applicableTrains: ['SE5', 'SE6', 'SE7', 'SE8'],
    maxUsage: 500,
    currentUsage: 89,
    isActive: true,
    termsAndConditions: [
      'Valid for Friday, Saturday, Sunday departures only',
      'Minimum booking amount: 300,000 VND',
      'Valid for selected trains only'
    ]
  }
];

// Hàm lấy notifications theo user ID
export const getNotificationsByUserId = (userId: string): Notification[] => {
  return MOCK_NOTIFICATIONS.filter(notif => notif.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Hàm đánh dấu đã đọc notification
export const markNotificationAsRead = (notificationId: string): { success: boolean; message: string } => {
  const notifIndex = MOCK_NOTIFICATIONS.findIndex(notif => notif.id === notificationId);
  
  if (notifIndex === -1) {
    return { success: false, message: 'Notification not found' };
  }
  
  MOCK_NOTIFICATIONS[notifIndex].isRead = true;
  
  return { success: true, message: 'Notification marked as read' };
};

// Hàm lấy số notification chưa đọc
export const getUnreadNotificationCount = (userId: string): number => {
  return MOCK_NOTIFICATIONS.filter(notif => notif.userId === userId && !notif.isRead).length;
};

// Hàm lấy reviews theo train ID
export const getReviewsByTrainId = (trainId: string): Review[] => {
  return MOCK_REVIEWS.filter(review => review.trainId === trainId && review.status === 'approved')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Hàm tính rating trung bình
export const getAverageRating = (trainId: string): { average: number; total: number } => {
  const reviews = getReviewsByTrainId(trainId);
  
  if (reviews.length === 0) {
    return { average: 0, total: 0 };
  }
  
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  const average = Math.round((sum / reviews.length) * 10) / 10; // Round to 1 decimal
  
  return { average, total: reviews.length };
};

// Hàm thêm review mới
export const addReview = (review: Omit<Review, 'id' | 'createdAt' | 'status' | 'helpfulVotes'>): { success: boolean; review?: Review; message: string } => {
  const newReview: Review = {
    ...review,
    id: `review_${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'pending',
    helpfulVotes: 0
  };
  
  MOCK_REVIEWS.push(newReview);
  
  return { success: true, review: newReview, message: 'Review submitted successfully and is pending approval' };
};

// Hàm vote helpful cho review
export const voteHelpful = (reviewId: string): { success: boolean; message: string } => {
  const reviewIndex = MOCK_REVIEWS.findIndex(review => review.id === reviewId);
  
  if (reviewIndex === -1) {
    return { success: false, message: 'Review not found' };
  }
  
  MOCK_REVIEWS[reviewIndex].helpfulVotes += 1;
  
  return { success: true, message: 'Vote recorded successfully' };
};

// Hàm lấy promotions hiện tại
export const getActivePromotions = (): Promotion[] => {
  const now = new Date();
  
  return MOCK_PROMOTIONS.filter(promo => {
    const validFrom = new Date(promo.validFrom);
    const validTo = new Date(promo.validTo);
    
    return promo.isActive && now >= validFrom && now <= validTo;
  });
};

// Hàm kiểm tra promotion có áp dụng được không
export const canApplyPromotion = (promotionId: string, trainId: string, amount: number): { canApply: boolean; message: string } => {
  const promotion = MOCK_PROMOTIONS.find(promo => promo.id === promotionId);
  
  if (!promotion) {
    return { canApply: false, message: 'Promotion not found' };
  }
  
  if (!promotion.isActive) {
    return { canApply: false, message: 'Promotion is not active' };
  }
  
  const now = new Date();
  const validFrom = new Date(promotion.validFrom);
  const validTo = new Date(promotion.validTo);
  
  if (now < validFrom || now > validTo) {
    return { canApply: false, message: 'Promotion is not valid at this time' };
  }
  
  if (promotion.minimumAmount && amount < promotion.minimumAmount) {
    return { canApply: false, message: `Minimum amount required: ${promotion.minimumAmount.toLocaleString()} VND` };
  }
  
  if (promotion.applicableTrains && !promotion.applicableTrains.includes(trainId)) {
    return { canApply: false, message: 'Promotion is not applicable to this train' };
  }
  
  if (promotion.maxUsage && promotion.currentUsage >= promotion.maxUsage) {
    return { canApply: false, message: 'Promotion usage limit reached' };
  }
  
  return { canApply: true, message: 'Promotion can be applied' };
};

// Hàm tính discount amount
export const calculatePromotionDiscount = (promotionId: string, amount: number): number => {
  const promotion = MOCK_PROMOTIONS.find(promo => promo.id === promotionId);
  
  if (!promotion) {
    return 0;
  }
  
  if (promotion.discountType === 'percentage') {
    return Math.round(amount * (promotion.discountValue / 100));
  } else {
    return promotion.discountValue;
  }
};
