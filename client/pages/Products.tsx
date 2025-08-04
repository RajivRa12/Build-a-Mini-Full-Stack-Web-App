import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Star, 
  ArrowLeft,
  Grid3X3,
  List,
  SlidersHorizontal
} from "lucide-react";
import { Product, ProductsResponse, CartItem } from "@shared/api";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);

  const categories = ["Grocery", "Medicine", "Tools", "Agriculture"];
  const maxPrice = 2000;

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, searchQuery, selectedCategories, priceRange, inStockOnly, minRating, sortBy]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data: ProductsResponse = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        selectedCategories.includes(product.category)
      );
    }

    // Price range filter
    filtered = filtered.filter(product => {
      const price = product.discountPrice || product.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // In stock filter
    if (inStockOnly) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(product => 
        (product.averageRating || 0) >= minRating
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.discountPrice || a.price) - (b.discountPrice || b.price);
        case "price-high":
          return (b.discountPrice || b.price) - (a.discountPrice || a.price);
        case "rating":
          return (b.averageRating || 0) - (a.averageRating || 0);
        case "newest":
          return b.id.localeCompare(a.id);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setPriceRange([0, maxPrice]);
    setInStockOnly(false);
    setMinRating(0);
    setSortBy("name");
  };

  const addToCart = (product: Product) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = existingCart.find((item: CartItem) => item.productId === product.id);
    
    let updatedCart;
    if (existingItem) {
      updatedCart = existingCart.map((item: CartItem) => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...existingCart, {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        price: product.discountPrice || product.price
      }];
    }
    
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert(`Added ${product.name} to cart!`);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="text-center">
        <Link to={`/products/${product.id}`}>
          <div className="text-4xl mb-4 cursor-pointer hover:scale-110 transition-transform">
            {product.image}
          </div>
        </Link>
        <Link to={`/products/${product.id}`}>
          <CardTitle className="text-lg hover:text-green-600 cursor-pointer line-clamp-2">
            {product.name}
          </CardTitle>
        </Link>
        <div className="flex items-center justify-center space-x-2">
          <div className="flex flex-col items-center">
            {product.discountPrice ? (
              <>
                <span className="text-xl font-bold text-green-600">₹{product.discountPrice}</span>
                <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
              </>
            ) : (
              <span className="text-xl font-bold text-green-600">₹{product.price}</span>
            )}
          </div>
          <Badge variant={product.inStock ? "default" : "secondary"}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
        {product.averageRating && (
          <div className="flex items-center justify-center space-x-1 mt-2">
            {renderStars(product.averageRating)}
            <span className="text-xs text-gray-600">({product.reviewCount})</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <CardDescription className="text-center mb-4 line-clamp-2">
          {product.description}
        </CardDescription>
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
            size="sm"
          >
            <ShoppingCart className="mr-2" size={14} />
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
  );

  const ProductListItem = ({ product }: { product: Product }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex space-x-6">
          <Link to={`/products/${product.id}`}>
            <div className="text-6xl cursor-pointer hover:scale-110 transition-transform">
              {product.image}
            </div>
          </Link>
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <Link to={`/products/${product.id}`}>
                  <h3 className="text-lg font-semibold hover:text-green-600 cursor-pointer">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline">{product.category}</Badge>
                  {product.brand && <span className="text-sm text-gray-500">{product.brand}</span>}
                </div>
              </div>
              <div className="text-right">
                {product.discountPrice ? (
                  <div>
                    <span className="text-2xl font-bold text-green-600">₹{product.discountPrice}</span>
                    <div className="text-sm text-gray-500 line-through">₹{product.price}</div>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                )}
              </div>
            </div>
            
            <p className="text-gray-600 line-clamp-2">{product.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {product.averageRating && (
                  <div className="flex items-center space-x-1">
                    {renderStars(product.averageRating)}
                    <span className="text-sm text-gray-600">({product.reviewCount})</span>
                  </div>
                )}
                <Badge variant={product.inStock ? "default" : "secondary"}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  disabled={!product.inStock}
                  variant={product.inStock ? "default" : "secondary"}
                  onClick={() => product.inStock && addToCart(product)}
                  size="sm"
                >
                  <ShoppingCart className="mr-2" size={14} />
                  Add to Cart
                </Button>
                <Link to={`/products/${product.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-700">
              <ArrowLeft size={20} className="mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 size={16} />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List size={16} />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search products, brands, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <SlidersHorizontal size={16} />
              <span>Filters</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Filters</CardTitle>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Categories */}
                  <div>
                    <h4 className="font-medium mb-3">Categories</h4>
                    <div className="space-y-2">
                      {categories.map(category => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={category}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => toggleCategory(category)}
                          />
                          <label htmlFor={category} className="text-sm">
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Price Range */}
                  <div>
                    <h4 className="font-medium mb-3">Price Range</h4>
                    <div className="space-y-4">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={maxPrice}
                        step={50}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Rating Filter */}
                  <div>
                    <h4 className="font-medium mb-3">Minimum Rating</h4>
                    <div className="space-y-2">
                      {[4, 3, 2, 1].map(rating => (
                        <div key={rating} className="flex items-center space-x-2">
                          <Checkbox
                            id={`rating-${rating}`}
                            checked={minRating === rating}
                            onCheckedChange={(checked) => setMinRating(checked ? rating : 0)}
                          />
                          <label htmlFor={`rating-${rating}`} className="flex items-center space-x-1 text-sm">
                            {renderStars(rating)}
                            <span>& Up</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Availability */}
                  <div>
                    <h4 className="font-medium mb-3">Availability</h4>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="in-stock"
                        checked={inStockOnly}
                        onCheckedChange={setInStockOnly}
                      />
                      <label htmlFor="in-stock" className="text-sm">
                        In Stock Only
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Products Section */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">All Products</h2>
                <p className="text-gray-600">{filteredProducts.length} products found</p>
              </div>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="price-low">Price (Low to High)</SelectItem>
                  <SelectItem value="price-high">Price (High to Low)</SelectItem>
                  <SelectItem value="rating">Rating (High to Low)</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid/List */}
            {filteredProducts.length > 0 ? (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }>
                {filteredProducts.map((product) => 
                  viewMode === "grid" 
                    ? <ProductCard key={product.id} product={product} />
                    : <ProductListItem key={product.id} product={product} />
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
