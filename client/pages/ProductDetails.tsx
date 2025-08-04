import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Star, 
  Share2, 
  Package, 
  Truck, 
  Shield,
  MessageCircle,
  Plus,
  Minus,
  Send
} from "lucide-react";
import { Product, Review, CartItem } from "@shared/api";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }
    fetchProduct();
    fetchReviews();
    fetchRelatedProducts();
  }, [id, navigate]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      navigate("/");
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/products/${id}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch(`/api/products?limit=4`);
      if (response.ok) {
        const data = await response.json();
        setRelatedProducts(data.products.filter((p: Product) => p.id !== id).slice(0, 4));
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  const addToCart = () => {
    if (!product) return;
    
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = existingCart.find((item: CartItem) => item.productId === product.id);
    
    let updatedCart;
    if (existingItem) {
      updatedCart = existingCart.map((item: CartItem) => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedCart = [...existingCart, {
        productId: product.id,
        productName: product.name,
        quantity,
        price: product.discountPrice || product.price
      }];
    }
    
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert(`Added ${quantity} ${product.name}(s) to cart!`);
  };

  const toggleWishlist = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please login to add items to wishlist");
      return;
    }

    try {
      const method = isWishlisted ? "DELETE" : "POST";
      const response = await fetch(`/api/wishlist/${id}`, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        setIsWishlisted(!isWishlisted);
        alert(isWishlisted ? "Removed from wishlist" : "Added to wishlist!");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  const submitReview = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please login to submit a review");
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newReview)
      });

      if (response.ok) {
        setNewReview({ rating: 5, comment: "" });
        setShowReviewForm(false);
        fetchReviews();
        alert("Review submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review");
    }
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const productImages = product.images || [product.image];
  const discount = product.discountPrice ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-700">
            <ArrowLeft size={20} className="mr-2" />
            Back to Products
          </Link>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Share2 size={16} className="mr-1" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg shadow-sm p-8 flex items-center justify-center">
              <div className="text-8xl">{productImages[selectedImageIndex]}</div>
            </div>
            {productImages.length > 1 && (
              <div className="flex space-x-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    className={`w-16 h-16 bg-white rounded-lg border-2 ${
                      selectedImageIndex === index ? "border-green-600" : "border-gray-200"
                    } flex items-center justify-center text-2xl`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    {image}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">{product.category}</Badge>
                {product.brand && <span className="text-sm text-gray-500">{product.brand}</span>}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                {renderStars(product.averageRating || 0)}
                <span className="text-sm text-gray-600">
                  ({product.reviewCount || 0} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-green-600">
                ₹{product.discountPrice || product.price}
              </span>
              {product.discountPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">₹{product.price}</span>
                  <Badge variant="destructive">{discount}% OFF</Badge>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <Package size={16} className={product.inStock ? "text-green-600" : "text-red-600"} />
              <span className={`font-medium ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Product Details */}
            {(product.weight || product.dimensions) && (
              <div>
                <h3 className="font-semibold mb-2">Product Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {product.weight && (
                    <div>
                      <span className="text-gray-500">Weight:</span>
                      <span className="ml-2">{product.weight}</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div>
                      <span className="text-gray-500">Dimensions:</span>
                      <span className="ml-2">{product.dimensions}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </Button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={!product.inStock}
                onClick={addToCart}
              >
                <ShoppingCart className="mr-2" size={16} />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                onClick={toggleWishlist}
                className={isWishlisted ? "text-red-600 border-red-600" : ""}
              >
                <Heart className={`mr-2 ${isWishlisted ? "fill-current" : ""}`} size={16} />
                {isWishlisted ? "Wishlisted" : "Wishlist"}
              </Button>
            </div>

            {/* Delivery Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Truck size={16} className="text-green-600" />
                    <span className="text-sm">Free delivery on orders above ₹500</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield size={16} className="text-green-600" />
                    <span className="text-sm">Quality guaranteed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Package size={16} className="text-green-600" />
                    <span className="text-sm">Delivered within 24-48 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
              <TabsTrigger value="related">Related Products</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reviews" className="mt-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Customer Reviews</h3>
                  <Button onClick={() => setShowReviewForm(!showReviewForm)}>
                    <MessageCircle className="mr-2" size={16} />
                    Write Review
                  </Button>
                </div>

                {showReviewForm && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Write a Review</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Rating</label>
                        {renderStars(newReview.rating, true, (rating) => 
                          setNewReview({ ...newReview, rating })
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Comment</label>
                        <Textarea
                          value={newReview.comment}
                          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                          placeholder="Share your experience with this product..."
                          rows={3}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={submitReview}>
                          <Send className="mr-2" size={16} />
                          Submit Review
                        </Button>
                        <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium">{review.userName}</span>
                                {review.verified && (
                                  <Badge variant="secondary" className="text-xs">Verified</Badge>
                                )}
                              </div>
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No reviews yet. Be the first to review this product!
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="related" className="mt-8">
              <div>
                <h3 className="text-xl font-semibold mb-6">Related Products</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((relatedProduct) => (
                    <Card key={relatedProduct.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="text-center">
                        <div className="text-4xl mb-2">{relatedProduct.image}</div>
                        <CardTitle className="text-lg">{relatedProduct.name}</CardTitle>
                        <CardDescription>₹{relatedProduct.price}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Link to={`/products/${relatedProduct.id}`}>
                          <Button className="w-full" variant="outline">
                            View Details
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
