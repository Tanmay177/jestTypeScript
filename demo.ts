import { UserService } from './src/services/UserService';
import { ProductService } from './src/services/ProductService';
import { OrderService } from './src/services/OrderService';
import { OrderStatus } from './src/types';

async function demonstrateServices() {
  console.log('Online Shopping Backend Demo\n');

  const userService = new UserService();
  const productService = new ProductService();
  const orderService = new OrderService();

  try {
    console.log('Creating users...');
    const user1 = await userService.createUser({
      email: 'rajesh.sharma@example.com',
      name: 'Rajesh Sharma',
      password: 'password123',
      address: '123 MG Road, Mumbai, Maharashtra 400001',
      phone: '98765-43210'
    });

    const user2 = await userService.createUser({
      email: 'priya.patel@example.com',
      name: 'Priya Patel',
      password: 'password456',
      address: '456 Brigade Road, Bangalore, Karnataka 560001',
      phone: '98765-43211'
    });

    console.log(`Created users: ${user1.name} and ${user2.name}\n`);

    console.log('Creating products...');
    const laptop = await productService.createProduct({
      name: 'Dell XPS 15',
      description: 'High-performance laptop with Intel i7 and RTX 4060',
      price: 129999,
      category: 'Electronics',
      stock: 10
    });

    const book = await productService.createProduct({
      name: 'Wings of Fire',
      description: 'Autobiography of Dr. APJ Abdul Kalam',
      price: 299,
      category: 'Books',
      stock: 50
    });

    const mouse = await productService.createProduct({
      name: 'Logitech MX Master 3',
      description: 'Premium wireless mouse with ergonomic design',
      price: 7999,
      category: 'Electronics',
      stock: 25
    });

    console.log(`Created products: ${laptop.name}, ${book.name}, ${mouse.name}\n`);

    console.log('Searching for electronics...');
    const electronics = await productService.getProductsByCategory('Electronics');
    console.log(`Found ${electronics.length} electronics products:`);
    electronics.forEach(product => {
      console.log(`  - ${product.name}: ₹${product.price}`);
    });
    console.log();

    console.log('Creating orders...');
    const order1 = await orderService.createOrder({
      userId: user1.id,
      products: [
        { productId: laptop.id, quantity: 1, price: laptop.price },
        { productId: book.id, quantity: 2, price: book.price }
      ],
      shippingAddress: user1.address!
    });

    const order2 = await orderService.createOrder({
      userId: user2.id,
      products: [
        { productId: mouse.id, quantity: 3, price: mouse.price }
      ],
      shippingAddress: user2.address!
    });

    console.log(`Created orders: Order #${order1.id} (₹${order1.totalAmount}) and Order #${order2.id} (₹${order2.totalAmount})\n`);

    console.log('Processing orders...');
    await orderService.confirmOrder(order1.id);
    await orderService.shipOrder(order1.id);
    await orderService.deliverOrder(order1.id);

    await orderService.confirmOrder(order2.id);
    await orderService.shipOrder(order2.id);

    console.log('Order processing completed\n');

    console.log('Order statuses:');
    const pendingOrders = await orderService.getOrdersByStatus(OrderStatus.PENDING);
    const shippedOrders = await orderService.getOrdersByStatus(OrderStatus.SHIPPED);
    const deliveredOrders = await orderService.getOrdersByStatus(OrderStatus.DELIVERED);

    console.log(`  - Pending: ${pendingOrders.length}`);
    console.log(`  - Shipped: ${shippedOrders.length}`);
    console.log(`  - Delivered: ${deliveredOrders.length}\n`);

    const totalRevenue = await orderService.getTotalRevenue();
    console.log(`Total Revenue: ₹${totalRevenue.toFixed(2)}\n`);

    console.log('Searching users...');
    const searchResults = await userService.searchUsers('Rajesh');
    console.log(`Found ${searchResults.length} users matching "Rajesh":`);
    searchResults.forEach(user => {
      console.log(`  - ${user.name} (${user.email})`);
    });
    console.log();

    console.log('Searching products...');
    const productSearch = await productService.searchProducts('Dell');
    console.log(`Found ${productSearch.length} products matching "Dell":`);
    productSearch.forEach(product => {
      console.log(`  - ${product.name}: ₹${product.price}`);
    });
    console.log();

    console.log('Statistics:');
    const userCount = await userService.getUserCount();
    const productCount = await productService.getProductCount();
    const orderCount = await orderService.getOrderCount();

    console.log(`  - Total Users: ${userCount}`);
    console.log(`  - Total Products: ${productCount}`);
    console.log(`  - Total Orders: ${orderCount}`);

    console.log('\nDemo completed successfully!');

  } catch (error) {
    console.error('Error during demo:', error);
  }
}
demonstrateServices();
