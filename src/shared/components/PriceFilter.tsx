import React, { useState, useEffect } from 'react';
import { SEAT_CATEGORIES } from '../constants';

interface Seat {
  id: string;
  price: number;
  status: 'available' | 'occupied' | 'reserved' | 'selected';
  behavior?: 'quiet' | 'social';
}

interface PriceFilterProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  priceData?: number[];
  seats?: Seat[];
  className?: string;
  onApplyFilter?: (filters: any) => void;
  // External state props for synchronization
  selectedRecordTypes?: string[];
  priorityPreference?: string;
  onRecordTypesChange?: (types: string[]) => void;
  onPriorityChange?: (priority: 'all' | 'high_only') => void;
}

interface RecordTypes {
  standard: boolean;
  medium_priority: boolean;
  high_priority: boolean;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
  minPrice,
  maxPrice,
  onPriceChange,
  priceData = [],
  seats = [],
  className = '',
  onApplyFilter,
  selectedRecordTypes: externalRecordTypes,
  priorityPreference: externalPriorityPreference,
  onRecordTypesChange,
  onPriorityChange
}) => {
  // State cho price range filter và histogram
  const [filterMinPrice, setFilterMinPrice] = useState(minPrice);
  const [filterMaxPrice, setFilterMaxPrice] = useState(maxPrice);
  const [leftHandle, setLeftHandle] = useState(0);
  const [rightHandle, setRightHandle] = useState(100);
  const [isDragging, setIsDragging] = useState<string | null>(null);

  // Record Type filters (theo Salesforce style)
  const [recordTypes, setRecordTypes] = useState<RecordTypes>({
    standard: true,
    medium_priority: true,
    high_priority: false
  });

  // Priority Preferences
  const [priorityPreference, setPriorityPreference] = useState('all');

  // Use external state if provided, otherwise use internal state
  const currentPriorityPreference = externalPriorityPreference || priorityPreference;

  // Đồng bộ handles với price values
  useEffect(() => {
    if (maxPrice > minPrice) {
      const leftPercent = ((filterMinPrice - minPrice) / (maxPrice - minPrice)) * 100;
      const rightPercent = ((filterMaxPrice - minPrice) / (maxPrice - minPrice)) * 100;
      setLeftHandle(Math.max(0, Math.min(100, leftPercent)));
      setRightHandle(Math.max(0, Math.min(100, rightPercent)));
    }
  }, [filterMinPrice, filterMaxPrice, minPrice, maxPrice]);

  // Update local state khi props thay đổi
  useEffect(() => {
    setFilterMinPrice(minPrice);
    setFilterMaxPrice(maxPrice);
  }, [minPrice, maxPrice]);

  // Handle mouse down cho slider
  const handleMouseDown = (handle: string) => {
    setIsDragging(handle);
  };

  // Handle mouse move - cải thiện độ nhạy
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

    if (isDragging === 'left') {
      const newLeft = Math.min(percentage, rightHandle - 0.5); // Giảm khoảng cách tối thiểu
      setLeftHandle(newLeft);
      const newPrice = minPrice + (newLeft / 100) * (maxPrice - minPrice);
      const roundedPrice = Math.round(newPrice);
      setFilterMinPrice(roundedPrice);
      onPriceChange(roundedPrice, filterMaxPrice);
    } else if (isDragging === 'right') {
      const newRight = Math.max(percentage, leftHandle + 0.5); // Giảm khoảng cách tối thiểu
      setRightHandle(newRight);
      const newPrice = minPrice + (newRight / 100) * (maxPrice - minPrice);
      const roundedPrice = Math.round(newPrice);
      setFilterMaxPrice(roundedPrice);
      onPriceChange(filterMinPrice, roundedPrice);
    }
  };

  // Handle click trực tiếp trên slider để nhảy đến vị trí đó
  const handleSliderClick = (e: React.MouseEvent) => {
    if (isDragging) return; // Không xử lý khi đang drag
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    // Tìm handle gần nhất để di chuyển
    const distanceToLeft = Math.abs(percentage - leftHandle);
    const distanceToRight = Math.abs(percentage - rightHandle);
    
    if (distanceToLeft <= distanceToRight) {
      // Di chuyển left handle
      const newLeft = Math.min(percentage, rightHandle - 0.5);
      setLeftHandle(newLeft);
      const newPrice = minPrice + (newLeft / 100) * (maxPrice - minPrice);
      const roundedPrice = Math.round(newPrice);
      setFilterMinPrice(roundedPrice);
      onPriceChange(roundedPrice, filterMaxPrice);
    } else {
      // Di chuyển right handle
      const newRight = Math.max(percentage, leftHandle + 0.5);
      setRightHandle(newRight);
      const newPrice = minPrice + (newRight / 100) * (maxPrice - minPrice);
      const roundedPrice = Math.round(newPrice);
      setFilterMaxPrice(roundedPrice);
      onPriceChange(filterMinPrice, roundedPrice);
    }
  };

  // Touch support cho mobile - cải thiện độ nhạy
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

    if (isDragging === 'left') {
      const newLeft = Math.min(percentage, rightHandle - 0.5); // Giảm khoảng cách tối thiểu
      setLeftHandle(newLeft);
      const newPrice = minPrice + (newLeft / 100) * (maxPrice - minPrice);
      const roundedPrice = Math.round(newPrice);
      setFilterMinPrice(roundedPrice);
      onPriceChange(roundedPrice, filterMaxPrice);
    } else if (isDragging === 'right') {
      const newRight = Math.max(percentage, leftHandle + 0.5); // Giảm khoảng cách tối thiểu
      setRightHandle(newRight);
      const newPrice = minPrice + (newRight / 100) * (maxPrice - minPrice);
      const roundedPrice = Math.round(newPrice);
      setFilterMaxPrice(roundedPrice);
      onPriceChange(filterMinPrice, roundedPrice);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  // Hàm tạo histogram cho giá vé với thông tin ghế chi tiết
  const getPriceHistogram = (binCount: number = 18) => {
    // Nếu có dữ liệu seats thực tế, sử dụng chúng
    if (seats && seats.length > 0) {
      const bins = new Array(binCount).fill(0);
      const range = maxPrice - minPrice;
      const binSize = range / binCount;

      // Đếm số ghế trong mỗi bin
      seats.forEach(seat => {
        if (seat.price >= minPrice && seat.price <= maxPrice) {
          const binIndex = Math.min(Math.floor((seat.price - minPrice) / binSize), binCount - 1);
          bins[binIndex]++;
        }
      });

      return bins;
    }

    // Nếu có priceData array
    if (priceData.length > 0) {
      const bins = new Array(binCount).fill(0);
      const range = maxPrice - minPrice;
      const binSize = range / binCount;

      priceData.forEach(price => {
        if (price >= minPrice && price <= maxPrice) {
          const binIndex = Math.min(Math.floor((price - minPrice) / binSize), binCount - 1);
          bins[binIndex]++;
        }
      });

      return bins;
    }

    // Mock data với mật độ ghế thực tế theo giá - phân bố cong tự nhiên
    // Giá thấp: ít ghế, giá trung bình: nhiều ghế, giá cao: ít ghế
    const mockData = [
      3,   // 595-630k: Ngồi cứng
      5,   // 630-665k: Ngồi cứng  
      8,   // 665-700k: Ngồi mềm
      15,  // 700-735k: Ngồi mềm
      22,  // 735-770k: Ngồi mềm
      28,  // 770-805k: Giường nằm cứng
      32,  // 805-840k: Giường nằm cứng
      35,  // 840-875k: Giường nằm cứng (cao nhất)
      30,  // 875-910k: Giường nằm mềm
      25,  // 910-945k: Giường nằm mềm
      20,  // 945-980k: Giường nằm mềm
      15,  // 980-1015k: VIP
      10,  // 1015-1050k: VIP
      8,   // 1050-1085k: VIP
      5,   // 1085-1120k: VIP
      3,   // 1120-1155k: VIP
      2,   // 1155-1190k: VIP
      1    // 1190-1225k: VIP
    ].slice(0, binCount);
    
    return mockData;
  };

  // Hàm lấy thông tin loại ghế theo bin
  const getSeatTypeInfo = (binIndex: number) => {
    const seatTypes = [
      "Ngồi cứng", "Ngồi cứng", "Ngồi mềm", "Ngồi mềm", "Ngồi mềm",
      "Giường nằm cứng", "Giường nằm cứng", "Giường nằm cứng", 
      "Giường nằm mềm", "Giường nằm mềm", "Giường nằm mềm",
      "VIP", "VIP", "VIP", "VIP", "VIP", "VIP", "VIP"
    ];
    return seatTypes[binIndex] || "Không xác định";
  };

  // Hàm tính giá cho từng bin
  const getPriceForBin = (binIndex: number, binCount: number) => {
    const range = maxPrice - minPrice;
    const binSize = range / binCount;
    const startPrice = minPrice + (binIndex * binSize);
    const endPrice = minPrice + ((binIndex + 1) * binSize);
    return {
      start: Math.round(startPrice),
      end: Math.round(endPrice)
    };
  };

  // Handle record type change
  const handleRecordTypeChange = (type: keyof RecordTypes) => {
    console.log('🔄 Record type change clicked:', type);
    console.log('Current external record types:', externalRecordTypes);
    
    if (onRecordTypesChange && externalRecordTypes) {
      // Use external state - convert to array format used by SelectSeat
      const currentTypes = externalRecordTypes;
      const newTypes = currentTypes.includes(type) 
        ? currentTypes.filter(t => t !== type)
        : [...currentTypes, type];
      console.log('Updating external state from', currentTypes, 'to', newTypes);
      onRecordTypesChange(newTypes);
    } else {
      // Use internal state
      console.log('Using internal state, current:', recordTypes);
      setRecordTypes(prev => ({
        ...prev,
        [type]: !prev[type]
      }));
    }
  };

  // Use external or internal record types
  const currentRecordTypes = externalRecordTypes 
    ? {
        standard: externalRecordTypes.includes('standard'),
        medium_priority: externalRecordTypes.includes('medium_priority'), 
        high_priority: externalRecordTypes.includes('high_priority')
      }
    : recordTypes;

  // Apply Record Filter
  const applyRecordFilter = () => {
    const activeFilters = Object.entries(currentRecordTypes)
      .filter(([_, isActive]) => isActive)
      .map(([type]) => type);
    
    const filterData = {
      priceRange: { min: filterMinPrice, max: filterMaxPrice },
      recordTypes: activeFilters,
      priority: currentPriorityPreference
    };
    
    console.log('Applied filters:', filterData);
    
    // Call the callback function if provided
    if (onApplyFilter) {
      onApplyFilter(filterData);
    } else {
      // Fallback alert if no callback provided
      alert(`Filters applied!\nPrice: đ${filterMinPrice.toLocaleString('vi-VN')} - đ${filterMaxPrice.toLocaleString('vi-VN')}\nRecord Types: ${activeFilters.join(', ')}\nPriority: ${currentPriorityPreference}`);
    }
  };

  // CustomCheckbox component  
  const CustomCheckbox = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <label style={{ 
      position: 'relative', 
      display: 'inline-block', 
      width: 24, 
      height: 24, 
      marginRight: 8, 
      cursor: 'pointer',
      flexShrink: 0
    }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          e.stopPropagation();
          console.log('🎯 Checkbox input changed, new checked value:', e.target.checked);
          onChange();
        }}
        style={{ 
          opacity: 0, 
          width: 24, 
          height: 24, 
          position: 'absolute', 
          left: 0, 
          top: 0, 
          margin: 0, 
          zIndex: 2, 
          cursor: 'pointer' 
        }}
      />
      <span
        style={{
          display: 'inline-block',
          width: 24,
          height: 24,
          background: '#fff',
          border: '1.5px solid #bdbdbd',
          borderRadius: 6,
          boxSizing: 'border-box',
          position: 'absolute',
          left: 0,
          top: 0,
          zIndex: 1,
        }}
      >
        {checked && (
          <svg width="18" height="18" viewBox="0 0 18 18" style={{ position: 'absolute', top: 2, left: 3 }}>
            <polyline points="2,10 7,15 16,4" style={{ fill: 'none', stroke: '#1976d2', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' }} />
          </svg>
        )}
      </span>
    </label>
  );

  return (
    <div className={className} style={{ 
      background: '#fff', 
      borderRadius: 12, 
      padding: 20, 
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '1px solid #e0e0e0'
    }}>
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4, color: '#333' }}>
        Salesforce-Style Record Filter
      </div>
      <div style={{ fontSize: 12, color: '#999', marginBottom: 16 }}>
        Price range
      </div>
      <div style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>
        Trip price, includes all fees
      </div>
      
      {/* Histogram bars with enhanced styling */}
      <div style={{ position: 'relative', height: 90, marginBottom: 8 }}>
        {/* Histogram title */}
        <div style={{ 
          fontSize: 11, 
          color: '#666', 
          marginBottom: 8,
          textAlign: 'center',
          fontWeight: 500
        }}>
          Mật độ ghế theo khoảng giá
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'end', 
          justifyContent: 'space-between', 
          height: 75,
          padding: '0 8px',
          background: 'linear-gradient(to bottom, rgba(249,249,249,0.5), transparent)',
          borderRadius: '8px 8px 0 0'
        }}>
          {getPriceHistogram(18).map((count, idx) => {
            const maxCount = Math.max(...getPriceHistogram(18));
            // Tăng chiều cao tối đa lên 70px và đảm bảo sự khác biệt rõ ràng
            const baseHeight = maxCount > 0 ? (count / maxCount) * 70 : 0;
            const height = count > 0 ? Math.max(baseHeight, 6) : 0; // Tối thiểu 6px cho bin có data
            const position = (idx / (getPriceHistogram(18).length - 1)) * 100;
            const isInRange = position >= leftHandle && position <= rightHandle;
            const priceRange = getPriceForBin(idx, 18);
            const seatType = getSeatTypeInfo(idx);
            
            return (
              <div
                key={idx}
                style={{ 
                  width: `${92 / getPriceHistogram(18).length}%`,
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
                title={`${seatType}: ${priceRange.start.toLocaleString()}đ - ${priceRange.end.toLocaleString()}đ (${count} ghế)`}
                onMouseEnter={(e) => {
                  const bar = e.currentTarget.querySelector('.histogram-bar') as HTMLElement;
                  const tooltip = e.currentTarget.querySelector('.histogram-tooltip') as HTMLElement;
                  if (bar) {
                    bar.style.transform = 'scaleY(1.15) scaleX(1.1)';
                    bar.style.filter = 'brightness(1.2)';
                    bar.style.boxShadow = isInRange 
                      ? '0 2px 8px rgba(233, 30, 99, 0.4)' 
                      : '0 2px 8px rgba(0, 0, 0, 0.2)';
                  }
                  if (tooltip) {
                    tooltip.style.opacity = '1';
                    tooltip.style.transform = 'translateY(-5px)';
                  }
                }}
                onMouseLeave={(e) => {
                  const bar = e.currentTarget.querySelector('.histogram-bar') as HTMLElement;
                  const tooltip = e.currentTarget.querySelector('.histogram-tooltip') as HTMLElement;
                  if (bar) {
                    bar.style.transform = 'scaleY(1) scaleX(1)';
                    bar.style.filter = 'brightness(1)';
                    bar.style.boxShadow = isInRange 
                      ? '0 1px 3px rgba(233, 30, 99, 0.3)' 
                      : 'none';
                  }
                  if (tooltip) {
                    tooltip.style.opacity = '0';
                    tooltip.style.transform = 'translateY(0)';
                  }
                }}
              >
                {/* Tooltip */}
                <div 
                  className="histogram-tooltip"
                  style={{
                    position: 'absolute',
                    bottom: '105%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#333',
                    color: 'white',
                    padding: '6px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    whiteSpace: 'nowrap',
                    opacity: 0,
                    transition: 'all 200ms ease',
                    zIndex: 10,
                    pointerEvents: 'none'
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{seatType}</div>
                  <div>{priceRange.start.toLocaleString()}đ - {priceRange.end.toLocaleString()}đ</div>
                  <div>{count} ghế khả dụng</div>
                  {/* Arrow */}
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '4px solid transparent',
                    borderRight: '4px solid transparent',
                    borderTop: '4px solid #333'
                  }} />
                </div>

                {/* Histogram bar */}
                <div
                  className="histogram-bar"
                  style={{
                    width: '80%', // Giảm độ rộng để có khoảng cách
                    height: `${height}px`,
                    background: isInRange 
                      ? count > 20 
                        ? 'linear-gradient(to top, #007aff, #4da3ff, #b3d9ff)' 
                        : count > 10
                          ? 'linear-gradient(to top, #007aff, #4da3ff)'
                          : 'linear-gradient(to top, #007aff, #80c4ff)'
                      : count > 20
                        ? 'linear-gradient(to top, #bdbdbd, #e0e0e0, #f5f5f5)'
                        : count > 10
                          ? 'linear-gradient(to top, #e0e0e0, #f5f5f5)'
                          : 'linear-gradient(to top, #f0f0f0, #fafafa)',
                    borderRadius: '2px 2px 0 0',
                    transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                    transformOrigin: 'bottom',
                    boxShadow: isInRange 
                      ? count > 15 
                        ? '0 2px 4px rgba(0, 122, 255, 0.4)' 
                        : '0 1px 3px rgba(0, 122, 255, 0.3)'
                      : count > 15
                        ? '0 1px 2px rgba(0,0,0,0.1)'
                        : 'none',
                    border: isInRange 
                      ? '1px solid rgba(0, 122, 255, 0.3)' 
                      : '1px solid rgba(224, 224, 224, 0.5)',
                    opacity: count === 0 ? 0.3 : 1,
                    margin: '0 auto' // Căn giữa bar
                  }}
                />
                
                {/* Count label for high density bars */}
                {count > 25 && (
                  <div style={{
                    position: 'absolute',
                    top: `${100 - height - 5}%`,
                    fontSize: '9px',
                    color: isInRange ? '#E91E63' : '#666',
                    fontWeight: 600,
                    textShadow: '0 1px 2px rgba(255,255,255,0.8)'
                  }}>
                    {count}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Price range labels under histogram */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          paddingTop: 4,
          fontSize: 9,
          color: '#999'
        }}>
          <span>{minPrice.toLocaleString()}đ</span>
          <span>{((minPrice + maxPrice) / 2).toLocaleString()}đ</span>
          <span>{maxPrice.toLocaleString()}đ</span>
        </div>
      </div>
      
      {/* Range Slider */}
      <div 
        style={{ 
          position: 'relative', 
          height: 6, // Giảm từ 20 xuống 6 để mỏng hơn
          background: '#e0e0e0', 
          borderRadius: 3, // Giảm border radius cho phù hợp
          cursor: 'pointer',
          marginBottom: 20,
          margin: '0 12px 20px 12px',
          userSelect: 'none'
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        onClick={handleSliderClick}
      >
        {/* Track between handles */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            height: '100%',
            background: 'linear-gradient(to right, #007aff, #4da3ff)',
            borderRadius: 3,
            left: `${leftHandle}%`,
            width: `${rightHandle - leftHandle}%`,
            transition: isDragging ? 'none' : 'all 150ms ease-out' // Giảm thời gian transition
          }}
        />
        
        {/* Left Handle */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            width: 16, // Giảm từ 20 xuống 16
            height: 16, // Giảm từ 20 xuống 16
            background: '#fff',
            border: '2px solid #007aff', // Giảm border từ 3px xuống 2px
            borderRadius: '50%',
            cursor: 'grab',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            transition: isDragging === 'left' ? 'none' : 'all 150ms ease-out',
            left: `${leftHandle}%`,
            zIndex: 2,
            userSelect: 'none'
          }}
          onMouseDown={() => handleMouseDown('left')}
          onTouchStart={() => handleMouseDown('left')}
          onMouseEnter={(e) => {
            if (!isDragging) {
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
              e.currentTarget.style.boxShadow = '0 3px 12px rgba(0, 122, 255, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isDragging) {
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
            }
          }}
        />
        
        {/* Right Handle */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            width: 16, // Giảm từ 20 xuống 16
            height: 16, // Giảm từ 20 xuống 16
            background: '#fff',
            border: '2px solid #007aff', // Giảm border từ 3px xuống 2px
            borderRadius: '50%',
            cursor: 'grab',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            transition: isDragging === 'right' ? 'none' : 'all 150ms ease-out',
            left: `${rightHandle}%`,
            zIndex: 2,
            userSelect: 'none'
          }}
          onMouseDown={() => handleMouseDown('right')}
          onTouchStart={() => handleMouseDown('right')}
          onMouseEnter={(e) => {
            if (!isDragging) {
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
              e.currentTarget.style.boxShadow = '0 3px 12px rgba(0, 122, 255, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isDragging) {
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
            }
          }}
        />
      </div>
      
      {/* Labels dưới slider */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        fontSize: 12, 
        color: '#999', 
        marginBottom: 8,
        padding: '0 12px'
      }}>
        <span>Minimum</span>
        <span>Maximum</span>
      </div>
      
      {/* Price values */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        fontSize: 16, 
        fontWeight: 700, 
        color: '#333',
        padding: '0 12px',
        marginBottom: 20
      }}>
        <span>đ{filterMinPrice.toLocaleString('vi-VN')}</span>
        <span>đ{filterMaxPrice.toLocaleString('vi-VN')}</span>
      </div>

      {/* Record Types Section */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: '#333', marginBottom: 12 }}>
          Record Types:
        </div>
        <div style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
          Select seat categories to filter by
        </div>
        
        {/* Record Type checkboxes */}
        <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ 
            padding: '12px 16px', 
            borderBottom: '1px solid #e0e0e0',
            background: currentRecordTypes.standard ? '#e3f2fd' : '#fff',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={(e) => {
            e.preventDefault();
            console.log('🖱️ Standard Seats div clicked');
            handleRecordTypeChange('standard');
          }}
          >
            <CustomCheckbox 
              checked={currentRecordTypes.standard} 
              onChange={() => handleRecordTypeChange('standard')} 
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#333' }}>{SEAT_CATEGORIES.STANDARD_SEATS.label}</div>
              <div style={{ fontSize: 12, color: '#666' }}>
                {SEAT_CATEGORIES.STANDARD_SEATS.description}
              </div>
              <div style={{ fontSize: 12, color: '#999' }}>
                Coaches {SEAT_CATEGORIES.STANDARD_SEATS.coaches.join(', ')} • Priority {SEAT_CATEGORIES.STANDARD_SEATS.priority}
              </div>
            </div>
          </div>
          
          <div style={{ 
            padding: '12px 16px', 
            borderBottom: '1px solid #e0e0e0',
            background: currentRecordTypes.medium_priority ? '#e3f2fd' : '#fff',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={(e) => {
            e.preventDefault();
            console.log('🖱️ 6-Berth Cabins div clicked');
            handleRecordTypeChange('medium_priority');
          }}
          >
            <CustomCheckbox 
              checked={currentRecordTypes.medium_priority} 
              onChange={() => handleRecordTypeChange('medium_priority')} 
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#333' }}>{SEAT_CATEGORIES.BERTH_6_CABINS.label}</div>
              <div style={{ fontSize: 12, color: '#666' }}>
                {SEAT_CATEGORIES.BERTH_6_CABINS.description}
              </div>
              <div style={{ fontSize: 12, color: '#999' }}>
                Coaches {SEAT_CATEGORIES.BERTH_6_CABINS.coaches.join(', ')} • Priority {SEAT_CATEGORIES.BERTH_6_CABINS.priority}
              </div>
            </div>
          </div>
          
          <div style={{ 
            padding: '12px 16px',
            background: currentRecordTypes.high_priority ? '#e3f2fd' : '#fff',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={(e) => {
            e.preventDefault();
            console.log('🖱️ 4-Berth Cabins div clicked');
            handleRecordTypeChange('high_priority');
          }}
          >
            <CustomCheckbox 
              checked={currentRecordTypes.high_priority} 
              onChange={() => handleRecordTypeChange('high_priority')} 
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#333' }}>{SEAT_CATEGORIES.BERTH_4_CABINS.label}</div>
              <div style={{ fontSize: 12, color: '#666' }}>
                {SEAT_CATEGORIES.BERTH_4_CABINS.description}
              </div>
              <div style={{ fontSize: 12, color: '#999' }}>
                Coaches {SEAT_CATEGORIES.BERTH_4_CABINS.coaches.join(', ')} • Priority {SEAT_CATEGORIES.BERTH_4_CABINS.priority}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Preferences Section */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: '#333', marginBottom: 12 }}>
          Priority Preferences
        </div>
        <div style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
          Choose how to prioritise results
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: 6,
            background: priorityPreference === 'all' ? '#e3f2fd' : '#f9f9f9'
          }}>
            <input
              type="radio"
              name="priority"
              value="all"
              checked={priorityPreference === 'all'}
              onChange={(e) => setPriorityPreference(e.target.value)}
              style={{ marginRight: 8 }}
            />
            <div>
              <span style={{ fontWeight: 500, fontSize: 14 }}>Show All Records</span>
              <div style={{ fontSize: 12, color: '#666' }}>
                Display all matching seats, sorted by priority score
              </div>
            </div>
          </label>
          
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: 6,
            background: priorityPreference === 'highPriority' ? '#e3f2fd' : '#f9f9f9'
          }}>
            <input
              type="radio"
              name="priority"
              value="highPriority"
              checked={priorityPreference === 'highPriority'}
              onChange={(e) => setPriorityPreference(e.target.value)}
              style={{ marginRight: 8 }}
            />
            <div>
              <span style={{ fontWeight: 500, fontSize: 14 }}>High Priority Only</span>
              <div style={{ fontSize: 12, color: '#666' }}>
                Show only premium seats with high priority scores
              </div>
            </div>
          </label>
          
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: 6,
            background: priorityPreference === 'lowPriority' ? '#e3f2fd' : '#f9f9f9'
          }}>
            <input
              type="radio"
              name="priority"
              value="lowPriority"
              checked={priorityPreference === 'lowPriority'}
              onChange={(e) => setPriorityPreference(e.target.value)}
              style={{ marginRight: 8 }}
            />
            <div>
              <span style={{ fontWeight: 500, fontSize: 14 }}>Low Priority Only</span>
              <div style={{ fontSize: 12, color: '#666' }}>
                Show only budget seats with low priority scores
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Noise Level Section */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: '#333', marginBottom: 12 }}>
          Noise Level
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            fontSize: 14
          }}>
            <input
              type="radio"
              name="noise"
              value="quiet"
              style={{ marginRight: 8 }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#4CAF50', fontSize: 16 }}>●</span>
              <span>Quiet</span>
            </div>
          </label>
          
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            fontSize: 14
          }}>
            <input
              type="radio"
              name="noise"
              value="noise"
              style={{ marginRight: 8 }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#FF9800', fontSize: 16 }}>●</span>
              <span>Noise</span>
            </div>
          </label>
        </div>
        
        <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
          Color: <span style={{ color: '#4CAF50' }}>red (noise)</span>; <span style={{ color: '#FF9800' }}>green (quiet)</span>
        </div>
      </div>

      {/* Next Level và Total info */}
      <div style={{ 
        fontSize: 12, 
        color: '#666', 
        textAlign: 'center',
        marginBottom: 16
      }}>
        Next Level: ○ ● Low • More
      </div>
      <div style={{ 
        fontSize: 12, 
        color: '#666', 
        textAlign: 'center',
        marginBottom: 20
      }}>
        Total for {Object.values(currentRecordTypes).filter(Boolean).length} record type(s)
      </div>

      {/* Apply Record Filter Button */}
      <button
        onClick={applyRecordFilter}
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, #2196F3, #1976D2)',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '12px 0',
          fontWeight: 700,
          fontSize: 15,
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(33, 150, 243, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(33, 150, 243, 0.3)';
        }}
      >
        Apply Record Filter
      </button>
    </div>
  );
};

export default PriceFilter;
