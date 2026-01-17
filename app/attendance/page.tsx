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
} from '@/components/ui';
import { DEMO_TEACHERS } from '@/lib/demo-data';
import { formatDate, cn } from '@/lib/utils';
import { AttendanceStatus } from '@/lib/types';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Save,
  Users,
} from 'lucide-react';

type AttendanceRecord = {
  teacherId: string;
  status: AttendanceStatus;
  remarks?: string;
};

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = React.useState(
    new Date().toISOString().split('T')[0]
  );
  const [attendanceRecords, setAttendanceRecords] = React.useState<AttendanceRecord[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

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
    late: attendanceRecords.filter((r) => r.status === AttendanceStatus.LATE).length,
    excused: attendanceRecords.filter((r) => r.status === AttendanceStatus.EXCUSED).length,
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
                      <TableHead className="text-center">Late</TableHead>
                      <TableHead className="text-center">Leave</TableHead>
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
                            <AttendanceButton
                              status={AttendanceStatus.LATE}
                              isSelected={record?.status === AttendanceStatus.LATE}
                              onClick={() =>
                                updateAttendance(teacher.id, AttendanceStatus.LATE)
                              }
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <AttendanceButton
                              status={AttendanceStatus.EXCUSED}
                              isSelected={record?.status === AttendanceStatus.EXCUSED}
                              onClick={() =>
                                updateAttendance(teacher.id, AttendanceStatus.EXCUSED)
                              }
                            />
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
                <SummaryItem
                  icon={<Clock className="w-5 h-5 text-yellow-600" />}
                  label="Late"
                  value={summary.late}
                  total={summary.total}
                  color="yellow"
                />
                <SummaryItem
                  icon={<AlertCircle className="w-5 h-5 text-blue-600" />}
                  label="On Leave"
                  value={summary.excused}
                  total={summary.total}
                  color="blue"
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
    </DashboardLayout>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================

interface AttendanceButtonProps {
  status: AttendanceStatus;
  isSelected: boolean;
  onClick: () => void;
}

function AttendanceButton({ status, isSelected, onClick }: AttendanceButtonProps) {
  const icons = {
    [AttendanceStatus.PRESENT]: <CheckCircle className="w-5 h-5" />,
    [AttendanceStatus.ABSENT]: <XCircle className="w-5 h-5" />,
    [AttendanceStatus.LATE]: <Clock className="w-5 h-5" />,
    [AttendanceStatus.EXCUSED]: <AlertCircle className="w-5 h-5" />,
  };

  const colors = {
    [AttendanceStatus.PRESENT]: isSelected
      ? 'bg-green-100 text-green-700 border-green-300'
      : 'hover:bg-green-50 text-gray-400 hover:text-green-600',
    [AttendanceStatus.ABSENT]: isSelected
      ? 'bg-red-100 text-red-700 border-red-300'
      : 'hover:bg-red-50 text-gray-400 hover:text-red-600',
    [AttendanceStatus.LATE]: isSelected
      ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
      : 'hover:bg-yellow-50 text-gray-400 hover:text-yellow-600',
    [AttendanceStatus.EXCUSED]: isSelected
      ? 'bg-blue-100 text-blue-700 border-blue-300'
      : 'hover:bg-blue-50 text-gray-400 hover:text-blue-600',
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
  color: 'green' | 'red' | 'yellow' | 'blue';
}

function SummaryItem({ icon, label, value, total, color }: SummaryItemProps) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  const bgColors = {
    green: 'bg-green-50',
    red: 'bg-red-50',
    yellow: 'bg-yellow-50',
    blue: 'bg-blue-50',
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
