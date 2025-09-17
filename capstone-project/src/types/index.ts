export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  address?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  products: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
  address?: string;
  phone?: string;
}

export interface UpdateUserRequest {
  name?: string;
  address?: string;
  phone?: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
  isActive?: boolean;
}

export interface CreateOrderRequest {
  userId: string;
  products: OrderItem[];
  shippingAddress: string;
}

export interface UpdateOrderRequest {
  status?: OrderStatus;
  shippingAddress?: string;
}
