import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  strength: string;
  form: string;
  genericName?: string;
  rating?: number;
  category?: string;
  addedAt: number;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeItem: (id: string) => void;
  clearWishlist: () => void;
  getItemCount: () => number;
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find((i) => i.id === item.id);
        
        if (!existingItem) {
          set({
            items: [...items, { ...item, addedAt: Date.now() }],
          });
        }
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      getItemCount: () => {
        return get().items.length;
      },

      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id);
      },

      toggleWishlist: (item) => {
        const { isInWishlist, addItem, removeItem } = get();
        if (isInWishlist(item.id)) {
          removeItem(item.id);
        } else {
          addItem(item);
        }
      },
    }),
    {
      name: 'pharma-wishlist',
      version: 1,
    }
  )
);
