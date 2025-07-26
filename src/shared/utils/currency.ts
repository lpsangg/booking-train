// Currency formatting utilities
export const formatCurrency = (amount: number, currency: 'VND' | 'USD' = 'VND'): string => {
  switch (currency) {
    case 'VND':
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(amount);
    case 'USD':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    default:
      return amount.toString();
  }
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('vi-VN').format(num);
};

export const formatPrice = (price: number): string => {
  return `${formatNumber(price)}đ`;
};
