import { NavItem, UserRole } from './types';

// ============================================
// APPLICATION CONSTANTS
// ============================================

export const APP_NAME = 'ByteEdu';
export const APP_NAME_EN = 'ByteEdu';
export const APP_VERSION = '1.0.0';

// ----- NAVIGATION -----

export const NAVIGATION_ITEMS: NavItem[] = [
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
    title: 'Classes & Sections',
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
    title: 'Class Notes',
    href: '/notes',
    icon: 'StickyNote',
    roles: [UserRole.TEACHER],
  },
  {
    title: 'Financial Management',
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
        title: 'Fee Collection',
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
  {
    title: 'Settings',
    href: '/settings',
    icon: 'Settings',
    roles: [UserRole.ADMIN],
  },
];

// ----- ROLE LABELS -----

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Admin',
  [UserRole.TEACHER]: 'Teacher',
};

// ----- GENDER OPTIONS -----

export const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

// ----- ATTENDANCE STATUS -----

export const ATTENDANCE_STATUS_OPTIONS = [
  { label: 'Present', value: 'present' },
  { label: 'Absent', value: 'absent' },
  { label: 'Late', value: 'late' },
  { label: 'Excused', value: 'excused' },
];

// ----- PAYMENT STATUS -----

export const PAYMENT_STATUS_OPTIONS = [
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'Failed', value: 'failed' },
  { label: 'Cancelled', value: 'cancelled' },
];

// ----- FEE TYPES -----

export const FEE_TYPES = [
  { label: 'Monthly Tuition', value: 'tuition' },
  { label: 'Admission Fee', value: 'admission' },
  { label: 'Exam Fee', value: 'exam' },
  { label: 'Library Fee', value: 'library' },
  { label: 'Transport Fee', value: 'transport' },
  { label: 'Lab Fee', value: 'lab' },
  { label: 'Other', value: 'other' },
];

// ----- EXPENSE CATEGORIES -----

export const EXPENSE_CATEGORIES = [
  { label: 'Salary', value: 'salary' },
  { label: 'Utility', value: 'utility' },
  { label: 'Maintenance', value: 'maintenance' },
  { label: 'Equipment', value: 'equipment' },
  { label: 'Stationery', value: 'stationery' },
  { label: 'Transport', value: 'transport' },
  { label: 'Other', value: 'other' },
];

// ----- INCOME CATEGORIES -----

export const INCOME_CATEGORIES = [
  { label: 'Tuition Fee', value: 'tuition' },
  { label: 'Admission Fee', value: 'admission' },
  { label: 'Exam Fee', value: 'exam' },
  { label: 'Donation', value: 'donation' },
  { label: 'Government Grant', value: 'grant' },
  { label: 'Other', value: 'other' },
];

// ----- CLASSES -----

export const CLASS_OPTIONS = [
  { label: 'Play', value: 'play' },
  { label: 'Nursery', value: 'nursery' },
  { label: 'KG', value: 'kg' },
  { label: 'Class 1', value: '1' },
  { label: 'Class 2', value: '2' },
  { label: 'Class 3', value: '3' },
  { label: 'Class 4', value: '4' },
  { label: 'Class 5', value: '5' },
  { label: 'Class 6', value: '6' },
  { label: 'Class 7', value: '7' },
  { label: 'Class 8', value: '8' },
  { label: 'Class 9', value: '9' },
  { label: 'Class 10', value: '10' },
];

// ----- SECTIONS -----

export const SECTION_OPTIONS = [
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'C', value: 'C' },
  { label: 'D', value: 'D' },
];

// ----- MONTHS -----

export const MONTHS = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
];

// ----- PAGINATION -----

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// ----- DATE FORMATS -----

export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATE_TIME_FORMAT = 'dd/MM/yyyy hh:mm a';
export const TIME_FORMAT = 'hh:mm a';

// ----- SUBJECTS -----

export const SUBJECT_OPTIONS = [
  { label: 'Bengali', value: 'bangla' },
  { label: 'English', value: 'english' },
  { label: 'Mathematics', value: 'math' },
  { label: 'Science', value: 'science' },
  { label: 'Social Science', value: 'social' },
  { label: 'Religion', value: 'religion' },
  { label: 'ICT', value: 'ict' },
  { label: 'Physical Education', value: 'physical' },
];

// ----- ASSIGNMENT STATUS -----

export const ASSIGNMENT_STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Closed', value: 'closed' },
];