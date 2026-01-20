'use client';

import * as React from 'react';
import Link from 'next/link';
import { formatDate, formatCurrency, cn } from '@/lib/utils';
import { 
  DEMO_CLASSES, 
  DEMO_STUDENTS, 
  DEMO_ASSIGNMENTS, 
  DEMO_ATTENDANCE,
  DEMO_TEACHERS,
  DEMO_SUBJECTS,
  DEMO_SALARY_PAYMENTS,
  getStudentsByClass,
} from '@/lib/demo-data';
import { useAuthStore } from '@/lib/store';
import { AttendanceStatus, PaymentStatus } from '@/lib/types';
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
  Avatar,
  Badge,
  Button,
  Progress,
  SimpleBarChart,
  SimpleAreaChart,
  DonutChart,
  CHART_COLORS,
} from '@/components/ui';
import {
  Users,
  BookOpen,
  ClipboardCheck,
  FileText,
  Calendar,
  ArrowRight,
  CheckCircle,
  XCircle,
  GraduationCap,
  Mail,
  Phone,
  Briefcase,
  DollarSign,
  CalendarDays,
  BarChart3,
  Clock,
} from 'lucide-react';

// ============================================
// TEACHER DASHBOARD - Shows only logged-in teacher's info
// ============================================

export function TeacherDashboard() {
  const user = useAuthStore((state) => state.user);
  
  // Get the teacher profile for the logged-in user
  const myTeacherProfile = DEMO_TEACHERS.find(t => t.userId === user?.id);
  
  // Get classes where this teacher is the class teacher
  const myClasses = DEMO_CLASSES.filter(c => c.classTeacherId === myTeacherProfile?.id);
  
  // Get subjects taught by this teacher
  const mySubjects = DEMO_SUBJECTS.filter(s => s.teacherId === myTeacherProfile?.id);
  
  // Get all class IDs the teacher is associated with (as class teacher or subject teacher)
  const myClassIds = new Set([
    ...myClasses.map(c => c.id),
    ...mySubjects.map(s => s.classId),
  ]);
  
  // Get students from teacher's classes
  const myStudents = DEMO_STUDENTS.filter(s => myClassIds.has(s.classId));
  
  // Get assignments created by this teacher
  const myAssignments = DEMO_ASSIGNMENTS.filter(a => a.teacherId === myTeacherProfile?.id);
  
  // Get attendance records for teacher's classes (today)
  const todayAttendance = DEMO_ATTENDANCE.filter(a => {
    const student = DEMO_STUDENTS.find(s => s.id === a.studentId);
    return student && myClassIds.has(student.classId);
  });
  
  // Get teacher's salary payments
  const mySalaryPayments = DEMO_SALARY_PAYMENTS.filter(s => s.teacherId === myTeacherProfile?.id);
  const lastSalary = mySalaryPayments.sort((a, b) => 
    new Date(b.paidDate || 0).getTime() - new Date(a.paidDate || 0).getTime()
  )[0];

  // Calculate attendance stats (Present/Absent only)
  const attendanceStats = {
    present: todayAttendance.filter(a => a.status === AttendanceStatus.PRESENT).length,
    absent: todayAttendance.filter(a => a.status === AttendanceStatus.ABSENT).length,
    total: todayAttendance.length,
  };

  // Calculate teaching hours (mock data based on subjects)
  const weeklyTeachingHours = mySubjects.length * 5; // Assuming 5 classes per subject per week

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Teacher Profile Card */}
      <Card className="bg-linear-to-r from-blue-600 to-blue-700 text-white">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-start sm:items-center">
            <Avatar
              src={myTeacherProfile?.avatar || user?.avatar}
              alt={`${user?.firstName} ${user?.lastName}`}
              size="xl"
              className="border-4 border-white/20"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-xl md:text-2xl font-bold truncate">
                {myTeacherProfile?.firstName || user?.firstName} {myTeacherProfile?.lastName || user?.lastName}
              </h2>
              <p className="text-blue-100 mt-1 text-sm md:text-base">
                {myTeacherProfile?.specialization || 'Teacher'} • {myTeacherProfile?.qualification}
              </p>
              <div className="flex flex-wrap gap-2 md:gap-4 mt-3 md:mt-4 text-xs md:text-sm text-blue-100">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3 md:w-4 md:h-4" />
                  {myTeacherProfile?.employeeId || 'N/A'}
                </span>
                <span className="items-center gap-1 hidden sm:flex">
                  <Mail className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="truncate max-w-37.5">{myTeacherProfile?.email || user?.email}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 md:w-4 md:h-4" />
                  {myTeacherProfile?.phone || user?.phone}
                </span>
                <span className="items-center gap-1 hidden md:flex">
                  <CalendarDays className="w-3 h-3 md:w-4 md:h-4" />
                  Joined: {myTeacherProfile?.joiningDate ? formatDate(myTeacherProfile.joiningDate) : 'N/A'}
                </span>
              </div>
            </div>
            <div className="flex flex-row sm:flex-col gap-2 text-left sm:text-right items-center sm:items-end">
              <Badge variant="success" className="bg-white/20 text-white border-0">
                Active
              </Badge>
              <p className="text-xs md:text-sm text-blue-100 hidden sm:block">
                Last login: {user?.lastLogin ? formatDate(user.lastLogin) : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard
          title="My Classes"
          value={myClasses.length.toString()}
          icon={<BookOpen className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />}
          iconBgColor="bg-blue-100"
        />
        <StatCard
          title="My Students"
          value={myStudents.length.toString()}
          icon={<Users className="w-5 h-5 md:w-6 md:h-6 text-green-600" />}
          iconBgColor="bg-green-100"
        />
        <StatCard
          title="My Assignments"
          value={myAssignments.length.toString()}
          icon={<FileText className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />}
          iconBgColor="bg-purple-100"
        />
        <StatCard
          title="Weekly Hours"
          value={weeklyTeachingHours.toString()}
          icon={<Clock className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />}
          iconBgColor="bg-orange-100"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Weekly Attendance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm md:text-base">
              <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              Weekly Class Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart
              data={[
                { name: 'Mon', value: Math.round(myStudents.length * 0.95) },
                { name: 'Tue', value: Math.round(myStudents.length * 0.92) },
                { name: 'Wed', value: Math.round(myStudents.length * 0.88) },
                { name: 'Thu', value: Math.round(myStudents.length * 0.94) },
                { name: 'Fri', value: Math.round(myStudents.length * 0.90) },
              ]}
              height={220}
              color={CHART_COLORS.primary}
            />
          </CardContent>
        </Card>

        {/* Assignment Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm md:text-base">
              <FileText className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
              Assignment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={[
                { name: 'Published', value: myAssignments.filter(a => a.status === 'published').length || 2, color: CHART_COLORS.success },
                { name: 'Draft', value: myAssignments.filter(a => a.status === 'draft').length || 1, color: CHART_COLORS.warning },
                { name: 'Closed', value: myAssignments.filter(a => a.status === 'closed').length || 1, color: CHART_COLORS.info },
              ]}
              height={200}
              centerValue={myAssignments.length || 4}
              centerLabel="Total"
            />
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm md:text-base">
            <ClipboardCheck className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
            Monthly Teaching Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleAreaChart
            data={[
              { name: 'Aug', value: 85, value2: 78 },
              { name: 'Sep', value: 88, value2: 82 },
              { name: 'Oct', value: 92, value2: 85 },
              { name: 'Nov', value: 90, value2: 88 },
              { name: 'Dec', value: 94, value2: 90 },
              { name: 'Jan', value: 96, value2: 92 },
            ]}
            height={220}
            color={CHART_COLORS.success}
            color2={CHART_COLORS.primary}
            showLegend={true}
            label="Attendance %"
            label2="Assignment Completion %"
          />
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column - 2 cols */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                Today's Class Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 md:space-y-3">
                {mySubjects.length > 0 ? (
                  mySubjects.slice(0, 4).map((subject, index) => {
                    const classInfo = DEMO_CLASSES.find(c => c.id === subject.classId);
                    const times = ['08:00 - 08:45', '09:00 - 09:45', '10:00 - 10:45', '11:00 - 11:45'];
                    const statuses = ['completed', 'ongoing', 'upcoming', 'upcoming'];
                    
                    return (
                      <div
                        key={subject.id}
                        className={cn(
                          'flex items-center gap-2 md:gap-4 p-2 md:p-3 rounded-lg border',
                          statuses[index] === 'completed' && 'bg-green-50 border-green-200',
                          statuses[index] === 'ongoing' && 'bg-blue-50 border-blue-200',
                          statuses[index] === 'upcoming' && 'bg-gray-50 border-gray-200'
                        )}
                      >
                        <div className="text-center min-w-17.5 md:min-w-22.5">
                          <p className="text-xs md:text-sm font-medium text-gray-900">{times[index]}</p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm md:text-base truncate">{classInfo?.name || 'Unknown'}</p>
                          <p className="text-xs md:text-sm text-gray-500 truncate">{subject.name}</p>
                        </div>
                        <Badge 
                          variant={
                            statuses[index] === 'completed' ? 'success' : 
                            statuses[index] === 'ongoing' ? 'info' : 'default'
                          }
                        >
                          {statuses[index].charAt(0).toUpperCase() + statuses[index].slice(1)}
                        </Badge>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-center py-4">No classes scheduled today</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* My Classes */}
          <Card>
            <CardHeader
              action={
                <Link href="/attendance">
                  <Button variant="ghost" size="sm">
                    Take Attendance <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              }
            >
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-green-600" />
                My Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {myClasses.length > 0 ? (
                <div className="space-y-4">
                  {myClasses.map((cls) => {
                    const students = getStudentsByClass(cls.id);
                    const subjects = DEMO_SUBJECTS.filter(s => s.classId === cls.id);
                    return (
                      <div
                        key={cls.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-lg font-bold text-green-600">{cls.grade}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{cls.name}</p>
                            <p className="text-sm text-gray-500">
                              {students.length} Students • {subjects.length} Subjects
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/attendance?class=${cls.id}`}>
                            <Button variant="outline" size="sm">
                              <ClipboardCheck className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/students?class=${cls.id}`}>
                            <Button variant="outline" size="sm">
                              <Users className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No classes assigned as class teacher</p>
              )}
            </CardContent>
          </Card>

          {/* My Assignments */}
          <Card>
            <CardHeader
              action={
                <Link href="/assignments">
                  <Button variant="ghost" size="sm">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              }
            >
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                My Assignments
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {myAssignments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myAssignments.slice(0, 5).map((assignment) => {
                      const classInfo = DEMO_CLASSES.find(c => c.id === assignment.classId);
                      const isOverdue = new Date(assignment.dueDate) < new Date();
                      return (
                        <TableRow key={assignment.id}>
                          <TableCell>
                            <p className="font-medium">{assignment.title}</p>
                            <p className="text-xs text-gray-500">Max: {assignment.maxMarks} marks</p>
                          </TableCell>
                          <TableCell>{classInfo?.name}</TableCell>
                          <TableCell>
                            <span className={cn('text-sm', isOverdue && 'text-red-600')}>
                              {formatDate(assignment.dueDate)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={assignment.status === 'published' ? 'success' : 'warning'}>
                              {assignment.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 text-center py-8">No assignments created yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - 1 col */}
        <div className="space-y-6">
          {/* Attendance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-orange-600" />
                Today's Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                    <p className="text-2xl font-bold text-green-700 mt-1">{attendanceStats.present}</p>
                    <p className="text-xs text-green-600">Present</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg text-center">
                    <XCircle className="w-5 h-5 text-red-600 mx-auto" />
                    <p className="text-2xl font-bold text-red-700 mt-1">{attendanceStats.absent}</p>
                    <p className="text-xs text-red-600">Absent</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <Users className="w-5 h-5 text-blue-600 mx-auto" />
                    <p className="text-2xl font-bold text-blue-700 mt-1">{attendanceStats.total}</p>
                    <p className="text-xs text-blue-600">Total</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Attendance Rate</span>
                    <span className="text-sm font-medium">
                      {attendanceStats.total > 0
                        ? Math.round((attendanceStats.present / attendanceStats.total) * 100)
                        : 0}%
                    </span>
                  </div>
                  <Progress
                    value={attendanceStats.present}
                    max={attendanceStats.total || 1}
                    variant="success"
                    size="lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Salary Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Salary Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-lg">
                  <p className="text-sm text-gray-600">Monthly Salary</p>
                  <p className="text-2xl font-bold text-green-700">
                    {formatCurrency(myTeacherProfile?.salary || 0)}
                  </p>
                </div>
                {lastSalary && (
                  <div className="space-y-3 pt-3 border-t">
                    <h4 className="text-sm font-medium text-gray-700">Last Payment</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Basic</span>
                        <span className="font-medium">{formatCurrency(lastSalary.basicSalary)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Allowances</span>
                        <span className="font-medium text-green-600">+{formatCurrency(lastSalary.allowances)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Deductions</span>
                        <span className="font-medium text-red-600">-{formatCurrency(lastSalary.deductions)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="font-medium">Net Salary</span>
                        <span className="font-bold text-green-700">{formatCurrency(lastSalary.netSalary)}</span>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <Badge variant={lastSalary.status === PaymentStatus.COMPLETED ? 'success' : 'warning'}>
                          {lastSalary.status}
                        </Badge>
                        {lastSalary.paidDate && (
                          <span className="text-xs text-gray-500">
                            Paid on {formatDate(lastSalary.paidDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <QuickAction
                  icon={<ClipboardCheck className="w-5 h-5" />}
                  label="Attendance"
                  href="/attendance"
                  color="blue"
                />
                <QuickAction
                  icon={<FileText className="w-5 h-5" />}
                  label="Assignment"
                  href="/assignments"
                  color="green"
                />
                <QuickAction
                  icon={<BookOpen className="w-5 h-5" />}
                  label="Notes"
                  href="/notes"
                  color="purple"
                />
                <QuickAction
                  icon={<Users className="w-5 h-5" />}
                  label="Students"
                  href="/students"
                  color="orange"
                />
              </div>
            </CardContent>
          </Card>

          {/* My Subjects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                My Subjects
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mySubjects.length > 0 ? (
                <div className="space-y-2">
                  {mySubjects.map((subject) => {
                    const classInfo = DEMO_CLASSES.find(c => c.id === subject.classId);
                    return (
                      <div
                        key={subject.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-sm">{subject.name}</p>
                          <p className="text-xs text-gray-500">{classInfo?.name}</p>
                        </div>
                        <Badge variant="info">{subject.code}</Badge>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4 text-sm">No subjects assigned</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

function QuickAction({ icon, label, href, color }: QuickActionProps) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    green: 'bg-green-50 text-green-600 hover:bg-green-100',
    purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
  };

  return (
    <Link
      href={href}
      className={cn(
        'flex flex-col items-center justify-center p-4 rounded-xl transition-colors',
        colors[color]
      )}
    >
      {icon}
      <span className="mt-2 text-xs font-medium">{label}</span>
    </Link>
  );
}
