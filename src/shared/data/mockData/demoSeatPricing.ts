// Demo sử dụng dữ liệu ghế và giá ghế từ mock data
import { 
  getSeatPrice, 
  getSeatBehavior, 
  generateDefaultSeatBehavior,
  SEAT_PRICING_DATA,
  SEAT_BEHAVIOR_DATA 
} from './seatPricing';

// Test function để demo các tính năng
export const demoSeatPricingSystem = () => {
  console.log('🎫 DEMO: Hệ thống giá ghế và hành vi khách hàng');
  console.log('==================================================');
  
  // 1. Test lấy giá ghế
  const price1 = getSeatPrice('SE9', 'Hà Nội', 'Nha Trang', 'hard_seat', 1, 5);
  console.log(`💰 Giá ghế SE9 (HN→NT, hard_seat, car 1, seat 5): ${price1.toLocaleString()} VND`);
  
  const price2 = getSeatPrice('SE9', 'Hà Nội', 'Nha Trang', '4_berth_cabin', 4, 10);
  console.log(`💰 Giá ghế SE9 (HN→NT, 4_berth_cabin, car 4, seat 10): ${price2.toLocaleString()} VND`);
  
  const price3 = getSeatPrice('SE1', 'Hà Nội', 'Sài Gòn', '6_berth_cabin', 3, 15);
  console.log(`💰 Giá ghế SE1 (HN→SG, 6_berth_cabin, car 3, seat 15): ${price3.toLocaleString()} VND`);
  
  // 2. Test lấy hành vi ghế
  const behavior1 = getSeatBehavior('SE9', 'hard_seat', 'A1');
  console.log('👤 Hành vi ghế SE9-hard_seat-A1:', behavior1);
  
  const behavior2 = getSeatBehavior('SE9', '4_berth_cabin', '1-1');
  console.log('👤 Hành vi ghế SE9-4_berth_cabin-1-1:', behavior2);
  
  // 3. Test tạo hành vi mặc định
  const defaultBehavior = generateDefaultSeatBehavior('SE5', 'soft_seat', 'B3');
  console.log('🔧 Hành vi mặc định cho SE5-soft_seat-B3:', defaultBehavior);
  
  // 4. Thống kê dữ liệu
  console.log(`📊 Tổng số tàu có dữ liệu giá: ${SEAT_PRICING_DATA.length}`);
  console.log(`📊 Tổng số ghế có dữ liệu hành vi: ${SEAT_BEHAVIOR_DATA.length}`);
  
  // 5. Demo giá theo từng tuyến
  console.log('\n🚂 So sánh giá theo tuyến:');
  const routes = [
    { trainId: 'SE1', origin: 'Hà Nội', destination: 'Sài Gòn' },
    { trainId: 'SE5', origin: 'Hà Nội', destination: 'Đà Nẵng' },
    { trainId: 'SE9', origin: 'Hà Nội', destination: 'Nha Trang' },
    { trainId: 'SE22', origin: 'Vinh', destination: 'Sài Gòn' }
  ];
  
  routes.forEach(route => {
    const hardSeatPrice = getSeatPrice(route.trainId, route.origin, route.destination, 'hard_seat', 1, 1);
    const softSleeperPrice = getSeatPrice(route.trainId, route.origin, route.destination, '4_berth_cabin', 4, 1);
    
    console.log(`${route.trainId} (${route.origin} → ${route.destination}):`);
    console.log(`  🪑 Hard seat: ${hardSeatPrice.toLocaleString()} VND`);
    console.log(`  🛏️ Soft sleeper: ${softSleeperPrice.toLocaleString()} VND`);
  });
  
  return {
    totalTrains: SEAT_PRICING_DATA.length,
    totalBehaviors: SEAT_BEHAVIOR_DATA.length,
    samplePrices: { price1, price2, price3 },
    sampleBehaviors: { behavior1, behavior2, defaultBehavior }
  };
};

// Export cho việc testing
export const testSeatPricing = demoSeatPricingSystem;
