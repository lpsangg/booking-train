// Test pricing data mới
import { SEAT_PRICING_DATA, getGeneratedPricingByTrainId } from '../src/mockData/generated';

function testPricingData() {
  console.log('=== Testing New Generated Pricing Data ===\n');
  
  // Test SE1 routes
  const se1Data = getGeneratedPricingByTrainId('SE1');
  if (se1Data) {
    console.log(`SE1 có ${se1Data.routes.length} routes:`);
    se1Data.routes.forEach((route, index) => {
      console.log(`  ${index + 1}. ${route.origin} → ${route.destination}`);
      
      // Check pricing cho 4-berth cabin đầu tiên
      if (route.fares.sleeper_4_berth && route.fares.sleeper_4_berth[0]) {
        const firstRow = route.fares.sleeper_4_berth[0].rows[0];
        console.log(`     4-berth cabin giá: ${firstRow.price.toLocaleString()}đ`);
      }
    });
    console.log('');
  }
  
  // Test SE22 routes
  const se22Data = getGeneratedPricingByTrainId('SE22');
  if (se22Data) {
    console.log(`SE22 có ${se22Data.routes.length} routes:`);
    se22Data.routes.forEach((route, index) => {
      console.log(`  ${index + 1}. ${route.origin} → ${route.destination}`);
    });
    console.log('');
  }
  
  // Test SE5 routes  
  const se5Data = getGeneratedPricingByTrainId('SE5');
  if (se5Data) {
    console.log(`SE5 có ${se5Data.routes.length} routes:`);
    se5Data.routes.forEach((route, index) => {
      console.log(`  ${index + 1}. ${route.origin} → ${route.destination}`);
    });
    console.log('');
  }
  
  console.log('=== Testing Complete ===');
}

testPricingData();
