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
  Avatar,
  EmptyState,
} from '@/components/ui';
import {
  DEMO_STUDENTS,
  DEMO_CLASSES,
  DEMO_TEACHERS,
  DEMO_BOOK_ISSUANCES,
  DEMO_ID_CARDS,
  DEMO_BOOKS,
  getClassById,
  getBookById,
} from '@/lib/demo-data';
import { useAuthStore } from '@/lib/store';
import { formatDate, cn } from '@/lib/utils';
import { 
  Student, 
  Teacher, 
  Class, 
  BookIssuance, 
  IDCard, 
  IssuanceStatus, 
  IDCardStatus,
  UserRole 
} from '@/lib/types';
import {
  BookOpen,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Users,
  Search,
  BookMarked,
  UserCheck,
  UserX,
} from 'lucide-react';

type TabType = 'overview' | 'books' | 'id-cards';

export default function StudentResourcesPage() {
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = React.useState<TabType>('overview');
  const [searchQuery, setSearchQuery] = React.useState('');

  // Get teacher profile and their class
  const myTeacherProfile = DEMO_TEACHERS.find((t: Teacher) => t.userId === user?.id);
  const myClasses = myTeacherProfile 
    ? DEMO_CLASSES.filter((c: Class) => c.classTeacherId === myTeacherProfile.id) 
    : [];
  const myClassIds = new Set(myClasses.map((c: Class) => c.id));

  // Get students from teacher's class section
  const myStudents = DEMO_STUDENTS.filter((s: Student) => myClassIds.has(s.classId));

  // Filter students based on search
  const filteredStudents = myStudents.filter((student: Student) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      !searchQuery ||
      student.firstName.toLowerCase().includes(searchLower) ||
      student.lastName.toLowerCase().includes(searchLower) ||
      student.studentId.toLowerCase().includes(searchLower) ||
      String(student.rollNumber).includes(searchQuery)
    );
  });

  // Get student resources data
  const getStudentBooks = (studentId: string): BookIssuance[] => {
    return DEMO_BOOK_ISSUANCES.filter(
      (i: BookIssuance) => i.studentId === studentId && i.status === IssuanceStatus.ISSUED
    );
  };

  const getStudentIDCard = (studentId: string): IDCard | undefined => {
    return DEMO_ID_CARDS.find(
      (c: IDCard) => c.studentId === studentId && c.status === IDCardStatus.ACTIVE
    );
  };

  // Calculate statistics
  const stats = React.useMemo(() => {
    const totalStudents = myStudents.length;
    const studentsWithBooks = myStudents.filter(
      (s: Student) => getStudentBooks(s.id).length > 0
    ).length;
    const studentsWithIDCards = myStudents.filter(
      (s: Student) => getStudentIDCard(s.id) !== undefined
    ).length;
    const totalBooksIssued = myStudents.reduce(
      (sum, s: Student) => sum + getStudentBooks(s.id).length, 
      0
    );

    return {
      totalStudents,
      studentsWithBooks,
      studentsWithoutBooks: totalStudents - studentsWithBooks,
      studentsWithIDCards,
      studentsWithoutIDCards: totalStudents - studentsWithIDCards,
      totalBooksIssued,
    };
  }, [myStudents]);

  const getBookStatusBadge = (status: IssuanceStatus) => {
    switch (status) {
      case IssuanceStatus.ISSUED:
        return <Badge variant="info">Issued</Badge>;
      case IssuanceStatus.RETURNED:
        return <Badge variant="success">Returned</Badge>;
      case IssuanceStatus.LOST:
        return <Badge variant="danger">Lost</Badge>;
      case IssuanceStatus.DAMAGED:
        return <Badge variant="warning">Damaged</Badge>;
      case IssuanceStatus.PENDING:
        return <Badge variant="default">Pending</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getIDCardStatusBadge = (status: IDCardStatus) => {
    switch (status) {
      case IDCardStatus.ACTIVE:
        return <Badge variant="success">Active</Badge>;
      case IDCardStatus.EXPIRED:
        return <Badge variant="warning">Expired</Badge>;
      case IDCardStatus.LOST:
        return <Badge variant="danger">Lost</Badge>;
      case IDCardStatus.PENDING:
        return <Badge variant="info">Pending</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  // Tab content
  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <Users className="w-4 h-4" /> },
    { key: 'books', label: 'Books', icon: <BookOpen className="w-4 h-4" /> },
    { key: 'id-cards', label: 'ID Cards', icon: <CreditCard className="w-4 h-4" /> },
  ];

  const classNames = myClasses.map((c: Class) => `${c.name}${c.section ? ` (${c.section})` : ''}`).join(', ');

  if (myClasses.length === 0) {
    return (
      <DashboardLayout>
        <PageHeader
          title="Student Resources"
          description="View books and ID cards issued to students in your section"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Student Resources' },
          ]}
        />
        <Card>
          <CardContent className="p-8">
            <EmptyState
              icon={<Users className="w-12 h-12" />}
              title="No Class Assigned"
              description="You are not assigned as a class teacher to any section. Contact the administrator to get assigned."
            />
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Student Resources"
        description={`View books and ID cards for students in ${classNames}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Student Resources' },
        ]}
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg shrink-0">
                <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-lg md:text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                <p className="text-xs md:text-sm text-gray-500 truncate">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-green-100 rounded-lg shrink-0">
                <BookMarked className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="text-lg md:text-2xl font-bold text-green-600">{stats.studentsWithBooks}</p>
                <p className="text-xs md:text-sm text-gray-500 truncate">With Books</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-purple-100 rounded-lg shrink-0">
                <UserCheck className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
              </div>
              <div className="min-w-0">
                <p className="text-lg md:text-2xl font-bold text-purple-600">{stats.studentsWithIDCards}</p>
                <p className="text-xs md:text-sm text-gray-500 truncate">With ID Cards</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-orange-100 rounded-lg shrink-0">
                <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
              </div>
              <div className="min-w-0">
                <p className="text-lg md:text-2xl font-bold text-orange-600">{stats.totalBooksIssued}</p>
                <p className="text-xs md:text-sm text-gray-500 truncate">Books Issued</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 sm:gap-2 mb-6 border-b border-gray-200 overflow-x-auto hide-scrollbar-mobile">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap',
              activeTab === tab.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, student ID, or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'block w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2.5',
                'text-gray-900 placeholder:text-gray-400',
                'focus:outline-none focus:ring-2 focus:ring-blue-500'
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Student Resources Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredStudents.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Roll</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead className="text-center">Books Issued</TableHead>
                    <TableHead className="text-center">ID Card</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student: Student) => {
                    const books = getStudentBooks(student.id);
                    const idCard = getStudentIDCard(student.id);
                    return (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.rollNumber}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={student.avatar}
                              alt={`${student.firstName} ${student.lastName}`}
                              size="sm"
                            />
                            <div>
                              <span className="font-medium block">
                                {student.firstName} {student.lastName}
                              </span>
                              <span className="text-xs text-gray-500">{student.studentId}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {books.length > 0 ? (
                            <Badge variant="success" className="inline-flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {books.length} book{books.length > 1 ? 's' : ''}
                            </Badge>
                          ) : (
                            <Badge variant="default" className="inline-flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              None
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {idCard ? (
                            <Badge variant="success" className="inline-flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Issued
                            </Badge>
                          ) : (
                            <Badge variant="danger" className="inline-flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              Not Issued
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No students found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Books Tab */}
      {activeTab === 'books' && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-700">{stats.studentsWithBooks}</p>
                  <p className="text-sm text-green-600">Students with Books</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4 flex items-center gap-3">
                <XCircle className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-700">{stats.studentsWithoutBooks}</p>
                  <p className="text-sm text-red-600">Students without Books</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-700">{stats.totalBooksIssued}</p>
                  <p className="text-sm text-blue-600">Total Books Issued</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Books Issued to Students
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredStudents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Roll</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Books Issued</TableHead>
                      <TableHead>Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student: Student) => {
                      const books = getStudentBooks(student.id);
                      return (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.rollNumber}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar
                                src={student.avatar}
                                alt={`${student.firstName} ${student.lastName}`}
                                size="sm"
                              />
                              <div>
                                <span className="font-medium block">
                                  {student.firstName} {student.lastName}
                                </span>
                                <span className="text-xs text-gray-500">{student.studentId}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {books.length > 0 ? (
                              <div className="space-y-1">
                                {books.map((issuance: BookIssuance) => {
                                  const book = getBookById(issuance.bookId);
                                  return (
                                    <div key={issuance.id} className="flex items-center gap-2">
                                      <BookMarked className="w-3 h-3 text-blue-500" />
                                      <span className="text-sm">{book?.title || 'Unknown Book'}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">No books issued</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {books.length > 0 ? (
                              <div className="space-y-1">
                                {books.map((issuance: BookIssuance) => {
                                  const isOverdue = new Date(issuance.dueDate) < new Date();
                                  return (
                                    <div 
                                      key={issuance.id} 
                                      className={cn(
                                        'text-sm',
                                        isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'
                                      )}
                                    >
                                      {formatDate(new Date(issuance.dueDate), 'dd MMM yyyy')}
                                      {isOverdue && (
                                        <AlertTriangle className="w-3 h-3 inline ml-1" />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No students found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ID Cards Tab */}
      {activeTab === 'id-cards' && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 flex items-center gap-3">
                <UserCheck className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-700">{stats.studentsWithIDCards}</p>
                  <p className="text-sm text-green-600">Students with ID Cards</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4 flex items-center gap-3">
                <UserX className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-700">{stats.studentsWithoutIDCards}</p>
                  <p className="text-sm text-red-600">Students without ID Cards</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                ID Card Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredStudents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Roll</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Card Number</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student: Student) => {
                      const idCard = getStudentIDCard(student.id);
                      return (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.rollNumber}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar
                                src={student.avatar}
                                alt={`${student.firstName} ${student.lastName}`}
                                size="sm"
                              />
                              <div>
                                <span className="font-medium block">
                                  {student.firstName} {student.lastName}
                                </span>
                                <span className="text-xs text-gray-500">{student.studentId}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {idCard ? (
                              <span className="font-mono text-sm">{idCard.cardNumber}</span>
                            ) : (
                              <span className="text-gray-400 text-sm">Not issued</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {idCard ? (
                              <span className="text-sm text-gray-600">
                                {formatDate(new Date(idCard.issuedDate), 'dd MMM yyyy')}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {idCard ? (
                              <span className={cn(
                                'text-sm',
                                new Date(idCard.expiryDate) < new Date() 
                                  ? 'text-red-600 font-medium' 
                                  : 'text-gray-600'
                              )}>
                                {formatDate(new Date(idCard.expiryDate), 'dd MMM yyyy')}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {idCard ? (
                              getIDCardStatusBadge(idCard.status)
                            ) : (
                              <Badge variant="danger" className="inline-flex items-center gap-1">
                                <XCircle className="w-3 h-3" />
                                Not Issued
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No students found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
