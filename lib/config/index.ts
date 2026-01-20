// ============================================
// APPLICATION CONFIGURATION
// ============================================

export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'School Management System',
    description: 'Comprehensive school management system for Bangladeshi schools',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    version: '1.0.0',
    author: 'SM System Team',
  },
  
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
  },
  
  upload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedDocTypes: ['application/pdf', 'application/msword'],
  },
  
  validation: {
    phone: {
      pattern: /^(\+880|880|0)?1[3-9]\d{8}$/,
      message: 'Please enter a valid Bangladeshi phone number',
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address',
    },
  },
  
  dateFormats: {
    display: 'dd MMM yyyy',
    input: 'yyyy-MM-dd',
    dateTime: 'dd MMM yyyy, hh:mm a',
  },
} as const;

export type Config = typeof config;
