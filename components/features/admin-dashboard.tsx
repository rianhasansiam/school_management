'use client';

import * as React from 'react';
import Link from 'next/link';
import { formatCurrency, formatDate, formatRelativeTime, cn } from '@/lib/utils';
import { DEMO_DASHBOARD_STATS, DEMO_STUDENTS, DEMO_TEACHERS, DEMO_TRANSACTIONS, DEMO_CLASSES } from '@/lib/demo-data';
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
  SimpleLineChart,
  SimpleBarChart,
  DonutChart,
  CHART_COLORS,
} from '@/components/ui';
import {
  Users,
  GraduationCap,
  School,
  Wallet,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowRight,
  UserPlus,
  DollarSign,
  ClipboardCheck,
  FileText,
} from 'lucide-react';

// Chart Data
const monthlyRevenueData = [
  { name: 'Jul', value: 45000, value2: 32000 },
  { name: 'Aug', value: 52000, value2: 38000 },
  { name: 'Sep', value: 48000, value2: 35000 },
  { name: 'Oct', value: 61000, value2: 42000 },
  { name: 'Nov', value: 55000, value2: 39000 },
  { name: 'Dec', value: 67000, value2: 45000 },
  { name: 'Jan', value: 72000, value2: 48000 },
];

const studentEnrollmentData = [
  { name: 'Jul', value: 320 },
  { name: 'Aug', value: 385 },
  { name: 'Sep', value: 412 },
  { name: 'Oct', value: 438 },
  { name: 'Nov', value: 456 },
  { name: 'Dec', value: 478 },
  { name: 'Jan', value: 502 },
];

const attendanceByClassData = [
  { name: 'Class 1', value: 95 },
  { name: 'Class 2', value: 92 },
  { name: 'Class 3', value: 88 },
  { name: 'Class 4', value: 91 },
  { name: 'Class 5', value: 94 },
  { name: 'Class 6', value: 89 },
];

const feeCollectionStatusData = [
  { name: 'Paid', value: 285, color: CHART_COLORS.success },
  { name: 'Pending', value: 65, color: CHART_COLORS.warning },
  { name: 'Overdue', value: 28, color: CHART_COLORS.danger },
];

// ============================================
// ADMIN DASHBOARD
// ============================================

export function AdminDashboard() {
  const stats = DEMO_DASHBOARD_STATS;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents.toLocaleString('en-US')}
          icon={<Users className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />}
          iconBgColor="bg-blue-100"
          change={{ value: 12, type: 'increase' }}
        />
        <StatCard
          title="Total Teachers"
          value={stats.totalTeachers.toLocaleString('en-US')}
          icon={<GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-green-600" />}
          iconBgColor="bg-green-100"
          change={{ value: 5, type: 'increase' }}
        />
        <StatCard
          title="Total Income (This Month)"
          value={formatCurrency(stats.totalIncome)}
          icon={<TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />}
          iconBgColor="bg-emerald-100"
          change={{ value: 8, type: 'increase' }}
        />
        <StatCard
          title="Total Expenses (This Month)"
          value={formatCurrency(stats.totalExpense)}
          icon={<TrendingDown className="w-5 h-5 md:w-6 md:h-6 text-red-600" />}
          iconBgColor="bg-red-100"
          change={{ value: 3, type: 'decrease' }}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
        <StatCard
          title="Average Attendance Rate"
          value={`${stats.attendanceRate}%`}
          icon={<ClipboardCheck className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />}
          iconBgColor="bg-purple-100"
        />
        <StatCard
          title="Pending Fees"
          value={formatCurrency(stats.pendingFees)}
          icon={<DollarSign className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />}
          iconBgColor="bg-orange-100"
        />
        <StatCard
          title="Total Classes"
          value={stats.totalClasses.toLocaleString('en-US')}
          icon={<School className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />}
          iconBgColor="bg-indigo-100"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm md:text-base">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
              Income vs Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleLineChart
              data={monthlyRevenueData}
              height={250}
              color={CHART_COLORS.success}
              color2={CHART_COLORS.danger}
              showLegend={true}
              label="Income"
              label2="Expenses"
            />
          </CardContent>
        </Card>

        {/* Student Enrollment Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm md:text-base">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              Student Enrollment Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleLineChart
              data={studentEnrollmentData}
              height={250}
              color={CHART_COLORS.primary}
            />
          </CardContent>
        </Card>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Attendance by Class */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm md:text-base">
              <ClipboardCheck className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
              Attendance Rate by Class
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart
              data={attendanceByClassData}
              height={220}
              color={CHART_COLORS.secondary}
            />
          </CardContent>
        </Card>

        {/* Fee Collection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm md:text-base">
              <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
              Fee Collection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={feeCollectionStatusData}
              height={220}
              centerValue="378"
              centerLabel="Total"
            />
          </CardContent>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader
            action={
              <Link href="/finance">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            }
          >
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DEMO_TRANSACTIONS.slice(0, 5).map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center gap-2 md:gap-3">
                        <div
                          className={cn(
                            'w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0',
                            transaction.type === 'income'
                              ? 'bg-green-100'
                              : 'bg-red-100'
                          )}
                        >
                          {transaction.type === 'income' ? (
                            <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                          ) : (
                            <TrendingDown className="w-3 h-3 md:w-4 md:h-4 text-red-600" />
                          )}
                        </div>
                        <span className="text-xs md:text-sm truncate max-w-[100px] md:max-w-none">{transaction.description}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs md:text-sm text-gray-500 hidden sm:table-cell">
                      {formatDate(transaction.date)}
                    </TableCell>
                    <TableCell
                      className={cn(
                        'text-right font-medium',
                        transaction.type === 'income'
                          ? 'text-green-600'
                          : 'text-red-600'
                      )}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <ActivityIcon type={activity.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.userName} • {formatRelativeTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students & Teachers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Recent Students */}
        <Card>
          <CardHeader
            action={
              <Link href="/students">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            }
          >
            <CardTitle>Recent Students</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Admission Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DEMO_STUDENTS.slice(0, 5).map((student) => (
                  <TableRow key={student.id}>
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
                    <TableCell className="text-sm text-gray-500">
                      {student.studentId}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(student.admissionDate)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Teachers List */}
        <Card>
          <CardHeader
            action={
              <Link href="/teachers">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            }
          >
            <CardTitle>Teachers</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DEMO_TEACHERS.slice(0, 5).map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={teacher.avatar}
                          alt={`${teacher.firstName} ${teacher.lastName}`}
                          size="sm"
                        />
                        <div>
                          <p className="font-medium">
                            {teacher.firstName} {teacher.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{teacher.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {teacher.specialization}
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
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickAction
              icon={<UserPlus className="w-5 h-5" />}
              label="New Student"
              href="/students/new"
              color="blue"
            />
            <QuickAction
              icon={<GraduationCap className="w-5 h-5" />}
              label="New Teacher"
              href="/teachers/new"
              color="green"
            />
            <QuickAction
              icon={<Wallet className="w-5 h-5" />}
              label="Fee Collection"
              href="/finance/fees"
              color="purple"
            />
            <QuickAction
              icon={<FileText className="w-5 h-5" />}
              label="Generate Report"
              href="/reports"
              color="orange"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================

function ActivityIcon({ type }: { type: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    attendance: <ClipboardCheck className="w-4 h-4 text-purple-600" />,
    payment: <Wallet className="w-4 h-4 text-green-600" />,
    assignment: <FileText className="w-4 h-4 text-blue-600" />,
    student: <Users className="w-4 h-4 text-indigo-600" />,
    salary: <DollarSign className="w-4 h-4 text-orange-600" />,
  };
  return iconMap[type] || <Calendar className="w-4 h-4 text-gray-600" />;
}

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
      <span className="mt-2 text-sm font-medium">{label}</span>
    </Link>
  );
}
