import { RequestHandler } from "express";
import { MarketPrice, MarketPricesResponse } from "@shared/api";

// Mock market prices data - in a real app, this would come from market data APIs
const mockMarketPrices: MarketPrice[] = [
  {
    id: "1",
    productName: "Rice",
    category: "Grains",
    currentPrice: 45,
    previousPrice: 42,
    changePercent: 7.1,
    unit: "per kg",
    market: "District Mandi",
    lastUpdated: "2024-01-15T09:00:00Z"
  },
  {
    id: "2",
    productName: "Wheat",
    category: "Grains",
    currentPrice: 38,
    previousPrice: 40,
    changePercent: -5.0,
    unit: "per kg",
    market: "District Mandi",
    lastUpdated: "2024-01-15T09:00:00Z"
  },
  {
    id: "3",
    productName: "Onion",
    category: "Vegetables",
    currentPrice: 25,
    previousPrice: 30,
    changePercent: -16.7,
    unit: "per kg",
    market: "Local Market",
    lastUpdated: "2024-01-15T08:30:00Z"
  },
  {
    id: "4",
    productName: "Tomato",
    category: "Vegetables",
    currentPrice: 60,
    previousPrice: 45,
    changePercent: 33.3,
    unit: "per kg",
    market: "Local Market",
    lastUpdated: "2024-01-15T08:30:00Z"
  },
  {
    id: "5",
    productName: "Potato",
    category: "Vegetables",
    currentPrice: 22,
    previousPrice: 20,
    changePercent: 10.0,
    unit: "per kg",
    market: "Local Market",
    lastUpdated: "2024-01-15T08:30:00Z"
  },
  {
    id: "6",
    productName: "Milk",
    category: "Dairy",
    currentPrice: 52,
    previousPrice: 50,
    changePercent: 4.0,
    unit: "per liter",
    market: "Dairy Cooperative",
    lastUpdated: "2024-01-15T07:00:00Z"
  },
  {
    id: "7",
    productName: "Mustard Oil",
    category: "Oils",
    currentPrice: 140,
    previousPrice: 135,
    changePercent: 3.7,
    unit: "per liter",
    market: "District Mandi",
    lastUpdated: "2024-01-15T09:00:00Z"
  },
  {
    id: "8",
    productName: "Turmeric",
    category: "Spices",
    currentPrice: 180,
    previousPrice: 175,
    changePercent: 2.9,
    unit: "per kg",
    market: "Spice Market",
    lastUpdated: "2024-01-15T10:00:00Z"
  }
];

export const handleGetMarketPrices: RequestHandler = (req, res) => {
  try {
    const { category, market } = req.query;
    
    let filteredPrices = [...mockMarketPrices];
    
    // Filter by category if provided
    if (category && typeof category === 'string') {
      filteredPrices = filteredPrices.filter(price => 
        price.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Filter by market if provided
    if (market && typeof market === 'string') {
      filteredPrices = filteredPrices.filter(price => 
        price.market.toLowerCase().includes(market.toLowerCase())
      );
    }
    
    // Sort by last updated (most recent first)
    filteredPrices.sort((a, b) => 
      new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );
    
    const response: MarketPricesResponse = {
      prices: filteredPrices
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching market prices:", error);
    res.status(500).json({ error: "Failed to fetch market prices" });
  }
};

export const handleGetPriceHistory: RequestHandler = (req, res) => {
  try {
    const { productName } = req.params;
    
    // Mock price history data
    const priceHistory = [
      { date: "2024-01-15", price: 45 },
      { date: "2024-01-14", price: 42 },
      { date: "2024-01-13", price: 43 },
      { date: "2024-01-12", price: 41 },
      { date: "2024-01-11", price: 40 },
      { date: "2024-01-10", price: 42 },
      { date: "2024-01-09", price: 44 }
    ];
    
    res.status(200).json({ 
      productName,
      history: priceHistory 
    });
  } catch (error) {
    console.error("Error fetching price history:", error);
    res.status(500).json({ error: "Failed to fetch price history" });
  }
};
