import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Package,
  Stethoscope,
  Truck,
  Wrench,
  GraduationCap,
  Search,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  Star,
  Calendar,
  ChevronRight,
  Moon,
  Sun,
  Heart
} from "lucide-react";
import { Service, Product, NewsItem, ContactRequest, ServicesResponse, ProductsResponse, NewsResponse, CartItem } from "@shared/api";

export default function Index() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetchServices();
    fetchProducts();
    fetchNews();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      const data: ServicesResponse = await response.json();
      setServices(data.services);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data: ProductsResponse = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/news?limit=3");
      const data: NewsResponse = await response.json();
      setNews(data.news);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      });

      if (response.ok) {
        alert("Thank you for your message. We'll get back to you soon!");
        setContactForm({ name: "", email: "", phone: "", message: "" });
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "Failed to submit form"}`);
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("Failed to submit form. Please try again.");
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.productId === product.id);

    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        price: product.price
      }]);
    }

    setShowCartNotification(true);
    setTimeout(() => setShowCartNotification(false), 2000);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">RC</span>
                </div>
                <span className="text-xl font-bold text-gray-800">RuralConnect</span>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#home" className="text-green-600 hover:text-green-800 px-3 py-2 font-medium">Home</a>
                <a href="#services" className="text-gray-700 hover:text-green-600 px-3 py-2 font-medium">Services</a>
                <Link to="/products" className="text-gray-700 hover:text-green-600 px-3 py-2 font-medium">Products</Link>
                <a href="#news" className="text-gray-700 hover:text-green-600 px-3 py-2 font-medium">News</a>
                <a href="#contact" className="text-gray-700 hover:text-green-600 px-3 py-2 font-medium">Contact</a>
                <Button onClick={toggleDarkMode} variant="ghost" size="sm">
                  {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                </Button>
                <Link to="/wishlist">
                  <Button size="sm" variant="outline">
                    <Heart size={16} />
                  </Button>
                </Link>
                <div className="relative">
                  <Button size="sm" variant="outline" className="relative">
                    <ShoppingCart size={16} />
                    {getCartItemCount() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                        {getCartItemCount()}
                      </span>
                    )}
                  </Button>
                </div>
                <Link to="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">Sign Up</Button>
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-green-600 p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#home" className="block px-3 py-2 text-green-600 font-medium">Home</a>
              <a href="#services" className="block px-3 py-2 text-gray-700 hover:text-green-600">Services</a>
              <Link to="/products" className="block px-3 py-2 text-gray-700 hover:text-green-600">Products</Link>
              <a href="#news" className="block px-3 py-2 text-gray-700 hover:text-green-600">News</a>
              <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-green-600">Contact</a>
              <div className="flex items-center space-x-2 px-3 py-2">
                <Button size="sm" variant="outline" className="relative">
                  <ShoppingCart size={16} />
                  {getCartItemCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                      {getCartItemCount()}
                    </span>
                  )}
                </Button>
                <Link to="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">Sign Up</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Connecting Rural Communities
            <span className="block text-green-600">To Essential Services</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Access groceries, medicines, farm equipment, and more with our platform designed specifically for rural communities. 
            Easy ordering, reliable delivery, and community-focused support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#products">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3">
                Browse Products
              </Button>
            </a>
            <Link to="/farmer-dashboard">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                Farmer Dashboard
              </Button>
            </Link>
            <a href="#services">
              <Button size="lg" variant="ghost" className="text-lg px-8 py-3">
                Our Services
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section id="services" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600">Comprehensive solutions for rural community needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">{service.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Available Products Section */}
      <section id="products" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Available Products</h2>
            <p className="text-lg text-gray-600 mb-8">Essential products delivered to your doorstep</p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <Link to={`/products/${product.id}`}>
                    <div className="text-4xl mb-4 cursor-pointer hover:scale-110 transition-transform">{product.image}</div>
                  </Link>
                  <Link to={`/products/${product.id}`}>
                    <CardTitle className="text-lg hover:text-green-600 cursor-pointer">{product.name}</CardTitle>
                  </Link>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="flex flex-col items-center">
                      {product.discountPrice ? (
                        <>
                          <span className="text-2xl font-bold text-green-600">₹{product.discountPrice}</span>
                          <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                      )}
                    </div>
                    <Badge variant={product.inStock ? "default" : "secondary"}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                  {product.averageRating && (
                    <div className="flex items-center justify-center space-x-1 mt-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={star <= (product.averageRating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">({product.reviewCount})</span>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center mb-4 line-clamp-2">{product.description}</CardDescription>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline">{product.category}</Badge>
                    {product.brand && <span className="text-xs text-gray-500">{product.brand}</span>}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      className="flex-1"
                      disabled={!product.inStock}
                      variant={product.inStock ? "default" : "secondary"}
                      onClick={() => product.inStock && addToCart(product)}
                    >
                      <ShoppingCart className="mr-2" size={16} />
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                    <Link to={`/products/${product.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* News & Updates Section */}
      <section id="news" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">News & Updates</h2>
            <p className="text-lg text-gray-600">Stay informed about community developments</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((newsItem) => (
              <Card key={newsItem.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{newsItem.category}</Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={14} className="mr-1" />
                      {new Date(newsItem.date).toLocaleDateString()}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{newsItem.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{newsItem.summary}</CardDescription>
                  <Button variant="ghost" size="sm" className="p-0 h-auto text-green-600 hover:text-green-800">
                    Read more <ChevronRight size={16} className="ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-green-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-lg text-gray-600">Get in touch with our team</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Get In Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="text-green-600" size={20} />
                    <span className="text-gray-700">123 Rural Connect Street, Village Center, State 12345</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="text-green-600" size={20} />
                    <span className="text-gray-700">+91 98765 43210</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="text-green-600" size={20} />
                    <span className="text-gray-700">support@ruralconnect.com</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-3">Helpline Hours</h4>
                <div className="text-gray-700 space-y-1">
                  <p>Monday - Friday: 8:00 AM - 8:00 PM</p>
                  <p>Saturday: 9:00 AM - 6:00 PM</p>
                  <p>Sunday: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Send us a Message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Your Name *"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  />
                </div>
                <div>
                  <Input
                    type="tel"
                    placeholder="Your Phone Number"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Your Message *"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">RC</span>
                </div>
                <span className="text-xl font-bold">RuralConnect</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Empowering rural communities with easy access to essential products and services. 
                Building bridges between rural areas and modern convenience.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center text-sm text-gray-400">
                  <Star className="text-yellow-400 mr-1" size={16} />
                  <span>4.8/5 Community Rating</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#services" className="hover:text-white">Services</a></li>
                <li><a href="#products" className="hover:text-white">Products</a></li>
                <li><a href="#news" className="hover:text-white">News</a></li>
                <li><a href="#contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Track Order</a></li>
                <li><a href="#" className="hover:text-white">Returns</a></li>
                <li><a href="#" className="hover:text-white">Community</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 RuralConnect. All rights reserved. Built with ❤️ for rural communities.</p>
          </div>
        </div>
      </footer>

      {/* Cart Notification */}
      {showCartNotification && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-right">
          <div className="flex items-center space-x-2">
            <ShoppingCart size={16} />
            <span>Item added to cart!</span>
          </div>
        </div>
      )}

      {/* Cart Summary (when items in cart) */}
      {getCartItemCount() > 0 && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 border max-w-sm z-50">
          <h3 className="font-semibold mb-2">Cart Summary</h3>
          <div className="space-y-1 text-sm">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.productName} x{item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-semibold">
              <span>Total: ₹{getCartTotal()}</span>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            <Link to="/checkout" className="block">
              <Button className="w-full bg-green-600 hover:bg-green-700" size="sm">
                Proceed to Checkout
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setCart([])}
            >
              Clear Cart
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
