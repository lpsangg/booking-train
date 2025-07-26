// Dữ liệu giá ghế chi tiết cho tàu SE1 (Hà Nội - Sài Gòn)
import type { SeatPricing } from './seatPricing';

export const SE1_PRICING: SeatPricing = {
  trainId: 'SE1',
  routes: [
    {
      origin: 'Hà Nội',
      destination: 'Sài Gòn',
      fares: {
        seating: [
          {
            car_number: 1,
            rows: [
              { row_numbers: [1, 2], price: 553000 },
              { row_numbers: [3, 4], price: 558000 },
              { row_numbers: [5, 6], price: 563000 },
              { row_numbers: [7, 8], price: 568000 },
              { row_numbers: [9, 10], price: 573000 },
              { row_numbers: [11, 12], price: 578000 },
              { row_numbers: [13, 14], price: 583000 },
              { row_numbers: [15, 16], price: 588000 },
              { row_numbers: [17, 18], price: 593000 },
              { row_numbers: [19, 20], price: 598000 },
              { row_numbers: [21, 22], price: 603000 },
              { row_numbers: [23, 24], price: 608000 },
              { row_numbers: [25, 26], price: 613000 },
              { row_numbers: [27, 28], price: 618000 }
            ]
          }
        ],
        sleeper_6_berth: [
          {
            car_number: 3,
            rows: [
              { row_numbers: [1, 2, 3, 4, 5, 6], price: 773000 },
              { row_numbers: [7, 8, 9, 10, 11, 12], price: 778000 },
              { row_numbers: [13, 14, 15, 16, 17, 18], price: 783000 },
              { row_numbers: [19, 20, 21, 22, 23, 24], price: 788000 },
              { row_numbers: [25, 26, 27, 28, 29, 30], price: 793000 },
              { row_numbers: [31, 32, 33, 34, 35, 36], price: 798000 }
            ]
          }
        ],
        sleeper_4_berth: [
          {
            car_number: 4,
            rows: [
              { row_numbers: [1, 2, 3, 4], price: 1103000 },
              { row_numbers: [5, 6, 7, 8], price: 1108000 },
              { row_numbers: [9, 10, 11, 12], price: 1113000 },
              { row_numbers: [13, 14, 15, 16], price: 1118000 },
              { row_numbers: [17, 18, 19, 20], price: 1123000 },
            ]
          }
        ]
      }
    }
  ]
};

// Dữ liệu giá ghế cho tàu SE2 (Sài Gòn - Hà Nội)
export const SE2_PRICING: SeatPricing = {
  trainId: 'SE2',
  routes: [
    {
      origin: 'Sài Gòn',
      destination: 'Hà Nội',
      fares: {
        seating: [
          {
            car_number: 1,
            rows: [
              { row_numbers: [1, 2], price: 553000 },
              { row_numbers: [3, 4], price: 558000 },
              { row_numbers: [5, 6], price: 563000 },
              { row_numbers: [7, 8], price: 568000 },
              { row_numbers: [9, 10], price: 573000 },
              { row_numbers: [11, 12], price: 578000 },
              { row_numbers: [13, 14], price: 583000 },
              { row_numbers: [15, 16], price: 588000 },
              { row_numbers: [17, 18], price: 593000 },
              { row_numbers: [19, 20], price: 598000 },
              { row_numbers: [21, 22], price: 603000 },
              { row_numbers: [23, 24], price: 608000 },
              { row_numbers: [25, 26], price: 613000 },
              { row_numbers: [27, 28], price: 618000 }
            ]
          }
        ],
        sleeper_6_berth: [
          {
            car_number: 3,
            rows: [
              { row_numbers: [1, 2, 3, 4, 5, 6], price: 773000 },
              { row_numbers: [7, 8, 9, 10, 11, 12], price: 778000 },
              { row_numbers: [13, 14, 15, 16, 17, 18], price: 783000 },
              { row_numbers: [19, 20, 21, 22, 23, 24], price: 788000 },
              { row_numbers: [25, 26, 27, 28, 29, 30], price: 793000 },
              { row_numbers: [31, 32, 33, 34, 35, 36], price: 798000 }
            ]
          }
        ],
        sleeper_4_berth: [
          {
            car_number: 4,
            rows: [
              { row_numbers: [1, 2, 3, 4], price: 1103000 },
              { row_numbers: [5, 6, 7, 8], price: 1108000 },
              { row_numbers: [9, 10, 11, 12], price: 1113000 },
              { row_numbers: [13, 14, 15, 16], price: 1118000 },
              { row_numbers: [17, 18, 19, 20], price: 1123000 },
              { row_numbers: [21, 22, 23, 24], price: 1128000 }
            ]
          }
        ]
      }
    }
  ]
};

// Dữ liệu giá ghế cho tàu SE5 (Hà Nội - Đà Nẵng)  
export const SE5_PRICING: SeatPricing = {
  trainId: 'SE5',
  routes: [
    {
      origin: 'Hà Nội',
      destination: 'Đà Nẵng',
      fares: {
        seating: [
          {
            car_number: 1,
            rows: [
              { row_numbers: [1, 2], price: 351000 },
              { row_numbers: [3, 4], price: 356000 },
              { row_numbers: [5, 6], price: 361000 },
              { row_numbers: [7, 8], price: 366000 },
              { row_numbers: [9, 10], price: 371000 },
              { row_numbers: [11, 12], price: 376000 },
              { row_numbers: [13, 14], price: 381000 },
              { row_numbers: [15, 16], price: 386000 },
              { row_numbers: [17, 18], price: 391000 },
              { row_numbers: [19, 20], price: 396000 },
              { row_numbers: [21, 22], price: 401000 },
              { row_numbers: [23, 24], price: 406000 },
              { row_numbers: [25, 26], price: 411000 },
              { row_numbers: [27, 28], price: 416000 }
            ]
          }
        ],
        sleeper_6_berth: [
          {
            car_number: 3,
            rows: [
              { row_numbers: [1, 2, 3, 4, 5, 6], price: 491000 },
              { row_numbers: [7, 8, 9, 10, 11, 12], price: 496000 },
              { row_numbers: [13, 14, 15, 16, 17, 18], price: 501000 },
              { row_numbers: [19, 20, 21, 22, 23, 24], price: 506000 },
              { row_numbers: [25, 26, 27, 28, 29, 30], price: 511000 },
              { row_numbers: [31, 32, 33, 34, 35, 36], price: 516000 }
            ]
          }
        ],
        sleeper_4_berth: [
          {
            car_number: 4,
            rows: [
              { row_numbers: [1, 2, 3, 4], price: 701000 },
              { row_numbers: [5, 6, 7, 8], price: 706000 },
              { row_numbers: [9, 10, 11, 12], price: 711000 },
              { row_numbers: [13, 14, 15, 16], price: 716000 },
              { row_numbers: [17, 18, 19, 20], price: 721000 },
              { row_numbers: [21, 22, 23, 24], price: 726000 }
            ]
          }
        ]
      }
    }
  ]
};

// Dữ liệu giá ghế cho tàu SE22 (Vinh - Sài Gòn)
export const SE22_PRICING: SeatPricing = {
  trainId: 'SE22',
  routes: [
    {
      origin: 'Vinh',
      destination: 'Sài Gòn',
      fares: {
        seating: [
          {
            car_number: 1,
            rows: [
              { row_numbers: [1, 2], price: 480000 },
              { row_numbers: [3, 4], price: 485000 },
              { row_numbers: [5, 6], price: 490000 },
              { row_numbers: [7, 8], price: 495000 },
              { row_numbers: [9, 10], price: 500000 },
              { row_numbers: [11, 12], price: 505000 },
              { row_numbers: [13, 14], price: 510000 },
              { row_numbers: [15, 16], price: 515000 },
              { row_numbers: [17, 18], price: 520000 },
              { row_numbers: [19, 20], price: 525000 },
              { row_numbers: [21, 22], price: 530000 },
              { row_numbers: [23, 24], price: 535000 },
              { row_numbers: [25, 26], price: 540000 },
              { row_numbers: [27, 28], price: 545000 }
            ]
          }
        ],
        sleeper_6_berth: [
          {
            car_number: 3,
            rows: [
              { row_numbers: [1, 2, 3, 4, 5, 6], price: 672000 },
              { row_numbers: [7, 8, 9, 10, 11, 12], price: 677000 },
              { row_numbers: [13, 14, 15, 16, 17, 18], price: 682000 },
              { row_numbers: [19, 20, 21, 22, 23, 24], price: 687000 },
              { row_numbers: [25, 26, 27, 28, 29, 30], price: 692000 },
              { row_numbers: [31, 32, 33, 34, 35, 36], price: 697000 }
            ]
          }
        ],
        sleeper_4_berth: [
          {
            car_number: 4,
            rows: [
              { row_numbers: [1, 2, 3, 4], price: 960000 },
              { row_numbers: [5, 6, 7, 8], price: 965000 },
              { row_numbers: [9, 10, 11, 12], price: 970000 },
              { row_numbers: [13, 14, 15, 16], price: 975000 },
              { row_numbers: [17, 18, 19, 20], price: 980000 },
              { row_numbers: [21, 22, 23, 24], price: 985000 }
            ]
          }
        ]
      }
    }
  ]
};
