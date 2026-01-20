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
  DEMO_TEACHERS,
  getClassById,
  getTeacherById,
} from '@/lib/demo-data';
import { CLASS_OPTIONS } from '@/lib/constants';
import { Subject, UserRole, Teacher } from '@/lib/types';
import { useAuthStore, useNoticeStore, Notice } from '@/lib/store';
import { useDebounce } from '@/hooks/useCommon';
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  BookText,
  BookMarked,
  User,
  X,
  Layers,
  Calendar,
  Star,
  LayoutGrid,
  List,
  Bell,
  Send,
  AlertCircle,
  AlertTriangle,
  Info,
  GraduationCap,
} from 'lucide-react';
import { Avatar } from '@/components/ui';

const ITEMS_PER_PAGE = 10;

type ViewMode = 'table' | 'grid';

export default function SubjectsPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === UserRole.ADMIN;
  const isTeacher = user?.role === UserRole.TEACHER;
  const { notices, addNotice, deleteNotice } = useNoticeStore();

  // Get teacher profile if logged in as teacher
  const myTeacherProfile = isTeacher
    ? DEMO_TEACHERS.find((t: Teacher) => t.userId === user?.id)
    : null;

  // Get available subjects (all for admin, only assigned subjects for teacher)
  const availableSubjects = isAdmin
    ? DEMO_SUBJECTS
    : DEMO_SUBJECTS.filter((s: Subject) => s.teacherId === myTeacherProfile?.id);

  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [classFilter, setClassFilter] = React.useState('');
  const [viewMode, setViewMode] = React.useState<ViewMode>('table');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [viewSubject, setViewSubject] = React.useState<Subject | null>(null);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = React.useState(false);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, classFilter]);

  // Stats calculations
  const stats = React.useMemo(() => {
    const totalSubjects = availableSubjects.length;
    const totalClasses = new Set(availableSubjects.map((s: Subject) => s.classId)).size;
    const activeSubjects = availableSubjects.filter((s: Subject) => s.isActive).length;
    const assignedTeachers = new Set(availableSubjects.filter((s: Subject) => s.teacherId).map((s: Subject) => s.teacherId)).size;
    
    return {
      totalSubjects,
      totalClasses,
      activeSubjects,
      assignedTeachers,
    };
  }, [availableSubjects]);

  // Filter subjects
  const filteredSubjects = React.useMemo(() => {
    return availableSubjects.filter((subject) => {
      const searchLower = debouncedSearch.toLowerCase();
      const matchesSearch = !debouncedSearch ||
        subject.name.toLowerCase().includes(searchLower) ||
        subject.code.toLowerCase().includes(searchLower);
      const matchesClass = !classFilter || subject.classId === classFilter;

      return matchesSearch && matchesClass;
    });
  }, [debouncedSearch, classFilter, availableSubjects]);

  // Pagination
  const totalPages = Math.ceil(filteredSubjects.length / ITEMS_PER_PAGE);
  const paginatedSubjects = filteredSubjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const clearSearch = () => setSearchTerm('');
  
  const clearAllFilters = () => {
    setSearchTerm('');
    setClassFilter('');
  };

  const hasActiveFilters = searchTerm || classFilter;

  return (
    <DashboardLayout>
      <PageHeader
        title={isTeacher ? 'My Subjects' : 'Subject Management'}
        description={isTeacher ? 'View your assigned subjects' : 'Manage subjects and teacher assignments'}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: isTeacher ? 'My Subjects' : 'Subjects' },
        ]}
        actions={
          isAdmin ? (
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Subject
            </Button>
          ) : undefined
        }
      />

      {/* Stats Cards - Clean Design */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4 border-l-gray-800 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Subjects</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalSubjects}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <BookText className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Classes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalClasses}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Layers className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Subjects</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeSubjects}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <BookMarked className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Assigned Teachers</p>
                <p className="text-3xl font-bold text-gray-900">{stats.assignedTeachers}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          <Button
            variant={viewMode === 'table' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('table')}
            className="px-3"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="px-3"
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <BookText className="w-5 h-5 text-gray-600" />
            Subject List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search & Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-6 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by subject name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                >
                  <X className="w-3 h-3 text-gray-600" />
                </button>
              )}
            </div>
            
            <div className="flex gap-3">
              <Select
                options={[{ value: '', label: 'All Classes' }, ...CLASS_OPTIONS]}
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="w-40"
              />
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearAllFilters} className="gap-2">
                  <X className="w-4 h-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {paginatedSubjects.length === 0 ? (
            <EmptyState
              icon={<BookText className="w-12 h-12" />}
              title={isTeacher ? 'No subjects assigned' : 'No subjects found'}
              description={isTeacher 
                ? 'You have no subjects assigned to you yet. Please contact the administrator.'
                : hasActiveFilters 
                  ? 'Try adjusting your search or filters' 
                  : 'Create your first subject to get started'
              }
              action={
                isAdmin ? (
                  <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Subject
                  </Button>
                ) : undefined
              }
            />
          ) : viewMode === 'table' ? (
            <>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Subject</TableHead>
                      <TableHead className="font-semibold">Code</TableHead>
                      <TableHead className="font-semibold">Class</TableHead>
                      <TableHead className="font-semibold">Assigned Teacher</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSubjects.map((subject) => {
                      const classInfo = getClassById(subject.classId);
                      const teacher = subject.teacherId ? getTeacherById(subject.teacherId) : null;

                      return (
                        <TableRow key={subject.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center text-white font-bold">
                                {subject.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{subject.name}</p>
                                {subject.description && (
                                  <p className="text-xs text-gray-500 truncate max-w-[200px]">{subject.description}</p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                              {subject.code}
                            </span>
                          </TableCell>
                          <TableCell>
                            {classInfo ? (
                              <div>
                                <p className="font-medium">{classInfo.name}</p>
                                <p className="text-xs text-gray-500">Section {classInfo.section}</p>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {teacher ? (
                              <div className="flex items-center gap-2">
                                <Avatar
                                  src={teacher.avatar}
                                  alt={`${teacher.firstName} ${teacher.lastName}`}
                                  size="sm"
                                />
                                <div>
                                  <p className="font-medium text-sm">{teacher.firstName} {teacher.lastName}</p>
                                  <p className="text-xs text-gray-500">{teacher.specialization}</p>
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">Not Assigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={subject.isActive ? 'success' : 'danger'}>
                              {subject.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewSubject(subject)}
                                className="hover:bg-gray-100 hover:text-gray-800"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              {isAdmin && (
                                <>
                                  <Button variant="ghost" size="sm" className="hover:bg-amber-50 hover:text-amber-600">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="hover:bg-red-50 text-red-600">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={filteredSubjects.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                  />
                </div>
              )}
            </>
          ) : (
            /* Grid View */
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedSubjects.map((subject) => {
                  const classInfo = getClassById(subject.classId);
                  const teacher = subject.teacherId ? getTeacherById(subject.teacherId) : null;

                  return (
                    <Card 
                      key={subject.id} 
                      className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-gray-400"
                      onClick={() => setViewSubject(subject)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-white font-bold text-lg">
                              {subject.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{subject.name}</p>
                              <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
                                {subject.code}
                              </span>
                            </div>
                          </div>
                          <Badge variant={subject.isActive ? 'success' : 'danger'} className="text-xs">
                            {subject.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 text-sm mb-4">
                          <Layers className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {classInfo ? `${classInfo.name} (${classInfo.section})` : 'No class'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          {teacher ? (
                            <div className="flex items-center gap-2">
                              <Avatar
                                src={teacher.avatar}
                                alt={`${teacher.firstName} ${teacher.lastName}`}
                                size="sm"
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{teacher.firstName} {teacher.lastName}</p>
                                <p className="text-xs text-gray-500">{teacher.specialization}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-sm text-gray-400">
                              <User className="w-4 h-4" />
                              <span>Not Assigned</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={filteredSubjects.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                  />
                </div>
              )}
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

      {/* Create Notice Modal */}
      <Modal
        isOpen={isNoticeModalOpen}
        onClose={() => setIsNoticeModalOpen(false)}
        title="Create Notice"
        size="md"
      >
        <NoticeForm 
          onClose={() => setIsNoticeModalOpen(false)} 
          onSubmit={(data) => {
            addNotice(data);
            setIsNoticeModalOpen(false);
          }}
        />
      </Modal>
    </DashboardLayout>
  );
}

// ============================================
// NOTICE CARD
// ============================================

interface NoticeCardProps {
  notice: Notice;
  onDelete: () => void;
  isAdmin: boolean;
}

function NoticeCard({ notice, onDelete, isAdmin }: NoticeCardProps) {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityBg = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 border-red-200';
      case 'medium':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className={`p-4 rounded-lg border ${getPriorityBg(notice.priority)} transition-all hover:shadow-sm`}>
      <div className="flex items-start gap-3">
        {getPriorityIcon(notice.priority)}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-medium text-gray-900">{notice.title}</h4>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                notice.targetRole === 'teachers' ? 'bg-purple-100 text-purple-700' :
                notice.targetRole === 'students' ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {notice.targetRole === 'all' ? 'Everyone' : notice.targetRole}
              </span>
              <span className="text-xs text-gray-500">{formatTime(notice.createdAt)}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">{notice.message}</p>
          {isAdmin && (
            <div className="flex items-center justify-end mt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// NOTICE FORM
// ============================================

interface NoticeFormProps {
  onClose: () => void;
  onSubmit: (data: Omit<Notice, 'id' | 'createdAt' | 'isRead'>) => void;
}

function NoticeForm({ onClose, onSubmit }: NoticeFormProps) {
  const [title, setTitle] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [priority, setPriority] = React.useState<'low' | 'medium' | 'high'>('low');
  const [targetRole, setTargetRole] = React.useState<'all' | 'teachers' | 'students'>('teachers');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    
    onSubmit({
      title,
      message,
      priority,
      targetRole,
      createdBy: 'Admin',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Notice Title"
        placeholder="Enter notice title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          placeholder="Enter notice message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Priority"
          options={[
            { value: 'low', label: '🔵 Low' },
            { value: 'medium', label: '🟡 Medium' },
            { value: 'high', label: '🔴 High' },
          ]}
          value={priority}
          onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
        />
        <Select
          label="Target Audience"
          options={[
            { value: 'teachers', label: '👨‍🏫 Teachers' },
            { value: 'students', label: '👨‍🎓 Students' },
            { value: 'all', label: '👥 Everyone' },
          ]}
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value as 'all' | 'teachers' | 'students')}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          <Send className="w-4 h-4 mr-2" />
          Send Notice
        </Button>
      </div>
    </form>
  );
}

// ============================================
// SUBJECT FORM
// ============================================

interface SubjectFormProps {
  onClose: () => void;
}

function SubjectForm({ onClose }: SubjectFormProps) {
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

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Credit Hours"
          type="number"
          placeholder="3"
        />
        <Input
          label="Description (optional)"
          placeholder="Brief description..."
        />
      </div>

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-black flex items-center justify-center text-white font-bold text-2xl">
          {subject.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-xl font-semibold">{subject.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
              {subject.code}
            </span>
            <Badge variant={subject.isActive ? 'success' : 'danger'}>
              {subject.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Assigned Teacher */}
      <div className="bg-purple-50 p-4 rounded-xl">
        <p className="text-sm text-purple-600 mb-2 flex items-center gap-1">
          <GraduationCap className="w-4 h-4" />
          Assigned Teacher
        </p>
        {teacher ? (
          <div className="flex items-center gap-3">
            <Avatar
              src={teacher.avatar}
              alt={`${teacher.firstName} ${teacher.lastName}`}
              size="md"
            />
            <div>
              <p className="font-semibold text-gray-900">{teacher.firstName} {teacher.lastName}</p>
              <p className="text-sm text-gray-600">{teacher.specialization}</p>
              <p className="text-xs text-gray-500">{teacher.qualification}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No teacher assigned</p>
        )}
      </div>

      {/* Credit Hours */}
      <div className="bg-amber-50 p-4 rounded-xl">
        <p className="text-sm text-amber-600 mb-1 flex items-center gap-1">
          <Star className="w-4 h-4" />
          Credit Hours
        </p>
        <p className="text-2xl font-bold text-amber-700">{subject.creditHours || '-'}</p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
            <Layers className="w-4 h-4" />
            Class
          </p>
          <p className="font-medium text-black">
            {classInfo ? `${classInfo.name} (Section ${classInfo.section})` : '-'}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Academic Year
          </p>
          <p className="font-medium text-black">{classInfo?.academicYear || '-'}</p>
        </div>
      </div>

      {/* Description */}
      {subject.description && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-2">Description</p>
          <p className="text-gray-700">{subject.description}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button>
          <Edit className="w-4 h-4 mr-2" />
          Edit Subject
        </Button>
      </div>
    </div>
  );
}
