// Test file để kiểm tra pricing data hoàn chỉnh
import { validateAllTrainPricing, debugPricing, getAccurateSeatPrice } from './pricingUtils';

/**
 * Function để test toàn bộ hệ thống pricing
 */
export function runPricingValidation() {
  console.group('🔍 VALIDATION: Complete Train Pricing System');
  
  const validation = validateAllTrainPricing();
  
  console.log(`📊 Summary:`);
  console.log(`✅ Validated routes: ${validation.validatedRoutes}/${validation.totalRoutes}`);
  console.log(`❌ Missing pricing entries: ${validation.missingPricing.length}`);
  
  if (validation.missingPricing.length > 0) {
    console.group('❌ Missing Pricing Data:');
    validation.missingPricing.forEach(entry => {
      console.log(`- ${entry.trainId} (${entry.route}) - ${entry.coachType}`);
    });
    console.groupEnd();
  }
  
  console.groupEnd();
  return validation;
}

/**
 * Test specific pricing scenarios
 */
export function testSpecificPricingScenarios() {
  console.group('🧪 TESTING: Specific Pricing Scenarios');
  
  const testCases = [
    // SE1: Hà Nội -> Sài Gòn
    { trainId: 'SE1', origin: 'Hà Nội', destination: 'Sài Gòn', coachId: 'hard_seat', carNumber: 1, seatRow: 1, expectedMin: 550000 },
    { trainId: 'SE1', origin: 'Hà Nội', destination: 'Sài Gòn', coachId: 'soft_seat', carNumber: 2, seatRow: 1, expectedMin: 660000 },
    { trainId: 'SE1', origin: 'Hà Nội', destination: 'Sài Gòn', coachId: '6_berth_cabin', carNumber: 3, seatRow: 1, expectedMin: 770000 },
    { trainId: 'SE1', origin: 'Hà Nội', destination: 'Sài Gòn', coachId: '4_berth_cabin', carNumber: 4, seatRow: 1, expectedMin: 1100000 },
    
    // SE5: Hà Nội -> Đà Nẵng
    { trainId: 'SE5', origin: 'Hà Nội', destination: 'Đà Nẵng', coachId: 'hard_seat', carNumber: 1, seatRow: 1, expectedMin: 350000 },
    { trainId: 'SE5', origin: 'Hà Nội', destination: 'Đà Nẵng', coachId: 'soft_seat', carNumber: 2, seatRow: 1, expectedMin: 420000 },
    
    // SE22: Vinh -> Sài Gòn
    { trainId: 'SE22', origin: 'Vinh', destination: 'Sài Gòn', coachId: 'hard_seat', carNumber: 1, seatRow: 1, expectedMin: 480000 },
    
    // SE9: Hà Nội -> Nha Trang
    { trainId: 'SE9', origin: 'Hà Nội', destination: 'Nha Trang', coachId: 'hard_seat', carNumber: 1, seatRow: 1, expectedMin: 500000 },
  ];
  
  let passedTests = 0;
  let failedTests = 0;
  
  testCases.forEach((testCase, index) => {
    const { trainId, origin, destination, coachId, carNumber, seatRow, expectedMin } = testCase;
    
    const actualPrice = getAccurateSeatPrice(trainId, origin, destination, coachId, carNumber, seatRow);
    
    const passed = actualPrice >= expectedMin;
    const status = passed ? '✅' : '❌';
    
    console.log(`${status} Test ${index + 1}: ${trainId} ${origin}->${destination} ${coachId} car${carNumber} row${seatRow}`);
    console.log(`   Expected: >= ${expectedMin.toLocaleString()}đ, Got: ${actualPrice.toLocaleString()}đ`);
    
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
 * Test all price variations for a specific train
 */
export function testTrainPriceVariations(trainId: string, origin: string, destination: string) {
  console.group(`🔍 TESTING: Price Variations for ${trainId} (${origin} -> ${destination})`);
  
  const coaches = ['hard_seat', 'soft_seat', '6_berth_cabin', '4_berth_cabin'];
  
  coaches.forEach(coachId => {
    console.group(`🚌 Coach: ${coachId}`);
    
    const carNumber = coachId.includes('seat') ? (coachId === 'hard_seat' ? 1 : 2) : 
                     coachId === '6_berth_cabin' ? 3 : 4;
    
    const prices: number[] = [];
    for (let row = 1; row <= 28; row++) {
      const price = getAccurateSeatPrice(trainId, origin, destination, coachId, carNumber, row);
      if (price > 0) {
        prices.push(price);
      }
    }
    
    if (prices.length > 0) {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const avgPrice = Math.round(prices.reduce((a, b) => a + b) / prices.length);
      
      console.log(`✅ ${prices.length} seats with pricing`);
      console.log(`💰 Price range: ${minPrice.toLocaleString()}đ - ${maxPrice.toLocaleString()}đ`);
      console.log(`📊 Average: ${avgPrice.toLocaleString()}đ`);
    } else {
      console.log(`❌ No pricing data found`);
    }
    
    console.groupEnd();
  });
  
  console.groupEnd();
}

/**
 * Run comprehensive pricing tests
 */
export function runComprehensivePricingTests() {
  console.group('🚀 COMPREHENSIVE PRICING SYSTEM TESTS');
  console.log('Starting comprehensive validation of all train pricing data...\n');
  
  // 1. Validate all pricing
  const validation = runPricingValidation();
  console.log('');
  
  // 2. Test specific scenarios
  const testResults = testSpecificPricingScenarios();
  console.log('');
  
  // 3. Test sample trains in detail
  debugPricing('SE1', 'Hà Nội', 'Sài Gòn');
  debugPricing('SE5', 'Hà Nội', 'Đà Nẵng'); 
  debugPricing('SE22', 'Vinh', 'Sài Gòn');
  
  // 4. Summary
  console.group('📋 FINAL SUMMARY');
  console.log(`🎯 Routes with pricing: ${validation.validatedRoutes}/${validation.totalRoutes}`);
  console.log(`🧪 Tests passed: ${testResults.passedTests}/${testResults.totalTests}`);
  
  const overallSuccess = validation.missingPricing.length === 0 && testResults.failedTests === 0;
  console.log(`${overallSuccess ? '🎉' : '⚠️'} Overall status: ${overallSuccess ? 'SUCCESS' : 'NEEDS ATTENTION'}`);
  
  if (!overallSuccess) {
    console.log('\n🔧 Issues to address:');
    if (validation.missingPricing.length > 0) {
      console.log(`- ${validation.missingPricing.length} missing pricing entries`);
    }
    if (testResults.failedTests > 0) {
      console.log(`- ${testResults.failedTests} failed test cases`);
    }
  }
  
  console.groupEnd();
  console.groupEnd();
  
  return {
    validation,
    testResults,
    overallSuccess
  };
}
