const fs = require('fs');
const path = require('path');

// Station mapping và normalization
const stationMapping = {
  'HÀ NỘI': 'Hà Nội',
  'HA NOI': 'Hà Nội', 
  'HANOI': 'Hà Nội',
  'VINH': 'Vinh',
  'HUẾ': 'Huế',
  'HUE': 'Huế',
  'ĐÀ NẴNG': 'Đà Nẵng',
  'DA NANG': 'Đà Nẵng',
  'DANANG': 'Đà Nẵng',
  'NHA TRANG': 'Nha Trang',
  'NHATRANG': 'Nha Trang',
  'HỒ CHÍ MINH': 'Hồ Chí Minh',
  'HO CHI MINH': 'Hồ Chí Minh',
  'HOCHIMINH': 'Hồ Chí Minh',
  'SÀI GÒN': 'Hồ Chí Minh',
  'SAI GON': 'Hồ Chí Minh',
  'SAIGON': 'Hồ Chí Minh'
};

// Route definitions cho từng tàu theo logic mới
const trainRouteDefinitions = {
  // Tàu dài Bắc-Nam (Hà Nội -> Hồ Chí Minh)
  'SE1': [
    { origin: 'Hà Nội', destination: 'Vinh' },
    { origin: 'Hà Nội', destination: 'Huế' },
    { origin: 'Hà Nội', destination: 'Đà Nẵng' },  
    { origin: 'Hà Nội', destination: 'Nha Trang' },
    { origin: 'Hà Nội', destination: 'Hồ Chí Minh' },
    { origin: 'Vinh', destination: 'Huế' },
    { origin: 'Vinh', destination: 'Đà Nẵng' },
    { origin: 'Vinh', destination: 'Nha Trang' },
    { origin: 'Vinh', destination: 'Hồ Chí Minh' },
    { origin: 'Huế', destination: 'Đà Nẵng' },
    { origin: 'Huế', destination: 'Nha Trang' },
    { origin: 'Huế', destination: 'Hồ Chí Minh' },
    { origin: 'Đà Nẵng', destination: 'Nha Trang' },
    { origin: 'Đà Nẵng', destination: 'Hồ Chí Minh' },
    { origin: 'Nha Trang', destination: 'Hồ Chí Minh' }
  ],
  'SE3': [
    { origin: 'Hà Nội', destination: 'Vinh' },
    { origin: 'Hà Nội', destination: 'Huế' },
    { origin: 'Hà Nội', destination: 'Đà Nẵng' },  
    { origin: 'Hà Nội', destination: 'Nha Trang' },
    { origin: 'Hà Nội', destination: 'Hồ Chí Minh' },
    { origin: 'Vinh', destination: 'Huế' },
    { origin: 'Vinh', destination: 'Đà Nẵng' },
    { origin: 'Vinh', destination: 'Nha Trang' },
    { origin: 'Vinh', destination: 'Hồ Chí Minh' },
    { origin: 'Huế', destination: 'Đà Nẵng' },
    { origin: 'Huế', destination: 'Nha Trang' },
    { origin: 'Huế', destination: 'Hồ Chí Minh' },
    { origin: 'Đà Nẵng', destination: 'Nha Trang' },
    { origin: 'Đà Nẵng', destination: 'Hồ Chí Minh' },
    { origin: 'Nha Trang', destination: 'Hồ Chí Minh' }
  ],
  'SE7': [
    { origin: 'Hà Nội', destination: 'Vinh' },
    { origin: 'Hà Nội', destination: 'Huế' },
    { origin: 'Hà Nội', destination: 'Đà Nẵng' },  
    { origin: 'Hà Nội', destination: 'Nha Trang' },
    { origin: 'Hà Nội', destination: 'Hồ Chí Minh' },
    { origin: 'Vinh', destination: 'Huế' },
    { origin: 'Vinh', destination: 'Đà Nẵng' },
    { origin: 'Vinh', destination: 'Nha Trang' },
    { origin: 'Vinh', destination: 'Hồ Chí Minh' },
    { origin: 'Huế', destination: 'Đà Nẵng' },
    { origin: 'Huế', destination: 'Nha Trang' },
    { origin: 'Huế', destination: 'Hồ Chí Minh' },
    { origin: 'Đà Nẵng', destination: 'Nha Trang' },
    { origin: 'Đà Nẵng', destination: 'Hồ Chí Minh' },
    { origin: 'Nha Trang', destination: 'Hồ Chí Minh' }
  ],
  'SE9': [
    { origin: 'Hà Nội', destination: 'Vinh' },
    { origin: 'Hà Nội', destination: 'Huế' },
    { origin: 'Hà Nội', destination: 'Đà Nẵng' },  
    { origin: 'Hà Nội', destination: 'Nha Trang' },
    { origin: 'Hà Nội', destination: 'Hồ Chí Minh' },
    { origin: 'Vinh', destination: 'Huế' },
    { origin: 'Vinh', destination: 'Đà Nẵng' },
    { origin: 'Vinh', destination: 'Nha Trang' },
    { origin: 'Vinh', destination: 'Hồ Chí Minh' },
    { origin: 'Huế', destination: 'Đà Nẵng' },
    { origin: 'Huế', destination: 'Nha Trang' },
    { origin: 'Huế', destination: 'Hồ Chí Minh' },
    { origin: 'Đà Nẵng', destination: 'Nha Trang' },
    { origin: 'Đà Nẵng', destination: 'Hồ Chí Minh' },
    { origin: 'Nha Trang', destination: 'Hồ Chí Minh' }
  ],
  
  // Tàu dài Nam-Bắc (Hồ Chí Minh -> Hà Nội)  
  'SE2': [
    { origin: 'Hồ Chí Minh', destination: 'Nha Trang' },
    { origin: 'Hồ Chí Minh', destination: 'Đà Nẵng' },
    { origin: 'Hồ Chí Minh', destination: 'Huế' },
    { origin: 'Hồ Chí Minh', destination: 'Vinh' },
    { origin: 'Hồ Chí Minh', destination: 'Hà Nội' },
    { origin: 'Nha Trang', destination: 'Đà Nẵng' },
    { origin: 'Nha Trang', destination: 'Huế' },
    { origin: 'Nha Trang', destination: 'Vinh' },
    { origin: 'Nha Trang', destination: 'Hà Nội' },
    { origin: 'Đà Nẵng', destination: 'Huế' },
    { origin: 'Đà Nẵng', destination: 'Vinh' },
    { origin: 'Đà Nẵng', destination: 'Hà Nội' },
    { origin: 'Huế', destination: 'Vinh' },
    { origin: 'Huế', destination: 'Hà Nội' },
    { origin: 'Vinh', destination: 'Hà Nội' }
  ],
  'SE4': [
    { origin: 'Hồ Chí Minh', destination: 'Nha Trang' },
    { origin: 'Hồ Chí Minh', destination: 'Đà Nẵng' },
    { origin: 'Hồ Chí Minh', destination: 'Huế' },
    { origin: 'Hồ Chí Minh', destination: 'Vinh' },
    { origin: 'Hồ Chí Minh', destination: 'Hà Nội' },
    { origin: 'Nha Trang', destination: 'Đà Nẵng' },
    { origin: 'Nha Trang', destination: 'Huế' },
    { origin: 'Nha Trang', destination: 'Vinh' },
    { origin: 'Nha Trang', destination: 'Hà Nội' },
    { origin: 'Đà Nẵng', destination: 'Huế' },
    { origin: 'Đà Nẵng', destination: 'Vinh' },
    { origin: 'Đà Nẵng', destination: 'Hà Nội' },
    { origin: 'Huế', destination: 'Vinh' },
    { origin: 'Huế', destination: 'Hà Nội' },
    { origin: 'Vinh', destination: 'Hà Nội' }
  ],
  'SE8': [
    { origin: 'Hồ Chí Minh', destination: 'Nha Trang' },
    { origin: 'Hồ Chí Minh', destination: 'Đà Nẵng' },
    { origin: 'Hồ Chí Minh', destination: 'Huế' },
    { origin: 'Hồ Chí Minh', destination: 'Vinh' },
    { origin: 'Hồ Chí Minh', destination: 'Hà Nội' },
    { origin: 'Nha Trang', destination: 'Đà Nẵng' },
    { origin: 'Nha Trang', destination: 'Huế' },
    { origin: 'Nha Trang', destination: 'Vinh' },
    { origin: 'Nha Trang', destination: 'Hà Nội' },
    { origin: 'Đà Nẵng', destination: 'Huế' },
    { origin: 'Đà Nẵng', destination: 'Vinh' },
    { origin: 'Đà Nẵng', destination: 'Hà Nội' },
    { origin: 'Huế', destination: 'Vinh' },
    { origin: 'Huế', destination: 'Hà Nội' },
    { origin: 'Vinh', destination: 'Hà Nội' }
  ],
  'SE10': [
    { origin: 'Hồ Chí Minh', destination: 'Nha Trang' },
    { origin: 'Hồ Chí Minh', destination: 'Đà Nẵng' },
    { origin: 'Hồ Chí Minh', destination: 'Huế' },
    { origin: 'Hồ Chí Minh', destination: 'Vinh' },
    { origin: 'Hồ Chí Minh', destination: 'Hà Nội' },
    { origin: 'Nha Trang', destination: 'Đà Nẵng' },
    { origin: 'Nha Trang', destination: 'Huế' },
    { origin: 'Nha Trang', destination: 'Vinh' },
    { origin: 'Nha Trang', destination: 'Hà Nội' },
    { origin: 'Đà Nẵng', destination: 'Huế' },
    { origin: 'Đà Nẵng', destination: 'Vinh' },
    { origin: 'Đà Nẵng', destination: 'Hà Nội' },
    { origin: 'Huế', destination: 'Vinh' },
    { origin: 'Huế', destination: 'Hà Nội' },
    { origin: 'Vinh', destination: 'Hà Nội' }
  ],

  // Tàu đoạn ngắn Hà Nội - Đà Nẵng
  'SE5': [
    { origin: 'Hà Nội', destination: 'Vinh' },
    { origin: 'Hà Nội', destination: 'Huế' },
    { origin: 'Hà Nội', destination: 'Đà Nẵng' },
    { origin: 'Vinh', destination: 'Huế' },
    { origin: 'Vinh', destination: 'Đà Nẵng' },
    { origin: 'Huế', destination: 'Đà Nẵng' }
  ],
  'SE6': [
    { origin: 'Đà Nẵng', destination: 'Huế' },
    { origin: 'Đà Nẵng', destination: 'Vinh' },
    { origin: 'Đà Nẵng', destination: 'Hà Nội' },
    { origin: 'Huế', destination: 'Vinh' },
    { origin: 'Huế', destination: 'Hà Nội' },
    { origin: 'Vinh', destination: 'Hà Nội' }
  ],

  // Tàu đoạn ngắn Hồ Chí Minh - Đà Nẵng 
  'SE22': [
    { origin: 'Hồ Chí Minh', destination: 'Nha Trang' },
    { origin: 'Hồ Chí Minh', destination: 'Đà Nẵng' },
    { origin: 'Nha Trang', destination: 'Đà Nẵng' }
  ]
};

function normalizeStationName(station) {
  if (!station || typeof station !== 'string') return station;
  const upper = station.trim().toUpperCase();
  if (stationMapping[upper]) {
    return stationMapping[upper];
  }
  return station.trim();
}

function calculateDistanceMultiplier(origin, destination) {
  const stations = ['Hà Nội', 'Vinh', 'Huế', 'Đà Nẵng', 'Nha Trang', 'Hồ Chí Minh'];
  const originIndex = stations.indexOf(origin);
  const destIndex = stations.indexOf(destination);
  
  if (originIndex === -1 || destIndex === -1) return 1;
  
  const distance = Math.abs(destIndex - originIndex);
  // Tính multiplier theo khoảng cách thực tế
  const multipliers = { 1: 0.25, 2: 0.5, 3: 0.7, 4: 0.85, 5: 1.0 };
  return multipliers[distance] || 1.0;
}

function adjustPriceForRoute(basePrice, origin, destination, baseOrigin, baseDestination) {
  const baseMultiplier = calculateDistanceMultiplier(baseOrigin, baseDestination);
  const actualMultiplier = calculateDistanceMultiplier(origin, destination);
  
  return Math.round(basePrice * (actualMultiplier / baseMultiplier));
}

function generateRoutesForTrain(trainId, baseRoutes) {
  const definedRoutes = trainRouteDefinitions[trainId] || [];
  const generatedRoutes = [];
  
  for (const routeDefinition of definedRoutes) {
    const { origin, destination } = routeDefinition;
    
    // Tìm base route gần nhất để tính giá
    let baseRoute = null;
    for (const base of baseRoutes) {
      if (base.origin === origin && base.destination === destination) {
        baseRoute = base;
        break;
      }
    }
    
    if (!baseRoute && baseRoutes.length > 0) {
      baseRoute = baseRoutes[0]; // fallback to first route
    }
    
    if (!baseRoute) continue;
    
    // Tạo fares điều chỉnh theo khoảng cách
    const adjustedFares = JSON.parse(JSON.stringify(baseRoute.fares));
    
    // Adjust prices cho từng loại ghế
    Object.keys(adjustedFares).forEach(seatType => {
      if (Array.isArray(adjustedFares[seatType])) {
        adjustedFares[seatType].forEach(car => {
          if (car.rows) {
            car.rows.forEach(row => {
              row.price = adjustPriceForRoute(
                row.price, 
                origin, 
                destination, 
                baseRoute.origin, 
                baseRoute.destination
              );
            });
          }
        });
      }
    });
    
    generatedRoutes.push({
      origin,
      destination,
      fares: adjustedFares
    });
  }
  
  return generatedRoutes;
}

function processJsonFile(filePath, trainId) {
  try {
    console.log(`\\n=== Processing ${trainId} ===`);
    
    const rawData = fs.readFileSync(filePath, { encoding: 'utf8' });
    const jsonData = JSON.parse(rawData);
    
    if (!jsonData.train_fares || !Array.isArray(jsonData.train_fares)) {
      console.log(`${trainId}: No train_fares array found, skipping...`);
      return null;
    }
    
    const baseRoutes = [];
    
    for (const route of jsonData.train_fares) {
      if (!route.fares || typeof route.fares !== 'object') {
        continue;
      }
      
      const origin = normalizeStationName(route.origin);
      const destination = normalizeStationName(route.destination);
      
      baseRoutes.push({
        origin,
        destination,
        fares: route.fares
      });
    }
    
    if (baseRoutes.length === 0) {
      console.log(`${trainId}: No valid base routes found`);
      return null;
    }
    
    // Generate all routes cho train này
    const allRoutes = generateRoutesForTrain(trainId, baseRoutes);
    
    console.log(`${trainId}: Generated ${allRoutes.length} routes`);
    
    return {
      trainId,
      routes: allRoutes
    };
    
  } catch (error) {
    console.error(`Error processing ${trainId}:`, error.message);
    return null;
  }
}

function generateTypeScriptContent(trainId, data) {
  const content = `// Auto-generated pricing data cho tàu ${trainId}
import type { SeatPricing } from '../seatPricing';

export const ${trainId}_GENERATED_PRICING: SeatPricing = ${JSON.stringify(data, null, 2)};
`;
  return content;
}

async function generateAllPricingFiles() {
  const dataDir = path.join(process.cwd(), 'public', 'data');
  const outputDir = path.join(process.cwd(), 'src', 'mockData', 'generated');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const trainFiles = [
    'SE1.json', 'SE2.json', 'SE3.json', 'SE4.json', 'SE5.json',
    'SE6.json', 'SE7.json', 'SE8.json', 'SE9.json', 'SE10.json', 'SE22.json'
  ];
  
  console.log('=== Starting corrected route generation ===');
  
  for (const filename of trainFiles) {
    const trainId = filename.replace('.json', '');
    const filePath = path.join(dataDir, filename);
    const outputPath = path.join(outputDir, `${trainId.toLowerCase()}Pricing.ts`);
    
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
    fs.writeFileSync(outputPath, '\ufeff' + tsContent, { encoding: 'utf8' });
    
    console.log(`Generated: ${outputPath}`);
  }
  
  console.log('\\n=== Corrected route generation complete ===');
}

generateAllPricingFiles().catch(console.error);
