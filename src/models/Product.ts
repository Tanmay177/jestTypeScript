import { Product, CreateProductRequest, UpdateProductRequest } from '../types';

export class ProductModel {
  private products: Product[] = [];
  private nextId = 1;

  create(productData: CreateProductRequest): Product {
    if (!productData.name || productData.name.trim().length === 0) {
      throw new Error('Product name is required');
    }

    if (productData.price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    if (productData.stock < 0) {
      throw new Error('Stock cannot be negative');
    }

    const product: Product = {
      id: this.nextId.toString(),
      name: productData.name.trim(),
      description: productData.description,
      price: productData.price,
      category: productData.category,
      stock: productData.stock,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.products.push(product);
    this.nextId++;
    return product;
  }

  findById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  findAll(): Product[] {
    return [...this.products];
  }

  findByCategory(category: string): Product[] {
    return this.products.filter(p => p.category === category && p.isActive);
  }

  findActive(): Product[] {
    return this.products.filter(p => p.isActive);
  }

  search(query: string): Product[] {
    const lowercaseQuery = query.toLowerCase();
    return this.products.filter(p => 
      p.isActive && (
        p.name.toLowerCase().includes(lowercaseQuery) ||
        p.description.toLowerCase().includes(lowercaseQuery) ||
        p.category.toLowerCase().includes(lowercaseQuery)
      )
    );
  }

  update(id: string, updateData: UpdateProductRequest): Product {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }

    const product = this.products[productIndex];
    
    if (updateData.price !== undefined && updateData.price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    if (updateData.stock !== undefined && updateData.stock < 0) {
      throw new Error('Stock cannot be negative');
    }

    const updatedProduct: Product = {
      ...product,
      ...updateData,
      updatedAt: new Date()
    };

    this.products[productIndex] = updatedProduct;
    return updatedProduct;
  }

  delete(id: string): boolean {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return false;
    }

    this.products.splice(productIndex, 1);
    return true;
  }

  updateStock(id: string, quantity: number): Product {
    const product = this.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    const newStock = product.stock + quantity;
    if (newStock < 0) {
      throw new Error('Insufficient stock');
    }

    return this.update(id, { stock: newStock });
  }
}
