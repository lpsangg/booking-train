import React, { useState, useEffect } from 'react';
import { SEAT_CATEGORIES } from '../constants';

interface LocalSeat {
  id: string;
  price: number;
  status: 'available' | 'occupied' | 'reserved' | 'selected';
  behavior?: 'quiet' | 'social' | 'kidzone';
  row?: string;
  column?: number;
  floor?: number;
  nearWC?: boolean;
  nearSimilarBehavior?: boolean;
  coachId?: number;
}

interface Coach {
  id: number;
  type: string;
  seats: number;
  price: number;
}

interface PriceFilterProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  priceData?: number[];
  seats?: LocalSeat[];
  className?: string;
  onApplyFilter?: (filters: any) => void;
  // External state props for synchronization
  selectedRecordTypes?: string[];
  priorityPreference?: string;
  onRecordTypesChange?: (types: string[]) => void;
  onPriorityChange?: (priority: 'all' | 'high_only') => void;
  // Reset callback to clear filtered results (like SearchResults page)
  onResetFilters?: () => void;
  // New props for integrated filtering
  coachSeats?: Record<number, LocalSeat[]>;
  coaches?: Coach[];
  selectedCoachIdx?: number;
  onFilteredSeatsChange?: (seatIds: string[]) => void;
  onBestCoachSwitch?: (coachIndex: number) => void;
  onShowToast?: (message: string, color: string) => void;
}

interface RecordTypes {
  standard: boolean;
  medium_priority: boolean;
  high_priority: boolean;
  two_berth: boolean;
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
  onPriorityChange,
  onResetFilters,
  coachSeats = {},
  coaches = [],
  selectedCoachIdx = 0,
  onFilteredSeatsChange,
  onBestCoachSwitch,
  onShowToast
}) => {
  // State cho price range filter và histogram
  const [filterMinPrice, setFilterMinPrice] = useState(minPrice);
  const [filterMaxPrice, setFilterMaxPrice] = useState(maxPrice);
  const [leftHandle, setLeftHandle] = useState(0);
  const [rightHandle, setRightHandle] = useState(100);
  const [isDragging, setIsDragging] = useState<string | null>(null);

  // Record Type filters (theo Salesforce style) - Default to none selected
  const [recordTypes, setRecordTypes] = useState<RecordTypes>({
    standard: false,
    medium_priority: false,
    high_priority: false,
    two_berth: false
  });

  // Priority Preferences
  const [priorityPreference, setPriorityPreference] = useState('all');
  
  // Noise Level filter
  const [noiseLevel, setNoiseLevel] = useState<'quiet' | 'noise' | 'kidzone' | null>(null);

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

  // Hàm tạo histogram cho giá vé với thông tin ghế chi tiết - Enhanced design
  const getPriceHistogram = (binCount: number = 12) => {
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

    // Enhanced mock data với phân bố đều và đầy đặn - No empty spaces
    // Tạo dữ liệu đều đặn với chiều cao tương đối ổn định
    const mockData: number[] = [];
    
    // Predefined values để đảm bảo đều đặn và không có khoảng trống
    const predefinedHeights = [
      25, 32, 28, 35, 42, 38, 45, 40, 36, 33, 29, 26
    ];
    
    for (let i = 0; i < binCount; i++) {
      // Sử dụng predefined heights hoặc tính toán nếu binCount khác 12
      let height;
      if (i < predefinedHeights.length) {
        height = predefinedHeights[i];
      } else {
        // Fallback calculation for different binCount
        const baseHeight = 28;
        const variation = Math.sin((i / binCount) * Math.PI * 2) * 8;
        height = baseHeight + Math.abs(variation) + (Math.random() * 6);
      }
      
      // Add small randomness but ensure minimum height
      const randomVariation = (Math.random() - 0.5) * 4; // ±2 variation
      const finalHeight = Math.round(height + randomVariation);
      
      mockData.push(Math.max(22, finalHeight)); // Minimum 22 seats per bin
    }
    
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
        high_priority: externalRecordTypes.includes('high_priority'),
        two_berth: externalRecordTypes.includes('two_berth')
      }
    : recordTypes;

  // Apply Record Filter - Updated to use integrated logic
  const applyRecordFilter = () => {
    console.log('🚀 ===== STARTING RECORD FILTER =====');
    console.log('Available filter data:', {
      coachSeats: Object.keys(coachSeats).length,
      coaches: coaches.length,
      selectedCoachIdx,
      onFilteredSeatsChange: !!onFilteredSeatsChange
    });
    
    // If we have integrated filtering capability, use it
    if (coachSeats && Object.keys(coachSeats).length > 0 && onFilteredSeatsChange) {
      console.log('🎯 Using integrated filter logic');
      applyIntegratedFilters();
      return;
    }

    // Fallback to original logic for backward compatibility
    const activeFilters = Object.entries(currentRecordTypes)
      .filter(([_, isActive]) => isActive)
      .map(([type]) => type);
    
    console.log('🔍 Active filters (fallback mode):', activeFilters);
    
    // If no record types selected, show message
    if (activeFilters.length === 0) {
      if (onShowToast) {
        onShowToast('Vui lòng chọn ít nhất một loại ghế để lọc kết quả', 'warning');
      } else {
        alert('Vui lòng chọn ít nhất một loại ghế để lọc kết quả');
      }
      return;
    }
    
    const filterData = {
      priceRange: { min: filterMinPrice, max: filterMaxPrice },
      recordTypes: activeFilters,
      priority: currentPriorityPreference,
      noiseLevel: noiseLevel
    };
    
    console.log('Applied filters:', filterData);
    
    // Call the callback function if provided
    if (onApplyFilter) {
      onApplyFilter(filterData);
    } else {
      // Fallback alert if no callback provided
      const noiseLevelText = noiseLevel ? ` | Noise Level: ${noiseLevel}` : '';
      alert(`Filters applied!\nPrice: đ${filterMinPrice.toLocaleString('vi-VN')} - đ${filterMaxPrice.toLocaleString('vi-VN')}\nRecord Types: ${activeFilters.join(', ')}\nPriority: ${currentPriorityPreference}${noiseLevelText}`);
    }
  };

  // Reset all filters - Updated to handle integrated logic
  const resetFilters = () => {
    // Reset price range to original values
    setFilterMinPrice(minPrice);
    setFilterMaxPrice(maxPrice);
    onPriceChange(minPrice, maxPrice);
    
    // Reset record types to default (none selected)
    const defaultRecordTypes: string[] = [];
    if (onRecordTypesChange) {
      onRecordTypesChange(defaultRecordTypes);
    } else {
      setRecordTypes({
        standard: false,
        medium_priority: false,
        high_priority: false,
        two_berth: false
      });
    }
    
    // Reset priority preference (keep as 'all' since no UI to change it)
    setPriorityPreference('all');
    if (onPriorityChange) {
      onPriorityChange('all');
    }
    
    // Reset noise level
    setNoiseLevel(null);
    
    console.log('🔄 All filters have been reset to default state (none selected)');
    
    // Clear filtered results if we have integrated filtering
    if (onFilteredSeatsChange) {
      onFilteredSeatsChange([]);
    }
    
    // Call the reset callback to clear filtered results (like SearchResults)
    if (onResetFilters) {
      onResetFilters();
    } else {
      // Fallback: auto-apply reset filters if no reset callback provided
      if (onApplyFilter) {
        onApplyFilter({
          priceRange: { min: minPrice, max: maxPrice },
          recordTypes: defaultRecordTypes,
          priority: 'all',
          noiseLevel: null
        });
      }
    }
  };

  // ======================== INTEGRATED FILTER LOGIC ========================
  
  // Hàm đánh giá mức độ noise từ màu sắc RGB
  const getNoiseScoreFromColor = (colorString: string): number => {
    // Parse RGB color string
    if (!colorString || colorString === "#e0e0e0") return 50; // Neutral score for default colors
    
    let r, g, b;
    
    if (colorString.startsWith('rgb')) {
      // Parse rgb(r, g, b) format
      const match = colorString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        r = parseInt(match[1]);
        g = parseInt(match[2]);
        b = parseInt(match[3]);
      } else {
        return 50; // Default neutral score
      }
    } else if (colorString.startsWith('#')) {
      // Parse hex format
      const hex = colorString.replace('#', '');
      r = parseInt(hex.substr(0, 2), 16);
      g = parseInt(hex.substr(2, 2), 16);
      b = parseInt(hex.substr(4, 2), 16);
    } else {
      return 50; // Default neutral score
    }
    
    // Calculate noise score based on color knowledge:
    // Đỏ cam (249, 115, 22) = noise/social = high score (80-100)
    // Xanh lá (34, 197, 94) = quiet = low score (0-20)
    
    // Method 1: Calculate similarity to red vs green
    const redReference = { r: 249, g: 115, b: 22 }; // Orange-red (noise)
    const greenReference = { r: 34, g: 197, b: 94 }; // Green (quiet)
    
    // Calculate Euclidean distance to each reference color
    const distanceToRed = Math.sqrt(
      Math.pow(r - redReference.r, 2) + 
      Math.pow(g - redReference.g, 2) + 
      Math.pow(b - redReference.b, 2)
    );
    
    const distanceToGreen = Math.sqrt(
      Math.pow(r - greenReference.r, 2) + 
      Math.pow(g - greenReference.g, 2) + 
      Math.pow(b - greenReference.b, 2)
    );
    
    // Normalize distances and calculate score
    const totalDistance = distanceToRed + distanceToGreen;
    if (totalDistance === 0) return 50; // Avoid division by zero
    
    // Closer to red = higher noise score, closer to green = lower noise score
    const noiseScore = (distanceToGreen / totalDistance) * 100;
    
    console.log(`🎨 Color analysis for ${colorString}: RGB(${r},${g},${b}) -> Noise Score: ${noiseScore.toFixed(1)}`);
    return noiseScore;
  };

  // Hàm xác định behavior từ màu sắc (để bổ sung cho behavior hiện tại)
  const getBehaviorFromColorAnalysis = (colorString: string): 'quiet' | 'social' | 'kidzone' | 'unknown' => {
    const noiseScore = getNoiseScoreFromColor(colorString);
    
    // Special colors for kidzone
    if (colorString === "#E91E63" || colorString === "#9C27B0") {
      return 'kidzone';
    }
    
    // Threshold-based classification
    if (noiseScore >= 70) {
      return 'social'; // High noise = social/noise behavior
    } else if (noiseScore <= 30) {
      return 'quiet';  // Low noise = quiet behavior
    } else {
      return 'unknown'; // Medium range - ambiguous
    }
  };
  
  // Record Type Configuration (updated based on user specification)
  const recordTypeConfig = {
    standard: {
      label: 'Ghế ngồi',
      description: 'Ghế ngồi thường (toa 1, 2)',
      criteria: {
        seatTypes: ['seat'],
        noiseLevel: ['quiet', 'social'],
        coachPosition: [1, 2], // Toa 1-2: Ghế ngồi
        priorityScore: 1
      }
    },
    medium_priority: {
      label: '6 giường 1 cabin',
      description: 'Cabin ngủ 6 giường (toa 5, 6, 7)',
      criteria: {
        seatTypes: ['compartment_6'],
        noiseLevel: ['quiet', 'social', 'kidzone'],
        coachPosition: [5, 6, 7], // Toa 5,6,7: 6 giường 1 cabin
        priorityScore: 2
      }
    },
    high_priority: {
      label: '4 giường 1 cabin',
      description: 'Cabin ngủ 4 giường (toa 4, 8, 9, 10)',
      criteria: {
        seatTypes: ['compartment_4'],
        noiseLevel: ['quiet', 'social', 'kidzone'], // Toa 4 cũng hỗ trợ kidzone
        coachPosition: [4, 8, 9, 10], // Toa 4,8,9,10: 4 giường 1 cabin
        priorityScore: 3
      }
    },
    two_berth: {
      label: '2 giường 1 cabin',
      description: 'Cabin ngủ 2 giường (toa 3)',
      criteria: {
        seatTypes: ['compartment_2'],
        noiseLevel: ['quiet', 'social', 'kidzone'], // Toa 3 hỗ trợ kidzone
        coachPosition: [3], // Toa 3: 2 giường 1 cabin
        priorityScore: 4
      }
    }
  };

  // Salesforce-style priority scoring function
  const getPriorityScore = (seat: LocalSeat): number => {
    let score = 0;
    
    // Noise level scoring (decreases by coach position)
    const coachId = seat.coachId || (coaches[selectedCoachIdx]?.id);
    if (seat.behavior === 'quiet') {
      score += Math.max(0, 11 - (coachId || 0)); // Decreasing noise by coach position
    } else if (seat.behavior === 'social') {
      score += Math.max(0, (coachId || 0) - 1); // Increasing noise by coach position
    } else if (seat.behavior === 'kidzone') {
      score += 15; // Special scoring for kidzone (family-friendly areas)
    }
    
    // Seat type scoring
    if (seat.id.includes('-k2-')) score += 35; // 2-berth cabin (highest priority)
    else if (seat.id.includes('-k4-')) score += 30; // 4-berth cabin (high priority)
    else if (seat.id.includes('-k6-')) score += 20; // 6-berth cabin (medium priority)
    else if (seat.id.includes('-ngoi-')) score += 10; // Seat (standard priority)
    
    // Comfort factors
    if (!seat.nearWC) score += 5; // Bonus for not being near toilet
    if (seat.nearSimilarBehavior) score += 3; // Bonus for being near similar behavior passengers
    
    return score;
  };

  // Function to check if seat matches Record Type criteria
  const matchesRecordTypeCriteria = (seat: LocalSeat, recordType: string, coachId: number): boolean => {
    const config = recordTypeConfig[recordType as keyof typeof recordTypeConfig];
    if (!config) {
      console.log(`⚠️ No config found for record type: ${recordType}`);
      return false;
    }
    
    console.log(`🔍 Checking seat ${seat.id} against ${recordType} for coach ${coachId}`);
    
    // Check coach position criteria
    if (!config.criteria.coachPosition.includes(coachId)) {
      console.log(`❌ Coach ${coachId} not in allowed positions:`, config.criteria.coachPosition);
      return false;
    }
    console.log(`✅ Coach ${coachId} matches position criteria`);
    
    // Determine actual seat type from multiple sources
    let actualSeatType = '';
    
    // Method 1: Check seat ID patterns
    if (seat.id.includes('-ngoi-') || seat.id.includes('ngoi')) {
      actualSeatType = 'seat';
    } else if (seat.id.includes('-k2-') || seat.id.includes('k2')) {
      actualSeatType = 'compartment_2';
    } else if (seat.id.includes('-k4-') || seat.id.includes('k4')) {
      actualSeatType = 'compartment_4';
    } else if (seat.id.includes('-k6-') || seat.id.includes('k6')) {
      actualSeatType = 'compartment_6';
    }
    
    // Method 2: If ID pattern fails, determine by coach position (more reliable)
    if (!actualSeatType) {
      if (coachId === 1 || coachId === 2) {
        actualSeatType = 'seat'; // Toa 1-2: Ghế ngồi
      } else if (coachId === 3) {
        actualSeatType = 'compartment_2'; // Toa 3: 2 giường 1 cabin
      } else if (coachId === 4 || coachId === 8 || coachId === 9 || coachId === 10) {
        actualSeatType = 'compartment_4'; // Toa 4,8,9,10: 4 giường 1 cabin
      } else if (coachId === 5 || coachId === 6 || coachId === 7) {
        actualSeatType = 'compartment_6'; // Toa 5,6,7: 6 giường 1 cabin
      }
    }
    
    console.log(`🪑 Seat ${seat.id} determined type: ${actualSeatType} (Coach ${coachId})`);
    console.log(`📋 Record type ${recordType} allows:`, config.criteria.seatTypes);
    
    // Check if actual seat type is in the allowed types for this record type
    const seatTypeMatches = config.criteria.seatTypes.includes(actualSeatType);
    
    if (!seatTypeMatches) {
      console.log(`❌ Seat type ${actualSeatType} not allowed for ${recordType}`);
      return false;
    }
    console.log(`✅ Seat type ${actualSeatType} matches criteria`);
    
    // Check noise level criteria (if noise level filter is applied)
    if (noiseLevel) {
      const mappedNoiseLevel = noiseLevel === 'noise' ? 'social' : noiseLevel;
      console.log(`🔊 Checking noise level: ${mappedNoiseLevel} against allowed:`, config.criteria.noiseLevel);
      if (!config.criteria.noiseLevel.includes(mappedNoiseLevel)) {
        console.log(`❌ Noise level ${mappedNoiseLevel} not allowed for ${recordType}`);
        return false;
      }
      console.log(`✅ Noise level ${mappedNoiseLevel} matches criteria`);
    } else {
      console.log(`🔇 No noise level filter applied, skipping noise level check`);
    }
    
    console.log(`🎉 Seat ${seat.id} PASSES all criteria for ${recordType}`);
    return true;
  };

  // Salesforce-style Record Type filtering
  const filterRecordsByType = (seats: LocalSeat[], coachId: number): LocalSeat[] => {
    const selectedTypes = externalRecordTypes || Object.entries(currentRecordTypes)
      .filter(([_, isActive]) => isActive)
      .map(([type]) => type);

    console.log('🏷️ Starting Record Type filtering...');
    console.log('Selected Record Types:', selectedTypes);
    console.log('Total seats to filter:', seats.length);
    
    if (selectedTypes.length === 0) {
      console.log('⚠️ No record types selected, returning empty array (user must select at least one type)');
      return [];
    }
    
    const filtered = seats.filter(seat => {
      console.log(`\n--- Checking seat ${seat.id} ---`);
      
      const matchesAnyType = selectedTypes.some(recordType => {
        console.log(`Testing against ${recordType}...`);
        const matches = matchesRecordTypeCriteria(seat, recordType, coachId);
        console.log(`Result for ${recordType}:`, matches ? '✅ MATCH' : '❌ NO MATCH');
        return matches;
      });
      
      console.log(`Final result for seat ${seat.id}:`, matchesAnyType ? '🎯 INCLUDED' : '🚫 EXCLUDED');
      return matchesAnyType;
    });
    
    console.log(`\n📊 Record Type filtering results: ${filtered.length}/${seats.length} seats passed`);
    return filtered;
  };

  // Salesforce-style Priority Preference filtering
  const filterRecordsByPriority = (seats: LocalSeat[]): LocalSeat[] => {
    const currentPriority = externalPriorityPreference || priorityPreference;
    
    console.log('🎯 Starting Priority Preference filtering...');
    console.log('Priority Preference:', currentPriority);
    console.log('Input seats:', seats.length);
    
    if (currentPriority === 'all') {
      console.log('✅ Priority = "all", returning all seats');
      return seats;
    }
    
    if (currentPriority === 'high_only' || currentPriority === 'highPriority') {
      // Only show high priority seats (score >= threshold)
      const threshold = 25; // Adjustable threshold
      console.log(`🔍 Filtering for high priority only (score >= ${threshold})`);
      
      const filtered = seats.filter(seat => {
        const score = getPriorityScore(seat);
        const passes = score >= threshold;
        console.log(`Seat ${seat.id}: score=${score}, passes=${passes}`);
        return passes;
      });
      
      console.log(`📊 Priority filtering results: ${filtered.length}/${seats.length} seats are high priority`);
      return filtered;
    }
    
    if (currentPriority === 'lowPriority') {
      // Only show low priority seats (score < threshold)
      const threshold = 15;
      console.log(`🔍 Filtering for low priority only (score < ${threshold})`);
      
      const filtered = seats.filter(seat => {
        const score = getPriorityScore(seat);
        const passes = score < threshold;
        console.log(`Seat ${seat.id}: score=${score}, passes=${passes}`);
        return passes;
      });
      
      console.log(`📊 Priority filtering results: ${filtered.length}/${seats.length} seats are low priority`);
      return filtered;
    }
    
    console.log('⚠️ Unknown priority preference, returning all seats');
    return seats;
  };

  // Main filter application function
  const applyIntegratedFilters = () => {
    if (!coachSeats || Object.keys(coachSeats).length === 0) {
      console.log('⚠️ No coach seats data available for filtering');
      return;
    }

    console.log('\n🚀 ===== STARTING INTEGRATED SALESFORCE-STYLE FILTERING =====');
    console.log('Filter parameters:', {
      selectedRecordTypes: externalRecordTypes || Object.entries(currentRecordTypes).filter(([_, isActive]) => isActive).map(([type]) => type),
      priorityPreference: externalPriorityPreference || priorityPreference,
      priceRange: [filterMinPrice, filterMaxPrice],
      noiseLevel
    });
    console.log('Coach seats available:', Object.keys(coachSeats).map(id => `Coach ${id}: ${coachSeats[Number(id)]?.length || 0} seats`));

    const allFilteredSeats: LocalSeat[] = [];
    let bestCoachInfo: { id: number | null; seats: LocalSeat[]; seatCount: number; avgScore: number } = { 
      id: null, seats: [], seatCount: 0, avgScore: 0 
    };

    // Lặp qua TẤT CẢ các toa để tìm ghế tốt nhất
    Object.keys(coachSeats).forEach(coachIdStr => {
      const coachId = Number(coachIdStr);
      const currentCoachSeats = coachSeats[coachId] || [];
      
      if (currentCoachSeats.length === 0) return;

      // Special logic for noise level filtering: only check relevant coaches for kidzone
      if (noiseLevel === 'kidzone' && ![3, 4, 5].includes(coachId)) {
        console.log(`⏭️ Skipping Coach ${coachId} - kidzone filter only applies to coaches 3, 4, 5`);
        return;
      }
      
      // For quiet and noise filters, check all coaches that contain seats with those behaviors
      // This allows filtering by seat color/behavior across all coaches
      
      console.log(`\n📍 Checking Coach ${coachId} with ${currentCoachSeats.length} total seats`);
      
      // Pre-filter check: For quiet/noise filters, check if this coach has any seats with the desired behavior
      if (noiseLevel === 'quiet' || noiseLevel === 'noise') {
        const targetBehavior = noiseLevel === 'quiet' ? 'quiet' : 'social';
        const hasTargetBehavior = currentCoachSeats.some(seat => seat.behavior === targetBehavior);
        
        if (!hasTargetBehavior) {
          console.log(`⏭️ Skipping Coach ${coachId} - no seats with '${targetBehavior}' behavior found`);
          return;
        }
        console.log(`✅ Coach ${coachId} has seats with '${targetBehavior}' behavior, proceeding with filtering`);
      }
      
      // Step 1: Apply Record Type filtering
      console.log(`\n📋 STEP 1: Record Type Filtering for Coach ${coachId}`);
      let filtered = filterRecordsByType(currentCoachSeats, coachId);
      console.log(`After Record Type filtering: ${filtered.length} seats remain in Coach ${coachId}`);
      
      if (filtered.length === 0) return;
      
      // Step 2: Apply Priority Preference filtering
      console.log(`\n🎯 STEP 2: Priority Preference Filtering for Coach ${coachId}`);
      filtered = filterRecordsByPriority(filtered);
      console.log(`After Priority filtering: ${filtered.length} seats remain in Coach ${coachId}`);
      
      if (filtered.length === 0) return;
      
      // Step 3: Apply price range filtering
      console.log(`\n💰 STEP 3: Price Range Filtering for Coach ${coachId}`);
      const beforePriceCount = filtered.length;
      filtered = filtered.filter(seat => {
        const inRange = seat.price >= filterMinPrice && seat.price <= filterMaxPrice;
        return inRange;
      });
      console.log(`After Price filtering: ${filtered.length}/${beforePriceCount} seats remain in Coach ${coachId}`);
      
      if (filtered.length === 0) return;
      
      // Step 4: Apply noise level filtering (if specified)
      if (noiseLevel) {
        console.log(`\n🔊 STEP 4: Noise Level Filtering for Coach ${coachId} (Looking for: ${noiseLevel})`);
        const beforeNoiseCount = filtered.length;
        
        // Log seat behaviors in this coach
        console.log(`Coach ${coachId} seat behaviors:`, filtered.map(seat => `${seat.id}: ${seat.behavior}`));
        
        // Enhanced logic: Filter by seat behavior with color knowledge validation
        filtered = filtered.filter(seat => {
          // Primary filter: Check existing behavior
          let behaviorMatch = false;
          if (noiseLevel === 'quiet') {
            behaviorMatch = seat.behavior === 'quiet';
          } else if (noiseLevel === 'noise') {
            behaviorMatch = seat.behavior === 'social';
          } else if (noiseLevel === 'kidzone') {
            behaviorMatch = seat.behavior === 'kidzone';
            console.log(`Checking seat ${seat.id} in coach ${coachId}: behavior=${seat.behavior}, isKidzone=${behaviorMatch}`);
          }
          
          // Enhanced validation: Use color knowledge to understand seat positioning
          // Màu đỏ = noise/social behavior, Màu xanh = quiet behavior
          if (behaviorMatch) {
            console.log(`✅ Seat ${seat.id} matched by behavior: ${seat.behavior} (Color Rule: Red=Noise, Green=Quiet)`);
          }
          
          return behaviorMatch;
        });
        console.log(`After Noise Level filtering: ${filtered.length}/${beforeNoiseCount} seats remain in Coach ${coachId}`);
        
        // Enhanced explanation with color knowledge
        if ((noiseLevel === 'quiet' || noiseLevel === 'noise') && filtered.length === 0 && beforeNoiseCount > 0) {
          const targetBehavior = noiseLevel === 'quiet' ? 'quiet' : 'social';
          const colorDescription = noiseLevel === 'quiet' ? 'Green colored seats (quiet zones)' : 'Red colored seats (noise zones)';
          console.log(`❌ Coach ${coachId} has no seats with '${targetBehavior}' behavior. Looking for: ${colorDescription}`);
        }
      }
      
      // Step 5: Only show available seats
      console.log(`\n✅ STEP 5: Availability Filtering for Coach ${coachId}`);
      const beforeAvailabilityCount = filtered.length;
      filtered = filtered.filter(seat => {
        const isAvailable = seat.status === 'available';
        if (!isAvailable) {
          console.log(`Seat ${seat.id}: status is ${seat.status}, not available`);
        }
        return isAvailable;
      });
      console.log(`After Availability filtering: ${filtered.length}/${beforeAvailabilityCount} seats remain in Coach ${coachId}`);
      
      if (filtered.length === 0) return;
      
      // Sort by priority score (highest first)
      console.log(`\n📊 STEP 6: Priority Sorting for Coach ${coachId}`);
      filtered.sort((a, b) => {
        const scoreA = getPriorityScore(a);
        const scoreB = getPriorityScore(b);
        return scoreB - scoreA;
      });
      
      // Tính điểm trung bình của toa
      const avgScore = filtered.reduce((sum, seat) => sum + getPriorityScore(seat), 0) / filtered.length;
      
      // Thêm ghế vào danh sách tổng
      allFilteredSeats.push(...filtered.map(seat => ({ ...seat, coachId })));
      
      // Kiểm tra xem đây có phải toa tốt nhất không
      if (filtered.length > bestCoachInfo.seatCount || 
          (filtered.length === bestCoachInfo.seatCount && avgScore > bestCoachInfo.avgScore)) {
        bestCoachInfo = {
          id: coachId,
          seats: filtered,
          seatCount: filtered.length,
          avgScore: avgScore
        };
      }
      
      console.log(`🎉 Coach ${coachId} final results: ${filtered.length} seats, avg score: ${avgScore.toFixed(1)}`);
    });

    // Sắp xếp tất cả ghế theo priority score
    allFilteredSeats.sort((a, b) => getPriorityScore(b) - getPriorityScore(a));
    
    // Update filtered seat IDs
    if (onFilteredSeatsChange) {
      onFilteredSeatsChange(allFilteredSeats.map(seat => seat.id));
    }
    
    console.log('\n🎉 ===== FILTERING COMPLETE =====');
    console.log(`Total results: ${allFilteredSeats.length} seats match all criteria across all coaches`);
    console.log(`Best coach: ${bestCoachInfo.id} with ${bestCoachInfo.seatCount} seats`);
    
    if (allFilteredSeats.length > 0 && bestCoachInfo.id) {
      // TỰ ĐỘNG CHUYỂN ĐẾN TOA TỐT NHẤT
      const currentCoachId = coaches[selectedCoachIdx]?.id;
      if (bestCoachInfo.id !== currentCoachId) {
        console.log(`🚂 Auto-switching from Coach ${currentCoachId} to Coach ${bestCoachInfo.id}`);
        
        // Tìm index của coach tốt nhất
        const bestCoachIndex = coaches.findIndex(coach => coach.id === bestCoachInfo.id);
        if (bestCoachIndex !== -1 && onBestCoachSwitch) {
          onBestCoachSwitch(bestCoachIndex);
        }
      }
      
      // Display results with Salesforce-style messaging
      const message = `✅ Found ${allFilteredSeats.length} records matching criteria across all coaches`;
      if (onShowToast) {
        onShowToast(message, '#4caf50');
      }
    } else {
      // Không tìm thấy ghế nào
      const message = `❌ No records found. Try adjusting Record Types or Priority Preferences.`;
      if (onShowToast) {
        onShowToast(message, '#f44336');
      }
    }
    
    console.log('Filter summary:', {
      recordTypes: externalRecordTypes || Object.entries(currentRecordTypes).filter(([_, isActive]) => isActive).map(([type]) => type),
      priorityPreference: externalPriorityPreference || priorityPreference,
      priceRange: [filterMinPrice, filterMaxPrice],
      noiseLevel,
      matchedSeats: allFilteredSeats.length,
      bestCoach: bestCoachInfo.id
    });
    
    return allFilteredSeats.length;
  };

  // ======================== END INTEGRATED FILTER LOGIC ========================

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
      marginBottom: 40, // Add extra bottom margin to ensure buttons are visible
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
          {getPriceHistogram(12).map((count, idx) => {
            const maxCount = Math.max(...getPriceHistogram(12));
            // Tăng chiều cao tối đa lên 70px và đảm bảo sự khác biệt rõ ràng
            const baseHeight = maxCount > 0 ? (count / maxCount) * 70 : 0;
            const height = count > 0 ? Math.max(baseHeight, 8) : 0; // Tối thiểu 8px cho bin có data
            const position = (idx / (getPriceHistogram(12).length - 1)) * 100;
            const isInRange = position >= leftHandle && position <= rightHandle;
            const priceRange = getPriceForBin(idx, 12);
            const seatType = getSeatTypeInfo(idx);
            
            return (
              <div
                key={idx}
                style={{ 
                  width: `${96 / getPriceHistogram(12).length}%`,
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  margin: '0 1px' // Small margin between bars
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
          {/* Ghế ngồi (toa 1, 2) */}
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
            console.log('🖱️ Ghế ngồi div clicked');
            handleRecordTypeChange('standard');
          }}
          >
            <CustomCheckbox 
              checked={currentRecordTypes.standard} 
              onChange={() => handleRecordTypeChange('standard')} 
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#333' }}>Ghế ngồi</div>
              <div style={{ fontSize: 12, color: '#666' }}>
                Ghế ngồi thường (toa 1, 2)
              </div>
              <div style={{ fontSize: 12, color: '#999' }}>
                Coaches 1, 2 • Priority 1
              </div>
            </div>
          </div>
          
          {/* 2 giường 1 cabin (toa 3) */}
          <div style={{ 
            padding: '12px 16px', 
            borderBottom: '1px solid #e0e0e0',
            background: currentRecordTypes.two_berth ? '#e3f2fd' : '#fff',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={(e) => {
            e.preventDefault();
            console.log('🖱️ 2 giường 1 cabin div clicked');
            handleRecordTypeChange('two_berth');
          }}
          >
            <CustomCheckbox 
              checked={currentRecordTypes.two_berth} 
              onChange={() => handleRecordTypeChange('two_berth')} 
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#333' }}>2 giường 1 cabin</div>
              <div style={{ fontSize: 12, color: '#666' }}>
                Cabin ngủ 2 giường (toa 3) - Hỗ trợ kidzone
              </div>
              <div style={{ fontSize: 12, color: '#999' }}>
                Coach 3 • Priority 4 • Kidzone available
              </div>
            </div>
          </div>
          
          {/* 6 giường 1 cabin (toa 5, 6, 7) */}
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
            console.log('🖱️ 6 giường 1 cabin div clicked');
            handleRecordTypeChange('medium_priority');
          }}
          >
            <CustomCheckbox 
              checked={currentRecordTypes.medium_priority} 
              onChange={() => handleRecordTypeChange('medium_priority')} 
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#333' }}>6 giường 1 cabin</div>
              <div style={{ fontSize: 12, color: '#666' }}>
                Cabin ngủ 6 giường (toa 5, 6, 7) - Toa 5 hỗ trợ kidzone
              </div>
              <div style={{ fontSize: 12, color: '#999' }}>
                Coaches 5, 6, 7 • Priority 2 • Kidzone at coach 5
              </div>
            </div>
          </div>
          
          {/* 4 giường 1 cabin (toa 4, 8, 9, 10) */}
          <div style={{ 
            padding: '12px 16px',
            background: currentRecordTypes.high_priority ? '#e3f2fd' : '#fff',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={(e) => {
            e.preventDefault();
            console.log('🖱️ 4 giường 1 cabin div clicked');
            handleRecordTypeChange('high_priority');
          }}
          >
            <CustomCheckbox 
              checked={currentRecordTypes.high_priority} 
              onChange={() => handleRecordTypeChange('high_priority')} 
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#333' }}>4 giường 1 cabin</div>
              <div style={{ fontSize: 12, color: '#666' }}>
                Cabin ngủ 4 giường (toa 4, 8, 9, 10) - Toa 4 hỗ trợ kidzone
              </div>
              <div style={{ fontSize: 12, color: '#999' }}>
                Coaches 4, 8, 9, 10 • Priority 3 • Kidzone at coach 4
              </div>
            </div>
          </div>
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
          }}
          onClick={() => setNoiseLevel('quiet')}
          >
            <div style={{ 
              width: 16, 
              height: 16, 
              background: noiseLevel === 'quiet' ? '#4CAF50' : '#fff', 
              border: '2px solid #4CAF50',
              borderRadius: '50%',
              marginRight: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {noiseLevel === 'quiet' && (
                <div style={{ 
                  width: 6, 
                  height: 6, 
                  background: '#fff', 
                  borderRadius: '50%' 
                }}></div>
              )}
            </div>
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
          }}
          onClick={() => setNoiseLevel('noise')}
          >
            <div style={{ 
              width: 16, 
              height: 16, 
              background: noiseLevel === 'noise' ? '#E91E63' : '#fff', 
              border: '2px solid #E91E63',
              borderRadius: '50%',
              marginRight: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {noiseLevel === 'noise' && (
                <div style={{ 
                  width: 6, 
                  height: 6, 
                  background: '#fff', 
                  borderRadius: '50%' 
                }}></div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#E91E63', fontSize: 16 }}>●</span>
              <span>Noise</span>
            </div>
          </label>
          
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            fontSize: 14
          }}
          onClick={() => setNoiseLevel('kidzone')}
          >
            <div style={{ 
              width: 16, 
              height: 16, 
              background: noiseLevel === 'kidzone' ? '#FF9800' : '#fff', 
              border: '2px solid #FF9800',
              borderRadius: '50%',
              marginRight: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {noiseLevel === 'kidzone' && (
                <div style={{ 
                  width: 6, 
                  height: 6, 
                  background: '#fff', 
                  borderRadius: '50%' 
                }}></div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#FF9800', fontSize: 16 }}>●</span>
              <span>Kidzone</span>
            </div>
          </label>
        </div>
        
        <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
          <strong>Quiet:</strong> Ghế có màu xanh lá - yên tĩnh (behavior 'quiet')<br/>
          <strong>Noise:</strong> Ghế có màu đỏ cam - náo nhiệt (behavior 'social')<br/>
          <strong>Kidzone:</strong> Khu vực gia đình & mẹ bầu chuyên dụng (toa 3, 4, 5)<br/>
          <em style={{ color: '#999', fontSize: 11 }}>💡 Màu sắc ghế: Đỏ = Nhiều tiếng ồn ↔ Xanh = Yên tĩnh</em>
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
      <div style={{ display: 'flex', gap: 12, paddingBottom: 20 }}>
        <button
          onClick={resetFilters}
          style={{
            flex: 1,
            background: 'linear-gradient(135deg, #FFA726, #FF9800)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '12px 0',
            fontWeight: 700,
            fontSize: 15,
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 2px 8px rgba(255, 152, 0, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 152, 0, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 152, 0, 0.3)';
          }}
        >
          Reset Filters
        </button>
        
        <button
          onClick={applyRecordFilter}
          style={{
            flex: 2,
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
    </div>
  );
};

export default PriceFilter;
