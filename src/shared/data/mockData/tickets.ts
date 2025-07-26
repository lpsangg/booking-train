// Mock data cho đặt vé và tickets
export interface Ticket {
  id: string;
  userId: string;
  trainId: string;
  trainName: string;
  route: {
    from: string;
    fromStation: string;
    to: string;
    toStation: string;
  };
  schedule: {
    departDate: string;
    departTime: string;
    arrivalDate: string;
    arrivalTime: string;
    duration: string;
  };
  passengers: BookingPassenger[];
  seats: BookingSeat[];
  pricing: {
    subtotal: number;
    discounts: number;
    taxes: number;
    total: number;
  };
  bookingDate: string;
  status: 'Confirmed' | 'Cancelled' | 'Completed' | 'Pending';
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  confirmationCode: string;
  eTicketUrl?: string;
  qrCode: string;
  cancellationPolicy: {
    canCancel: boolean;
    refundPercentage: number;
    deadline: string;
  };
}

export interface BookingPassenger {
  id: string;
  type: 'adult' | 'child' | 'elderly' | 'student' | 'union';
  fullName: string;
  idCard?: string;
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  seatId: string;
}

export interface BookingSeat {
  id: string;
  coachId: number;
  coachType: string;
  row: string;
  column: number;
  floor?: number;
  compartment?: number;
  price: number;
  passengerType: 'adult' | 'child' | 'elderly' | 'student' | 'union';
}

export interface BookingRequest {
  userId: string;
  trainId: string;
  departDate: string;
  passengers: {
    type: 'adult' | 'child' | 'elderly' | 'student' | 'union';
    fullName: string;
    idCard?: string;
    dateOfBirth?: string;
    phone?: string;
    email?: string;
  }[];
  selectedSeats: string[];
  paymentMethod: 'CreditCard' | 'BankTransfer' | 'EWallet' | 'Cash';
}

// Mock database của tickets
export const MOCK_TICKETS: Ticket[] = [
  {
    id: 'TCK_001',
    userId: 'user_001',
    trainId: 'SE1',
    trainName: 'SE1',
    route: {
      from: 'HN',
      fromStation: 'Ga Hà Nội',
      to: 'SG',
      toStation: 'Ga Sài Gòn'
    },
    schedule: {
      departDate: '2025-07-20',
      departTime: '19:20',
      arrivalDate: '2025-07-22',
      arrivalTime: '05:40',
      duration: '34h20m'
    },
    passengers: [
      {
        id: 'pass_001_1',
        type: 'adult',
        fullName: 'John Smith',
        idCard: '123456789012',
        dateOfBirth: '1990-05-15',
        phone: '0901234567',
        email: 'john.smith@email.com',
        seatId: 'SE1-6-1-1'
      }
    ],
    seats: [
      {
        id: 'SE1-6-1-1',
        coachId: 6,
        coachType: '4-berth cabin',
        row: '1',
        column: 1,
        floor: 1,
        compartment: 1,
        price: 1500000,
        passengerType: 'adult'
      }
    ],
    pricing: {
      subtotal: 1500000,
      discounts: 150000, // Gold membership 10%
      taxes: 0,
      total: 1350000
    },
    bookingDate: '2025-07-15T14:30:00Z',
    status: 'Confirmed',
    paymentMethod: 'CreditCard',
    paymentStatus: 'Paid',
    confirmationCode: 'VNR-SE1-20250720-001',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    cancellationPolicy: {
      canCancel: true,
      refundPercentage: 80,
      deadline: '2025-07-19T19:20:00Z'
    }
  },
  {
    id: 'TCK_002',
    userId: 'user_002',
    trainId: 'SE5',
    trainName: 'SE5',
    route: {
      from: 'HN',
      fromStation: 'Ga Hà Nội',
      to: 'DN',
      toStation: 'Ga Đà Nẵng'
    },
    schedule: {
      departDate: '2025-07-25',
      departTime: '14:15',
      arrivalDate: '2025-07-26',
      arrivalTime: '06:30',
      duration: '16h15m'
    },
    passengers: [
      {
        id: 'pass_002_1',
        type: 'adult',
        fullName: 'Nguyễn Thị Mary',
        idCard: '987654321098',
        dateOfBirth: '1995-08-20',
        phone: '0912345678',
        email: 'mary.nguyen@email.com',
        seatId: 'SE5-3-2-3'
      },
      {
        id: 'pass_002_2',
        type: 'child',
        fullName: 'Nguyễn Văn Con',
        dateOfBirth: '2018-03-10',
        seatId: 'SE5-3-2-4'
      }
    ],
    seats: [
      {
        id: 'SE5-3-2-3',
        coachId: 3,
        coachType: '6-berth cabin',
        row: '2',
        column: 3,
        floor: 2,
        compartment: 2,
        price: 850000,
        passengerType: 'adult'
      },
      {
        id: 'SE5-3-2-4',
        coachId: 3,
        coachType: '6-berth cabin',
        row: '2',
        column: 4,
        floor: 2,
        compartment: 2,
        price: 637500, // 25% discount for child
        passengerType: 'child'
      }
    ],
    pricing: {
      subtotal: 1487500,
      discounts: 74375, // Silver membership 5%
      taxes: 0,
      total: 1413125
    },
    bookingDate: '2025-07-10T09:15:00Z',
    status: 'Confirmed',
    paymentMethod: 'BankTransfer',
    paymentStatus: 'Paid',
    confirmationCode: 'VNR-SE5-20250725-002',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    cancellationPolicy: {
      canCancel: true,
      refundPercentage: 90,
      deadline: '2025-07-24T14:15:00Z'
    }
  }
];

// Hàm tạo confirmation code
export const generateConfirmationCode = (trainId: string, departDate: string): string => {
  const dateStr = departDate.replace(/-/g, '');
  const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `VNR-${trainId}-${dateStr}-${randomSuffix}`;
};

// Hàm tạo QR code (giả lập)
export const generateQRCode = (ticketId: string): string => {
  // Trong thực tế sẽ sử dụng thư viện tạo QR code thật
  return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`;
};

// Hàm đặt vé
export const createBooking = (request: BookingRequest): { success: boolean; ticket?: Ticket; message: string } => {
  try {
    // Validate request
    if (!request.userId || !request.trainId || !request.departDate) {
      return { success: false, message: 'Missing required booking information' };
    }
    
    if (request.passengers.length === 0 || request.selectedSeats.length === 0) {
      return { success: false, message: 'No passengers or seats selected' };
    }
    
    if (request.passengers.length !== request.selectedSeats.length) {
      return { success: false, message: 'Number of passengers must match number of seats' };
    }
    
    // Tạo ticket ID
    const ticketId = `TCK_${Date.now()}`;
    
    // Tạo passengers với seat assignment
    const passengers: BookingPassenger[] = request.passengers.map((passenger, index) => ({
      id: `pass_${ticketId}_${index + 1}`,
      ...passenger,
      seatId: request.selectedSeats[index]
    }));
    
    // Tạo seat information (giả lập)
    const seats: BookingSeat[] = request.selectedSeats.map((seatId, index) => {
      const passenger = request.passengers[index];
      const basePrice = 1200000; // Giá cơ bản, trong thực tế sẽ lấy từ database
      
      // Tính giá theo loại hành khách
      const discounts = {
        adult: 0,
        child: 0.25,
        elderly: 0.15,
        student: 0.10,
        union: 0.05
      };
      
      const price = Math.round(basePrice * (1 - discounts[passenger.type]));
      
      return {
        id: seatId,
        coachId: parseInt(seatId.split('-')[1]) || 1,
        coachType: '6-berth cabin', // Giả lập
        row: seatId.split('-')[2] || '1',
        column: parseInt(seatId.split('-')[3]) || 1,
        floor: 1,
        price,
        passengerType: passenger.type
      };
    });
    
    // Tính tổng tiền
    const subtotal = seats.reduce((sum, seat) => sum + seat.price, 0);
    const discounts = 0; // Có thể tính discount membership ở đây
    const taxes = 0;
    const total = subtotal - discounts + taxes;
    
    // Tạo ticket
    const ticket: Ticket = {
      id: ticketId,
      userId: request.userId,
      trainId: request.trainId,
      trainName: request.trainId, // Giả lập
      route: {
        from: 'HN',
        fromStation: 'Ga Hà Nội',
        to: 'SG',
        toStation: 'Ga Sài Gòn'
      },
      schedule: {
        departDate: request.departDate,
        departTime: '19:20',
        arrivalDate: request.departDate,
        arrivalTime: '05:40+2',
        duration: '34h20m'
      },
      passengers,
      seats,
      pricing: {
        subtotal,
        discounts,
        taxes,
        total
      },
      bookingDate: new Date().toISOString(),
      status: 'Pending',
      paymentMethod: request.paymentMethod,
      paymentStatus: 'Pending',
      confirmationCode: generateConfirmationCode(request.trainId, request.departDate),
      qrCode: generateQRCode(ticketId),
      cancellationPolicy: {
        canCancel: true,
        refundPercentage: 80,
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
      }
    };
    
    // Thêm vào database
    MOCK_TICKETS.push(ticket);
    
    return { success: true, ticket, message: 'Booking created successfully' };
    
  } catch (error) {
    return { success: false, message: 'Failed to create booking' };
  }
};

// Hàm lấy tickets theo user ID
export const getTicketsByUserId = (userId: string): Ticket[] => {
  return MOCK_TICKETS.filter(ticket => ticket.userId === userId);
};

// Hàm lấy ticket theo ID
export const getTicketById = (ticketId: string): Ticket | undefined => {
  return MOCK_TICKETS.find(ticket => ticket.id === ticketId);
};

// Hàm hủy vé
export const cancelTicket = (ticketId: string): { success: boolean; message: string } => {
  const ticketIndex = MOCK_TICKETS.findIndex(ticket => ticket.id === ticketId);
  
  if (ticketIndex === -1) {
    return { success: false, message: 'Ticket not found' };
  }
  
  const ticket = MOCK_TICKETS[ticketIndex];
  
  // Kiểm tra có thể hủy không
  if (!ticket.cancellationPolicy.canCancel) {
    return { success: false, message: 'This ticket cannot be cancelled' };
  }
  
  // Kiểm tra deadline
  const deadline = new Date(ticket.cancellationPolicy.deadline);
  if (new Date() > deadline) {
    return { success: false, message: 'Cancellation deadline has passed' };
  }
  
  // Cập nhật status
  MOCK_TICKETS[ticketIndex] = {
    ...ticket,
    status: 'Cancelled',
    paymentStatus: 'Refunded'
  };
  
  return { success: true, message: 'Ticket cancelled successfully' };
};

// Hàm xác nhận thanh toán
export const confirmPayment = (ticketId: string): { success: boolean; message: string } => {
  const ticketIndex = MOCK_TICKETS.findIndex(ticket => ticket.id === ticketId);
  
  if (ticketIndex === -1) {
    return { success: false, message: 'Ticket not found' };
  }
  
  // Cập nhật status
  MOCK_TICKETS[ticketIndex] = {
    ...MOCK_TICKETS[ticketIndex],
    status: 'Confirmed',
    paymentStatus: 'Paid'
  };
  
  return { success: true, message: 'Payment confirmed successfully' };
};

// Hàm lấy thống kê đặt vé
export const getBookingStats = (userId?: string): {
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalSpent: number;
} => {
  let tickets = MOCK_TICKETS;
  
  if (userId) {
    tickets = tickets.filter(ticket => ticket.userId === userId);
  }
  
  return {
    totalBookings: tickets.length,
    confirmedBookings: tickets.filter(t => t.status === 'Confirmed').length,
    cancelledBookings: tickets.filter(t => t.status === 'Cancelled').length,
    totalSpent: tickets
      .filter(t => t.paymentStatus === 'Paid')
      .reduce((sum, ticket) => sum + ticket.pricing.total, 0)
  };
};
