import { UserService } from '../../src/services/UserService';
import { CreateUserRequest, UpdateUserRequest } from '../../src/types';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  }); 

  describe('createUser', () => {
    it('should create a user successfully with valid data', async () => {
      const userData: CreateUserRequest = {
        email: 'rajesh.sharma@example.com',
        name: 'Rajesh Sharma',
        password: 'password123',
        address: '123 MG Road, Mumbai, Maharashtra 400001',
        phone: '98765-43210'
      };

      const user = await userService.createUser(userData);

      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.name).toBe(userData.name);
      expect(user.address).toBe(userData.address);
      expect(user.phone).toBe(userData.phone);
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('should create a user with minimal required data', async () => {
      const userData: CreateUserRequest = {
        email: 'priya.patel@example.com',
        name: 'Priya Patel',
        password: 'password123'
      };

      const user = await userService.createUser(userData);

      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.name).toBe(userData.name);
      expect(user.address).toBeUndefined();
      expect(user.phone).toBeUndefined();
    });

    it('should throw error when email already exists', async () => {
      const userData: CreateUserRequest = {
        email: 'arjun.singh@example.com',
        name: 'Arjun Singh',
        password: 'password123'
      };

      await userService.createUser(userData);

      await expect(userService.createUser(userData)).rejects.toThrow('Failed to create user: User with this email already exists');
    });

    it('should throw error for invalid email format', async () => {
      const userData: CreateUserRequest = {
        email: 'invalid-email',
        name: 'Vikram Kumar',
        password: 'password123'
      };

      await expect(userService.createUser(userData)).rejects.toThrow('Failed to create user: Invalid email format');
    });

    it('should throw error for password too short', async () => {
      const userData: CreateUserRequest = {
        email: 'suresh.gupta@example.com',
        name: 'Suresh Gupta',
        password: '123'
      };

      await expect(userService.createUser(userData)).rejects.toThrow('Failed to create user: Password must be at least 6 characters long');
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const userData: CreateUserRequest = {
        email: 'anita.desai@example.com',
        name: 'Anita Desai',
        password: 'password123'
      };

      const createdUser = await userService.createUser(userData);
      const foundUser = await userService.getUserById(createdUser.id);

      expect(foundUser).toBeDefined();
      expect(foundUser.id).toBe(createdUser.id);
      expect(foundUser.email).toBe(createdUser.email);
    });

    it('should throw error when user not found', async () => {
      await expect(userService.getUserById('999')).rejects.toThrow('User not found');
    });

    it('should throw error for empty user ID', async () => {
      await expect(userService.getUserById('')).rejects.toThrow('User ID is required');
    });

    it('should throw error for null user ID', async () => {
      await expect(userService.getUserById(null as any)).rejects.toThrow('User ID is required');
    });
  });

  describe('getUserByEmail', () => {
    it('should return user when found by email', async () => {
      const userData: CreateUserRequest = {
        email: 'deepak.joshi@example.com',
        name: 'Deepak Joshi',
        password: 'password123'
      };

      const createdUser = await userService.createUser(userData);
      const foundUser = await userService.getUserByEmail(createdUser.email);

      expect(foundUser).toBeDefined();
      expect(foundUser.email).toBe(createdUser.email);
    });

    it('should throw error when user not found by email', async () => {
      await expect(userService.getUserByEmail('nonexistent@example.com')).rejects.toThrow('User not found');
    });

    it('should throw error for empty email', async () => {
      await expect(userService.getUserByEmail('')).rejects.toThrow('Email is required');
    });
  });

  describe('getAllUsers', () => {
    it('should return empty array when no users exist', async () => {
      const users = await userService.getAllUsers();
      expect(users).toEqual([]);
    });

    it('should return all users when multiple users exist', async () => {
      const user1: CreateUserRequest = {
        email: 'rohit.sharma@example.com',
        name: 'Rohit Sharma',
        password: 'password123'
      };

      const user2: CreateUserRequest = {
        email: 'kavya.reddy@example.com',
        name: 'Kavya Reddy',
        password: 'password123'
      };

      await userService.createUser(user1);
      await userService.createUser(user2);

      const users = await userService.getAllUsers();
      expect(users).toHaveLength(2);
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const userData: CreateUserRequest = {
        email: 'manish.verma@example.com',
        name: 'Manish Verma',
        password: 'password123'
      };

      const createdUser = await userService.createUser(userData);
      const updateData: UpdateUserRequest = {
        name: 'Manish Kumar Verma',
        address: '456 Brigade Road, Bangalore, Karnataka 560001'
      };

      const updatedUser = await userService.updateUser(createdUser.id, updateData);

      expect(updatedUser.name).toBe('Manish Kumar Verma');
      expect(updatedUser.address).toBe('456 Brigade Road, Bangalore, Karnataka 560001');
      expect(updatedUser.email).toBe(createdUser.email);
    });

    it('should throw error when updating non-existent user', async () => {
      const updateData: UpdateUserRequest = { name: 'Ravi Kumar' };
      await expect(userService.updateUser('999', updateData)).rejects.toThrow('Failed to update user: User not found');
    });

    it('should throw error for empty user ID', async () => {
      const updateData: UpdateUserRequest = { name: 'Ravi Kumar' };
      await expect(userService.updateUser('', updateData)).rejects.toThrow('User ID is required');
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const userData: CreateUserRequest = {
        email: 'neha.agarwal@example.com',
        name: 'Neha Agarwal',
        password: 'password123'
      };

      const createdUser = await userService.createUser(userData);
      const deleteResult = await userService.deleteUser(createdUser.id);

      expect(deleteResult).toBe(true);
      await expect(userService.getUserById(createdUser.id)).rejects.toThrow('User not found');
    });

    it('should return false when deleting non-existent user', async () => {
      const deleteResult = await userService.deleteUser('999');
      expect(deleteResult).toBe(false);
    });

    it('should throw error for empty user ID', async () => {
      await expect(userService.deleteUser('')).rejects.toThrow('User ID is required');
    });
  });

  describe('authenticateUser', () => {
    it('should authenticate user with valid credentials', async () => {
      const userData: CreateUserRequest = {
        email: 'pradeep.yadav@example.com',
        name: 'Pradeep Yadav',
        password: 'password123'
      };

      await userService.createUser(userData);
      const authenticatedUser = await userService.authenticateUser(userData.email, userData.password);

      expect(authenticatedUser).toBeDefined();
      expect(authenticatedUser.email).toBe(userData.email);
    });

    it('should throw error for invalid email', async () => {
      await expect(userService.authenticateUser('invalid@example.com', 'password123')).rejects.toThrow('Invalid credentials');
    });

    it('should throw error for invalid password', async () => {
      const userData: CreateUserRequest = {
        email: 'sunita.mishra@example.com',
        name: 'Sunita Mishra',
        password: 'password123'
      };

      await userService.createUser(userData);
      await expect(userService.authenticateUser(userData.email, 'wrongpassword')).rejects.toThrow('Invalid credentials');
    });

    it('should throw error for empty email', async () => {
      await expect(userService.authenticateUser('', 'password123')).rejects.toThrow('Email is required');
    });

    it('should throw error for empty password', async () => {
      await expect(userService.authenticateUser('rajesh@example.com', '')).rejects.toThrow('Password is required');
    });
  });

  describe('getUserCount', () => {
    it('should return 0 when no users exist', async () => {
      const count = await userService.getUserCount();
      expect(count).toBe(0);
    });

    it('should return correct count when users exist', async () => {
      const user1: CreateUserRequest = {
        email: 'amit.kumar@example.com',
        name: 'Amit Kumar',
        password: 'password123'
      };

      const user2: CreateUserRequest = {
        email: 'shilpa.singh@example.com',
        name: 'Shilpa Singh',
        password: 'password123'
      };

      await userService.createUser(user1);
      await userService.createUser(user2);

      const count = await userService.getUserCount();
      expect(count).toBe(2);
    });
  });

  describe('searchUsers', () => {
    it('should return all users when query is empty', async () => {
      const userData: CreateUserRequest = {
        email: 'gaurav.sharma@example.com',
        name: 'Gaurav Sharma',
        password: 'password123'
      };

      await userService.createUser(userData);
      const users = await userService.searchUsers('');

      expect(users).toHaveLength(1);
    });

    it('should find users by name', async () => {
      const userData: CreateUserRequest = {
        email: 'rajesh.kumar@example.com',
        name: 'Rajesh Kumar',
        password: 'password123'
      };

      await userService.createUser(userData);
      const users = await userService.searchUsers('Rajesh');

      expect(users).toHaveLength(1);
      expect(users[0].name).toBe('Rajesh Kumar');
    });

    it('should find users by email', async () => {
      const userData: CreateUserRequest = {
        email: 'priyanka.patel@example.com',
        name: 'Priyanka Patel',
        password: 'password123'
      };

      await userService.createUser(userData);
      const users = await userService.searchUsers('priyanka');

      expect(users).toHaveLength(1);
      expect(users[0].email).toBe('priyanka.patel@example.com');
    });

    it('should return empty array when no matches found', async () => {
      const userData: CreateUserRequest = {
        email: 'vishal.gupta@example.com',
        name: 'Vishal Gupta',
        password: 'password123'
      };

      await userService.createUser(userData);
      const users = await userService.searchUsers('nonexistent');

      expect(users).toHaveLength(0);
    });

    it('should be case insensitive', async () => {
      const userData: CreateUserRequest = {
        email: 'anil.kapoor@example.com',
        name: 'Anil Kapoor',
        password: 'password123'
      };

      await userService.createUser(userData);
      const users = await userService.searchUsers('anil kapoor');

      expect(users).toHaveLength(1);
    });
  });
});
