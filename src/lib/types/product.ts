export interface Product {
  _id: string;
  cameraModel: string;
  brand: string;
  sensorType?: string;
  resolutionMp?: number;
  mountType?: string;
  category?: string; // dslr, mirrorless, lens, cinema, drone, accessory, other
  price: number;
  stock?: number;
  description?: string;
  images: string[];
  condition?: string;
  location?: string;
  views?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductCreate {
  cameraModel: string;
  brand: string;
  sensorType?: string;
  resolutionMp?: number;
  mountType?: string;
  category?: string;
  price: number;
  stock?: number;
  description?: string;
  images: string[];
  condition?: string;
  location?: string;
}

export interface ProductInquiry {
  order?: string;
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
}
