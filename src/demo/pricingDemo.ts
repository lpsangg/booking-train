// Demo script để test pricing system
import { runComprehensivePricingTests, getAccurateSeatPrice } from '../mockData';
import { getGeneratedSeatPrice, validateGeneratedPricing } from '../mockData/generatedPricingIntegration';

/**
 * Demo function để test một ghế cụ thể với generated data
 */
export function demoTestGeneratedSeatPrice(
  trainId: string, 
  origin: string, 
  destination: string, 
  coachId: string, 
  carNumber = 1, 
  seatRow = 1
): number {
  const price = getGeneratedSeatPrice(trainId, origin, destination, coachId as any, carNumber, seatRow);
  console.log(`💰 ${trainId} (${origin} -> ${destination}) ${coachId} car${carNumber} row${seatRow}: ${price.toLocaleString()}đ`);
  return price;
}

/**
 * Demo function để test một ghế cụ thể với old data
 */
export function demoTestSeatPrice(
  trainId: string, 
  origin: string, 
  destination: string, 
  coachId: string, 
  carNumber = 1, 
  seatRow = 1
): number {
  const price = getAccurateSeatPrice(trainId, origin, destination, coachId, carNumber, seatRow);
  console.log(`💰 ${trainId} (${origin} -> ${destination}) ${coachId} car${carNumber} row${seatRow}: ${price.toLocaleString()}đ`);
  return price;
}

/**
 * Demo function để so sánh generated vs old pricing
 */
export function demoComparePricing() {
  console.group('🔄 DEMO: Generated vs Old Pricing Comparison');
  
  const testCases = [
    { trainId: 'SE1', origin: 'Hà Nội', destination: 'Vinh', coachId: 'seating', carNumber: 1, seatRow: 1 },
    { trainId: 'SE5', origin: 'Hà Nội', destination: 'Đà Nẵng', coachId: 'seating', carNumber: 1, seatRow: 1 },
    { trainId: 'SE7', origin: 'Hà Nội', destination: 'Nha Trang', coachId: 'seating', carNumber: 1, seatRow: 1 }
  ];
  
  testCases.forEach(test => {
    console.log(`\n🎯 Testing: ${test.trainId} ${test.origin} -> ${test.destination}`);
    
    const oldPrice = getAccurateSeatPrice(test.trainId, test.origin, test.destination, test.coachId, test.carNumber, test.seatRow);
    const newPrice = getGeneratedSeatPrice(test.trainId, test.origin, test.destination, test.coachId as any, test.carNumber, test.seatRow);
    
    console.log(`  Old system: ${oldPrice.toLocaleString()}đ`);
    console.log(`  Generated:  ${newPrice.toLocaleString()}đ`);
    console.log(`  Status: ${newPrice > 0 ? '✅ Generated data available' : '❌ No generated data'}`);
  });
  
  console.groupEnd();
}

/**
 * Demo function để test generated pricing system
 */
export function demoGeneratedPricing() {
  console.group('🎯 DEMO: Generated Pricing System');
  
  console.log('Testing pricing data generated from JSON files...\n');
  
  // Test cases từ các JSON files thực tế
  const testCases = [
    // SE1 routes
    { trainId: 'SE1', origin: 'Hà Nội', destination: 'Vinh', coachType: 'seating', car: 1, row: 1, expected: '> 300K' },
    { trainId: 'SE1', origin: 'Hà Nội', destination: 'Đà Nẵng', coachType: 'seating', car: 1, row: 1, expected: '> 400K' },
    { trainId: 'SE1', origin: 'Hà Nội', destination: 'Vinh', coachType: 'sleeper_6_berth', car: 3, row: 1, expected: '> 500K' },
    
    // SE5 routes
    { trainId: 'SE5', origin: 'Hà Nội', destination: 'Vinh', coachType: 'seating', car: 1, row: 1, expected: '> 200K' },
    { trainId: 'SE5', origin: 'Hà Nội', destination: 'Đà Nẵng', coachType: 'seating', car: 1, row: 1, expected: '> 300K' },
    
    // SE7 routes (có cả seating và sleeper cho Vinh/Đà Nẵng, chỉ seating cho Nha Trang/Sài Gòn)
    { trainId: 'SE7', origin: 'Hà Nội', destination: 'Vinh', coachType: 'seating', car: 1, row: 1, expected: '> 200K' },
    { trainId: 'SE7', origin: 'Hà Nội', destination: 'Nha Trang', coachType: 'seating', car: 1, row: 1, expected: '> 400K' },
    { trainId: 'SE7', origin: 'Hà Nội', destination: 'Sài Gòn', coachType: 'seating', car: 1, row: 1, expected: '> 500K' },
  ];
  
  let passedTests = 0;
  let failedTests = 0;
  
  testCases.forEach((test, index) => {
    const { trainId, origin, destination, coachType, car, row, expected } = test;
    
    const price = getGeneratedSeatPrice(trainId, origin, destination, coachType as any, car, row);
    
    const passed = price > 0;
    const status = passed ? '✅' : '❌';
    
    console.log(`${status} Test ${index + 1}: ${trainId} ${origin}->${destination} ${coachType} car${car} row${row}`);
    console.log(`   Expected: ${expected}, Got: ${price.toLocaleString()}đ`);
    
    if (passed) {
      passedTests++;
    } else {
      failedTests++;
    }
  });
  
  console.log(`\n📊 Test Results: ${passedTests} passed, ${failedTests} failed`);
  
  console.groupEnd();
  
  return { passedTests, failedTests, totalTests: testCases.length };
}

/**
 * Demo function để test một số cases phổ biến
 */
export function demoCommonTestCases() {
  console.group('🎯 DEMO: Common Test Cases (Generated Data)');
  
  // Test cases phổ biến với generated data
  demoTestGeneratedSeatPrice('SE1', 'Hà Nội', 'Vinh', 'seating', 1, 1);
  demoTestGeneratedSeatPrice('SE1', 'Hà Nội', 'Đà Nẵng', 'seating', 1, 1);
  demoTestGeneratedSeatPrice('SE5', 'Hà Nội', 'Vinh', 'seating', 1, 1);
  demoTestGeneratedSeatPrice('SE7', 'Hà Nội', 'Vinh', 'seating', 1, 1);
  demoTestGeneratedSeatPrice('SE7', 'Hà Nội', 'Nha Trang', 'seating', 1, 1);
  
  console.groupEnd();
}

/**
 * Main demo function for generated pricing
 */
export function runGeneratedPricingDemo() {
  console.log('🚂 GENERATED PRICING SYSTEM - COMPREHENSIVE DEMO');
  console.log('='.repeat(60));
  
  // Test generated pricing
  const testResults = demoGeneratedPricing();
  
  // Validate all generated data
  const validation = validateGeneratedPricing();
  
  // Compare with old system
  demoComparePricing();
  
  // Run common test cases
  demoCommonTestCases();
  
  // Summary
  console.group('📋 FINAL SUMMARY');
  console.log(`🧪 Tests: ${testResults.passedTests}/${testResults.totalTests} passed`);
  console.log(`🚂 Trains: ${validation.trainsCount} trains processed`);
  console.log(`📍 Routes: ${validation.routesCount} routes available`);
  console.log(`💰 Price entries: ${validation.priceEntriesCount} detailed prices`);
  
  const overallSuccess = testResults.failedTests === 0;
  console.log(`${overallSuccess ? '🎉' : '⚠️'} Overall status: ${overallSuccess ? 'ALL SYSTEMS OPERATIONAL' : 'NEEDS ATTENTION'}`);
  
  console.groupEnd();
  
  return {
    testResults,
    validation,
    overallSuccess
  };
}

/**
 * Original demo function (kept for compatibility)
 */
export function runPricingDemo() {
  console.log('🚂 BOOKING TRAIN - PRICING SYSTEM DEMO');
  console.log('='.repeat(50));
  
  // Run comprehensive tests for old system
  const results = runComprehensivePricingTests();
  
  // Run new generated system demo
  const generatedResults = runGeneratedPricingDemo();
  
  console.log('\n✅ Demo completed successfully!');
  console.log('📝 Use demoTestSeatPrice() for old system testing');
  console.log('📝 Use demoTestGeneratedSeatPrice() for generated system testing');
  
  return { oldSystem: results, generatedSystem: generatedResults };
}
