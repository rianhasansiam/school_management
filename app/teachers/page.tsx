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
  Pagination,
  EmptyState,
  Modal,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuDivider,
} from '@/components/ui';
import { DEMO_TEACHERS } from '@/lib/demo-data';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Teacher } from '@/lib/types';
import {
  Plus,
  Search,
  Download,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  GraduationCap,
  Mail,
  Phone,
} from 'lucide-react';

export default function TeachersPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [selectedTeacher, setSelectedTeacher] = React.useState<Teacher | null>(null);

  const itemsPerPage = 10;

  // Filter teachers
  const filteredTeachers = React.useMemo(() => {
    return DEMO_TEACHERS.filter((teacher) => {
      return (
        `${teacher.firstName} ${teacher.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery]);

  // Paginate
  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  return (
    <DashboardLayout>
      <PageHeader
        title="Teacher Management"
        description="View and manage all teachers information"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Teachers' },
        ]}
        actions={
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Teacher
          </Button>
        }
      />

      <Card>
        <CardContent className="p-3 md:p-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by name, email or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Export</span>
            </Button>
          </div>

          {/* Table */}
          {paginatedTeachers.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Teacher</TableHead>
                    <TableHead className="hidden sm:table-cell">ID</TableHead>
                    <TableHead className="hidden md:table-cell">Subject</TableHead>
                    <TableHead className="hidden lg:table-cell">Contact</TableHead>
                    <TableHead className="hidden lg:table-cell">Joining Date</TableHead>
                    <TableHead className="hidden md:table-cell">Salary</TableHead>
                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                    <TableHead className="w-10 md:w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTeachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell>
                        <div className="flex items-center gap-2 md:gap-3">
                          <Avatar
                            src={teacher.avatar}
                            alt={`${teacher.firstName} ${teacher.lastName}`}
                            size="sm"
                          />
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate text-xs md:text-sm">
                              {teacher.firstName} {teacher.lastName}
                            </p>
                            <p className="text-[10px] md:text-xs text-gray-500 truncate">
                              {teacher.qualification}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs md:text-sm hidden sm:table-cell">
                        {teacher.employeeId}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="info">{teacher.specialization}</Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="space-y-1">
                          <p className="text-sm flex items-center gap-1">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="truncate max-w-[150px]">{teacher.email}</span>
                          </p>
                          <p className="text-sm flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gray-400" />
                            {teacher.phone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm hidden lg:table-cell">
                        {formatDate(teacher.joiningDate)}
                      </TableCell>
                      <TableCell className="font-medium hidden md:table-cell">
                        {formatCurrency(teacher.salary)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant={teacher.isActive ? 'success' : 'danger'}>
                          {teacher.isActive ? 'Active' : 'Inactive'}
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
                            onClick={() => setSelectedTeacher(teacher)}
                          >
                            View Details
                          </DropdownMenuItem>
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
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
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
              icon={<GraduationCap className="w-12 h-12" />}
              title="No teachers found"
              description="No teachers match your search criteria"
              action={
                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Teacher
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>

      {/* Add Teacher Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Teacher"
        description="Provide teacher information"
        size="lg"
      >
        <TeacherForm onClose={() => setIsAddModalOpen(false)} />
      </Modal>

      {/* View Teacher Modal */}
      <Modal
        isOpen={!!selectedTeacher}
        onClose={() => setSelectedTeacher(null)}
        title="Teacher Details"
        size="lg"
      >
        {selectedTeacher && <TeacherDetails teacher={selectedTeacher} />}
      </Modal>
    </DashboardLayout>
  );
}

// ============================================
// TEACHER FORM COMPONENT
// ============================================

function TeacherForm({ onClose }: { onClose: () => void }) {
  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="First Name" placeholder="First name" required />
        <Input label="Last Name" placeholder="Last name" required />
        <Input label="Email" type="email" placeholder="email@example.com" required />
        <Input label="Phone" placeholder="01XXXXXXXXX" required />
        <Input label="Date of Birth" type="date" required />
        <Input label="Joining Date" type="date" required />
        <Input label="Qualification" placeholder="e.g. M.A., B.Ed." required />
        <Input label="Specialization" placeholder="e.g. Bengali, Math" required />
        <Input label="Salary" type="number" placeholder="Monthly salary" required />
        <Input label="Address" placeholder="Address" />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Add Teacher</Button>
      </div>
    </form>
  );
}

// ============================================
// TEACHER DETAILS COMPONENT
// ============================================

function TeacherDetails({ teacher }: { teacher: Teacher }) {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <Avatar
          src={teacher.avatar}
          alt={`${teacher.firstName} ${teacher.lastName}`}
          size="xl"
        />
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {teacher.firstName} {teacher.lastName}
          </h3>
          <p className="text-gray-500">{teacher.employeeId}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="info">{teacher.specialization}</Badge>
            <Badge variant={teacher.isActive ? 'success' : 'danger'}>
              {teacher.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        <DetailItem label="Email" value={teacher.email} />
        <DetailItem label="Phone" value={teacher.phone} />
        <DetailItem label="Date of Birth" value={formatDate(teacher.dateOfBirth)} />
        <DetailItem label="Joining Date" value={formatDate(teacher.joiningDate)} />
        <DetailItem label="Qualification" value={teacher.qualification} />
        <DetailItem label="Specialization" value={teacher.specialization} />
        <DetailItem label="Salary" value={formatCurrency(teacher.salary)} />
        <DetailItem label="Gender" value={teacher.gender === 'male' ? 'Male' : 'Female'} />
      </div>

      {/* Address */}
      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-900 mb-3">Address</h4>
        <p className="text-gray-600">{teacher.address}</p>
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
