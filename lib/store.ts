import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/lib/types';
import { DEMO_USERS } from '@/lib/demo-data';

// ============================================
// AUTH STORE
// ============================================

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, _password: string) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Demo authentication - find user by email
        const user = DEMO_USERS.find((u) => u.email === email);
        
        if (user) {
          set({ user, isAuthenticated: true, isLoading: false });
          return { success: true };
        }
        
        set({ isLoading: false });
        return { success: false, error: 'Invalid email or password' };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// ============================================
// UI STORE
// ============================================

interface UIStore {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'system';
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapse: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      sidebarCollapsed: false,
      theme: 'light',

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
      toggleSidebarCollapse: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'ui-storage',
    }
  )
);

// ============================================
// HELPERS
// ============================================

export function useIsAdmin(): boolean {
  const user = useAuthStore((state) => state.user);
  return user?.role === UserRole.ADMIN;
}

export function useIsTeacher(): boolean {
  const user = useAuthStore((state) => state.user);
  return user?.role === UserRole.TEACHER;
}

export function useHasRole(roles: UserRole[]): boolean {
  const user = useAuthStore((state) => state.user);
  return user ? roles.includes(user.role) : false;
}
