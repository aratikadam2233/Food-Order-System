import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const CartContext = createContext(null);

const DELIVERY_FEE = 40;
const TAX_RATE = 0.05;

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((food, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i._id === food._id);
      if (existing) {
        return prev.map((i) => (i._id === food._id ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [...prev, { _id: food._id, name: food.name, image: food.image, price: food.price, quantity }];
    });
  }, []);

  const increaseQuantity = useCallback((foodId) => {
    setItems((prev) => prev.map((i) => (i._id === foodId ? { ...i, quantity: i.quantity + 1 } : i)));
  }, []);

  const decreaseQuantity = useCallback((foodId) => {
    setItems((prev) =>
      prev
        .map((i) => (i._id === foodId ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((foodId) => {
    setItems((prev) => prev.filter((i) => i._id !== foodId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);
  const deliveryFee = useMemo(() => (items.length > 0 ? DELIVERY_FEE : 0), [items]);
  const tax = useMemo(() => Math.round(subtotal * TAX_RATE), [subtotal]);
  const discount = 0;
  const totalAmount = useMemo(
    () => Math.max(0, subtotal + deliveryFee + tax - discount),
    [subtotal, deliveryFee, tax]
  );
  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        deliveryFee,
        tax,
        discount,
        totalAmount,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};
