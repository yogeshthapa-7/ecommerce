"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ShoppingBag,
  Star,
  Heart,
  Search,
  ArrowLeft,
} from 'lucide-react';
import EcomNavbar from '@/components/ecomnavbar';
import EcomFooter from '@/components/ecomfooter';

const CategoryPage = () => {
  const params = useParams();
  const categoryParam = params?.category;
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGender, setSelectedGender] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Capitalize first letter of category
  const categoryName = categoryParam 
    ? categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)
    : '';

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

  // Filter products by category and other filters
  const categoryProducts = products.filter((product) => {
    if (!product || !product.category) return false;
    
    // Match category (case-insensitive)
    const matchesCategory = product.category.toLowerCase() === categoryParam?.toLowerCase();
    
    // Match gender
    const matchesGender = selectedGender === 'All' || product.gender === selectedGender;
    
    // Match search
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesGender && matchesSearch;
  });

  // Get unique genders from category products
  const genders = ['All', ...new Set(categoryProducts.map((p) => p.gender))];

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
          {/* Back Link */}
          <Link 
            href="/nike/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-red-500 transition-colors mb-6 uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Products
          </Link>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black">
              {categoryName} <span className="text-red-500">COLLECTION</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              Explore our complete range of premium {categoryName.toLowerCase()}
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col gap-6">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${categoryName.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-full pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            {/* Gender Filter */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Filter by Gender</label>
              <div className="flex gap-2 flex-wrap">
                {genders.map((gender) => (
                  <button
                    key={gender}
                    onClick={() => setSelectedGender(gender)}
                    className={`px-6 py-2 rounded-full font-bold transition-all ${
                      selectedGender === gender
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="text-gray-400 text-sm">
              {categoryProducts.length} {categoryProducts.length === 1 ? 'Product' : 'Products'}
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
          ) : categoryProducts.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 mx-auto text-gray-700 mb-4" />
              <p className="text-xl text-gray-400">No products found</p>
              <Link 
                href="/nike/products"
                className="inline-block mt-6 text-red-500 hover:underline"
              >
                Browse all products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <EcomFooter />
    </div>
  );
};

export default CategoryPage;