// Simple test để kiểm tra actual pricing data trong SE1
const fs = require('fs');

// Read SE1 pricing file
const se1Content = fs.readFileSync('src/mockData/generated/se1Pricing.ts', 'utf8');

// Extract và parse JSON data từ TypeScript file
const jsonMatch = se1Content.match(/export const SE1_GENERATED_PRICING[^=]*=\s*({[\s\S]*});/);

if (!jsonMatch) {
  console.log('❌ Cannot extract JSON from SE1 file');
  process.exit(1);
}

let pricingData;
try {
  // Remove TypeScript annotations và parse JSON
  const jsonString = jsonMatch[1];
  pricingData = JSON.parse(jsonString);
} catch (e) {
  console.log('❌ Cannot parse JSON from SE1 file:', e.message);
  process.exit(1);
}

console.log('✅ Successfully loaded SE1 pricing data');
console.log(`Train ID: ${pricingData.trainId}`);
console.log(`Number of routes: ${pricingData.routes.length}\\n`);

// Tìm route Hà Nội -> Nha Trang
const route = pricingData.routes.find(r => 
  r.origin === 'Hà Nội' && r.destination === 'Nha Trang'
);

if (!route) {
  console.log('❌ No route found for Hà Nội -> Nha Trang');
  console.log('Available routes:');
  pricingData.routes.forEach(r => {
    console.log(`  ${r.origin} -> ${r.destination}`);
  });
  process.exit(1);
}

console.log('✅ Found Hà Nội -> Nha Trang route');

// Check sleeper_6_berth pricing
if (!route.fares.sleeper_6_berth) {
  console.log('❌ No sleeper_6_berth pricing found');
  console.log('Available fare types:', Object.keys(route.fares));
  process.exit(1);
}

console.log('✅ Found sleeper_6_berth pricing');

const sleeper6 = route.fares.sleeper_6_berth;
console.log(`Number of cars: ${sleeper6.length}\\n`);

// Check car 3 pricing
const car3 = sleeper6.find(car => car.car_number === 3);
if (!car3) {
  console.log('❌ Car 3 not found');
  console.log('Available cars:', sleeper6.map(car => car.car_number));
  process.exit(1);
}

console.log('✅ Found car 3 pricing');
console.log(`Number of row groups: ${car3.rows.length}\\n`);

// Show first 10 prices
console.log('=== First 10 row prices for 6-berth sleeper (Car 3) ===');
car3.rows.slice(0, 10).forEach((row, index) => {
  console.log(`Row group ${index + 1} (seats ${row.row_numbers.join(', ')}): ${row.price.toLocaleString('vi-VN')} VND`);
});

// Check for suspicious prices
const lowPrices = car3.rows.filter(row => row.price < 50000);
if (lowPrices.length > 0) {
  console.log('\\n❌ FOUND SUSPICIOUS LOW PRICES:');
  lowPrices.forEach(row => {
    console.log(`  Seats ${row.row_numbers.join(', ')}: ${row.price} VND`);
  });
} else {
  console.log('\\n✅ All prices look reasonable (above 50K VND)');
}

console.log('\\n=== Analysis complete ===');
