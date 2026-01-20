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
  Textarea,
  Modal,
  Pagination,
  EmptyState,
} from '@/components/ui';
import {
  DEMO_ASSIGNMENTS,
  DEMO_CLASSES,
  DEMO_SUBJECTS,
  DEMO_TEACHERS,
  getClassById,
  getSubjectById,
  getTeacherById,
} from '@/lib/demo-data';
import { formatDate, cn } from '@/lib/utils';
import { CLASS_OPTIONS, SUBJECT_OPTIONS, ASSIGNMENT_STATUS_OPTIONS } from '@/lib/constants';
import { Assignment, AssignmentStatus, Teacher, Class, Subject } from '@/lib/types';
import { useAuthStore, useIsAdmin } from '@/lib/store';
import { UserRole } from '@/lib/types';
import { useDebounce } from '@/hooks/useCommon';
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  FileText,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function AssignmentsPage() {
  const { user } = useAuthStore();
  const isAdmin = useIsAdmin();
  const isTeacher = user?.role === UserRole.TEACHER;

  // Get teacher's data if logged in as teacher
  const myTeacherProfile = isTeacher ? DEMO_TEACHERS.find((t: Teacher) => t.userId === user?.id) : null;
  const myClasses = myTeacherProfile ? DEMO_CLASSES.filter((c: Class) => c.classTeacherId === myTeacherProfile.id) : [];
  const mySubjects = myTeacherProfile ? DEMO_SUBJECTS.filter((s: Subject) => s.teacherId === myTeacherProfile.id) : [];
  const myClassIds = new Set([
    ...myClasses.map((c: Class) => c.id),
    ...mySubjects.map((s: Subject) => s.classId),
  ]);

  // Get available assignments (all for admin, only teacher's for teacher)
  const availableAssignments = isAdmin 
    ? DEMO_ASSIGNMENTS 
    : DEMO_ASSIGNMENTS.filter((a: Assignment) => a.teacherId === myTeacherProfile?.id);

  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [classFilter, setClassFilter] = React.useState('');
  const [subjectFilter, setSubjectFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [viewAssignment, setViewAssignment] = React.useState<Assignment | null>(null);

  // Filter assignments
  const filteredAssignments = React.useMemo(() => {
    return availableAssignments.filter((assignment: Assignment) => {
      const matchesSearch =
        assignment.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        assignment.description?.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesClass = !classFilter || assignment.classId === classFilter;
      const matchesSubject = !subjectFilter || assignment.subjectId === subjectFilter;
      const matchesStatus = !statusFilter || assignment.status === statusFilter;

      return matchesSearch && matchesClass && matchesSubject && matchesStatus;
    });
  }, [debouncedSearch, classFilter, subjectFilter, statusFilter, availableAssignments]);

  // Pagination
  const totalPages = Math.ceil(filteredAssignments.length / ITEMS_PER_PAGE);
  const paginatedAssignments = filteredAssignments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusBadge = (status: AssignmentStatus) => {
    const variants: Record<AssignmentStatus, 'info' | 'warning' | 'success'> = {
      [AssignmentStatus.DRAFT]: 'info',
      [AssignmentStatus.PUBLISHED]: 'warning',
      [AssignmentStatus.CLOSED]: 'success',
    };
    const labels: Record<AssignmentStatus, string> = {
      [AssignmentStatus.DRAFT]: 'Draft',
      [AssignmentStatus.PUBLISHED]: 'Published',
      [AssignmentStatus.CLOSED]: 'Closed',
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const isOverdue = (dueDate: Date) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Assignments"
        description="Create and manage assignments"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Assignments' },
        ]}
        actions={
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Assignment
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-blue-600">Total Assignments</p>
                <p className="text-2xl font-bold text-blue-800">
                  {DEMO_ASSIGNMENTS.length}
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
                <p className="text-sm text-orange-600">Published</p>
                <p className="text-2xl font-bold text-orange-800">
                  {DEMO_ASSIGNMENTS.filter((a: Assignment) => a.status === AssignmentStatus.PUBLISHED).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Edit className="w-8 h-8 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Draft</p>
                <p className="text-2xl font-bold text-gray-800">
                  {DEMO_ASSIGNMENTS.filter((a: Assignment) => a.status === AssignmentStatus.DRAFT).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-green-600">Completed</p>
                <p className="text-2xl font-bold text-green-800">
                  {DEMO_ASSIGNMENTS.filter((a: Assignment) => a.status === AssignmentStatus.CLOSED).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Assignment List</CardTitle>
            <div className="flex  items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
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
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setClassFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-40"
              />

              {/* Subject Filter */}
              <Select
                options={[{ value: '', label: 'All Subjects' }, ...SUBJECT_OPTIONS]}
                value={subjectFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setSubjectFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-40"
              />

              {/* Status Filter */}
              <Select
                options={[{ value: '', label: 'All Status' }, ...ASSIGNMENT_STATUS_OPTIONS]}
                value={statusFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-36"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {paginatedAssignments.length === 0 ? (
            <EmptyState
              icon={<FileText className="w-12 h-12" />}
              title="No assignments found"
              description="Change search criteria or create a new assignment."
              action={
                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Assignment
                </Button>
              }
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAssignments.map((assignment: Assignment) => {
                    const classInfo = getClassById(assignment.classId);
                    const subject = getSubjectById(assignment.subjectId);
                    const teacher = getTeacherById(assignment.teacherId);
                    const overdue = isOverdue(assignment.dueDate);

                    return (
                      <TableRow key={assignment.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'w-10 h-10 rounded-lg flex items-center justify-center',
                                overdue && assignment.status === AssignmentStatus.PUBLISHED
                                  ? 'bg-red-100'
                                  : 'bg-primary-100'
                              )}
                            >
                              <FileText
                                className={cn(
                                  'w-5 h-5',
                                  overdue && assignment.status === AssignmentStatus.PUBLISHED
                                    ? 'text-red-600'
                                    : 'text-primary-600'
                                )}
                              />
                            </div>
                            <div>
                              <p className="font-medium">{assignment.title}</p>
                              <p className="text-xs text-gray-500 line-clamp-1">
                                {assignment.description}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {classInfo
                            ? `${classInfo.name} (${classInfo.section})`
                            : '-'}
                        </TableCell>
                        <TableCell>{subject?.name || '-'}</TableCell>
                        <TableCell>
                          {teacher
                            ? `${teacher.firstName} ${teacher.lastName}`
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span
                              className={cn(
                                overdue && assignment.status === AssignmentStatus.PUBLISHED
                                  ? 'text-red-600 font-medium'
                                  : ''
                              )}
                            >
                              {formatDate(assignment.dueDate)}
                            </span>
                            {overdue && assignment.status === AssignmentStatus.PUBLISHED && (
                              <AlertCircle className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setViewAssignment(assignment)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            {isAdmin && (
                              <Button variant="ghost" size="sm" className="text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
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
                  totalItems={filteredAssignments.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Assignment Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="New Assignment"
        size="lg"
      >
        <AssignmentForm onClose={() => setIsAddModalOpen(false)} />
      </Modal>

      {/* View Assignment Modal */}
      <Modal
        isOpen={!!viewAssignment}
        onClose={() => setViewAssignment(null)}
        title="Assignment Details"
        size="lg"
      >
        {viewAssignment && (
          <AssignmentDetails
            assignment={viewAssignment}
            onClose={() => setViewAssignment(null)}
          />
        )}
      </Modal>
    </DashboardLayout>
  );
}

// ============================================
// ASSIGNMENT FORM
// ============================================

interface AssignmentFormProps {
  onClose: () => void;
}

function AssignmentForm({ onClose }: AssignmentFormProps) {
  const teacherOptions = [
    { value: '', label: 'Select Teacher (Optional)' },
    ...DEMO_TEACHERS.map((t: Teacher) => ({
      value: t.id,
      label: `${t.firstName} ${t.lastName}`,
    })),
  ];

  return (
    <form className="space-y-4">
      <Input
        label="Title"
        placeholder="Assignment title"
        required
      />

      <Textarea
        label="Description"
        placeholder="Assignment detailed description"
        rows={4}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Class"
          options={CLASS_OPTIONS}
          placeholder="Select class"
          required
        />
        <Select
          label="Subject"
          options={SUBJECT_OPTIONS}
          placeholder="Select subject"
          required
        />
      </div>

      <Select
        label="Assign to Teacher"
        options={teacherOptions}
        placeholder="Select teacher"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Due Date"
          type="date"
          required
        />
        <Input
          label="Total Marks"
          type="number"
          placeholder="100"
        />
      </div>

      <Select
        label="Status"
        options={ASSIGNMENT_STATUS_OPTIONS}
        defaultValue="draft"
      />

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" variant="secondary">
          Save as Draft
        </Button>
        <Button type="submit">
          Publish
        </Button>
      </div>
    </form>
  );
}

// ============================================
// ASSIGNMENT DETAILS
// ============================================

interface AssignmentDetailsProps {
  assignment: Assignment;
  onClose: () => void;
}

function AssignmentDetails({ assignment, onClose }: AssignmentDetailsProps) {
  const classInfo = getClassById(assignment.classId);
  const subject = getSubjectById(assignment.subjectId);
  const teacher = getTeacherById(assignment.teacherId);

  const getStatusBadge = (status: AssignmentStatus) => {
    const variants: Record<AssignmentStatus, 'info' | 'warning' | 'success'> = {
      [AssignmentStatus.DRAFT]: 'info',
      [AssignmentStatus.PUBLISHED]: 'warning',
      [AssignmentStatus.CLOSED]: 'success',
    };
    const labels: Record<AssignmentStatus, string> = {
      [AssignmentStatus.DRAFT]: 'Draft',
      [AssignmentStatus.PUBLISHED]: 'Published',
      [AssignmentStatus.CLOSED]: 'Closed',
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold">{assignment.title}</h3>
          <div className="flex items-center gap-2 mt-2">
            {getStatusBadge(assignment.status)}
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h4 className="font-medium text-gray-700 mb-2">Description</h4>
        <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
          {assignment.description || 'No description'}
        </p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Class</p>
          <p className="font-medium flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary-600" />
            {classInfo ? `${classInfo.name} (${classInfo.section})` : '-'}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Subject</p>
          <p className="font-medium">{subject?.name || '-'}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Teacher</p>
          <p className="font-medium">
            {teacher ? `${teacher.firstName} ${teacher.lastName}` : '-'}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Total Marks</p>
          <p className="font-medium">{assignment.maxMarks || '-'}</p>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-lg">
          <Calendar className="w-5 h-5 text-primary-600" />
          <div>
            <p className="text-sm text-primary-600">Created Date</p>
            <p className="font-medium">{formatDate(assignment.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
          <Clock className="w-5 h-5 text-orange-600" />
          <div>
            <p className="text-sm text-orange-600">Due Date</p>
            <p className="font-medium">{formatDate(assignment.dueDate)}</p>
          </div>
        </div>
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
