import { RequestHandler } from "express";
import { Weather, WeatherResponse } from "@shared/api";

// Mock weather data - in a real app, this would come from a weather API
const mockWeatherData: Weather = {
  location: "Rural District, State",
  temperature: 28,
  condition: "Partly Cloudy",
  humidity: 65,
  windSpeed: 12,
  forecast: [
    { day: "Today", high: 32, low: 22, condition: "Partly Cloudy" },
    { day: "Tomorrow", high: 30, low: 20, condition: "Sunny" },
    { day: "Thu", high: 34, low: 24, condition: "Sunny" },
    { day: "Fri", high: 29, low: 19, condition: "Light Rain" },
    { day: "Sat", high: 27, low: 18, condition: "Cloudy" },
    { day: "Sun", high: 31, low: 21, condition: "Partly Cloudy" },
    { day: "Mon", high: 33, low: 23, condition: "Sunny" }
  ]
};

export const handleGetWeather: RequestHandler = (req, res) => {
  try {
    const { location } = req.query;
    
    // In a real app, you would use the location to fetch weather from a service like OpenWeatherMap
    // For now, we'll return mock data regardless of location
    
    const response: WeatherResponse = {
      weather: {
        ...mockWeatherData,
        location: (location as string) || mockWeatherData.location
      }
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching weather:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
};
