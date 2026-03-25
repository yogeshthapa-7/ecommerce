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
  User,
  LogOut,
} from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const EcomNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ firstName?: string; lastName?: string; role?: string } | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  // Cart functionality
  const { setIsCartOpen, getCartCount } = useCart();
  const cartCount = getCartCount();

  useEffect(() => {
    // Check for logged in user
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowUserMenu(false);
    router.push("/login");
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "?";
    const first = user.firstName?.charAt(0) || "";
    const last = user.lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || user.firstName?.charAt(0)?.toUpperCase() || "U";
  };

  // Check if user is regular user (not admin)
  const isRegularUser = user && user.role === "user";

  return (
    <div>
      {/* NAVBAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-12">
              <Link href='/nike'>
                <h1 className="text-2xl font-black tracking-tight">

                  <span className="text-white cursor-pointer">NIKE</span>
                </h1>
              </Link>
              <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium">
                <Link
                  href="/nike/products"
                  className="hover:text-gray-300 transition-colors relative group"
                >
                  New Releases
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
                </Link>
                <Link
                  href="/nike/products/category/Men"
                  className="hover:text-gray-300 transition-colors relative group"
                >
                  Men
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
                </Link>
                <Link
                  href="/nike/products/category/Women"
                  className="hover:text-gray-300 transition-colors relative group"
                >
                  Women
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
                </Link>
                <Link
                  href="/nike/products/category/Kids"
                  className="hover:text-gray-300 transition-colors relative group"
                >
                  Kids
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
                </Link>
                <Link
                  href="/nike/products"
                  className="text-red-500 hover:text-red-400 transition-colors relative group font-semibold"
                >
                  Sale
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 transition-all group-hover:w-full"></span>
                </Link>
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

              {/* User Profile - Only show for regular users */}
              {isRegularUser ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-800 rounded-full px-3 py-2 transition-colors"
                  >
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {getUserInitials()}
                    </div>
                    <span className="hidden md:block text-sm text-white">
                      {user?.firstName || "User"}
                    </span>
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gray-800">
                        <p className="text-sm font-medium text-white">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-400">Member</p>
                      </div>
                      <Link
                        href="/nike/profile"
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Show Sign In button for non-logged-in users */
                !user && (
                  <Link href="/login">
                    <Button variant="ghost" className="text-white hover:bg-red-500">
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                )
              )}

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
              <Link href="/nike/products" className="hover:text-gray-300 transition-colors">
                New Releases
              </Link>
              <Link href="/nike/products/category/Men" className="hover:text-gray-300 transition-colors">
                Men
              </Link>
              <Link href="/nike/products/category/Women" className="hover:text-gray-300 transition-colors">
                Women
              </Link>
              <Link href="/nike/products/category/Kids" className="hover:text-gray-300 transition-colors">
                Kids
              </Link>
              <Link
                href="/nike/products"
                className="text-red-500 hover:text-red-400 transition-colors font-semibold"
              >
                Sale
              </Link>

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