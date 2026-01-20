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
  Modal,
} from '@/components/ui';
import { DEMO_TEACHERS } from '@/lib/demo-data';
import { formatDate, cn } from '@/lib/utils';
import { AttendanceStatus, Teacher } from '@/lib/types';
import {
  CheckCircle,
  XCircle,
  Save,
  Users,
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

type AttendanceRecord = {
  teacherId: string;
  status: AttendanceStatus;
  remarks?: string;
};

// Generate mock monthly attendance data for a teacher
function generateMonthlyAttendance(teacherId: string, year: number, month: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const records: { date: string; status: AttendanceStatus; day: string }[] = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    
    // Skip weekends (Friday = 5, Saturday = 6 in Bangladesh context, or Saturday = 6, Sunday = 0)
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      records.push({
        date: date.toISOString().split('T')[0],
        status: AttendanceStatus.EXCUSED, // Using EXCUSED for holidays/weekends
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      });
      continue;
    }
    
    // Generate random attendance (mostly present)
    const random = Math.random();
    let status: AttendanceStatus;
    if (random < 0.85) {
      status = AttendanceStatus.PRESENT;
    } else {
      status = AttendanceStatus.ABSENT;
    }
    
    records.push({
      date: date.toISOString().split('T')[0],
      status,
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
    });
  }
  
  return records;
}

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = React.useState(
    new Date().toISOString().split('T')[0]
  );
  const [attendanceRecords, setAttendanceRecords] = React.useState<AttendanceRecord[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [selectedTeacher, setSelectedTeacher] = React.useState<Teacher | null>(null);
  const [historyMonth, setHistoryMonth] = React.useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  // Get only active teachers
  const teachers = DEMO_TEACHERS.filter((t) => t.isActive);

  // Initialize attendance records when date changes
  React.useEffect(() => {
    const records = teachers.map((teacher) => ({
      teacherId: teacher.id,
      status: AttendanceStatus.PRESENT,
      remarks: '',
    }));
    setAttendanceRecords(records);
  }, [selectedDate]);

  const updateAttendance = (teacherId: string, status: AttendanceStatus) => {
    setAttendanceRecords((prev) =>
      prev.map((r) =>
        r.teacherId === teacherId ? { ...r, status } : r
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const markAllPresent = () => {
    setAttendanceRecords((prev) =>
      prev.map((r) => ({ ...r, status: AttendanceStatus.PRESENT }))
    );
  };

  // Calculate summary
  const summary = {
    present: attendanceRecords.filter((r) => r.status === AttendanceStatus.PRESENT).length,
    absent: attendanceRecords.filter((r) => r.status === AttendanceStatus.ABSENT).length,
    total: attendanceRecords.length,
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Teacher Attendance"
        description="Mark daily teacher attendance"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Teacher Attendance' },
        ]}
      />

      {/* Success Alert */}
      {showSuccess && (
        <Alert type="success" title="Success!" className="mb-6">
          Teacher attendance saved successfully.
        </Alert>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 md:max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={cn(
                  'block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5',
                  'text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500'
                )}
              />
            </div>
            <Button variant="outline" onClick={markAllPresent}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark All Present
            </Button>
            <Button onClick={handleSave} isLoading={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              Save Attendance
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Attendance Table */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Teacher Attendance
                <span className="text-gray-500 font-normal ml-2">
                  ({formatDate(new Date(selectedDate), 'dd MMMM yyyy')})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {teachers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Employee ID</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead className="text-center">Present</TableHead>
                      <TableHead className="text-center">Absent</TableHead>
                      <TableHead className="text-center">History</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teachers.map((teacher) => {
                      const record = attendanceRecords.find(
                        (r) => r.teacherId === teacher.id
                      );
                      return (
                        <TableRow key={teacher.id}>
                          <TableCell className="font-medium text-gray-600">
                            {teacher.employeeId}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar
                                src={teacher.avatar}
                                alt={`${teacher.firstName} ${teacher.lastName}`}
                                size="sm"
                              />
                              <div>
                                <span className="font-medium block">
                                  {teacher.firstName} {teacher.lastName}
                                </span>
                                <span className="text-xs text-gray-500">{teacher.email}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="info">{teacher.specialization}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <AttendanceButton
                              status={AttendanceStatus.PRESENT}
                              isSelected={record?.status === AttendanceStatus.PRESENT}
                              onClick={() =>
                                updateAttendance(teacher.id, AttendanceStatus.PRESENT)
                              }
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <AttendanceButton
                              status={AttendanceStatus.ABSENT}
                              isSelected={record?.status === AttendanceStatus.ABSENT}
                              onClick={() =>
                                updateAttendance(teacher.id, AttendanceStatus.ABSENT)
                              }
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedTeacher(teacher)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No active teachers found
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <SummaryItem
                  icon={<CheckCircle className="w-5 h-5 text-green-600" />}
                  label="Present"
                  value={summary.present}
                  total={summary.total}
                  color="green"
                />
                <SummaryItem
                  icon={<XCircle className="w-5 h-5 text-red-600" />}
                  label="Absent"
                  value={summary.absent}
                  total={summary.total}
                  color="red"
                />

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Teachers</span>
                    <span className="text-lg font-bold text-gray-900">
                      {summary.total}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">Attendance Rate</span>
                    <span className="text-lg font-bold text-green-600">
                      {summary.total > 0
                        ? Math.round((summary.present / summary.total) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Monthly Attendance History Modal */}
      <AttendanceHistoryModal
        teacher={selectedTeacher}
        isOpen={!!selectedTeacher}
        onClose={() => setSelectedTeacher(null)}
        month={historyMonth}
        onMonthChange={setHistoryMonth}
      />
    </DashboardLayout>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================

interface AttendanceButtonProps {
  status: AttendanceStatus.PRESENT | AttendanceStatus.ABSENT;
  isSelected: boolean;
  onClick: () => void;
}

function AttendanceButton({ status, isSelected, onClick }: AttendanceButtonProps) {
  const icons: Record<AttendanceStatus.PRESENT | AttendanceStatus.ABSENT, React.ReactNode> = {
    [AttendanceStatus.PRESENT]: <CheckCircle className="w-5 h-5" />,
    [AttendanceStatus.ABSENT]: <XCircle className="w-5 h-5" />,
  };

  const colors: Record<AttendanceStatus.PRESENT | AttendanceStatus.ABSENT, string> = {
    [AttendanceStatus.PRESENT]: isSelected
      ? 'bg-green-100 text-green-700 border-green-300'
      : 'hover:bg-green-50 text-gray-400 hover:text-green-600',
    [AttendanceStatus.ABSENT]: isSelected
      ? 'bg-red-100 text-red-700 border-red-300'
      : 'hover:bg-red-50 text-gray-400 hover:text-red-600',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'p-2 rounded-lg border border-transparent transition-all duration-200',
        colors[status]
      )}
    >
      {icons[status]}
    </button>
  );
}

interface SummaryItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  total: number;
  color: 'green' | 'red';
}

function SummaryItem({ icon, label, value, total, color }: SummaryItemProps) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  const bgColors = {
    green: 'bg-green-50',
    red: 'bg-red-50',
  };

  return (
    <div className={cn('p-3 rounded-lg', bgColors[color])}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-gray-900">{value}</span>
          <span className="text-xs text-gray-500 ml-1">({percentage}%)</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ATTENDANCE HISTORY MODAL
// ============================================

interface AttendanceHistoryModalProps {
  teacher: Teacher | null;
  isOpen: boolean;
  onClose: () => void;
  month: { year: number; month: number };
  onMonthChange: (month: { year: number; month: number }) => void;
}

function AttendanceHistoryModal({
  teacher,
  isOpen,
  onClose,
  month,
  onMonthChange,
}: AttendanceHistoryModalProps) {
  const monthlyRecords = React.useMemo(() => {
    if (!teacher) return [];
    return generateMonthlyAttendance(teacher.id, month.year, month.month);
  }, [teacher, month.year, month.month]);

  const monthStats = React.useMemo(() => {
    const workingDays = monthlyRecords.filter(
      (r) => r.status !== AttendanceStatus.EXCUSED
    );
    const present = workingDays.filter(
      (r) => r.status === AttendanceStatus.PRESENT
    ).length;
    const absent = workingDays.filter(
      (r) => r.status === AttendanceStatus.ABSENT
    ).length;
    const total = workingDays.length;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;

    return { present, absent, total, rate };
  }, [monthlyRecords]);

  if (!teacher) return null;

  const handlePrevMonth = () => {
    const newMonth = month.month === 0 ? 11 : month.month - 1;
    const newYear = month.month === 0 ? month.year - 1 : month.year;
    onMonthChange({ year: newYear, month: newMonth });
  };

  const handleNextMonth = () => {
    const newMonth = month.month === 11 ? 0 : month.month + 1;
    const newYear = month.month === 11 ? month.year + 1 : month.year;
    onMonthChange({ year: newYear, month: newMonth });
  };

  const monthName = new Date(month.year, month.month).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Group records by week for calendar view
  const weeks: typeof monthlyRecords[] = [];
  let currentWeek: typeof monthlyRecords = [];
  
  // Add empty days for the first week
  const firstDay = new Date(month.year, month.month, 1).getDay();
  for (let i = 0; i < firstDay; i++) {
    currentWeek.push({ date: '', status: AttendanceStatus.EXCUSED, day: '' });
  }

  monthlyRecords.forEach((record) => {
    currentWeek.push(record);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    // Fill remaining days
    while (currentWeek.length < 7) {
      currentWeek.push({ date: '', status: AttendanceStatus.EXCUSED, day: '' });
    }
    weeks.push(currentWeek);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Monthly Attendance Record"
      size="lg"
    >
      <div className="space-y-6">
        {/* Teacher Info */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <Avatar
            src={teacher.avatar}
            alt={`${teacher.firstName} ${teacher.lastName}`}
            size="lg"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {teacher.firstName} {teacher.lastName}
            </h3>
            <p className="text-sm text-gray-500">{teacher.employeeId}</p>
            <Badge variant="info" className="mt-1">{teacher.specialization}</Badge>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={handlePrevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">{monthName}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleNextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Monthly Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-700">{monthStats.total}</p>
            <p className="text-xs text-blue-600">Working Days</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-700">{monthStats.present}</p>
            <p className="text-xs text-green-600">Present</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-red-700">{monthStats.absent}</p>
            <p className="text-xs text-red-600">Absent</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-purple-700">{monthStats.rate}%</p>
            <p className="text-xs text-purple-600">Attendance Rate</p>
          </div>
        </div>

        {/* Calendar View */}
        <div className="border rounded-lg overflow-hidden">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 bg-gray-100">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="p-2 text-center text-xs font-medium text-gray-600 border-b"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7">
              {week.map((record, dayIndex) => {
                const dayNumber = record.date
                  ? new Date(record.date).getDate()
                  : null;
                const isWeekend =
                  record.status === AttendanceStatus.EXCUSED && record.date;
                const isPresent = record.status === AttendanceStatus.PRESENT;
                const isAbsent = record.status === AttendanceStatus.ABSENT;

                return (
                  <div
                    key={dayIndex}
                    className={cn(
                      'p-2 min-h-14 border-b border-r flex flex-col items-center justify-center',
                      !record.date && 'bg-gray-50',
                      isWeekend && 'bg-gray-100',
                      isPresent && 'bg-green-50',
                      isAbsent && 'bg-red-50'
                    )}
                  >
                    {dayNumber && (
                      <>
                        <span
                          className={cn(
                            'text-sm font-medium',
                            isWeekend && 'text-gray-400',
                            isPresent && 'text-green-700',
                            isAbsent && 'text-red-700'
                          )}
                        >
                          {dayNumber}
                        </span>
                        {!isWeekend && (
                          <span className="mt-1">
                            {isPresent && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                            {isAbsent && (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
            <span className="text-gray-600">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
            <span className="text-gray-600">Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
            <span className="text-gray-600">Weekend/Holiday</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
