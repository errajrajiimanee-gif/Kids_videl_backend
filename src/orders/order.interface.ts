export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}
//test
export interface OrderCustomer {
  email?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  apartment?: string;
  postalCode?: string;
  city?: string;
  phone?: string;
}

export interface Order {
  id: number;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentMethod: 'cod' | 'card';
  shippingMethod: 'casablanca' | 'hors-casablanca';
  shippingCost: number;
  currency: 'MAD';
  subtotal: number;
  total: number;
  customer: OrderCustomer;
  items: OrderItem[];
}

