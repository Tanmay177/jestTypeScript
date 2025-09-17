import { User, CreateUserRequest, UpdateUserRequest } from '../types';
import { UserModel } from '../models/User';

export class UserService {
  private userModel: UserModel;

  constructor() {
    this.userModel = new UserModel();
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      return this.userModel.create(userData);
    } catch (error) {
      throw new Error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUserById(id: string): Promise<User> {
    if (!id || id.trim().length === 0) {
      throw new Error('User ID is required');
    }

    const user = this.userModel.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    if (!email || email.trim().length === 0) {
      throw new Error('Email is required');
    }

    const user = this.userModel.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async updateUser(id: string, updateData: UpdateUserRequest): Promise<User> {
    if (!id || id.trim().length === 0) {
      throw new Error('User ID is required');
    }

    try {
      return this.userModel.update(id, updateData);
    } catch (error) {
      throw new Error(`Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    if (!id || id.trim().length === 0) {
      throw new Error('User ID is required');
    }

    return this.userModel.delete(id);
  }

  async authenticateUser(email: string, password: string): Promise<User> {
    if (!email || email.trim().length === 0) {
      throw new Error('Email is required');
    }

    if (!password || password.trim().length === 0) {
      throw new Error('Password is required');
    }

    const user = this.userModel.authenticate(email, password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    return user;
  }

  async getUserCount(): Promise<number> {
    return this.userModel.findAll().length;
  }

  async searchUsers(query: string): Promise<User[]> {
    if (!query || query.trim().length === 0) {
      return this.userModel.findAll();
    }

    const lowercaseQuery = query.toLowerCase();
    return this.userModel.findAll().filter(user => 
      user.name.toLowerCase().includes(lowercaseQuery) ||
      user.email.toLowerCase().includes(lowercaseQuery)
    );
  }
}
