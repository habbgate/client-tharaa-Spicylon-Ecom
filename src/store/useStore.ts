import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  prices?: Record<string, number>;
  image: string;
  quantity: number;
  stock: number;
}

interface StoreState {
  cart: CartItem[];
  user: any | null;
  currency: string;
  lang: string;
  addToCart: (product: any, price: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setUser: (user: any) => void;
  setCurrency: (currency: string) => void;
  setLang: (lang: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      cart: [],
      user: null,
      currency: 'USD',
      lang: 'en',
      addToCart: (product, price) => set((state) => {
        const existing = state.cart.find((item) => item.id === product._id);
        if (existing) {
          return {
            cart: state.cart.map((item) =>
              item.id === product._id 
                ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } 
                : item
            ),
          };
        }
        if (product.stock > 0) {
          return {
            cart: [...state.cart, { id: product._id, name: product.name, price, prices: product.price, image: product.images[0], quantity: 1, stock: product.stock }],
          };
        }
        return state;
      }),
      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter((item) => item.id !== id),
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        cart: state.cart.map((item) => 
          (item.id === id ? { ...item, quantity: Math.min(Math.max(quantity, 1), item.stock || Infinity) } : item)
        ),
      })),
      clearCart: () => set({ cart: [] }),
      setUser: (user) => set({ user }),
      setCurrency: (currency) => set({ currency }),
      setLang: (lang) => set({ lang }),
    }),
    { name: 'spicylon-storage' }
  )
);
