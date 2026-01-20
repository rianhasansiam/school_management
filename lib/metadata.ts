import { Metadata } from 'next';
import { config } from '@/lib/config';

// ============================================
// METADATA UTILITIES
// ============================================

interface PageMetadataOptions {
  title: string;
  description?: string;
  keywords?: string[];
  noIndex?: boolean;
}

export function generatePageMetadata({
  title,
  description,
  keywords = [],
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const fullTitle = `${title} | ${config.app.name}`;
  const defaultDescription = 'Comprehensive school management system for educational institutions';

  return {
    title: fullTitle,
    description: description || defaultDescription,
    keywords: ['school management', 'education', 'students', 'teachers', ...keywords],
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    openGraph: {
      title: fullTitle,
      description: description || defaultDescription,
      type: 'website',
      siteName: config.app.name,
    },
  };
}

// ============================================
// PRE-DEFINED PAGE METADATA
// ============================================

export const pageMetadata = {
  dashboard: generatePageMetadata({
    title: 'Dashboard',
    description: 'Overview of school management activities and statistics',
  }),

  students: generatePageMetadata({
    title: 'Students',
    description: 'Manage student records, enrollment, and academic information',
    keywords: ['students', 'enrollment', 'academic records'],
  }),

  teachers: generatePageMetadata({
    title: 'Teachers',
    description: 'Manage teacher profiles, assignments, and schedules',
    keywords: ['teachers', 'faculty', 'staff management'],
  }),

  classes: generatePageMetadata({
    title: 'Classes & Sections',
    description: 'Manage class sections and academic structure',
    keywords: ['classes', 'sections', 'academic structure'],
  }),

  attendance: generatePageMetadata({
    title: 'Attendance',
    description: 'Track and manage student attendance records',
    keywords: ['attendance', 'tracking', 'records'],
  }),

  finance: generatePageMetadata({
    title: 'Financial Management',
    description: 'Manage fees, expenses, and financial transactions',
    keywords: ['finance', 'fees', 'payments', 'expenses'],
  }),

  reports: generatePageMetadata({
    title: 'Reports',
    description: 'Generate and view various school reports and analytics',
    keywords: ['reports', 'analytics', 'statistics'],
  }),

  login: generatePageMetadata({
    title: 'Login',
    description: 'Sign in to access the school management system',
    noIndex: true,
  }),
};
