// ============================================
// SCHOOL MANAGEMENT SYSTEM - TYPE DEFINITIONS
// ============================================

// ----- ENUMS -----

export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  EXCUSED = 'excused',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  OVERDUE = 'overdue',
}

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum AssignmentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CLOSED = 'closed',
}

// ----- BASE TYPES -----

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
}

// ----- USER & AUTH -----

export interface User extends BaseEntity {
  email: string;
  phone: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// ----- TEACHER -----

export interface Teacher extends BaseEntity {
  userId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: Gender;
  dateOfBirth: Date;
  joiningDate: Date;
  qualification: string;
  specialization: string;
  salary: number;
  address: string;
  avatar?: string;
  isActive: boolean;
}

// ----- STUDENT -----

export interface Student extends BaseEntity {
  studentId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  gender: Gender;
  dateOfBirth: Date;
  admissionDate: Date;
  classId: string;
  sectionId?: string;
  rollNumber: number;
  guardianName: string;
  guardianPhone: string;
  guardianRelation: string;
  address: string;
  avatar?: string;
  isActive: boolean;
}

// ----- CLASS & SECTION -----

export interface Class extends BaseEntity {
  name: string;
  grade: number;
  section: string;
  academicYear: string;
  classTeacherId?: string;
  description?: string;
  capacity: number;
  isActive: boolean;
}

export interface Section extends BaseEntity {
  name: string;
  classId: string;
  capacity: number;
  isActive: boolean;
}

// ----- SUBJECT -----

export interface Subject extends BaseEntity {
  name: string;
  code: string;
  description?: string;
  classId: string;
  teacherId?: string;
  creditHours?: number;
  periodsPerWeek?: number;
  type?: 'core' | 'elective' | 'practical';
  isActive: boolean;
}

// ----- ATTENDANCE -----

export interface Attendance extends BaseEntity {
  studentId: string;
  classId: string;
  date: Date;
  status: AttendanceStatus;
  remarks?: string;
  markedBy: string;
}

export interface AttendanceSummary {
  studentId: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  percentage: number;
}

// ----- ASSIGNMENT -----

export interface Assignment extends BaseEntity {
  title: string;
  description: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  dueDate: Date;
  maxMarks: number;
  status: AssignmentStatus;
  attachments?: string[];
}

export interface AssignmentSubmission extends BaseEntity {
  assignmentId: string;
  studentId: string;
  submittedAt: Date;
  content?: string;
  attachments?: string[];
  marks?: number;
  feedback?: string;
  isGraded: boolean;
}

// ----- CLASS NOTES -----

export interface ClassNote extends BaseEntity {
  title: string;
  content: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  attachments?: string[];
  isPublished: boolean;
}

// ----- FINANCIAL -----

export interface Transaction extends BaseEntity {
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
  date: Date;
  reference?: string;
  createdBy: string;
  status: PaymentStatus;
}

export interface SalaryPayment extends BaseEntity {
  teacherId: string;
  month: number;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  paidDate?: Date;
  status: PaymentStatus;
  remarks?: string;
}

export interface Fee extends BaseEntity {
  studentId: string;
  feeType: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: PaymentStatus;
  academicYear: string;
  month?: number;
}

// ----- REPORTS & ANALYTICS -----

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalIncome: number;
  totalExpense: number;
  attendanceRate: number;
  pendingFees: number;
  recentActivities: Activity[];
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  userId: string;
  userName: string;
}

// ----- AUDIT LOG -----

export interface AuditLog extends BaseEntity {
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

// ----- UI TYPES -----

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
  roles: UserRole[];
}

export interface TableColumn<T> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: PaginationMeta;
}

// ----- FORM TYPES -----

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[];
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  };
}
