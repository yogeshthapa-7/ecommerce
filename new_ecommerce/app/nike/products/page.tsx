"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ShoppingBag,
  Filter,
  ChevronDown,
  Star,
  Heart,
  Search,
  ArrowRight,
} from 'lucide-react';
import EcomNavbar from '@/components/ecomnavbar';
import EcomFooter from '@/components/ecomfooter';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products from API
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    const category = product.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  // Get categories in order: Shoes, Bags, Hoodies, Others
  const orderedCategories = ['Shoes', 'Bags', 'Hoodies'].filter(cat => productsByCategory[cat]);
  const otherCategories = Object.keys(productsByCategory).filter(cat => !orderedCategories.includes(cat));
  const allCategories = [...orderedCategories, ...otherCategories];

  const ProductCard = ({ product }) => (
    <Link
      href={`/nike/products/${product.id}`}
      className="group relative bg-gradient-to-b from-gray-900 to-black rounded-2xl overflow-hidden border border-gray-800 hover:border-red-500/50 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/20 cursor-pointer"
    >
      {/* Wishlist Button */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('Added to wishlist:', product.id);
        }}
        className="absolute top-4 right-4 z-10 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-red-500 transition-colors group/heart"
      >
        <Heart className="w-5 h-5 group-hover/heart:fill-white" />
      </button>

      {/* Product Image */}
      <div className="aspect-square overflow-hidden bg-gray-800">
        <img
          src={product.image_url || 'https://via.placeholder.com/400'}
          alt={product.name || 'Product'}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Product Info */}
      <div className="p-6 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold line-clamp-2">
            {product.name || 'Untitled Product'}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-gray-400 text-sm">
            {product.category || 'Uncategorized'}
          </p>
          <span className="text-gray-600">•</span>
          <p className="text-gray-500 text-sm">
            {product.gender || 'Unisex'}
          </p>
        </div>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold text-white">{product.rating}</span>
            </div>
            <span className="text-xs text-gray-500">({product.reviews_count} reviews)</span>
          </div>
        )}

        {/* Stock Status */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${product.in_stock ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-gray-400">
            {product.in_stock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-2xl font-black">
              {product.currency || '$'}{product.price ? product.price.toFixed(2) : '0.00'}
            </span>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      {product.status === 'active' && product.in_stock && (
        <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          NEW
        </div>
      )}
      {!product.in_stock && (
        <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          SOLD OUT
        </div>
      )}
    </Link>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <EcomNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-7xl font-black">
              SHOP <span className="text-red-500">COLLECTION</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Discover our complete range of premium athletic footwear, apparel,
              and accessories
            </p>
          </div>
        </div>
      </section>

      {/* Category Sections */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading products...</p>
        </div>
      ) : (
        <div className="py-16 bg-black">
          {allCategories.map((category) => {
            const categoryProducts = productsByCategory[category] || [];
            const displayProducts = categoryProducts.slice(0, 4); // Show only 4 products per category

            return (
              <section key={category} className="mb-20">
                <div className="max-w-7xl mx-auto px-6">
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-4xl md:text-5xl font-black uppercase">
                        {category}
                      </h2>
                      <p className="text-gray-400 mt-2">
                        {categoryProducts.length} {categoryProducts.length === 1 ? 'item' : 'items'} available
                      </p>
                    </div>
                    
                    {/* Show More Button */}
                    {categoryProducts.length > 4 && (
                      <Link 
                        href={`/nike/products/category/${category.toLowerCase()}`}
                        className="group flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-bold transition-all hover:gap-3"
                      >
                        Show More
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    )}
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {displayProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* View All Link (alternative to button) */}
                  {categoryProducts.length > 4 && (
                    <div className="text-center mt-8">
                      <Link 
                        href={`/nike/products/category/${category.toLowerCase()}`}
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-red-500 font-bold transition-colors"
                      >
                        View all {categoryProducts.length} {category.toLowerCase()}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <EcomFooter />
    </div>
  );
};

export default ProductsPage;