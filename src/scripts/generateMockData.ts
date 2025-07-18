// Script để đọc tất cả JSON files và tạo mock data chính xác
import fs from 'fs';
import path from 'path';

// Mapping tên ga từ JSON sang tên chuẩn trong app
const STATION_MAPPING: { [key: string]: string } = {
  'HÀ NỘI': 'Hà Nội',
  'VINH': 'Vinh', 
  'ĐÀ NẴNG': 'Đà Nẵng',
  'NHA TRANG': 'Nha Trang',
  'SÀI GÒN': 'Sài Gòn',
  'SAIGON': 'Sài Gòn',
  'HO CHI MINH': 'Sài Gòn'
};

// Coach type mapping từ JSON structure
const COACH_TYPE_MAPPING = {
  'seating': 'seating',           // Hard seat + Soft seat
  'sleeper_6_berth': 'sleeper_6_berth', // 6-berth cabin
  'sleeper_4_berth': 'sleeper_4_berth'  // 4-berth cabin
};

// Interface cho dữ liệu từ JSON
interface JsonPricing {
  train_fares: Array<{
    origin: string;
    destination: string;
    fares: {
      seating?: Array<{
        car_number: number;
        rows: Array<{
          row_numbers: number[];
          price: number;
        }>;
      }>;
      sleeper_6_berth?: Array<{
        car_number: number;
        rows: Array<{
          row_numbers: number[];
          price: number;
        }>;
      }>;
      sleeper_4_berth?: Array<{
        car_number: number;
        rows: Array<{
          row_numbers: number[];
          price: number;
        }>;
      }>;
    };
    flat_seats?: Array<{
      id: string;
      car: number;
      row: number;
      price: number;
    }>;
  }>;
}

// Interface cho kết quả mock data
interface MockDataPricing {
  trainId: string;
  routes: Array<{
    origin: string;
    destination: string;
    fares: {
      seating?: Array<{
        car_number: number;
        rows: Array<{
          row_numbers: number[];
          price: number;
        }>;
      }>;
      sleeper_6_berth?: Array<{
        car_number: number;
        rows: Array<{
          row_numbers: number[];
          price: number;
        }>;
      }>;
      sleeper_4_berth?: Array<{
        car_number: number;
        rows: Array<{
          row_numbers: number[];
          price: number;
        }>;
      }>;
    };
  }>;
}

/**
 * Chuẩn hóa tên ga theo logic frontend
 */
function normalizeStationName(stationName: string): string {
  const normalized = stationName
    .trim()
    .toUpperCase()
    .replace(/^GA\s+/, '') // Loại bỏ "GA " ở đầu
    .replace(/\s+/g, ' ') // Chuẩn hóa khoảng trắng
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Loại bỏ dấu
  
  return STATION_MAPPING[normalized] || stationName;
}

/**
 * Đọc và parse JSON file
 */
async function readJsonFile(filePath: string): Promise<JsonPricing | null> {
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
function convertToMockData(trainId: string, jsonData: JsonPricing): MockDataPricing {
  const mockData: MockDataPricing = {
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
      fares: {} as any
    };

    // Copy pricing data từ JSON
    if (fare.fares.seating) {
      route.fares.seating = fare.fares.seating;
    }
    if (fare.fares.sleeper_6_berth) {
      route.fares.sleeper_6_berth = fare.fares.sleeper_6_berth;
    }
    if (fare.fares.sleeper_4_berth) {
      route.fares.sleeper_4_berth = fare.fares.sleeper_4_berth;
    }

    mockData.routes.push(route);
  });

  return mockData;
}

/**
 * Tạo TypeScript file content
 */
function generateTypeScriptContent(trainId: string, mockData: MockDataPricing): string {
  return `// Auto-generated pricing data cho tàu ${trainId}
import type { SeatPricing } from './seatPricing';

export const ${trainId}_COMPLETE_PRICING: SeatPricing = ${JSON.stringify(mockData, null, 2)};
`;
}

/**
 * Main function để generate tất cả mock data
 */
async function generateAllMockData() {
  const publicDataPath = path.join(process.cwd(), 'public', 'data');
  const mockDataPath = path.join(process.cwd(), 'src', 'mockData', 'generated');
  
  // Tạo thư mục generated nếu chưa có
  if (!fs.existsSync(mockDataPath)) {
    fs.mkdirSync(mockDataPath, { recursive: true });
  }

  const trainIds = ['SE1', 'SE2', 'SE3', 'SE4', 'SE5', 'SE6', 'SE7', 'SE8', 'SE9', 'SE10', 'SE22'];
  const allExports: string[] = [];
  const allPricingData: string[] = [];

  console.log('🚂 Generating mock data from JSON files...\n');

  for (const trainId of trainIds) {
    const jsonFilePath = path.join(publicDataPath, `${trainId}.json`);
    
    console.log(`📄 Processing ${trainId}.json...`);
    
    const jsonData = await readJsonFile(jsonFilePath);
    if (!jsonData) {
      console.log(`❌ Failed to read ${trainId}.json`);
      continue;
    }

    const mockData = convertToMockData(trainId, jsonData);
    
    console.log(`✅ Found ${mockData.routes.length} valid routes for ${trainId}`);
    mockData.routes.forEach(route => {
      console.log(`   - ${route.origin} → ${route.destination}`);
    });

    // Generate TypeScript content
    const tsContent = generateTypeScriptContent(trainId, mockData);
    
    // Write to file
    const outputPath = path.join(mockDataPath, `${trainId.toLowerCase()}Pricing.ts`);
    fs.writeFileSync(outputPath, tsContent);
    
    // Add to exports
    allExports.push(`export * from './generated/${trainId.toLowerCase()}Pricing';`);
    allPricingData.push(`${trainId}_COMPLETE_PRICING`);
    
    console.log(`💾 Generated: ${outputPath}\n`);
  }

  // Generate index file
  const indexContent = `// Auto-generated exports
${allExports.join('\n')}

// Collection of all pricing data
import { ${allPricingData.join(', ')} } from './index';

export const ALL_GENERATED_PRICING_DATA = [
  ${allPricingData.join(',\n  ')}
];
`;

  const indexPath = path.join(mockDataPath, 'index.ts');
  fs.writeFileSync(indexPath, indexContent);
  
  console.log(`📋 Generated index file: ${indexPath}`);
  console.log(`\n🎉 Successfully generated mock data for ${trainIds.length} trains!`);
  console.log(`📁 Output directory: ${mockDataPath}`);
}

// Export for use in Node.js script
export { generateAllMockData, readJsonFile, convertToMockData, normalizeStationName };

// Self-execute if run directly
if (require.main === module) {
  generateAllMockData().catch(console.error);
}
