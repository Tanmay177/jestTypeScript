import { Order, CreateOrderRequest, UpdateOrderRequest, OrderStatus, OrderItem } from '../types';

export class OrderModel {
  private orders: Order[] = [];
  private nextId = 1;

  create(orderData: CreateOrderRequest): Order {
    if (!orderData.userId) {
      throw new Error('User ID is required');
    }

    if (!orderData.products || orderData.products.length === 0) {
      throw new Error('Order must contain at least one product');
    }

    if (!orderData.shippingAddress) {
      throw new Error('Shipping address is required');
    }

    for (const item of orderData.products) {
      if (!item.productId) {
        throw new Error('Product ID is required for all items');
      }
      if (item.quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }
      if (item.price <= 0) {
        throw new Error('Price must be greater than 0');
      }
    }

    const totalAmount = orderData.products.reduce(
      (sum, item) => sum + (item.price * item.quantity), 
      0
    );

    const order: Order = {
      id: this.nextId.toString(),
      userId: orderData.userId,
      products: [...orderData.products],
      totalAmount,
      status: OrderStatus.PENDING,
      shippingAddress: orderData.shippingAddress,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.orders.push(order);
    this.nextId++;
    return order;
  }

  findById(id: string): Order | undefined {
    return this.orders.find(o => o.id === id);
  }

  findByUserId(userId: string): Order[] {
    return this.orders.filter(o => o.userId === userId);
  }

  findAll(): Order[] {
    return [...this.orders];
  }

  findByStatus(status: OrderStatus): Order[] {
    return this.orders.filter(o => o.status === status);
  }

  update(id: string, updateData: UpdateOrderRequest): Order {
    const orderIndex = this.orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }

    const order = this.orders[orderIndex];
    
    if (updateData.status && !this.isValidStatusTransition(order.status, updateData.status)) {
      throw new Error(`Invalid status transition from ${order.status} to ${updateData.status}`);
    }

    const updatedOrder: Order = {
      ...order,
      ...updateData,
      updatedAt: new Date()
    };

    this.orders[orderIndex] = updatedOrder;
    return updatedOrder;
  }

  delete(id: string): boolean {
    const orderIndex = this.orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      return false;
    }

    this.orders.splice(orderIndex, 1);
    return true;
  }

  private isValidStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: []
    };

    return validTransitions[currentStatus].includes(newStatus);
  }
}
