export interface PaymentRequest {
  bookingId: string;
  amount: number;
  currency: string;
  method: PaymentMethodType;
  methodDetails: PaymentMethodDetails;
  returnUrl?: string;
}

export type PaymentMethodType = 
  | 'credit_card' 
  | 'debit_card' 
  | 'bank_transfer' 
  | 'e_wallet' 
  | 'cash';

export interface PaymentMethodDetails {
  // For cards
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  cardholderName?: string;
  
  // For bank transfer
  bankCode?: string;
  accountNumber?: string;
  
  // For e-wallet
  walletType?: 'momo' | 'zalopay' | 'vnpay';
  walletAccount?: string;
}

export interface PaymentResponse {
  paymentId: string;
  status: PaymentStatus;
  transactionId?: string;
  redirectUrl?: string;
  message: string;
  processedAt: string;
}

export type PaymentStatus = 
  | 'pending' 
  | 'processing' 
  | 'success' 
  | 'failed' 
  | 'cancelled' 
  | 'refunded';

export interface PaymentHistory {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  method: PaymentMethodType;
  status: PaymentStatus;
  transactionId?: string;
  createdAt: string;
  processedAt?: string;
  failureReason?: string;
}

export interface RefundRequest {
  paymentId: string;
  amount: number;
  reason: string;
  bankAccount?: BankAccountInfo;
}

export interface BankAccountInfo {
  bankCode: string;
  accountNumber: string;
  accountName: string;
  branchName?: string;
}

export interface PaymentConfig {
  supportedMethods: PaymentMethodType[];
  fees: {
    [key in PaymentMethodType]?: number;
  };
  limits: {
    min: number;
    max: number;
  };
}
