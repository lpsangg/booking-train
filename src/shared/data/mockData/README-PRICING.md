# 🚂 Complete Train Pricing System

## Tổng quan
Hệ thống pricing data hoàn chỉnh cho tất cả các tàu và tuyến đường, giải quyết vấn đề "giá gốc = 0" trong bảng lọc.

## 📁 Cấu trúc Files

### Core Pricing Data
- **`seatPricing.ts`** - Interfaces và base pricing cho SE9
- **`allTrainPricing.ts`** - Pricing data cho SE1, SE5, SE22  
- **`completeTrainPricing.ts`** - Pricing data đầy đủ cho tất cả 11 tàu
- **`pricingUtils.ts`** - Utility functions và mapping
- **`pricingTests.ts`** - Validation và testing functions

### Demo & Testing
- **`demo/pricingDemo.ts`** - Demo functions
- **README-PRICING.md`** - Documentation này

## 🚀 Cách sử dụng

### 1. Import functions
```typescript
import { 
  getAccurateSeatPrice, 
  validateAllTrainPricing, 
  runComprehensivePricingTests 
} from '../mockData';
```

### 2. Lấy giá ghế chính xác
```typescript
// Lấy giá ghế cụ thể
const price = getAccurateSeatPrice(
  'SE1',           // trainId
  'Hà Nội',        // origin 
  'Sài Gòn',       // destination
  'hard_seat',     // coachId
  1,               // carNumber
  1                // seatRow
);
console.log(`Giá: ${price.toLocaleString()}đ`);
```

### 3. Validate toàn bộ pricing data
```typescript
const validation = validateAllTrainPricing();
console.log(`Routes có pricing: ${validation.validatedRoutes}/${validation.totalRoutes}`);
console.log(`Missing entries: ${validation.missingPricing.length}`);
```

### 4. Run comprehensive tests
```typescript
import { runPricingDemo } from '../demo/pricingDemo';
const results = runPricingDemo();
```

## 📊 Coach Type Mapping

| trains.ts ID | Pricing Type | Car Number | Description |
|-------------|-------------|------------|-------------|
| `hard_seat` | `seating` | 1 | Ghế cứng |
| `soft_seat` | `seating` | 2 | Ghế mềm |
| `6_berth_cabin` | `sleeper_6_berth` | 3 | Giường nằm 6 chỗ |
| `4_berth_cabin` | `sleeper_4_berth` | 4 | Giường nằm 4 chỗ |

## 🚂 Trains Coverage

| Train ID | Route | Status |
|----------|-------|--------|
| SE1 | Hà Nội → Sài Gòn | ✅ Complete |
| SE2 | Sài Gòn → Hà Nội | ✅ Complete |
| SE3 | Hà Nội → Sài Gòn | ✅ Complete |
| SE4 | Sài Gòn → Hà Nội | ✅ Complete |
| SE5 | Hà Nội → Đà Nẵng | ✅ Complete |
| SE6 | Đà Nẵng → Hà Nội | ✅ Complete |
| SE7 | Đà Nẵng → Sài Gòn | ✅ Complete |
| SE8 | Sài Gòn → Đà Nẵng | ✅ Complete |
| SE9 | Hà Nội → Nha Trang | ✅ Complete |
| SE10 | Nha Trang → Hà Nội | ✅ Complete |
| SE22 | Vinh → Sài Gòn | ✅ Complete |

## 💰 Pricing Structure

### Row-based Pricing
Mỗi coach có pricing theo rows:
- **Seating**: Rows 1-28 (2 ghế/row)
- **6-berth sleeper**: Rows 1-36 (6 giường/row) 
- **4-berth sleeper**: Rows 1-24 (4 giường/row)

### Price Progression
Giá tăng theo vị trí:
```
Row 1-2: Base price
Row 3-4: Base + 5,000đ
Row 5-6: Base + 10,000đ
...
```

## 🔧 Debug Functions

### Debug specific train
```typescript
import { debugPricing } from '../mockData/pricingUtils';
debugPricing('SE1', 'Hà Nội', 'Sài Gòn');
```

### Test price variations
```typescript
import { testTrainPriceVariations } from '../mockData/pricingTests';
testTrainPriceVariations('SE1', 'Hà Nội', 'Sài Gòn');
```

## ✅ Benefits

1. **No More Zero Prices**: Tất cả ghế đều có giá > 0
2. **Detailed Pricing**: Giá chi tiết theo vị trí ghế
3. **Type Safety**: Full TypeScript support
4. **Easy Testing**: Comprehensive validation tools
5. **Performance**: No external JSON loading
6. **Maintainable**: Organized structure

## 🎯 Usage trong SelectSeat Component

```typescript
import { getAccurateSeatPrice } from '../mockData';

// Trong component SelectSeat.tsx
const seatPrice = getAccurateSeatPrice(
  trainId,
  departureStation,
  arrivalStation, 
  coachType,
  carNumber,
  seatRow
);

// Sẽ trả về giá chính xác thay vì 0
```

## 🚨 Troubleshooting

### Nếu giá = 0:
1. Kiểm tra trainId có đúng không
2. Kiểm tra origin/destination mapping
3. Kiểm tra coachId mapping (hard_seat vs seating)
4. Chạy `debugPricing()` để debug

### Fallback mechanism:
Nếu không tìm thấy detailed pricing, system sẽ fallback về basePrice từ trains.ts

## 📝 Console Testing

Trong browser console:
```javascript
import { demoTestSeatPrice } from './src/demo/pricingDemo';

// Test manual
demoTestSeatPrice('SE1', 'Hà Nội', 'Sài Gòn', 'hard_seat', 1, 1);
// Output: 💰 SE1 (Hà Nội -> Sài Gòn) hard_seat car1 row1: 553,000đ
```
