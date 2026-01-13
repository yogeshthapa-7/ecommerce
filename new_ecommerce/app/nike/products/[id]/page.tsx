"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Star, ArrowLeft, Check, ShoppingCart } from 'lucide-react';
import EcomNavbar from '@/components/ecomnavbar';
import EcomFooter from '@/components/ecomfooter';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';

const ProductDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);

  // Fetch product logic
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch('/api/products');
        const allProducts = await res.json();
        const foundProduct = allProducts.find(p => p.id.toString() === id);

        if (foundProduct) {
          setProduct(foundProduct);
          setCurrentImage(foundProduct.image_url);
          
          // Set default color if available
          if (foundProduct.colors && foundProduct.colors.length > 0) {
            setSelectedColor(foundProduct.colors[0]);
            if (foundProduct.colors[0].image_url) {
              setCurrentImage(foundProduct.colors[0].image_url);
            }
          }
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    
    // Add to cart using context
    addToCart(product, selectedColor, selectedSize, quantity);
    
    // Show success animation
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    if (color.image_url) {
      setCurrentImage(color.image_url);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">Product Not Found</h1>
          <Link href="/nike/products" className="text-red-500 hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Get available colors and sizes
  const availableColors = product.colors || [];
  const availableSizes = product.sizes || [];

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans text-slate-800">
      <EcomNavbar />

      {/* Main Container - Centered Card Layout */}
      <main className="pt-24 pb-20 px-4 flex items-center justify-center min-h-[calc(100vh-80px)]">
        
        {/* Back Link */}
        <Link 
          href="/nike/products"
          className="absolute top-24 left-8 hidden lg:flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        {/* THE CARD */}
        <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-[1000px] overflow-hidden grid lg:grid-cols-2 min-h-[600px] animate-fade-in-up">
          
          {/* LEFT SIDE: Visuals (Red Gradient) */}
          <div className="relative bg-gray-100 p-8 flex flex-col justify-between items-center text-white">
            
            {/* Nike Logo */}
            <div className="self-start mb-8">
              <svg className="w-16 h-8 fill-current text-white" viewBox="0 0 24 24">
                 <path d="M24 6.9c-5.5 1.7-10 1.2-12.8-1.5C9 3.2 6.5 2.7 3.6 4.6c-4 2.7-3.4 9.4.9 8.2 3.8-1.1 9.3-5.3 19.5-5.9z" />
              </svg>
            </div>

            {/* Floating Shoe Image */}
            <div className="relative z-10 w-full max-w-sm">
              <img 
                src={currentImage} 
                alt={product.name}
                className="w-full h-auto object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.3)] transition-all duration-700 ease-out scale-110"
              />
              {/* Shadow underneath */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/20 blur-xl rounded-full"></div>
            </div>

            {/* Color Preview Dots */}
            {availableColors.length > 0 && (
              <div className="flex gap-3 mt-12 mb-4">
                {availableColors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => handleColorChange(color)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      selectedColor === color ? 'bg-white scale-125' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}
            
            {/* Decorative Background Element */}
            <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-black text-white/10 whitespace-nowrap select-none pointer-events-none tracking-tighter">
              NIKE
            </h1>
          </div>

          {/* RIGHT SIDE: Product Details */}
          <div className="p-8 lg:p-12 flex flex-col justify-center bg-white relative">
            
            {/* Header & Rating */}
            <div className="flex justify-between items-start mb-1">
              <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900">
                {product.name}
              </h2>
              {product.rating > 0 && (
                <div className="flex items-center gap-1 pt-1">
                  <Star className="w-4 h-4 fill-[#FA1E3F] text-[#FA1E3F]" />
                  <span className="text-sm font-bold text-gray-700">{product.rating}</span>
                </div>
              )}
            </div>

            {/* Subtitle */}
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">
              {product.category || "Men's Running Shoe"}
            </p>

            {/* Price */}
            <div className="mb-6">
               <span className="text-4xl font-black text-[#FA1E3F] tracking-tight">
                 {product.currency || '$'}{product.price?.toFixed(2) || '0.00'}
               </span>
               {product.reviews_count > 0 && (
                 <span className="ml-3 text-sm text-gray-400">
                   ({product.reviews_count} reviews)
                 </span>
               )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${product.in_stock ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={`text-sm font-bold ${product.in_stock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.in_stock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              {product.description || "Premium quality product designed for ultimate comfort and performance."}
            </p>

            {/* Color Selector */}
            {availableColors.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Color {selectedColor && `- ${selectedColor.name}`}
                </h3>
                <div className="flex gap-3 flex-wrap">
                  {availableColors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleColorChange(color)}
                      className={`group relative px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedColor === color 
                          ? 'border-[#FA1E3F] bg-[#FA1E3F]/10' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <span className={`text-sm font-bold ${
                        selectedColor === color ? 'text-[#FA1E3F]' : 'text-gray-600'
                      }`}>
                        {color.name}
                      </span>
                      {selectedColor === color && (
                        <Check className="absolute -top-1 -right-1 w-4 h-4 text-[#FA1E3F] bg-white rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {availableSizes.length > 0 && (
              <div className="mb-10">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Size {selectedSize && `- ${selectedSize}`}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 min-w-[50px] text-center rounded-lg border-2 font-bold transition-all ${
                        selectedSize === size
                          ? 'border-[#FA1E3F] bg-[#FA1E3F] text-white'
                          : 'border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {!selectedSize && (
                   <p className="text-[#FA1E3F] text-xs font-bold mt-2 animate-pulse">* Please select a size</p>
                )}
              </div>
            )}

            {/* Add to Cart Button */}
            <Button 
              onClick={handleAddToCart}
              disabled={!selectedSize || !product.in_stock}
              className={`w-full md:w-auto px-12 h-14 text-white text-sm font-bold uppercase tracking-widest rounded-md shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                addedToCart 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-[#111] hover:bg-black'
              }`}
            >
              {addedToCart ? (
                <span className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Added to Cart!
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                </span>
              )}
            </Button>

          </div>
        </div>
      </main>

      <EcomFooter />

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProductDetailPage;