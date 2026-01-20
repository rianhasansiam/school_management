'use client';

import * as React from 'react';
import { DashboardLayout, PageHeader } from '@/components/layout';
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Avatar,
  Badge,
  Button,
  Input,
  Select,
  Pagination,
  EmptyState,
  Modal,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuDivider,
} from '@/components/ui';
import { DEMO_STUDENTS, DEMO_CLASSES, DEMO_TEACHERS, DEMO_SUBJECTS } from '@/lib/demo-data';
import { formatDate, cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';
import { UserRole, Student } from '@/lib/types';
import { useDebounce } from '@/hooks/useCommon';
import {
  Plus,
  Search,
  Filter,
  Download,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Users,
  UserPlus,
} from 'lucide-react';

export default function StudentsPage() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === UserRole.ADMIN;
  const isTeacher = user?.role === UserRole.TEACHER;

  // Get teacher's classes if logged in as teacher
  const myTeacherProfile = isTeacher ? DEMO_TEACHERS.find(t => t.userId === user?.id) : null;
  const myClasses = myTeacherProfile ? DEMO_CLASSES.filter(c => c.classTeacherId === myTeacherProfile.id) : [];
  const mySubjects = myTeacherProfile ? DEMO_SUBJECTS.filter(s => s.teacherId === myTeacherProfile.id) : [];
  const myClassIds = new Set([
    ...myClasses.map(c => c.id),
    ...mySubjects.map(s => s.classId),
  ]);

  // Get available students (all for admin, only from teacher's classes for teacher)
  const availableStudents = isAdmin ? DEMO_STUDENTS : DEMO_STUDENTS.filter(s => myClassIds.has(s.classId));
  
  // Get available classes for filter (all for admin, only teacher's classes for teacher)
  const availableClasses = isAdmin ? DEMO_CLASSES : DEMO_CLASSES.filter(c => myClassIds.has(c.id));

  const [searchQuery, setSearchQuery] = React.useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [selectedClass, setSelectedClass] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null);

  const itemsPerPage = 10;

  // Filter students
  const filteredStudents = React.useMemo(() => {
    return availableStudents.filter((student) => {
      const matchesSearch =
        `${student.firstName} ${student.lastName}`
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        student.studentId.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesClass = !selectedClass || student.classId === selectedClass;
      return matchesSearch && matchesClass;
    });
  }, [debouncedSearch, selectedClass, availableStudents]);

  // Paginate
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const classOptions = availableClasses.map((cls) => ({
    label: cls.name,
    value: cls.id,
  }));

  return (
    <DashboardLayout>
      <PageHeader
        title="Students"
        description="All students"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Students' },
        ]}
        actions={
          isAdmin && (
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          )
        }
      />

      <Card>
        <CardContent className="p-3 md:p-6">
          {/* Filters */}
          <div className="flex flex-col gap-3 md:flex-row md:gap-4 mb-4 md:mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                options={[{ label: 'All Classes', value: '' }, ...classOptions]}
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                placeholder="Select Class"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 md:flex-none">
                <Filter className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Filter</span>
              </Button>
              <Button variant="outline" className="flex-1 md:flex-none">
                <Download className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Export</span>
              </Button>
            </div>
          </div>

          {/* Table */}
          {paginatedStudents.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead className="hidden sm:table-cell">ID</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead className="hidden md:table-cell">Roll</TableHead>
                    <TableHead className="hidden lg:table-cell">Guardian</TableHead>
                    <TableHead className="hidden lg:table-cell">Phone</TableHead>
                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                    <TableHead className="w-10 md:w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStudents.map((student) => {
                    const classInfo = DEMO_CLASSES.find((c) => c.id === student.classId);
                    return (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center gap-2 md:gap-3">
                            <Avatar
                              alt={`${student.firstName} ${student.lastName}`}
                              size="sm"
                            />
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 truncate text-xs md:text-sm">
                                {student.firstName} {student.lastName}
                              </p>
                              <p className="text-[10px] md:text-xs text-gray-500 truncate">
                                Adm: {formatDate(student.admissionDate)}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs md:text-sm hidden sm:table-cell">
                          {student.studentId}
                        </TableCell>
                        <TableCell className="text-xs md:text-sm">{classInfo?.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{student.rollNumber}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div>
                            <p className="text-sm">{student.guardianName}</p>
                            <p className="text-xs text-gray-500">
                              ({student.guardianRelation})
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm hidden lg:table-cell">{student.guardianPhone}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant={student.isActive ? 'success' : 'danger'}>
                            {student.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu
                            trigger={
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            }
                          >
                            <DropdownMenuItem
                              icon={<Eye className="w-4 h-4" />}
                              onClick={() => setSelectedStudent(student)}
                            >
                              View Details
                            </DropdownMenuItem>
                            {isAdmin && (
                              <>
                                <DropdownMenuItem icon={<Edit className="w-4 h-4" />}>
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuDivider />
                                <DropdownMenuItem
                                  icon={<Trash2 className="w-4 h-4" />}
                                  danger
                                >
                                  Delete
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          ) : (
            <EmptyState
              icon={<Users className="w-12 h-12" />}
              title="No students found"
              description="No students match your search criteria"
              action={
                isAdmin && (
                  <Button onClick={() => setIsAddModalOpen(true)}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add New Student
                  </Button>
                )
              }
            />
          )}
        </CardContent>
      </Card>

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Student"
        description="Provide student information"
        size="lg"
      >
        <StudentForm onClose={() => setIsAddModalOpen(false)} />
      </Modal>

      {/* View Student Modal */}
      <Modal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title="Student Details"
        size="lg"
      >
        {selectedStudent && <StudentDetails student={selectedStudent} />}
      </Modal>
    </DashboardLayout>
  );
}

// ============================================
// STUDENT FORM COMPONENT
// ============================================

function StudentForm({ onClose }: { onClose: () => void }) {
  const classOptions = DEMO_CLASSES.map((cls) => ({
    label: cls.name,
    value: cls.id,
  }));

  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="First Name" placeholder="First name" required />
        <Input label="Last Name" placeholder="Last name" required />
        <Input label="Date of Birth" type="date" required />
        <Select
          label="Gender"
          options={[
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
          ]}
          placeholder="Select"
          required
        />
        <Select
          label="Class"
          options={classOptions}
          placeholder="Select class"
          required
        />
        <Input label="Roll Number" type="number" placeholder="Roll" required />
      </div>

      <div className="border-t pt-6">
        <h4 className="font-medium text-gray-900 mb-4">Guardian Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Guardian Name" placeholder="Guardian name" required />
          <Input label="Relationship" placeholder="e.g. Father, Mother" required />
          <Input label="Phone Number" placeholder="01XXXXXXXXX" required />
          <Input label="Address" placeholder="Address" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Add Student</Button>
      </div>
    </form>
  );
}

// ============================================
// STUDENT DETAILS COMPONENT
// ============================================

function StudentDetails({ student }: { student: Student }) {
  const classInfo = DEMO_CLASSES.find((c) => c.id === student.classId);

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <Avatar
          alt={`${student.firstName} ${student.lastName}`}
          size="xl"
        />
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {student.firstName} {student.lastName}
          </h3>
          <p className="text-gray-500">{student.studentId}</p>
          <Badge variant={student.isActive ? 'success' : 'danger'} className="mt-2">
            {student.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        <DetailItem label="Class" value={classInfo?.name || '-'} />
        <DetailItem label="Roll Number" value={student.rollNumber.toString()} />
        <DetailItem label="Date of Birth" value={formatDate(student.dateOfBirth)} />
        <DetailItem label="Admission Date" value={formatDate(student.admissionDate)} />
        <DetailItem label="Gender" value={student.gender === 'male' ? 'Male' : 'Female'} />
        <DetailItem label="Address" value={student.address} />
      </div>

      {/* Guardian Info */}
      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-900 mb-3">Guardian Information</h4>
        <div className="grid grid-cols-2 gap-4">
          <DetailItem label="Name" value={student.guardianName} />
          <DetailItem label="Relationship" value={student.guardianRelation} />
          <DetailItem label="Phone" value={student.guardianPhone} />
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  );
}
