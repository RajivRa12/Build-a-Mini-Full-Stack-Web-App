import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind, 
  Droplets,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  MapPin,
  RefreshCw,
  BarChart3,
  ShoppingCart
} from "lucide-react";
import { Weather, MarketPrice, WeatherResponse, MarketPricesResponse } from "@shared/api";

export default function FarmerDashboard() {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeatherData();
    fetchMarketPrices();
  }, []);

  const fetchWeatherData = async () => {
    try {
      const response = await fetch("/api/weather");
      if (response.ok) {
        const data: WeatherResponse = await response.json();
        setWeather(data.weather);
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  const fetchMarketPrices = async () => {
    try {
      const response = await fetch("/api/market-prices");
      if (response.ok) {
        const data: MarketPricesResponse = await response.json();
        setMarketPrices(data.prices);
      }
    } catch (error) {
      console.error("Error fetching market prices:", error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun className="text-yellow-500" size={32} />;
      case "cloudy":
        return <Cloud className="text-gray-500" size={32} />;
      case "partly cloudy":
        return <Cloud className="text-blue-500" size={32} />;
      case "light rain":
      case "rain":
        return <CloudRain className="text-blue-600" size={32} />;
      default:
        return <Sun className="text-yellow-500" size={32} />;
    }
  };

  const getPriceChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="text-green-600" size={16} />;
    if (change < 0) return <TrendingDown className="text-red-600" size={16} />;
    return <Minus className="text-gray-500" size={16} />;
  };

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4" size={32} />
          <p>Loading farmer dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-700">
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center space-x-2">
            <Button onClick={fetchWeatherData} variant="outline" size="sm">
              <RefreshCw size={16} className="mr-1" />
              Refresh Weather
            </Button>
            <Button onClick={fetchMarketPrices} variant="outline" size="sm">
              <RefreshCw size={16} className="mr-1" />
              Refresh Prices
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Farmer Dashboard</h1>
          <p className="text-gray-600">Stay informed with weather updates and market prices</p>
        </div>

        {/* Weather Widget */}
        {weather && (
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {getWeatherIcon(weather.condition)}
                <span>Weather Today</span>
              </CardTitle>
              <CardDescription className="flex items-center space-x-1">
                <MapPin size={14} />
                <span>{weather.location}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Current Weather */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {weather.temperature}°C
                  </div>
                  <p className="text-gray-600">{weather.condition}</p>
                </div>

                {/* Weather Details */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1">
                      <Droplets size={16} className="text-blue-500" />
                      <span className="text-sm">Humidity</span>
                    </span>
                    <span className="font-medium">{weather.humidity}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1">
                      <Wind size={16} className="text-gray-500" />
                      <span className="text-sm">Wind Speed</span>
                    </span>
                    <span className="font-medium">{weather.windSpeed} km/h</span>
                  </div>
                </div>

                {/* 7-Day Forecast */}
                <div className="md:col-span-2">
                  <h4 className="font-medium mb-3">7-Day Forecast</h4>
                  <div className="grid grid-cols-7 gap-2">
                    {weather.forecast.map((day, index) => (
                      <div key={index} className="text-center bg-white rounded-lg p-2">
                        <div className="text-xs font-medium text-gray-600 mb-1">{day.day}</div>
                        <div className="mb-1">{getWeatherIcon(day.condition)}</div>
                        <div className="text-xs">
                          <div className="font-bold">{day.high}°</div>
                          <div className="text-gray-500">{day.low}°</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Farming Tips */}
              <div className="mt-6 p-4 bg-white rounded-lg">
                <h4 className="font-medium mb-2">🌾 Today's Farming Tips</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  {weather.condition.toLowerCase().includes("rain") ? (
                    <>
                      <p>• Good day for irrigation if you need it</p>
                      <p>• Consider postponing pesticide application</p>
                      <p>• Check drainage systems in fields</p>
                    </>
                  ) : weather.condition.toLowerCase().includes("sunny") ? (
                    <>
                      <p>• Perfect day for harvesting and drying crops</p>
                      <p>• Good time for pesticide application</p>
                      <p>• Ensure adequate irrigation for young plants</p>
                    </>
                  ) : (
                    <>
                      <p>• Monitor soil moisture levels</p>
                      <p>• Good day for field preparation</p>
                      <p>• Check weather updates regularly</p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Market Prices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="text-green-600" size={24} />
              <span>Market Prices</span>
            </CardTitle>
            <CardDescription>
              Current market rates from local mandis and markets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="grains">Grains</TabsTrigger>
                <TabsTrigger value="vegetables">Vegetables</TabsTrigger>
                <TabsTrigger value="dairy">Dairy</TabsTrigger>
                <TabsTrigger value="oils">Oils</TabsTrigger>
              </TabsList>
              
              {["all", "grains", "vegetables", "dairy", "oils"].map(category => {
                const filteredPrices = category === "all" 
                  ? marketPrices 
                  : marketPrices.filter(price => price.category.toLowerCase() === category);

                return (
                  <TabsContent key={category} value={category} className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {filteredPrices.map((price) => (
                        <Card key={price.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium">{price.productName}</h4>
                                <p className="text-xs text-gray-500">{price.market}</p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {price.category}
                              </Badge>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Current Price</span>
                                <span className="font-bold text-lg">₹{price.currentPrice}</span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">{price.unit}</span>
                                <div className={`flex items-center space-x-1 ${getPriceChangeColor(price.changePercent)}`}>
                                  {getPriceChangeIcon(price.changePercent)}
                                  <span className="text-xs font-medium">
                                    {price.changePercent > 0 ? "+" : ""}{price.changePercent.toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                              
                              <div className="text-xs text-gray-500 flex items-center space-x-1">
                                <Calendar size={12} />
                                <span>Updated: {new Date(price.lastUpdated).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardHeader className="text-center">
              <ShoppingCart className="mx-auto mb-2 text-green-600" size={32} />
              <CardTitle className="text-lg">Buy Farming Supplies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600 mb-4">
                Shop for seeds, fertilizers, and farming equipment
              </p>
              <Link to="/products?category=agriculture">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Browse Products
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-sky-50">
            <CardHeader className="text-center">
              <BarChart3 className="mx-auto mb-2 text-blue-600" size={32} />
              <CardTitle className="text-lg">Price Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600 mb-4">
                Set alerts for your crops and get price notifications
              </p>
              <Button className="w-full" variant="outline">
                Setup Alerts
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-violet-50">
            <CardHeader className="text-center">
              <Calendar className="mx-auto mb-2 text-purple-600" size={32} />
              <CardTitle className="text-lg">Crop Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600 mb-4">
                Plan your farming activities based on seasons
              </p>
              <Button className="w-full" variant="outline">
                View Calendar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Farming Tips & News</CardTitle>
            <CardDescription>Latest agricultural advice and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">🌱 Seasonal Planting Guide</h4>
                <p className="text-sm text-green-700">
                  This is the perfect time for planting winter vegetables like cabbage, 
                  cauliflower, and spinach. Ensure proper soil preparation and organic manure application.
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">💧 Water Management</h4>
                <p className="text-sm text-blue-700">
                  With the current weather conditions, practice efficient irrigation. 
                  Drip irrigation can save up to 30-50% water compared to traditional methods.
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">🐛 Pest Control Alert</h4>
                <p className="text-sm text-yellow-700">
                  Monitor crops for early signs of pest infestation. Use integrated pest 
                  management practices and avoid overuse of chemical pesticides.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
