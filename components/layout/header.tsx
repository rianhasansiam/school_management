'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore, useUIStore, useNoticeStore } from '@/lib/store';
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
  CheckCheck,
  AlertCircle,
  AlertTriangle,
  Info,
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
    // Use window.location for a clean redirect to avoid auth check interference
    window.location.href = '/';
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
        'transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
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
  const { notices, markAsRead, markAllAsRead } = useNoticeStore();
  const unreadCount = notices.filter((n) => !n.isRead).length;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-amber-500';
      default:
        return 'border-l-blue-500';
    }
  };

  return (
    <DropdownMenu
      trigger={
        <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      }
    >
      <div className="w-80">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <CheckCheck className="w-3 h-3" />
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notices.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            notices.slice(0, 5).map((notice) => (
              <div
                key={notice.id}
                onClick={() => markAsRead(notice.id)}
                className={cn(
                  'px-4 py-3 hover:bg-gray-50 cursor-pointer',
                  'border-b border-gray-50 last:border-b-0',
                  'border-l-4',
                  getPriorityColor(notice.priority),
                  !notice.isRead && 'bg-blue-50/50'
                )}
              >
                <div className="flex items-start gap-3">
                  {getPriorityIcon(notice.priority)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {notice.title}
                      </p>
                      {!notice.isRead && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                      {notice.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-400">
                        {formatTime(notice.createdAt)}
                      </p>
                      <span className={cn(
                        'text-xs px-1.5 py-0.5 rounded',
                        notice.targetRole === 'teachers' && 'bg-purple-100 text-purple-700',
                        notice.targetRole === 'students' && 'bg-green-100 text-green-700',
                        notice.targetRole === 'all' && 'bg-gray-100 text-gray-700'
                      )}>
                        {notice.targetRole === 'all' ? 'Everyone' : notice.targetRole}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {notices.length > 5 && (
          <div className="px-4 py-3 border-t border-gray-100">
            <a href="/notices" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all {notices.length} notifications
            </a>
          </div>
        )}
      </div>
    </DropdownMenu>
  );
}
