'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore, useUIStore } from '@/lib/store';
import { useNavigation } from '@/hooks/useNavigation';
import { NavItem } from '@/lib/types';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  BookOpen,
  ClipboardCheck,
  FileText,
  StickyNote,
  Wallet,
  TrendingUp,
  TrendingDown,
  Banknote,
  Receipt,
  BarChart3,
  FileCheck,
  FileSpreadsheet,
  History,
  UserPlus,
  ChevronDown,
  ChevronLeft,
  X,
  LucideIcon,
} from 'lucide-react';

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  BookOpen,
  ClipboardCheck,
  FileText,
  StickyNote,
  Wallet,
  TrendingUp,
  TrendingDown,
  Banknote,
  Receipt,
  BarChart3,
  FileCheck,
  FileSpreadsheet,
  History,
  UserPlus,
};

// ============================================
// SIDEBAR COMPONENT
// ============================================

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const { sidebarOpen, sidebarCollapsed, setSidebarOpen, toggleSidebarCollapse } = useUIStore();
  const navigationItems = useNavigation();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);
  const [isLgScreen, setIsLgScreen] = React.useState(true);

  // Check screen size
  React.useEffect(() => {
    const checkScreen = () => setIsLgScreen(window.innerWidth >= 1024);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const filteredNavItems = navigationItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  const toggleExpand = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
    );
  };

  const isActiveLink = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/');
  };

  // Close sidebar on route change for mobile
  React.useEffect(() => {
    if (!isLgScreen) {
      setSidebarOpen(false);
    }
  }, [pathname, isLgScreen, setSidebarOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && !isLgScreen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen bg-white border-r border-gray-200',
          'transition-all duration-300 ease-in-out',
          // Mobile: slide in/out
          'lg:translate-x-0',
          !isLgScreen && (sidebarOpen ? 'translate-x-0' : '-translate-x-full'),
          // Desktop: collapse/expand
          isLgScreen && (sidebarCollapsed ? 'w-20' : 'w-64'),
          // Mobile always full width sidebar
          !isLgScreen && 'w-72'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          {!(sidebarCollapsed && isLgScreen) && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <School className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900 text-sm">School Management</span>
            </Link>
          )}
          {sidebarCollapsed && isLgScreen && (
            <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto">
              <School className="w-5 h-5 text-white" />
            </div>
          )}
          
          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Collapse button for desktop */}
          <button
            onClick={toggleSidebarCollapse}
            className={cn(
              'p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors hidden lg:block',
              sidebarCollapsed && 'lg:hidden'
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-64px)]">
          {filteredNavItems.map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              isActive={isActiveLink(item.href)}
              isExpanded={expandedItems.includes(item.href)}
              onToggleExpand={() => toggleExpand(item.href)}
              isCollapsed={sidebarCollapsed && isLgScreen}
              pathname={pathname}
              onItemClick={() => !isLgScreen && setSidebarOpen(false)}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}

// ============================================
// SIDEBAR ITEM COMPONENT
// ============================================

interface SidebarItemProps {
  item: NavItem;
  isActive: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isCollapsed: boolean;
  pathname: string | null;
  onItemClick?: () => void;
}

function SidebarItem({
  item,
  isActive,
  isExpanded,
  onToggleExpand,
  isCollapsed,
  pathname,
  onItemClick,
}: SidebarItemProps) {
  const Icon = iconMap[item.icon];
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      onToggleExpand();
    } else {
      onItemClick?.();
    }
  };

  const content = (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg',
        'transition-all duration-200 cursor-pointer',
        isActive
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
        isCollapsed && 'justify-center px-2'
      )}
      onClick={handleClick}
    >
      {Icon && <Icon className={cn('w-5 h-5 shrink-0', isActive && 'text-blue-600')} />}
      {!isCollapsed && (
        <>
          <span className="flex-1 text-sm font-medium">{item.title}</span>
          {hasChildren && (
            <ChevronDown
              className={cn(
                'w-4 h-4 transition-transform duration-200',
                isExpanded && 'rotate-180'
              )}
            />
          )}
        </>
      )}
    </div>
  );

  return (
    <div>
      {hasChildren ? (
        content
      ) : (
        <Link href={item.href}>{content}</Link>
      )}

      {/* Children */}
      {hasChildren && isExpanded && !isCollapsed && (
        <div className="ml-4 mt-1 space-y-1">
          {item.children?.map((child) => {
            const ChildIcon = iconMap[child.icon];
            const isChildActive = pathname === child.href;
            return (
              <Link key={child.href} href={child.href} onClick={onItemClick}>
                <div
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm',
                    'transition-all duration-200',
                    isChildActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  {ChildIcon && <ChildIcon className="w-4 h-4 shrink-0" />}
                  <span>{child.title}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
