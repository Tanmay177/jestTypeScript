import { ProductService } from '../../src/services/ProductService';
import { CreateProductRequest, UpdateProductRequest } from '../../src/types';

describe('ProductService', () => {
  let productService: ProductService;

  beforeEach(() => {
    productService = new ProductService();
  });

  describe('createProduct', () => {
    it('should create a product successfully with valid data', async () => {
      const productData: CreateProductRequest = {
        name: 'Samsung Galaxy S24',
        description: 'Latest Android smartphone with 50MP camera',
        price: 79999,
        category: 'Electronics',
        stock: 100
      };

      const product = await productService.createProduct(productData);

      expect(product).toBeDefined();
      expect(product.name).toBe(productData.name);
      expect(product.description).toBe(productData.description);
      expect(product.price).toBe(productData.price);
      expect(product.category).toBe(productData.category);
      expect(product.stock).toBe(productData.stock);
      expect(product.isActive).toBe(true);
      expect(product.id).toBeDefined();
      expect(product.createdAt).toBeDefined();
      expect(product.updatedAt).toBeDefined();
    });

    it('should throw error for empty product name', async () => {
      const productData: CreateProductRequest = {
        name: '',
        description: 'A test product',
        price: 2999,
        category: 'Electronics',
        stock: 100
      };

      await expect(productService.createProduct(productData)).rejects.toThrow('Failed to create product: Product name is required');
    });

    it('should throw error for negative price', async () => {
      const productData: CreateProductRequest = {
        name: 'iPhone 15 Pro',
        description: 'Apple smartphone with titanium design',
        price: -1000,
        category: 'Electronics',
        stock: 100
      };

      await expect(productService.createProduct(productData)).rejects.toThrow('Failed to create product: Price must be greater than 0');
    });

    it('should throw error for zero price', async () => {
      const productData: CreateProductRequest = {
        name: 'OnePlus 12',
        description: 'Flagship Android smartphone',
        price: 0,
        category: 'Electronics',
        stock: 100
      };

      await expect(productService.createProduct(productData)).rejects.toThrow('Failed to create product: Price must be greater than 0');
    });

    it('should throw error for negative stock', async () => {
      const productData: CreateProductRequest = {
        name: 'MacBook Air M3',
        description: 'Apple laptop with M3 chip',
        price: 89999,
        category: 'Electronics',
        stock: -5
      };

      await expect(productService.createProduct(productData)).rejects.toThrow('Failed to create product: Stock cannot be negative');
    });

    it('should create product with zero stock', async () => {
      const productData: CreateProductRequest = {
        name: 'The Great Indian Novel',
        description: 'Classic Indian literature by Shashi Tharoor',
        price: 599,
        category: 'Books',
        stock: 0
      };

      const product = await productService.createProduct(productData);
      expect(product.stock).toBe(0);
    });
  });

  describe('getProductById', () => {
    it('should return product when found', async () => {
      const productData: CreateProductRequest = {
        name: 'Kurta Set',
        description: 'Traditional Indian kurta with pyjama',
        price: 2499,
        category: 'Clothing',
        stock: 50
      };

      const createdProduct = await productService.createProduct(productData);
      const foundProduct = await productService.getProductById(createdProduct.id);

      expect(foundProduct).toBeDefined();
      expect(foundProduct.id).toBe(createdProduct.id);
      expect(foundProduct.name).toBe(createdProduct.name);
    });

    it('should throw error when product not found', async () => {
      await expect(productService.getProductById('999')).rejects.toThrow('Product not found');
    });

    it('should throw error for empty product ID', async () => {
      await expect(productService.getProductById('')).rejects.toThrow('Product ID is required');
    });
  });

  describe('getAllProducts', () => {
    it('should return empty array when no products exist', async () => {
      const products = await productService.getAllProducts();
      expect(products).toEqual([]);
    });

    it('should return all products when multiple products exist', async () => {
      const product1: CreateProductRequest = {
        name: 'Dell Laptop',
        description: 'High-performance business laptop',
        price: 65999,
        category: 'Electronics',
        stock: 10
      };

      const product2: CreateProductRequest = {
        name: 'Wings of Fire',
        description: 'Autobiography of Dr. APJ Abdul Kalam',
        price: 299,
        category: 'Books',
        stock: 20
      };

      await productService.createProduct(product1);
      await productService.createProduct(product2);

      const products = await productService.getAllProducts();
      expect(products).toHaveLength(2);
    });
  });

  describe('getActiveProducts', () => {
    it('should return only active products', async () => {
      const product1: CreateProductRequest = {
        name: 'Sony WH-1000XM5',
        description: 'Premium noise-cancelling headphones',
        price: 24999,
        category: 'Electronics',
        stock: 5
      };

      const product2: CreateProductRequest = {
        name: 'The Immortals of Meluha',
        description: 'Mythological fiction by Amish Tripathi',
        price: 399,
        category: 'Books',
        stock: 15
      };

      const createdProduct1 = await productService.createProduct(product1);
      await productService.createProduct(product2);

      await productService.deactivateProduct(createdProduct1.id);

      const activeProducts = await productService.getActiveProducts();
      expect(activeProducts).toHaveLength(1);
      expect(activeProducts[0].name).toBe('The Immortals of Meluha');
    });
  });

  describe('getProductsByCategory', () => {
    it('should return products in specific category', async () => {
      const electronicsProduct: CreateProductRequest = {
        name: 'iPad Pro',
        description: 'Apple tablet with M2 chip',
        price: 89999,
        category: 'Electronics',
        stock: 5
      };

      const bookProduct: CreateProductRequest = {
        name: 'The Palace of Illusions',
        description: 'Mahabharata retold by Chitra Banerjee Divakaruni',
        price: 499,
        category: 'Books',
        stock: 20
      };

      await productService.createProduct(electronicsProduct);
      await productService.createProduct(bookProduct);

      const electronicsProducts = await productService.getProductsByCategory('Electronics');
      expect(electronicsProducts).toHaveLength(1);
      expect(electronicsProducts[0].category).toBe('Electronics');
    });

    it('should return empty array for non-existent category', async () => {
      const products = await productService.getProductsByCategory('NonExistent');
      expect(products).toHaveLength(0);
    });

    it('should throw error for empty category', async () => {
      await expect(productService.getProductsByCategory('')).rejects.toThrow('Category is required');
    });
  });

  describe('searchProducts', () => {
    it('should find products by name', async () => {
      const productData: CreateProductRequest = {
        name: 'Boat Airdopes',
        description: 'Wireless earbuds with active noise cancellation',
        price: 2999,
        category: 'Electronics',
        stock: 10
      };

      await productService.createProduct(productData);
      const searchResults = await productService.searchProducts('Boat');

      expect(searchResults).toHaveLength(1);
      expect(searchResults[0].name).toBe('Boat Airdopes');
    });

    it('should find products by description', async () => {
      const productData: CreateProductRequest = {
        name: 'Mi Band 8',
        description: 'Fitness tracker with heart rate monitoring',
        price: 2999,
        category: 'Electronics',
        stock: 10
      };

      await productService.createProduct(productData);
      const searchResults = await productService.searchProducts('fitness tracker');

      expect(searchResults).toHaveLength(1);
    });

    it('should find products by category', async () => {
      const productData: CreateProductRequest = {
        name: 'Saree Collection',
        description: 'Traditional Indian saree with intricate designs',
        price: 3999,
        category: 'Fashion',
        stock: 10
      };

      await productService.createProduct(productData);
      const searchResults = await productService.searchProducts('Fashion');

      expect(searchResults).toHaveLength(1);
    });

    it('should return all active products when query is empty', async () => {
      const product1: CreateProductRequest = {
        name: 'Realme GT 5',
        description: 'Gaming smartphone with Snapdragon 8 Gen 2',
        price: 35999,
        category: 'Electronics',
        stock: 10
      };

      const product2: CreateProductRequest = {
        name: 'The White Tiger',
        description: 'Booker Prize winning novel by Aravind Adiga',
        price: 399,
        category: 'Books',
        stock: 20
      };

      await productService.createProduct(product1);
      await productService.createProduct(product2);

      const searchResults = await productService.searchProducts('');
      expect(searchResults).toHaveLength(2);
    });

    it('should be case insensitive', async () => {
      const productData: CreateProductRequest = {
        name: 'Case Sensitive Product',
        description: 'A product with case sensitive name',
        price: 29.99,
        category: 'Electronics',
        stock: 10
      };

      await productService.createProduct(productData);
      const searchResults = await productService.searchProducts('case sensitive');

      expect(searchResults).toHaveLength(1);
    });

    it('should return empty array when no matches found', async () => {
      const productData: CreateProductRequest = {
        name: 'Product Name',
        description: 'A product description',
        price: 29.99,
        category: 'Electronics',
        stock: 10
      };

      await productService.createProduct(productData);
      const searchResults = await productService.searchProducts('nonexistent');

      expect(searchResults).toHaveLength(0);
    });
  });

  describe('updateProduct', () => {
    it('should update product successfully', async () => {
      const productData: CreateProductRequest = {
        name: 'Original Product',
        description: 'Original description',
        price: 29.99,
        category: 'Electronics',
        stock: 100
      };

      const createdProduct = await productService.createProduct(productData);
      const updateData: UpdateProductRequest = {
        name: 'Updated Product',
        price: 39.99,
        stock: 150
      };

      const updatedProduct = await productService.updateProduct(createdProduct.id, updateData);

      expect(updatedProduct.name).toBe('Updated Product');
      expect(updatedProduct.price).toBe(39.99);
      expect(updatedProduct.stock).toBe(150);
      expect(updatedProduct.description).toBe('Original description');
    });

    it('should throw error when updating non-existent product', async () => {
      const updateData: UpdateProductRequest = { name: 'Updated Name' };
      await expect(productService.updateProduct('999', updateData)).rejects.toThrow('Failed to update product: Product not found');
    });

    it('should throw error for empty product ID', async () => {
      const updateData: UpdateProductRequest = { name: 'Updated Name' };
      await expect(productService.updateProduct('', updateData)).rejects.toThrow('Product ID is required');
    });

    it('should throw error for negative price update', async () => {
      const productData: CreateProductRequest = {
        name: 'Test Product',
        description: 'A test product',
        price: 29.99,
        category: 'Electronics',
        stock: 100
      };

      const createdProduct = await productService.createProduct(productData);
      const updateData: UpdateProductRequest = { price: -10 };

      await expect(productService.updateProduct(createdProduct.id, updateData)).rejects.toThrow('Failed to update product: Price must be greater than 0');
    });

    it('should throw error for negative stock update', async () => {
      const productData: CreateProductRequest = {
        name: 'Test Product',
        description: 'A test product',
        price: 29.99,
        category: 'Electronics',
        stock: 100
      };

      const createdProduct = await productService.createProduct(productData);
      const updateData: UpdateProductRequest = { stock: -10 };

      await expect(productService.updateProduct(createdProduct.id, updateData)).rejects.toThrow('Failed to update product: Stock cannot be negative');
    });
  });

  describe('deleteProduct', () => {
    it('should delete product successfully', async () => {
      const productData: CreateProductRequest = {
        name: 'Delete Product',
        description: 'A product to delete',
        price: 29.99,
        category: 'Electronics',
        stock: 100
      };

      const createdProduct = await productService.createProduct(productData);
      const deleteResult = await productService.deleteProduct(createdProduct.id);

      expect(deleteResult).toBe(true);
      await expect(productService.getProductById(createdProduct.id)).rejects.toThrow('Product not found');
    });

    it('should return false when deleting non-existent product', async () => {
      const deleteResult = await productService.deleteProduct('999');
      expect(deleteResult).toBe(false);
    });

    it('should throw error for empty product ID', async () => {
      await expect(productService.deleteProduct('')).rejects.toThrow('Product ID is required');
    });
  });

  describe('updateProductStock', () => {
    it('should update stock successfully with positive quantity', async () => {
      const productData: CreateProductRequest = {
        name: 'Stock Product',
        description: 'A product for stock testing',
        price: 29.99,
        category: 'Electronics',
        stock: 100
      };

      const createdProduct = await productService.createProduct(productData);
      const updatedProduct = await productService.updateProductStock(createdProduct.id, 50);

      expect(updatedProduct.stock).toBe(150);
    });

    it('should update stock successfully with negative quantity', async () => {
      const productData: CreateProductRequest = {
        name: 'Stock Product',
        description: 'A product for stock testing',
        price: 29.99,
        category: 'Electronics',
        stock: 100
      };

      const createdProduct = await productService.createProduct(productData);
      const updatedProduct = await productService.updateProductStock(createdProduct.id, -30);

      expect(updatedProduct.stock).toBe(70);
    });

    it('should throw error for insufficient stock', async () => {
      const productData: CreateProductRequest = {
        name: 'Stock Product',
        description: 'A product for stock testing',
        price: 29.99,
        category: 'Electronics',
        stock: 100
      };

      const createdProduct = await productService.createProduct(productData);

      await expect(productService.updateProductStock(createdProduct.id, -150)).rejects.toThrow('Failed to update stock: Insufficient stock');
    });

    it('should throw error for non-existent product', async () => {
      await expect(productService.updateProductStock('999', 10)).rejects.toThrow('Failed to update stock: Product not found');
    });

    it('should throw error for empty product ID', async () => {
      await expect(productService.updateProductStock('', 10)).rejects.toThrow('Product ID is required');
    });
  });

  describe('getProductCount', () => {
    it('should return 0 when no products exist', async () => {
      const count = await productService.getProductCount();
      expect(count).toBe(0);
    });

    it('should return correct count when products exist', async () => {
      const product1: CreateProductRequest = {
        name: 'Count Product 1',
        description: 'First count product',
        price: 10.99,
        category: 'Electronics',
        stock: 10
      };

      const product2: CreateProductRequest = {
        name: 'Count Product 2',
        description: 'Second count product',
        price: 20.99,
        category: 'Books',
        stock: 20
      };

      await productService.createProduct(product1);
      await productService.createProduct(product2);

      const count = await productService.getProductCount();
      expect(count).toBe(2);
    });
  });

  describe('getProductsByPriceRange', () => {
    it('should return products within price range', async () => {
      const product1: CreateProductRequest = {
        name: 'Cheap Product',
        description: 'A cheap product',
        price: 10.99,
        category: 'Electronics',
        stock: 10
      };

      const product2: CreateProductRequest = {
        name: 'Expensive Product',
        description: 'An expensive product',
        price: 99.99,
        category: 'Electronics',
        stock: 5
      };

      await productService.createProduct(product1);
      await productService.createProduct(product2);

      const products = await productService.getProductsByPriceRange(10, 50);
      expect(products).toHaveLength(1);
      expect(products[0].name).toBe('Cheap Product');
    });

    it('should throw error for negative minimum price', async () => {
      await expect(productService.getProductsByPriceRange(-10, 50)).rejects.toThrow('Price cannot be negative');
    });

    it('should throw error for negative maximum price', async () => {
      await expect(productService.getProductsByPriceRange(10, -50)).rejects.toThrow('Price cannot be negative');
    });

    it('should throw error when minimum price is greater than maximum price', async () => {
      await expect(productService.getProductsByPriceRange(50, 10)).rejects.toThrow('Minimum price cannot be greater than maximum price');
    });
  });

  describe('deactivateProduct and activateProduct', () => {
    it('should deactivate product successfully', async () => {
      const productData: CreateProductRequest = {
        name: 'Deactivate Product',
        description: 'A product to deactivate',
        price: 29.99,
        category: 'Electronics',
        stock: 100
      };

      const createdProduct = await productService.createProduct(productData);
      const deactivatedProduct = await productService.deactivateProduct(createdProduct.id);

      expect(deactivatedProduct.isActive).toBe(false);
    });

    it('should activate product successfully', async () => {
      const productData: CreateProductRequest = {
        name: 'Activate Product',
        description: 'A product to activate',
        price: 29.99,
        category: 'Electronics',
        stock: 100
      };

      const createdProduct = await productService.createProduct(productData);
      await productService.deactivateProduct(createdProduct.id);
      const activatedProduct = await productService.activateProduct(createdProduct.id);

      expect(activatedProduct.isActive).toBe(true);
    });
  });
});
