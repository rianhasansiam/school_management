'use client';

import * as React from 'react';
import { DashboardLayout, PageHeader } from '@/components/layout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Modal,
  EmptyState,
} from '@/components/ui';
import {
  DEMO_CLASSES,
  DEMO_SUBJECTS,
  DEMO_TEACHERS,
} from '@/lib/demo-data';
import { formatDate, cn } from '@/lib/utils';
import { CLASS_OPTIONS, SUBJECT_OPTIONS } from '@/lib/constants';
import { UserRole, Class, Subject, Teacher } from '@/lib/types';
import { useAuthStore } from '@/lib/store';
import {
  Search,
  FileText,
  File,
  FileImage,
  FileVideo,
  Presentation,
  FolderOpen,
  Download,
  Trash2,
  Grid,
  List,
  Upload,
  HardDrive,
  Clock,
  X,
  ExternalLink,
} from 'lucide-react';

// File type definitions
type FileType = 'pdf' | 'doc' | 'docx' | 'ppt' | 'pptx' | 'image' | 'video' | 'other';

interface TeacherFile {
  id: string;
  name: string;
  type: FileType;
  size: string;
  classId?: string;
  subjectId?: string;
  uploadedAt: Date;
  url: string;
}

// Demo files for the teacher
const DEMO_FILES: TeacherFile[] = [
  {
    id: 'file-001',
    name: 'Chapter 1 - Introduction to Algebra.pdf',
    type: 'pdf',
    size: '2.4 MB',
    classId: 'class-001',
    subjectId: 'subject-001',
    uploadedAt: new Date('2026-01-15'),
    url: '/files/algebra-intro.pdf',
  },
  {
    id: 'file-002',
    name: 'Geometry Basics Presentation.pptx',
    type: 'pptx',
    size: '5.8 MB',
    classId: 'class-001',
    subjectId: 'subject-001',
    uploadedAt: new Date('2026-01-14'),
    url: '/files/geometry-basics.pptx',
  },
  {
    id: 'file-003',
    name: 'Bengali Literature Notes.docx',
    type: 'docx',
    size: '1.2 MB',
    classId: 'class-002',
    subjectId: 'subject-002',
    uploadedAt: new Date('2026-01-13'),
    url: '/files/bengali-notes.docx',
  },
  {
    id: 'file-004',
    name: 'Science Experiment - Water Cycle.pdf',
    type: 'pdf',
    size: '3.1 MB',
    classId: 'class-003',
    subjectId: 'subject-003',
    uploadedAt: new Date('2026-01-12'),
    url: '/files/water-cycle.pdf',
  },
  {
    id: 'file-005',
    name: 'Physics Formulas Chart.png',
    type: 'image',
    size: '890 KB',
    classId: 'class-004',
    subjectId: 'subject-004',
    uploadedAt: new Date('2026-01-11'),
    url: '/files/physics-formulas.png',
  },
  {
    id: 'file-006',
    name: 'History Timeline Video.mp4',
    type: 'video',
    size: '45.2 MB',
    classId: 'class-002',
    subjectId: 'subject-005',
    uploadedAt: new Date('2026-01-10'),
    url: '/files/history-timeline.mp4',
  },
  {
    id: 'file-007',
    name: 'English Grammar Rules.pdf',
    type: 'pdf',
    size: '1.8 MB',
    classId: 'class-001',
    subjectId: 'subject-006',
    uploadedAt: new Date('2026-01-09'),
    url: '/files/grammar-rules.pdf',
  },
  {
    id: 'file-008',
    name: 'Math Practice Problems.docx',
    type: 'docx',
    size: '2.1 MB',
    classId: 'class-003',
    subjectId: 'subject-001',
    uploadedAt: new Date('2026-01-08'),
    url: '/files/math-practice.docx',
  },
  {
    id: 'file-009',
    name: 'Chemistry Lab Manual.pdf',
    type: 'pdf',
    size: '4.5 MB',
    classId: 'class-004',
    subjectId: 'subject-007',
    uploadedAt: new Date('2026-01-07'),
    url: '/files/chemistry-lab.pdf',
  },
  {
    id: 'file-010',
    name: 'Biology Diagrams.pptx',
    type: 'pptx',
    size: '8.3 MB',
    classId: 'class-005',
    subjectId: 'subject-008',
    uploadedAt: new Date('2026-01-06'),
    url: '/files/biology-diagrams.pptx',
  },
];

// Get file icon based on type
function getFileIcon(type: FileType) {
  switch (type) {
    case 'pdf':
      return <FileText className="w-6 h-6 text-red-500" />;
    case 'doc':
    case 'docx':
      return <FileText className="w-6 h-6 text-blue-500" />;
    case 'ppt':
    case 'pptx':
      return <Presentation className="w-6 h-6 text-orange-500" />;
    case 'image':
      return <FileImage className="w-6 h-6 text-green-500" />;
    case 'video':
      return <FileVideo className="w-6 h-6 text-purple-500" />;
    default:
      return <File className="w-6 h-6 text-gray-500" />;
  }
}

// Get file type badge color
function getFileTypeBadge(type: FileType) {
  const colors: Record<FileType, string> = {
    pdf: 'bg-red-100 text-red-700',
    doc: 'bg-blue-100 text-blue-700',
    docx: 'bg-blue-100 text-blue-700',
    ppt: 'bg-orange-100 text-orange-700',
    pptx: 'bg-orange-100 text-orange-700',
    image: 'bg-green-100 text-green-700',
    video: 'bg-purple-100 text-purple-700',
    other: 'bg-gray-100 text-gray-700',
  };
  return colors[type];
}

export default function NotesPage() {
  const { user } = useAuthStore();
  const isTeacher = user?.role === UserRole.TEACHER;

  // Get teacher's data
  const myTeacherProfile = isTeacher
    ? DEMO_TEACHERS.find((t: Teacher) => t.userId === user?.id)
    : null;

  const [searchTerm, setSearchTerm] = React.useState('');
  const [classFilter, setClassFilter] = React.useState('');
  const [subjectFilter, setSubjectFilter] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [previewFile, setPreviewFile] = React.useState<TeacherFile | null>(null);

  // Filter files
  const filteredFiles = React.useMemo(() => {
    return DEMO_FILES.filter((file) => {
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = !classFilter || file.classId === classFilter;
      const matchesSubject = !subjectFilter || file.subjectId === subjectFilter;
      const matchesType = !typeFilter || file.type === typeFilter;
      return matchesSearch && matchesClass && matchesSubject && matchesType;
    });
  }, [searchTerm, classFilter, subjectFilter, typeFilter]);

  // Calculate stats
  const totalSize = DEMO_FILES.reduce((acc, file) => {
    const size = parseFloat(file.size);
    if (file.size.includes('MB')) return acc + size;
    if (file.size.includes('KB')) return acc + size / 1024;
    return acc;
  }, 0);

  const fileTypeCounts = DEMO_FILES.reduce((acc, file) => {
    acc[file.type] = (acc[file.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setClassFilter('');
    setSubjectFilter('');
    setTypeFilter('');
  };

  const hasFilters = searchTerm || classFilter || subjectFilter || typeFilter;

  // Open file (for projector use)
  const openFile = (file: TeacherFile) => {
    window.open(file.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="My Drive"
        description="Store and manage your teaching materials - PDFs, Documents, Presentations"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'My Drive' },
        ]}
        actions={
          <Button onClick={() => setIsUploadModalOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
                <HardDrive className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-blue-600 truncate">Total Files</p>
                <p className="text-lg md:text-2xl font-bold text-blue-800">{DEMO_FILES.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-green-500 flex items-center justify-center shrink-0">
                <FolderOpen className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-green-600 truncate">Storage Used</p>
                <p className="text-lg md:text-2xl font-bold text-green-800">{totalSize.toFixed(1)} MB</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-red-500 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-red-600 truncate">PDF Files</p>
                <p className="text-lg md:text-2xl font-bold text-red-800">{fileTypeCounts['pdf'] || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-orange-500 flex items-center justify-center shrink-0">
                <Presentation className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-orange-600 truncate">Presentations</p>
                <p className="text-lg md:text-2xl font-bold text-orange-800">
                  {(fileTypeCounts['ppt'] || 0) + (fileTypeCounts['pptx'] || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            {/* Title and View Toggle */}
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                All Files
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              {/* Class Filter */}
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              >
                <option value="">All Classes</option>
                {CLASS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* Subject Filter */}
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              >
                <option value="">All Subjects</option>
                {SUBJECT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              >
                <option value="">All Types</option>
                <option value="pdf">PDF</option>
                <option value="docx">Documents</option>
                <option value="pptx">Presentations</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
              </select>

              {/* Clear Filters */}
              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredFiles.length === 0 ? (
            <EmptyState
              icon={<FolderOpen className="w-12 h-12" />}
              title="No files found"
              description={hasFilters ? 'Try adjusting your filters' : 'Upload your first file to get started'}
              action={
                <Button onClick={() => setIsUploadModalOpen(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </Button>
              }
            />
          ) : viewMode === 'grid' ? (
            // Grid View
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredFiles.map((file) => {
                const classInfo = DEMO_CLASSES.find((c: Class) => c.id === file.classId);

                return (
                  <div
                    key={file.id}
                    className="group relative bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer"
                    onClick={() => setPreviewFile(file)}
                  >
                    {/* File Icon */}
                    <div className="w-full aspect-square bg-gray-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-50 transition-colors">
                      <div className="transform group-hover:scale-110 transition-transform">
                        {React.cloneElement(getFileIcon(file.type), {
                          className: 'w-12 h-12',
                        })}
                      </div>
                    </div>

                    {/* File Name */}
                    <p className="font-medium text-sm text-gray-900 truncate mb-1" title={file.name}>
                      {file.name}
                    </p>

                    {/* File Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{file.size}</span>
                      <span
                        className={cn('px-2 py-0.5 rounded-full text-xs font-medium', getFileTypeBadge(file.type))}
                      >
                        {file.type.toUpperCase()}
                      </span>
                    </div>

                    {/* Class Tag */}
                    {classInfo && (
                      <div className="mt-2">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full truncate">
                          {classInfo.name}
                        </span>
                      </div>
                    )}

                    {/* Quick Actions (visible on hover) */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openFile(file);
                        }}
                        className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        title="Open for Projector"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="p-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // List View
            <div className="space-y-2">
              {filteredFiles.map((file) => {
                const classInfo = DEMO_CLASSES.find((c: Class) => c.id === file.classId);
                const subject = DEMO_SUBJECTS.find((s: Subject) => s.id === file.subjectId);

                return (
                  <div
                    key={file.id}
                    className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
                    onClick={() => setPreviewFile(file)}
                  >
                    {/* File Icon */}
                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      {getFileIcon(file.type)}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{file.name}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span>{file.size}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(file.uploadedAt)}
                        </span>
                        {classInfo && (
                          <>
                            <span>•</span>
                            <span>{classInfo.name}</span>
                          </>
                        )}
                        {subject && (
                          <>
                            <span>•</span>
                            <span>{subject.name}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Type Badge */}
                    <span
                      className={cn('px-3 py-1 rounded-full text-xs font-medium', getFileTypeBadge(file.type))}
                    >
                      {file.type.toUpperCase()}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openFile(file);
                        }}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Open
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Files"
        size="lg"
      >
        <UploadForm onClose={() => setIsUploadModalOpen(false)} />
      </Modal>

      {/* File Preview Modal */}
      <Modal
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        title="File Details"
        size="lg"
      >
        {previewFile && (
          <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} onOpen={openFile} />
        )}
      </Modal>
    </DashboardLayout>
  );
}

// ============================================
// UPLOAD FORM
// ============================================

interface UploadFormProps {
  onClose: () => void;
}

function UploadForm({ onClose }: UploadFormProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer',
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.gif,.mp4,.webm"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Upload className={cn('w-12 h-12 mx-auto mb-4', dragActive ? 'text-blue-500' : 'text-gray-400')} />
        <p className="text-lg font-medium text-gray-700 mb-1">
          {dragActive ? 'Drop files here' : 'Drag & drop files here'}
        </p>
        <p className="text-sm text-gray-500 mb-4">or click to browse</p>
        <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
          <span className="px-2 py-1 bg-gray-100 rounded">PDF</span>
          <span className="px-2 py-1 bg-gray-100 rounded">DOCX</span>
          <span className="px-2 py-1 bg-gray-100 rounded">PPTX</span>
          <span className="px-2 py-1 bg-gray-100 rounded">Images</span>
          <span className="px-2 py-1 bg-gray-100 rounded">Videos</span>
        </div>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Selected Files ({selectedFiles.length})</p>
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Optional: Class & Subject */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Class (Optional)
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
            <option value="">No specific class</option>
            {CLASS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject (Optional)
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
            <option value="">No specific subject</option>
            {SUBJECT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={selectedFiles.length === 0}>
          <Upload className="w-4 h-4 mr-2" />
          Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
        </Button>
      </div>
    </div>
  );
}

// ============================================
// FILE PREVIEW
// ============================================

interface FilePreviewProps {
  file: TeacherFile;
  onClose: () => void;
  onOpen: (file: TeacherFile) => void;
}

function FilePreview({ file, onClose, onOpen }: FilePreviewProps) {
  const classInfo = DEMO_CLASSES.find((c: Class) => c.id === file.classId);
  const subject = DEMO_SUBJECTS.find((s: Subject) => s.id === file.subjectId);

  return (
    <div className="space-y-6">
      {/* File Header */}
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
          {React.cloneElement(getFileIcon(file.type), { className: 'w-8 h-8' })}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{file.name}</h3>
          <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
            <span className={cn('px-2 py-0.5 rounded-full font-medium', getFileTypeBadge(file.type))}>
              {file.type.toUpperCase()}
            </span>
            <span>{file.size}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(file.uploadedAt)}
            </span>
          </div>
        </div>
      </div>

      {/* File Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Class</p>
          <p className="font-medium text-gray-900">{classInfo?.name || 'No specific class'}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Subject</p>
          <p className="font-medium text-gray-900">{subject?.name || 'No specific subject'}</p>
        </div>
      </div>

      {/* Preview Area */}
      <div className="bg-gray-100 rounded-xl p-8 text-center">
        <div className="w-20 h-20 mx-auto bg-white rounded-xl shadow-sm flex items-center justify-center mb-4">
          {React.cloneElement(getFileIcon(file.type), { className: 'w-10 h-10' })}
        </div>
        <p className="text-gray-600 mb-4">Click &quot;Open for Projector&quot; to view this file in full screen</p>
        <Button size="lg" onClick={() => onOpen(file)}>
          <ExternalLink className="w-5 h-5 mr-2" />
          Open for Projector
        </Button>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4 border-t">
        <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}
