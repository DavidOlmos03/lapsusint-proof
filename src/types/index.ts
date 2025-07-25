export interface Product {
  id: string;
  product_name: string;
  price: number;
  image_url?: string;
  description?: string;
  features?: string[];
  supported_platforms?: string;
  supported_launchers?: string;
  recommendations?: string;
  product_version?: string;
  has_spoofer?: boolean;
  language?: string;
  stock_quantity?: number;
  is_active?: boolean;
  category?: string;
}

export interface CartProduct extends Product {
  keyType: string;
  keyPrice: number;
}

export interface CartItem {
  id: string;
  product: CartProduct;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'dev';
  profile_pic?: string;
  display_name?: string;
  is_admin?: boolean;
  created_at?: string;
  last_login?: string;
  is_active?: boolean;
}