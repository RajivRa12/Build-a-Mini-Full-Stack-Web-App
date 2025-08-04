import { RequestHandler } from "express";
import { Wishlist, WishlistResponse } from "@shared/api";

// Mock storage for wishlist items - in a real app, this would be stored in a database
const wishlistItems: Wishlist[] = [];

export const handleGetWishlist: RequestHandler = (req, res) => {
  try {
    // In a real app, extract user ID from JWT token
    const userId = req.headers.authorization?.replace('Bearer ', '');
    
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    // Extract user ID from mock token
    const actualUserId = userId.split('_')[2];
    
    // Filter wishlist items for the user
    const userWishlist = wishlistItems.filter(item => item.userId === actualUserId);
    
    // Sort by creation date (newest first)
    userWishlist.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    const response: WishlistResponse = {
      wishlist: userWishlist
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
};

export const handleAddToWishlist: RequestHandler = (req, res) => {
  try {
    const { productId } = req.params;
    
    // In a real app, extract user ID from JWT token
    const userId = req.headers.authorization?.replace('Bearer ', '');
    
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    // Extract user ID from mock token
    const actualUserId = userId.split('_')[2];
    
    // Check if item is already in wishlist
    const existingItem = wishlistItems.find(item => 
      item.userId === actualUserId && item.productId === productId
    );
    
    if (existingItem) {
      return res.status(409).json({ error: "Product already in wishlist" });
    }
    
    // Create new wishlist item
    const newWishlistItem: Wishlist = {
      id: Date.now().toString(),
      userId: actualUserId,
      productId,
      createdAt: new Date().toISOString()
    };
    
    wishlistItems.push(newWishlistItem);
    
    console.log("Added to wishlist:", newWishlistItem);
    res.status(201).json(newWishlistItem);
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ error: "Failed to add to wishlist" });
  }
};

export const handleRemoveFromWishlist: RequestHandler = (req, res) => {
  try {
    const { productId } = req.params;
    
    // In a real app, extract user ID from JWT token
    const userId = req.headers.authorization?.replace('Bearer ', '');
    
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    // Extract user ID from mock token
    const actualUserId = userId.split('_')[2];
    
    // Find the wishlist item
    const itemIndex = wishlistItems.findIndex(item => 
      item.userId === actualUserId && item.productId === productId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: "Product not in wishlist" });
    }
    
    // Remove from wishlist
    wishlistItems.splice(itemIndex, 1);
    
    res.status(200).json({ message: "Removed from wishlist" });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ error: "Failed to remove from wishlist" });
  }
};

export const handleCheckWishlistStatus: RequestHandler = (req, res) => {
  try {
    const { productId } = req.params;
    
    // In a real app, extract user ID from JWT token
    const userId = req.headers.authorization?.replace('Bearer ', '');
    
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    // Extract user ID from mock token
    const actualUserId = userId.split('_')[2];
    
    // Check if product is in wishlist
    const isInWishlist = wishlistItems.some(item => 
      item.userId === actualUserId && item.productId === productId
    );
    
    res.status(200).json({ isInWishlist });
  } catch (error) {
    console.error("Error checking wishlist status:", error);
    res.status(500).json({ error: "Failed to check wishlist status" });
  }
};
