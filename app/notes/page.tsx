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
  DEMO_CLASS_NOTES,
  DEMO_CLASSES,
  DEMO_SUBJECTS,
  DEMO_TEACHERS,
  getClassById,
  getSubjectById,
  getTeacherById,
} from '@/lib/demo-data';
import { formatDate, cn } from '@/lib/utils';
import { CLASS_OPTIONS, SUBJECT_OPTIONS } from '@/lib/constants';
import { ClassNote, UserRole } from '@/lib/types';
import { useAuthStore } from '@/lib/store';
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  FileText,
  Calendar,
  BookOpen,
  CheckCircle,
  Clock,
  Download,
  Paperclip,
} from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function NotesPage() {
  const { user } = useAuthStore();
  const isTeacher = user?.role === UserRole.TEACHER;

  // Get teacher's data if logged in as teacher
  const myTeacherProfile = isTeacher ? DEMO_TEACHERS.find(t => t.userId === user?.id) : null;

  // Get available notes (only teacher's own notes)
  const availableNotes = isTeacher 
    ? DEMO_CLASS_NOTES.filter(n => n.teacherId === myTeacherProfile?.id)
    : DEMO_CLASS_NOTES;

  const [searchTerm, setSearchTerm] = React.useState('');
  const [classFilter, setClassFilter] = React.useState('');
  const [subjectFilter, setSubjectFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [viewNote, setViewNote] = React.useState<ClassNote | null>(null);

  // Filter notes
  const filteredNotes = React.useMemo(() => {
    return availableNotes.filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesClass = !classFilter || note.classId === classFilter;
      const matchesSubject = !subjectFilter || note.subjectId === subjectFilter;
      const matchesStatus =
        !statusFilter ||
        (statusFilter === 'published' && note.isPublished) ||
        (statusFilter === 'draft' && !note.isPublished);

      return matchesSearch && matchesClass && matchesSubject && matchesStatus;
    });
  }, [searchTerm, classFilter, subjectFilter, statusFilter, availableNotes]);

  // Pagination
  const totalPages = Math.ceil(filteredNotes.length / ITEMS_PER_PAGE);
  const paginatedNotes = filteredNotes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <DashboardLayout>
      <PageHeader
        title="Class Notes"
        description="Create and manage class notes"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Class Notes' },
        ]}
        actions={
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Note
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
                <p className="text-sm text-blue-600">Total Notes</p>
                <p className="text-2xl font-bold text-blue-800">
                  {DEMO_CLASS_NOTES.length}
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
                <p className="text-sm text-green-600">Published</p>
                <p className="text-2xl font-bold text-green-800">
                  {DEMO_CLASS_NOTES.filter((n) => n.isPublished).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Draft</p>
                <p className="text-2xl font-bold text-gray-800">
                  {DEMO_CLASS_NOTES.filter((n) => !n.isPublished).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Paperclip className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-purple-600">With Attachments</p>
                <p className="text-2xl font-bold text-purple-800">
                  {DEMO_CLASS_NOTES.filter((n) => n.attachments && n.attachments.length > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Notes List</CardTitle>
            <div className="flex flex-wrap items-center gap-3">
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
                onChange={(e) => {
                  setClassFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-40"
              />

              {/* Subject Filter */}
              <Select
                options={[{ value: '', label: 'All Subjects' }, ...SUBJECT_OPTIONS]}
                value={subjectFilter}
                onChange={(e) => {
                  setSubjectFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-40"
              />

              {/* Status Filter */}
              <Select
                options={[
                  { value: '', label: 'All Status' },
                  { value: 'published', label: 'Published' },
                  { value: 'draft', label: 'Draft' },
                ]}
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-36"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {paginatedNotes.length === 0 ? (
            <EmptyState
              icon={<FileText className="w-12 h-12" />}
              title="No notes found"
              description="Change search criteria or create a new note."
              action={
                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Note
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
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedNotes.map((note) => {
                    const classInfo = getClassById(note.classId);
                    const subject = getSubjectById(note.subjectId);
                    const teacher = getTeacherById(note.teacherId);

                    return (
                      <TableRow key={note.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'w-10 h-10 rounded-lg flex items-center justify-center',
                                note.isPublished ? 'bg-green-100' : 'bg-gray-100'
                              )}
                            >
                              <FileText
                                className={cn(
                                  'w-5 h-5',
                                  note.isPublished ? 'text-green-600' : 'text-gray-600'
                                )}
                              />
                            </div>
                            <div>
                              <p className="font-medium">{note.title}</p>
                              {note.attachments && note.attachments.length > 0 && (
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <Paperclip className="w-3 h-3" />
                                  {note.attachments.length} attachment(s)
                                </p>
                              )}
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
                            <span>{formatDate(note.createdAt)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={note.isPublished ? 'success' : 'default'}>
                            {note.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setViewNote(note)}
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
                  totalItems={filteredNotes.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Note Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="New Class Note"
        size="lg"
      >
        <NoteForm onClose={() => setIsAddModalOpen(false)} />
      </Modal>

      {/* View Note Modal */}
      <Modal
        isOpen={!!viewNote}
        onClose={() => setViewNote(null)}
        title="Note Details"
        size="lg"
      >
        {viewNote && (
          <NoteDetails note={viewNote} onClose={() => setViewNote(null)} />
        )}
      </Modal>
    </DashboardLayout>
  );
}

// ============================================
// NOTE FORM
// ============================================

interface NoteFormProps {
  onClose: () => void;
}

function NoteForm({ onClose }: NoteFormProps) {
  return (
    <form className="space-y-4">
      <Input label="Title" placeholder="Note title" required />

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

      <Textarea
        label="Note Content"
        placeholder="Write note details..."
        rows={8}
        required
      />

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Attachments (Optional)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer">
          <Paperclip className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            Drag files here or click to select
          </p>
          <p className="text-xs text-gray-400 mt-1">
            PDF, DOC, PPT, Image (max 10MB)
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" variant="secondary">
          Save as Draft
        </Button>
        <Button type="submit">Publish</Button>
      </div>
    </form>
  );
}

// ============================================
// NOTE DETAILS
// ============================================

interface NoteDetailsProps {
  note: ClassNote;
  onClose: () => void;
}

function NoteDetails({ note, onClose }: NoteDetailsProps) {
  const classInfo = getClassById(note.classId);
  const subject = getSubjectById(note.subjectId);
  const teacher = getTeacherById(note.teacherId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold">{note.title}</h3>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={note.isPublished ? 'success' : 'default'}>
              {note.isPublished ? 'Published' : 'Draft'}
            </Badge>
            <span className="text-sm text-gray-500">
              {formatDate(note.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-3 gap-4">
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
      </div>

      {/* Content */}
      <div>
        <h4 className="font-medium text-gray-700 mb-2">Content</h4>
        <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-gray-700">
          {note.content}
        </div>
      </div>

      {/* Attachments */}
      {note.attachments && note.attachments.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Attachments</h4>
          <div className="space-y-2">
            {note.attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <span className="text-sm">{attachment}</span>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        {!note.isPublished && (
          <Button variant="secondary">
            <CheckCircle className="w-4 h-4 mr-2" />
            Publish
          </Button>
        )}
        <Button>
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>
    </div>
  );
}
