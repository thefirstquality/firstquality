'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CartItem {
  id: string;
  name: string;
  unit: string;
  price_text?: string;
  image_url?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: {
      id: string;
      name: string;
      unit?: string;
      price_text?: string;
      image_url?: string;
    },
    quantity?: number
  ) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  setQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  totalCount: number;
  getItemQuantity: (id: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'firstquality_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [items, isLoaded]);

  const addToCart = useCallback(
    (
      product: {
        id: string;
        name: string;
        unit?: string;
        price_text?: string;
        image_url?: string;
      },
      quantity: number = 1
    ) => {
      setItems((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === product.id);
        if (existingIndex > -1) {
          // If product is already in cart, maintain 1 quantity without multiplying
          return prev;
        } else {
          return [
            ...prev,
            {
              id: product.id,
              name: product.name,
              unit: product.unit || '1 kg',
              price_text: product.price_text,
              image_url: product.image_url,
              quantity: 1,
            },
          ];
        }
      });
    },
    []
  );

  const removeFromCart = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  }, []);

  const setQuantity = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getItemQuantity = useCallback(
    (id: string) => {
      const item = items.find((i) => i.id === id);
      return item ? item.quantity : 0;
    },
    [items]
  );

  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        setQuantity,
        clearCart,
        totalCount,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
