'use client';

import * as React from 'react';
import { DashboardLayout, PageHeader } from '@/components/layout';
import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Button,
  Select,
  Modal,
  Pagination,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  EmptyState,
} from '@/components/ui';
import {
  DEMO_TEACHERS,
  DEMO_CLASSES,
  DEMO_SUBJECTS,
  DEMO_ASSIGNMENTS,
  getTeacherById,
  getClassById,
  getSubjectById,
} from '@/lib/demo-data';
import { cn } from '@/lib/utils';
import { useIsAdmin } from '@/lib/store';
import { useRouter } from 'next/navigation';
import {
  Users,
  BookOpen,
  BookText,
  FileText,
  Search,
  UserPlus,
  Check,
  Edit,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';

const ITEMS_PER_PAGE = 8;

export default function TeacherAssignmentsPage() {
  const isAdmin = useIsAdmin();
  const router = useRouter();

  // Redirect non-admins
  React.useEffect(() => {
    if (!isAdmin) {
      router.push('/dashboard');
    }
  }, [isAdmin, router]);

  const [activeTab, setActiveTab] = React.useState('overview');

  if (!isAdmin) {
    return null;
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Teacher Assignments"
        description="Manage teacher assignments to classes, subjects, and tasks"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Teacher Assignments' },
        ]}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-blue-600">Total Teachers</p>
                <p className="text-2xl font-bold text-blue-800">
                  {DEMO_TEACHERS.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-green-600">Classes Assigned</p>
                <p className="text-2xl font-bold text-green-800">
                  {DEMO_CLASSES.filter(c => c.classTeacherId).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BookText className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-purple-600">Subjects Assigned</p>
                <p className="text-2xl font-bold text-purple-800">
                  {DEMO_SUBJECTS.filter(s => s.teacherId).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-orange-600">Tasks Assigned</p>
                <p className="text-2xl font-bold text-orange-800">
                  {DEMO_ASSIGNMENTS.filter(a => a.teacherId).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Card>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <CardHeader>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="class-teachers">Class Teachers</TabsTrigger>
              <TabsTrigger value="subject-teachers">Subject Teachers</TabsTrigger>
              <TabsTrigger value="task-assignments">Task Assignments</TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            <TabsContent value="overview">
              <TeacherOverview />
            </TabsContent>
            <TabsContent value="class-teachers">
              <ClassTeacherAssignment />
            </TabsContent>
            <TabsContent value="subject-teachers">
              <SubjectTeacherAssignment />
            </TabsContent>
            <TabsContent value="task-assignments">
              <TaskAssignment />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </DashboardLayout>
  );
}

// ============================================
// TEACHER OVERVIEW
// ============================================

function TeacherOverview() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedTeacher, setSelectedTeacher] = React.useState<string | null>(null);

  const filteredTeachers = React.useMemo(() => {
    return DEMO_TEACHERS.filter(teacher => {
      const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase()) ||
             teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [searchTerm]);

  const getTeacherStats = (teacherId: string) => {
    const classCount = DEMO_CLASSES.filter(c => c.classTeacherId === teacherId).length;
    const subjectCount = DEMO_SUBJECTS.filter(s => s.teacherId === teacherId).length;
    const taskCount = DEMO_ASSIGNMENTS.filter(a => a.teacherId === teacherId).length;
    return { classCount, subjectCount, taskCount };
  };

  const selectedTeacherData = selectedTeacher 
    ? DEMO_TEACHERS.find(t => t.id === selectedTeacher) 
    : null;

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search teachers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teachers List */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredTeachers.map(teacher => {
              const stats = getTeacherStats(teacher.id);
              const isSelected = selectedTeacher === teacher.id;
              
              return (
                <div
                  key={teacher.id}
                  onClick={() => setSelectedTeacher(teacher.id)}
                  className={cn(
                    'p-4 border rounded-lg cursor-pointer transition-all',
                    isSelected 
                      ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-lg">
                      {teacher.firstName.charAt(0)}{teacher.lastName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">
                        {teacher.firstName} {teacher.lastName}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">{teacher.email}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <span className="flex items-center gap-1 text-green-600">
                          <BookOpen className="w-3 h-3" />
                          {stats.classCount} Classes
                        </span>
                        <span className="flex items-center gap-1 text-purple-600">
                          <BookText className="w-3 h-3" />
                          {stats.subjectCount} Subjects
                        </span>
                        <span className="flex items-center gap-1 text-orange-600">
                          <FileText className="w-3 h-3" />
                          {stats.taskCount} Tasks
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={cn(
                      'w-5 h-5 text-gray-400 transition-transform',
                      isSelected && 'rotate-90 text-primary-600'
                    )} />
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTeachers.length === 0 && (
            <EmptyState
              icon={<Users className="w-12 h-12" />}
              title="No teachers found"
              description="Try a different search term"
            />
          )}
        </div>

        {/* Teacher Details Panel */}
        <div className="lg:col-span-1">
          {selectedTeacherData ? (
            <TeacherDetailPanel teacher={selectedTeacherData} />
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Select a teacher to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface TeacherDetailPanelProps {
  teacher: typeof DEMO_TEACHERS[0];
}

function TeacherDetailPanel({ teacher }: TeacherDetailPanelProps) {
  const assignedClasses = DEMO_CLASSES.filter(c => c.classTeacherId === teacher.id);
  const assignedSubjects = DEMO_SUBJECTS.filter(s => s.teacherId === teacher.id);
  const assignedTasks = DEMO_ASSIGNMENTS.filter(a => a.teacherId === teacher.id);

  return (
    <div className="bg-white border rounded-lg p-4 sticky top-4 space-y-4">
      <div className="text-center pb-4 border-b">
        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl mx-auto mb-3">
          {teacher.firstName.charAt(0)}{teacher.lastName.charAt(0)}
        </div>
        <h3 className="font-semibold text-lg">{teacher.firstName} {teacher.lastName}</h3>
        <p className="text-sm text-gray-500">{teacher.email}</p>
        <Badge variant="success" className="mt-2">Active</Badge>
      </div>

      {/* Assigned Classes */}
      <div>
        <h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          Assigned Classes ({assignedClasses.length})
        </h4>
        {assignedClasses.length > 0 ? (
          <div className="space-y-1">
            {assignedClasses.map(cls => (
              <div key={cls.id} className="flex items-center justify-between bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm">
                <span>{cls.name} ({cls.section})</span>
                <Badge variant="default" className="text-xs">{cls.academicYear}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No classes assigned</p>
        )}
      </div>

      {/* Assigned Subjects */}
      <div>
        <h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
          <BookText className="w-4 h-4" />
          Assigned Subjects ({assignedSubjects.length})
        </h4>
        {assignedSubjects.length > 0 ? (
          <div className="space-y-1">
            {assignedSubjects.map(sub => {
              const cls = getClassById(sub.classId);
              return (
                <div key={sub.id} className="flex items-center justify-between bg-purple-50 text-purple-700 px-3 py-2 rounded-lg text-sm">
                  <span>{sub.name}</span>
                  <span className="text-xs opacity-75">{cls?.name}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No subjects assigned</p>
        )}
      </div>

      {/* Assigned Tasks */}
      <div>
        <h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Assigned Tasks ({assignedTasks.length})
        </h4>
        {assignedTasks.length > 0 ? (
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {assignedTasks.slice(0, 5).map(task => (
              <div key={task.id} className="flex items-center justify-between bg-orange-50 text-orange-700 px-3 py-2 rounded-lg text-sm">
                <span className="truncate flex-1">{task.title}</span>
                <Badge variant={task.status === 'published' ? 'warning' : 'info'} className="text-xs ml-2">
                  {task.status}
                </Badge>
              </div>
            ))}
            {assignedTasks.length > 5 && (
              <p className="text-xs text-center text-gray-500 mt-1">
                +{assignedTasks.length - 5} more
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No tasks assigned</p>
        )}
      </div>
    </div>
  );
}

// ============================================
// CLASS TEACHER ASSIGNMENT
// ============================================

function ClassTeacherAssignment() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false);
  const [selectedClass, setSelectedClass] = React.useState<typeof DEMO_CLASSES[0] | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);

  const filteredClasses = React.useMemo(() => {
    return DEMO_CLASSES.filter(cls =>
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.section.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredClasses.length / ITEMS_PER_PAGE);
  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAssign = (cls: typeof DEMO_CLASSES[0]) => {
    setSelectedClass(cls);
    setIsAssignModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold">Class Teacher Assignment</h3>
          <p className="text-sm text-gray-500">Assign teachers as class teachers for each class</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Class</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Current Teacher</TableHead>
            <TableHead>Students</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedClasses.map((cls) => {
            const teacher = cls.classTeacherId ? getTeacherById(cls.classTeacherId) : null;

            return (
              <TableRow key={cls.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="font-medium">{cls.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="default">{cls.section}</Badge>
                </TableCell>
                <TableCell>
                  {teacher ? (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-sm font-medium">
                        {teacher.firstName.charAt(0)}
                      </div>
                      <span>{teacher.firstName} {teacher.lastName}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Not assigned
                    </span>
                  )}
                </TableCell>
                <TableCell>{cls.capacity}</TableCell>
                <TableCell>
                  <Badge variant={cls.isActive ? 'success' : 'danger'}>
                    {cls.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant={teacher ? 'outline' : 'primary'}
                      onClick={() => handleAssign(cls)}
                    >
                      {teacher ? (
                        <>
                          <Edit className="w-4 h-4 mr-1" />
                          Change
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-1" />
                          Assign
                        </>
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredClasses.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      )}

      {/* Assign Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedClass(null);
        }}
        title={`Assign Class Teacher - ${selectedClass?.name} (${selectedClass?.section})`}
        size="md"
      >
        <AssignClassTeacherForm
          classData={selectedClass}
          onClose={() => {
            setIsAssignModalOpen(false);
            setSelectedClass(null);
          }}
        />
      </Modal>
    </div>
  );
}

interface AssignClassTeacherFormProps {
  classData: typeof DEMO_CLASSES[0] | null;
  onClose: () => void;
}

function AssignClassTeacherForm({ classData, onClose }: AssignClassTeacherFormProps) {
  const [selectedTeacherId, setSelectedTeacherId] = React.useState(classData?.classTeacherId || '');

  const teacherOptions = [
    { value: '', label: 'No Teacher Assigned' },
    ...DEMO_TEACHERS.map(t => ({
      value: t.id,
      label: `${t.firstName} ${t.lastName}`,
    }))
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the database
    console.log('Assigning teacher', selectedTeacherId, 'to class', classData?.id);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-500 mb-1">Assigning to</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium">{classData?.name} ({classData?.section})</p>
            <p className="text-sm text-gray-500">Academic Year: {classData?.academicYear}</p>
          </div>
        </div>
      </div>

      <Select
        label="Select Teacher"
        options={teacherOptions}
        value={selectedTeacherId}
        onChange={(e) => setSelectedTeacherId(e.target.value)}
      />

      {selectedTeacherId && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600 mb-2">Selected Teacher</p>
          {(() => {
            const teacher = getTeacherById(selectedTeacherId);
            if (!teacher) return null;
            const currentClasses = DEMO_CLASSES.filter(c => c.classTeacherId === selectedTeacherId);
            return (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
                  {teacher.firstName.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{teacher.firstName} {teacher.lastName}</p>
                  <p className="text-xs text-gray-500">
                    Currently assigned to {currentClasses.length} class(es)
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          <Check className="w-4 h-4 mr-2" />
          Save Assignment
        </Button>
      </div>
    </form>
  );
}

// ============================================
// SUBJECT TEACHER ASSIGNMENT
// ============================================

function SubjectTeacherAssignment() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [classFilter, setClassFilter] = React.useState('');
  const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false);
  const [selectedSubject, setSelectedSubject] = React.useState<typeof DEMO_SUBJECTS[0] | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);

  const classOptions = [
    { value: '', label: 'All Classes' },
    ...DEMO_CLASSES.map(c => ({
      value: c.id,
      label: `${c.name} (${c.section})`
    }))
  ];

  const filteredSubjects = React.useMemo(() => {
    return DEMO_SUBJECTS.filter(sub => {
      const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sub.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = !classFilter || sub.classId === classFilter;
      return matchesSearch && matchesClass;
    });
  }, [searchTerm, classFilter]);

  const totalPages = Math.ceil(filteredSubjects.length / ITEMS_PER_PAGE);
  const paginatedSubjects = filteredSubjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAssign = (sub: typeof DEMO_SUBJECTS[0]) => {
    setSelectedSubject(sub);
    setIsAssignModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold">Subject Teacher Assignment</h3>
          <p className="text-sm text-gray-500">Assign teachers to teach specific subjects</p>
        </div>
        <div className="flex gap-3">
          <Select
            options={classOptions}
            value={classFilter}
            onChange={(e) => {
              setClassFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-48"
          />
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
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Current Teacher</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedSubjects.map((sub) => {
            const teacher = sub.teacherId ? getTeacherById(sub.teacherId) : null;
            const classInfo = getClassById(sub.classId);

            return (
              <TableRow key={sub.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <BookText className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="font-medium">{sub.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {sub.code}
                  </span>
                </TableCell>
                <TableCell>
                  {classInfo ? `${classInfo.name} (${classInfo.section})` : '-'}
                </TableCell>
                <TableCell>
                  {teacher ? (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-sm font-medium">
                        {teacher.firstName.charAt(0)}
                      </div>
                      <span>{teacher.firstName} {teacher.lastName}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Not assigned
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={sub.type === 'core' ? 'info' : sub.type === 'elective' ? 'warning' : 'success'}>
                    {sub.type || 'Core'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant={teacher ? 'outline' : 'primary'}
                      onClick={() => handleAssign(sub)}
                    >
                      {teacher ? (
                        <>
                          <Edit className="w-4 h-4 mr-1" />
                          Change
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-1" />
                          Assign
                        </>
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredSubjects.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      )}

      {/* Assign Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedSubject(null);
        }}
        title={`Assign Subject Teacher - ${selectedSubject?.name}`}
        size="md"
      >
        <AssignSubjectTeacherForm
          subject={selectedSubject}
          onClose={() => {
            setIsAssignModalOpen(false);
            setSelectedSubject(null);
          }}
        />
      </Modal>
    </div>
  );
}

interface AssignSubjectTeacherFormProps {
  subject: typeof DEMO_SUBJECTS[0] | null;
  onClose: () => void;
}

function AssignSubjectTeacherForm({ subject, onClose }: AssignSubjectTeacherFormProps) {
  const [selectedTeacherId, setSelectedTeacherId] = React.useState(subject?.teacherId || '');
  const classInfo = subject ? getClassById(subject.classId) : null;

  const teacherOptions = [
    { value: '', label: 'No Teacher Assigned' },
    ...DEMO_TEACHERS.map(t => ({
      value: t.id,
      label: `${t.firstName} ${t.lastName}`,
    }))
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the database
    console.log('Assigning teacher', selectedTeacherId, 'to subject', subject?.id);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-500 mb-1">Assigning to</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <BookText className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="font-medium">{subject?.name}</p>
            <p className="text-sm text-gray-500">
              Class: {classInfo ? `${classInfo.name} (${classInfo.section})` : '-'}
            </p>
          </div>
        </div>
      </div>

      <Select
        label="Select Teacher"
        options={teacherOptions}
        value={selectedTeacherId}
        onChange={(e) => setSelectedTeacherId(e.target.value)}
      />

      {selectedTeacherId && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600 mb-2">Selected Teacher</p>
          {(() => {
            const teacher = getTeacherById(selectedTeacherId);
            if (!teacher) return null;
            const currentSubjects = DEMO_SUBJECTS.filter(s => s.teacherId === selectedTeacherId);
            return (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
                  {teacher.firstName.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{teacher.firstName} {teacher.lastName}</p>
                  <p className="text-xs text-gray-500">
                    Currently teaching {currentSubjects.length} subject(s)
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          <Check className="w-4 h-4 mr-2" />
          Save Assignment
        </Button>
      </div>
    </form>
  );
}

// ============================================
// TASK ASSIGNMENT
// ============================================

function TaskAssignment() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [teacherFilter, setTeacherFilter] = React.useState('');
  const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<typeof DEMO_ASSIGNMENTS[0] | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);

  const teacherOptions = [
    { value: '', label: 'All Teachers' },
    ...DEMO_TEACHERS.map(t => ({
      value: t.id,
      label: `${t.firstName} ${t.lastName}`
    }))
  ];

  const filteredTasks = React.useMemo(() => {
    return DEMO_ASSIGNMENTS.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTeacher = !teacherFilter || task.teacherId === teacherFilter;
      return matchesSearch && matchesTeacher;
    });
  }, [searchTerm, teacherFilter]);

  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAssign = (task: typeof DEMO_ASSIGNMENTS[0]) => {
    setSelectedTask(task);
    setIsAssignModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold">Task/Assignment Management</h3>
          <p className="text-sm text-gray-500">Assign tasks and assignments to teachers</p>
        </div>
        <div className="flex gap-3">
          <Select
            options={teacherOptions}
            value={teacherFilter}
            onChange={(e) => {
              setTeacherFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-48"
          />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task Title</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Assigned Teacher</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedTasks.map((task) => {
            const teacher = task.teacherId ? getTeacherById(task.teacherId) : null;
            const classInfo = getClassById(task.classId);
            const subject = getSubjectById(task.subjectId);

            return (
              <TableRow key={task.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-orange-600" />
                    </div>
                    <span className="font-medium truncate max-w-[200px]">{task.title}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {classInfo ? `${classInfo.name}` : '-'}
                </TableCell>
                <TableCell>
                  {subject ? subject.name : '-'}
                </TableCell>
                <TableCell>
                  {teacher ? (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-sm font-medium">
                        {teacher.firstName.charAt(0)}
                      </div>
                      <span>{teacher.firstName} {teacher.lastName}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Not assigned
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={
                    task.status === 'published' ? 'warning' :
                    task.status === 'closed' ? 'success' : 'info'
                  }>
                    {task.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant={teacher ? 'outline' : 'primary'}
                      onClick={() => handleAssign(task)}
                    >
                      {teacher ? (
                        <>
                          <Edit className="w-4 h-4 mr-1" />
                          Change
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-1" />
                          Assign
                        </>
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredTasks.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      )}

      {/* Assign Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedTask(null);
        }}
        title={`Assign Task - ${selectedTask?.title}`}
        size="md"
      >
        <AssignTaskForm
          task={selectedTask}
          onClose={() => {
            setIsAssignModalOpen(false);
            setSelectedTask(null);
          }}
        />
      </Modal>
    </div>
  );
}

interface AssignTaskFormProps {
  task: typeof DEMO_ASSIGNMENTS[0] | null;
  onClose: () => void;
}

function AssignTaskForm({ task, onClose }: AssignTaskFormProps) {
  const [selectedTeacherId, setSelectedTeacherId] = React.useState(task?.teacherId || '');
  const classInfo = task ? getClassById(task.classId) : null;
  const subject = task ? getSubjectById(task.subjectId) : null;

  const teacherOptions = [
    { value: '', label: 'No Teacher Assigned' },
    ...DEMO_TEACHERS.map(t => ({
      value: t.id,
      label: `${t.firstName} ${t.lastName}`,
    }))
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the database
    console.log('Assigning teacher', selectedTeacherId, 'to task', task?.id);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-500 mb-1">Assigning task</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="font-medium">{task?.title}</p>
            <p className="text-sm text-gray-500">
              {classInfo?.name} - {subject?.name}
            </p>
          </div>
        </div>
      </div>

      <Select
        label="Select Teacher"
        options={teacherOptions}
        value={selectedTeacherId}
        onChange={(e) => setSelectedTeacherId(e.target.value)}
      />

      {selectedTeacherId && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600 mb-2">Selected Teacher</p>
          {(() => {
            const teacher = getTeacherById(selectedTeacherId);
            if (!teacher) return null;
            const currentTasks = DEMO_ASSIGNMENTS.filter(a => a.teacherId === selectedTeacherId);
            return (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
                  {teacher.firstName.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{teacher.firstName} {teacher.lastName}</p>
                  <p className="text-xs text-gray-500">
                    Currently has {currentTasks.length} task(s) assigned
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          <Check className="w-4 h-4 mr-2" />
          Save Assignment
        </Button>
      </div>
    </form>
  );
}
