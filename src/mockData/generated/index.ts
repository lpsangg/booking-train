// Auto-generated exports for all train pricing data
export * from './se1Pricing';
export * from './se2Pricing';
export * from './se3Pricing';
export * from './se4Pricing';
export * from './se5Pricing';
export * from './se6Pricing';
export * from './se7Pricing';
export * from './se8Pricing';
export * from './se9Pricing';
export * from './se10Pricing';
export * from './se22Pricing';

// Collection of all pricing data
import { SE1_GENERATED_PRICING } from './se1Pricing';
import { SE2_GENERATED_PRICING } from './se2Pricing';
import { SE3_GENERATED_PRICING } from './se3Pricing';
import { SE4_GENERATED_PRICING } from './se4Pricing';
import { SE5_GENERATED_PRICING } from './se5Pricing';
import { SE6_GENERATED_PRICING } from './se6Pricing';
import { SE7_GENERATED_PRICING } from './se7Pricing';
import { SE8_GENERATED_PRICING } from './se8Pricing';
import { SE9_GENERATED_PRICING } from './se9Pricing';
import { SE10_GENERATED_PRICING } from './se10Pricing';
import { SE22_GENERATED_PRICING } from './se22Pricing';

export const ALL_GENERATED_PRICING_DATA = [
  SE1_GENERATED_PRICING,
  SE2_GENERATED_PRICING,
  SE3_GENERATED_PRICING,
  SE4_GENERATED_PRICING,
  SE5_GENERATED_PRICING,
  SE6_GENERATED_PRICING,
  SE7_GENERATED_PRICING,
  SE8_GENERATED_PRICING,
  SE9_GENERATED_PRICING,
  SE10_GENERATED_PRICING,
  SE22_GENERATED_PRICING
];

// Utility function để tìm pricing theo trainId
export function getGeneratedPricingByTrainId(trainId: string) {
  return ALL_GENERATED_PRICING_DATA.find(pricing => pricing.trainId === trainId);
}
