// Dữ liệu giá ghế đầy đủ cho tất cả các tàu
import type { SeatPricing } from './seatPricing';

// SE1: Hà Nội → Sài Gòn
export const SE1_COMPLETE_PRICING: SeatPricing = {
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
          },
          // Soft seat car
          {
            car_number: 2,
            rows: [
              { row_numbers: [1, 2], price: 663000 },
              { row_numbers: [3, 4], price: 668000 },
              { row_numbers: [5, 6], price: 673000 },
              { row_numbers: [7, 8], price: 678000 },
              { row_numbers: [9, 10], price: 683000 },
              { row_numbers: [11, 12], price: 688000 },
              { row_numbers: [13, 14], price: 693000 },
              { row_numbers: [15, 16], price: 698000 },
              { row_numbers: [17, 18], price: 703000 },
              { row_numbers: [19, 20], price: 708000 },
              { row_numbers: [21, 22], price: 713000 },
              { row_numbers: [23, 24], price: 718000 }
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

// SE2: Sài Gòn → Hà Nội
export const SE2_COMPLETE_PRICING: SeatPricing = {
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
          },
          {
            car_number: 2,
            rows: [
              { row_numbers: [1, 2], price: 663000 },
              { row_numbers: [3, 4], price: 668000 },
              { row_numbers: [5, 6], price: 673000 },
              { row_numbers: [7, 8], price: 678000 },
              { row_numbers: [9, 10], price: 683000 },
              { row_numbers: [11, 12], price: 688000 },
              { row_numbers: [13, 14], price: 693000 },
              { row_numbers: [15, 16], price: 698000 },
              { row_numbers: [17, 18], price: 703000 },
              { row_numbers: [19, 20], price: 708000 },
              { row_numbers: [21, 22], price: 713000 },
              { row_numbers: [23, 24], price: 718000 }
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

// SE3: Hà Nội → Sài Gòn
export const SE3_COMPLETE_PRICING: SeatPricing = {
  trainId: 'SE3',
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
          },
          {
            car_number: 2,
            rows: [
              { row_numbers: [1, 2], price: 663000 },
              { row_numbers: [3, 4], price: 668000 },
              { row_numbers: [5, 6], price: 673000 },
              { row_numbers: [7, 8], price: 678000 },
              { row_numbers: [9, 10], price: 683000 },
              { row_numbers: [11, 12], price: 688000 },
              { row_numbers: [13, 14], price: 693000 },
              { row_numbers: [15, 16], price: 698000 },
              { row_numbers: [17, 18], price: 703000 },
              { row_numbers: [19, 20], price: 708000 },
              { row_numbers: [21, 22], price: 713000 },
              { row_numbers: [23, 24], price: 718000 }
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

// SE4: Sài Gòn → Hà Nội
export const SE4_COMPLETE_PRICING: SeatPricing = {
  trainId: 'SE4',
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
          },
          {
            car_number: 2,
            rows: [
              { row_numbers: [1, 2], price: 663000 },
              { row_numbers: [3, 4], price: 668000 },
              { row_numbers: [5, 6], price: 673000 },
              { row_numbers: [7, 8], price: 678000 },
              { row_numbers: [9, 10], price: 683000 },
              { row_numbers: [11, 12], price: 688000 },
              { row_numbers: [13, 14], price: 693000 },
              { row_numbers: [15, 16], price: 698000 },
              { row_numbers: [17, 18], price: 703000 },
              { row_numbers: [19, 20], price: 708000 },
              { row_numbers: [21, 22], price: 713000 },
              { row_numbers: [23, 24], price: 718000 }
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

// SE5: Hà Nội → Đà Nẵng
export const SE5_COMPLETE_PRICING: SeatPricing = {
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
          },
          {
            car_number: 2,
            rows: [
              { row_numbers: [1, 2], price: 421000 },
              { row_numbers: [3, 4], price: 426000 },
              { row_numbers: [5, 6], price: 431000 },
              { row_numbers: [7, 8], price: 436000 },
              { row_numbers: [9, 10], price: 441000 },
              { row_numbers: [11, 12], price: 446000 },
              { row_numbers: [13, 14], price: 451000 },
              { row_numbers: [15, 16], price: 456000 },
              { row_numbers: [17, 18], price: 461000 },
              { row_numbers: [19, 20], price: 466000 },
              { row_numbers: [21, 22], price: 471000 },
              { row_numbers: [23, 24], price: 476000 }
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

// SE6: Đà Nẵng → Hà Nội
export const SE6_COMPLETE_PRICING: SeatPricing = {
  trainId: 'SE6',
  routes: [
    {
      origin: 'Đà Nẵng',
      destination: 'Hà Nội',
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
          },
          {
            car_number: 2,
            rows: [
              { row_numbers: [1, 2], price: 421000 },
              { row_numbers: [3, 4], price: 426000 },
              { row_numbers: [5, 6], price: 431000 },
              { row_numbers: [7, 8], price: 436000 },
              { row_numbers: [9, 10], price: 441000 },
              { row_numbers: [11, 12], price: 446000 },
              { row_numbers: [13, 14], price: 451000 },
              { row_numbers: [15, 16], price: 456000 },
              { row_numbers: [17, 18], price: 461000 },
              { row_numbers: [19, 20], price: 466000 },
              { row_numbers: [21, 22], price: 471000 },
              { row_numbers: [23, 24], price: 476000 }
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

// SE7: Đà Nẵng → Sài Gòn
export const SE7_COMPLETE_PRICING: SeatPricing = {
  trainId: 'SE7',
  routes: [
    {
      origin: 'Đà Nẵng',
      destination: 'Sài Gòn',
      fares: {
        seating: [
          {
            car_number: 1,
            rows: [
              { row_numbers: [1, 2], price: 368000 },
              { row_numbers: [3, 4], price: 373000 },
              { row_numbers: [5, 6], price: 378000 },
              { row_numbers: [7, 8], price: 383000 },
              { row_numbers: [9, 10], price: 388000 },
              { row_numbers: [11, 12], price: 393000 },
              { row_numbers: [13, 14], price: 398000 },
              { row_numbers: [15, 16], price: 403000 },
              { row_numbers: [17, 18], price: 408000 },
              { row_numbers: [19, 20], price: 413000 },
              { row_numbers: [21, 22], price: 418000 },
              { row_numbers: [23, 24], price: 423000 },
              { row_numbers: [25, 26], price: 428000 },
              { row_numbers: [27, 28], price: 433000 }
            ]
          },
          {
            car_number: 2,
            rows: [
              { row_numbers: [1, 2], price: 442000 },
              { row_numbers: [3, 4], price: 447000 },
              { row_numbers: [5, 6], price: 452000 },
              { row_numbers: [7, 8], price: 457000 },
              { row_numbers: [9, 10], price: 462000 },
              { row_numbers: [11, 12], price: 467000 },
              { row_numbers: [13, 14], price: 472000 },
              { row_numbers: [15, 16], price: 477000 },
              { row_numbers: [17, 18], price: 482000 },
              { row_numbers: [19, 20], price: 487000 },
              { row_numbers: [21, 22], price: 492000 },
              { row_numbers: [23, 24], price: 497000 }
            ]
          }
        ],
        sleeper_6_berth: [
          {
            car_number: 3,
            rows: [
              { row_numbers: [1, 2, 3, 4, 5, 6], price: 516000 },
              { row_numbers: [7, 8, 9, 10, 11, 12], price: 521000 },
              { row_numbers: [13, 14, 15, 16, 17, 18], price: 526000 },
              { row_numbers: [19, 20, 21, 22, 23, 24], price: 531000 },
              { row_numbers: [25, 26, 27, 28, 29, 30], price: 536000 },
              { row_numbers: [31, 32, 33, 34, 35, 36], price: 541000 }
            ]
          }
        ],
        sleeper_4_berth: [
          {
            car_number: 4,
            rows: [
              { row_numbers: [1, 2, 3, 4], price: 738000 },
              { row_numbers: [5, 6, 7, 8], price: 743000 },
              { row_numbers: [9, 10, 11, 12], price: 748000 },
              { row_numbers: [13, 14, 15, 16], price: 753000 },
              { row_numbers: [17, 18, 19, 20], price: 758000 },
              { row_numbers: [21, 22, 23, 24], price: 763000 }
            ]
          }
        ]
      }
    }
  ]
};

// SE8: Sài Gòn → Đà Nẵng
export const SE8_COMPLETE_PRICING: SeatPricing = {
  trainId: 'SE8',
  routes: [
    {
      origin: 'Sài Gòn',
      destination: 'Đà Nẵng',
      fares: {
        seating: [
          {
            car_number: 1,
            rows: [
              { row_numbers: [1, 2], price: 368000 },
              { row_numbers: [3, 4], price: 373000 },
              { row_numbers: [5, 6], price: 378000 },
              { row_numbers: [7, 8], price: 383000 },
              { row_numbers: [9, 10], price: 388000 },
              { row_numbers: [11, 12], price: 393000 },
              { row_numbers: [13, 14], price: 398000 },
              { row_numbers: [15, 16], price: 403000 },
              { row_numbers: [17, 18], price: 408000 },
              { row_numbers: [19, 20], price: 413000 },
              { row_numbers: [21, 22], price: 418000 },
              { row_numbers: [23, 24], price: 423000 },
              { row_numbers: [25, 26], price: 428000 },
              { row_numbers: [27, 28], price: 433000 }
            ]
          },
          {
            car_number: 2,
            rows: [
              { row_numbers: [1, 2], price: 442000 },
              { row_numbers: [3, 4], price: 447000 },
              { row_numbers: [5, 6], price: 452000 },
              { row_numbers: [7, 8], price: 457000 },
              { row_numbers: [9, 10], price: 462000 },
              { row_numbers: [11, 12], price: 467000 },
              { row_numbers: [13, 14], price: 472000 },
              { row_numbers: [15, 16], price: 477000 },
              { row_numbers: [17, 18], price: 482000 },
              { row_numbers: [19, 20], price: 487000 },
              { row_numbers: [21, 22], price: 492000 },
              { row_numbers: [23, 24], price: 497000 }
            ]
          }
        ],
        sleeper_6_berth: [
          {
            car_number: 3,
            rows: [
              { row_numbers: [1, 2, 3, 4, 5, 6], price: 516000 },
              { row_numbers: [7, 8, 9, 10, 11, 12], price: 521000 },
              { row_numbers: [13, 14, 15, 16, 17, 18], price: 526000 },
              { row_numbers: [19, 20, 21, 22, 23, 24], price: 531000 },
              { row_numbers: [25, 26, 27, 28, 29, 30], price: 536000 },
              { row_numbers: [31, 32, 33, 34, 35, 36], price: 541000 }
            ]
          }
        ],
        sleeper_4_berth: [
          {
            car_number: 4,
            rows: [
              { row_numbers: [1, 2, 3, 4], price: 738000 },
              { row_numbers: [5, 6, 7, 8], price: 743000 },
              { row_numbers: [9, 10, 11, 12], price: 748000 },
              { row_numbers: [13, 14, 15, 16], price: 753000 },
              { row_numbers: [17, 18, 19, 20], price: 758000 },
              { row_numbers: [21, 22, 23, 24], price: 763000 }
            ]
          }
        ]
      }
    }
  ]
};

// SE9: Hà Nội → Nha Trang
export const SE9_COMPLETE_PRICING: SeatPricing = {
  trainId: 'SE9',
  routes: [
    {
      origin: 'Hà Nội',
      destination: 'Nha Trang',
      fares: {
        seating: [
          {
            car_number: 1,
            rows: [
              { row_numbers: [1, 2], price: 503000 },
              { row_numbers: [3, 4], price: 508000 },
              { row_numbers: [5, 6], price: 513000 },
              { row_numbers: [7, 8], price: 518000 },
              { row_numbers: [9, 10], price: 523000 },
              { row_numbers: [11, 12], price: 528000 },
              { row_numbers: [13, 14], price: 533000 },
              { row_numbers: [15, 16], price: 538000 },
              { row_numbers: [17, 18], price: 543000 },
              { row_numbers: [19, 20], price: 548000 },
              { row_numbers: [21, 22], price: 553000 },
              { row_numbers: [23, 24], price: 558000 },
              { row_numbers: [25, 26], price: 563000 },
              { row_numbers: [27, 28], price: 568000 }
            ]
          },
          {
            car_number: 2,
            rows: [
              { row_numbers: [1, 2], price: 603000 },
              { row_numbers: [3, 4], price: 608000 },
              { row_numbers: [5, 6], price: 613000 },
              { row_numbers: [7, 8], price: 618000 },
              { row_numbers: [9, 10], price: 623000 },
              { row_numbers: [11, 12], price: 628000 },
              { row_numbers: [13, 14], price: 633000 },
              { row_numbers: [15, 16], price: 638000 },
              { row_numbers: [17, 18], price: 643000 },
              { row_numbers: [19, 20], price: 648000 },
              { row_numbers: [21, 22], price: 653000 },
              { row_numbers: [23, 24], price: 658000 }
            ]
          }
        ],
        sleeper_6_berth: [
          {
            car_number: 3,
            rows: [
              { row_numbers: [1, 2, 3, 4, 5, 6], price: 703000 },
              { row_numbers: [7, 8, 9, 10, 11, 12], price: 708000 },
              { row_numbers: [13, 14, 15, 16, 17, 18], price: 713000 },
              { row_numbers: [19, 20, 21, 22, 23, 24], price: 718000 },
              { row_numbers: [25, 26, 27, 28, 29, 30], price: 723000 },
              { row_numbers: [31, 32, 33, 34, 35, 36], price: 728000 }
            ]
          }
        ],
        sleeper_4_berth: [
          {
            car_number: 4,
            rows: [
              { row_numbers: [1, 2, 3, 4], price: 1003000 },
              { row_numbers: [5, 6, 7, 8], price: 1008000 },
              { row_numbers: [9, 10, 11, 12], price: 1013000 },
              { row_numbers: [13, 14, 15, 16], price: 1018000 },
              { row_numbers: [17, 18, 19, 20], price: 1023000 },
              { row_numbers: [21, 22, 23, 24], price: 1028000 }
            ]
          }
        ]
      }
    }
  ]
};

// SE10: Nha Trang → Hà Nội
export const SE10_COMPLETE_PRICING: SeatPricing = {
  trainId: 'SE10',
  routes: [
    {
      origin: 'Nha Trang',
      destination: 'Hà Nội',
      fares: {
        seating: [
          {
            car_number: 1,
            rows: [
              { row_numbers: [1, 2], price: 503000 },
              { row_numbers: [3, 4], price: 508000 },
              { row_numbers: [5, 6], price: 513000 },
              { row_numbers: [7, 8], price: 518000 },
              { row_numbers: [9, 10], price: 523000 },
              { row_numbers: [11, 12], price: 528000 },
              { row_numbers: [13, 14], price: 533000 },
              { row_numbers: [15, 16], price: 538000 },
              { row_numbers: [17, 18], price: 543000 },
              { row_numbers: [19, 20], price: 548000 },
              { row_numbers: [21, 22], price: 553000 },
              { row_numbers: [23, 24], price: 558000 },
              { row_numbers: [25, 26], price: 563000 },
              { row_numbers: [27, 28], price: 568000 }
            ]
          },
          {
            car_number: 2,
            rows: [
              { row_numbers: [1, 2], price: 603000 },
              { row_numbers: [3, 4], price: 608000 },
              { row_numbers: [5, 6], price: 613000 },
              { row_numbers: [7, 8], price: 618000 },
              { row_numbers: [9, 10], price: 623000 },
              { row_numbers: [11, 12], price: 628000 },
              { row_numbers: [13, 14], price: 633000 },
              { row_numbers: [15, 16], price: 638000 },
              { row_numbers: [17, 18], price: 643000 },
              { row_numbers: [19, 20], price: 648000 },
              { row_numbers: [21, 22], price: 653000 },
              { row_numbers: [23, 24], price: 658000 }
            ]
          }
        ],
        sleeper_6_berth: [
          {
            car_number: 3,
            rows: [
              { row_numbers: [1, 2, 3, 4, 5, 6], price: 703000 },
              { row_numbers: [7, 8, 9, 10, 11, 12], price: 708000 },
              { row_numbers: [13, 14, 15, 16, 17, 18], price: 713000 },
              { row_numbers: [19, 20, 21, 22, 23, 24], price: 718000 },
              { row_numbers: [25, 26, 27, 28, 29, 30], price: 723000 },
              { row_numbers: [31, 32, 33, 34, 35, 36], price: 728000 }
            ]
          }
        ],
        sleeper_4_berth: [
          {
            car_number: 4,
            rows: [
              { row_numbers: [1, 2, 3, 4], price: 1003000 },
              { row_numbers: [5, 6, 7, 8], price: 1008000 },
              { row_numbers: [9, 10, 11, 12], price: 1013000 },
              { row_numbers: [13, 14, 15, 16], price: 1018000 },
              { row_numbers: [17, 18, 19, 20], price: 1023000 },
              { row_numbers: [21, 22, 23, 24], price: 1028000 }
            ]
          }
        ]
      }
    }
  ]
};

// SE22: Vinh → Sài Gòn
export const SE22_COMPLETE_PRICING: SeatPricing = {
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
          },
          {
            car_number: 2,
            rows: [
              { row_numbers: [1, 2], price: 576000 },
              { row_numbers: [3, 4], price: 581000 },
              { row_numbers: [5, 6], price: 586000 },
              { row_numbers: [7, 8], price: 591000 },
              { row_numbers: [9, 10], price: 596000 },
              { row_numbers: [11, 12], price: 601000 },
              { row_numbers: [13, 14], price: 606000 },
              { row_numbers: [15, 16], price: 611000 },
              { row_numbers: [17, 18], price: 616000 },
              { row_numbers: [19, 20], price: 621000 },
              { row_numbers: [21, 22], price: 626000 },
              { row_numbers: [23, 24], price: 631000 }
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

// Collection của tất cả pricing data
export const ALL_TRAIN_PRICING_DATA = [
  SE1_COMPLETE_PRICING,
  SE2_COMPLETE_PRICING,
  SE3_COMPLETE_PRICING,
  SE4_COMPLETE_PRICING,
  SE5_COMPLETE_PRICING,
  SE6_COMPLETE_PRICING,
  SE7_COMPLETE_PRICING,
  SE8_COMPLETE_PRICING,
  SE9_COMPLETE_PRICING,
  SE10_COMPLETE_PRICING,
  SE22_COMPLETE_PRICING
];

// Utility functions
export function getCompleteSeatPrice(trainId: string, origin: string, destination: string, coachType: string, carNumber: number, row: number): number {
  const trainPricing = ALL_TRAIN_PRICING_DATA.find(t => t.trainId === trainId);
  if (!trainPricing) return 0;

  const route = trainPricing.routes.find(r => r.origin === origin && r.destination === destination);
  if (!route) return 0;

  let coachPricing: any[] = [];
  switch (coachType) {
    case 'hard_seat':
    case 'seating':
      coachPricing = route.fares.seating || [];
      break;
    case 'sleeper_6_berth':
      coachPricing = route.fares.sleeper_6_berth || [];
      break;
    case 'sleeper_4_berth':
    case 'soft_sleeper':
      coachPricing = route.fares.sleeper_4_berth || [];
      break;
    default:
      return 0;
  }

  const car = coachPricing.find(c => c.car_number === carNumber);
  if (!car) return 0;

  const rowPricing = car.rows.find((r: any) => r.row_numbers.includes(row));
  return rowPricing ? rowPricing.price : 0;
}

export function getAllTrainRoutes(): Array<{trainId: string, origin: string, destination: string}> {
  const routes: Array<{trainId: string, origin: string, destination: string}> = [];
  
  ALL_TRAIN_PRICING_DATA.forEach(train => {
    train.routes.forEach(route => {
      routes.push({
        trainId: train.trainId,
        origin: route.origin,
        destination: route.destination
      });
    });
  });
  
  return routes;
}
