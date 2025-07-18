// Node.js compatible test file
const fs = require('fs');
const path = require('path');

const testGeneratedPricing = () => {
  console.log('🚂 Testing Generated Pricing Files');
  console.log('===================================');
  
  try {
    // Check if generated directory exists
    const generatedDir = path.join(__dirname, 'src', 'mockData', 'generated');
    
    if (!fs.existsSync(generatedDir)) {
      console.log('❌ Generated directory not found');
      return;
    }
    
    // List generated files
    const files = fs.readdirSync(generatedDir);
    console.log(`📁 Found ${files.length} generated files:`);
    files.forEach(file => {
      console.log(`   - ${file}`);
    });
    
    // Check content of SE1 file
    const se1File = path.join(generatedDir, 'SE1_generated.ts');
    if (fs.existsSync(se1File)) {
      const content = fs.readFileSync(se1File, 'utf8');
      const lines = content.split('\n');
      console.log(`\n📄 SE1 file has ${lines.length} lines`);
      
      // Check for pricing data
      const hasPricing = content.includes('pricing:');
      console.log(`💰 Contains pricing data: ${hasPricing ? '✅' : '❌'}`);
      
      // Look for price values
      const priceMatches = content.match(/price:\s*(\d+)/g);
      if (priceMatches && priceMatches.length > 0) {
        console.log(`💵 Found ${priceMatches.length} price entries`);
        console.log(`💵 Sample prices: ${priceMatches.slice(0, 3).join(', ')}`);
      }
    }
    
    console.log('\n✅ Generated files test completed!');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
};

testGeneratedPricing();
