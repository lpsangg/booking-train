// Integration file to use generated pricing data
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
    console.warn(`No pricing data found for train ${trainId}`);
    return 0;
  }

  const route = trainPricing.routes.find(r => r.origin === origin && r.destination === destination);
  if (!route) {
    console.warn(`No route found for ${trainId}: ${origin} -> ${destination}`);
    return 0;
  }

  const coachPricing = route.fares[coachType];
  if (!coachPricing) {
    console.warn(`No ${coachType} pricing found for ${trainId}: ${origin} -> ${destination}`);
    return 0;
  }

  const car = coachPricing.find(c => c.car_number === carNumber);
  if (!car) {
    console.warn(`No car ${carNumber} found for ${coachType} in ${trainId}: ${origin} -> ${destination}`);
    return 0;
  }

  const rowPricing = car.rows.find(r => r.row_numbers.includes(seatRow));
  if (!rowPricing) {
    console.warn(`No pricing found for row ${seatRow} in car ${carNumber} of ${trainId}: ${origin} -> ${destination}`);
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
    console.group(`🚂 ${trainPricing.trainId}`);
    
    trainPricing.routes.forEach(route => {
      totalRoutes++;
      console.log(`📍 ${route.origin} → ${route.destination}`);
      
      Object.entries(route.fares).forEach(([coachType, cars]) => {
        if (cars && Array.isArray(cars)) {
          cars.forEach(car => {
            totalPriceEntries += car.rows.length;
            console.log(`   ${coachType} car ${car.car_number}: ${car.rows.length} price entries`);
          });
        }
      });
    });
    
    console.groupEnd();
  });
  
  console.log(`\n📊 Summary: ${ALL_GENERATED_PRICING_DATA.length} trains, ${totalRoutes} routes, ${totalPriceEntries} price entries`);
  console.groupEnd();
  
  return {
    trainsCount: ALL_GENERATED_PRICING_DATA.length,
    routesCount: totalRoutes,
    priceEntriesCount: totalPriceEntries
  };
}
