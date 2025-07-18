// Simple test file để kiểm tra generated pricing
const testGeneratedPricing = () => {
  console.log('🚂 Testing Generated Pricing System');
  console.log('====================================');
  
  try {
    // Import generated pricing integration
    const { getGeneratedSeatPrice, ALL_GENERATED_PRICING_DATA } = require('./src/mockData/generatedPricingIntegration.ts');
    
    console.log(`📊 Loaded ${ALL_GENERATED_PRICING_DATA.length} trains with generated pricing`);
    
    // Test basic SE1 route
    const se1Price = getGeneratedSeatPrice('SE1', 'Hà Nội', 'Vinh', 'seating', 1, 1);
    console.log(`💰 SE1 Hà Nội->Vinh seating car1 row1: ${se1Price.toLocaleString()}đ`);
    
    if (se1Price > 0) {
      console.log('✅ Generated pricing system working correctly!');
    } else {
      console.log('❌ Generated pricing system not working');
    }
    
  } catch (error) {
    console.log('❌ Error testing generated pricing:', error.message);
    console.log('💡 This is expected in Node.js - please use TypeScript compilation');
  }
};

testGeneratedPricing();
