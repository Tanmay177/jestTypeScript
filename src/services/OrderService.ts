import { Order, CreateOrderRequest, UpdateOrderRequest, OrderStatus, OrderItem } from '../types';
import { OrderModel } from '../models/Order';

export class OrderService {
  private orderModel: OrderModel;

  constructor() {
    this.orderModel = new OrderModel();
  }

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    try {
      return this.orderModel.create(orderData);
    } catch (error) {
      throw new Error(`Failed to create order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getOrderById(id: string): Promise<Order> {
    if (!id || id.trim().length === 0) {
      throw new Error('Order ID is required');
    }

    const order = this.orderModel.findById(id);
    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderModel.findAll();
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    if (!userId || userId.trim().length === 0) {
      throw new Error('User ID is required');
    }

    return this.orderModel.findByUserId(userId);
  }

  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    return this.orderModel.findByStatus(status);
  }

  async updateOrder(id: string, updateData: UpdateOrderRequest): Promise<Order> {
    if (!id || id.trim().length === 0) {
      throw new Error('Order ID is required');
    }

    try {
      return this.orderModel.update(id, updateData);
    } catch (error) {
      throw new Error(`Failed to update order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteOrder(id: string): Promise<boolean> {
    if (!id || id.trim().length === 0) {
      throw new Error('Order ID is required');
    }

    return this.orderModel.delete(id);
  }

  async confirmOrder(id: string): Promise<Order> {
    return this.updateOrder(id, { status: OrderStatus.CONFIRMED });
  }

  async shipOrder(id: string): Promise<Order> {
    return this.updateOrder(id, { status: OrderStatus.SHIPPED });
  }

  async deliverOrder(id: string): Promise<Order> {
    return this.updateOrder(id, { status: OrderStatus.DELIVERED });
  }

  async cancelOrder(id: string): Promise<Order> {
    return this.updateOrder(id, { status: OrderStatus.CANCELLED });
  }

  async getOrderCount(): Promise<number> {
    return this.orderModel.findAll().length;
  }

  async getOrdersByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    if (startDate > endDate) {
      throw new Error('Start date cannot be after end date');
    }

    return this.orderModel.findAll().filter(order => 
      order.createdAt >= startDate && order.createdAt <= endDate
    );
  }

  async getTotalRevenue(): Promise<number> {
    return this.orderModel.findAll().reduce((total, order) => total + order.totalAmount, 0);
  }

  async getOrdersByTotalRange(minTotal: number, maxTotal: number): Promise<Order[]> {
    if (minTotal < 0 || maxTotal < 0) {
      throw new Error('Total amount cannot be negative');
    }

    if (minTotal > maxTotal) {
      throw new Error('Minimum total cannot be greater than maximum total');
    }

    return this.orderModel.findAll().filter(order => 
      order.totalAmount >= minTotal && order.totalAmount <= maxTotal
    );
  }
}
