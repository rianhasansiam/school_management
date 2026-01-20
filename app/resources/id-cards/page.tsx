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
  DEMO_ID_CARDS,
  DEMO_STUDENTS,
  DEMO_CLASSES,
  getStudentById,
  getClassById,
} from '@/lib/demo-data';
import { formatDate, cn } from '@/lib/utils';
import { IDCard, IDCardStatus, Student } from '@/lib/types';
import { useDebounce } from '@/hooks/useCommon';
import {
  Plus,
  Search,
  CreditCard,
  Eye,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  Printer,
  Users,
  UserX,
  UserCheck,
} from 'lucide-react';

const ITEMS_PER_PAGE = 8;

export default function IDCardsPage() {
  const [activeTab, setActiveTab] = React.useState<'with-cards' | 'without-cards'>('with-cards');
  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [statusFilter, setStatusFilter] = React.useState('');
  const [classFilter, setClassFilter] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  
  const [isIssueModalOpen, setIsIssueModalOpen] = React.useState(false);
  const [isReplaceModalOpen, setIsReplaceModalOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState<IDCard | null>(null);
  const [viewCard, setViewCard] = React.useState<IDCard | null>(null);
  const [selectedStudentForIssue, setSelectedStudentForIssue] = React.useState<Student | null>(null);

  // Get students with and without active ID cards
  const studentsWithCards = React.useMemo(() => {
    return DEMO_STUDENTS.filter(student => {
      const activeCard = DEMO_ID_CARDS.find(
        c => c.studentId === student.id && c.status === IDCardStatus.ACTIVE
      );
      return !!activeCard;
    }).map(student => {
      const card = DEMO_ID_CARDS.find(
        c => c.studentId === student.id && c.status === IDCardStatus.ACTIVE
      );
      return { student, card: card! };
    });
  }, []);

  const studentsWithoutCards = React.useMemo(() => {
    return DEMO_STUDENTS.filter(student => {
      const activeCard = DEMO_ID_CARDS.find(
        c => c.studentId === student.id && c.status === IDCardStatus.ACTIVE
      );
      return !activeCard;
    });
  }, []);

  // Filter students with cards
  const filteredStudentsWithCards = React.useMemo(() => {
    return studentsWithCards.filter(({ student, card }) => {
      const cls = getClassById(student.classId);
      const searchLower = debouncedSearch.toLowerCase();
      const matchesSearch = !debouncedSearch ||
        card.cardNumber.toLowerCase().includes(searchLower) ||
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchLower) ||
        student.studentId.toLowerCase().includes(searchLower) ||
        cls?.name.toLowerCase().includes(searchLower);
      const matchesStatus = !statusFilter || card.status === statusFilter;
      const matchesClass = !classFilter || student.classId === classFilter;
      return matchesSearch && matchesStatus && matchesClass;
    });
  }, [studentsWithCards, debouncedSearch, statusFilter, classFilter]);

  // Filter students without cards
  const filteredStudentsWithoutCards = React.useMemo(() => {
    return studentsWithoutCards.filter((student) => {
      const cls = getClassById(student.classId);
      const searchLower = debouncedSearch.toLowerCase();
      const matchesSearch = !debouncedSearch ||
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchLower) ||
        student.studentId.toLowerCase().includes(searchLower) ||
        cls?.name.toLowerCase().includes(searchLower);
      const matchesClass = !classFilter || student.classId === classFilter;
      return matchesSearch && matchesClass;
    });
  }, [studentsWithoutCards, debouncedSearch, classFilter]);

  // Pagination
  const currentData = activeTab === 'with-cards' ? filteredStudentsWithCards : filteredStudentsWithoutCards;
  const totalPages = Math.ceil(currentData.length / ITEMS_PER_PAGE);
  const paginatedData = currentData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when switching tabs or filtering
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, debouncedSearch, statusFilter, classFilter]);

  const getStatusBadge = (status: IDCardStatus) => {
    const styles: Record<IDCardStatus, { variant: 'default' | 'success' | 'warning' | 'danger'; label: string }> = {
      [IDCardStatus.ACTIVE]: { variant: 'success', label: 'Active' },
      [IDCardStatus.EXPIRED]: { variant: 'warning', label: 'Expired' },
      [IDCardStatus.LOST]: { variant: 'danger', label: 'Lost' },
      [IDCardStatus.REPLACED]: { variant: 'default', label: 'Replaced' },
      [IDCardStatus.PENDING]: { variant: 'warning', label: 'Pending' },
    };
    return <Badge variant={styles[status].variant}>{styles[status].label}</Badge>;
  };

  const handleReplace = (card: IDCard) => {
    setSelectedCard(card);
    setIsReplaceModalOpen(true);
  };

  const handleIssueToStudent = (student: Student) => {
    setSelectedStudentForIssue(student);
    setIsIssueModalOpen(true);
  };

  // Stats
  const totalStudents = DEMO_STUDENTS.length;
  const activeCards = DEMO_ID_CARDS.filter(c => c.status === IDCardStatus.ACTIVE).length;
  const pendingCards = DEMO_ID_CARDS.filter(c => c.status === IDCardStatus.PENDING).length;
  const lostCards = DEMO_ID_CARDS.filter(c => c.status === IDCardStatus.LOST).length;

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="ID Cards Management"
        description="Track and manage student ID cards issuance"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Resources', href: '/resources' },
          { label: 'ID Cards' },
        ]}
        actions={
          <Button onClick={() => {
            setSelectedStudentForIssue(null);
            setIsIssueModalOpen(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Issue ID Card
          </Button>
        }
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center shadow-lg shadow-gray-500/30">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Total Students</p>
                <p className="text-2xl font-bold text-gray-700">{totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-green-600 uppercase tracking-wide">With ID Card</p>
                <p className="text-2xl font-bold text-green-700">{studentsWithCards.length}</p>
                <p className="text-xs text-green-600">{((studentsWithCards.length / totalStudents) * 100).toFixed(0)}% issued</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30">
                <UserX className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-red-600 uppercase tracking-wide">Without ID Card</p>
                <p className="text-2xl font-bold text-red-700">{studentsWithoutCards.length}</p>
                <p className="text-xs text-red-600">{((studentsWithoutCards.length / totalStudents) * 100).toFixed(0)}% pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-amber-600 uppercase tracking-wide">Lost/Pending</p>
                <p className="text-2xl font-bold text-amber-700">{lostCards + pendingCards}</p>
                <p className="text-xs text-amber-600">{lostCards} lost, {pendingCards} pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">ID Card Issuance Progress</span>
            <span className="text-sm font-bold text-gray-700">
              {studentsWithCards.length} / {totalStudents} Students
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500"
              style={{ width: `${(studentsWithCards.length / totalStudents) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Issued ({studentsWithCards.length})
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-gray-300"></span>
              Not Issued ({studentsWithoutCards.length})
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={activeTab === 'with-cards' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('with-cards')}
          className="flex items-center gap-2"
        >
          <UserCheck className="w-4 h-4" />
          <span>With ID Cards</span>
          <span className={cn(
            "ml-1 px-2 py-0.5 text-xs rounded-full",
            activeTab === 'with-cards' 
              ? "bg-white/20 text-white" 
              : "bg-green-100 text-green-700"
          )}>
            {studentsWithCards.length}
          </span>
        </Button>
        <Button
          variant={activeTab === 'without-cards' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('without-cards')}
          className="flex items-center gap-2"
        >
          <UserX className="w-4 h-4" />
          <span>Without ID Cards</span>
          <span className={cn(
            "ml-1 px-2 py-0.5 text-xs rounded-full",
            activeTab === 'without-cards' 
              ? "bg-white/20 text-white" 
              : "bg-red-100 text-red-700"
          )}>
            {studentsWithoutCards.length}
          </span>
        </Button>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              {activeTab === 'with-cards' ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Students with ID Cards
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Students without ID Cards
                </>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search & Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-6 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={activeTab === 'with-cards' 
                  ? "Search by name, student ID, card number, or class..." 
                  : "Search by name, student ID, or class..."
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
            <div className="flex  gap-3">
              {activeTab === 'with-cards' && (
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-36 bg-white "
                  options={[
                    { label: 'All Status', value: '' },
                    { label: 'Active', value: IDCardStatus.ACTIVE },
                    { label: 'Pending', value: IDCardStatus.PENDING },
                    { label: 'Lost', value: IDCardStatus.LOST },
                    { label: 'Expired', value: IDCardStatus.EXPIRED },
                    { label: 'Replaced', value: IDCardStatus.REPLACED },
                  ]}
                />
              )}
              <Select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="w-full sm:w-40 bg-white"
                options={[
                  { label: 'All Classes', value: '' },
                  ...DEMO_CLASSES.map((cls) => ({ label: cls.name, value: cls.id })),
                ]}
              />
              {(searchTerm || statusFilter || classFilter) && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('');
                    setClassFilter('');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Results Count */}
          {(searchTerm || statusFilter || classFilter) && (
            <div className="mb-4 text-sm text-gray-600">
              Found <span className="font-semibold text-gray-900">{currentData.length}</span> results
              {searchTerm && <span> for &quot;{searchTerm}&quot;</span>}
            </div>
          )}

          {/* Table for Students WITH Cards */}
          {activeTab === 'with-cards' && (
            filteredStudentsWithCards.length === 0 ? (
              <EmptyState
                icon={<CreditCard className="w-12 h-12" />}
                title="No students found"
                description={searchTerm || statusFilter || classFilter 
                  ? "Try adjusting your search or filters" 
                  : "No students have been issued ID cards yet"
                }
              />
            ) : (
              <>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">Student</TableHead>
                        <TableHead className="font-semibold">Card Number</TableHead>
                        <TableHead className="hidden md:table-cell font-semibold">Issued Date</TableHead>
                        <TableHead className="hidden sm:table-cell font-semibold">Expiry Date</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(paginatedData as typeof filteredStudentsWithCards).map(({ student, card }) => {
                        const cls = getClassById(student.classId);
                        const isExpired = new Date(card.expiryDate) < new Date();
                        
                        return (
                          <TableRow key={card.id} className="hover:bg-gray-50 transition-colors">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <Avatar
                                    alt={`${student.firstName} ${student.lastName}`}
                                    size="sm"
                                  />
                                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {student.firstName} {student.lastName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {cls?.name} • {student.studentId}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono text-gray-700">
                                {card.cardNumber}
                              </code>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-sm text-gray-600">
                              {formatDate(card.issuedDate)}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <span className={cn(
                                "text-sm",
                                isExpired && card.status === IDCardStatus.ACTIVE && "text-red-600 font-medium"
                              )}>
                                {formatDate(card.expiryDate)}
                                {isExpired && card.status === IDCardStatus.ACTIVE && (
                                  <span className="ml-1 text-xs">(Expired)</span>
                                )}
                              </span>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(card.status)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setViewCard(card)}
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {card.status === IDCardStatus.ACTIVE && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      title="Print Card"
                                    >
                                      <Printer className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleReplace(card)}
                                      title="Replace Card"
                                    >
                                      <RefreshCw className="w-4 h-4" />
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

          {/* Grid for Students WITHOUT Cards */}
          {activeTab === 'without-cards' && (
            filteredStudentsWithoutCards.length === 0 ? (
              <EmptyState
                icon={<CheckCircle className="w-12 h-12 text-green-500" />}
                title={searchTerm || classFilter ? "No students found" : "All students have ID cards!"}
                description={searchTerm || classFilter 
                  ? "Try adjusting your search or filters" 
                  : "Every student has been issued an ID card"
                }
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {(paginatedData as typeof filteredStudentsWithoutCards).map((student) => {
                    const cls = getClassById(student.classId);
                    return (
                      <Card 
                        key={student.id} 
                        className="group hover:shadow-lg hover:border-gray-400 transition-all duration-200"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="relative">
                              <Avatar 
                                alt={`${student.firstName} ${student.lastName}`} 
                                size="md" 
                              />
                              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center">
                                <X className="w-2.5 h-2.5 text-white" />
                              </span>
                            </div>
                            <Badge variant="danger" className="text-xs">No Card</Badge>
                          </div>
                          <div className="mb-3">
                            <p className="font-semibold text-gray-900">
                              {student.firstName} {student.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{cls?.name}</p>
                            <p className="text-xs text-gray-400 font-mono mt-1">{student.studentId}</p>
                          </div>
                          <Button 
                            size="sm" 
                            className="w-full group-hover:bg-black"
                            onClick={() => handleIssueToStudent(student)}
                          >
                            <CreditCard className="w-4 h-4 mr-2" />
                            Issue ID Card
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                {totalPages > 1 && (
                  <div className="mt-6">
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
        </CardContent>
      </Card>

      {/* Issue ID Card Modal */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => {
          setIsIssueModalOpen(false);
          setSelectedStudentForIssue(null);
        }}
        title="Issue New ID Card"
        size="md"
      >
        <div className="space-y-4">
          {selectedStudentForIssue ? (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <Avatar 
                  alt={`${selectedStudentForIssue.firstName} ${selectedStudentForIssue.lastName}`}
                  size="md"
                />
                <div>
                  <p className="font-semibold text-gray-900">
                    {selectedStudentForIssue.firstName} {selectedStudentForIssue.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {getClassById(selectedStudentForIssue.classId)?.name} • {selectedStudentForIssue.studentId}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Student
              </label>
              <Select
                placeholder="Choose a student..."
                options={studentsWithoutCards.map((student) => {
                  const cls = getClassById(student.classId);
                  return {
                    label: `${student.firstName} ${student.lastName} - ${cls?.name}`,
                    value: student.id,
                  };
                })}
              />
              <p className="text-xs text-gray-500 mt-1">
                Only showing students without active ID cards
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <Input
              placeholder="SMS-2026-XXX"
              defaultValue={`SMS-2026-${String(DEMO_ID_CARDS.length + 1).padStart(3, '0')}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Date
              </label>
              <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <Input type="date" defaultValue="2026-12-31" />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => {
              setIsIssueModalOpen(false);
              setSelectedStudentForIssue(null);
            }}>
              Cancel
            </Button>
            <Button>
              <CreditCard className="w-4 h-4 mr-2" />
              Issue Card
            </Button>
          </div>
        </div>
      </Modal>

      {/* Replace Card Modal */}
      <Modal
        isOpen={isReplaceModalOpen}
        onClose={() => {
          setIsReplaceModalOpen(false);
          setSelectedCard(null);
        }}
        title="Replace ID Card"
        size="sm"
      >
        <div className="space-y-4">
          {selectedCard && (
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>This will mark the current card <strong>{selectedCard.cardNumber}</strong> as replaced and issue a new one.</span>
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Replacement
            </label>
            <Select
              options={[
                { label: 'Lost Card', value: 'lost' },
                { label: 'Damaged Card', value: 'damaged' },
                { label: 'Stolen', value: 'stolen' },
                { label: 'Name Change', value: 'name_change' },
                { label: 'Photo Update', value: 'photo_update' },
                { label: 'Other', value: 'other' },
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <Input placeholder="Any additional details..." />
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Replacement Fee:</strong> ৳50
            </p>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => {
              setIsReplaceModalOpen(false);
              setSelectedCard(null);
            }}>
              Cancel
            </Button>
            <Button>
              <RefreshCw className="w-4 h-4 mr-2" />
              Replace Card
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Card Modal */}
      <Modal
        isOpen={!!viewCard}
        onClose={() => setViewCard(null)}
        title="ID Card Details"
        size="sm"
      >
        {viewCard && (() => {
          const student = getStudentById(viewCard.studentId);
          const cls = student ? getClassById(student.classId) : null;
          
          return (
            <div className="space-y-4">
              {/* Card Preview */}
              <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl p-5 text-white shadow-xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs opacity-75 uppercase tracking-wider">ByteEdu</p>
                    <p className="font-bold text-lg">STUDENT ID CARD</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6" />
                  </div>
                </div>
                
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-24 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center overflow-hidden">
                    <Avatar
                      alt={`${student?.firstName} ${student?.lastName}`}
                      size="lg"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-xl">{student?.firstName} {student?.lastName}</p>
                    <p className="text-sm opacity-80">{cls?.name}</p>
                    <p className="text-xs opacity-70 mt-2 font-mono bg-white/10 px-2 py-1 rounded inline-block">
                      {viewCard.cardNumber}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="opacity-60 uppercase tracking-wide">Issued</p>
                    <p className="font-semibold">{formatDate(viewCard.issuedDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="opacity-60 uppercase tracking-wide">Expires</p>
                    <p className="font-semibold">{formatDate(viewCard.expiryDate)}</p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  {getStatusBadge(viewCard.status)}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Student ID</span>
                  <span className="font-mono text-sm bg-gray-200 px-2 py-0.5 rounded">{student?.studentId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Replacement Count</span>
                  <span className="font-medium">{viewCard.replacementCount}</span>
                </div>
                {viewCard.replacementReason && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Last Replacement</span>
                    <span className="font-medium capitalize">{viewCard.replacementReason.replace('_', ' ')}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setViewCard(null)}>
                  Close
                </Button>
                <Button>
                  <Printer className="w-4 h-4 mr-2" />
                  Print Card
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </DashboardLayout>
  );
}
