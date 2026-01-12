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
} from 'lucide-react';
import EcomNavbar from '@/components/ecomnavbar';
import EcomFooter from '@/components/ecomfooter';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

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

  // Get unique categories
  const categories = ['All', ...new Set(products.map((p) => p.category))];

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

      {/* Filters Section */}
      <section className="py-8 bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-full pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-bold transition-all ${
                    selectedCategory === category
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Results Count */}
            <div className="text-gray-400 text-sm">
              {filteredProducts.length} Products
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-400">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 mx-auto text-gray-700 mb-4" />
              <p className="text-xl text-gray-400">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group relative bg-gradient-to-b from-gray-900 to-black rounded-2xl overflow-hidden border border-gray-800 hover:border-red-500/50 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/20"
                >
                  {/* Wishlist Button */}
                  <button className="absolute top-4 right-4 z-10 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-red-500 transition-colors group/heart">
                    <Heart className="w-5 h-5 group-hover/heart:fill-white" />
                  </button>

                  {/* Product Image */}
                  <div className="aspect-square overflow-hidden bg-gray-800">
                    <img
                      src={product.image || 'https://via.placeholder.com/400'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-bold line-clamp-2">
                        {product.name}
                      </h3>
                      {product.badge && (
                        <span className="text-xs font-bold text-red-500 px-2 py-1 bg-red-500/10 rounded-full whitespace-nowrap">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-400 text-sm line-clamp-2">
                      {product.description}
                    </p>

                    {/* Rating */}
                    {product.rating && (
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-400 ml-1">
                          ({product.rating})
                        </span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="text-2xl font-black">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <Button className="w-full bg-white text-black font-bold hover:bg-red-500 rounded-full group-hover:bg-red-500 group-hover:text-white transition-colors cursor-pointer">
                      Add to Cart
                    </Button>
                  </div>

                  {/* Sale/New Badge */}
                  {product.isNew && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      NEW
                    </div>
                  )}
                  {product.discount && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      -{product.discount}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <EcomFooter />
    </div>
  );
};

export default ProductsPage;