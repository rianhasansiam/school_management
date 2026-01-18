'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore, useUIStore } from '@/lib/store';
import { ROLE_LABELS } from '@/lib/constants';
import { Avatar, DropdownMenu, DropdownMenuItem, DropdownMenuDivider } from '@/components/ui';
import {
  Menu,
  Search,
  Bell,
  User,
  LogOut,
  Moon,
  Sun,
  X,
} from 'lucide-react';

// ============================================
// HEADER COMPONENT
// ============================================

export function Header() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { sidebarCollapsed, setSidebarOpen, theme, setTheme } = useUIStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showMobileSearch, setShowMobileSearch] = React.useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Search:', searchQuery);
    setShowMobileSearch(false);
  };

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-16 bg-white border-b border-gray-200',
        'transition-all duration-300 ease-in-out',
        // Desktop positioning based on sidebar
        'lg:left-64',
        sidebarCollapsed && 'lg:left-20',
        // Mobile: full width
        'left-0'
      )}
    >
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  'w-64 lg:w-80 pl-10 pr-4 py-2 rounded-lg',
                  'bg-gray-50 border border-gray-200',
                  'text-sm text-gray-900 placeholder-gray-400',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  'transition-all duration-200'
                )}
              />
            </div>
          </form>

          {/* Search button - Mobile */}
          <button
            onClick={() => setShowMobileSearch(true)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors md:hidden"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 sm:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Notifications */}
          <NotificationDropdown />

          {/* User Menu */}
          <DropdownMenu
            trigger={
              <button className="flex items-center gap-2 sm:gap-3 p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                <Avatar
                  src={user?.avatar}
                  alt={`${user?.firstName} ${user?.lastName}`}
                  size="sm"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.role && ROLE_LABELS[user.role]}
                  </p>
                </div>
              </button>
            }
          >
            <DropdownMenuItem icon={<User className="w-4 h-4" />}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuDivider />
            <DropdownMenuItem
              icon={<LogOut className="w-4 h-4" />}
              danger
              onClick={handleLogout}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Modal */}
      {showMobileSearch && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="flex items-center gap-2 p-4 border-b">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className={cn(
                    'w-full pl-10 pr-4 py-2 rounded-lg',
                    'bg-gray-50 border border-gray-200',
                    'text-sm text-gray-900 placeholder-gray-400',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  )}
                />
              </div>
            </form>
            <button
              onClick={() => setShowMobileSearch(false)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

// ============================================
// NOTIFICATION DROPDOWN
// ============================================

function NotificationDropdown() {
  const notifications = [
    {
      id: 1,
      title: 'New Assignment',
      message: 'Bengali essay submission deadline is today',
      time: '5 minutes ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Fee Pending',
      message: '3 students have pending fees',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Attendance Report',
      message: "Today's attendance report is ready",
      time: '3 hours ago',
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <DropdownMenu
      trigger={
        <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      }
    >
      <div className="w-80">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                'px-4 py-3 hover:bg-gray-50 cursor-pointer',
                'border-b border-gray-50 last:border-b-0',
                notification.unread && 'bg-blue-50/50'
              )}
            >
              <div className="flex items-start gap-3">
                {notification.unread && (
                  <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full flex-shrink-0" />
                )}
                <div className={cn(!notification.unread && 'ml-5')}>
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {notification.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 border-t border-gray-100">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all notifications
          </button>
        </div>
      </div>
    </DropdownMenu>
  );
}
