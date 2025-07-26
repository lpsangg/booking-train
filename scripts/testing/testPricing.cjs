// Test script để kiểm tra pricing data
const fs = require('fs');
const path = require('path');

async function testPricingData() {
  console.log('=== Testing Generated Pricing Data ===\n');
  
  const generatedDir = path.join(__dirname, 'src', 'mockData', 'generated');
  const trainIds = ['SE1', 'SE2', 'SE3', 'SE4', 'SE5', 'SE6', 'SE7', 'SE8', 'SE9', 'SE10', 'SE22'];
  
  for (const trainId of trainIds) {
    const filePath = path.join(generatedDir, `${trainId.toLowerCase()}Pricing.ts`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ ${trainId}: File not found`);
      continue;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for Unicode issues
    const hasUnicodeIssues = content.includes('HÃ ') || content.includes('Ná»™i') || content.includes('\\u');
    
    // Check for structure
    const hasRoutes = content.includes('"routes"');
    const hasOrigin = content.includes('"origin"');
    const hasFares = content.includes('"fares"');
    
    // Count routes
    const routeMatches = content.match(/"origin":/g);
    const routeCount = routeMatches ? routeMatches.length : 0;
    
    const status = hasUnicodeIssues ? '❌' : '✅';
    console.log(`${status} ${trainId}: ${routeCount} routes, Unicode: ${hasUnicodeIssues ? 'BROKEN' : 'OK'}`);
    
    if (hasUnicodeIssues) {
      console.log(`   Sample Unicode issue: ${content.substring(content.indexOf('HÃ'), 50)}`);
    }
    
    if (routeCount > 0) {
      // Extract sample route info
      const originMatch = content.match(/"origin":\s*"([^"]+)"/);
      const destMatch = content.match(/"destination":\s*"([^"]+)"/);
      if (originMatch && destMatch) {
        console.log(`   Sample route: ${originMatch[1]} → ${destMatch[1]}`);
      }
    }
    console.log('');
  }
  
  console.log('=== Testing Complete ===');
}

testPricingData().catch(console.error);
