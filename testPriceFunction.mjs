// Direct test of getGeneratedSeatPrice function
import { getGeneratedSeatPrice } from './src/mockData/generatedPricingIntegration.js';

console.log('=== Testing getGeneratedSeatPrice for Hà Nội -> Nha Trang ===\n');

// Test các ghế 6-berth cabin trong car 3
const trainId = 'SE1';
const origin = 'Hà Nội';
const destination = 'Nha Trang';
const coachType = 'sleeper_6_berth';
const carNumber = 3;

console.log(`Train: ${trainId}`);
console.log(`Route: ${origin} -> ${destination}`);
console.log(`Coach: ${coachType}, Car: ${carNumber}\\n`);

// Test pricing cho các rows khác nhau
const testRows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

testRows.forEach(row => {
  const price = getGeneratedSeatPrice(trainId, origin, destination, coachType, carNumber, row);
  console.log(`Row ${row}: ${price.toLocaleString('vi-VN')} VND`);
});

console.log('\\n=== Test complete ===');
