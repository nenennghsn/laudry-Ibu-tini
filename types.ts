export type UserRole = 'customer' | 'admin';

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  unit: 'kg' | 'pcs' | 'meter';
  isActive: boolean;
  description?: string;
  image?: string; // URL to the image
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
}

export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'picked_up';

export interface Transaction {
  id: string;
  customerName: string;
  date: string; // ISO date string
  serviceId: string;
  serviceName: string;
  weightOrQty: number;
  totalPrice: number;
  status: TransactionStatus;
}

export interface AppState {
  role: UserRole;
  services: ServiceItem[];
  gallery: GalleryItem[];
  transactions: Transaction[];
}