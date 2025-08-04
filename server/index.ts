import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleGetServices } from "./routes/services";
import { handleGetProducts, handleGetProduct } from "./routes/products";
import { handleGetNews, handleGetNewsItem } from "./routes/news";
import { handleContactSubmission, handleGetContactSubmissions } from "./routes/contact";
import { handleRegister, handleLogin, handleGetProfile, handleUpdateProfile } from "./routes/auth";
import { handleCreateBooking, handleGetUserBookings, handleGetBooking, handleUpdateBookingStatus } from "./routes/bookings";
import { handleGetProductReviews, handleCreateReview, handleUpdateReview, handleDeleteReview } from "./routes/reviews";
import { handleGetWishlist, handleAddToWishlist, handleRemoveFromWishlist, handleCheckWishlistStatus } from "./routes/wishlist";
import { handleGetWeather } from "./routes/weather";
import { handleGetMarketPrices, handleGetPriceHistory } from "./routes/market-prices";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Services API
  app.get("/api/services", handleGetServices);

  // Products API
  app.get("/api/products", handleGetProducts);
  app.get("/api/products/:id", handleGetProduct);

  // News API
  app.get("/api/news", handleGetNews);
  app.get("/api/news/:id", handleGetNewsItem);

  // Contact API
  app.post("/api/contact", handleContactSubmission);
  app.get("/api/contact", handleGetContactSubmissions); // Admin only in production

  // Authentication API
  app.post("/api/register", handleRegister);
  app.post("/api/login", handleLogin);
  app.get("/api/profile", handleGetProfile);
  app.put("/api/profile", handleUpdateProfile);

  // Booking API
  app.post("/api/bookings", handleCreateBooking);
  app.get("/api/bookings", handleGetUserBookings);
  app.get("/api/bookings/:id", handleGetBooking);
  app.put("/api/bookings/:id/status", handleUpdateBookingStatus);

  // Reviews API
  app.get("/api/products/:productId/reviews", handleGetProductReviews);
  app.post("/api/products/:productId/reviews", handleCreateReview);
  app.put("/api/products/:productId/reviews/:reviewId", handleUpdateReview);
  app.delete("/api/products/:productId/reviews/:reviewId", handleDeleteReview);

  // Wishlist API
  app.get("/api/wishlist", handleGetWishlist);
  app.post("/api/wishlist/:productId", handleAddToWishlist);
  app.delete("/api/wishlist/:productId", handleRemoveFromWishlist);
  app.get("/api/wishlist/:productId/status", handleCheckWishlistStatus);

  // Weather API
  app.get("/api/weather", handleGetWeather);

  // Market Prices API
  app.get("/api/market-prices", handleGetMarketPrices);
  app.get("/api/market-prices/:productName/history", handleGetPriceHistory);

  return app;
}
