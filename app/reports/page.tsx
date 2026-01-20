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
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Select,
  Progress,
} from '@/components/ui';
import {
  DEMO_ATTENDANCE,
  DEMO_TRANSACTIONS,
  DEMO_STUDENTS,
  DEMO_CLASSES,
  DEMO_TEACHERS,
  DEMO_FEES,
} from '@/lib/demo-data';
import { formatCurrency, formatDate, formatPercent, cn } from '@/lib/utils';
import { MONTHS, CLASS_OPTIONS } from '@/lib/constants';
import { AttendanceStatus, PaymentStatus, TransactionType } from '@/lib/types';
import {
  FileText,
  Download,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Printer,
  Filter,
} from 'lucide-react';

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Reports"
        description="View and download various reports"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Reports' },
        ]}
        actions={
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        }
      />

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="attendance">
            <TabsList>
              <TabsTrigger value="attendance">
                <Calendar className="w-4 h-4 mr-2" />
                Attendance Report
              </TabsTrigger>
              <TabsTrigger value="financial">
                <DollarSign className="w-4 h-4 mr-2" />
                Financial Report
              </TabsTrigger>
              <TabsTrigger value="students">
                <Users className="w-4 h-4 mr-2" />
                Student Report
              </TabsTrigger>
            </TabsList>

            {/* Attendance Report */}
            <TabsContent value="attendance">
              <AttendanceReport />
            </TabsContent>

            {/* Financial Report */}
            <TabsContent value="financial">
              <FinancialReport />
            </TabsContent>

            {/* Student Report */}
            <TabsContent value="students">
              <StudentReport />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

// ============================================
// ATTENDANCE REPORT
// ============================================

function AttendanceReport() {
  const [selectedClass, setSelectedClass] = React.useState('');
  const [selectedMonth, setSelectedMonth] = React.useState('1');

  // Calculate attendance statistics by class
  const attendanceByClass = React.useMemo(() => {
    return DEMO_CLASSES.map((cls) => {
      const classAttendance = DEMO_ATTENDANCE.filter(
        (a) => a.classId === cls.id
      );
      const total = classAttendance.length;
      const present = classAttendance.filter(
        (a) => a.status === AttendanceStatus.PRESENT
      ).length;
      const absent = classAttendance.filter(
        (a) => a.status === AttendanceStatus.ABSENT
      ).length;
      const late = classAttendance.filter(
        (a) => a.status === AttendanceStatus.LATE
      ).length;

      return {
        class: cls,
        total,
        present,
        absent,
        late,
        attendanceRate: total > 0 ? (present + late) / total : 0,
      };
    });
  }, []);

  const totalStats = React.useMemo(() => {
    const total = DEMO_ATTENDANCE.length;
    const present = DEMO_ATTENDANCE.filter(
      (a) => a.status === AttendanceStatus.PRESENT
    ).length;
    const absent = DEMO_ATTENDANCE.filter(
      (a) => a.status === AttendanceStatus.ABSENT
    ).length;
    const late = DEMO_ATTENDANCE.filter(
      (a) => a.status === AttendanceStatus.LATE
    ).length;

    return {
      total,
      present,
      absent,
      late,
      attendanceRate: total > 0 ? (present + late) / total : 0,
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4">
        <Select
          options={[{ value: '', label: 'All Classes' }, ...CLASS_OPTIONS]}
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="w-48"
        />
        <Select
          options={MONTHS}
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-48"
        />
        <Button variant="outline" size="sm">
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 mb-1">Total Records</div>
            <div className="text-2xl font-bold text-gray-800">
              {totalStats.total}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="text-sm text-green-600 mb-1">Present</div>
            <div className="text-2xl font-bold text-green-800">
              {totalStats.present}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="text-sm text-red-600 mb-1">Absent</div>
            <div className="text-2xl font-bold text-red-800">
              {totalStats.absent}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="text-sm text-orange-600 mb-1">Average Attendance Rate</div>
            <div className="text-2xl font-bold text-orange-800">
              {formatPercent(totalStats.attendanceRate)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class-wise Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Class-wise Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Present</TableHead>
                <TableHead className="text-right">Absent</TableHead>
                <TableHead className="text-right">Late</TableHead>
                <TableHead>Attendance Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceByClass.map((item) => (
                <TableRow key={item.class.id}>
                  <TableCell className="font-medium">
                    {item.class.name} ({item.class.section})
                  </TableCell>
                  <TableCell className="text-right">{item.total}</TableCell>
                  <TableCell className="text-right text-green-600">
                    {item.present}
                  </TableCell>
                  <TableCell className="text-right text-red-600">
                    {item.absent}
                  </TableCell>
                  <TableCell className="text-right text-orange-600">
                    {item.late}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={item.attendanceRate * 100}
                        className="w-24 h-2"
                      />
                      <span className="text-sm">
                        {formatPercent(item.attendanceRate)}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// FINANCIAL REPORT
// ============================================

function FinancialReport() {
  // Calculate income by category
  const incomeByCategory = React.useMemo(() => {
    const incomeTransactions = DEMO_TRANSACTIONS.filter(
      (t) =>
        t.type === TransactionType.INCOME &&
        t.status === PaymentStatus.COMPLETED
    );
    const grouped: Record<string, number> = {};
    incomeTransactions.forEach((t) => {
      grouped[t.category] = (grouped[t.category] || 0) + t.amount;
    });
    return grouped;
  }, []);

  const expenseByCategory = React.useMemo(() => {
    const expenseTransactions = DEMO_TRANSACTIONS.filter(
      (t) =>
        t.type === TransactionType.EXPENSE &&
        t.status === PaymentStatus.COMPLETED
    );
    const grouped: Record<string, number> = {};
    expenseTransactions.forEach((t) => {
      grouped[t.category] = (grouped[t.category] || 0) + t.amount;
    });
    return grouped;
  }, []);

  const totalIncome = Object.values(incomeByCategory).reduce((a, b) => a + b, 0);
  const totalExpense = Object.values(expenseByCategory).reduce(
    (a, b) => a + b,
    0
  );
  const netBalance = totalIncome - totalExpense;

  // Fee collection stats
  const totalFees = DEMO_FEES.reduce((sum, f) => sum + f.amount, 0);
  const collectedFees = DEMO_FEES
    .filter((f) => f.status === PaymentStatus.COMPLETED)
    .reduce((sum, f) => sum + f.amount, 0);
  const pendingFees = totalFees - collectedFees;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-green-600 mb-1">
              <TrendingUp className="w-4 h-4" />
              Total Income
            </div>
            <div className="text-2xl font-bold text-green-800">
              {formatCurrency(totalIncome)}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-red-600 mb-1">
              <TrendingDown className="w-4 h-4" />
              Total Expense
            </div>
            <div className="text-2xl font-bold text-red-800">
              {formatCurrency(totalExpense)}
            </div>
          </CardContent>
        </Card>
        <Card
          className={cn(
            'border',
            netBalance >= 0
              ? 'bg-gray-50 border-gray-200'
              : 'bg-orange-50 border-orange-200'
          )}
        >
          <CardContent className="p-4">
            <div
              className={cn(
                'text-sm mb-1',
                netBalance >= 0 ? 'text-gray-600' : 'text-orange-600'
              )}
            >
              Net Balance
            </div>
            <div
              className={cn(
                'text-2xl font-bold',
                netBalance >= 0 ? 'text-gray-800' : 'text-orange-800'
              )}
            >
              {formatCurrency(netBalance)}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="text-sm text-purple-600 mb-1">Fee Collection Rate</div>
            <div className="text-2xl font-bold text-purple-800">
              {totalFees > 0
                ? formatPercent(collectedFees / totalFees)
                : '0%'}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-700">Income by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(incomeByCategory).map(([category, amount]) => (
                  <TableRow key={category}>
                    <TableCell className="font-medium">
                      {getCategoryLabel(category)}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      {formatCurrency(amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPercent(amount / totalIncome)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-green-50 font-bold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right text-green-700">
                    {formatCurrency(totalIncome)}
                  </TableCell>
                  <TableCell className="text-right">100%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Expense by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-700">Expense by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(expenseByCategory).map(([category, amount]) => (
                  <TableRow key={category}>
                    <TableCell className="font-medium">
                      {getCategoryLabel(category)}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      {formatCurrency(amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPercent(amount / totalExpense)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-red-50 font-bold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right text-red-700">
                    {formatCurrency(totalExpense)}
                  </TableCell>
                  <TableCell className="text-right">100%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Fee Collection Status */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Collection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Total Expected</div>
              <div className="text-xl font-bold">{formatCurrency(totalFees)}</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600 mb-1">Collected</div>
              <div className="text-xl font-bold text-green-700">
                {formatCurrency(collectedFees)}
              </div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-sm text-orange-600 mb-1">Pending</div>
              <div className="text-xl font-bold text-orange-700">
                {formatCurrency(pendingFees)}
              </div>
            </div>
          </div>
          <Progress
            value={totalFees > 0 ? (collectedFees / totalFees) * 100 : 0}
            className="h-4"
          />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Collected: {formatPercent(collectedFees / totalFees)}</span>
            <span>Pending: {formatPercent(pendingFees / totalFees)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// STUDENT REPORT
// ============================================

function StudentReport() {
  // Student statistics
  const totalStudents = DEMO_STUDENTS.length;
  const activeStudents = DEMO_STUDENTS.filter((s) => s.isActive).length;
  const maleStudents = DEMO_STUDENTS.filter(
    (s) => s.gender === 'male'
  ).length;
  const femaleStudents = DEMO_STUDENTS.filter(
    (s) => s.gender === 'female'
  ).length;

  // Students by class
  const studentsByClass = React.useMemo(() => {
    return DEMO_CLASSES.map((cls) => {
      const students = DEMO_STUDENTS.filter((s) => s.classId === cls.id);
      const males = students.filter((s) => s.gender === 'male').length;
      const females = students.filter((s) => s.gender === 'female').length;
      return {
        class: cls,
        total: students.length,
        males,
        females,
      };
    }).filter((item) => item.total > 0);
  }, []);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 mb-1">Total Students</div>
            <div className="text-2xl font-bold text-gray-800">
              {totalStudents}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="text-sm text-green-600 mb-1">Active</div>
            <div className="text-2xl font-bold text-green-800">
              {activeStudents}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-indigo-50 border-indigo-200">
          <CardContent className="p-4">
            <div className="text-sm text-indigo-600 mb-1">Male</div>
            <div className="text-2xl font-bold text-indigo-800">
              {maleStudents}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-pink-50 border-pink-200">
          <CardContent className="p-4">
            <div className="text-sm text-pink-600 mb-1">Female</div>
            <div className="text-2xl font-bold text-pink-800">
              {femaleStudents}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students by Class */}
      <Card>
        <CardHeader>
          <CardTitle>Students by Class</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Male</TableHead>
                <TableHead className="text-right">Female</TableHead>
                <TableHead>Distribution</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentsByClass.map((item) => (
                <TableRow key={item.class.id}>
                  <TableCell className="font-medium">
                    {item.class.name} ({item.class.section})
                  </TableCell>
                  <TableCell className="text-right">{item.total}</TableCell>
                  <TableCell className="text-right text-indigo-600">
                    {item.males}
                  </TableCell>
                  <TableCell className="text-right text-pink-600">
                    {item.females}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 w-32">
                      <div
                        className="h-3 bg-indigo-500 rounded-l"
                        style={{
                          width: `${item.total > 0 ? (item.males / item.total) * 100 : 0}%`,
                        }}
                      />
                      <div
                        className="h-3 bg-pink-500 rounded-r"
                        style={{
                          width: `${item.total > 0 ? (item.females / item.total) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Gender Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Gender Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Male</span>
                <span className="text-sm text-gray-600">
                  {maleStudents} (
                  {formatPercent(maleStudents / totalStudents)})
                </span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{
                    width: `${(maleStudents / totalStudents) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Female</span>
                <span className="text-sm text-gray-600">
                  {femaleStudents} (
                  {formatPercent(femaleStudents / totalStudents)})
                </span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-pink-500 rounded-full"
                  style={{
                    width: `${(femaleStudents / totalStudents) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getCategoryLabel(category: string): string {
  const categories: Record<string, string> = {
    tuition_fee: 'Monthly Tuition',
    admission_fee: 'Admission Fee',
    exam_fee: 'Exam Fee',
    library_fee: 'Library Fee',
    transport_fee: 'Transport Fee',
    other_income: 'Other Income',
    salary: 'Salary',
    utilities: 'Utilities',
    maintenance: 'Maintenance',
    supplies: 'Supplies',
    equipment: 'Equipment',
    transport: 'Transport',
    events: 'Events',
    other_expense: 'Other Expense',
  };
  return categories[category] || category;
}
