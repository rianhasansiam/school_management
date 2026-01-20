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
  DEMO_CLASSES,
  DEMO_STUDENTS,
  DEMO_TEACHERS,
  getTeacherById,
} from '@/lib/demo-data';
import { formatDate, cn } from '@/lib/utils';
import { SECTION_OPTIONS } from '@/lib/constants';
import { Class } from '@/lib/types';
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Users,
  BookOpen,
  GraduationCap,
  UserCheck,
} from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function ClassesPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [viewClass, setViewClass] = React.useState<Class | null>(null);

  // Filter classes
  const filteredClasses = React.useMemo(() => {
    return DEMO_CLASSES.filter((cls) => {
      return (
        cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.section.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredClasses.length / ITEMS_PER_PAGE);
  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Get student count for each class
  const getStudentCount = (classId: string) => {
    return DEMO_STUDENTS.filter((s) => s.classId === classId).length;
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Classes & Sections"
        description="Manage classes and sections"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Classes' },
        ]}
        actions={
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Class
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-gray-800" />
              <div>
                <p className="text-xs md:text-sm text-gray-600">Total Classes</p>
                <p className="text-lg md:text-2xl font-bold text-gray-800">
                  {DEMO_CLASSES.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <Users className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
              <div>
                <p className="text-xs md:text-sm text-green-600">Total Students</p>
                <p className="text-lg md:text-2xl font-bold text-green-800">
                  {DEMO_STUDENTS.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
              <div>
                <p className="text-xs md:text-sm text-purple-600">Total Teachers</p>
                <p className="text-lg md:text-2xl font-bold text-purple-800">
                  {DEMO_TEACHERS.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <UserCheck className="w-6 h-6 md:w-8 md:h-8 text-orange-600" />
              <div>
                <p className="text-xs md:text-sm text-orange-600">Avg/Class</p>
                <p className="text-lg md:text-2xl font-bold text-orange-800">
                  {Math.round(DEMO_STUDENTS.length / DEMO_CLASSES.length)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
            <CardTitle>Class List</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search class..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {paginatedClasses.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="w-12 h-12" />}
              title="No classes found"
              description="Change search criteria or create a new class."
              action={
                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Class
                </Button>
              }
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class</TableHead>
                    <TableHead className="hidden sm:table-cell">Section</TableHead>
                    <TableHead className="hidden md:table-cell">Class Teacher</TableHead>
                    <TableHead className="text-center">Students</TableHead>
                    <TableHead className="text-center hidden lg:table-cell">Capacity</TableHead>
                    <TableHead className="hidden lg:table-cell">Year</TableHead>
                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedClasses.map((cls) => {
                    const classTeacher = cls.classTeacherId
                      ? getTeacherById(cls.classTeacherId)
                      : null;
                    const studentCount = getStudentCount(cls.id);
                    const isFull = studentCount >= cls.capacity;

                    return (
                      <TableRow key={cls.id}>
                        <TableCell>
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                              <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-primary-600" />
                            </div>
                            <span className="font-medium text-xs md:text-sm">{cls.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="default">{cls.section}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {classTeacher ? (
                            <span className="text-xs md:text-sm truncate">
                              {classTeacher.firstName} {classTeacher.lastName}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs md:text-sm">Not Assigned</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={cn(
                              'font-medium text-xs md:text-sm',
                              isFull ? 'text-red-600' : 'text-green-600'
                            )}
                          >
                            {studentCount}
                          </span>
                        </TableCell>
                        <TableCell className="text-center hidden lg:table-cell">{cls.capacity}</TableCell>
                        <TableCell className="hidden lg:table-cell text-xs md:text-sm">{cls.academicYear}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant={cls.isActive ? 'success' : 'danger'}>
                            {cls.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1 md:gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setViewClass(cls)}
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
                  totalItems={filteredClasses.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Class Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Class"
        size="md"
      >
        <ClassForm onClose={() => setIsAddModalOpen(false)} />
      </Modal>

      {/* View Class Modal */}
      <Modal
        isOpen={!!viewClass}
        onClose={() => setViewClass(null)}
        title="Class Details"
        size="lg"
      >
        {viewClass && (
          <ClassDetails
            classData={viewClass}
            onClose={() => setViewClass(null)}
          />
        )}
      </Modal>
    </DashboardLayout>
  );
}

// ============================================
// CLASS FORM
// ============================================

interface ClassFormProps {
  onClose: () => void;
}

function ClassForm({ onClose }: ClassFormProps) {
  const classOptions = [
    { value: 'class-1', label: 'Class 1' },
    { value: 'class-2', label: 'Class 2' },
    { value: 'class-3', label: 'Class 3' },
    { value: 'class-4', label: 'Class 4' },
    { value: 'class-5', label: 'Class 5' },
    { value: 'class-6', label: 'Class 6' },
    { value: 'class-7', label: 'Class 7' },
    { value: 'class-8', label: 'Class 8' },
    { value: 'class-9', label: 'Class 9' },
    { value: 'class-10', label: 'Class 10' },
  ];

  const teacherOptions = DEMO_TEACHERS.map((t) => ({
    value: t.id,
    label: `${t.firstName} ${t.lastName}`,
  }));

  return (
    <form className="space-y-4">
      <Select
        label="Class"
        options={classOptions}
        placeholder="Select class"
        required
      />

      <Select
        label="Section"
        options={SECTION_OPTIONS}
        placeholder="Select section"
        required
      />

      <Select
        label="Class Teacher"
        options={[{ value: '', label: 'Select (Optional)' }, ...teacherOptions]}
        placeholder="Select class teacher"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Max Capacity"
          type="number"
          placeholder="40"
          defaultValue="40"
          required
        />
        <Input
          label="Academic Year"
          placeholder="2026"
          defaultValue="2026"
          required
        />
      </div>

      <Input
        label="Classroom Number"
        placeholder="Room number (Optional)"
      />

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Add Class</Button>
      </div>
    </form>
  );
}

// ============================================
// CLASS DETAILS
// ============================================

interface ClassDetailsProps {
  classData: Class;
  onClose: () => void;
}

function ClassDetails({ classData, onClose }: ClassDetailsProps) {
  const classTeacher = classData.classTeacherId
    ? getTeacherById(classData.classTeacherId)
    : null;
  const students = DEMO_STUDENTS.filter((s) => s.classId === classData.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-primary-100 flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-primary-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">
            {classData.name} ({classData.section})
          </h3>
          <p className="text-gray-600">Academic Year: {classData.academicYear}</p>
          <Badge variant={classData.isActive ? 'success' : 'danger'} className="mt-1">
            {classData.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <Users className="w-6 h-6 text-gray-800 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">{students.length}</p>
          <p className="text-sm text-gray-600">Students</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <BookOpen className="w-6 h-6 text-gray-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">{classData.capacity}</p>
          <p className="text-sm text-gray-600">Capacity</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <UserCheck className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-green-800">
            {classData.capacity - students.length}
          </p>
          <p className="text-sm text-green-600">Empty Seats</p>
        </div>
      </div>

      {/* Class Teacher */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-500 mb-2">Class Teacher</p>
        {classTeacher ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
              {classTeacher.firstName.charAt(0)}
            </div>
            <div>
              <p className="font-medium">
                {classTeacher.firstName} {classTeacher.lastName}
              </p>
              <p className="text-sm text-gray-500">{classTeacher.email}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">Class teacher not assigned</p>
        )}
      </div>

      {/* Recent Students */}
      <div>
        <h4 className="font-medium mb-3">Students ({students.length})</h4>
        <div className="max-h-48 overflow-y-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Roll Number</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.slice(0, 10).map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-mono text-sm">
                    {student.studentId}
                  </TableCell>
                  <TableCell>
                    {student.firstName} {student.lastName}
                  </TableCell>
                  <TableCell>{student.rollNumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {students.length > 10 && (
          <p className="text-sm text-gray-500 text-center mt-2">
            And {students.length - 10} more students
          </p>
        )}
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
