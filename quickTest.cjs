// Quick test script cho generated pricing data
const fs = require('fs');
const path = require('path');

// Import generated data
const generatedPath = path.join(__dirname, 'src', 'mockData', 'generated');

// Load SE1 data để test
const se1Path = path.join(generatedPath, 'se1Pricing.ts');
if (fs.existsSync(se1Path)) {
  console.log('✅ SE1 pricing file exists');
} else {
  console.log('❌ SE1 pricing file not found');
}

// Check all generated files
const files = fs.readdirSync(generatedPath);
console.log('\n📁 Generated files:');
files.forEach(file => {
  console.log(`  - ${file}`);
});

// Test integration file
const integrationPath = path.join(__dirname, 'src', 'mockData', 'generatedPricingIntegration.ts');
if (fs.existsSync(integrationPath)) {
  console.log('\n✅ Integration file exists');
  
  // Read integration file content to verify
  const content = fs.readFileSync(integrationPath, 'utf-8');
  if (content.includes('getGeneratedSeatPrice')) {
    console.log('✅ getGeneratedSeatPrice function found');
  } else {
    console.log('❌ getGeneratedSeatPrice function not found');
  }
} else {
  console.log('\n❌ Integration file not found');
}

console.log('\n🎯 Quick validation completed!');
