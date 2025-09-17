import { OrderService } from '../../src/services/OrderService';
import { CreateOrderRequest, UpdateOrderRequest, OrderStatus, OrderItem } from '../../src/types';

describe('OrderService', () => {
  let orderService: OrderService;

  beforeEach(() => {
    orderService = new OrderService();
  });

  describe('createOrder', () => {
    it('should create an order successfully with valid data', async () => {
      const orderData: CreateOrderRequest = {
        userId: 'user123',
        products: [
          { productId: 'prod1', quantity: 2, price: 299.99 },
          { productId: 'prod2', quantity: 1, price: 199.99 }
        ],
        shippingAddress: '123 Gachibowli St, Hyderabad, Telangana 12345'
      };

      const order = await orderService.createOrder(orderData);

      expect(order).toBeDefined();
      expect(order.userId).toBe(orderData.userId);
      expect(order.products).toHaveLength(2);
      expect(order.totalAmount).toBe(799.97);
      expect(order.status).toBe(OrderStatus.PENDING);
      expect(order.shippingAddress).toBe(orderData.shippingAddress);
      expect(order.id).toBeDefined();
      expect(order.createdAt).toBeDefined();
      expect(order.updatedAt).toBeDefined();
    });

    it('should throw error for missing user ID', async () => {
      const orderData: CreateOrderRequest = {
        userId: '',
        products: [{ productId: 'prod1', quantity: 1, price: 29.99 }],
        shippingAddress: '123 Main St'
      };

      await expect(orderService.createOrder(orderData)).rejects.toThrow('Failed to create order: User ID is required');
    });

    it('should throw error for empty products array', async () => {
      const orderData: CreateOrderRequest = {
        userId: 'user123',
        products: [],
        shippingAddress: '123 Main St'
      };

      await expect(orderService.createOrder(orderData)).rejects.toThrow('Failed to create order: Order must contain at least one product');
    });

    it('should throw error for missing shipping address', async () => {
      const orderData: CreateOrderRequest = {
        userId: 'user123',
        products: [{ productId: 'prod1', quantity: 1, price: 29.99 }],
        shippingAddress: ''
      };

      await expect(orderService.createOrder(orderData)).rejects.toThrow('Failed to create order: Shipping address is required');
    });

    it('should throw error for invalid product quantity', async () => {
      const orderData: CreateOrderRequest = {
        userId: 'user123',
        products: [{ productId: 'prod1', quantity: 0, price: 29.99 }],
        shippingAddress: '123 Main St'
      };

      await expect(orderService.createOrder(orderData)).rejects.toThrow('Failed to create order: Quantity must be greater than 0');
    });

    it('should throw error for invalid product price', async () => {
      const orderData: CreateOrderRequest = {
        userId: 'user123',
        products: [{ productId: 'prod1', quantity: 1, price: -10 }],
        shippingAddress: '123 Main St'
      };

      await expect(orderService.createOrder(orderData)).rejects.toThrow('Failed to create order: Price must be greater than 0');
    });

    it('should throw error for missing product ID', async () => {
      const orderData: CreateOrderRequest = {
        userId: 'user123',
        products: [{ productId: '', quantity: 1, price: 29.99 }],
        shippingAddress: '123 Main St'
      };

      await expect(orderService.createOrder(orderData)).rejects.toThrow('Failed to create order: Product ID is required for all items');
    });
  });

  describe('getOrderById', () => {
    it('should return order when found', async () => {
      const orderData: CreateOrderRequest = {
        userId: 'user123',
        products: [{ productId: 'prod1', quantity: 1, price: 29.99 }],
        shippingAddress: '123 Main St'
      };

      const createdOrder = await orderService.createOrder(orderData);
      const foundOrder = await orderService.getOrderById(createdOrder.id);

      expect(foundOrder).toBeDefined();
      expect(foundOrder.id).toBe(createdOrder.id);
      expect(foundOrder.userId).toBe(createdOrder.userId);
    });

    it('should throw error when order not found', async () => {
      await expect(orderService.getOrderById('999')).rejects.toThrow('Order not found');
    });

    it('should throw error for empty order ID', async () => {
      await expect(orderService.getOrderById('')).rejects.toThrow('Order ID is required');
    });
  });

  describe('getAllOrders', () => {
    it('should return empty array when no orders exist', async () => {
      const orders = await orderService.getAllOrders();
      expect(orders).toEqual([]);
    });

    it('should return all orders when multiple orders exist', async () => {
      const order1: CreateOrderRequest = {
        userId: 'user1',
        products: [{ productId: 'prod1', quantity: 1, price: 29.99 }],
        shippingAddress: '123 Main St'
      };

      const order2: CreateOrderRequest = {
        userId: 'user2',
        products: [{ productId: 'prod2', quantity: 2, price: 19.99 }],
        shippingAddress: '456 Oak Ave'
      };

      await orderService.createOrder(order1);
      await orderService.createOrder(order2);

      const orders = await orderService.getAllOrders();
      expect(orders).toHaveLength(2);
    });
  });

  describe('getOrdersByUserId', () => {
    it('should return orders for specific user', async () => {
      const order1: CreateOrderRequest = {
        userId: 'user123',
        products: [{ productId: 'prod1', quantity: 1, price: 29.99 }],
        shippingAddress: '123 Main St'
      };

      const order2: CreateOrderRequest = {
        userId: 'user456',
        products: [{ productId: 'prod2', quantity: 1, price: 19.99 }],
        shippingAddress: '456 Oak Ave'
      };

      await orderService.createOrder(order1);
      await orderService.createOrder(order2);

      const userOrders = await orderService.getOrdersByUserId('user123');
      expect(userOrders).toHaveLength(1);
      expect(userOrders[0].userId).toBe('user123');
    });

    it('should return empty array for user with no orders', async () => {
      const orders = await orderService.getOrdersByUserId('nonexistent');
      expect(orders).toHaveLength(0);
    });

    it('should throw error for empty user ID', async () => {
      await expect(orderService.getOrdersByUserId('')).rejects.toThrow('User ID is required');
    });
  });

  describe('getOrdersByStatus', () => {
    it('should return orders with specific status', async () => {
      const orderData: CreateOrderRequest = {
        userId: 'user123',
        products: [{ productId: 'prod1', quantity: 1, price: 29.99 }],
        shippingAddress: '123 Main St'
      };

      const createdOrder = await orderService.createOrder(orderData);
      await orderService.confirmOrder(createdOrder.id);

      const confirmedOrders = await orderService.getOrdersByStatus(OrderStatus.CONFIRMED);
      expect(confirmedOrders).toHaveLength(1);
      expect(confirmedOrders[0].status).toBe(OrderStatus.CONFIRMED);
    });

    it('should return empty array for status with no orders', async () => {
      const orders = await orderService.getOrdersByStatus(OrderStatus.SHIPPED);
      expect(orders).toHaveLength(0);
    });
  });

  describe('updateOrder', () => {
    it('should update order successfully', async () => {
      const orderData: CreateOrderRequest = {
        userId: 'user123',
        products: [{ productId: 'prod1', quantity: 1, price: 29.99 }],
        shippingAddress: '123 Main St'
      };

      const createdOrder = await orderService.createOrder(orderData);
      const updateData: UpdateOrderRequest = {
        status: OrderStatus.CONFIRMED,
        shippingAddress: '456 Updated St'
      };

      const updatedOrder = await orderService.updateOrder(createdOrder.id, updateData);

      expect(updatedOrder.status).toBe(OrderStatus.CONFIRMED);
      expect(updatedOrder.shippingAddress).toBe('456 Updated St');
    });

    it('should throw error when updating non-existent order', async () => {
      const updateData: UpdateOrderRequest = { status: OrderStatus.CONFIRMED };
      await expect(orderService.updateOrder('999', updateData)).rejects.toThrow('Failed to update order: Order not found');
    });

    it('should throw error for empty order ID', async () => {
      const updateData: UpdateOrderRequest = { status: OrderStatus.CONFIRMED };
      await expect(orderService.updateOrder('', updateData)).rejects.toThrow('Order ID is required');
    });

    it('should throw error for invalid status transition', async () => {
      const orderData: CreateOrderRequest = {
        userId: 'user123',
        products: [{ productId: 'prod1', quantity: 1, price: 29.99 }],
        shippingAddress: '123 Main St'
      };

      const createdOrder = await orderService.createOrder(orderData);
      await orderService.confirmOrder(createdOrder.id);
      await orderService.shipOrder(createdOrder.id);
      await orderService.deliverOrder(createdOrder.id);

      await expect(orderService.updateOrder(createdOrder.id, { status: OrderStatus.PENDING })).rejects.toThrow('Failed to update order: Invalid status transition from DELIVERED to PENDING');
    });
  });

  describe('deleteOrder', () => {
    it('should delete order successfully', async () => {
      const orderData: CreateOrderRequest = {
        userId: 'user123',
        products: [{ productId: 'prod1', quantity: 1, price: 29.99 }],
        shippingAddress: '123 Main St'
      };

      const createdOrder = await orderService.createOrder(orderData);
      const deleteResult = await orderService.deleteOrder(createdOrder.id);

      expect(deleteResult).toBe(true);
      await expect(orderService.getOrderById(createdOrder.id)).rejects.toThrow('Order not found');
    });

    it('should return false when deleting non-existent order', async () => {
      const deleteResult = await orderService.deleteOrder('999');
      expect(deleteResult).toBe(false);
    });

    it('should throw error for empty order ID', async () => {
      await expect(orderService.deleteOrder('')).rejects.toThrow('Order ID is required');
    });
  });

  describe('order status transitions', () => {
    it('should confirm order successfully', async () => {
      const orderData: CreateOrderRequest = {
        userId: 'user123',
        products: [{ productId: 'prod1', quantity: 1, price: 29.99 }],
        shippingAddress: '123 Main St'
      };

      const createdOrder = await orderService.createOrder(orderData);
      const confirmedOrder = await orderService.confirmOrder(createdOrder.id);

      expect(confirmedOrder.status).toBe(OrderStatus.CONFIRMED);
    });

    it('should ship order successfully', async () => {
      const orderData: CreateOrderRequest = {
        userId: 'user123',
        products: [{ productId: 'prod1', quantity: 1, price: 29.99 }],
        shippingAddress: '123 Main St'
      };

      const createdOrder = await orderService.createOrder(orderData);
      await orderService.confirmOrder(createdOrder.id);
      const shippedOrder = await orderService.shipOrder(createdOrder.id);

      expect(shippedOrder.status).toBe(OrderStatus.SHIPPED);
    });

    it('should deliver order successfully', async () => {
      const orderData: CreateOrderRequest = {
        userId: 'user123',
        products: [{ productId: 'prod1', quantity: 1, price: 29.99 }],
        shippingAddress: '123 Main St'
      };

      const createdOrder = await orderService.createOrder(orderData);
      await orderService.confirmOrder(createdOrder.id);
      await orderService.shipOrder(createdOrder.id);
      const deliveredOrder = await orderService.deliverOrder(createdOrder.id);

      expect(deliveredOrder.status).toBe(OrderStatus.DELIVERED);
    });

    it('should cancel order from pending status', async () => {
      const orderData: CreateOrderRequest = {
        userId: 'user123',
        products: [{ productId: 'prod1', quantity: 1, price: 29.99 }],
        shippingAddress: '123 Main St'
      };

      const createdOrder = await orderService.createOrder(orderData);
      const cancelledOrder = await orderService.cancelOrder(createdOrder.id);

      expect(cancelledOrder.status).toBe(OrderStatus.CANCELLED);
    });

    it('should cancel order from confirmed status', async () => {
      const orderData: CreateOrderRequest = {
        userId: 'user123',
        products: [{ productId: 'prod1', quantity: 1, price: 29.99 }],
        shippingAddress: '123 Main St'
      };

      const createdOrder = await orderService.createOrder(orderData);
      await orderService.confirmOrder(createdOrder.id);
      const cancelledOrder = await orderService.cancelOrder(createdOrder.id);

      expect(cancelledOrder.status).toBe(OrderStatus.CANCELLED);
    });

    it('should throw error when trying to cancel shipped order', async () => {
      const orderData: CreateOrderRequest = {
        userId: 'user123',
        products: [{ productId: 'prod1', quantity: 1, price: 29.99 }],
        shippingAddress: '123 Main St'
      };

      const createdOrder = await orderService.createOrder(orderData);
      await orderService.confirmOrder(createdOrder.id);
      await orderService.shipOrder(createdOrder.id);

      await expect(orderService.cancelOrder(createdOrder.id)).rejects.toThrow('Failed to update order: Invalid status transition from SHIPPED to CANCELLED');
    });
  });

  describe('getOrderCount', () => {
    it('should return 0 when no orders exist', async () => {
      const count = await orderService.getOrderCount();
      expect(count).toBe(0);
    });

    it('should return correct count when orders exist', async () => {
      const order1: CreateOrderRequest = {
        userId: 'user1',
        products: [{ productId: 'prod1', quantity: 1, price: 29.99 }],
        shippingAddress: '123 random Street'
      };

      const order2: CreateOrderRequest = {
        userId: 'user2',
        products: [{ productId: 'prod2', quantity: 1, price: 19.99 }],
        shippingAddress: '123 random Street'
      };

      await orderService.createOrder(order1);
      await orderService.createOrder(order2);

      const count = await orderService.getOrderCount();
      expect(count).toBe(2);
    });
  });

  describe('getOrdersByDateRange', () => {
    it('should return orders within date range', async () => {
      const orderData: CreateOrderRequest = {
        userId: 'user123',
        products: [{ productId: 'prod1', quantity: 1, price: 29.99 }],
        shippingAddress: '123 random Street'
      };

      await orderService.createOrder(orderData);

      const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const endDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const orders = await orderService.getOrdersByDateRange(startDate, endDate);
      expect(orders).toHaveLength(1);
    });

    it('should return empty array when no orders in date range', async () => {
      const startDate = new Date(Date.now() - 48 * 60 * 60 * 1000);
      const endDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const orders = await orderService.getOrdersByDateRange(startDate, endDate);
      expect(orders).toHaveLength(0);
    });

    it('should throw error when start date is after end date', async () => {
      const startDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const endDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

      await expect(orderService.getOrdersByDateRange(startDate, endDate)).rejects.toThrow('Start date cannot be after end date');
    });
  });

  describe('getTotalRevenue', () => {
    it('should return 0 when no orders exist', async () => {
      const revenue = await orderService.getTotalRevenue();
      expect(revenue).toBe(0);
    });

    it('should return correct total revenue', async () => {
      const order1: CreateOrderRequest = {
        userId: 'user1',
        products: [{ productId: 'prod1', quantity: 2, price: 29.99 }],
        shippingAddress: '123 random Street'
      };

      const order2: CreateOrderRequest = {
        userId: 'user2',
        products: [{ productId: 'prod2', quantity: 1, price: 19.99 }],
        shippingAddress: '123 random Street'
      };

      await orderService.createOrder(order1);
      await orderService.createOrder(order2);

      const revenue = await orderService.getTotalRevenue();
      expect(revenue).toBe(79.97);
    });
  });

  describe('getOrdersByTotalRange', () => {
    it('should return orders within total range', async () => {
      const order1: CreateOrderRequest = {
        userId: 'user1',
        products: [{ productId: 'prod1', quantity: 1, price: 29.99 }],
        shippingAddress: '123 random Street'
      };

      const order2: CreateOrderRequest = {
        userId: 'user2',
        products: [{ productId: 'prod2', quantity: 1, price: 99.99 }],
        shippingAddress: '123 random Street'
      };

      await orderService.createOrder(order1);
      await orderService.createOrder(order2);

      const orders = await orderService.getOrdersByTotalRange(20, 50);
      expect(orders).toHaveLength(1);
      expect(orders[0].totalAmount).toBe(29.99);
    });

    it('should throw error for negative minimum total', async () => {
      await expect(orderService.getOrdersByTotalRange(-10, 50)).rejects.toThrow('Total amount cannot be negative');
    });

    it('should throw error for negative maximum total', async () => {
      await expect(orderService.getOrdersByTotalRange(10, -50)).rejects.toThrow('Total amount cannot be negative');
    });

    it('should throw error when minimum total is greater than maximum total', async () => {
      await expect(orderService.getOrdersByTotalRange(50, 10)).rejects.toThrow('Minimum total cannot be greater than maximum total');
    });
  });
});
