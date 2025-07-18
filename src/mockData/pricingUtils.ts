// Utility functions để map coach types và lấy pricing data
import { ALL_TRAIN_PRICING_DATA, getCompleteSeatPrice } from './completeTrainPricing';
import { TRAINS } from './trains';

// Map coach types từ trains.ts sang pricing data
export const COACH_TYPE_MAPPING = {
  'hard_seat': 'seating',
  'soft_seat': 'seating',
  '6_berth_cabin': 'sleeper_6_berth',
  '4_berth_cabin': 'sleeper_4_berth'
} as const;

// Reverse mapping
export const PRICING_TO_COACH_MAPPING = {
  'seating': ['hard_seat', 'soft_seat'],
  'sleeper_6_berth': ['6_berth_cabin'],
  'sleeper_4_berth': ['4_berth_cabin']
} as const;

/**
 * Lấy giá chính xác cho một ghế cụ thể
 */
export function getAccurateSeatPrice(
  trainId: string, 
  origin: string, 
  destination: string, 
  coachId: string, 
  carNumber: number, 
  seatRow: number
): number {
  // Map coach ID từ trains.ts sang pricing type
  const pricingType = COACH_TYPE_MAPPING[coachId as keyof typeof COACH_TYPE_MAPPING];
  if (!pricingType) {
    console.warn(`Unknown coach type: ${coachId}`);
    return 0;
  }

  const price = getCompleteSeatPrice(trainId, origin, destination, pricingType, carNumber, seatRow);
  
  if (price === 0) {
    console.warn(`No pricing found for: ${trainId}, ${origin} -> ${destination}, ${pricingType}, car ${carNumber}, row ${seatRow}`);
    
    // Fallback: lấy base price từ trains.ts
    const train = TRAINS.find(t => t.id === trainId && t.route.from === origin && t.route.to === destination);
    if (train) {
      const coach = train.coaches.find(c => c.id === coachId);
      if (coach) {
        console.log(`Using fallback base price: ${coach.basePrice}`);
        return coach.basePrice;
      }
    }
  }
  
  return price;
}

/**
 * Lấy tất cả giá ghế cho một coach
 */
export function getAllSeatPricesForCoach(
  trainId: string,
  origin: string, 
  destination: string,
  coachId: string,
  carNumber: number
): Array<{row: number, price: number}> {
  const prices: Array<{row: number, price: number}> = [];
  
  // Kiểm tra từ row 1 đến 36 (max possible seats)
  for (let row = 1; row <= 36; row++) {
    const price = getAccurateSeatPrice(trainId, origin, destination, coachId, carNumber, row);
    if (price > 0) {
      prices.push({ row, price });
    }
  }
  
  return prices;
}

/**
 * Validate pricing data cho tất cả trains
 */
export function validateAllTrainPricing(): {
  missingPricing: Array<{trainId: string, route: string, coachType: string}>,
  validatedRoutes: number,
  totalRoutes: number
} {
  const missingPricing: Array<{trainId: string, route: string, coachType: string}> = [];
  let validatedRoutes = 0;
  let totalRoutes = 0;

  TRAINS.forEach(train => {
    totalRoutes++;
    const route = `${train.route.from} -> ${train.route.to}`;
    let hasAnyPricing = false;
    
    train.coaches.forEach(coach => {
      const price = getAccurateSeatPrice(train.id, train.route.from, train.route.to, coach.id, 1, 1);
      if (price > 0) {
        hasAnyPricing = true;
      } else {
        missingPricing.push({
          trainId: train.id,
          route: route,
          coachType: coach.id
        });
      }
    });
    
    if (hasAnyPricing) {
      validatedRoutes++;
    }
  });

  return {
    missingPricing,
    validatedRoutes,
    totalRoutes
  };
}

/**
 * Debug function để kiểm tra pricing
 */
export function debugPricing(trainId: string, origin: string, destination: string) {
  console.group(`🚂 Debug Pricing: ${trainId} (${origin} -> ${destination})`);
  
  const train = TRAINS.find(t => t.id === trainId && t.route.from === origin && t.route.to === destination);
  if (!train) {
    console.error('❌ Train not found');
    console.groupEnd();
    return;
  }

  const pricingData = ALL_TRAIN_PRICING_DATA.find(p => p.trainId === trainId);
  if (!pricingData) {
    console.error('❌ Pricing data not found');
    console.groupEnd();
    return;
  }

  const route = pricingData.routes.find(r => r.origin === origin && r.destination === destination);
  if (!route) {
    console.error('❌ Route not found in pricing data');
    console.groupEnd();
    return;
  }

  train.coaches.forEach(coach => {
    console.group(`🚌 Coach: ${coach.type} (${coach.id})`);
    console.log(`Base Price: ${coach.basePrice.toLocaleString()}đ`);
    
    const prices = getAllSeatPricesForCoach(trainId, origin, destination, coach.id, 1);
    if (prices.length > 0) {
      console.log(`✅ Detailed pricing available: ${prices.length} rows`);
      console.log(`Price range: ${Math.min(...prices.map(p => p.price)).toLocaleString()}đ - ${Math.max(...prices.map(p => p.price)).toLocaleString()}đ`);
    } else {
      console.log(`❌ No detailed pricing found`);
    }
    console.groupEnd();
  });

  console.groupEnd();
}
