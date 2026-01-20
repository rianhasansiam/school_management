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
  Avatar,
  Badge,
  Button,
  Alert,
  EmptyState,
} from '@/components/ui';
import {
  DEMO_STUDENTS,
  DEMO_CLASSES,
  DEMO_TEACHERS,
} from '@/lib/demo-data';
import { formatDate, cn } from '@/lib/utils';
import { AttendanceStatus, Student, Class, Teacher, UserRole } from '@/lib/types';
import { useAuthStore, useIsAdmin } from '@/lib/store';
import {
  CheckCircle,
  XCircle,
  Save,
  Users,
  Calendar,
  UserCheck,
  UserX,
  ClipboardCheck,
  History,
  ChevronLeft,
  ChevronRight,
  Eye,
  Clock,
  BarChart3,
  Search,
} from 'lucide-react';

type StudentAttendanceRecord = {
  studentId: string;
  status: AttendanceStatus;
  remarks?: string;
};

type TabType = 'mark' | 'history';

// Generate mock attendance history for a student
function generateStudentAttendanceHistory(
  studentId: string,
  year: number,
  month: number
): { date: string; status: AttendanceStatus; day: string; remarks?: string }[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const records: { date: string; status: AttendanceStatus; day: string; remarks?: string }[] = [];
  const today = new Date();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    
    // Don't generate for future dates
    if (date > today) break;
    
    const dayOfWeek = date.getDay();

    // Skip weekends (Friday = 5, Saturday = 6)
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      continue;
    }

    // Generate semi-random but consistent attendance based on studentId and date
    const hash = studentId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const combined = (hash + day + month) % 100;

    let status: AttendanceStatus;
    let remarks: string | undefined;
    
    if (combined < 80) {
      status = AttendanceStatus.PRESENT;
    } else if (combined < 90) {
      status = AttendanceStatus.LATE;
      remarks = 'Arrived late';
    } else {
      status = AttendanceStatus.ABSENT;
      remarks = combined % 2 === 0 ? 'Sick leave' : 'Not informed';
    }

    records.push({
      date: date.toISOString().split('T')[0],
      status,
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      remarks,
    });
  }

  return records;
}

export default function StudentAttendancePage() {
  const { user } = useAuthStore();
  const isAdmin = useIsAdmin();
  const isTeacher = user?.role === UserRole.TEACHER;

  // Get the teacher profile for the logged-in user
  const myTeacherProfile = isTeacher
    ? DEMO_TEACHERS.find((t: Teacher) => t.userId === user?.id)
    : null;

  // Get classes where this teacher is the class teacher (only class teachers can mark attendance)
  const myClasses = isTeacher
    ? DEMO_CLASSES.filter((c: Class) => c.classTeacherId === myTeacherProfile?.id)
    : isAdmin
    ? DEMO_CLASSES
    : [];

  // Tab state
  const [activeTab, setActiveTab] = React.useState<TabType>('mark');

  // Mark attendance state
  const [selectedDate, setSelectedDate] = React.useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedClassId, setSelectedClassId] = React.useState<string>(
    myClasses.length > 0 ? myClasses[0].id : ''
  );
  const [attendanceRecords, setAttendanceRecords] = React.useState<StudentAttendanceRecord[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  // History state
  const [historyMonth, setHistoryMonth] = React.useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [historySearchQuery, setHistorySearchQuery] = React.useState('');
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null);

  // Get students for the selected class
  const classStudents = React.useMemo(() => {
    if (!selectedClassId) return [];
    return DEMO_STUDENTS.filter((s: Student) => s.classId === selectedClassId && s.isActive);
  }, [selectedClassId]);

  // Get selected class info
  const selectedClass = DEMO_CLASSES.find((c: Class) => c.id === selectedClassId);

  // Initialize attendance records when class or date changes
  React.useEffect(() => {
    if (classStudents.length > 0) {
      const records = classStudents.map((student: Student) => ({
        studentId: student.id,
        status: AttendanceStatus.PRESENT,
        remarks: '',
      }));
      setAttendanceRecords(records);
    } else {
      setAttendanceRecords([]);
    }
  }, [selectedClassId, selectedDate, classStudents]);

  // Update attendance status
  const updateAttendance = (studentId: string, status: AttendanceStatus) => {
    setAttendanceRecords((prev) =>
      prev.map((record) =>
        record.studentId === studentId ? { ...record, status } : record
      )
    );
  };

  // Get attendance status for a student
  const getAttendanceStatus = (studentId: string): AttendanceStatus => {
    const record = attendanceRecords.find((r) => r.studentId === studentId);
    return record?.status || AttendanceStatus.PRESENT;
  };

  // Calculate stats
  const presentCount = attendanceRecords.filter(
    (r) => r.status === AttendanceStatus.PRESENT
  ).length;
  const absentCount = attendanceRecords.filter(
    (r) => r.status === AttendanceStatus.ABSENT
  ).length;

  // Mark all as present
  const markAllPresent = () => {
    setAttendanceRecords((prev) =>
      prev.map((record) => ({ ...record, status: AttendanceStatus.PRESENT }))
    );
  };

  // Mark all as absent
  const markAllAbsent = () => {
    setAttendanceRecords((prev) =>
      prev.map((record) => ({ ...record, status: AttendanceStatus.ABSENT }))
    );
  };

  // Save attendance
  const saveAttendance = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Check if teacher has classes assigned
  const hasClasses = myClasses.length > 0;

  // History helpers
  const getStudentMonthlyAttendance = (studentId: string) => {
    return generateStudentAttendanceHistory(studentId, historyMonth.year, historyMonth.month);
  };

  const getStudentMonthlyStats = (studentId: string) => {
    const records = getStudentMonthlyAttendance(studentId);
    const total = records.length;
    const present = records.filter((r) => r.status === AttendanceStatus.PRESENT).length;
    const absent = records.filter((r) => r.status === AttendanceStatus.ABSENT).length;
    const late = records.filter((r) => r.status === AttendanceStatus.LATE).length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    return { total, present, absent, late, percentage };
  };

  const filteredHistoryStudents = classStudents.filter((student: Student) => {
    const searchLower = historySearchQuery.toLowerCase();
    return (
      !historySearchQuery ||
      student.firstName.toLowerCase().includes(searchLower) ||
      student.lastName.toLowerCase().includes(searchLower) ||
      student.studentId.toLowerCase().includes(searchLower) ||
      String(student.rollNumber).includes(historySearchQuery)
    );
  });

  const prevMonth = () => {
    setHistoryMonth((prev) => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const nextMonth = () => {
    const now = new Date();
    const currentMonth = { year: now.getFullYear(), month: now.getMonth() };
    
    setHistoryMonth((prev) => {
      if (prev.year === currentMonth.year && prev.month === currentMonth.month) {
        return prev;
      }
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  const monthName = new Date(historyMonth.year, historyMonth.month, 1).toLocaleDateString(
    'en-US',
    { month: 'long', year: 'numeric' }
  );

  const classMonthlyStats = React.useMemo(() => {
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalLate = 0;
    let totalDays = 0;

    classStudents.forEach((student: Student) => {
      const stats = getStudentMonthlyStats(student.id);
      totalPresent += stats.present;
      totalAbsent += stats.absent;
      totalLate += stats.late;
      totalDays += stats.total;
    });

    const avgAttendance = totalDays > 0 ? Math.round((totalPresent / totalDays) * 100) : 0;

    return { totalPresent, totalAbsent, totalLate, totalDays, avgAttendance };
  }, [historyMonth, classStudents]);

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.PRESENT:
        return (
          <Badge variant="success" className="inline-flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Present
          </Badge>
        );
      case AttendanceStatus.ABSENT:
        return (
          <Badge variant="danger" className="inline-flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Absent
          </Badge>
        );
      case AttendanceStatus.LATE:
        return (
          <Badge variant="warning" className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Late
          </Badge>
        );
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getAttendancePercentageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Student Attendance"
        description={
          isTeacher
            ? 'Mark and view attendance for students in your assigned classes'
            : 'Mark and manage student attendance records'
        }
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Student Attendance' },
        ]}
      />

      {/* No Classes Warning for Teachers */}
      {isTeacher && !hasClasses && (
        <Alert type="warning" title="No Classes Assigned" className="mb-6">
          You are not assigned as a class teacher to any class. Please contact the administrator
          to be assigned as a class teacher to mark student attendance.
        </Alert>
      )}

      {/* Success Alert */}
      {showSuccess && (
        <Alert type="success" className="mb-6">
          Attendance for {selectedClass?.name} has been saved successfully!
        </Alert>
      )}

      {hasClasses && (
        <>
          {/* Tabs */}
          <div className="flex gap-1 sm:gap-2 mb-6 border-b border-gray-200 overflow-x-auto hide-scrollbar-mobile">
            <button
              onClick={() => setActiveTab('mark')}
              className={cn(
                'flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap',
                activeTab === 'mark'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              <ClipboardCheck className="w-4 h-4" />
              <span className="hidden xs:inline">Mark</span> Attendance
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={cn(
                'flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap',
                activeTab === 'history'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              <History className="w-4 h-4" />
              <span className="hidden xs:inline">Attendance</span> History
            </button>
          </div>

          {/* Mark Attendance Tab */}
          {activeTab === 'mark' && (
            <>
              {/* Controls */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      {/* Class Selection */}
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Class:</label>
                        <select
                          value={selectedClassId}
                          onChange={(e) => setSelectedClassId(e.target.value)}
                          className="px-3 py-2 border text-black border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
                        >
                          {myClasses.map((cls: Class) => (
                            <option key={cls.id} value={cls.id}>
                              {cls.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Date Selection */}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          max={new Date().toISOString().split('T')[0]}
                          className="px-3 py-2 border text-black border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={markAllPresent}>
                        <UserCheck className="w-4 h-4 mr-1" />
                        All Present
                      </Button>
                      <Button variant="outline" size="sm" onClick={markAllAbsent}>
                        <UserX className="w-4 h-4 mr-1" />
                        All Absent
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <Users className="w-6 h-6 md:w-8 md:h-8 text-blue-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs md:text-sm text-blue-600 truncate">Total Students</p>
                        <p className="text-lg md:text-2xl font-bold text-blue-800">
                          {classStudents.length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs md:text-sm text-green-600">Present</p>
                        <p className="text-lg md:text-2xl font-bold text-green-800">{presentCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <XCircle className="w-6 h-6 md:w-8 md:h-8 text-red-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs md:text-sm text-red-600">Absent</p>
                        <p className="text-lg md:text-2xl font-bold text-red-800">{absentCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <Calendar className="w-6 h-6 md:w-8 md:h-8 text-purple-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-purple-600">Date</p>
                        <p className="text-lg font-bold text-purple-800">
                          {formatDate(selectedDate)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Attendance Table */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {selectedClass?.name} - Student List
                  </CardTitle>
                  <Badge variant="info">{formatDate(selectedDate)}</Badge>
                </CardHeader>
                <CardContent>
                  {classStudents.length > 0 ? (
                    <>
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead className="w-12">Roll</TableHead>
                              <TableHead>Student</TableHead>
                              <TableHead className="hidden md:table-cell">Guardian</TableHead>
                              <TableHead className="hidden md:table-cell">Phone</TableHead>
                              <TableHead className="text-center">Status</TableHead>
                              <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {classStudents.map((student: Student) => {
                              const status = getAttendanceStatus(student.id);
                              const isPresent = status === AttendanceStatus.PRESENT;

                              return (
                                <TableRow
                                  key={student.id}
                                  className={cn(
                                    isPresent ? 'bg-green-50/50' : 'bg-red-50/50'
                                  )}
                                >
                                  <TableCell className="font-medium">
                                    {student.rollNumber}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-3">
                                      <Avatar
                                        src={student.avatar}
                                        alt={`${student.firstName} ${student.lastName}`}
                                        size="sm"
                                      />
                                      <div>
                                        <p className="font-medium">
                                          {student.firstName} {student.lastName}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {student.studentId}
                                        </p>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="hidden md:table-cell text-gray-600">
                                    {student.guardianName}
                                  </TableCell>
                                  <TableCell className="hidden md:table-cell text-gray-600">
                                    {student.guardianPhone}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Badge
                                      variant={isPresent ? 'success' : 'danger'}
                                      className="min-w-[70px] justify-center"
                                    >
                                      {isPresent ? 'Present' : 'Absent'}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center justify-center gap-1">
                                      <Button
                                        size="sm"
                                        variant={isPresent ? 'primary' : 'outline'}
                                        onClick={() =>
                                          updateAttendance(student.id, AttendanceStatus.PRESENT)
                                        }
                                        className={cn(
                                          'w-9 h-9 p-0',
                                          isPresent &&
                                            'bg-green-600 hover:bg-green-700 border-green-600'
                                        )}
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant={!isPresent ? 'primary' : 'outline'}
                                        onClick={() =>
                                          updateAttendance(student.id, AttendanceStatus.ABSENT)
                                        }
                                        className={cn(
                                          'w-9 h-9 p-0',
                                          !isPresent &&
                                            'bg-red-600 hover:bg-red-700 border-red-600'
                                        )}
                                      >
                                        <XCircle className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Save Button */}
                      <div className="flex justify-end mt-6">
                        <Button onClick={saveAttendance} disabled={isSaving} size="lg">
                          <Save className="w-4 h-4 mr-2" />
                          {isSaving ? 'Saving...' : 'Save Attendance'}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <EmptyState
                      icon={<Users className="w-12 h-12" />}
                      title="No Students Found"
                      description="There are no students enrolled in this class."
                    />
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {/* Attendance History Tab */}
          {activeTab === 'history' && (
            <>
              {/* Monthly Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{classStudents.length}</p>
                        <p className="text-xs text-gray-500">Total Students</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">{classMonthlyStats.totalPresent}</p>
                        <p className="text-xs text-gray-500">Total Present</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <XCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-600">{classMonthlyStats.totalAbsent}</p>
                        <p className="text-xs text-gray-500">Total Absent</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Clock className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-yellow-600">{classMonthlyStats.totalLate}</p>
                        <p className="text-xs text-gray-500">Total Late</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className={cn('text-2xl font-bold', getAttendancePercentageColor(classMonthlyStats.avgAttendance))}>
                          {classMonthlyStats.avgAttendance}%
                        </p>
                        <p className="text-xs text-gray-500">Avg Attendance</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Month Navigation & Search */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Class & Month Navigation */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      {/* Class Selection */}
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Class:</label>
                        <select
                          value={selectedClassId}
                          onChange={(e) => setSelectedClassId(e.target.value)}
                          className="px-3 py-2 border text-black border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
                        >
                          {myClasses.map((cls: Class) => (
                            <option key={cls.id} value={cls.id}>
                              {cls.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Month Navigation */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={prevMonth}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2 min-w-[160px] justify-center">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-900">{monthName}</span>
                        </div>
                        <button
                          onClick={nextMonth}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-auto md:min-w-[280px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by name, ID, or roll..."
                        value={historySearchQuery}
                        onChange={(e) => setHistorySearchQuery(e.target.value)}
                        className={cn(
                          'block w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2',
                          'text-gray-900 placeholder:text-gray-400',
                          'focus:outline-none focus:ring-2 focus:ring-blue-500'
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Student Attendance History Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    {selectedClass?.name} - Attendance History ({monthName})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {filteredHistoryStudents.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">Roll</TableHead>
                          <TableHead>Student</TableHead>
                          <TableHead className="text-center">Present</TableHead>
                          <TableHead className="text-center">Absent</TableHead>
                          <TableHead className="text-center">Late</TableHead>
                          <TableHead className="text-center">Attendance %</TableHead>
                          <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredHistoryStudents.map((student: Student) => {
                          const stats = getStudentMonthlyStats(student.id);
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
                                <span className="text-green-600 font-medium">{stats.present}</span>
                              </TableCell>
                              <TableCell className="text-center">
                                <span className="text-red-600 font-medium">{stats.absent}</span>
                              </TableCell>
                              <TableCell className="text-center">
                                <span className="text-yellow-600 font-medium">{stats.late}</span>
                              </TableCell>
                              <TableCell className="text-center">
                                <span className={cn('font-bold', getAttendancePercentageColor(stats.percentage))}>
                                  {stats.percentage}%
                                </span>
                              </TableCell>
                              <TableCell className="text-center">
                                <button
                                  onClick={() => setSelectedStudent(student)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                  Details
                                </button>
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
            </>
          )}
        </>
      )}

      {/* Empty state for no classes */}
      {!hasClasses && !isTeacher && (
        <Card>
          <CardContent className="p-8">
            <EmptyState
              icon={<Users className="w-12 h-12" />}
              title="No Classes Available"
              description="There are no classes available in the system."
            />
          </CardContent>
        </Card>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar
                    src={selectedStudent.avatar}
                    alt={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                    size="lg"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Roll: {selectedStudent.rollNumber} | ID: {selectedStudent.studentId}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-4 gap-4">
                {(() => {
                  const stats = getStudentMonthlyStats(selectedStudent.id);
                  return (
                    <>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                        <p className="text-xs text-gray-500">Present</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                        <p className="text-xs text-gray-500">Absent</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
                        <p className="text-xs text-gray-500">Late</p>
                      </div>
                      <div className="text-center">
                        <p className={cn('text-2xl font-bold', getAttendancePercentageColor(stats.percentage))}>
                          {stats.percentage}%
                        </p>
                        <p className="text-xs text-gray-500">Attendance</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Daily Records */}
            <div className="p-6 max-h-[400px] overflow-y-auto">
              <h3 className="font-medium text-gray-900 mb-4">Daily Attendance - {monthName}</h3>
              <div className="space-y-2">
                {getStudentMonthlyAttendance(selectedStudent.id).map((record) => (
                  <div
                    key={record.date}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg border',
                      record.status === AttendanceStatus.PRESENT && 'bg-green-50 border-green-200',
                      record.status === AttendanceStatus.ABSENT && 'bg-red-50 border-red-200',
                      record.status === AttendanceStatus.LATE && 'bg-yellow-50 border-yellow-200'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-600 w-12">{record.day}</span>
                      <span className="text-sm text-gray-900">
                        {formatDate(new Date(record.date), 'dd MMM yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {record.remarks && (
                        <span className="text-xs text-gray-500">{record.remarks}</span>
                      )}
                      {getStatusBadge(record.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
