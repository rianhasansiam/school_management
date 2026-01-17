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
      title: 'Teacher Assignments',
      href: '/teacher-assignments',
      icon: 'UserPlus',
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
      title: 'Attendance',
      href: '/attendance',
      icon: 'ClipboardCheck',
      roles: [UserRole.ADMIN, UserRole.TEACHER],
    },
    {
      title: 'Assignments',
      href: '/assignments',
      icon: 'FileText',
      roles: [UserRole.ADMIN, UserRole.TEACHER],
    },
    {
      title: 'Notes',
      href: '/notes',
      icon: 'StickyNote',
      roles: [UserRole.TEACHER],
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
        {
          title: 'Activity Log',
          href: '/reports/audit',
          icon: 'History',
          roles: [UserRole.ADMIN],
        },
      ],
    },
  ];
}
