import { RequestHandler } from "express";
import { ServicesResponse, Service } from "@shared/api";

// Mock data for services - in a real app, this would come from a database
const mockServices: Service[] = [
  { 
    id: "1", 
    name: "Grocery Delivery", 
    description: "Fresh groceries delivered to your doorstep within 24 hours", 
    icon: "🛒" 
  },
  { 
    id: "2", 
    name: "Medicine Access", 
    description: "Essential medicines and healthcare products with prescription tracking", 
    icon: "💊" 
  },
  { 
    id: "3", 
    name: "Farm Equipment", 
    description: "Tools and equipment for farming, including rental options", 
    icon: "🚜" 
  },
  { 
    id: "4", 
    name: "Repair Services", 
    description: "Home and equipment repair services by certified technicians", 
    icon: "🔧" 
  },
  { 
    id: "5", 
    name: "Educational Resources", 
    description: "Books, learning materials, and online courses for all ages", 
    icon: "📚" 
  }
];

export const handleGetServices: RequestHandler = (req, res) => {
  try {
    const response: ServicesResponse = {
      services: mockServices
    };
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
};
