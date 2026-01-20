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
  DEMO_TEACHERS,
  DEMO_CLASSES,
  DEMO_SUBJECTS,
  DEMO_SALARY_PAYMENTS,
} from '@/lib/demo-data';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { MONTHS } from '@/lib/constants';
import { PaymentStatus, Gender } from '@/lib/types';
import {
  Users,
  Download,
  Printer,
  GraduationCap,
  UserCheck,
  Briefcase,
  TrendingUp,
  Filter,
  Eye,
  FileText,
  Award,
  Star,
  DollarSign,
  Calendar,
} from 'lucide-react';

export default function TeacherReportPage() {
  const [selectedSubject, setSelectedSubject] = React.useState<string>('all');
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all');
  const [reportType, setReportType] = React.useState<string>('overview');

  // Get unique subjects
  const uniqueSubjects = [...new Set(DEMO_TEACHERS.map((t) => t.specialization))];

  // Filter teachers
  const filteredTeachers = DEMO_TEACHERS.filter((teacher) => {
    const matchesSubject = selectedSubject === 'all' || teacher.specialization === selectedSubject;
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && teacher.isActive) ||
      (selectedStatus === 'inactive' && !teacher.isActive);
    return matchesSubject && matchesStatus;
  });

  // Calculate stats
  const totalTeachers = DEMO_TEACHERS.length;
  const activeTeachers = DEMO_TEACHERS.filter((t) => t.isActive).length;
  const maleTeachers = DEMO_TEACHERS.filter((t) => t.gender === Gender.MALE).length;
  const femaleTeachers = DEMO_TEACHERS.filter((t) => t.gender === Gender.FEMALE).length;
  const totalSalaryBudget = DEMO_TEACHERS.filter((t) => t.isActive).reduce((sum, t) => sum + t.salary, 0);

  // Generate mock performance data for teachers
  const teacherPerformanceData = filteredTeachers.map((teacher) => {
    const attendance = Math.floor(Math.random() * 5) + 95; // 95-100%
    const classesAssigned = Math.floor(Math.random() * 3) + 2; // 2-4 classes
    const studentsManaged = classesAssigned * (Math.floor(Math.random() * 15) + 30); // 30-45 students per class
    const rating = (Math.random() * 1.5 + 3.5).toFixed(1); // 3.5-5.0
    const salaryPayment = DEMO_SALARY_PAYMENTS.find((s) => s.teacherId === teacher.id);

    return {
      ...teacher,
      attendance,
      classesAssigned,
      studentsManaged,
      rating: parseFloat(rating),
      salaryStatus: salaryPayment?.status || PaymentStatus.PENDING,
      netSalary: salaryPayment?.netSalary || teacher.salary,
    };
  });

  // Subject-wise distribution
  const subjectDistribution = uniqueSubjects.map((subject) => ({
    subject,
    count: DEMO_TEACHERS.filter((t) => t.specialization === subject && t.isActive).length,
  }));

  return (
    <DashboardLayout>
      <PageHeader
        title="Teacher Report"
        description="Comprehensive teacher reports and analytics"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Reports', href: '/reports' },
          { label: 'Teacher Report' },
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
          title="Total Teachers"
          value={totalTeachers.toString()}
          icon={<Users className="w-6 h-6 text-gray-800" />}
          iconBgColor="bg-gray-100"
        />
        <StatCard
          title="Active Teachers"
          value={activeTeachers.toString()}
          icon={<UserCheck className="w-6 h-6 text-green-600" />}
          iconBgColor="bg-green-100"
        />
        <StatCard
          title="Monthly Salary Budget"
          value={formatCurrency(totalSalaryBudget)}
          icon={<DollarSign className="w-6 h-6 text-purple-600" />}
          iconBgColor="bg-purple-100"
        />
        <StatCard
          title="Subjects Covered"
          value={uniqueSubjects.length.toString()}
          icon={<Briefcase className="w-6 h-6 text-orange-600" />}
          iconBgColor="bg-orange-100"
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
                { value: 'salary', label: 'Salary Report' },
              ]}
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="md:w-48"
            />
            <Select
              label="Subject"
              options={[
                { value: 'all', label: 'All Subjects' },
                ...uniqueSubjects.map((s) => ({ value: s, label: s })),
              ]}
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
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
                Teacher {reportType === 'overview' ? 'Overview' : reportType === 'performance' ? 'Performance' : 'Salary'} Report
                <span className="text-gray-500 font-normal ml-2">
                  ({filteredTeachers.length} teachers)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {reportType === 'overview' && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Qualification</TableHead>
                      <TableHead>Joining Date</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teacherPerformanceData.map((teacher) => (
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
                        <TableCell className="text-sm">{teacher.qualification}</TableCell>
                        <TableCell className="text-sm">{formatDate(teacher.joiningDate)}</TableCell>
                        <TableCell>
                          <div>
                            <span className="block text-sm">{teacher.phone}</span>
                            <span className="text-xs text-gray-500">{teacher.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={teacher.isActive ? 'success' : 'danger'}>
                            {teacher.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {reportType === 'performance' && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead className="text-center">Attendance</TableHead>
                      <TableHead className="text-center">Classes</TableHead>
                      <TableHead className="text-center">Students</TableHead>
                      <TableHead className="text-center">Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teacherPerformanceData.map((teacher) => (
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
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Progress value={teacher.attendance} className="w-16" />
                            <span className="text-sm">{teacher.attendance}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {teacher.classesAssigned}
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {teacher.studentsManaged}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className={cn(
                              'w-4 h-4',
                              teacher.rating >= 4.5 ? 'text-yellow-500 fill-yellow-500' :
                              teacher.rating >= 4 ? 'text-yellow-500' :
                              'text-gray-400'
                            )} />
                            <span className="font-medium">{teacher.rating}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {reportType === 'salary' && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead className="text-right">Basic Salary</TableHead>
                      <TableHead className="text-right">Net Salary</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teacherPerformanceData.map((teacher) => (
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
                        <TableCell className="text-right">
                          {formatCurrency(teacher.salary)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(teacher.netSalary)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              teacher.salaryStatus === PaymentStatus.COMPLETED ? 'success' : 'warning'
                            }
                          >
                            {teacher.salaryStatus === PaymentStatus.COMPLETED ? 'Paid' : 'Pending'}
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
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Subject Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Subject Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {subjectDistribution.map((item) => (
                  <div key={item.subject} className="flex items-center justify-between">
                    <span className="text-sm">{item.subject}</span>
                    <Badge variant="default">{item.count}</Badge>
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
                  <span className="font-semibold">{maleTeachers} ({((maleTeachers / totalTeachers) * 100).toFixed(1)}%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-pink-500" />
                    <span className="text-sm">Female</span>
                  </div>
                  <span className="font-semibold">{femaleTeachers} ({((femaleTeachers / totalTeachers) * 100).toFixed(1)}%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Rated Teachers */}
          {reportType === 'performance' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-yellow-600">
                  <Award className="w-4 h-4" />
                  Top Rated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teacherPerformanceData
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 5)
                    .map((teacher, index) => (
                      <div key={teacher.id} className="flex items-center justify-between">
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
                            {teacher.firstName} {teacher.lastName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium">{teacher.rating}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Salary Summary */}
          {reportType === 'salary' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Salary Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Budget</span>
                    <span className="font-semibold">{formatCurrency(totalSalaryBudget)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Paid</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(
                        teacherPerformanceData
                          .filter((t) => t.salaryStatus === PaymentStatus.COMPLETED)
                          .reduce((sum, t) => sum + t.netSalary, 0)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pending</span>
                    <span className="font-semibold text-yellow-600">
                      {formatCurrency(
                        teacherPerformanceData
                          .filter((t) => t.salaryStatus === PaymentStatus.PENDING)
                          .reduce((sum, t) => sum + t.netSalary, 0)
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
