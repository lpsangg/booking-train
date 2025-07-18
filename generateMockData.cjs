// Node.js script để generate mock data từ JSON files
const fs = require('fs');
const path = require('path');

// Mapping tên ga từ JSON sang tên chuẩn trong app
const STATION_MAPPING = {
  'HA NOI': 'Hà Nội',        // "HÀ NỘI" sau khi normalize thành "HA NOI" 
  'VINH': 'Vinh', 
  'ĐA NANG': 'Đà Nẵng',      // "ĐÀ NẴNG" sau khi normalize thành "ĐA NANG"
  'NHA TRANG': 'Nha Trang',
  'SAI GON': 'Sài Gòn',      // "SÀI GÒN" sau khi normalize thành "SAI GON"
  'SAIGON': 'Sài Gòn',
  'HO CHI MINH': 'Sài Gòn'
};

/**
 * Chuẩn hóa tên ga theo logic frontend
 */
function normalizeStationName(stationName) {
  const normalized = stationName
    .trim()
    .toUpperCase()
    .replace(/^GA\s+/, '') // Loại bỏ "GA " ở đầu
    .replace(/\s+/g, ' ') // Chuẩn hóa khoảng trắng
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Loại bỏ dấu
  
  console.log(`   Normalizing: "${stationName}" -> "${normalized}" -> "${STATION_MAPPING[normalized] || stationName}"`);
  return STATION_MAPPING[normalized] || stationName;
}

/**
 * Đọc và parse JSON file
 */
function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
}

/**
 * Chuyển đổi data từ JSON sang mock data format
 */
function convertToMockData(trainId, jsonData) {
  const mockData = {
    trainId,
    routes: []
  };

  jsonData.train_fares.forEach(fare => {
    const origin = normalizeStationName(fare.origin);
    const destination = normalizeStationName(fare.destination);
    
    // Chỉ lấy routes với 5 ga chính: Hà Nội, Vinh, Đà Nẵng, Nha Trang, Sài Gòn
    const validStations = ['Hà Nội', 'Vinh', 'Đà Nẵng', 'Nha Trang', 'Sài Gòn'];
    if (!validStations.includes(origin) || !validStations.includes(destination)) {
      return; // Skip route không hợp lệ
    }

    const route = {
      origin,
      destination,
      fares: {}
    };

    // Copy pricing data từ JSON với handle cho cấu trúc khác nhau
    if (fare.fares.seating) {
      const seatingData = Array.isArray(fare.fares.seating) ? fare.fares.seating : fare.fares.seating.tier_1_prices || fare.fares.seating;
      // Chỉ lấy nếu là array of objects (có car_number), không lấy flat array of numbers
      if (Array.isArray(seatingData) && seatingData.length > 0 && typeof seatingData[0] === 'object' && seatingData[0].car_number !== undefined) {
        route.fares.seating = seatingData;
      }
    }
    
    if (fare.fares.sleeper_6_berth) {
      const sleeper6Data = Array.isArray(fare.fares.sleeper_6_berth) ? fare.fares.sleeper_6_berth : fare.fares.sleeper_6_berth.tier_1_prices || fare.fares.sleeper_6_berth;
      // Chỉ lấy nếu là array of objects (có car_number), không lấy flat array of numbers
      if (Array.isArray(sleeper6Data) && sleeper6Data.length > 0 && typeof sleeper6Data[0] === 'object' && sleeper6Data[0].car_number !== undefined) {
        route.fares.sleeper_6_berth = sleeper6Data;
      }
    }
    
    if (fare.fares.sleeper_4_berth) {
      const sleeper4Data = Array.isArray(fare.fares.sleeper_4_berth) ? fare.fares.sleeper_4_berth : fare.fares.sleeper_4_berth.tier_1_prices || fare.fares.sleeper_4_berth;
      // Chỉ lấy nếu là array of objects (có car_number), không lấy flat array of numbers
      if (Array.isArray(sleeper4Data) && sleeper4Data.length > 0 && typeof sleeper4Data[0] === 'object' && sleeper4Data[0].car_number !== undefined) {
        route.fares.sleeper_4_berth = sleeper4Data;
      }
    }

    // Chỉ add route nếu có ít nhất 1 loại fare hợp lệ
    const hasValidFares = route.fares.seating || route.fares.sleeper_6_berth || route.fares.sleeper_4_berth;
    if (!hasValidFares) {
      console.log(`⚠️  Skipping route ${origin} -> ${destination} due to incompatible pricing structure (tier-based instead of car-based)`);
      return; // Skip route này
    }

    mockData.routes.push(route);
  });

  return mockData;
}

/**
 * Tạo TypeScript file content với UTF-8 encoding
 */
function generateTypeScriptContent(trainId, mockData) {
  // Đảm bảo Unicode được xử lý đúng
  const jsonString = JSON.stringify(mockData, null, 2)
    .replace(/\\u[\dA-Fa-f]{4}/g, (match) => {
      return String.fromCharCode(parseInt(match.replace('\\u', ''), 16));
    });
    
  return `// Auto-generated pricing data cho tàu ${trainId}
import type { SeatPricing } from '../seatPricing';

export const ${trainId}_GENERATED_PRICING: SeatPricing = ${jsonString};
`;
}

/**
 * Main function để generate tất cả mock data
 */
async function generateAllMockData() {
  const publicDataPath = path.join(__dirname, 'public', 'data');
  const mockDataPath = path.join(__dirname, 'src', 'mockData', 'generated');
  
  console.log('📁 Public data path:', publicDataPath);
  console.log('📁 Mock data output path:', mockDataPath);
  
  // Tạo thư mục generated nếu chưa có
  if (!fs.existsSync(mockDataPath)) {
    fs.mkdirSync(mockDataPath, { recursive: true });
    console.log('📁 Created generated directory');
  }

  const trainIds = ['SE1', 'SE2', 'SE3', 'SE4', 'SE5', 'SE6', 'SE7', 'SE8', 'SE9', 'SE10', 'SE22'];
  const allExports = [];
  const allPricingData = [];

  console.log('🚂 Generating mock data from JSON files...\n');

  for (const trainId of trainIds) {
    const jsonFilePath = path.join(publicDataPath, `${trainId}.json`);
    
    console.log(`📄 Processing ${trainId}.json...`);
    console.log(`   File path: ${jsonFilePath}`);
    
    if (!fs.existsSync(jsonFilePath)) {
      console.log(`❌ File not found: ${jsonFilePath}`);
      continue;
    }
    
    const jsonData = readJsonFile(jsonFilePath);
    if (!jsonData) {
      console.log(`❌ Failed to read ${trainId}.json`);
      continue;
    }

    if (!jsonData.train_fares || !Array.isArray(jsonData.train_fares)) {
      console.log(`❌ Invalid data structure in ${trainId}.json`);
      continue;
    }

    const mockData = convertToMockData(trainId, jsonData);
    
    console.log(`✅ Found ${mockData.routes.length} valid routes for ${trainId}`);
    mockData.routes.forEach(route => {
      const seatingCount = route.fares.seating ? route.fares.seating.length : 0;
      const sleeper6Count = route.fares.sleeper_6_berth ? route.fares.sleeper_6_berth.length : 0;
      const sleeper4Count = route.fares.sleeper_4_berth ? route.fares.sleeper_4_berth.length : 0;
      console.log(`   - ${route.origin} → ${route.destination} (${seatingCount} seating, ${sleeper6Count} 6-berth, ${sleeper4Count} 4-berth cars)`);
    });

    // Generate TypeScript content
    const tsContent = generateTypeScriptContent(trainId, mockData);
    
    // Write to file
    const outputPath = path.join(mockDataPath, `${trainId.toLowerCase()}Pricing.ts`);
    fs.writeFileSync(outputPath, tsContent);
    
    // Add to exports
    allExports.push(`export * from './${trainId.toLowerCase()}Pricing';`);
    allPricingData.push(`${trainId}_GENERATED_PRICING`);
    
    console.log(`💾 Generated: ${outputPath}\n`);
  }

  // Generate index file
  const indexContent = `// Auto-generated exports for all train pricing data
${allExports.join('\n')}

// Collection of all pricing data
${allPricingData.map(name => `import { ${name} } from './${name.split('_')[0].toLowerCase()}Pricing';`).join('\n')}

export const ALL_GENERATED_PRICING_DATA = [
  ${allPricingData.join(',\n  ')}
];

// Utility function để tìm pricing theo trainId
export function getGeneratedPricingByTrainId(trainId: string) {
  return ALL_GENERATED_PRICING_DATA.find(pricing => pricing.trainId === trainId);
}
`;

  const indexPath = path.join(mockDataPath, 'index.ts');
  fs.writeFileSync(indexPath, indexContent);
  
  console.log(`📋 Generated index file: ${indexPath}`);
  console.log(`\n🎉 Successfully generated mock data for ${allPricingData.length} trains!`);
  console.log(`📁 Output directory: ${mockDataPath}`);
  
  // Generate integration file
  const integrationContent = `// Integration file to use generated pricing data
import { ALL_GENERATED_PRICING_DATA } from './generated';
import type { SeatPricing } from './seatPricing';

/**
 * Get accurate seat price from generated JSON data
 */
export function getGeneratedSeatPrice(
  trainId: string,
  origin: string,
  destination: string,
  coachType: 'seating' | 'sleeper_6_berth' | 'sleeper_4_berth',
  carNumber: number,
  seatRow: number
): number {
  const trainPricing = ALL_GENERATED_PRICING_DATA.find(t => t.trainId === trainId);
  if (!trainPricing) {
    console.warn(\`No pricing data found for train \${trainId}\`);
    return 0;
  }

  const route = trainPricing.routes.find(r => r.origin === origin && r.destination === destination);
  if (!route) {
    console.warn(\`No route found for \${trainId}: \${origin} -> \${destination}\`);
    return 0;
  }

  const coachPricing = route.fares[coachType];
  if (!coachPricing) {
    console.warn(\`No \${coachType} pricing found for \${trainId}: \${origin} -> \${destination}\`);
    return 0;
  }

  const car = coachPricing.find(c => c.car_number === carNumber);
  if (!car) {
    console.warn(\`No car \${carNumber} found for \${coachType} in \${trainId}: \${origin} -> \${destination}\`);
    return 0;
  }

  const rowPricing = car.rows.find(r => r.row_numbers.includes(seatRow));
  if (!rowPricing) {
    console.warn(\`No pricing found for row \${seatRow} in car \${carNumber} of \${trainId}: \${origin} -> \${destination}\`);
    return 0;
  }

  return rowPricing.price;
}

/**
 * Debug function to validate generated pricing
 */
export function validateGeneratedPricing() {
  console.group('🔍 Validating Generated Pricing Data');
  
  let totalRoutes = 0;
  let totalPriceEntries = 0;
  
  ALL_GENERATED_PRICING_DATA.forEach(trainPricing => {
    console.group(\`🚂 \${trainPricing.trainId}\`);
    
    trainPricing.routes.forEach(route => {
      totalRoutes++;
      console.log(\`📍 \${route.origin} → \${route.destination}\`);
      
      Object.entries(route.fares).forEach(([coachType, cars]) => {
        if (cars && Array.isArray(cars)) {
          cars.forEach(car => {
            totalPriceEntries += car.rows.length;
            console.log(\`   \${coachType} car \${car.car_number}: \${car.rows.length} price entries\`);
          });
        }
      });
    });
    
    console.groupEnd();
  });
  
  console.log(\`\\n📊 Summary: \${ALL_GENERATED_PRICING_DATA.length} trains, \${totalRoutes} routes, \${totalPriceEntries} price entries\`);
  console.groupEnd();
  
  return {
    trainsCount: ALL_GENERATED_PRICING_DATA.length,
    routesCount: totalRoutes,
    priceEntriesCount: totalPriceEntries
  };
}
`;

  const integrationPath = path.join(mockDataPath, '..', 'generatedPricingIntegration.ts');
  fs.writeFileSync(integrationPath, integrationContent);
  console.log(`🔗 Generated integration file: ${integrationPath}`);
}

// Run the script
generateAllMockData().catch(console.error);
