const fs = require('fs');
const path = require('path');

// Danh sách các tàu cần chuyển đổi
const trains = ['SE1', 'SE2', 'SE3', 'SE4', 'SE5', 'SE6', 'SE8', 'SE9', 'SE10', 'SE22'];

// Template cho cấu trúc mới
const createNewStructure = (trainName) => {
  return {
    "train_fares": [
      {
        "origin": "HÀ NỘI",
        "destination": "VINH",
        "fares": {
          "seating": [
            {
              "car_number": 1,
              "rows": [
                {"row_numbers": [1, 2], "price": 373000},
                {"row_numbers": [3, 4], "price": 387000},
                {"row_numbers": [5, 6], "price": 401000},
                {"row_numbers": [7, 8], "price": 416000},
                {"row_numbers": [9, 10], "price": 430000},
                {"row_numbers": [11, 12], "price": 444000},
                {"row_numbers": [13, 14], "price": 459000},
                {"row_numbers": [15, 16], "price": 473000},
                {"row_numbers": [17, 18], "price": 488000},
                {"row_numbers": [19, 20], "price": 502000},
                {"row_numbers": [21, 22], "price": 516000},
                {"row_numbers": [23, 24], "price": 530000},
                {"row_numbers": [25, 26], "price": 544000},
                {"row_numbers": [27, 28], "price": 558000}
              ]
            },
            {
              "car_number": 2,
              "rows": [
                {"row_numbers": [1, 2], "price": 572000},
                {"row_numbers": [3, 4], "price": 586000},
                {"row_numbers": [5, 6], "price": 600000},
                {"row_numbers": [7, 8], "price": 614000},
                {"row_numbers": [9, 10], "price": 628000},
                {"row_numbers": [11, 12], "price": 642000},
                {"row_numbers": [13, 14], "price": 656000},
                {"row_numbers": [15, 16], "price": 670000},
                {"row_numbers": [17, 18], "price": 684000},
                {"row_numbers": [19, 20], "price": 698000},
                {"row_numbers": [21, 22], "price": 712000},
                {"row_numbers": [23, 24], "price": 726000},
                {"row_numbers": [25, 26], "price": 740000},
                {"row_numbers": [27, 28], "price": 754000}
              ]
            }
          ],
          "sleeper_6_berth": [
            {
              "car_number": 3,
              "rows": [
                {"row_numbers": [1, 2, 3, 4, 5, 6], "price": 642000},
                {"row_numbers": [7, 8, 9, 10, 11, 12], "price": 647000},
                {"row_numbers": [13, 14, 15, 16, 17, 18], "price": 652000},
                {"row_numbers": [19, 20, 21, 22, 23, 24], "price": 657000},
                {"row_numbers": [25, 26, 27, 28, 29, 30], "price": 662000},
                {"row_numbers": [31, 32, 33, 34, 35, 36], "price": 667000},
                {"row_numbers": [37, 38, 39, 40, 41, 42], "price": 672000}
              ]
            },
            {
              "car_number": 4,
              "rows": [
                {"row_numbers": [1, 2, 3, 4, 5, 6], "price": 677000},
                {"row_numbers": [7, 8, 9, 10, 11, 12], "price": 682000},
                {"row_numbers": [13, 14, 15, 16, 17, 18], "price": 687000},
                {"row_numbers": [19, 20, 21, 22, 23, 24], "price": 692000},
                {"row_numbers": [25, 26, 27, 28, 29, 30], "price": 697000},
                {"row_numbers": [31, 32, 33, 34, 35, 36], "price": 702000},
                {"row_numbers": [37, 38, 39, 40, 41, 42], "price": 707000}
              ]
            },
            {
              "car_number": 5,
              "rows": [
                {"row_numbers": [1, 2, 3, 4, 5, 6], "price": 712000},
                {"row_numbers": [7, 8, 9, 10, 11, 12], "price": 717000},
                {"row_numbers": [13, 14, 15, 16, 17, 18], "price": 722000},
                {"row_numbers": [19, 20, 21, 22, 23, 24], "price": 727000},
                {"row_numbers": [25, 26, 27, 28, 29, 30], "price": 732000},
                {"row_numbers": [31, 32, 33, 34, 35, 36], "price": 737000},
                {"row_numbers": [37, 38, 39, 40, 41, 42], "price": 742000}
              ]
            }
          ],
          "sleeper_4_berth": [
            {
              "car_number": 6,
              "rows": [
                {"row_numbers": [1, 2, 3, 4], "price": 872000},
                {"row_numbers": [5, 6, 7, 8], "price": 874000},
                {"row_numbers": [9, 10, 11, 12], "price": 877000},
                {"row_numbers": [13, 14, 15, 16], "price": 880000},
                {"row_numbers": [17, 18, 19, 20], "price": 883000},
                {"row_numbers": [21, 22, 23, 24], "price": 886000},
                {"row_numbers": [25, 26, 27, 28], "price": 890000}
              ]
            },
            {
              "car_number": 7,
              "rows": [
                {"row_numbers": [1, 2, 3, 4], "price": 893000},
                {"row_numbers": [5, 6, 7, 8], "price": 897000},
                {"row_numbers": [9, 10, 11, 12], "price": 901000},
                {"row_numbers": [13, 14, 15, 16], "price": 905000},
                {"row_numbers": [17, 18, 19, 20], "price": 909000},
                {"row_numbers": [21, 22, 23, 24], "price": 914000},
                {"row_numbers": [25, 26, 27, 28], "price": 918000}
              ]
            },
            {
              "car_number": 8,
              "rows": [
                {"row_numbers": [1, 2, 3, 4], "price": 922000},
                {"row_numbers": [5, 6, 7, 8], "price": 926000},
                {"row_numbers": [9, 10, 11, 12], "price": 931000},
                {"row_numbers": [13, 14, 15, 16], "price": 935000},
                {"row_numbers": [17, 18, 19, 20], "price": 939000},
                {"row_numbers": [21, 22, 23, 24], "price": 943000},
                {"row_numbers": [25, 26, 27, 28], "price": 947000}
              ]
            },
            {
              "car_number": 9,
              "rows": [
                {"row_numbers": [1, 2, 3, 4], "price": 950000},
                {"row_numbers": [5, 6, 7, 8], "price": 954000},
                {"row_numbers": [9, 10, 11, 12], "price": 957000},
                {"row_numbers": [13, 14, 15, 16], "price": 960000},
                {"row_numbers": [17, 18, 19, 20], "price": 963000},
                {"row_numbers": [21, 22, 23, 24], "price": 966000},
                {"row_numbers": [25, 26, 27, 28], "price": 968000}
              ]
            },
            {
              "car_number": 10,
              "rows": [
                {"row_numbers": [1, 2, 3, 4], "price": 970000},
                {"row_numbers": [5, 6, 7, 8], "price": 972000},
                {"row_numbers": [9, 10, 11, 12], "price": 973000},
                {"row_numbers": [13, 14, 15, 16], "price": 975000},
                {"row_numbers": [17, 18, 19, 20], "price": 976000},
                {"row_numbers": [21, 22, 23, 24], "price": 977000},
                {"row_numbers": [25, 26, 27, 28], "price": 978000}
              ]
            }
          ]
        }
      },
      {
        "origin": "HÀ NỘI",
        "destination": "ĐÀ NẴNG",
        "fares": {
          "seating": [
            {
              "car_number": 1,
              "rows": [
                {"row_numbers": [1, 2], "price": 564000},
                {"row_numbers": [3, 4], "price": 586000},
                {"row_numbers": [5, 6], "price": 607000},
                {"row_numbers": [7, 8], "price": 629000},
                {"row_numbers": [9, 10], "price": 651000},
                {"row_numbers": [11, 12], "price": 672000},
                {"row_numbers": [13, 14], "price": 694000},
                {"row_numbers": [15, 16], "price": 716000},
                {"row_numbers": [17, 18], "price": 738000},
                {"row_numbers": [19, 20], "price": 759000},
                {"row_numbers": [21, 22], "price": 781000},
                {"row_numbers": [23, 24], "price": 803000},
                {"row_numbers": [25, 26], "price": 824000},
                {"row_numbers": [27, 28], "price": 846000}
              ]
            },
            {
              "car_number": 2,
              "rows": [
                {"row_numbers": [1, 2], "price": 868000},
                {"row_numbers": [3, 4], "price": 890000},
                {"row_numbers": [5, 6], "price": 912000},
                {"row_numbers": [7, 8], "price": 934000},
                {"row_numbers": [9, 10], "price": 956000},
                {"row_numbers": [11, 12], "price": 978000},
                {"row_numbers": [13, 14], "price": 1000000},
                {"row_numbers": [15, 16], "price": 1022000},
                {"row_numbers": [17, 18], "price": 1044000},
                {"row_numbers": [19, 20], "price": 1066000},
                {"row_numbers": [21, 22], "price": 1088000},
                {"row_numbers": [23, 24], "price": 1110000},
                {"row_numbers": [25, 26], "price": 1132000},
                {"row_numbers": [27, 28], "price": 1154000}
              ]
            }
          ],
          "sleeper_6_berth": [
            {
              "car_number": 3,
              "rows": [
                {"row_numbers": [1, 2, 3, 4, 5, 6], "price": 907000},
                {"row_numbers": [7, 8, 9, 10, 11, 12], "price": 914000},
                {"row_numbers": [13, 14, 15, 16, 17, 18], "price": 921000},
                {"row_numbers": [19, 20, 21, 22, 23, 24], "price": 928000},
                {"row_numbers": [25, 26, 27, 28, 29, 30], "price": 935000},
                {"row_numbers": [31, 32, 33, 34, 35, 36], "price": 942000},
                {"row_numbers": [37, 38, 39, 40, 41, 42], "price": 949000}
              ]
            },
            {
              "car_number": 4,
              "rows": [
                {"row_numbers": [1, 2, 3, 4, 5, 6], "price": 956000},
                {"row_numbers": [7, 8, 9, 10, 11, 12], "price": 963000},
                {"row_numbers": [13, 14, 15, 16, 17, 18], "price": 970000},
                {"row_numbers": [19, 20, 21, 22, 23, 24], "price": 977000},
                {"row_numbers": [25, 26, 27, 28, 29, 30], "price": 984000},
                {"row_numbers": [31, 32, 33, 34, 35, 36], "price": 991000},
                {"row_numbers": [37, 38, 39, 40, 41, 42], "price": 998000}
              ]
            },
            {
              "car_number": 5,
              "rows": [
                {"row_numbers": [1, 2, 3, 4, 5, 6], "price": 1005000},
                {"row_numbers": [7, 8, 9, 10, 11, 12], "price": 1012000},
                {"row_numbers": [13, 14, 15, 16, 17, 18], "price": 1019000},
                {"row_numbers": [19, 20, 21, 22, 23, 24], "price": 1026000},
                {"row_numbers": [25, 26, 27, 28, 29, 30], "price": 1033000},
                {"row_numbers": [31, 32, 33, 34, 35, 36], "price": 1040000},
                {"row_numbers": [37, 38, 39, 40, 41, 42], "price": 1047000}
              ]
            }
          ],
          "sleeper_4_berth": [
            {
              "car_number": 6,
              "rows": [
                {"row_numbers": [1, 2, 3, 4], "price": 1241000},
                {"row_numbers": [5, 6, 7, 8], "price": 1244000},
                {"row_numbers": [9, 10, 11, 12], "price": 1247000},
                {"row_numbers": [13, 14, 15, 16], "price": 1250000},
                {"row_numbers": [17, 18, 19, 20], "price": 1254000},
                {"row_numbers": [21, 22, 23, 24], "price": 1258000},
                {"row_numbers": [25, 26, 27, 28], "price": 1262000}
              ]
            },
            {
              "car_number": 7,
              "rows": [
                {"row_numbers": [1, 2, 3, 4], "price": 1267000},
                {"row_numbers": [5, 6, 7, 8], "price": 1272000},
                {"row_numbers": [9, 10, 11, 12], "price": 1277000},
                {"row_numbers": [13, 14, 15, 16], "price": 1282000},
                {"row_numbers": [17, 18, 19, 20], "price": 1287000},
                {"row_numbers": [21, 22, 23, 24], "price": 1292000},
                {"row_numbers": [25, 26, 27, 28], "price": 1297000}
              ]
            },
            {
              "car_number": 8,
              "rows": [
                {"row_numbers": [1, 2, 3, 4], "price": 1303000},
                {"row_numbers": [5, 6, 7, 8], "price": 1308000},
                {"row_numbers": [9, 10, 11, 12], "price": 1313000},
                {"row_numbers": [13, 14, 15, 16], "price": 1318000},
                {"row_numbers": [17, 18, 19, 20], "price": 1323000},
                {"row_numbers": [21, 22, 23, 24], "price": 1328000},
                {"row_numbers": [25, 26, 27, 28], "price": 1333000}
              ]
            },
            {
              "car_number": 9,
              "rows": [
                {"row_numbers": [1, 2, 3, 4], "price": 1338000},
                {"row_numbers": [5, 6, 7, 8], "price": 1342000},
                {"row_numbers": [9, 10, 11, 12], "price": 1346000},
                {"row_numbers": [13, 14, 15, 16], "price": 1350000},
                {"row_numbers": [17, 18, 19, 20], "price": 1353000},
                {"row_numbers": [21, 22, 23, 24], "price": 1356000},
                {"row_numbers": [25, 26, 27, 28], "price": 1359000}
              ]
            },
            {
              "car_number": 10,
              "rows": [
                {"row_numbers": [1, 2, 3, 4], "price": 1362000},
                {"row_numbers": [5, 6, 7, 8], "price": 1364000},
                {"row_numbers": [9, 10, 11, 12], "price": 1366000},
                {"row_numbers": [13, 14, 15, 16], "price": 1367000},
                {"row_numbers": [17, 18, 19, 20], "price": 1368000},
                {"row_numbers": [21, 22, 23, 24], "price": 1369000},
                {"row_numbers": [25, 26, 27, 28], "price": 1370000}
              ]
            }
          ]
        }
      }
    ]
  };
};

// Chuyển đổi từng file
trains.forEach(train => {
  const filePath = path.join(__dirname, 'public', 'data', `${train}.json`);
  const newStructure = createNewStructure(train);
  
  try {
    fs.writeFileSync(filePath, JSON.stringify(newStructure, null, 2));
    console.log(`✅ Đã chuyển đổi ${train}.json thành công`);
  } catch (error) {
    console.error(`❌ Lỗi khi chuyển đổi ${train}.json:`, error.message);
  }
});

console.log('🎉 Hoàn thành chuyển đổi tất cả các file JSON!'); 