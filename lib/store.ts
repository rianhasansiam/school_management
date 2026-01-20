import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/lib/types';
import { DEMO_USERS } from '@/lib/demo-data';

// ============================================
// NOTICE TYPES
// ============================================

export interface Notice {
  id: string;
  title: string;
  message: string;
  createdAt: Date;
  createdBy: string;
  priority: 'low' | 'medium' | 'high';
  targetRole: 'all' | 'teachers' | 'students';
  isRead: boolean;
}

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
// NOTICE STORE
// ============================================

interface NoticeStore {
  notices: Notice[];
  addNotice: (notice: Omit<Notice, 'id' | 'createdAt' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotice: (id: string) => void;
  getUnreadCount: () => number;
}

// Demo notices
const DEMO_NOTICES: Notice[] = [
  {
    id: '1',
    title: 'Staff Meeting Tomorrow',
    message: 'All teachers are required to attend the staff meeting tomorrow at 10:00 AM in the conference room.',
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    createdBy: 'Admin',
    priority: 'high',
    targetRole: 'teachers',
    isRead: false,
  },
  {
    id: '2',
    title: 'Exam Schedule Released',
    message: 'The final exam schedule has been released. Please check the academic calendar for details.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    createdBy: 'Admin',
    priority: 'medium',
    targetRole: 'all',
    isRead: false,
  },
  {
    id: '3',
    title: 'Holiday Notice',
    message: 'School will remain closed on Friday due to a public holiday.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    createdBy: 'Admin',
    priority: 'low',
    targetRole: 'all',
    isRead: true,
  },
];

export const useNoticeStore = create<NoticeStore>()(
  persist(
    (set, get) => ({
      notices: DEMO_NOTICES,

      addNotice: (notice) => {
        const newNotice: Notice = {
          ...notice,
          id: Date.now().toString(),
          createdAt: new Date(),
          isRead: false,
        };
        set((state) => ({ notices: [newNotice, ...state.notices] }));
      },

      markAsRead: (id) => {
        set((state) => ({
          notices: state.notices.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notices: state.notices.map((n) => ({ ...n, isRead: true })),
        }));
      },

      deleteNotice: (id) => {
        set((state) => ({
          notices: state.notices.filter((n) => n.id !== id),
        }));
      },

      getUnreadCount: () => {
        return get().notices.filter((n) => !n.isRead).length;
      },
    }),
    {
      name: 'notice-storage',
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
