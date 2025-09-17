import { User, CreateUserRequest, UpdateUserRequest } from '../types';

export class UserModel {
  private users: User[] = [];
  private nextId = 1;

  create(userData: CreateUserRequest): User {
    const existingUser = this.users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format');
    }

    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    const user: User = {
      id: this.nextId.toString(),
      email: userData.email,
      name: userData.name,
      password: userData.password,
      address: userData.address,
      phone: userData.phone,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.push(user);
    this.nextId++;
    return user;
  }

  findById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  findByEmail(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }

  findAll(): User[] {
    return [...this.users];
  }

  update(id: string, updateData: UpdateUserRequest): User {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const user = this.users[userIndex];
    const updatedUser: User = {
      ...user,
      ...updateData,
      updatedAt: new Date()
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  delete(id: string): boolean {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return false;
    }

    this.users.splice(userIndex, 1);
    return true;
  }

  authenticate(email: string, password: string): User | null {
    const user = this.findByEmail(email);
    if (!user || user.password !== password) {
      return null;
    }
    return user;
  }
}
