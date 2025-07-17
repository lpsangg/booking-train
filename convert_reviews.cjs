const fs = require('fs');
const path = require('path');

  const dataDir = path.join(__dirname, 'public', 'data');

function flattenFares(trainCode, fares, type, carKey) {
  const result = [];
  if (!Array.isArray(fares)) return result;
  fares.forEach(car => {
    const carNumber = car[carKey];
    if (type === 'seating') {
      // Ngồi mềm: giữ nguyên từng ghế một
      car.rows.forEach(row => {
        row.row_numbers.forEach(num => {
          result.push({
            id: `${trainCode}-ngoi-${carNumber}-${num}`,
            car: carNumber,
            row: num,
            price: row.price
          });
        });
      });
    } else if (type === 'sleeper_6_berth') {
      // Khoang 6: chỉ lấy ghế bên trái tầng 1 mỗi khoang (mỗi khoang 6 ghế, lấy ghế đầu tiên)
      car.rows.forEach((row, rowIdx) => {
        // row_numbers: [1,2,3,4,5,6], [7,8,9,10,11,12], ...
        // Ghế bên trái tầng 1 là row_numbers[0]
        if (row.row_numbers && row.row_numbers.length > 0) {
          const num = row.row_numbers[0];
          // Mỗi row là 1 khoang
          result.push({
            id: `${trainCode}-k6-${carNumber}-${num}`,
            car: carNumber,
            row: num,
            price: row.price
          });
        }
      });
    } else if (type === 'sleeper_4_berth') {
      // Khoang 4: chỉ lấy ghế bên trái tầng 1 mỗi khoang (mỗi khoang 4 ghế, lấy ghế đầu tiên)
      car.rows.forEach((row, rowIdx) => {
        // row_numbers: [1,2,3,4], [5,6,7,8], ...
        // Ghế bên trái tầng 1 là row_numbers[0]
        if (row.row_numbers && row.row_numbers.length > 0) {
          const num = row.row_numbers[0];
          // Mỗi row là 1 khoang
          result.push({
            id: `${trainCode}-k4-${carNumber}-${num}`,
            car: carNumber,
            row: num,
            price: row.price
          });
        }
      });
    }
  });
  return result;
}

fs.readdirSync(dataDir).forEach(file => {
  if (!file.endsWith('.json')) return;
  const filePath = path.join(dataDir, file);
  const raw = fs.readFileSync(filePath, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error('Invalid JSON:', file);
    return;
  }
  if (!data.train_fares) return;
  const trainCode = file.replace(/\.json$/, '');
  data.train_fares.forEach(fare => {
    const flat = [];
    flat.push(...flattenFares(trainCode, fare.fares.seating, 'seating', 'car_number'));
    flat.push(...flattenFares(trainCode, fare.fares.sleeper_6_berth, 'sleeper_6_berth', 'car_number'));
    flat.push(...flattenFares(trainCode, fare.fares.sleeper_4_berth, 'sleeper_4_berth', 'car_number'));
    fare.flat_seats = flat;
  });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Converted:', file);
});

console.log('Done!');
