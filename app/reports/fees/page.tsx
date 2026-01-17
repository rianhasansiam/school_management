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
  DEMO_FEES,
  DEMO_STUDENTS,
  DEMO_CLASSES,
} from '@/lib/demo-data';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { MONTHS } from '@/lib/constants';
import { PaymentStatus } from '@/lib/types';
import {
  Receipt,
  Download,
  Printer,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Users,
} from 'lucide-react';

const FEE_TYPES = [
  { value: 'tuition', label: 'Tuition Fee' },
  { value: 'admission', label: 'Admission Fee' },
  { value: 'exam', label: 'Exam Fee' },
  { value: 'library', label: 'Library Fee' },
  { value: 'transport', label: 'Transport Fee' },
  { value: 'lab', label: 'Lab Fee' },
  { value: 'sports', label: 'Sports Fee' },
];

export default function FeeReportPage() {
  const [selectedClass, setSelectedClass] = React.useState<string>('all');
  const [selectedMonth, setSelectedMonth] = React.useState<string>('1');
  const [selectedYear, setSelectedYear] = React.useState<string>('2026');
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all');

  // Calculate stats
  const totalFees = DEMO_FEES.reduce((sum, f) => sum + f.amount, 0);
  const collectedFees = DEMO_FEES
    .filter((f) => f.status === PaymentStatus.COMPLETED)
    .reduce((sum, f) => sum + f.amount, 0);
  const pendingFees = DEMO_FEES
    .filter((f) => f.status === PaymentStatus.PENDING)
    .reduce((sum, f) => sum + f.amount, 0);
  const overdueFees = DEMO_FEES
    .filter((f) => f.status === PaymentStatus.PENDING && new Date(f.dueDate) < new Date())
    .reduce((sum, f) => sum + f.amount, 0);

  const collectionRate = totalFees > 0 ? (collectedFees / totalFees) * 100 : 0;

  // Filter fees
  const filteredFees = DEMO_FEES.filter((fee) => {
    const student = DEMO_STUDENTS.find((s) => s.id === fee.studentId);
    const matchesClass = selectedClass === 'all' || student?.classId === selectedClass;
    const matchesStatus = selectedStatus === 'all' || fee.status === selectedStatus;
    return matchesClass && matchesStatus;
  });

  // Class-wise collection summary
  const classWiseCollection = DEMO_CLASSES.map((cls) => {
    const classStudents = DEMO_STUDENTS.filter((s) => s.classId === cls.id);
    const classFees = DEMO_FEES.filter((f) =>
      classStudents.some((s) => s.id === f.studentId)
    );
    const totalAmount = classFees.reduce((sum, f) => sum + f.amount, 0);
    const collectedAmount = classFees
      .filter((f) => f.status === PaymentStatus.COMPLETED)
      .reduce((sum, f) => sum + f.amount, 0);
    const pendingAmount = totalAmount - collectedAmount;
    const rate = totalAmount > 0 ? (collectedAmount / totalAmount) * 100 : 0;

    return {
      ...cls,
      studentCount: classStudents.length,
      totalAmount,
      collectedAmount,
      pendingAmount,
      rate,
    };
  });

  // Fee type distribution
  const feeTypeDistribution = FEE_TYPES.map((type) => {
    const typeFees = DEMO_FEES.filter((f) => f.feeType === type.value);
    const total = typeFees.reduce((sum, f) => sum + f.amount, 0);
    const collected = typeFees
      .filter((f) => f.status === PaymentStatus.COMPLETED)
      .reduce((sum, f) => sum + f.amount, 0);

    return {
      ...type,
      total,
      collected,
      pending: total - collected,
    };
  }).filter((t) => t.total > 0);

  return (
    <DashboardLayout>
      <PageHeader
        title="Fee Collection Report"
        description="Comprehensive fee collection analysis and reports"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Reports', href: '/reports' },
          { label: 'Fee Collection Report' },
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
          title="Total Fees"
          value={formatCurrency(totalFees)}
          icon={<DollarSign className="w-6 h-6 text-blue-600" />}
          iconBgColor="bg-blue-100"
        />
        <StatCard
          title="Collected"
          value={formatCurrency(collectedFees)}
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          iconBgColor="bg-green-100"
          change={{ value: collectionRate.toFixed(1), type: 'increase' }}
        />
        <StatCard
          title="Pending"
          value={formatCurrency(pendingFees)}
          icon={<Clock className="w-6 h-6 text-yellow-600" />}
          iconBgColor="bg-yellow-100"
        />
        <StatCard
          title="Overdue"
          value={formatCurrency(overdueFees)}
          icon={<AlertCircle className="w-6 h-6 text-red-600" />}
          iconBgColor="bg-red-100"
        />
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
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
            <Select
              label="Status"
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'completed', label: 'Paid' },
                { value: 'pending', label: 'Pending' },
              ]}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="md:w-32"
            />
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Apply
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Collection Rate Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Collection Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#22c55e"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${collectionRate * 3.52} 352`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-600">
                    {collectionRate.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="mt-4 space-y-2 w-full">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    Collected
                  </span>
                  <span className="font-medium">{formatCurrency(collectedFees)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    Pending
                  </span>
                  <span className="font-medium">{formatCurrency(pendingFees)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    Overdue
                  </span>
                  <span className="font-medium">{formatCurrency(overdueFees)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fee Type Distribution */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Fee Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feeTypeDistribution.map((type) => (
                <div key={type.value}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{type.label}</span>
                    <span className="text-sm text-gray-600">
                      {formatCurrency(type.collected)} / {formatCurrency(type.total)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full"
                      style={{ width: `${type.total > 0 ? (type.collected / type.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class-wise Collection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Class-wise Fee Collection
            <Badge variant="info">
              {MONTHS.find((m) => m.value === parseInt(selectedMonth))?.label} {selectedYear}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead className="text-center">Students</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead className="text-right">Collected</TableHead>
                <TableHead className="text-right">Pending</TableHead>
                <TableHead>Collection Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classWiseCollection.map((cls) => (
                <TableRow key={cls.id}>
                  <TableCell>
                    <span className="font-medium">{cls.name}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default">{cls.studentCount}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(cls.totalAmount)}
                  </TableCell>
                  <TableCell className="text-right text-green-600 font-medium">
                    {formatCurrency(cls.collectedAmount)}
                  </TableCell>
                  <TableCell className="text-right text-yellow-600 font-medium">
                    {formatCurrency(cls.pendingAmount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={cls.rate}
                        className="w-20"
                        color={
                          cls.rate >= 90 ? 'green' :
                          cls.rate >= 70 ? 'yellow' : 'red'
                        }
                      />
                      <span
                        className={cn(
                          'text-sm font-medium',
                          cls.rate >= 90 ? 'text-green-600' :
                          cls.rate >= 70 ? 'text-yellow-600' : 'text-red-600'
                        )}
                      >
                        {cls.rate.toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-gray-50 font-bold">
                <TableCell>Total</TableCell>
                <TableCell className="text-center">
                  {classWiseCollection.reduce((sum, c) => sum + c.studentCount, 0)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(classWiseCollection.reduce((sum, c) => sum + c.totalAmount, 0))}
                </TableCell>
                <TableCell className="text-right text-green-600">
                  {formatCurrency(classWiseCollection.reduce((sum, c) => sum + c.collectedAmount, 0))}
                </TableCell>
                <TableCell className="text-right text-yellow-600">
                  {formatCurrency(classWiseCollection.reduce((sum, c) => sum + c.pendingAmount, 0))}
                </TableCell>
                <TableCell>
                  <Badge variant="info">{collectionRate.toFixed(1)}%</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detailed Fee Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Detailed Fee Records
            <span className="text-gray-500 font-normal ml-2">
              ({filteredFees.length} records)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Fee Type</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Paid Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFees.map((fee) => {
                const student = DEMO_STUDENTS.find((s) => s.id === fee.studentId);
                const classInfo = DEMO_CLASSES.find((c) => c.id === student?.classId);
                const isOverdue = fee.status === PaymentStatus.PENDING && new Date(fee.dueDate) < new Date();

                return (
                  <TableRow key={fee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={student?.avatar}
                          alt={`${student?.firstName} ${student?.lastName}`}
                          size="sm"
                        />
                        <div>
                          <span className="font-medium block">
                            {student?.firstName} {student?.lastName}
                          </span>
                          <span className="text-xs text-gray-500">{student?.studentId}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{classInfo?.name}</TableCell>
                    <TableCell>
                      <Badge variant="info">
                        {FEE_TYPES.find((t) => t.value === fee.feeType)?.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={cn(isOverdue && 'text-red-600 font-medium')}>
                        {formatDate(fee.dueDate)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(fee.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          fee.status === PaymentStatus.COMPLETED ? 'success' :
                          isOverdue ? 'danger' : 'warning'
                        }
                      >
                        {fee.status === PaymentStatus.COMPLETED ? 'Paid' :
                         isOverdue ? 'Overdue' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {fee.paidDate ? formatDate(fee.paidDate) : '-'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
