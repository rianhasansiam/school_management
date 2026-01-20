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
  DEMO_CLASSES,
  DEMO_FEES,
} from '@/lib/demo-data';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { PaymentStatus, Gender } from '@/lib/types';
import {
  Users,
  Download,
  Printer,
  GraduationCap,
  UserCheck,
  UserX,
  TrendingUp,
  Filter,
  Eye,
  FileText,
  Award,
  BookOpen,
} from 'lucide-react';

export default function StudentReportPage() {
  const [selectedClass, setSelectedClass] = React.useState<string>('all');
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all');
  const [reportType, setReportType] = React.useState<string>('overview');

  // Filter students
  const filteredStudents = DEMO_STUDENTS.filter((student) => {
    const matchesClass = selectedClass === 'all' || student.classId === selectedClass;
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && student.isActive) ||
      (selectedStatus === 'inactive' && !student.isActive);
    return matchesClass && matchesStatus;
  });

  // Calculate stats
  const totalStudents = DEMO_STUDENTS.length;
  const activeStudents = DEMO_STUDENTS.filter((s) => s.isActive).length;
  const maleStudents = DEMO_STUDENTS.filter((s) => s.gender === Gender.MALE).length;
  const femaleStudents = DEMO_STUDENTS.filter((s) => s.gender === Gender.FEMALE).length;

  // Generate mock performance data
  const studentPerformanceData = filteredStudents.map((student) => {
    const attendance = Math.floor(Math.random() * 15) + 85; // 85-100%
    const examScore = Math.floor(Math.random() * 30) + 70; // 70-100
    const assignmentScore = Math.floor(Math.random() * 25) + 75; // 75-100
    const overallGrade = (attendance * 0.2 + examScore * 0.5 + assignmentScore * 0.3);
    const fee = DEMO_FEES.find((f) => f.studentId === student.id);

    return {
      ...student,
      attendance,
      examScore,
      assignmentScore,
      overallGrade,
      feeStatus: fee?.status || PaymentStatus.PENDING,
      grade: overallGrade >= 90 ? 'A+' : overallGrade >= 80 ? 'A' : overallGrade >= 70 ? 'B' : overallGrade >= 60 ? 'C' : 'D',
    };
  });

  // Class-wise distribution
  const classDistribution = DEMO_CLASSES.map((cls) => ({
    ...cls,
    studentCount: DEMO_STUDENTS.filter((s) => s.classId === cls.id).length,
  }));

  return (
    <DashboardLayout>
      <PageHeader
        title="Student Report"
        description="Comprehensive student reports and analytics"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Reports', href: '/reports' },
          { label: 'Student Report' },
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
          title="Total Students"
          value={totalStudents.toString()}
          icon={<Users className="w-6 h-6 text-gray-800" />}
          iconBgColor="bg-gray-100"
          change={{ value: 12, type: 'increase' }}
        />
        <StatCard
          title="Active Students"
          value={activeStudents.toString()}
          icon={<UserCheck className="w-6 h-6 text-green-600" />}
          iconBgColor="bg-green-100"
        />
        <StatCard
          title="Male Students"
          value={maleStudents.toString()}
          icon={<GraduationCap className="w-6 h-6 text-purple-600" />}
          iconBgColor="bg-purple-100"
        />
        <StatCard
          title="Female Students"
          value={femaleStudents.toString()}
          icon={<GraduationCap className="w-6 h-6 text-pink-600" />}
          iconBgColor="bg-pink-100"
        />
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <Select
              label="Report Type"
              options={[
                { value: 'overview', label: 'Overview Report' },
                { value: 'performance', label: 'Performance Report' },
                { value: 'fee', label: 'Fee Status Report' },
              ]}
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="md:w-48"
            />
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
            <Select
              label="Status"
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="md:w-40"
            />
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Apply
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Report */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Student {reportType === 'overview' ? 'Overview' : reportType === 'performance' ? 'Performance' : 'Fee Status'}
                <span className="text-gray-500 font-normal ml-2">
                  ({filteredStudents.length} students)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {reportType === 'overview' && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Roll No.</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Guardian</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentPerformanceData.map((student) => {
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
                          <TableCell>{student.rollNumber}</TableCell>
                          <TableCell>
                            <Badge variant={student.gender === Gender.MALE ? 'info' : 'warning'}>
                              {student.gender === Gender.MALE ? 'Male' : 'Female'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <span className="block text-sm">{student.guardianName}</span>
                              <span className="text-xs text-gray-500">{student.guardianRelation}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{student.guardianPhone}</TableCell>
                          <TableCell>
                            <Badge variant={student.isActive ? 'success' : 'danger'}>
                              {student.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}

              {reportType === 'performance' && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead className="text-center">Attendance</TableHead>
                      <TableHead className="text-center">Exam Score</TableHead>
                      <TableHead className="text-center">Assignment</TableHead>
                      <TableHead className="text-center">Overall</TableHead>
                      <TableHead className="text-center">Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentPerformanceData.map((student) => {
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
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Progress value={student.attendance} className="w-16" />
                              <span className="text-sm">{student.attendance}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={student.examScore >= 80 ? 'success' : student.examScore >= 60 ? 'warning' : 'danger'}>
                              {student.examScore}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={student.assignmentScore >= 80 ? 'success' : student.assignmentScore >= 60 ? 'warning' : 'danger'}>
                              {student.assignmentScore}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center font-semibold">
                            {student.overallGrade.toFixed(1)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant={
                                student.grade === 'A+' || student.grade === 'A'
                                  ? 'success'
                                  : student.grade === 'B'
                                  ? 'info'
                                  : student.grade === 'C'
                                  ? 'warning'
                                  : 'danger'
                              }
                            >
                              {student.grade}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}

              {reportType === 'fee' && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Guardian Contact</TableHead>
                      <TableHead className="text-center">Fee Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentPerformanceData.map((student) => {
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
                          <TableCell>
                            <div>
                              <span className="block text-sm">{student.guardianName}</span>
                              <span className="text-xs text-gray-500">{student.guardianPhone}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant={
                                student.feeStatus === PaymentStatus.COMPLETED ? 'success' : 'warning'
                              }
                            >
                              {student.feeStatus === PaymentStatus.COMPLETED ? 'Paid' : 'Pending'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                Details
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Class Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Class Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {classDistribution.map((cls) => (
                  <div key={cls.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{cls.name}</span>
                      <span className="font-medium">{cls.studentCount}</span>
                    </div>
                    <Progress
                      value={(cls.studentCount / cls.capacity) * 100}
                      className="h-2"
                      color={cls.studentCount >= cls.capacity * 0.9 ? 'red' : cls.studentCount >= cls.capacity * 0.7 ? 'yellow' : 'green'}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Gender Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Gender Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-800" />
                    <span className="text-sm">Male</span>
                  </div>
                  <span className="font-semibold">{maleStudents} ({((maleStudents / totalStudents) * 100).toFixed(1)}%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-pink-500" />
                    <span className="text-sm">Female</span>
                  </div>
                  <span className="font-semibold">{femaleStudents} ({((femaleStudents / totalStudents) * 100).toFixed(1)}%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Performers */}
          {reportType === 'performance' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-green-600">
                  <Award className="w-4 h-4" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {studentPerformanceData
                    .sort((a, b) => b.overallGrade - a.overallGrade)
                    .slice(0, 5)
                    .map((student, index) => (
                      <div key={student.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                            index === 0 ? 'bg-yellow-100 text-yellow-700' :
                            index === 1 ? 'bg-gray-100 text-gray-700' :
                            index === 2 ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-50 text-gray-500'
                          )}>
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium">
                            {student.firstName} {student.lastName}
                          </span>
                        </div>
                        <Badge variant="success">{student.grade}</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
