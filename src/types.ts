export interface Review {
  user: string;
  comment: string;
  rating: number;
  date: string;
}

export interface MenuItem {
  name: string;
  price: string;
  category: string;
  description?: string;
  imageUrl?: string;
}

export interface Cafe {
  id: string;
  name: string;
  description: string;
  location: string;
  rating: number;
  reviews: Review[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  features: string[]; // General features
  imageUrl?: string;
  
  // New filterable fields
  priceLevel: 'Low' | 'Medium' | 'High';
  coffeeTypes: string[];
  amenities: string[];
  isOpen: boolean;
  
  // Google Maps Data
  googleRating?: number;
  googleReviewsCount?: number;
  
  // Menu
  menu: MenuItem[];
}

export enum ViewState {
  LIST = 'LIST',
  DETAIL = 'DETAIL',
  ADD_FORM = 'ADD_FORM',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  MANAGER_DASHBOARD = 'MANAGER_DASHBOARD'
}

export interface FilterState {
  priceLevel: string | null;
  amenities: string[];
  coffeeTypes: string[];
  openNow: boolean;
  
  // Location Filters
  region: string | null;
  city: string | null;
  district: string | null;
}
