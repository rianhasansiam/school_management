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
  ClipboardList,
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
  BookMarked,
  CreditCard,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Pin,
  PinOff,
  LucideIcon,
  UserCheck,
  HardDrive,
  Package,
} from 'lucide-react';

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  BookOpen,
  ClipboardCheck,
  ClipboardList,
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
  BookMarked,
  CreditCard,
  Bell,
  UserCheck,
  HardDrive,
  Package,
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
  const [isHovering, setIsHovering] = React.useState(false);
  const [isPinned, setIsPinned] = React.useState(true);
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Check screen size
  React.useEffect(() => {
    const checkScreen = () => setIsLgScreen(window.innerWidth >= 1024);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Cleanup hover timeout
  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
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

  // Handle hover for collapsed sidebar
  const handleMouseEnter = () => {
    if (sidebarCollapsed && isLgScreen && !isPinned) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovering(true);
      }, 150);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovering(false);
    }, 300);
  };

  // Determine if sidebar should show expanded state
  const showExpanded = !sidebarCollapsed || (sidebarCollapsed && isHovering && !isPinned);

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 lg:hidden",
          "transition-opacity duration-300 ease-out",
          sidebarOpen && !isLgScreen 
            ? "opacity-100 backdrop-blur-sm" 
            : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'fixed left-0 top-0 z-50 h-screen bg-white border-r border-gray-200',
          'transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
          'shadow-sm',
          // Mobile: slide in/out with transform
          'lg:translate-x-0',
          !isLgScreen && (sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'),
          // Desktop: collapse/expand width
          isLgScreen && (showExpanded ? 'w-64' : 'w-20'),
          // Hover effect: add shadow when expanding
          isLgScreen && sidebarCollapsed && isHovering && 'shadow-xl',
          // Mobile always full width sidebar
          !isLgScreen && 'w-72'
        )}
      >
        {/* Logo */}
        <div className={cn(
          "flex items-center h-16 px-4 border-b border-gray-100",
          "transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
          !showExpanded && isLgScreen ? "justify-center" : "justify-between"
        )}>
          <Link 
            href="/dashboard" 
            className={cn(
              "flex items-center gap-3 transition-all duration-300",
              !showExpanded && isLgScreen && "hidden"
            )}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <School className="w-5 h-5 text-white" />
            </div>
            <span className={cn(
              "font-bold text-gray-900 text-sm whitespace-nowrap",
              "transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
              !showExpanded && isLgScreen ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
            )}>
              School Management
            </span>
          </Link>
          
          {/* Collapsed state logo */}
          {!showExpanded && isLgScreen && (
            <button
              onClick={toggleSidebarCollapse}
              className={cn(
                "w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl",
                "flex items-center justify-center shadow-md shadow-blue-500/20",
                "hover:from-blue-600 hover:to-blue-700",
                "transition-all duration-200 hover:scale-105 active:scale-95"
              )}
              title="Expand Sidebar"
            >
              <School className="w-5 h-5 text-white" />
            </button>
          )}
          
          {/* Close button for mobile */}
          {!isLgScreen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "p-2 rounded-lg hover:bg-gray-100 text-gray-500",
                "transition-all duration-200 hover:scale-105 active:scale-95"
              )}
            >
              <X className="w-5 h-5" />
            </button>
          )}
          
          {/* Collapse/Pin buttons for desktop (only when expanded) */}
          {isLgScreen && showExpanded && (
            <div className="flex items-center gap-1">
              {/* Pin button (only show when collapsed and hovering) */}
              {sidebarCollapsed && isHovering && (
                <button
                  onClick={() => {
                    setIsPinned(!isPinned);
                    if (!isPinned) {
                      toggleSidebarCollapse();
                    }
                  }}
                  className={cn(
                    "p-2 rounded-lg text-gray-500",
                    "transition-all duration-200 hover:scale-105 active:scale-95",
                    isPinned ? "hover:bg-blue-50 text-blue-500" : "hover:bg-gray-100"
                  )}
                  title={isPinned ? "Unpin Sidebar" : "Pin Sidebar"}
                >
                  {isPinned ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
                </button>
              )}
              
              {/* Collapse button */}
              {!sidebarCollapsed && (
                <button
                  onClick={toggleSidebarCollapse}
                  className={cn(
                    "p-2 rounded-lg hover:bg-gray-100 text-gray-500",
                    "transition-all duration-200 hover:scale-105 active:scale-95"
                  )}
                  title="Collapse Sidebar"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-64px)] overflow-x-hidden scrollbar-thin">
          {filteredNavItems.map((item, index) => (
            <div
              key={item.href}
              style={{ 
                animationDelay: `${index * 30}ms`,
                animation: sidebarOpen && !isLgScreen ? 'slideIn 0.3s ease-out forwards' : 'none'
              }}
            >
              <SidebarItem
                item={item}
                isActive={isActiveLink(item.href)}
                isExpanded={expandedItems.includes(item.href)}
                onToggleExpand={() => toggleExpand(item.href)}
                isCollapsed={!showExpanded && isLgScreen}
                pathname={pathname}
                onItemClick={() => !isLgScreen && setSidebarOpen(false)}
              />
            </div>
          ))}
        </nav>

        {/* Expand indicator for collapsed state */}
        {isLgScreen && sidebarCollapsed && !isHovering && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
            <button
              onClick={toggleSidebarCollapse}
              className={cn(
                "w-6 h-12 bg-white border border-gray-200 rounded-r-lg",
                "flex items-center justify-center shadow-sm",
                "hover:bg-gray-50 text-gray-400 hover:text-gray-600",
                "transition-all duration-200 hover:w-7"
              )}
              title="Expand Sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>

      {/* Add keyframe animation */}
      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 2px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
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
  const [showTooltip, setShowTooltip] = React.useState(false);

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
        'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl',
        'transition-all duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] cursor-pointer',
        isActive
          ? 'bg-blue-50 text-blue-600 shadow-sm'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
        isCollapsed && 'justify-center px-2'
      )}
      onClick={handleClick}
      onMouseEnter={() => isCollapsed && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {Icon && (
        <div className={cn(
          "relative shrink-0 transition-transform duration-200",
          !isCollapsed && "group-hover:scale-110"
        )}>
          <Icon className={cn(
            'w-5 h-5 transition-colors duration-200',
            isActive && 'text-blue-600'
          )} />
          {/* Active indicator dot for collapsed state */}
          {isActive && isCollapsed && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
          )}
        </div>
      )}
      <span className={cn(
        "flex-1 text-sm font-medium whitespace-nowrap overflow-hidden",
        "transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
        isCollapsed ? "w-0 opacity-0" : "opacity-100"
      )}>
        {item.title}
      </span>
      {hasChildren && !isCollapsed && (
        <ChevronDown
          className={cn(
            'w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
            isExpanded && 'rotate-180'
          )}
        />
      )}
      
      {/* Tooltip for collapsed state */}
      {isCollapsed && showTooltip && (
        <div className={cn(
          "absolute left-full ml-3 px-3 py-2 z-50",
          "bg-gray-900 text-white text-sm font-medium rounded-lg shadow-lg",
          "whitespace-nowrap pointer-events-none",
          "animate-in fade-in slide-in-from-left-2 duration-200"
        )}>
          {item.title}
          <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
        </div>
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

      {/* Children with smooth expand/collapse */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
          hasChildren && isExpanded && !isCollapsed ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
        )}
      >
        <div className="ml-4 pl-3 border-l-2 border-gray-100 space-y-1">
          {item.children?.map((child, index) => {
            const ChildIcon = iconMap[child.icon];
            const isChildActive = pathname === child.href;
            return (
              <Link 
                key={child.href} 
                href={child.href} 
                onClick={onItemClick}
                style={{ animationDelay: `${index * 50}ms` }}
                className="block"
              >
                <div
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm',
                    'transition-all duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
                    isChildActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1'
                  )}
                >
                  {ChildIcon && <ChildIcon className="w-4 h-4 shrink-0" />}
                  <span>{child.title}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
