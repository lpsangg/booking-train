// Simple test for generated pricing
const fs = require('fs');

function testRouteCount() {
  console.log('=== Route Count Test ===\n');
  
  const trainIds = ['SE1', 'SE2', 'SE3', 'SE4', 'SE5', 'SE6', 'SE7', 'SE8', 'SE9', 'SE10', 'SE22'];
  
  for (const trainId of trainIds) {
    const filePath = `src/mockData/generated/${trainId.toLowerCase()}Pricing.ts`;
    
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const routeMatches = content.match(/"destination":/g);
      const routeCount = routeMatches ? routeMatches.length : 0;
      
      console.log(`${trainId}: ${routeCount} routes`);
      
      // Extract sample routes
      const originMatches = content.match(/"origin":\s*"([^"]+)"/g);
      const destMatches = content.match(/"destination":\s*"([^"]+)"/g);
      
      if (originMatches && destMatches && routeCount > 0) {
        console.log(`  Sample routes:`);
        for (let i = 0; i < Math.min(3, routeCount); i++) {
          const origin = originMatches[i].match(/"([^"]+)"/)[1];
          const dest = destMatches[i].match(/"([^"]+)"/)[1];
          console.log(`    ${origin} → ${dest}`);
        }
        if (routeCount > 3) {
          console.log(`    ... và ${routeCount - 3} routes khác`);
        }
      }
    } else {
      console.log(`${trainId}: File not found`);
    }
    console.log('');
  }
  
  console.log('=== Test Complete ===');
}

testRouteCount();
