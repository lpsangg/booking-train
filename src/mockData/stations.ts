export interface Station {
  id: string;
  name: string;
  fullName: string;
  station: string;
  display: string;
  code: string;
  province: string;
  region: 'North' | 'Central' | 'South';
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const STATIONS: Station[] = [
  {
    id: '1',
    name: 'Hà Nội',
    fullName: 'Ga Hà Nội',
    station: 'Hà Nội',
    display: 'Hà Nội',
    code: 'HN',
    province: 'Hà Nội',
    region: 'North',
    coordinates: { lat: 21.0285, lng: 105.8542 }
  },
  {
    id: '2',
    name: 'Vinh',
    fullName: 'Ga Vinh',
    station: 'Vinh',
    display: 'Vinh',
    code: 'VI',
    province: 'Nghệ An',
    region: 'Central',
    coordinates: { lat: 18.6793, lng: 105.6811 }
  },
  {
    id: '3',
    name: 'Đà Nẵng',
    fullName: 'Ga Đà Nẵng',
    station: 'Đà Nẵng',
    display: 'Đà Nẵng',
    code: 'DN',
    province: 'Đà Nẵng',
    region: 'Central',
    coordinates: { lat: 16.0678, lng: 108.2208 }
  },
  {
    id: '4',
    name: 'Nha Trang',
    fullName: 'Ga Nha Trang',
    station: 'Nha Trang',
    display: 'Nha Trang',
    code: 'NT',
    province: 'Khánh Hòa',
    region: 'Central',
    coordinates: { lat: 12.2388, lng: 109.1967 }
  },
  {
    id: '5',
    name: 'Sài Gòn',
    fullName: 'Ga Sài Gòn',
    station: 'Sài Gòn',
    display: 'Sài Gòn (TP.HCM)',
    code: 'SG',
    province: 'TP. Hồ Chí Minh',
    region: 'South',
    coordinates: { lat: 10.7769, lng: 106.7009 }
  }
];

export function searchStations(query: string, excludeStation?: string): Station[] {
  if (!query) return STATIONS;
  
  const normalizedQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  return STATIONS.filter(station => {
    if (excludeStation && station.station === excludeStation) {
      return false;
    }
    
    const normalizedName = station.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const normalizedDisplay = station.display.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const normalizedProvince = station.province.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    return normalizedName.includes(normalizedQuery) ||
           normalizedDisplay.includes(normalizedQuery) ||
           normalizedProvince.includes(normalizedQuery) ||
           station.code.toLowerCase().includes(normalizedQuery);
  });
}

export function getStationById(id: string): Station | undefined {
  return STATIONS.find(station => station.id === id);
}

export function getStationByDisplay(display: string): Station | undefined {
  return STATIONS.find(station => station.display === display);
}
