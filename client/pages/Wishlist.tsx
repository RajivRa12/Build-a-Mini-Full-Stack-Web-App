import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Star,
  AlertCircle
} from "lucide-react";
import { Product, Wishlist as WishlistType, CartItem } from "@shared/api";

export default function Wishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState<WishlistType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please login to view your wishlist");
      navigate("/login");
      return;
    }
    
    fetchWishlist();
  }, [navigate]);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const [wishlistResponse, productsResponse] = await Promise.all([
        fetch("/api/wishlist", {
          headers: { "Authorization": `Bearer ${token}` }
        }),
        fetch("/api/products")
      ]);

      if (wishlistResponse.ok && productsResponse.ok) {
        const wishlistData = await wishlistResponse.json();
        const productsData = await productsResponse.json();
        
        setWishlist(wishlistData.wishlist);
        setProducts(productsData.products);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        setWishlist(prev => prev.filter(item => item.productId !== productId));
        alert("Removed from wishlist");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
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

  const wishlistProducts = products.filter(product => 
    wishlist.some(item => item.productId === product.id)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <Heart className="animate-pulse mx-auto mb-4 text-red-500" size={48} />
          <p>Loading your wishlist...</p>
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
            Back to Shopping
          </Link>
          <h1 className="text-xl font-semibold flex items-center space-x-2">
            <Heart className="text-red-500" size={24} />
            <span>My Wishlist ({wishlistProducts.length})</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow duration-300 relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 z-10 text-red-500 hover:text-red-700"
                  onClick={() => removeFromWishlist(product.id)}
                >
                  <Trash2 size={16} />
                </Button>
                
                <CardHeader className="text-center pt-8">
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
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="mx-auto mb-6 text-gray-400" size={64} />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Wishlist is Empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any products to your wishlist yet. 
              Start exploring and save your favorite items!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button className="bg-green-600 hover:bg-green-700">
                  Browse Products
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Wishlist Tips */}
        {wishlistProducts.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">💡 Wishlist Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="text-blue-500 mt-1" size={16} />
                  <div>
                    <p className="font-medium">Price Alerts</p>
                    <p className="text-gray-600">We'll notify you when prices drop on your wishlist items</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Heart className="text-red-500 mt-1" size={16} />
                  <div>
                    <p className="font-medium">Save for Later</p>
                    <p className="text-gray-600">Keep track of products you want to buy in the future</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <ShoppingCart className="text-green-500 mt-1" size={16} />
                  <div>
                    <p className="font-medium">Quick Purchase</p>
                    <p className="text-gray-600">Add all wishlist items to cart with one click (coming soon)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
