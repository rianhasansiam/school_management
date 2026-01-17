'use client';

import * as React from 'react';
import { DashboardLayout, PageHeader } from '@/components/layout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Button,
  Input,
  Select,
  Modal,
  Pagination,
  EmptyState,
} from '@/components/ui';
import {
  DEMO_SUBJECTS,
  DEMO_CLASSES,
  DEMO_TEACHERS,
  getClassById,
  getTeacherById,
} from '@/lib/demo-data';
import { cn } from '@/lib/utils';
import { CLASS_OPTIONS } from '@/lib/constants';
import { Subject, UserRole } from '@/lib/types';
import { useAuthStore } from '@/lib/store';
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  BookText,
  Clock,
  GraduationCap,
  BookMarked,
} from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function SubjectsPage() {
  const { user } = useAuthStore();
  const isTeacher = user?.role === UserRole.TEACHER;
  const isAdmin = user?.role === UserRole.ADMIN;

  // Get teacher's data if logged in as teacher
  const myTeacherProfile = isTeacher ? DEMO_TEACHERS.find(t => t.userId === user?.id) : null;

  // Get available subjects (all for admin, only teacher's subjects for teacher)
  const availableSubjects = isAdmin 
    ? DEMO_SUBJECTS 
    : DEMO_SUBJECTS.filter(s => s.teacherId === myTeacherProfile?.id);

  const [searchTerm, setSearchTerm] = React.useState('');
  const [classFilter, setClassFilter] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [viewSubject, setViewSubject] = React.useState<Subject | null>(null);

  // Filter subjects
  const filteredSubjects = React.useMemo(() => {
    return availableSubjects.filter((subject) => {
      const matchesSearch = subject.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesClass =
        !classFilter || subject.classId === classFilter;

      return matchesSearch && matchesClass;
    });
  }, [searchTerm, classFilter, availableSubjects]);

  // Pagination
  const totalPages = Math.ceil(filteredSubjects.length / ITEMS_PER_PAGE);
  const paginatedSubjects = filteredSubjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Subject type colors
  const getSubjectTypeStyle = (type?: string) => {
    const styles: Record<string, { bg: string; text: string; label: string }> = {
      core: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Core' },
      elective: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Elective' },
      practical: { bg: 'bg-green-100', text: 'text-green-700', label: 'Practical' },
    };
    return styles[type || 'core'] || styles.core;
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Subject Management"
        description="Manage subjects and syllabus"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Subjects' },
        ]}
        actions={
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Subject
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BookText className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-blue-600">Total Subjects</p>
                <p className="text-2xl font-bold text-blue-800">
                  {DEMO_SUBJECTS.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BookMarked className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-green-600">Core Subjects</p>
                <p className="text-2xl font-bold text-green-800">
                  {DEMO_SUBJECTS.filter((s) => s.type === 'core' || !s.type).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-purple-600">Elective Subjects</p>
                <p className="text-2xl font-bold text-purple-800">
                  {DEMO_SUBJECTS.filter((s) => s.type === 'elective').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-orange-600">Weekly Classes</p>
                <p className="text-2xl font-bold text-orange-800">
                  {DEMO_SUBJECTS.reduce((sum, s) => sum + (s.periodsPerWeek || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Subject List</CardTitle>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search subjects..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-48"
                />
              </div>

              {/* Class Filter */}
              <Select
                options={[{ value: '', label: 'All Classes' }, ...CLASS_OPTIONS]}
                value={classFilter}
                onChange={(e) => {
                  setClassFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-40"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {paginatedSubjects.length === 0 ? (
            <EmptyState
              icon={<BookText className="w-12 h-12" />}
              title="No subjects found"
              description="Change search criteria or create a new subject."
              action={
                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Subject
                </Button>
              }
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-center">Classes/Week</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSubjects.map((subject) => {
                    const classInfo = getClassById(subject.classId);
                    const teacher = subject.teacherId
                      ? getTeacherById(subject.teacherId)
                      : null;
                    const typeStyle = getSubjectTypeStyle(subject.type);

                    return (
                      <TableRow key={subject.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                              <BookText className="w-5 h-5 text-primary-600" />
                            </div>
                            <span className="font-medium">{subject.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {subject.code}
                          </span>
                        </TableCell>
                        <TableCell>
                          {classInfo
                            ? `${classInfo.name} (${classInfo.section})`
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {teacher ? (
                            <span>
                              {teacher.firstName} {teacher.lastName}
                            </span>
                          ) : (
                            <span className="text-gray-400">Not assigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              'px-2 py-1 rounded-full text-xs font-medium',
                              typeStyle.bg,
                              typeStyle.text
                            )}
                          >
                            {typeStyle.label}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-medium">
                            {subject.periodsPerWeek || '-'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={subject.isActive ? 'success' : 'danger'}>
                            {subject.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setViewSubject(subject)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={filteredSubjects.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Subject Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Subject"
        size="md"
      >
        <SubjectForm onClose={() => setIsAddModalOpen(false)} />
      </Modal>

      {/* View Subject Modal */}
      <Modal
        isOpen={!!viewSubject}
        onClose={() => setViewSubject(null)}
        title="Subject Details"
        size="md"
      >
        {viewSubject && (
          <SubjectDetails
            subject={viewSubject}
            onClose={() => setViewSubject(null)}
          />
        )}
      </Modal>
    </DashboardLayout>
  );
}

// ============================================
// SUBJECT FORM
// ============================================

interface SubjectFormProps {
  onClose: () => void;
}

function SubjectForm({ onClose }: SubjectFormProps) {
  const typeOptions = [
    { value: 'core', label: 'Core' },
    { value: 'elective', label: 'Elective' },
    { value: 'practical', label: 'Practical' },
  ];

  const teacherOptions = DEMO_TEACHERS.map((t) => ({
    value: t.id,
    label: `${t.firstName} ${t.lastName}`,
  }));

  return (
    <form className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Subject Name"
          placeholder="Bengali, English..."
          required
        />
        <Input
          label="Subject Code"
          placeholder="BNG-101"
          required
        />
      </div>

      <Select
        label="Class"
        options={CLASS_OPTIONS}
        placeholder="Select class"
        required
      />

      <Select
        label="Subject Teacher"
        options={[{ value: '', label: 'Select (optional)' }, ...teacherOptions]}
        placeholder="Select teacher"
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Subject Type"
          options={typeOptions}
          defaultValue="core"
        />
        <Input
          label="Weekly Classes"
          type="number"
          placeholder="5"
          defaultValue="5"
        />
      </div>

      <Input
        label="Description (optional)"
        placeholder="Subject description"
      />

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Add Subject</Button>
      </div>
    </form>
  );
}

// ============================================
// SUBJECT DETAILS
// ============================================

interface SubjectDetailsProps {
  subject: Subject;
  onClose: () => void;
}

function SubjectDetails({ subject, onClose }: SubjectDetailsProps) {
  const classInfo = getClassById(subject.classId);
  const teacher = subject.teacherId ? getTeacherById(subject.teacherId) : null;

  const getSubjectTypeStyle = (type?: string) => {
    const styles: Record<string, { bg: string; text: string; label: string }> = {
      core: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Core' },
      elective: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Elective' },
      practical: { bg: 'bg-green-100', text: 'text-green-700', label: 'Practical' },
    };
    return styles[type || 'core'] || styles.core;
  };

  const typeStyle = getSubjectTypeStyle(subject.type);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-primary-100 flex items-center justify-center">
          <BookText className="w-8 h-8 text-primary-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">{subject.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
              {subject.code}
            </span>
            <span
              className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                typeStyle.bg,
                typeStyle.text
              )}
            >
              {typeStyle.label}
            </span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Class</p>
          <p className="font-medium">
            {classInfo ? `${classInfo.name} (${classInfo.section})` : '-'}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Weekly Classes</p>
          <p className="font-medium">{subject.periodsPerWeek || '-'}</p>
        </div>
      </div>

      {/* Teacher */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-500 mb-2">Subject Teacher</p>
        {teacher ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
              {teacher.firstName.charAt(0)}
            </div>
            <div>
              <p className="font-medium">
                {teacher.firstName} {teacher.lastName}
              </p>
              <p className="text-sm text-gray-500">{teacher.email}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">Teacher not assigned</p>
        )}
      </div>

      {/* Description */}
      {subject.description && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-2">Description</p>
          <p className="text-gray-700">{subject.description}</p>
        </div>
      )}

      {/* Status */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <span className="text-gray-600">Status</span>
        <Badge variant={subject.isActive ? 'success' : 'danger'}>
          {subject.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button>
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>
    </div>
  );
}
