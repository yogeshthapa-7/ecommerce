"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { getToken, getUser } from '@/lib/auth';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = !!getToken();

  // Load cart from backend when user is logged in, otherwise from localStorage
  const refreshCart = async () => {
    const token = getToken();
    const userStr = getUser();
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserId(user._id || user.id);
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setCartItems(data.items || []);
          localStorage.setItem('nikeCart', JSON.stringify(data.items || []));
        } else {
          const savedCart = localStorage.getItem('nikeCart');
          if (savedCart) {
            setCartItems(JSON.parse(savedCart));
          }
        }
      } catch (error) {
        console.error('Error refreshing cart:', error);
        const savedCart = localStorage.getItem('nikeCart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      }
    } else {
      setUserId(null);
      const savedCart = localStorage.getItem('nikeCart');
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error loading cart:', error);
        }
      }
    }
  };

  useEffect(() => {
    refreshCart().finally(() => setLoading(false));
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('nikeCart', JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  // Sync cart item to backend
  const syncToBackend = async (items) => {
    const token = getToken();
    if (!token || !userId) return;
    
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ items })
      });
    } catch (error) {
      console.error('Error syncing cart to backend:', error);
    }
  };

  // Add item to cart
  const addToCart = (product, selectedColor, selectedSize, quantity = 1) => {
    setCartItems((prevItems) => {
      const cartItemId = `${product._id || product.id}-${selectedColor?.name || 'default'}-${selectedSize}`;
      const existingItemIndex = prevItems.findIndex((item) => item.cartItemId === cartItemId);

      let updatedItems;
      if (existingItemIndex > -1) {
        updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
      } else {
        const newItem = {
          cartItemId,
          productId: product._id || product.id,
          name: product.name,
          price: product.price,
          currency: product.currency || '$',
          image: selectedColor?.image_url || product.image_url,
          color: selectedColor?.name || 'Default',
          size: selectedSize,
          quantity: quantity,
          category: product.category
        };
        updatedItems = [...prevItems, newItem];
      }

      syncToBackend(updatedItems);
      return updatedItems;
    });

    setIsCartOpen(true);
  };

  // Remove item from cart
  const removeFromCart = (cartItemId) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.cartItemId !== cartItemId);
      syncToBackend(updatedItems);
      return updatedItems;
    });
  };

  // Update item quantity
  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
      );
      syncToBackend(updatedItems);
      return updatedItems;
    });
  };

  // Clear entire cart (both localStorage and backend)
  const clearCart = async () => {
    setCartItems([]);
    localStorage.removeItem('nikeCart');
    
    const token = getToken();
    if (token && userId) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/clear`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        console.error('Error clearing cart on backend:', error);
      }
    }
  };

  // Clear local cart only (keep backend cart for next login)
  const clearLocalCart = () => {
    setCartItems([]);
    localStorage.removeItem('nikeCart');
  };

  // Calculate totals
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const addOrderItemsToCart = (orderItems = []) => {
    setCartItems((prevItems) => {
      const nextItems = [...prevItems];
      orderItems.forEach((item) => {
        const productId = item.productId || item._id || `order-${Date.now()}-${Math.random()}`;
        const cartItemId = `${productId}-${item.color || 'default'}-${item.size || 'default'}`;
        const existingIndex = nextItems.findIndex((cartItem) => cartItem.cartItemId === cartItemId);
        const normalizedItem = {
          cartItemId,
          productId,
          name: item.name,
          price: Number(item.price || 0),
          currency: item.currency || '$',
          image: item.image || '',
          color: item.color || 'Default',
          size: item.size || '',
          quantity: Number(item.quantity || 1),
          category: item.category || '',
        };
        if (existingIndex > -1) {
          nextItems[existingIndex] = normalizedItem;
        } else {
          nextItems.push(normalizedItem);
        }
      });
      
      syncToBackend(nextItems);
      return nextItems;
    });
  };

  const value = {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    addOrderItemsToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    clearLocalCart,
    refreshCart,
    getCartTotal,
    getCartCount,
    loading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
