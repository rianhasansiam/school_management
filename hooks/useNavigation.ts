'use client';

import { NavItem, UserRole } from '@/lib/types';

// ============================================
// NAVIGATION HOOK
// ============================================

export function useNavigation(): NavItem[] {
  return [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: 'LayoutDashboard',
      roles: [UserRole.ADMIN, UserRole.TEACHER],
    },
    
    {
      title: 'Students',
      href: '/students',
      icon: 'Users',
      roles: [UserRole.ADMIN, UserRole.TEACHER],
    },
    {
      title: 'Teachers',
      href: '/teachers',
      icon: 'GraduationCap',
      roles: [UserRole.ADMIN],
    },
    
    {
      title: 'Classes',
      href: '/classes',
      icon: 'School',
      roles: [UserRole.ADMIN],
    },
    {
      title: 'Subjects',
      href: '/subjects',
      icon: 'BookOpen',
      roles: [UserRole.ADMIN, UserRole.TEACHER],
    },
    {
      title: 'Teacher Attendance',
      href: '/attendance',
      icon: 'ClipboardCheck',
      roles: [UserRole.ADMIN],
    },
    {
      title: 'View Teacher Attendance',
      href: '/teacher-attendance-view',
      icon: 'ClipboardList',
      roles: [UserRole.TEACHER],
    },
    {
      title: 'Student Attendance',
      href: '/student-attendance',
      icon: 'UserCheck',
      roles: [UserRole.ADMIN, UserRole.TEACHER],
    },
    {
      title: 'Student Resources',
      href: '/student-resources',
      icon: 'Package',
      roles: [UserRole.TEACHER],
    },
    {
      title: 'Inventory',
      href: '/inventory',
      icon: 'Package',
      roles: [UserRole.ADMIN],
    },
    {
      title: 'Notices',
      href: '/notices',
      icon: 'Bell',
      roles: [UserRole.ADMIN],
    },
    {
      title: 'My Drive',
      href: '/notes',
      icon: 'HardDrive',
      roles: [UserRole.TEACHER],
    },
    {
      title: 'Resources',
      href: '/resources',
      icon: 'BookMarked',
      roles: [UserRole.ADMIN],
      children: [
        {
          title: 'Books',
          href: '/resources/books',
          icon: 'BookOpen',
          roles: [UserRole.ADMIN],
        },
        {
          title: 'ID Cards',
          href: '/resources/id-cards',
          icon: 'CreditCard',
          roles: [UserRole.ADMIN],
        },
      ],
    },
    {
      title: 'Finance',
      href: '/finance',
      icon: 'Wallet',
      roles: [UserRole.ADMIN],
      children: [
        {
          title: 'Income',
          href: '/finance/income',
          icon: 'TrendingUp',
          roles: [UserRole.ADMIN],
        },
        {
          title: 'Expenses',
          href: '/finance/expenses',
          icon: 'TrendingDown',
          roles: [UserRole.ADMIN],
        },
        {
          title: 'Salary',
          href: '/finance/salary',
          icon: 'Banknote',
          roles: [UserRole.ADMIN],
        },
        {
          title: 'Fees',
          href: '/finance/fees',
          icon: 'Receipt',
          roles: [UserRole.ADMIN],
        },
      ],
    },
    {
      title: 'Reports',
      href: '/reports',
      icon: 'BarChart3',
      roles: [UserRole.ADMIN],
      children: [
        {
          title: 'Attendance Report',
          href: '/reports/attendance',
          icon: 'FileCheck',
          roles: [UserRole.ADMIN],
        },
        {
          title: 'Financial Report',
          href: '/reports/financial',
          icon: 'FileSpreadsheet',
          roles: [UserRole.ADMIN],
        },
        
      ],
    },
  ];
}
