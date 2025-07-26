// Mock data cho người dùng và xác thực
export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  fullName: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  address?: {
    street: string;
    city: string;
    province: string;
    country: string;
  };
  idCard?: {
    number: string;
    issueDate: string;
    issuePlace: string;
  };
  membershipLevel: 'Basic' | 'Silver' | 'Gold' | 'Platinum';
  totalTrips: number;
  totalSpent: number;
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  agreesToTerms: boolean;
}

// Mock database của users
export const MOCK_USERS: User[] = [
  {
    id: 'user_001',
    username: 'johnsmith',
    email: 'john.smith@email.com',
    phone: '0901234567',
    fullName: 'John Smith',
    dateOfBirth: '1990-05-15',
    gender: 'Male',
    address: {
      street: '123 Nguyễn Huệ',
      city: 'Hà Nội',
      province: 'Hà Nội',
      country: 'Vietnam'
    },
    idCard: {
      number: '123456789012',
      issueDate: '2015-01-01',
      issuePlace: 'Hà Nội'
    },
    membershipLevel: 'Gold',
    totalTrips: 25,
    totalSpent: 45000000,
    createdAt: '2020-01-15T08:00:00Z',
    lastLogin: '2025-07-18T10:30:00Z',
    isActive: true
  },
  {
    id: 'user_002',
    username: 'marynguyen',
    email: 'mary.nguyen@email.com',
    phone: '0912345678',
    fullName: 'Nguyễn Thị Mary',
    dateOfBirth: '1995-08-20',
    gender: 'Female',
    address: {
      street: '456 Lê Lợi',
      city: 'TP. Hồ Chí Minh',
      province: 'TP. Hồ Chí Minh',
      country: 'Vietnam'
    },
    membershipLevel: 'Silver',
    totalTrips: 12,
    totalSpent: 18000000,
    createdAt: '2021-03-10T14:20:00Z',
    lastLogin: '2025-07-17T16:45:00Z',
    isActive: true
  },
  {
    id: 'user_003',
    username: 'davidle',
    email: 'david.le@email.com',
    phone: '0923456789',
    fullName: 'Lê Văn David',
    dateOfBirth: '1988-12-03',
    gender: 'Male',
    membershipLevel: 'Basic',
    totalTrips: 3,
    totalSpent: 4500000,
    createdAt: '2023-06-05T09:15:00Z',
    lastLogin: '2025-07-15T12:00:00Z',
    isActive: true
  },
  {
    id: 'user_004',
    username: 'admin',
    email: 'admin@railway.vn',
    phone: '0987654321',
    fullName: 'Administrator',
    membershipLevel: 'Platinum',
    totalTrips: 100,
    totalSpent: 0,
    createdAt: '2020-01-01T00:00:00Z',
    lastLogin: '2025-07-18T08:00:00Z',
    isActive: true
  }
];

// Mock passwords (trong thực tế sẽ được hash)
export const MOCK_PASSWORDS: Record<string, string> = {
  'johnsmith': 'password123',
  'marynguyen': 'mary2023',
  'davidle': 'david456',
  'admin': 'admin123'
};

// Hàm đăng nhập
export const authenticateUser = (credentials: LoginCredentials): { success: boolean; user?: User; message: string } => {
  const { username, password } = credentials;
  
  // Tìm user
  const user = MOCK_USERS.find(u => u.username === username && u.isActive);
  
  if (!user) {
    return { success: false, message: 'Username not found or account is disabled' };
  }
  
  // Kiểm tra password
  const storedPassword = MOCK_PASSWORDS[username];
  if (storedPassword !== password) {
    return { success: false, message: 'Incorrect password' };
  }
  
  // Cập nhật last login
  user.lastLogin = new Date().toISOString();
  
  return { success: true, user, message: 'Login successful' };
};

// Hàm đăng ký
export const registerUser = (data: RegisterData): { success: boolean; user?: User; message: string } => {
  const { username, email, phone, password, confirmPassword, fullName, agreesToTerms } = data;
  
  // Validation
  if (!agreesToTerms) {
    return { success: false, message: 'You must agree to the terms and conditions' };
  }
  
  if (password !== confirmPassword) {
    return { success: false, message: 'Passwords do not match' };
  }
  
  if (password.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters long' };
  }
  
  // Kiểm tra username đã tồn tại
  if (MOCK_USERS.find(u => u.username === username)) {
    return { success: false, message: 'Username already exists' };
  }
  
  // Kiểm tra email đã tồn tại
  if (MOCK_USERS.find(u => u.email === email)) {
    return { success: false, message: 'Email already exists' };
  }
  
  // Kiểm tra phone đã tồn tại
  if (MOCK_USERS.find(u => u.phone === phone)) {
    return { success: false, message: 'Phone number already exists' };
  }
  
  // Tạo user mới
  const newUser: User = {
    id: `user_${Date.now()}`,
    username,
    email,
    phone,
    fullName,
    membershipLevel: 'Basic',
    totalTrips: 0,
    totalSpent: 0,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    isActive: true
  };
  
  // Thêm vào database
  MOCK_USERS.push(newUser);
  MOCK_PASSWORDS[username] = password;
  
  return { success: true, user: newUser, message: 'Registration successful' };
};

// Hàm lấy thông tin user theo ID
export const getUserById = (userId: string): User | undefined => {
  return MOCK_USERS.find(user => user.id === userId && user.isActive);
};

// Hàm cập nhật thông tin user
export const updateUser = (userId: string, updates: Partial<User>): { success: boolean; user?: User; message: string } => {
  const userIndex = MOCK_USERS.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    return { success: false, message: 'User not found' };
  }
  
  // Cập nhật user
  MOCK_USERS[userIndex] = { ...MOCK_USERS[userIndex], ...updates };
  
  return { success: true, user: MOCK_USERS[userIndex], message: 'User updated successfully' };
};

// Hàm đổi mật khẩu
export const changePassword = (username: string, oldPassword: string, newPassword: string): { success: boolean; message: string } => {
  const storedPassword = MOCK_PASSWORDS[username];
  
  if (!storedPassword) {
    return { success: false, message: 'User not found' };
  }
  
  if (storedPassword !== oldPassword) {
    return { success: false, message: 'Current password is incorrect' };
  }
  
  if (newPassword.length < 6) {
    return { success: false, message: 'New password must be at least 6 characters long' };
  }
  
  // Cập nhật password
  MOCK_PASSWORDS[username] = newPassword;
  
  return { success: true, message: 'Password changed successfully' };
};

// Hàm quên mật khẩu (giả lập)
export const forgotPassword = (emailOrPhone: string): { success: boolean; message: string } => {
  const user = MOCK_USERS.find(u => u.email === emailOrPhone || u.phone === emailOrPhone);
  
  if (!user) {
    return { success: false, message: 'Email or phone number not found' };
  }
  
  // Trong thực tế sẽ gửi email/SMS reset password
  // Ở đây chỉ giả lập
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  return { 
    success: true, 
    message: `Password reset code sent to ${emailOrPhone}. Reset code: ${resetCode}` 
  };
};

// Hàm tính toán membership level dựa trên tổng chi tiêu
export const calculateMembershipLevel = (totalSpent: number): 'Basic' | 'Silver' | 'Gold' | 'Platinum' => {
  if (totalSpent >= 100000000) return 'Platinum'; // 100M VND
  if (totalSpent >= 50000000) return 'Gold';       // 50M VND
  if (totalSpent >= 20000000) return 'Silver';     // 20M VND
  return 'Basic';
};

// Hàm lấy discount theo membership level
export const getMembershipDiscount = (level: 'Basic' | 'Silver' | 'Gold' | 'Platinum'): number => {
  const discounts = {
    'Basic': 0,
    'Silver': 0.05,
    'Gold': 0.10,
    'Platinum': 0.15
  };
  
  return discounts[level];
};
