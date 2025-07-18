// Debug pricing for Hà Nội -> Nha Trang route
const fs = require('fs');

function testPricingForRoute() {
  console.log('=== Debug Pricing for Hà Nội -> Nha Trang ===\n');
  
  // Test SE1 pricing
  const se1File = 'src/mockData/generated/se1Pricing.ts';
  
  if (!fs.existsSync(se1File)) {
    console.log('SE1 pricing file not found!');
    return;
  }
  
  const content = fs.readFileSync(se1File, 'utf8');
  
  // Extract route section for Hà Nội -> Nha Trang
  const hanoi_nhatrang_match = content.match(/{\s*"origin":\s*"Hà Nội",\s*"destination":\s*"Nha Trang"[\s\S]*?(?={\s*"origin"|$)/);
  
  if (!hanoi_nhatrang_match) {
    console.log('No Hà Nội -> Nha Trang route found in SE1!');
    return;
  }
  
  const routeSection = hanoi_nhatrang_match[0];
  
  console.log('Found Hà Nội -> Nha Trang route in SE1');
  console.log('Route section length:', routeSection.length, 'characters');
  
  // Extract sleeper_6_berth prices
  const sleeper6Match = routeSection.match(/"sleeper_6_berth":\s*\[([\s\S]*?)\]/);
  
  if (sleeper6Match) {
    console.log('\\n=== 6-berth sleeper prices ===');
    
    // Extract all prices
    const priceMatches = sleeper6Match[1].match(/"price":\s*(\d+)/g);
    
    if (priceMatches) {
      console.log('Found', priceMatches.length, 'prices:');
      priceMatches.slice(0, 10).forEach((match, i) => {
        const price = match.match(/(\d+)/)[1];
        console.log(`  Row ${i+1}: ${parseInt(price).toLocaleString('vi-VN')} VND`);
      });
      
      // Check for suspicious low prices
      const lowPrices = priceMatches.filter(match => {
        const price = parseInt(match.match(/(\d+)/)[1]);
        return price < 50000; // Prices under 50K are suspicious
      });
      
      if (lowPrices.length > 0) {
        console.log('\\n❌ FOUND SUSPICIOUS LOW PRICES:');
        lowPrices.forEach(match => {
          const price = match.match(/(\d+)/)[1];
          console.log(`  ${price} VND - TOO LOW!`);
        });
      } else {
        console.log('\\n✅ All prices look reasonable (above 50K VND)');
      }
    } else {
      console.log('No price matches found in sleeper_6_berth section');
    }
  } else {
    console.log('No sleeper_6_berth section found in route');
  }
  
  // Check the first few lines of the route to see structure
  console.log('\\n=== First 500 characters of route ===');
  console.log(routeSection.substring(0, 500));
}

testPricingForRoute();
