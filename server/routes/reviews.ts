import { RequestHandler } from "express";
import { Review, ReviewsResponse } from "@shared/api";

// Mock storage for reviews - in a real app, this would be stored in a database
const reviews: Review[] = [
  {
    id: "1",
    productId: "1",
    userId: "1",
    userName: "Farmer Rajesh",
    rating: 5,
    comment: "Excellent quality rice! My family has been using this for months. Very satisfied with the quality and delivery.",
    createdAt: "2024-01-08T10:00:00Z",
    verified: true
  },
  {
    id: "2",
    productId: "1",
    userId: "2",
    userName: "Priya Singh",
    rating: 4,
    comment: "Good quality product. Delivered on time and well packaged.",
    createdAt: "2024-01-05T15:30:00Z",
    verified: true
  },
  {
    id: "3",
    productId: "2",
    userId: "1",
    userName: "Farmer Rajesh",
    rating: 5,
    comment: "Best cooking oil in this price range. Great for daily cooking needs.",
    createdAt: "2024-01-03T09:00:00Z",
    verified: true
  }
];

export const handleGetProductReviews: RequestHandler = (req, res) => {
  try {
    const { productId } = req.params;
    
    // Filter reviews for the specific product
    const productReviews = reviews.filter(review => review.productId === productId);
    
    // Calculate average rating
    const averageRating = productReviews.length > 0 
      ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
      : 0;
    
    // Sort by creation date (newest first)
    productReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    const response: ReviewsResponse = {
      reviews: productReviews,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews: productReviews.length
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

export const handleCreateReview: RequestHandler = (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    
    // In a real app, extract user ID from JWT token
    const userId = req.headers.authorization?.replace('Bearer ', '');
    
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    // Extract user ID from mock token (in production, decode JWT properly)
    const actualUserId = userId.split('_')[2];
    
    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }
    
    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ error: "Comment is required" });
    }
    
    // Check if user already reviewed this product
    const existingReview = reviews.find(r => r.productId === productId && r.userId === actualUserId);
    if (existingReview) {
      return res.status(409).json({ error: "You have already reviewed this product" });
    }
    
    // Create new review
    const newReview: Review = {
      id: Date.now().toString(),
      productId,
      userId: actualUserId,
      userName: "Current User", // In production, get from user data
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
      verified: false // Set to true after purchase verification
    };
    
    reviews.push(newReview);
    
    console.log("New review created:", newReview);
    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Failed to create review" });
  }
};

export const handleUpdateReview: RequestHandler = (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const { rating, comment } = req.body;
    
    // In a real app, extract user ID from JWT token
    const userId = req.headers.authorization?.replace('Bearer ', '');
    
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    // Extract user ID from mock token
    const actualUserId = userId.split('_')[2];
    
    // Find the review
    const reviewIndex = reviews.findIndex(r => 
      r.id === reviewId && 
      r.productId === productId && 
      r.userId === actualUserId
    );
    
    if (reviewIndex === -1) {
      return res.status(404).json({ error: "Review not found or not authorized" });
    }
    
    // Update review
    if (rating) reviews[reviewIndex].rating = rating;
    if (comment) reviews[reviewIndex].comment = comment.trim();
    
    res.status(200).json(reviews[reviewIndex]);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Failed to update review" });
  }
};

export const handleDeleteReview: RequestHandler = (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    
    // In a real app, extract user ID from JWT token
    const userId = req.headers.authorization?.replace('Bearer ', '');
    
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    // Extract user ID from mock token
    const actualUserId = userId.split('_')[2];
    
    // Find the review
    const reviewIndex = reviews.findIndex(r => 
      r.id === reviewId && 
      r.productId === productId && 
      r.userId === actualUserId
    );
    
    if (reviewIndex === -1) {
      return res.status(404).json({ error: "Review not found or not authorized" });
    }
    
    // Delete review
    reviews.splice(reviewIndex, 1);
    
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Failed to delete review" });
  }
};
