import { RequestHandler } from "express";
import { BookingRequest, Booking, CartItem } from "@shared/api";

// Mock storage for bookings - in a real app, this would be stored in a database
const bookings: Booking[] = [
  {
    id: "1",
    userId: "1",
    products: [
      { productId: "1", productName: "Rice (5kg)", quantity: 2, price: 250 },
      { productId: "2", productName: "Cooking Oil (1L)", quantity: 1, price: 120 }
    ],
    totalAmount: 620,
    status: "confirmed",
    createdAt: "2024-01-10T10:00:00Z",
    notes: "Deliver to main gate"
  }
];

export const handleCreateBooking: RequestHandler = (req, res) => {
  try {
    // In a real app, extract user ID from JWT token
    const userId = req.headers.authorization?.replace('Bearer ', '');
    
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    // Extract user ID from mock token
    const actualUserId = userId.split('_')[2];
    
    const { products, notes }: BookingRequest = req.body;
    
    // Validate products
    if (!products || products.length === 0) {
      return res.status(400).json({ error: "At least one product is required" });
    }
    
    // Calculate total amount
    const totalAmount = products.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create new booking
    const newBooking: Booking = {
      id: Date.now().toString(), // Simple ID generation - use UUID in production
      userId: actualUserId,
      products,
      totalAmount,
      status: "pending",
      createdAt: new Date().toISOString(),
      notes
    };
    
    bookings.push(newBooking);
    
    console.log("New booking created:", newBooking);
    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

export const handleGetUserBookings: RequestHandler = (req, res) => {
  try {
    // In a real app, extract user ID from JWT token
    const userId = req.headers.authorization?.replace('Bearer ', '');
    
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    // Extract user ID from mock token
    const actualUserId = userId.split('_')[2];
    
    // Filter bookings for the user
    const userBookings = bookings.filter(booking => booking.userId === actualUserId);
    
    // Sort by creation date (newest first)
    userBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    res.status(200).json({ bookings: userBookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

export const handleGetBooking: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers.authorization?.replace('Bearer ', '');
    
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    // Extract user ID from mock token
    const actualUserId = userId.split('_')[2];
    
    const booking = bookings.find(b => b.id === id && b.userId === actualUserId);
    
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    
    res.status(200).json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ error: "Failed to fetch booking" });
  }
};

export const handleUpdateBookingStatus: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.headers.authorization?.replace('Bearer ', '');
    
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    // Extract user ID from mock token
    const actualUserId = userId.split('_')[2];
    
    const bookingIndex = bookings.findIndex(b => b.id === id && b.userId === actualUserId);
    
    if (bookingIndex === -1) {
      return res.status(404).json({ error: "Booking not found" });
    }
    
    // Update booking status
    bookings[bookingIndex].status = status;
    
    res.status(200).json(bookings[bookingIndex]);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: "Failed to update booking" });
  }
};
