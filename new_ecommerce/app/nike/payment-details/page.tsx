"use client";
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Package, CreditCard, Lock, CheckCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import EcomNavbar from '@/components/ecomnavbar';
import EcomFooter from '@/components/ecomfooter';

const PaymentDetailsPage = () => {
  const router = useRouter();
  const { cartItems, getCartTotal, clearCart } = useCart();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [orderPlaced, setOrderPlaced] = useState(false);

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Package className="w-24 h-24 text-gray-700 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-white mb-3 uppercase tracking-tight">Cart Empty</h2>
          <p className="text-gray-400 mb-8 text-sm">Add products to continue</p>
          <Link href="/nike/products">
            <Button className="bg-white text-black hover:bg-gray-200 font-bold uppercase tracking-widest px-8 h-12">
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'zipCode', 'cardNumber', 'cardName', 'expiryDate', 'cvv'];
    const emptyFields = requiredFields.filter(field => !formData[field]);
    
    if (emptyFields.length > 0) {
      alert('Please fill in all required fields');
      return;
    }

    setOrderPlaced(true);
    setTimeout(() => {
      clearCart();
      alert('Order placed successfully!');
      router.push('/nike/products');
    }, 3000);
  };

  const subtotal = getCartTotal();
  const shipping = 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-16 rounded-3xl shadow-2xl max-w-lg w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-green-500/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/30 animate-scale-in">
              <CheckCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-4xl font-black mb-4 text-white uppercase tracking-tighter">Order Confirmed</h2>
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              Your order has been successfully placed.<br/>We'll send a confirmation to your email.
            </p>
            <div className="space-y-3 bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm uppercase tracking-wider">Total Paid</span>
                <span className="text-2xl font-black text-green-400">${total.toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-gray-800">
                <p className="text-gray-500 text-xs animate-pulse">Redirecting to products...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <EcomNavbar />

      <div className="pt-28 pb-16 px-4">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Header Section */}
          <div className="mb-12">
            <Link href="/nike/products" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-white transition-colors mb-6 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="uppercase tracking-wider">Continue Shopping</span>
            </Link>
            
            <div className="flex items-end justify-between border-b border-gray-800 pb-6">
              <div>
                <h1 className="text-6xl font-black uppercase tracking-tighter mb-2 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                  Checkout
                </h1>
                <p className="text-gray-500 text-sm uppercase tracking-widest">Secure Payment</p>
              </div>
              <div className="hidden md:flex items-center gap-3 bg-gray-900/50 px-6 py-3 rounded-full border border-gray-800">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">SSL Secured</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            
            {/* Left Side - Forms (3 columns) */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Shipping Information */}
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Shipping</h2>
                </div>
                
                <form className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-black border border-gray-800 rounded-xl text-white placeholder:text-gray-600 focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all font-medium"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-black border border-gray-800 rounded-xl text-white placeholder:text-gray-600 focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all font-medium"
                        placeholder="john@nike.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-black border border-gray-800 rounded-xl text-white placeholder:text-gray-600 focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all font-medium"
                      placeholder="+1 (555) 000-0000"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-black border border-gray-800 rounded-xl text-white placeholder:text-gray-600 focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all font-medium"
                      placeholder="123 Main Street"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    <div className="col-span-2 space-y-2">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-black border border-gray-800 rounded-xl text-white placeholder:text-gray-600 focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all font-medium"
                        placeholder="New York"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-black border border-gray-800 rounded-xl text-white placeholder:text-gray-600 focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all font-medium"
                        placeholder="NY"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                        ZIP *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-black border border-gray-800 rounded-xl text-white placeholder:text-gray-600 focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all font-medium"
                        placeholder="10001"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-black border border-gray-800 rounded-xl text-white placeholder:text-gray-600 focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all font-medium"
                      placeholder="United States"
                    />
                  </div>
                </form>
              </div>

              {/* Payment Information */}
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Payment</h2>
                </div>
                
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-black border border-gray-800 rounded-xl text-white placeholder:text-gray-600 focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all font-medium tracking-widest"
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-black border border-gray-800 rounded-xl text-white placeholder:text-gray-600 focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all font-medium"
                      placeholder="JOHN DOE"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Expiry *
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-black border border-gray-800 rounded-xl text-white placeholder:text-gray-600 focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all font-medium tracking-wider"
                        placeholder="MM/YY"
                        maxLength="5"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                        CVV *
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-black border border-gray-800 rounded-xl text-white placeholder:text-gray-600 focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all font-medium tracking-widest"
                        placeholder="123"
                        maxLength="4"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500 bg-black/50 p-4 rounded-xl border border-gray-800">
                    <Lock className="w-4 h-4 flex-shrink-0" />
                    <span className="uppercase tracking-wide">256-bit SSL encryption</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Order Summary (2 columns) */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 shadow-xl sticky top-24">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-8">Order Summary</h2>
                
                {/* Products List */}
                <div className="space-y-4 mb-8 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                  {cartItems.map((item) => (
                    <div key={item.cartItemId} className="flex gap-4 pb-4 border-b border-gray-800 last:border-0">
                      <div className="w-20 h-20 bg-black rounded-xl overflow-hidden flex-shrink-0 border border-gray-800">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-sm truncate uppercase tracking-tight">{item.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.color} • {item.size} • Qty {item.quantity}
                        </p>
                        <p className="text-base font-black text-white mt-2">
                          {item.currency}{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-4 mb-8 bg-black/50 p-6 rounded-xl border border-gray-800">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 uppercase tracking-wider font-bold">Subtotal</span>
                    <span className="font-black text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 uppercase tracking-wider font-bold">Shipping</span>
                    <span className="font-black text-green-500">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 uppercase tracking-wider font-bold">Tax</span>
                    <span className="font-black text-white">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-800 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-black uppercase tracking-wider">Total</span>
                      <span className="text-3xl font-black text-white">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  onClick={handleSubmit}
                  className="w-full h-16 bg-white text-black hover:bg-gray-200 font-black text-sm uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-white/10 hover:shadow-white/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Place Order
                </Button>

                <p className="text-xs text-gray-600 text-center mt-6 uppercase tracking-wide">
                  Secure checkout powered by Nike
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <EcomFooter />

      <style jsx global>{`
        @keyframes scale-in {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #000;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default PaymentDetailsPage;