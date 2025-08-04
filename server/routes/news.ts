import { RequestHandler } from "express";
import { NewsResponse, NewsItem } from "@shared/api";

// Mock data for news - in a real app, this would come from a database
const mockNews: NewsItem[] = [
  { 
    id: "1", 
    title: "New Agricultural Subsidies Available", 
    summary: "Government announces new support program for rural farmers with up to ₹50,000 subsidies for equipment purchases", 
    date: "2024-01-15", 
    category: "Agriculture" 
  },
  { 
    id: "2", 
    title: "Mobile Health Clinic Schedule", 
    summary: "Free health checkups and medical consultations coming to 15 villages this month. Registration now open", 
    date: "2024-01-12", 
    category: "Healthcare" 
  },
  { 
    id: "3", 
    title: "Digital Literacy Program Launch", 
    summary: "Free computer and smartphone training starting next week at community centers. Learn digital banking and online services", 
    date: "2024-01-10", 
    category: "Education" 
  },
  { 
    id: "4", 
    title: "Weather Alert: Heavy Rains Expected", 
    summary: "Meteorological department predicts heavy rainfall in the region. Farmers advised to take necessary precautions", 
    date: "2024-01-08", 
    category: "Weather" 
  },
  { 
    id: "5", 
    title: "New Transport Service Routes", 
    summary: "Additional bus routes connecting rural areas to district headquarters announced. Service starts from next month", 
    date: "2024-01-05", 
    category: "Transportation" 
  }
];

export const handleGetNews: RequestHandler = (req, res) => {
  try {
    const { category, limit } = req.query;
    
    let filteredNews = mockNews;
    
    // Filter by category if provided
    if (category && typeof category === 'string') {
      filteredNews = filteredNews.filter(news => 
        news.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Limit results if specified
    if (limit && typeof limit === 'string') {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        filteredNews = filteredNews.slice(0, limitNum);
      }
    }
    
    // Sort by date (newest first)
    filteredNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const response: NewsResponse = {
      news: filteredNews
    };
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Failed to fetch news" });
  }
};

export const handleGetNewsItem: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const newsItem = mockNews.find(n => n.id === id);
    
    if (!newsItem) {
      return res.status(404).json({ error: "News item not found" });
    }
    
    res.status(200).json(newsItem);
  } catch (error) {
    console.error("Error fetching news item:", error);
    res.status(500).json({ error: "Failed to fetch news item" });
  }
};
