export interface Product {
  id: string | number;
  name: string;
  category: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface Category {
  id: string | number;
  name: string;
  image: string;
  itemCount: number;
}

export interface Testimonial {
  id: string | number;
  name: string;
  role: string;
  comment: string;
  avatar: string;
  rating: number; // Integer 1–5
}