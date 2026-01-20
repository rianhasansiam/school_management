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
  Avatar,
} from '@/components/ui';
import {
  DEMO_BOOKS,
  DEMO_BOOK_ISSUANCES,
  DEMO_STUDENTS,
  DEMO_CLASSES,
  getStudentById,
  getBookById,
  getClassById,
} from '@/lib/demo-data';
import { formatDate, cn } from '@/lib/utils';
import { Book, BookIssuance, IssuanceStatus, Student, Class } from '@/lib/types';
import { useDebounce } from '@/hooks/useCommon';
import {
  Plus,
  Search,
  BookOpen,
  Eye,
  ArrowLeftRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  X,
  Users,
  Layers,
  BookMarked,
  TrendingUp,
} from 'lucide-react';

const ITEMS_PER_PAGE = 8;

type TabType = 'all-books' | 'available' | 'class-wise' | 'subject-wise' | 'issuances' | 'student-tracking';

export default function BooksPage() {
  const [activeTab, setActiveTab] = React.useState<TabType>('all-books');
  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [classFilter, setClassFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedClassForDetail, setSelectedClassForDetail] = React.useState<string | null>(null);
  
  const [isIssueModalOpen, setIsIssueModalOpen] = React.useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = React.useState(false);
  const [selectedBook, setSelectedBook] = React.useState<Book | null>(null);
  const [selectedIssuance, setSelectedIssuance] = React.useState<BookIssuance | null>(null);
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null);

  // Reset page when tab changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, debouncedSearch, classFilter, statusFilter]);

  // Stats
  const totalBooks = DEMO_BOOKS.reduce((sum, b) => sum + b.totalCopies, 0);
  const availableBooks = DEMO_BOOKS.reduce((sum, b) => sum + b.availableCopies, 0);
  const issuedBooks = DEMO_BOOK_ISSUANCES.filter(i => i.status === IssuanceStatus.ISSUED).length;
  const uniqueStudentsWithBooks = new Set(
    DEMO_BOOK_ISSUANCES.filter(i => i.status === IssuanceStatus.ISSUED).map(i => i.studentId)
  ).size;
  const avgBooksPerStudent = uniqueStudentsWithBooks > 0 
    ? (issuedBooks / uniqueStudentsWithBooks).toFixed(1) 
    : '0';

  // Class-wise book data
  const classWiseData = React.useMemo(() => {
    const data: Record<string, { 
      class: Class; 
      books: Book[]; 
      totalCopies: number; 
      availableCopies: number;
      issuedCount: number;
    }> = {};

    // Group books by class
    DEMO_BOOKS.forEach(book => {
      if (book.classId) {
        const cls = getClassById(book.classId);
        if (cls) {
          if (!data[book.classId]) {
            data[book.classId] = {
              class: cls,
              books: [],
              totalCopies: 0,
              availableCopies: 0,
              issuedCount: 0,
            };
          }
          data[book.classId].books.push(book);
          data[book.classId].totalCopies += book.totalCopies;
          data[book.classId].availableCopies += book.availableCopies;
        }
      }
    });

    // Count issued books per class
    DEMO_BOOK_ISSUANCES.forEach(issuance => {
      if (issuance.status === IssuanceStatus.ISSUED) {
        const student = getStudentById(issuance.studentId);
        if (student && data[student.classId]) {
          data[student.classId].issuedCount++;
        }
      }
    });

    return Object.values(data).sort((a, b) => a.class.name.localeCompare(b.class.name));
  }, []);

  // Subject-wise book data
  const subjectWiseData = React.useMemo(() => {
    const data: Record<string, {
      subject: string;
      books: Book[];
      totalCopies: number;
      availableCopies: number;
      issuedCount: number;
      classCount: number;
    }> = {};

    // Group books by subject
    DEMO_BOOKS.forEach(book => {
      const subject = book.subject || 'General';
      if (!data[subject]) {
        data[subject] = {
          subject,
          books: [],
          totalCopies: 0,
          availableCopies: 0,
          issuedCount: 0,
          classCount: 0,
        };
      }
      data[subject].books.push(book);
      data[subject].totalCopies += book.totalCopies;
      data[subject].availableCopies += book.availableCopies;
    });

    // Count unique classes per subject and issued books
    Object.values(data).forEach(subjectData => {
      const uniqueClasses = new Set(subjectData.books.map(b => b.classId).filter(Boolean));
      subjectData.classCount = uniqueClasses.size;
      
      // Count issued books for this subject
      subjectData.books.forEach(book => {
        const bookIssuances = DEMO_BOOK_ISSUANCES.filter(
          i => i.bookId === book.id && i.status === IssuanceStatus.ISSUED
        ).length;
        subjectData.issuedCount += bookIssuances;
      });
    });

    return Object.values(data).sort((a, b) => b.totalCopies - a.totalCopies);
  }, []);

  const [selectedSubjectForDetail, setSelectedSubjectForDetail] = React.useState<string | null>(null);

  // Section-wise (class section) book tracking
  const sectionWiseData = React.useMemo(() => {
    const data: Record<string, {
      className: string;
      section: string;
      studentCount: number;
      booksIssued: number;
      students: { student: Student; booksCount: number }[];
    }> = {};

    // Group by class section
    DEMO_STUDENTS.forEach(student => {
      const cls = getClassById(student.classId);
      if (cls) {
        const sectionName = cls.section || 'A';
        const key = `${cls.name}-${sectionName}`;
        if (!data[key]) {
          data[key] = {
            className: cls.name,
            section: sectionName,
            studentCount: 0,
            booksIssued: 0,
            students: [],
          };
        }
        data[key].studentCount++;
        
        // Count books issued to this student
        const studentBooks = DEMO_BOOK_ISSUANCES.filter(
          i => i.studentId === student.id && i.status === IssuanceStatus.ISSUED
        ).length;
        data[key].booksIssued += studentBooks;
        if (studentBooks > 0) {
          data[key].students.push({ student, booksCount: studentBooks });
        }
      }
    });

    return Object.values(data).sort((a, b) => {
      if (a.className !== b.className) return a.className.localeCompare(b.className);
      return a.section.localeCompare(b.section);
    });
  }, []);

  // Student book tracking - who has received books and who hasn't
  const studentTrackingData = React.useMemo(() => {
    const trackingByClass: Record<string, {
      class: Class;
      students: {
        student: Student;
        hasBooks: boolean;
        booksCount: number;
        booksList: { book: Book; issuedDate: Date }[];
      }[];
      receivedCount: number;
      notReceivedCount: number;
    }> = {};

    DEMO_STUDENTS.forEach(student => {
      const cls = getClassById(student.classId);
      if (!cls) return;

      if (!trackingByClass[cls.id]) {
        trackingByClass[cls.id] = {
          class: cls,
          students: [],
          receivedCount: 0,
          notReceivedCount: 0,
        };
      }

      // Get books issued to this student
      const studentIssuances = DEMO_BOOK_ISSUANCES.filter(
        i => i.studentId === student.id && i.status === IssuanceStatus.ISSUED
      );
      const booksList = studentIssuances.map(issuance => {
        const book = getBookById(issuance.bookId);
        return book ? { book, issuedDate: issuance.issuedDate } : null;
      }).filter(Boolean) as { book: Book; issuedDate: Date }[];

      const hasBooks = studentIssuances.length > 0;
      
      trackingByClass[cls.id].students.push({
        student,
        hasBooks,
        booksCount: studentIssuances.length,
        booksList,
      });

      if (hasBooks) {
        trackingByClass[cls.id].receivedCount++;
      } else {
        trackingByClass[cls.id].notReceivedCount++;
      }
    });

    return Object.values(trackingByClass).sort((a, b) => a.class.name.localeCompare(b.class.name));
  }, []);

  // Filter student tracking data
  const filteredStudentTracking = React.useMemo(() => {
    if (!classFilter && !debouncedSearch) return studentTrackingData;

    return studentTrackingData
      .filter(data => !classFilter || data.class.id === classFilter)
      .map(data => ({
        ...data,
        students: data.students.filter(s => {
          if (!debouncedSearch) return true;
          const searchLower = debouncedSearch.toLowerCase();
          return `${s.student.firstName} ${s.student.lastName}`.toLowerCase().includes(searchLower) ||
            s.student.studentId.toLowerCase().includes(searchLower);
        }),
      }));
  }, [studentTrackingData, classFilter, debouncedSearch]);

  const [trackingFilter, setTrackingFilter] = React.useState<'all' | 'received' | 'not-received'>('all');
  const [selectedStudentForBooks, setSelectedStudentForBooks] = React.useState<{
    student: Student;
    booksList: { book: Book; issuedDate: Date }[];
  } | null>(null);

  // Filter all books
  const filteredBooks = React.useMemo(() => {
    return DEMO_BOOKS.filter((book) => {
      const searchLower = debouncedSearch.toLowerCase();
      const cls = book.classId ? getClassById(book.classId) : null;
      const matchesSearch = !debouncedSearch ||
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower) ||
        book.isbn.includes(debouncedSearch) ||
        book.subject?.toLowerCase().includes(searchLower) ||
        cls?.name.toLowerCase().includes(searchLower);
      const matchesClass = !classFilter || book.classId === classFilter;
      return matchesSearch && matchesClass;
    });
  }, [debouncedSearch, classFilter]);

  // Filter available books only
  const availableBooksList = React.useMemo(() => {
    return filteredBooks.filter(book => book.availableCopies > 0);
  }, [filteredBooks]);

  // Filter issuances
  const filteredIssuances = React.useMemo(() => {
    return DEMO_BOOK_ISSUANCES.filter((issuance) => {
      const book = getBookById(issuance.bookId);
      const student = getStudentById(issuance.studentId);
      const cls = student ? getClassById(student.classId) : null;
      const searchLower = debouncedSearch.toLowerCase();
      const matchesSearch = !debouncedSearch ||
        book?.title.toLowerCase().includes(searchLower) ||
        `${student?.firstName} ${student?.lastName}`.toLowerCase().includes(searchLower) ||
        student?.studentId.toLowerCase().includes(searchLower) ||
        cls?.name.toLowerCase().includes(searchLower);
      const matchesStatus = !statusFilter || issuance.status === statusFilter;
      const matchesClass = !classFilter || student?.classId === classFilter;
      return matchesSearch && matchesStatus && matchesClass;
    });
  }, [debouncedSearch, statusFilter, classFilter]);

  // Get current data based on tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 'all-books':
        return filteredBooks;
      case 'available':
        return availableBooksList;
      case 'issuances':
        return filteredIssuances;
      default:
        return [];
    }
  };

  const currentData = getCurrentData();
  const totalPages = Math.ceil(currentData.length / ITEMS_PER_PAGE);
  const paginatedData = currentData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusBadge = (status: IssuanceStatus) => {
    const styles: Record<IssuanceStatus, { variant: 'default' | 'success' | 'warning' | 'danger'; label: string }> = {
      [IssuanceStatus.ISSUED]: { variant: 'warning', label: 'Issued' },
      [IssuanceStatus.RETURNED]: { variant: 'success', label: 'Returned' },
      [IssuanceStatus.LOST]: { variant: 'danger', label: 'Lost' },
      [IssuanceStatus.DAMAGED]: { variant: 'danger', label: 'Damaged' },
      [IssuanceStatus.PENDING]: { variant: 'default', label: 'Pending' },
    };
    return <Badge variant={styles[status].variant}>{styles[status].label}</Badge>;
  };

  const handleIssueBook = (book: Book) => {
    setSelectedBook(book);
    setIsIssueModalOpen(true);
  };

  const handleReturnBook = (issuance: BookIssuance) => {
    setSelectedIssuance(issuance);
    setIsReturnModalOpen(true);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setClassFilter('');
    setStatusFilter('');
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Books Management"
        description="Track and manage textbooks distribution"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Resources', href: '/resources' },
          { label: 'Books' },
        ]}
        actions={
          <Button onClick={() => setIsIssueModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Issue Book
          </Button>
        }
      />

      {/* Stats Overview - Clean & Simple */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4 border-l-gray-800 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Books</p>
                <p className="text-3xl font-bold text-gray-900">{totalBooks}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Issued</p>
                <p className="text-3xl font-bold text-gray-900">{issuedBooks}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <ArrowLeftRight className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Available</p>
                <p className="text-3xl font-bold text-gray-900">{availableBooks}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg per Student</p>
                <p className="text-3xl font-bold text-gray-900">{avgBooksPerStudent}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={activeTab === 'all-books' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('all-books')}
          className="flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          <span>All Books</span>
          <span className={cn(
            "ml-1 px-2 py-0.5 text-xs rounded-full",
            activeTab === 'all-books' ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
          )}>
            {DEMO_BOOKS.length}
          </span>
        </Button>
        <Button
          variant={activeTab === 'available' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('available')}
          className="flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Available</span>
          <span className={cn(
            "ml-1 px-2 py-0.5 text-xs rounded-full",
            activeTab === 'available' ? "bg-white/20 text-white" : "bg-green-100 text-green-700"
          )}>
            {DEMO_BOOKS.filter(b => b.availableCopies > 0).length}
          </span>
        </Button>
        <Button
          variant={activeTab === 'class-wise' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('class-wise')}
          className="flex items-center gap-2"
        >
          <Layers className="w-4 h-4" />
          <span>Class-wise</span>
        </Button>
        <Button
          variant={activeTab === 'subject-wise' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('subject-wise')}
          className="flex items-center gap-2"
        >
          <BookMarked className="w-4 h-4" />
          <span>Subject-wise</span>
          <span className={cn(
            "ml-1 px-2 py-0.5 text-xs rounded-full",
            activeTab === 'subject-wise' ? "bg-white/20 text-white" : "bg-purple-100 text-purple-700"
          )}>
            {subjectWiseData.length}
          </span>
        </Button>
        <Button
          variant={activeTab === 'issuances' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('issuances')}
          className="flex items-center gap-2"
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Issuances</span>
          <span className={cn(
            "ml-1 px-2 py-0.5 text-xs rounded-full",
            activeTab === 'issuances' ? "bg-white/20 text-white" : "bg-amber-100 text-amber-700"
          )}>
            {issuedBooks}
          </span>
        </Button>
        <Button
          variant={activeTab === 'student-tracking' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('student-tracking')}
          className="flex items-center gap-2"
        >
          <Users className="w-4 h-4" />
          <span>Student Tracking</span>
          <span className={cn(
            "ml-1 px-2 py-0.5 text-xs rounded-full",
            activeTab === 'student-tracking' ? "bg-white/20 text-white" : "bg-cyan-100 text-cyan-700"
          )}>
            {DEMO_STUDENTS.length}
          </span>
        </Button>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            {activeTab === 'all-books' && <><BookOpen className="w-5 h-5 text-gray-600" />All Books</>}
            {activeTab === 'available' && <><CheckCircle className="w-5 h-5 text-green-500" />Available Books</>}
            {activeTab === 'class-wise' && <><Layers className="w-5 h-5 text-purple-500" />Class-wise Book Distribution</>}
            {activeTab === 'subject-wise' && <><BookMarked className="w-5 h-5 text-indigo-500" />Subject-wise Book Distribution</>}
            {activeTab === 'issuances' && <><ArrowLeftRight className="w-5 h-5 text-amber-500" />Book Issuances</>}
            {activeTab === 'student-tracking' && <><Users className="w-5 h-5 text-cyan-500" />Student Book Distribution Tracking</>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search & Filters - Hide for class-wise and subject-wise tabs */}
          {activeTab !== 'class-wise' && activeTab !== 'subject-wise' && (
            <div className="flex flex-col lg:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-6 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={activeTab === 'issuances' 
                    ? "Search by student name, ID, book title, or class..." 
                    : activeTab === 'student-tracking'
                    ? "Search by student name or ID..."
                    : "Search by title, author, ISBN, subject, or class..."
                  }
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
              <div className="flex items-center gap-4">
                <Select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className=" bg-white"
                  options={[
                    { label: 'All Classes', value: '' },
                    ...DEMO_CLASSES.map((cls) => ({ label: cls.name, value: cls.id })),
                  ]}
                />
             
                {(searchTerm || classFilter || statusFilter) && (
                  <Button 
                    variant="ghost" 
                    size="md"
                    onClick={clearAllFilters} 
                    className=" bg-red-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Results Count */}
          {activeTab !== 'class-wise' && (searchTerm || classFilter || statusFilter) && (
            <div className="mb-4 text-sm text-gray-600">
              Found <span className="font-semibold text-gray-900">{currentData.length}</span> results
              {searchTerm && <span> for &quot;{searchTerm}&quot;</span>}
            </div>
          )}

          {/* All Books / Available Books Table */}
          {(activeTab === 'all-books' || activeTab === 'available') && (
            (activeTab === 'all-books' ? filteredBooks : availableBooksList).length === 0 ? (
              <EmptyState
                icon={<BookOpen className="w-12 h-12" />}
                title="No books found"
                description={searchTerm || classFilter ? "Try adjusting your search or filters" : "No books available"}
              />
            ) : (
              <>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">Book Title</TableHead>
                        <TableHead className="font-semibold">Subject</TableHead>
                        <TableHead className="hidden md:table-cell font-semibold">Class</TableHead>
                        <TableHead className="hidden sm:table-cell font-semibold">ISBN</TableHead>
                        <TableHead className="font-semibold">Stock</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(paginatedData as Book[]).map((book) => {
                        const cls = book.classId ? getClassById(book.classId) : null;
                        return (
                          <TableRow key={book.id} className="hover:bg-gray-50 transition-colors">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                  <BookMarked className="w-5 h-5 text-gray-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{book.title}</p>
                                  <p className="text-sm text-gray-500">{book.author}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="default">{book.subject || 'General'}</Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {cls ? (
                                <span className="text-sm font-medium text-gray-700">{cls.name}</span>
                              ) : (
                                <span className="text-sm text-gray-400">All Classes</span>
                              )}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded">{book.isbn}</code>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  "font-semibold",
                                  book.availableCopies === 0 ? "text-red-600" : 
                                  book.availableCopies < 10 ? "text-amber-600" : "text-green-600"
                                )}>
                                  {book.availableCopies}
                                </span>
                                <span className="text-gray-400">/</span>
                                <span className="text-gray-600">{book.totalCopies}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant={book.availableCopies > 0 ? "primary" : "outline"}
                                onClick={() => handleIssueBook(book)}
                                disabled={book.availableCopies === 0}
                              >
                                {book.availableCopies > 0 ? 'Issue' : 'Out of Stock'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                {totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )
          )}

          {/* Class-wise View */}
          {activeTab === 'class-wise' && (
            <div className="space-y-6">
              {/* Class Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classWiseData.map(({ class: cls, books, totalCopies, availableCopies, issuedCount }) => (
                  <Card 
                    key={cls.id} 
                    className={cn(
                      "cursor-pointer hover:shadow-lg transition-all duration-200 border-2",
                      selectedClassForDetail === cls.id ? "border-gray-800 bg-gray-50" : "hover:border-gray-400"
                    )}
                    onClick={() => setSelectedClassForDetail(selectedClassForDetail === cls.id ? null : cls.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{cls.name.split(' ')[1] || cls.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{cls.name}</p>
                            <p className="text-xs text-gray-500">{books.length} book titles</p>
                          </div>
                        </div>
                        <Eye className={cn(
                          "w-5 h-5 transition-colors",
                          selectedClassForDetail === cls.id ? "text-gray-800" : "text-gray-400"
                        )} />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-lg font-bold text-gray-800">{totalCopies}</p>
                          <p className="text-xs text-gray-500">Total</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-2">
                          <p className="text-lg font-bold text-green-600">{availableCopies}</p>
                          <p className="text-xs text-gray-500">Available</p>
                        </div>
                        <div className="bg-amber-50 rounded-lg p-2">
                          <p className="text-lg font-bold text-amber-600">{issuedCount}</p>
                          <p className="text-xs text-gray-500">Issued</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Selected Class Detail */}
              {selectedClassForDetail && (() => {
                const selectedData = classWiseData.find(d => d.class.id === selectedClassForDetail);
                if (!selectedData) return null;

                return (
                  <Card className="border-gray-200 bg-gray-50/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookMarked className="w-5 h-5 text-gray-600" />
                        {selectedData.class.name} - Book List
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead>Book Title</TableHead>
                              <TableHead>Subject</TableHead>
                              <TableHead>Available / Total</TableHead>
                              <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedData.books.map(book => (
                              <TableRow key={book.id}>
                                <TableCell>
                                  <p className="font-medium">{book.title}</p>
                                  <p className="text-sm text-gray-500">{book.author}</p>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="default">{book.subject}</Badge>
                                </TableCell>
                                <TableCell>
                                  <span className={cn(
                                    "font-semibold",
                                    book.availableCopies === 0 ? "text-red-600" : "text-green-600"
                                  )}>
                                    {book.availableCopies} / {book.totalCopies}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleIssueBook(book)}
                                    disabled={book.availableCopies === 0}
                                  >
                                    Issue
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}

              {/* Section-wise Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    Section-wise Book Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>Class</TableHead>
                          <TableHead>Section</TableHead>
                          <TableHead>Students</TableHead>
                          <TableHead>Books Issued</TableHead>
                          <TableHead>Avg per Student</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sectionWiseData.map((section, idx) => (
                          <TableRow key={idx} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{section.className}</TableCell>
                            <TableCell>
                              <Badge variant="default">Section {section.section}</Badge>
                            </TableCell>
                            <TableCell>{section.studentCount}</TableCell>
                            <TableCell>
                              <span className={cn(
                                "font-semibold",
                                section.booksIssued > 0 ? "text-amber-600" : "text-gray-400"
                              )}>
                                {section.booksIssued}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-gray-600">
                                {section.studentCount > 0 
                                  ? (section.booksIssued / section.studentCount).toFixed(1) 
                                  : '0'}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Subject-wise View */}
          {activeTab === 'subject-wise' && (
            <div className="space-y-6">
              {/* Subject Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjectWiseData.map(({ subject, books, totalCopies, availableCopies, issuedCount, classCount }) => (
                  <Card 
                    key={subject} 
                    className={cn(
                      "cursor-pointer hover:shadow-lg transition-all duration-200 border-2",
                      selectedSubjectForDetail === subject ? "border-indigo-500 bg-indigo-50" : "hover:border-indigo-300"
                    )}
                    onClick={() => setSelectedSubjectForDetail(selectedSubjectForDetail === subject ? null : subject)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <BookMarked className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{subject}</p>
                            <p className="text-xs text-gray-500">{books.length} titles • {classCount} classes</p>
                          </div>
                        </div>
                        <Eye className={cn(
                          "w-5 h-5 transition-colors",
                          selectedSubjectForDetail === subject ? "text-indigo-500" : "text-gray-400"
                        )} />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-indigo-50 rounded-lg p-2">
                          <p className="text-lg font-bold text-indigo-600">{totalCopies}</p>
                          <p className="text-xs text-gray-500">Total</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-2">
                          <p className="text-lg font-bold text-green-600">{availableCopies}</p>
                          <p className="text-xs text-gray-500">Available</p>
                        </div>
                        <div className="bg-amber-50 rounded-lg p-2">
                          <p className="text-lg font-bold text-amber-600">{issuedCount}</p>
                          <p className="text-xs text-gray-500">Issued</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Selected Subject Detail */}
              {selectedSubjectForDetail && (() => {
                const selectedData = subjectWiseData.find(d => d.subject === selectedSubjectForDetail);
                if (!selectedData) return null;

                return (
                  <Card className="border-indigo-200 bg-indigo-50/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookMarked className="w-5 h-5 text-indigo-500" />
                        {selectedData.subject} - Book List
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead>Book Title</TableHead>
                              <TableHead>Author</TableHead>
                              <TableHead>Class</TableHead>
                              <TableHead>Available / Total</TableHead>
                              <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedData.books.map(book => {
                              const cls = book.classId ? getClassById(book.classId) : null;
                              return (
                                <TableRow key={book.id}>
                                  <TableCell>
                                    <p className="font-medium">{book.title}</p>
                                    <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>
                                  </TableCell>
                                  <TableCell className="text-gray-600">{book.author}</TableCell>
                                  <TableCell>
                                    {cls ? (
                                      <Badge variant="default">{cls.name}</Badge>
                                    ) : (
                                      <span className="text-gray-400">-</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <span className={cn(
                                      "font-semibold",
                                      book.availableCopies === 0 ? "text-red-600" : "text-green-600"
                                    )}>
                                      {book.availableCopies} / {book.totalCopies}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleIssueBook(book)}
                                      disabled={book.availableCopies === 0}
                                    >
                                      Issue
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}

              {/* Subject Summary Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-500" />
                    Subject Distribution Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>Subject</TableHead>
                          <TableHead>Book Titles</TableHead>
                          <TableHead>Total Copies</TableHead>
                          <TableHead>Available</TableHead>
                          <TableHead>Issued</TableHead>
                          <TableHead>Usage Rate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subjectWiseData.map((subjectData) => {
                          const usageRate = subjectData.totalCopies > 0 
                            ? ((subjectData.issuedCount / subjectData.totalCopies) * 100).toFixed(0)
                            : '0';
                          return (
                            <TableRow key={subjectData.subject} className="hover:bg-gray-50">
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded bg-indigo-100 flex items-center justify-center">
                                    <BookMarked className="w-4 h-4 text-indigo-600" />
                                  </div>
                                  <span className="font-medium">{subjectData.subject}</span>
                                </div>
                              </TableCell>
                              <TableCell>{subjectData.books.length}</TableCell>
                              <TableCell className="font-semibold">{subjectData.totalCopies}</TableCell>
                              <TableCell>
                                <span className="text-green-600 font-semibold">{subjectData.availableCopies}</span>
                              </TableCell>
                              <TableCell>
                                <span className="text-amber-600 font-semibold">{subjectData.issuedCount}</span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className={cn(
                                        "h-2 rounded-full",
                                        Number(usageRate) > 70 ? "bg-red-500" :
                                        Number(usageRate) > 40 ? "bg-amber-500" : "bg-green-500"
                                      )}
                                      style={{ width: `${usageRate}%` }}
                                    />
                                  </div>
                                  <span className="text-sm text-gray-600">{usageRate}%</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Issuances Table */}
          {activeTab === 'issuances' && (
            filteredIssuances.length === 0 ? (
              <EmptyState
                icon={<ArrowLeftRight className="w-12 h-12" />}
                title="No issuance records found"
                description={searchTerm || classFilter || statusFilter 
                  ? "Try adjusting your search or filters" 
                  : "No books have been issued yet"
                }
              />
            ) : (
              <>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">Student</TableHead>
                        <TableHead className="font-semibold">Book</TableHead>
                        <TableHead className="hidden md:table-cell font-semibold">Issued</TableHead>
                        <TableHead className="hidden sm:table-cell font-semibold">Due Date</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(paginatedData as BookIssuance[]).map((issuance) => {
                        const student = getStudentById(issuance.studentId);
                        const book = getBookById(issuance.bookId);
                        const cls = student ? getClassById(student.classId) : null;
                        const isOverdue = issuance.status === IssuanceStatus.ISSUED && 
                          new Date(issuance.dueDate) < new Date();
                        
                        return (
                          <TableRow key={issuance.id} className="hover:bg-gray-50 transition-colors">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <Avatar
                                    alt={`${student?.firstName} ${student?.lastName}`}
                                    size="sm"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {student?.firstName} {student?.lastName}
                                  </p>
                                  <p className="text-xs text-gray-500">{cls?.name} • {student?.studentId}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="font-medium text-gray-900">{book?.title}</p>
                              <p className="text-xs text-gray-500">{book?.subject}</p>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-sm text-gray-600">
                              {formatDate(issuance.issuedDate)}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <span className={cn(
                                "text-sm flex items-center gap-1",
                                isOverdue && "text-red-600 font-medium"
                              )}>
                                {formatDate(issuance.dueDate)}
                                {isOverdue && <AlertTriangle className="w-4 h-4" />}
                              </span>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(issuance.status)}
                            </TableCell>
                            <TableCell className="text-right">
                              {issuance.status === IssuanceStatus.ISSUED && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReturnBook(issuance)}
                                >
                                  Return
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                {totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )
          )}

          {/* Student Tracking View */}
          {activeTab === 'student-tracking' && (
            <div className="space-y-6">
              {/* Tracking Filter Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-gray-600">Filter:</span>
                <Button
                  size="sm"
                  variant={trackingFilter === 'all' ? 'primary' : 'outline'}
                  onClick={() => setTrackingFilter('all')}
                >
                  All Students
                </Button>
                <Button
                  size="sm"
                  variant={trackingFilter === 'received' ? 'primary' : 'outline'}
                  onClick={() => setTrackingFilter('received')}
                  className={trackingFilter === 'received' ? '' : 'text-green-600 border-green-300 hover:bg-green-50'}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Received Books
                </Button>
                <Button
                  size="sm"
                  variant={trackingFilter === 'not-received' ? 'primary' : 'outline'}
                  onClick={() => setTrackingFilter('not-received')}
                  className={trackingFilter === 'not-received' ? '' : 'text-red-600 border-red-300 hover:bg-red-50'}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Not Received
                </Button>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                  <p className="text-3xl font-bold text-gray-800">
                    {studentTrackingData.reduce((sum, d) => sum + d.students.length, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Students</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                  <p className="text-3xl font-bold text-green-700">
                    {studentTrackingData.reduce((sum, d) => sum + d.receivedCount, 0)}
                  </p>
                  <p className="text-sm text-green-600">Received Books</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-center">
                  <p className="text-3xl font-bold text-red-700">
                    {studentTrackingData.reduce((sum, d) => sum + d.notReceivedCount, 0)}
                  </p>
                  <p className="text-sm text-red-600">Not Received</p>
                </div>
              </div>

              {/* Class-wise Student Tracking */}
              {filteredStudentTracking.map(classData => {
                const filteredStudents = classData.students.filter(s => {
                  if (trackingFilter === 'received') return s.hasBooks;
                  if (trackingFilter === 'not-received') return !s.hasBooks;
                  return true;
                });

                if (filteredStudents.length === 0) return null;

                return (
                  <Card key={classData.class.id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50 py-3">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {classData.class.name.split(' ')[1] || classData.class.name.charAt(0)}
                            </span>
                          </div>
                          <span>{classData.class.name}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            {classData.receivedCount} received
                          </span>
                          <span className="flex items-center gap-1 text-red-600">
                            <XCircle className="w-4 h-4" />
                            {classData.notReceivedCount} pending
                          </span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50/50">
                            <TableHead>Student</TableHead>
                            <TableHead>Student ID</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-center">Books Count</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredStudents.map(({ student, hasBooks, booksCount, booksList }) => (
                            <TableRow 
                              key={student.id} 
                              className={cn(
                                "hover:bg-gray-50 transition-colors",
                                !hasBooks && "bg-red-50/30"
                              )}
                            >
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar
                                    alt={`${student.firstName} ${student.lastName}`}
                                    size="sm"
                                  />
                                  <span className="font-medium">
                                    {student.firstName} {student.lastName}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {student.studentId}
                                </code>
                              </TableCell>
                              <TableCell className="text-center">
                                {hasBooks ? (
                                  <Badge variant="success" className="gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Received
                                  </Badge>
                                ) : (
                                  <Badge variant="danger" className="gap-1">
                                    <XCircle className="w-3 h-3" />
                                    Not Received
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                <span className={cn(
                                  "font-semibold",
                                  booksCount > 0 ? "text-green-600" : "text-gray-400"
                                )}>
                                  {booksCount} {booksCount === 1 ? 'book' : 'books'}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                {hasBooks ? (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setSelectedStudentForBooks({ student, booksList })}
                                    className="text-gray-600 hover:text-black"
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    View Books
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedStudent(student);
                                      setIsIssueModalOpen(true);
                                    }}
                                    className="text-green-600 border-green-300 hover:bg-green-50"
                                  >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Issue Book
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                );
              })}

              {filteredStudentTracking.length === 0 && (
                <EmptyState
                  icon={<Users className="w-12 h-12" />}
                  title="No students found"
                  description="Try adjusting your search or class filter"
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Books Detail Modal */}
      <Modal
        isOpen={!!selectedStudentForBooks}
        onClose={() => setSelectedStudentForBooks(null)}
        title="Issued Books"
        size="md"
      >
        {selectedStudentForBooks && (
          <div className="space-y-4">
            {/* Student Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Avatar
                alt={`${selectedStudentForBooks.student.firstName} ${selectedStudentForBooks.student.lastName}`}
                size="lg"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedStudentForBooks.student.firstName} {selectedStudentForBooks.student.lastName}
                </h3>
                <p className="text-sm text-gray-500">{selectedStudentForBooks.student.studentId}</p>
                <Badge variant="info" className="mt-1">
                  {getClassById(selectedStudentForBooks.student.classId)?.name}
                </Badge>
              </div>
            </div>

            {/* Books List */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">
                Books Received ({selectedStudentForBooks.booksList.length})
              </h4>
              {selectedStudentForBooks.booksList.map(({ book, issuedDate }, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <BookMarked className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{book.title}</p>
                      <p className="text-sm text-gray-500">{book.subject} • {book.author}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Issued on</p>
                    <p className="text-sm font-medium text-gray-700">{formatDate(issuedDate)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Issue Book Modal */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => {
          setIsIssueModalOpen(false);
          setSelectedBook(null);
          setSelectedStudent(null);
        }}
        title="Issue Book to Student"
        size="md"
      >
        <div className="space-y-4">
          {selectedBook && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                  <BookMarked className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedBook.title}</p>
                  <p className="text-sm text-gray-600">by {selectedBook.author}</p>
                  <p className="text-sm text-green-600 mt-1">
                    {selectedBook.availableCopies} copies available
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Book
            </label>
            <Select
              value={selectedBook?.id || ''}
              onChange={(e) => setSelectedBook(DEMO_BOOKS.find(b => b.id === e.target.value) || null)}
              placeholder="Choose a book..."
              options={DEMO_BOOKS.filter(b => b.availableCopies > 0).map((book) => {
                const cls = book.classId ? getClassById(book.classId) : null;
                return {
                  label: `${book.title} - ${cls?.name || 'All Classes'} (${book.availableCopies} available)`,
                  value: book.id,
                };
              })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Student
            </label>
            <Select
              value={selectedStudent?.id || ''}
              onChange={(e) => setSelectedStudent(DEMO_STUDENTS.find(s => s.id === e.target.value) || null)}
              placeholder="Choose a student..."
              options={DEMO_STUDENTS.map((student) => {
                const cls = getClassById(student.classId);
                return {
                  label: `${student.firstName} ${student.lastName} - ${cls?.name} (${cls?.section || 'A'})`,
                  value: student.id,
                };
              })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <Input type="date" defaultValue={
              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            } />
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => {
              setIsIssueModalOpen(false);
              setSelectedBook(null);
              setSelectedStudent(null);
            }}>
              Cancel
            </Button>
            <Button disabled={!selectedBook || !selectedStudent}>
              <BookOpen className="w-4 h-4 mr-2" />
              Issue Book
            </Button>
          </div>
        </div>
      </Modal>

      {/* Return Book Modal */}
      <Modal
        isOpen={isReturnModalOpen}
        onClose={() => {
          setIsReturnModalOpen(false);
          setSelectedIssuance(null);
        }}
        title="Return Book"
        size="sm"
      >
        <div className="space-y-4">
          {selectedIssuance && (() => {
            const book = getBookById(selectedIssuance.bookId);
            const student = getStudentById(selectedIssuance.studentId);
            const isOverdue = new Date(selectedIssuance.dueDate) < new Date();
            
            return (
              <>
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <p className="font-semibold text-gray-900">{book?.title}</p>
                  <p className="text-sm text-gray-600">
                    Student: {student?.firstName} {student?.lastName}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-gray-500">Due:</span>
                    <span className={cn("text-sm font-medium", isOverdue && "text-red-600")}>
                      {formatDate(selectedIssuance.dueDate)}
                    </span>
                    {isOverdue && (
                      <Badge variant="danger">Overdue</Badge>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Condition
                  </label>
                  <Select
                    options={[
                      { label: 'Good Condition', value: 'good' },
                      { label: 'Damaged', value: 'damaged' },
                      { label: 'Lost (Fine Applied)', value: 'lost' },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks (Optional)
                  </label>
                  <Input placeholder="Any notes about the return..." />
                </div>
              </>
            );
          })()}

          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => {
              setIsReturnModalOpen(false);
              setSelectedIssuance(null);
            }}>
              Cancel
            </Button>
            <Button>
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirm Return
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
