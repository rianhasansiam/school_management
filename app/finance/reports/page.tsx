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
} from '@/components/ui';
import { DEMO_TRANSACTIONS, DEMO_FEES, DEMO_SALARY_PAYMENTS, DEMO_TEACHERS, DEMO_STUDENTS } from '@/lib/demo-data';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { MONTHS, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/lib/constants';
import { TransactionType, PaymentStatus } from '@/lib/types';
import {
  TrendingUp,
  TrendingDown,
  Download,
  FileText,
  PieChart,
  BarChart3,
  Calendar,
  DollarSign,
  Wallet,
  Printer,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export default function FinancialReportsPage() {
  const [selectedMonth, setSelectedMonth] = React.useState<string>('1');
  const [selectedYear, setSelectedYear] = React.useState<string>('2026');
  const [reportType, setReportType] = React.useState<string>('summary');

  // Calculate totals
  const totalIncome = DEMO_TRANSACTIONS
    .filter((t) => t.type === TransactionType.INCOME && t.status === PaymentStatus.COMPLETED)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = DEMO_TRANSACTIONS
    .filter((t) => t.type === TransactionType.EXPENSE && t.status === PaymentStatus.COMPLETED)
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpense;

  const totalFeeCollected = DEMO_FEES
    .filter((f) => f.status === PaymentStatus.COMPLETED)
    .reduce((sum, f) => sum + f.amount, 0);

  const totalSalaryPaid = DEMO_SALARY_PAYMENTS
    .filter((s) => s.status === PaymentStatus.COMPLETED)
    .reduce((sum, s) => sum + s.netSalary, 0);

  // Income by category
  const incomeByCategory = DEMO_TRANSACTIONS
    .filter((t) => t.type === TransactionType.INCOME)
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  // Expense by category
  const expenseByCategory = DEMO_TRANSACTIONS
    .filter((t) => t.type === TransactionType.EXPENSE)
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  return (
    <DashboardLayout>
      <PageHeader
        title="Financial Reports"
        description="View and generate financial reports"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Finance', href: '/finance' },
          { label: 'Reports' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <Select
              label="Report Type"
              options={[
                { value: 'summary', label: 'Financial Summary' },
                { value: 'income', label: 'Income Report' },
                { value: 'expense', label: 'Expense Report' },
                { value: 'fee', label: 'Fee Collection Report' },
                { value: 'salary', label: 'Salary Report' },
              ]}
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="md:w-48"
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
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Apply Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          iconBgColor="bg-green-100"
          change={{ value: 12, type: 'increase' }}
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(totalExpense)}
          icon={<TrendingDown className="w-6 h-6 text-red-600" />}
          iconBgColor="bg-red-100"
          change={{ value: 5, type: 'decrease' }}
        />
        <StatCard
          title="Net Profit/Loss"
          value={formatCurrency(netProfit)}
          icon={<Wallet className="w-6 h-6 text-blue-600" />}
          iconBgColor="bg-blue-100"
          change={{ value: netProfit > 0 ? 8 : -8, type: netProfit > 0 ? 'increase' : 'decrease' }}
        />
        <StatCard
          title="Profit Margin"
          value={`${totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0}%`}
          icon={<PieChart className="w-6 h-6 text-purple-600" />}
          iconBgColor="bg-purple-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Income Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-green-600" />
              Income Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(incomeByCategory).map(([category, amount]) => {
                const percentage = totalIncome > 0 ? Math.round((amount / totalIncome) * 100) : 0;
                return (
                  <div key={category}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium capitalize">{category}</span>
                      <span className="text-sm text-gray-600">{formatCurrency(amount)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{percentage}% of total</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowDownRight className="w-5 h-5 text-red-600" />
              Expense Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(expenseByCategory).map(([category, amount]) => {
                const percentage = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
                return (
                  <div key={category}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium capitalize">{category}</span>
                      <span className="text-sm text-gray-600">{formatCurrency(amount)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{percentage}% of total</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Report */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Financial Statement
              <Badge variant="info">
                {MONTHS.find((m) => m.value === parseInt(selectedMonth))?.label} {selectedYear}
              </Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Income Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Income
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DEMO_TRANSACTIONS
                  .filter((t) => t.type === TransactionType.INCOME)
                  .map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <Badge variant="success">
                          {INCOME_CATEGORIES.find((c) => c.value === transaction.category)?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        +{formatCurrency(transaction.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                <TableRow className="bg-green-50 font-bold">
                  <TableCell colSpan={3}>Total Income</TableCell>
                  <TableCell className="text-right text-green-700">
                    {formatCurrency(totalIncome)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Expense Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              Expenses
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DEMO_TRANSACTIONS
                  .filter((t) => t.type === TransactionType.EXPENSE)
                  .map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <Badge variant="danger">
                          {EXPENSE_CATEGORIES.find((c) => c.value === transaction.category)?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell className="text-right font-medium text-red-600">
                        -{formatCurrency(transaction.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                <TableRow className="bg-red-50 font-bold">
                  <TableCell colSpan={3}>Total Expenses</TableCell>
                  <TableCell className="text-right text-red-700">
                    {formatCurrency(totalExpense)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Summary Section */}
          <div className="border-t-2 border-gray-300 pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-700 mb-1">Total Income</p>
                <p className="text-2xl font-bold text-green-700">{formatCurrency(totalIncome)}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-700 mb-1">Total Expenses</p>
                <p className="text-2xl font-bold text-red-700">{formatCurrency(totalExpense)}</p>
              </div>
              <div className={cn(
                'p-4 rounded-lg',
                netProfit >= 0 ? 'bg-blue-50' : 'bg-orange-50'
              )}>
                <p className={cn(
                  'text-sm mb-1',
                  netProfit >= 0 ? 'text-blue-700' : 'text-orange-700'
                )}>
                  Net {netProfit >= 0 ? 'Profit' : 'Loss'}
                </p>
                <p className={cn(
                  'text-2xl font-bold',
                  netProfit >= 0 ? 'text-blue-700' : 'text-orange-700'
                )}>
                  {formatCurrency(Math.abs(netProfit))}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Fee Collection Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Fee Collected</span>
                    <span className="font-semibold text-green-600">{formatCurrency(totalFeeCollected)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pending Fees</span>
                    <span className="font-semibold text-yellow-600">
                      {formatCurrency(DEMO_FEES.filter((f) => f.status === PaymentStatus.PENDING).reduce((sum, f) => sum + f.amount, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Students</span>
                    <span className="font-semibold">{DEMO_STUDENTS.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Salary Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Salary Paid</span>
                    <span className="font-semibold text-red-600">{formatCurrency(totalSalaryPaid)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pending Salaries</span>
                    <span className="font-semibold text-yellow-600">
                      {formatCurrency(DEMO_SALARY_PAYMENTS.filter((s) => s.status === PaymentStatus.PENDING).reduce((sum, s) => sum + s.netSalary, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Teachers</span>
                    <span className="font-semibold">{DEMO_TEACHERS.filter((t) => t.isActive).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
