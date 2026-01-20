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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
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
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Users,
  GraduationCap,
  Building,
} from 'lucide-react';

export default function FinancialReportPage() {
  const [selectedMonth, setSelectedMonth] = React.useState<string>('1');
  const [selectedYear, setSelectedYear] = React.useState<string>('2026');
  const [activeTab, setActiveTab] = React.useState<string>('overview');

  // Calculate totals
  const totalIncome = DEMO_TRANSACTIONS
    .filter((t) => t.type === TransactionType.INCOME && t.status === PaymentStatus.COMPLETED)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = DEMO_TRANSACTIONS
    .filter((t) => t.type === TransactionType.EXPENSE && t.status === PaymentStatus.COMPLETED)
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpense;
  const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : '0';

  const totalFeeCollected = DEMO_FEES
    .filter((f) => f.status === PaymentStatus.COMPLETED)
    .reduce((sum, f) => sum + f.amount, 0);

  const totalFeePending = DEMO_FEES
    .filter((f) => f.status === PaymentStatus.PENDING)
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

  // Monthly data for trend
  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    month: MONTHS[i].label.substring(0, 3),
    income: Math.floor(Math.random() * 500000) + 300000,
    expense: Math.floor(Math.random() * 300000) + 200000,
  }));

  // Recent transactions
  const recentTransactions = [...DEMO_TRANSACTIONS]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  // Fee collection summary
  const feeCollectionRate = DEMO_FEES.length > 0
    ? ((DEMO_FEES.filter(f => f.status === PaymentStatus.COMPLETED).length / DEMO_FEES.length) * 100).toFixed(1)
    : '0';

  return (
    <DashboardLayout>
      <PageHeader
        title="Financial Report"
        description="Comprehensive financial analysis and reporting"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Reports', href: '/reports' },
          { label: 'Financial Report' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Print Report
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalIncome)}
          icon={<TrendingUp className="w-5 h-5 text-green-600" />}
          iconBgColor="bg-green-100"
          change={{ value: 12.5, type: 'increase' }}
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(totalExpense)}
          icon={<TrendingDown className="w-5 h-5 text-red-600" />}
          iconBgColor="bg-red-100"
          change={{ value: 8.3, type: 'decrease' }}
        />
        <StatCard
          title="Net Profit"
          value={formatCurrency(netProfit)}
          icon={<Wallet className="w-5 h-5 text-gray-800" />}
          iconBgColor="bg-gray-100"
          change={{ value: parseFloat(profitMargin), type: netProfit > 0 ? 'increase' : 'decrease' }}
        />
        <StatCard
          title="Fee Collection"
          value={formatCurrency(totalFeeCollected)}
          icon={<CreditCard className="w-5 h-5 text-purple-600" />}
          iconBgColor="bg-purple-100"
          change={{ value: parseFloat(feeCollectionRate), type: 'increase' }}
        />
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Period:</span>
            </div>
            <Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-40"
              options={[
                { label: 'All Months', value: 'all' },
                ...MONTHS.map((month) => ({
                  label: month.label,
                  value: String(month.value),
                })),
              ]}
            />
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-32"
              options={[
                { label: '2026', value: '2026' },
                { label: '2025', value: '2025' },
                { label: '2024', value: '2024' },
              ]}
            />
            <Button variant="outline" size="sm" className="ml-auto">
              <BarChart3 className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="income">Income Analysis</TabsTrigger>
          <TabsTrigger value="expense">Expense Analysis</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Income vs Expense Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-gray-800" />
                  Monthly Income vs Expense Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.slice(0, 6).map((data, index) => (
                    <div key={data.month} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">{data.month}</span>
                        <div className="flex gap-4">
                          <span className="text-green-600">{formatCurrency(data.income)}</span>
                          <span className="text-red-600">{formatCurrency(data.expense)}</span>
                        </div>
                      </div>
                      <div className="flex gap-1 h-4">
                        <div
                          className="bg-green-500 rounded-l"
                          style={{ width: `${(data.income / 800000) * 100}%` }}
                        />
                        <div
                          className="bg-red-500 rounded-r"
                          style={{ width: `${(data.expense / 800000) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-6 mt-6 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-500" />
                    <span className="text-sm text-gray-600">Income</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-red-500" />
                    <span className="text-sm text-gray-600">Expense</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-800" />
                  Financial Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-700">{formatCurrency(totalIncome)}</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-700">{formatCurrency(totalExpense)}</p>
                </div>
                <div className={cn(
                  "p-4 rounded-lg",
                  netProfit >= 0 ? "bg-gray-50" : "bg-orange-50"
                )}>
                  <p className={cn(
                    "text-sm font-medium",
                    netProfit >= 0 ? "text-gray-600" : "text-orange-600"
                  )}>Net Profit/Loss</p>
                  <p className={cn(
                    "text-2xl font-bold",
                    netProfit >= 0 ? "text-gray-800" : "text-orange-700"
                  )}>{formatCurrency(netProfit)}</p>
                </div>
                <div className="pt-4 border-t space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Fee Collected</span>
                    <span className="font-medium">{formatCurrency(totalFeeCollected)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Fee Pending</span>
                    <span className="font-medium text-orange-600">{formatCurrency(totalFeePending)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Salary Paid</span>
                    <span className="font-medium">{formatCurrency(totalSalaryPaid)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Income Analysis Tab */}
        <TabsContent value="income">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Income by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Percentage</TableHead>
                      <TableHead>Distribution</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(incomeByCategory).map(([category, amount]) => {
                      const percentage = totalIncome > 0 ? ((amount / totalIncome) * 100).toFixed(1) : '0';
                      return (
                        <TableRow key={category}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-green-500" />
                              {category}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(amount)}
                          </TableCell>
                          <TableCell className="text-right text-gray-600">
                            {percentage}%
                          </TableCell>
                          <TableCell>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-green-600" />
                  Income Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative w-48 h-48 mx-auto">
                    <svg className="w-full h-full transform -rotate-90">
                      {Object.entries(incomeByCategory).reduce((acc, [category, amount], index, arr) => {
                        const percentage = totalIncome > 0 ? (amount / totalIncome) * 100 : 0;
                        const prevTotal = arr.slice(0, index).reduce((sum, [, a]) => sum + (totalIncome > 0 ? (a / totalIncome) * 100 : 0), 0);
                        const colors = ['#22c55e', '#10b981', '#059669', '#047857', '#065f46'];
                        
                        return [
                          ...acc,
                          <circle
                            key={category}
                            cx="96"
                            cy="96"
                            r="80"
                            fill="none"
                            stroke={colors[index % colors.length]}
                            strokeWidth="32"
                            strokeDasharray={`${percentage * 5.024} ${502.4 - percentage * 5.024}`}
                            strokeDashoffset={`${-prevTotal * 5.024}`}
                          />
                        ];
                      }, [] as React.ReactNode[])}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(totalIncome)}
                        </p>
                        <p className="text-sm text-gray-500">Total Income</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    {Object.entries(incomeByCategory).map(([category, amount], index) => {
                      const colors = ['bg-green-500', 'bg-emerald-500', 'bg-teal-600', 'bg-green-700', 'bg-green-800'];
                      return (
                        <div key={category} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={cn("w-3 h-3 rounded-full", colors[index % colors.length])} />
                            <span className="text-gray-600">{category}</span>
                          </div>
                          <span className="font-medium">{formatCurrency(amount)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Expense Analysis Tab */}
        <TabsContent value="expense">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                  Expense by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Percentage</TableHead>
                      <TableHead>Distribution</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(expenseByCategory).map(([category, amount]) => {
                      const percentage = totalExpense > 0 ? ((amount / totalExpense) * 100).toFixed(1) : '0';
                      return (
                        <TableRow key={category}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-red-500" />
                              {category}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(amount)}
                          </TableCell>
                          <TableCell className="text-right text-gray-600">
                            {percentage}%
                          </TableCell>
                          <TableCell>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                              <div
                                className="bg-red-500 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-red-600" />
                  Expense Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative w-48 h-48 mx-auto">
                    <svg className="w-full h-full transform -rotate-90">
                      {Object.entries(expenseByCategory).reduce((acc, [category, amount], index, arr) => {
                        const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
                        const prevTotal = arr.slice(0, index).reduce((sum, [, a]) => sum + (totalExpense > 0 ? (a / totalExpense) * 100 : 0), 0);
                        const colors = ['#ef4444', '#f87171', '#dc2626', '#b91c1c', '#991b1b'];
                        
                        return [
                          ...acc,
                          <circle
                            key={category}
                            cx="96"
                            cy="96"
                            r="80"
                            fill="none"
                            stroke={colors[index % colors.length]}
                            strokeWidth="32"
                            strokeDasharray={`${percentage * 5.024} ${502.4 - percentage * 5.024}`}
                            strokeDashoffset={`${-prevTotal * 5.024}`}
                          />
                        ];
                      }, [] as React.ReactNode[])}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(totalExpense)}
                        </p>
                        <p className="text-sm text-gray-500">Total Expense</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    {Object.entries(expenseByCategory).map(([category, amount], index) => {
                      const colors = ['bg-red-500', 'bg-red-400', 'bg-red-600', 'bg-red-700', 'bg-red-800'];
                      return (
                        <div key={category} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={cn("w-3 h-3 rounded-full", colors[index % colors.length])} />
                            <span className="text-gray-600">{category}</span>
                          </div>
                          <span className="font-medium">{formatCurrency(amount)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-gray-800" />
                  Year-over-Year Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-500">Metric</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">2025</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">2026</p>
                    </div>
                  </div>
                  {[
                    { label: 'Total Revenue', prev: 4500000, curr: totalIncome },
                    { label: 'Total Expense', prev: 3200000, curr: totalExpense },
                    { label: 'Net Profit', prev: 1300000, curr: netProfit },
                    { label: 'Fee Collection', prev: 3800000, curr: totalFeeCollected },
                  ].map((item) => {
                    const change = item.prev > 0 ? ((item.curr - item.prev) / item.prev) * 100 : 0;
                    return (
                      <div key={item.label} className="grid grid-cols-3 gap-4 items-center py-3 border-b">
                        <p className="text-sm text-gray-600">{item.label}</p>
                        <p className="text-sm font-medium text-center">{formatCurrency(item.prev)}</p>
                        <div className="text-center">
                          <p className="text-sm font-medium">{formatCurrency(item.curr)}</p>
                          <Badge variant={change >= 0 ? 'success' : 'danger'} className="text-xs mt-1">
                            {change >= 0 ? <ArrowUpRight className="w-3 h-3 inline" /> : <ArrowDownRight className="w-3 h-3 inline" />}
                            {Math.abs(change).toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-800" />
                  Key Performance Indicators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      label: 'Profit Margin',
                      value: `${profitMargin}%`,
                      target: '25%',
                      progress: parseFloat(profitMargin),
                      color: 'blue',
                    },
                    {
                      label: 'Fee Collection Rate',
                      value: `${feeCollectionRate}%`,
                      target: '95%',
                      progress: parseFloat(feeCollectionRate),
                      color: 'green',
                    },
                    {
                      label: 'Expense Ratio',
                      value: `${totalIncome > 0 ? ((totalExpense / totalIncome) * 100).toFixed(1) : 0}%`,
                      target: '70%',
                      progress: totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0,
                      color: 'orange',
                    },
                    {
                      label: 'Salary to Revenue',
                      value: `${totalIncome > 0 ? ((totalSalaryPaid / totalIncome) * 100).toFixed(1) : 0}%`,
                      target: '40%',
                      progress: totalIncome > 0 ? (totalSalaryPaid / totalIncome) * 100 : 0,
                      color: 'purple',
                    },
                  ].map((kpi) => (
                    <div key={kpi.label} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{kpi.label}</span>
                        <span className="font-medium">{kpi.value}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              kpi.color === 'blue' && 'bg-gray-800',
                              kpi.color === 'green' && 'bg-green-500',
                              kpi.color === 'orange' && 'bg-orange-500',
                              kpi.color === 'purple' && 'bg-purple-500'
                            )}
                            style={{ width: `${Math.min(kpi.progress, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">Target: {kpi.target}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gray-800" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="text-gray-600">
                        {formatDate(transaction.date)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {transaction.description}
                      </TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.type === TransactionType.INCOME ? 'success' : 'danger'}>
                          {transaction.type === TransactionType.INCOME ? (
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 mr-1" />
                          )}
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell className={cn(
                        "text-right font-medium",
                        transaction.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'
                      )}>
                        {transaction.type === TransactionType.INCOME ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          transaction.status === PaymentStatus.COMPLETED ? 'success' :
                          transaction.status === PaymentStatus.PENDING ? 'warning' : 'danger'
                        }>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
