// src/layouts/seatLayout.ts
// Layout cho toa 'Ngồi mềm': 28 hàng x 4 cột, 112 ghế, không lối đi
export const SEAT_LAYOUT = Array.from({ length: 28 }, (_, row) => [
  row * 4 + 0,
  row * 4 + 1,
  row * 4 + 2,
  row * 4 + 3,
]);

// Layout cho 'Nằm khoang 6': 7 khoang, mỗi khoang 3 tầng, mỗi tầng 2 ghế
export const LAYOUT_KHOANG_6 = Array.from({ length: 7 }, (_, khoang) => [
  [khoang * 6 + 0, khoang * 6 + 1], // Tầng 1
  [khoang * 6 + 2, khoang * 6 + 3], // Tầng 2
  [khoang * 6 + 4, khoang * 6 + 5], // Tầng 3
]);

// Layout cho 'Nằm khoang 4': 7 khoang, mỗi khoang 2 tầng, mỗi tầng 2 ghế
export const LAYOUT_KHOANG_4 = Array.from({ length: 7 }, (_, khoang) => [
  [khoang * 4 + 0, khoang * 4 + 1], // Tầng 1
  [khoang * 4 + 2, khoang * 4 + 3], // Tầng 2
]); 