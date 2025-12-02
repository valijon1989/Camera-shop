export interface ProductCreate {
  cameraModel: string;
  brand: string;
  category?: string;

  resolutionMp?: number;
  sensorType?: string;
  mountType?: string;

  batteryCapacityMah?: number;
  photoResolution?: string;
  videoResolution?: string;
  isoRange?: string;
  stabilization?: string;

  price: number;
  stock?: number;
  description?: string;
  condition?: string;
  location?: string;

  images?: File[] | string[];
}

export interface Product {
  _id: string;

  cameraModel: string;
  brand: string;
  category?: string;

  resolutionMp?: number;
  sensorType?: string;
  mountType?: string;

  batteryCapacityMah?: number;
  photoResolution?: string;
  videoResolution?: string;
  isoRange?: string;
  stabilization?: string;

  price: number;
  stock?: number;
  description?: string;
  condition?: string;
  location?: string;

  images: string[];
  views?: number;

  createdAt?: string;
  updatedAt?: string;
}

export interface ProductInquiry {
  order?: string;
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sensorType?: string;
  resolutionMp?: number;
  mountType?: string;
  videoResolution?: string;
  isoRange?: string;
  stabilization?: string;
}
