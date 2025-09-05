import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminUser {
  id: string;
  email: string;
}

interface AdminStore {
  user: AdminUser | null;
  isAdmin: boolean;
  isLoginModalOpen: boolean;
  login: (user: AdminUser) => void;
  logout: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

export const useAdmin = create<AdminStore>()(
  persist(
    (set) => ({
      user: null,
      isAdmin: false,
      isLoginModalOpen: false,
      login: (user) => set({ user, isAdmin: true }),
      logout: () => set({ user: null, isAdmin: false, isLoginModalOpen: false }),
      openLoginModal: () => set({ isLoginModalOpen: true }),
      closeLoginModal: () => set({ isLoginModalOpen: false }),
    }),
    {
      name: 'admin-storage',
      partialize: (state) => ({ user: state.user, isAdmin: state.isAdmin }),
    }
  )
);
