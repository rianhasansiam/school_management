'use client';

import * as React from 'react';
import { DashboardLayout, PageHeader } from '@/components/layout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  StatCard,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Button,
  Select,
  Avatar,
  Progress,
} from '@/components/ui';
import {
  DEMO_STUDENTS,
  DEMO_TEACHERS,
  DEMO_CLASSES,
  DEMO_ATTENDANCE,
} from '@/lib/demo-data';
import { formatDate, formatPercent, cn } from '@/lib/utils';
import { MONTHS } from '@/lib/constants';
import { AttendanceStatus } from '@/lib/types';
import {
  Calendar,
  Download,
  Printer,
  Users,
  UserCheck,
  UserX,
  Clock,
  Filter,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
} from 'lucide-react';

export default function AttendanceReportPage() {
  const [reportType, setReportType] = React.useState<'student' | 'teacher'>('student');
  const [selectedClass, setSelectedClass] = React.useState<string>('all');
  const [selectedMonth, setSelectedMonth] = React.useState<string>('1');
  const [selectedYear, setSelectedYear] = React.useState<string>('2026');

  // Filter students by class
  const filteredStudents = selectedClass === 'all'
    ? DEMO_STUDENTS
    : DEMO_STUDENTS.filter((s) => s.classId === selectedClass);

  // Calculate overall attendance stats
  const totalPresent = DEMO_ATTENDANCE.filter((a) => a.status === AttendanceStatus.PRESENT).length;
  const totalAbsent = DEMO_ATTENDANCE.filter((a) => a.status === AttendanceStatus.ABSENT).length;
  const totalLate = DEMO_ATTENDANCE.filter((a) => a.status === AttendanceStatus.LATE).length;
  const totalRecords = DEMO_ATTENDANCE.length;
  const overallRate = totalRecords > 0 ? (totalPresent / totalRecords) * 100 : 0;

  // Generate mock attendance data for each student
  const studentAttendanceData = filteredStudents.map((student) => {
    const totalDays = 22; // Working days in a month
    const present = Math.floor(Math.random() * 5) + 18; // 18-22 days
    const absent = Math.floor(Math.random() * 2);
    const late = totalDays - present - absent;
    const percentage = (present / totalDays) * 100;

    return {
      ...student,
      totalDays,
      present,
      absent,
      late,
      percentage,
    };
  });

  // Generate mock attendance data for each teacher
  const teacherAttendanceData = DEMO_TEACHERS.filter((t) => t.isActive).map((teacher) => {
    const totalDays = 22;
    const present = Math.floor(Math.random() * 3) + 20; // 20-22 days
    const absent = Math.floor(Math.random() * 2);
    const late = totalDays - present - absent;
    const percentage = (present / totalDays) * 100;

    return {
      ...teacher,
      totalDays,
      present,
      absent,
      late,
      percentage,
    };
  });

  return (
    <DashboardLayout>
      <PageHeader
        title="Attendance Report"
        description="View detailed attendance reports for students and teachers"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Reports', href: '/reports' },
          { label: 'Attendance Report' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Overall Attendance Rate"
          value={`${overallRate.toFixed(1)}%`}
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          iconBgColor="bg-green-100"
          change={{ value: 2.5, type: 'increase' }}
        />
        <StatCard
          title="Total Present"
          value={totalPresent.toString()}
          icon={<UserCheck className="w-6 h-6 text-gray-800" />}
          iconBgColor="bg-gray-100"
        />
        <StatCard
          title="Total Absent"
          value={totalAbsent.toString()}
          icon={<UserX className="w-6 h-6 text-red-600" />}
          iconBgColor="bg-red-100"
        />
        <StatCard
          title="Total Late"
          value={totalLate.toString()}
          icon={<Clock className="w-6 h-6 text-yellow-600" />}
          iconBgColor="bg-yellow-100"
        />
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <Select
              label="Report Type"
              options={[
                { value: 'student', label: 'Student Attendance' },
                { value: 'teacher', label: 'Teacher Attendance' },
              ]}
              value={reportType}
              onChange={(e) => setReportType(e.target.value as 'student' | 'teacher')}
              className="md:w-48"
            />
            {reportType === 'student' && (
              <Select
                label="Class"
                options={[
                  { value: 'all', label: 'All Classes' },
                  ...DEMO_CLASSES.map((c) => ({ value: c.id, label: c.name })),
                ]}
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="md:w-40"
              />
            )}
            <Select
              label="Month"
              options={MONTHS}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="md:w-40"
            />
            <Select
              label="Year"
              options={[
                { value: '2024', label: '2024' },
                { value: '2025', label: '2025' },
                { value: '2026', label: '2026' },
              ]}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="md:w-32"
            />
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Apply
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Report Table */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {reportType === 'student' ? 'Student' : 'Teacher'} Attendance Report
                <Badge variant="info">
                  {MONTHS.find((m) => m.value === parseInt(selectedMonth))?.label} {selectedYear}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {reportType === 'student' ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead className="text-center">Working Days</TableHead>
                      <TableHead className="text-center">Present</TableHead>
                      <TableHead className="text-center">Absent</TableHead>
                      <TableHead className="text-center">Late</TableHead>
                      <TableHead>Attendance %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentAttendanceData.map((student) => {
                      const classInfo = DEMO_CLASSES.find((c) => c.id === student.classId);
                      return (
                        <TableRow key={student.id}>
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
                          <TableCell>{classInfo?.name}</TableCell>
                          <TableCell className="text-center">{student.totalDays}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="success">{student.present}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="danger">{student.absent}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="warning">{student.late}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={student.percentage}
                                className="w-20"
                                color={
                                  student.percentage >= 90
                                    ? 'green'
                                    : student.percentage >= 75
                                    ? 'yellow'
                                    : 'red'
                                }
                              />
                              <span
                                className={cn(
                                  'text-sm font-medium',
                                  student.percentage >= 90
                                    ? 'text-green-600'
                                    : student.percentage >= 75
                                    ? 'text-yellow-600'
                                    : 'text-red-600'
                                )}
                              >
                                {student.percentage.toFixed(1)}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead className="text-center">Working Days</TableHead>
                      <TableHead className="text-center">Present</TableHead>
                      <TableHead className="text-center">Absent</TableHead>
                      <TableHead className="text-center">Late</TableHead>
                      <TableHead>Attendance %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teacherAttendanceData.map((teacher) => (
                      <TableRow key={teacher.id}>
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
                              <span className="text-xs text-gray-500">{teacher.employeeId}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="info">{teacher.specialization}</Badge>
                        </TableCell>
                        <TableCell className="text-center">{teacher.totalDays}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="success">{teacher.present}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="danger">{teacher.absent}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="warning">{teacher.late}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={teacher.percentage}
                              className="w-20"
                              color={
                                teacher.percentage >= 95
                                  ? 'green'
                                  : teacher.percentage >= 85
                                  ? 'yellow'
                                  : 'red'
                              }
                            />
                            <span
                              className={cn(
                                'text-sm font-medium',
                                teacher.percentage >= 95
                                  ? 'text-green-600'
                                  : teacher.percentage >= 85
                                  ? 'text-yellow-600'
                                  : 'text-red-600'
                              )}
                            >
                              {teacher.percentage.toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Attendance Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm">Present</span>
                  </div>
                  <span className="font-semibold">{((totalPresent / totalRecords) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm">Absent</span>
                  </div>
                  <span className="font-semibold">{((totalAbsent / totalRecords) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-sm">Late</span>
                  </div>
                  <span className="font-semibold">{((totalLate / totalRecords) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Low Attendance Alert */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-red-600">
                <TrendingDown className="w-4 h-4" />
                Low Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(reportType === 'student' ? studentAttendanceData : teacherAttendanceData)
                  .filter((item) => item.percentage < 85)
                  .slice(0, 5)
                  .map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {item.firstName} {item.lastName}
                      </span>
                      <Badge variant="danger">{item.percentage.toFixed(1)}%</Badge>
                    </div>
                  ))}
                {(reportType === 'student' ? studentAttendanceData : teacherAttendanceData).filter(
                  (item) => item.percentage < 85
                ).length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No low attendance records
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Class-wise Summary (for students) */}
          {reportType === 'student' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Class-wise Average
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {DEMO_CLASSES.slice(0, 5).map((cls) => {
                    const classStudents = studentAttendanceData.filter((s) => s.classId === cls.id);
                    const avgAttendance =
                      classStudents.length > 0
                        ? classStudents.reduce((sum, s) => sum + s.percentage, 0) / classStudents.length
                        : 0;
                    return (
                      <div key={cls.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{cls.name}</span>
                          <span className="font-medium">{avgAttendance.toFixed(1)}%</span>
                        </div>
                        <Progress
                          value={avgAttendance}
                          className="h-2"
                          color={avgAttendance >= 90 ? 'green' : avgAttendance >= 75 ? 'yellow' : 'red'}
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
