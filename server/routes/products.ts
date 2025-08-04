import { RequestHandler } from "express";
import { ProductsResponse, Product } from "@shared/api";

// Mock data for products - in a real app, this would come from a database
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Basmati Rice (5kg)",
    price: 280,
    discountPrice: 250,
    description: "Premium quality basmati rice, aged for 2 years. Long grains with excellent aroma and taste. Perfect for biryanis and special occasions.",
    category: "Grocery",
    image: "🌾",
    images: ["🌾", "🍚", "🌾"],
    inStock: true,
    brand: "Rural Fresh",
    weight: "5 kg",
    dimensions: "25cm x 15cm x 8cm",
    tags: ["organic", "premium", "aged"],
    averageRating: 4.5,
    reviewCount: 12
  },
  {
    id: "2",
    name: "Cold Pressed Sunflower Oil (1L)",
    price: 140,
    discountPrice: 120,
    description: "Pure cold-pressed sunflower cooking oil. Heart-healthy with high vitamin E content. No chemicals or preservatives added.",
    category: "Grocery",
    image: "🫒",
    images: ["🫒", "🌻"],
    inStock: true,
    brand: "Nature's Best",
    weight: "1 L",
    dimensions: "8cm x 8cm x 25cm",
    tags: ["cold-pressed", "natural", "healthy"],
    averageRating: 4.3,
    reviewCount: 8
  },
  {
    id: "3",
    name: "Paracetamol Tablets",
    price: 25,
    description: "Pain relief medicine, 500mg tablets. Effective for fever, headache, and body pain. Pack of 10 tablets.",
    category: "Medicine",
    image: "💊",
    inStock: true,
    brand: "HealthCare Plus",
    weight: "50g",
    tags: ["pain-relief", "fever", "tablets"],
    averageRating: 4.0,
    reviewCount: 3
  },
  {
    id: "4",
    name: "Professional Hand Plow",
    price: 950,
    discountPrice: 850,
    description: "Traditional farming tool with modern durability. Made from high-quality steel with ergonomic wooden handle. Perfect for small-scale farming.",
    category: "Tools",
    image: "🔨",
    images: ["🔨", "⚒️"],
    inStock: true,
    brand: "FarmTech",
    weight: "2.5 kg",
    dimensions: "120cm x 20cm x 15cm",
    tags: ["farming", "durable", "steel"],
    averageRating: 4.7,
    reviewCount: 15
  },
  {
    id: "5",
    name: "Seasonal Vegetable Seeds Mix",
    price: 45,
    description: "Variety pack of seasonal vegetable seeds including tomato, onion, spinach, and carrot. Hybrid quality with high yield potential.",
    category: "Agriculture",
    image: "🌱",
    images: ["🌱", "🥕", "🍅"],
    inStock: true,
    brand: "Green Harvest",
    weight: "100g",
    tags: ["seeds", "vegetables", "hybrid"],
    averageRating: 4.2,
    reviewCount: 6
  },
  {
    id: "6",
    name: "Complete First Aid Kit",
    price: 200,
    discountPrice: 180,
    description: "Comprehensive medical emergency kit with bandages, antiseptic, thermometer, and basic medicines. Essential for every household.",
    category: "Medicine",
    image: "🏥",
    images: ["🏥", "🩹"],
    inStock: false,
    brand: "SafeCare",
    weight: "800g",
    dimensions: "25cm x 18cm x 10cm",
    tags: ["emergency", "medical", "safety"],
    averageRating: 4.4,
    reviewCount: 9
  },
  {
    id: "7",
    name: "Stone Ground Wheat Flour (10kg)",
    price: 420,
    discountPrice: 380,
    description: "Fresh stone-ground wheat flour from local farms. Rich in fiber and nutrients. Perfect for making chapatis, breads, and traditional foods.",
    category: "Grocery",
    image: "🌾",
    images: ["🌾", "🍞"],
    inStock: true,
    brand: "Mill Fresh",
    weight: "10 kg",
    dimensions: "40cm x 25cm x 15cm",
    tags: ["stone-ground", "fresh", "nutritious"],
    averageRating: 4.6,
    reviewCount: 11
  },
  {
    id: "8",
    name: "Organic Compost Fertilizer (5kg)",
    price: 220,
    description: "100% organic compost fertilizer made from farm waste. Rich in nutrients for healthier soil and better crop growth.",
    category: "Agriculture",
    image: "🌱",
    images: ["🌱", "🌿"],
    inStock: true,
    brand: "EcoGrow",
    weight: "5 kg",
    dimensions: "30cm x 20cm x 10cm",
    tags: ["organic", "compost", "eco-friendly"],
    averageRating: 4.1,
    reviewCount: 7
  },
  {
    id: "9",
    name: "Digital Blood Pressure Monitor",
    price: 1200,
    discountPrice: 980,
    description: "Easy-to-use digital blood pressure monitor with large display. Accurate readings with memory function for tracking health.",
    category: "Medicine",
    image: "🩺",
    inStock: true,
    brand: "HealthTech",
    weight: "600g",
    dimensions: "15cm x 12cm x 8cm",
    tags: ["digital", "health", "monitoring"],
    averageRating: 4.3,
    reviewCount: 5
  },
  {
    id: "10",
    name: "Solar LED Lantern",
    price: 650,
    discountPrice: 550,
    description: "Eco-friendly solar LED lantern with 12-hour backup. Perfect for rural areas with limited electricity access. Weather-resistant design.",
    category: "Tools",
    image: "🔦",
    images: ["🔦", "☀️"],
    inStock: true,
    brand: "SolarLife",
    weight: "400g",
    dimensions: "20cm x 12cm x 12cm",
    tags: ["solar", "eco-friendly", "portable"],
    averageRating: 4.5,
    reviewCount: 13
  }
];

export const handleGetProducts: RequestHandler = (req, res) => {
  try {
    const { category, search } = req.query;
    
    let filteredProducts = mockProducts;
    
    // Filter by category if provided
    if (category && typeof category === 'string') {
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Filter by search term if provided
    if (search && typeof search === 'string') {
      const searchTerm = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    }
    
    const response: ProductsResponse = {
      products: filteredProducts
    };
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const handleGetProduct: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const product = mockProducts.find(p => p.id === id);
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};
