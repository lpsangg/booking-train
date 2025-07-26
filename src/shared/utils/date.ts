// Date utility functions
export const formatDate = (date: string | Date, format: 'short' | 'long' | 'time' = 'short'): string => {
  const d = new Date(date);
  
  switch (format) {
    case 'short':
      return d.toLocaleDateString('vi-VN');
    case 'long':
      return d.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'time':
      return d.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    default:
      return d.toLocaleDateString('vi-VN');
  }
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return `${formatDate(d, 'short')} ${formatDate(d, 'time')}`;
};

export const isValidDate = (date: string): boolean => {
  return !isNaN(Date.parse(date));
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getDaysBetween = (start: Date, end: Date): number => {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
