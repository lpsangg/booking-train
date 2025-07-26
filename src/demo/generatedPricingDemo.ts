// Demo test file để kiểm tra generated pricing data
import { getGeneratedSeatPrice, validateGeneratedPricing } from '../shared/data/mockData';

/**
 * Test generated pricing data với routes cụ thể
 */
export function testGeneratedPricingData() {
  console.group('🔍 TESTING: Generated Pricing Data from JSON Files');
  
  // Test cases dựa trên dữ liệu thực từ JSON
  const testCases = [
    // SE1: Hà Nội -> Vinh
    { trainId: 'SE1', origin: 'Hà Nội', destination: 'Vinh', coachType: 'seating', carNumber: 1, seatRow: 1, expectedPrice: 373000 },
    { trainId: 'SE1', origin: 'Hà Nội', destination: 'Vinh', coachType: 'seating', carNumber: 1, seatRow: 3, expectedPrice: 387000 },
    { trainId: 'SE1', origin: 'Hà Nội', destination: 'Vinh', coachType: 'sleeper_6_berth', carNumber: 3, seatRow: 1, expectedPrice: 519000 },
    
    // SE1: Hà Nội -> Đà Nẵng  
    { trainId: 'SE1', origin: 'Hà Nội', destination: 'Đà Nẵng', coachType: 'seating', carNumber: 1, seatRow: 1, expectedPrice: 572000 },
    { trainId: 'SE1', origin: 'Hà Nội', destination: 'Đà Nẵng', coachType: 'sleeper_4_berth', carNumber: 6, seatRow: 1, expectedPrice: 1078000 },
    
    // SE5: Hà Nội -> Vinh
    { trainId: 'SE5', origin: 'Hà Nội', destination: 'Vinh', coachType: 'seating', carNumber: 1, seatRow: 1, expectedPrice: 373000 },
    
    // SE7: Hà Nội -> Nha Trang (route đặc biệt)
    { trainId: 'SE7', origin: 'Hà Nội', destination: 'Nha Trang', coachType: 'seating', carNumber: 1, seatRow: 1 },
    { trainId: 'SE7', origin: 'Hà Nội', destination: 'Sài Gòn', coachType: 'seating', carNumber: 1, seatRow: 1 },
  ];
  
  let passedTests = 0;
  let failedTests = 0;
  
  testCases.forEach((testCase, index) => {
    const { trainId, origin, destination, coachType, carNumber, seatRow, expectedPrice } = testCase;
    
    const actualPrice = getGeneratedSeatPrice(trainId, origin, destination, coachType as any, carNumber, seatRow);
    
    let passed = true;
    let status = '✅';
    
    if (expectedPrice) {
      passed = actualPrice === expectedPrice;
      status = passed ? '✅' : '❌';
    } else {
      // For routes without expected price, just check if price > 0
      passed = actualPrice > 0;
      status = passed ? '✅' : '❌';
    }
    
    console.log(`${status} Test ${index + 1}: ${trainId} ${origin}->${destination} ${coachType} car${carNumber} row${seatRow}`);
    if (expectedPrice) {
      console.log(`   Expected: ${expectedPrice.toLocaleString()}đ, Got: ${actualPrice.toLocaleString()}đ`);
    } else {
      console.log(`   Got: ${actualPrice.toLocaleString()}đ (no expected price)`);
    }
    
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
 * Test tất cả routes có trong generated data
 */
export function testAllGeneratedRoutes() {
  console.group('🗺️ TESTING: All Generated Routes');
  
  // Run validation to get overview
  const validation = validateGeneratedPricing();
  
  console.groupEnd();
  return validation;
}

/**
 * Compare với old pricing system
 */
export function compareWithOldPricing() {
  console.group('⚖️ COMPARISON: Generated vs Old Pricing');
  
  // Import old pricing functions for comparison
  import('../shared/data/mockData').then(({ getAccurateSeatPrice }) => {
    const comparisons = [
      { trainId: 'SE1', origin: 'Hà Nội', destination: 'Sài Gòn', coachType: 'seating', carNumber: 1, seatRow: 1 },
      { trainId: 'SE5', origin: 'Hà Nội', destination: 'Đà Nẵng', coachType: 'seating', carNumber: 1, seatRow: 1 },
      { trainId: 'SE22', origin: 'Vinh', destination: 'Sài Gòn', coachType: 'seating', carNumber: 1, seatRow: 1 },
    ];
    
    comparisons.forEach(test => {
      const { trainId, origin, destination, coachType, carNumber, seatRow } = test;
      
      const generatedPrice = getGeneratedSeatPrice(trainId, origin, destination, coachType as any, carNumber, seatRow);
      const oldPrice = getAccurateSeatPrice(trainId, origin, destination, coachType, carNumber, seatRow);
      
      const status = generatedPrice !== 0 ? '✅' : '❌';
      console.log(`${status} ${trainId} ${origin}->${destination} ${coachType}`);
      console.log(`   Generated: ${generatedPrice.toLocaleString()}đ`);
      console.log(`   Old: ${oldPrice.toLocaleString()}đ`);
      console.log(`   Match: ${generatedPrice === oldPrice ? 'Yes' : 'No'}\n`);
    });
  });
  
  console.groupEnd();
}

/**
 * Main demo function
 */
export function runGeneratedPricingDemo() {
  console.log('🚂 GENERATED PRICING DATA - COMPREHENSIVE TEST');
  console.log('='.repeat(60));
  
  // Test specific cases
  const testResults = testGeneratedPricingData();
  console.log('');
  
  // Test all routes
  const allRoutesValidation = testAllGeneratedRoutes();
  console.log('');
  
  // Compare with old system
  compareWithOldPricing();
  
  // Summary
  console.group('📋 FINAL SUMMARY');
  console.log(`🎯 Specific tests: ${testResults.passedTests}/${testResults.totalTests} passed`);
  console.log(`🗺️ Total trains: ${allRoutesValidation.trainsCount}`);
  console.log(`📍 Total routes: ${allRoutesValidation.routesCount}`);
  console.log(`💰 Total price entries: ${allRoutesValidation.priceEntriesCount}`);
  
  const overallSuccess = testResults.failedTests === 0;
  console.log(`${overallSuccess ? '🎉' : '⚠️'} Overall status: ${overallSuccess ? 'SUCCESS' : 'NEEDS REVIEW'}`);
  console.groupEnd();
  
  return {
    testResults,
    allRoutesValidation,
    overallSuccess
  };
}
