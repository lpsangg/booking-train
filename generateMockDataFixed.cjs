const fs = require('fs');
const path = require('path');

// Station name mapping và normalization
const stationMapping = {
  'HÀ NỘI': 'Hà Nội',
  'HA NOI': 'Hà Nội', 
  'HANOI': 'Hà Nội',
  'HẢI PHÒNG': 'Hải Phòng',
  'HAI PHONG': 'Hải Phòng',
  'HAIPHONG': 'Hải Phòng',
  'NAM ĐỊNH': 'Nam Định',
  'NAM DINH': 'Nam Định',
  'NAMDINH': 'Nam Định',
  'THÁI BÌNH': 'Thái Bình', 
  'THAI BINH': 'Thái Bình',
  'THAIBINH': 'Thái Bình',
  'THANH HÓA': 'Thanh Hóa',
  'THANH HOA': 'Thanh Hóa',
  'THANHHOA': 'Thanh Hóa',
  'NGHỆ AN': 'Nghệ An',
  'NGHE AN': 'Nghệ An',
  'NGHEAN': 'Nghệ An',
  'VINH': 'Vinh',
  'HUẾ': 'Huế',
  'HUE': 'Huế',
  'ĐÀ NẴNG': 'Đà Nẵng',
  'DA NANG': 'Đà Nẵng',
  'DANANG': 'Đà Nẵng',
  'QUY NHON': 'Quy Nhon',
  'QUYNHON': 'Quy Nhon',
  'NHA TRANG': 'Nha Trang',
  'NHATRANG': 'Nha Trang',
  'HỒ CHÍ MINH': 'Hồ Chí Minh',
  'HO CHI MINH': 'Hồ Chí Minh',
  'HOCHIMINH': 'Hồ Chí Minh',
  'TP.HCM': 'Hồ Chí Minh',
  'TPHCM': 'Hồ Chí Minh',
  'SÀI GÒN': 'Hồ Chí Minh',
  'SAI GON': 'Hồ Chí Minh',
  'SAIGON': 'Hồ Chí Minh'
};

function normalizeStationName(station) {
  if (!station || typeof station !== 'string') return station;
  
  // Trim và uppercase để so sánh
  const upper = station.trim().toUpperCase();
  
  // Kiểm tra mapping exact match trước
  if (stationMapping[upper]) {
    return stationMapping[upper];
  }
  
  // Fallback: giữ nguyên nhưng trim
  return station.trim();
}

function isValidRoute(origin, destination) {
  const validStations = ['Hà Nội', 'Hải Phòng', 'Nam Định', 'Thái Bình', 'Thanh Hóa', 'Nghệ An', 'Vinh', 'Huế', 'Đà Nẵng', 'Quy Nhon', 'Nha Trang', 'Hồ Chí Minh'];
  return validStations.includes(origin) && validStations.includes(destination) && origin !== destination;
}

function generateTypeScriptContent(trainId, data) {
  const content = `// Auto-generated pricing data cho tàu ${trainId}
import type { SeatPricing } from '../seatPricing';

export const ${trainId}_GENERATED_PRICING: SeatPricing = ${JSON.stringify(data, null, 2)};
`;
  return content;
}

function processJsonFile(filePath, trainId) {
  try {
    console.log(`\\n=== Processing ${trainId} ===`);
    
    // Đọc file với UTF-8 encoding explicit
    const rawData = fs.readFileSync(filePath, { encoding: 'utf8' });
    const jsonData = JSON.parse(rawData);
    
    console.log(`Loaded ${trainId} data successfully`);
    
    // Validate structure
    if (!jsonData.train_fares || !Array.isArray(jsonData.train_fares)) {
      console.log(`${trainId}: No train_fares array found, skipping...`);
      return null;
    }
    
    const processedRoutes = [];
    
    for (const route of jsonData.train_fares) {
      // Skip tier-based structures (không có fares object)
      if (!route.fares || typeof route.fares !== 'object') {
        console.log(`${trainId}: Skipping tier-based route structure`);
        continue;
      }
      
      const origin = normalizeStationName(route.origin);
      const destination = normalizeStationName(route.destination);
      
      if (!isValidRoute(origin, destination)) {
        console.log(`${trainId}: Invalid route ${origin} -> ${destination}, skipping...`);
        continue;
      }
      
      console.log(`${trainId}: Processing route ${origin} -> ${destination}`);
      
      processedRoutes.push({
        origin,
        destination,
        fares: route.fares
      });
    }
    
    if (processedRoutes.length === 0) {
      console.log(`${trainId}: No valid routes found after processing`);
      return null;
    }
    
    const result = {
      trainId,
      routes: processedRoutes
    };
    
    console.log(`${trainId}: Successfully processed ${processedRoutes.length} routes`);
    return result;
    
  } catch (error) {
    console.error(`Error processing ${trainId}:`, error.message);
    return null;
  }
}

async function generateAllPricingFiles() {
  const dataDir = path.join(process.cwd(), 'public', 'data');
  const outputDir = path.join(process.cwd(), 'src', 'mockData', 'generated');
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const trainFiles = [
    'SE1.json', 'SE2.json', 'SE3.json', 'SE4.json', 'SE5.json',
    'SE6.json', 'SE7.json', 'SE8.json', 'SE9.json', 'SE10.json', 'SE22.json'
  ];
  
  console.log('=== Starting generation process ===');
  
  for (const filename of trainFiles) {
    const trainId = filename.replace('.json', '');
    const filePath = path.join(dataDir, filename);
    const outputPath = path.join(outputDir, `${trainId.toLowerCase()}Pricing.ts`);
    
    console.log(`\\nProcessing ${trainId}...`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      continue;
    }
    
    const pricingData = processJsonFile(filePath, trainId);
    
    if (!pricingData) {
      console.log(`Failed to process ${trainId}, skipping...`);
      continue;
    }
    
    const tsContent = generateTypeScriptContent(trainId, pricingData);
    
    // Write file với UTF-8 BOM để đảm bảo encoding
    fs.writeFileSync(outputPath, '\ufeff' + tsContent, { encoding: 'utf8' });
    
    console.log(`Generated: ${outputPath}`);
  }
  
  console.log('\\n=== Generation complete ===');
}

// Run the generation
generateAllPricingFiles().catch(console.error);
