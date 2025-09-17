import { Product, CreateProductRequest, UpdateProductRequest } from '../types';
import { ProductModel } from '../models/Product';

export class ProductService {
  private productModel: ProductModel;

  constructor() {
    this.productModel = new ProductModel();
  }

  async createProduct(productData: CreateProductRequest): Promise<Product> {
    try {
      return this.productModel.create(productData);
    } catch (error) {
      throw new Error(`Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getProductById(id: string): Promise<Product> {
    if (!id || id.trim().length === 0) {
      throw new Error('Product ID is required');
    }

    const product = this.productModel.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productModel.findAll();
  }

  async getActiveProducts(): Promise<Product[]> {
    return this.productModel.findActive();
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    if (!category || category.trim().length === 0) {
      throw new Error('Category is required');
    }

    return this.productModel.findByCategory(category);
  }

  async searchProducts(query: string): Promise<Product[]> {
    if (!query || query.trim().length === 0) {
      return this.productModel.findActive();
    }

    return this.productModel.search(query);
  }

  async updateProduct(id: string, updateData: UpdateProductRequest): Promise<Product> {
    if (!id || id.trim().length === 0) {
      throw new Error('Product ID is required');
    }

    try {
      return this.productModel.update(id, updateData);
    } catch (error) {
      throw new Error(`Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    if (!id || id.trim().length === 0) {
      throw new Error('Product ID is required');
    }

    return this.productModel.delete(id);
  }

  async updateProductStock(id: string, quantity: number): Promise<Product> {
    if (!id || id.trim().length === 0) {
      throw new Error('Product ID is required');
    }

    try {
      return this.productModel.updateStock(id, quantity);
    } catch (error) {
      throw new Error(`Failed to update stock: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getProductCount(): Promise<number> {
    return this.productModel.findAll().length;
  }

  async getProductsByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    if (minPrice < 0 || maxPrice < 0) {
      throw new Error('Price cannot be negative');
    }

    if (minPrice > maxPrice) {
      throw new Error('Minimum price cannot be greater than maximum price');
    }

    return this.productModel.findActive().filter(product => 
      product.price >= minPrice && product.price <= maxPrice
    );
  }

  async deactivateProduct(id: string): Promise<Product> {
    return this.updateProduct(id, { isActive: false });
  }

  async activateProduct(id: string): Promise<Product> {
    return this.updateProduct(id, { isActive: true });
  }
}
