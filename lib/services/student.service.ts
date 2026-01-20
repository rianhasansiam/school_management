// ============================================
// STUDENT SERVICE
// ============================================
// Demo implementation - ready for API integration

import { Student } from '@/lib/types';
import { DEMO_STUDENTS, DEMO_CLASSES } from '@/lib/demo-data';
import { PaginatedResponse, QueryParams } from './types';

export const studentService = {
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Student>> {
    // Simulated API call with demo data
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    let filtered = [...DEMO_STUDENTS];
    
    // Apply search filter
    if (params?.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          `${s.firstName} ${s.lastName}`.toLowerCase().includes(search) ||
          s.studentId.toLowerCase().includes(search)
      );
    }
    
    // Apply class filter
    if (params?.classId) {
      filtered = filtered.filter((s) => s.classId === params.classId);
    }
    
    // Pagination
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);
    
    return {
      data,
      pagination: { page, pageSize, total, totalPages },
    };
  },

  async getById(id: string): Promise<Student | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return DEMO_STUDENTS.find((s) => s.id === id) || null;
  },

  async getByClassId(classId: string): Promise<Student[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return DEMO_STUDENTS.filter((s) => s.classId === classId);
  },

  async create(data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<Student> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newStudent: Student = {
      ...data,
      id: `student-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    // In real app, this would call API
    return newStudent;
  },

  async update(id: string, data: Partial<Student>): Promise<Student | null> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const student = DEMO_STUDENTS.find((s) => s.id === id);
    if (!student) return null;
    // In real app, this would call API
    return { ...student, ...data, updatedAt: new Date() };
  },

  async delete(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // In real app, this would call API
    return true;
  },

  getClassInfo(classId: string) {
    return DEMO_CLASSES.find((c) => c.id === classId);
  },
};
