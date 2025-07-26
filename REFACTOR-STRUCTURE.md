# Booking Train Project - Refactored Structure

## 📁 Cấu trúc dự án mới

```
src/
├── features/               # Feature-based modules
│   ├── auth/              # Authentication features
│   │   ├── pages/         # Auth-related pages (Login, Register, Forget)
│   │   └── index.ts       # Auth exports
│   ├── booking/           # Train booking features  
│   │   ├── pages/         # Booking pages (SelectTrain, SelectSeat, etc.)
│   │   ├── components/    # Booking-specific components
│   │   └── index.ts       # Booking exports
│   ├── payment/           # Payment features
│   │   ├── pages/         # Payment pages (Payment, Cards, etc.)
│   │   └── index.ts       # Payment exports
│   └── user/              # User account features
│       ├── pages/         # User pages (Account, Tickets, etc.)
│       └── index.ts       # User exports
│
├── shared/                # Shared resources
│   ├── types/            # TypeScript type definitions
│   │   ├── auth.types.ts
│   │   ├── booking.types.ts
│   │   ├── train.types.ts
│   │   ├── payment.types.ts
│   │   ├── user.types.ts
│   │   ├── common.types.ts
│   │   └── index.ts
│   ├── constants/        # App constants and enums
│   │   └── index.ts
│   ├── data/            # Mock data and data utilities
│   │   ├── stations.ts
│   │   ├── trains.ts
│   │   ├── seats.ts
│   │   ├── users.ts
│   │   ├── seatPricing.ts
│   │   └── index.ts
│   ├── utils/           # Utility functions
│   │   ├── date.ts
│   │   ├── currency.ts
│   │   ├── validation.ts
│   │   └── index.ts
│   ├── hooks/           # Custom React hooks
│   │   ├── useLocalStorage.ts
│   │   └── index.ts
│   └── services/        # API services
│       └── api.ts
│
├── components/          # Shared components
│   ├── ui/             # Base UI components
│   └── ...            # Other shared components
│
├── pages/              # Remaining general pages
│   ├── Home.tsx
│   ├── Main.tsx
│   └── ...
│
└── ...

scripts/                 # Build and utility scripts
├── data-generation/     # Data generation scripts
│   ├── generateEnhancedMockData.cjs
│   ├── generateCorrectRoutes.cjs
│   └── ...
└── testing/            # Testing scripts
    ├── testFiles.cjs
    ├── testRoutes.cjs
    └── ...
```

## 🎯 Lợi ích của cấu trúc mới

### 1. **Feature-based Architecture**
- Tách biệt theo chức năng: auth, booking, payment, user
- Dễ dàng maintain và scale
- Team có thể làm việc song song trên các features khác nhau

### 2. **Shared Resources**
- Types: Tất cả type definitions tập trung
- Constants: Các hằng số được định nghĩa rõ ràng
- Utils: Utility functions có thể tái sử dụng
- Data: Mock data được tổ chức có hệ thống

### 3. **Clean Separation**
- Business logic tách biệt khỏi UI
- Shared components vs feature-specific components
- Scripts được tổ chức theo mục đích sử dụng

### 4. **Type Safety**
- Comprehensive TypeScript types
- Strongly typed API responses
- Type-safe state management

## 🚀 Cách sử dụng

### Import từ features:
```typescript
import { Login, Register } from '@/features/auth';
import { SelectTrain, SelectSeat } from '@/features/booking';
```

### Import shared resources:
```typescript
import { Train, BookingDetails } from '@/shared/types';
import { APP_ROUTES, COACH_TYPES } from '@/shared/constants';
import { formatCurrency, validateEmail } from '@/shared/utils';
```

### Import data:
```typescript
import { STATIONS, TRAINS } from '@/shared/data';
```

## 🔧 Scripts đã được tổ chức lại

### Data Generation:
```bash
node scripts/data-generation/generateEnhancedMockData.cjs
node scripts/data-generation/generateCorrectRoutes.cjs
```

### Testing:
```bash
node scripts/testing/testFiles.cjs
node scripts/testing/testRoutes.cjs
```

## 📝 Todo

1. [ ] Tạo path aliases trong tsconfig.json (@/features, @/shared, etc.)
2. [ ] Implement error boundaries cho từng feature
3. [ ] Tạo feature-specific stores/contexts
4. [ ] Migrate remaining mock data
5. [ ] Add comprehensive tests cho từng feature
6. [ ] Setup linting rules cho structure mới

## 🔄 Migration Notes

- App.tsx đã được cập nhật để import từ features
- Pages đã được di chuyển vào các feature folders tương ứng
- Mock data đã được chuyển sang shared/data
- Scripts được tổ chức theo thư mục riêng

## 📊 Metrics

- **Before**: 1 folder chứa 40+ pages
- **After**: 4 feature folders + shared resources
- **Reduced complexity**: Từ monolithic sang modular
- **Improved maintainability**: Easy to locate and modify features
