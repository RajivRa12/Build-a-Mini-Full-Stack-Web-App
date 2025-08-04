import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Truck, 
  CreditCard, 
  MapPin, 
  Clock,
  Phone,
  Home,
  Building,
  Calendar,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { CartItem, User } from "@shared/api";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [deliveryType, setDeliveryType] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
    isDefault: false
  });
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [selectedDeliverySlot, setSelectedDeliverySlot] = useState("");
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    nameOnCard: ""
  });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");
    
    if (!token || !userData) {
      alert("Please login to continue with checkout");
      navigate("/login");
      return;
    }

    // Load cart and user data
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cartData.length === 0) {
      alert("Your cart is empty");
      navigate("/");
      return;
    }

    setCart(cartData);
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Pre-fill delivery address with user data
    setDeliveryAddress(prev => ({
      ...prev,
      fullName: parsedUser.name || "",
      phone: parsedUser.phone || "",
      address: parsedUser.address || ""
    }));
  }, [navigate]);

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDeliveryFee = () => {
    const subtotal = calculateSubtotal();
    if (subtotal >= 500) return 0; // Free delivery above ₹500
    if (deliveryType === "express") return 50;
    return 30;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateDeliveryFee();
  };

  const deliverySlots = [
    { id: "morning", label: "Morning (9 AM - 12 PM)", fee: 0 },
    { id: "afternoon", label: "Afternoon (12 PM - 4 PM)", fee: 0 },
    { id: "evening", label: "Evening (4 PM - 8 PM)", fee: 10 },
    { id: "next-day", label: "Next Day Morning", fee: 20 }
  ];

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const orderData = {
        products: cart,
        totalAmount: calculateTotal(),
        deliveryAddress,
        deliveryType,
        paymentMethod,
        specialInstructions,
        deliverySlot: selectedDeliverySlot
      };

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          products: cart,
          notes: `Delivery: ${deliveryType}, Payment: ${paymentMethod}, Slot: ${selectedDeliverySlot}, Instructions: ${specialInstructions}`
        })
      });

      if (response.ok) {
        const order = await response.json();
        localStorage.removeItem("cart");
        alert(`Order placed successfully! Order ID: ${order.id}`);
        navigate("/dashboard");
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  const steps = [
    { id: 1, title: "Review Cart", icon: ShoppingCart },
    { id: 2, title: "Delivery Details", icon: MapPin },
    { id: 3, title: "Payment", icon: CreditCard },
    { id: 4, title: "Confirmation", icon: CheckCircle }
  ];

  if (!user || cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-xl font-semibold mb-2">Unable to proceed</h2>
          <p className="text-gray-600 mb-4">Please login and add items to cart first</p>
          <Link to="/">
            <Button>Go to Homepage</Button>
          </Link>
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
          <h1 className="text-xl font-semibold">Secure Checkout</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.id 
                    ? "bg-green-600 text-white" 
                    : "bg-gray-200 text-gray-500"
                }`}>
                  <step.icon size={20} />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.id ? "text-green-600" : "text-gray-500"
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 ${
                    currentStep > step.id ? "bg-green-600" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Review Cart */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Your Order</CardTitle>
                  <CardDescription>Check your items before proceeding</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cart.map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-4 border-b">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.productName}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{item.price * item.quantity}</p>
                          <p className="text-sm text-gray-600">₹{item.price} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Button 
                      onClick={() => setCurrentStep(2)}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Continue to Delivery Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Delivery Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Delivery Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Home size={20} />
                      <span>Delivery Address</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={deliveryAddress.fullName}
                          onChange={(e) => setDeliveryAddress({...deliveryAddress, fullName: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={deliveryAddress.phone}
                          onChange={(e) => setDeliveryAddress({...deliveryAddress, phone: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Complete Address *</Label>
                      <Textarea
                        id="address"
                        value={deliveryAddress.address}
                        onChange={(e) => setDeliveryAddress({...deliveryAddress, address: e.target.value})}
                        placeholder="House/Flat No, Street, Area"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="landmark">Landmark</Label>
                        <Input
                          id="landmark"
                          value={deliveryAddress.landmark}
                          onChange={(e) => setDeliveryAddress({...deliveryAddress, landmark: e.target.value})}
                          placeholder="Near..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="pincode">Pincode *</Label>
                        <Input
                          id="pincode"
                          value={deliveryAddress.pincode}
                          onChange={(e) => setDeliveryAddress({...deliveryAddress, pincode: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={deliveryAddress.city}
                          onChange={(e) => setDeliveryAddress({...deliveryAddress, city: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Options */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Truck size={20} />
                      <span>Delivery Options</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={deliveryType} onValueChange={setDeliveryType}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="flex-1">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">Standard Delivery</p>
                              <p className="text-sm text-gray-600">2-3 business days</p>
                            </div>
                            <span className="font-medium">₹30</span>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="flex-1">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">Express Delivery</p>
                              <p className="text-sm text-gray-600">Next business day</p>
                            </div>
                            <span className="font-medium">₹50</span>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>

                    <div className="mt-6">
                      <Label className="text-base font-medium">Preferred Delivery Time</Label>
                      <RadioGroup value={selectedDeliverySlot} onValueChange={setSelectedDeliverySlot} className="mt-2">
                        {deliverySlots.map((slot) => (
                          <div key={slot.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={slot.id} id={slot.id} />
                            <Label htmlFor={slot.id} className="flex-1">
                              <div className="flex justify-between items-center">
                                <span>{slot.label}</span>
                                {slot.fee > 0 && <span className="text-sm">+₹{slot.fee}</span>}
                              </div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="mt-6">
                      <Label htmlFor="instructions">Special Instructions</Label>
                      <Textarea
                        id="instructions"
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        placeholder="Any specific delivery instructions..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard size={20} />
                    <span>Payment Method</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Cash on Delivery</p>
                            <p className="text-sm text-gray-600">Pay when you receive your order</p>
                          </div>
                          <Badge variant="secondary">Recommended</Badge>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1">
                        <div>
                          <p className="font-medium">Credit/Debit Card</p>
                          <p className="text-sm text-gray-600">Secure payment with your card</p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex-1">
                        <div>
                          <p className="font-medium">UPI Payment</p>
                          <p className="text-sm text-gray-600">Pay using UPI apps</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "card" && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          value={paymentDetails.cardNumber}
                          onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="expiryMonth">Month</Label>
                          <Input
                            id="expiryMonth"
                            value={paymentDetails.expiryMonth}
                            onChange={(e) => setPaymentDetails({...paymentDetails, expiryMonth: e.target.value})}
                            placeholder="MM"
                          />
                        </div>
                        <div>
                          <Label htmlFor="expiryYear">Year</Label>
                          <Input
                            id="expiryYear"
                            value={paymentDetails.expiryYear}
                            onChange={(e) => setPaymentDetails({...paymentDetails, expiryYear: e.target.value})}
                            placeholder="YY"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            value={paymentDetails.cvv}
                            onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex space-x-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep(2)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={handlePlaceOrder}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Place Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal ({cart.length} items)</span>
                    <span>₹{calculateSubtotal()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>
                      {calculateDeliveryFee() === 0 ? "FREE" : `₹${calculateDeliveryFee()}`}
                    </span>
                  </div>
                  {calculateSubtotal() >= 500 && (
                    <div className="text-sm text-green-600">
                      🎉 You saved ₹30 on delivery!
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                </div>

                {currentStep < 3 && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-700">
                      <CheckCircle size={16} />
                      <span className="text-sm font-medium">Secure Checkout</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      Your order and payment information is protected
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
