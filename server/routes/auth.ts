import { RequestHandler } from "express";
import { LoginRequest, RegisterRequest, AuthResponse, User } from "@shared/api";

// Mock storage for users - in a real app, this would be stored in a database with proper password hashing
const users: (User & { password: string })[] = [
  {
    id: "1",
    name: "Demo User",
    email: "demo@ruralconnect.com",
    phone: "+91 98765 43210",
    address: "Village Demo, District Example",
    createdAt: "2024-01-01T00:00:00.000Z",
    password: "demo123" // In production, this should be properly hashed
  }
];

// Mock JWT token generation (in production, use a proper JWT library)
const generateToken = (userId: string): string => {
  return `mock_token_${userId}_${Date.now()}`;
};

export const handleRegister: RequestHandler = (req, res) => {
  try {
    const { name, email, password, phone }: RegisterRequest = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: "Name, email, and password are required" 
      });
    }
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({ 
        error: "User with this email already exists" 
      });
    }
    
    // Create new user
    const newUser: User & { password: string } = {
      id: Date.now().toString(), // Simple ID generation - use UUID in production
      name,
      email,
      phone,
      createdAt: new Date().toISOString(),
      password // In production, hash this password properly
    };
    
    users.push(newUser);
    
    // Generate token
    const token = generateToken(newUser.id);
    
    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser;
    
    const response: AuthResponse = {
      user: userWithoutPassword,
      token
    };
    
    console.log("New user registered:", userWithoutPassword);
    res.status(201).json(response);
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
};

export const handleLogin: RequestHandler = (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email and password are required" 
      });
    }
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ 
        error: "Invalid email or password" 
      });
    }
    
    // Check password (in production, use proper password hashing comparison)
    if (user.password !== password) {
      return res.status(401).json({ 
        error: "Invalid email or password" 
      });
    }
    
    // Generate token
    const token = generateToken(user.id);
    
    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    
    const response: AuthResponse = {
      user: userWithoutPassword,
      token
    };
    
    console.log("User logged in:", userWithoutPassword);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Failed to login" });
  }
};

export const handleGetProfile: RequestHandler = (req, res) => {
  try {
    // In a real app, extract user ID from JWT token
    const userId = req.headers.authorization?.replace('Bearer ', '');
    
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    // Extract user ID from mock token
    const actualUserId = userId.split('_')[2];
    const user = users.find(u => u.id === actualUserId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const handleUpdateProfile: RequestHandler = (req, res) => {
  try {
    // In a real app, extract user ID from JWT token
    const userId = req.headers.authorization?.replace('Bearer ', '');
    
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    // Extract user ID from mock token
    const actualUserId = userId.split('_')[2];
    const userIndex = users.findIndex(u => u.id === actualUserId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Update user data
    const { name, phone, address } = req.body;
    if (name) users[userIndex].name = name;
    if (phone) users[userIndex].phone = phone;
    if (address) users[userIndex].address = address;
    
    // Return updated user data without password
    const { password: _, ...userWithoutPassword } = users[userIndex];
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};
