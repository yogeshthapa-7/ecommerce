"use client";
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import {
  Menu,
  X,
  ShoppingBag,
  Search,
  ChevronRight,
  Star,
  TrendingUp,
  Award,
  Users,
} from 'lucide-react';
import { useCart } from '@/app/context/CartContext';

const EcomNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Cart functionality
  const { setIsCartOpen, getCartCount } = useCart();
  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      {/* NAVBAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-black/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-12">
              <h1 className="text-2xl font-black tracking-tight">
                <span className="text-white">NIKE</span>
              </h1>

              <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium">
                <a
                  href="#"
                  className="hover:text-gray-300 transition-colors relative group"
                >
                  New Releases
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
                </a>
                <a
                  href="#"
                  className="hover:text-gray-300 transition-colors relative group"
                >
                  Men
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
                </a>
                <a
                  href="#"
                  className="hover:text-gray-300 transition-colors relative group"
                >
                  Women
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
                </a>
                <a
                  href="#"
                  className="hover:text-gray-300 transition-colors relative group"
                >
                  Kids
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
                </a>
                <a
                  href="#"
                  className="text-red-500 hover:text-red-400 transition-colors relative group font-semibold"
                >
                  Sale
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 transition-all group-hover:w-full"></span>
                </a>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center bg-gray-800/50 rounded-full px-4 py-2 space-x-2 hover:bg-gray-800 transition-colors">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-transparent border-none outline-none text-sm w-32 placeholder:text-gray-500"
                />
              </div>
              
              {/* Cart Button with Counter */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex hover:bg-red-500 hover:text-white relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-black/95 backdrop-blur-lg border-t border-gray-800">
            <nav className="flex flex-col space-y-4 px-6 py-6 text-sm font-medium">
              <a href="#" className="hover:text-gray-300 transition-colors">
                New Releases
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Men
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Women
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Kids
              </a>
              <a
                href="#"
                className="text-red-500 hover:text-red-400 transition-colors font-semibold"
              >
                Sale
              </a>
              
              {/* Mobile Cart Button */}
              <button
                onClick={() => {
                  setIsCartOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between hover:text-gray-300 transition-colors"
              >
                <span>Cart</span>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
              </button>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
};

export default EcomNavbar;