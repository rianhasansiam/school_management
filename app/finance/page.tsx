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
  Input,
  Select,
  Modal,
} from '@/components/ui';
import { DEMO_TRANSACTIONS, DEMO_SALARY_PAYMENTS, DEMO_TEACHERS, DEMO_FEES, DEMO_STUDENTS } from '@/lib/demo-data';
import { formatCurrency, formatDate, cn, getPaymentStatusColor } from '@/lib/utils';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, MONTHS } from '@/lib/constants';
import { TransactionType, PaymentStatus } from '@/lib/types';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Download,
  Filter,
  DollarSign,
  Receipt,
  Banknote,
  CreditCard,
} from 'lucide-react';

export default function FinancePage() {
  const [isAddIncomeOpen, setIsAddIncomeOpen] = React.useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = React.useState(false);

  // Calculate totals
  const totalIncome = DEMO_TRANSACTIONS
    .filter((t) => t.type === TransactionType.INCOME && t.status === PaymentStatus.COMPLETED)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = DEMO_TRANSACTIONS
    .filter((t) => t.type === TransactionType.EXPENSE && t.status === PaymentStatus.COMPLETED)
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingFees = DEMO_FEES
    .filter((f) => f.status === PaymentStatus.PENDING)
    .reduce((sum, f) => sum + f.amount, 0);

  const paidSalaries = DEMO_SALARY_PAYMENTS
    .filter((s) => s.status === PaymentStatus.COMPLETED)
    .reduce((sum, s) => sum + s.netSalary, 0);

  return (
    <DashboardLayout>
      <PageHeader
        title="Financial Management"
        description="Manage income, expenses, salary and fees"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Finance' },
        ]}
        actions={
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => setIsAddExpenseOpen(true)}>
              <TrendingDown className="w-4 h-4 md:mr-2 text-red-600" />
              <span className="hidden sm:inline">Add Expense</span>
            </Button>
            <Button size="sm" onClick={() => setIsAddIncomeOpen(true)}>
              <TrendingUp className="w-4 h-4 md:mr-2" />
              <span className="hidden sm:inline">Add Income</span>
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-4 md:mb-6">
        <StatCard
          title="Total Income (This Month)"
          value={formatCurrency(totalIncome)}
          icon={<TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-green-600" />}
          iconBgColor="bg-green-100"
          change={{ value: 12, type: 'increase' }}
        />
        <StatCard
          title="Total Expenses (This Month)"
          value={formatCurrency(totalExpense)}
          icon={<TrendingDown className="w-5 h-5 md:w-6 md:h-6 text-red-600" />}
          iconBgColor="bg-red-100"
          change={{ value: 5, type: 'decrease' }}
        />
        <StatCard
          title="Pending Fees"
          value={formatCurrency(pendingFees)}
          icon={<Receipt className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />}
          iconBgColor="bg-orange-100"
        />
        <StatCard
          title="Paid Salaries"
          value={formatCurrency(paidSalaries)}
          icon={<Banknote className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />}
          iconBgColor="bg-blue-100"
        />
      </div>

      {/* Tabs */}
      <Card>
        <CardContent className="p-3 md:p-6">
          <Tabs defaultValue="transactions">
            <TabsList className="flex-wrap">
              <TabsTrigger value="transactions" className="text-xs md:text-sm">Transactions</TabsTrigger>
              <TabsTrigger value="fees" className="text-xs md:text-sm">Fee Collection</TabsTrigger>
              <TabsTrigger value="salary" className="text-xs md:text-sm">Salary</TabsTrigger>
            </TabsList>

            {/* Transactions Tab */}
            <TabsContent value="transactions">
              <TransactionsTable />
            </TabsContent>

            {/* Fees Tab */}
            <TabsContent value="fees">
              <FeesTable />
            </TabsContent>

            {/* Salary Tab */}
            <TabsContent value="salary">
              <SalaryTable />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add Income Modal */}
      <Modal
        isOpen={isAddIncomeOpen}
        onClose={() => setIsAddIncomeOpen(false)}
        title="Add New Income"
        size="md"
      >
        <TransactionForm
          type="income"
          onClose={() => setIsAddIncomeOpen(false)}
        />
      </Modal>

      {/* Add Expense Modal */}
      <Modal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        title="Add New Expense"
        size="md"
      >
        <TransactionForm
          type="expense"
          onClose={() => setIsAddExpenseOpen(false)}
        />
      </Modal>
    </DashboardLayout>
  );
}

// ============================================
// TRANSACTIONS TABLE
// ============================================

function TransactionsTable() {
  const [filter, setFilter] = React.useState<'all' | 'income' | 'expense'>('all');

  const filteredTransactions = DEMO_TRANSACTIONS.filter((t) => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={filter === 'all' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'income' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('income')}
        >
          <TrendingUp className="w-4 h-4 mr-1" />
          Income
        </Button>
        <Button
          variant={filter === 'expense' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('expense')}
        >
          <TrendingDown className="w-4 h-4 mr-1" />
          Expense
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="text-sm">
                {formatDate(transaction.date)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    )}
                  >
                    {transaction.type === 'income' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <span className="font-medium">{transaction.description}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="default">
                  {getCategoryLabel(transaction.category, transaction.type)}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {transaction.reference}
              </TableCell>
              <TableCell
                className={cn(
                  'text-right font-medium',
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                )}
              >
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    transaction.status === PaymentStatus.COMPLETED
                      ? 'success'
                      : transaction.status === PaymentStatus.PENDING
                      ? 'warning'
                      : 'danger'
                  }
                >
                  {getStatusLabel(transaction.status)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ============================================
// FEES TABLE
// ============================================

function FeesTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Fee Type</TableHead>
          <TableHead>Month/Year</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {DEMO_FEES.map((fee) => {
          const student = DEMO_STUDENTS.find((s) => s.id === fee.studentId);
          return (
            <TableRow key={fee.id}>
              <TableCell>
                <span className="font-medium">
                  {student?.firstName} {student?.lastName}
                </span>
                <p className="text-xs text-gray-500">{student?.studentId}</p>
              </TableCell>
              <TableCell>{getFeeTypeLabel(fee.feeType)}</TableCell>
              <TableCell>
                {fee.month && MONTHS.find((m) => m.value === fee.month)?.label}{' '}
                {fee.academicYear}
              </TableCell>
              <TableCell className="text-sm">
                {formatDate(fee.dueDate)}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(fee.amount)}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    fee.status === PaymentStatus.COMPLETED ? 'success' : 'warning'
                  }
                >
                  {getStatusLabel(fee.status)}
                </Badge>
              </TableCell>
              <TableCell>
                {fee.status === PaymentStatus.PENDING && (
                  <Button variant="outline" size="sm">
                    <CreditCard className="w-4 h-4 mr-1" />
                    Receive
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

// ============================================
// SALARY TABLE
// ============================================

function SalaryTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Teacher</TableHead>
          <TableHead>Month/Year</TableHead>
          <TableHead className="text-right">Basic Salary</TableHead>
          <TableHead className="text-right">Allowances</TableHead>
          <TableHead className="text-right">Deductions</TableHead>
          <TableHead className="text-right">Net Salary</TableHead>
          <TableHead>Status</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {DEMO_SALARY_PAYMENTS.map((salary) => {
          const teacher = DEMO_TEACHERS.find((t) => t.id === salary.teacherId);
          return (
            <TableRow key={salary.id}>
              <TableCell>
                <span className="font-medium">
                  {teacher?.firstName} {teacher?.lastName}
                </span>
                <p className="text-xs text-gray-500">{teacher?.employeeId}</p>
              </TableCell>
              <TableCell>
                {MONTHS.find((m) => m.value === salary.month)?.label} {salary.year}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(salary.basicSalary)}
              </TableCell>
              <TableCell className="text-right text-green-600">
                +{formatCurrency(salary.allowances)}
              </TableCell>
              <TableCell className="text-right text-red-600">
                -{formatCurrency(salary.deductions)}
              </TableCell>
              <TableCell className="text-right font-bold">
                {formatCurrency(salary.netSalary)}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    salary.status === PaymentStatus.COMPLETED ? 'success' : 'warning'
                  }
                >
                  {getStatusLabel(salary.status)}
                </Badge>
              </TableCell>
              <TableCell>
                {salary.status === PaymentStatus.PENDING && (
                  <Button variant="outline" size="sm">
                    <Banknote className="w-4 h-4 mr-1" />
                    Pay
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

// ============================================
// TRANSACTION FORM
// ============================================

interface TransactionFormProps {
  type: 'income' | 'expense';
  onClose: () => void;
}

function TransactionForm({ type, onClose }: TransactionFormProps) {
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <form className="space-y-4">
      <Select
        label="Category"
        options={categories}
        placeholder="Select category"
        required
      />
      <Input
        label="Amount (৳)"
        type="number"
        placeholder="0.00"
        required
      />
      <Input
        label="Description"
        placeholder="Transaction description"
        required
      />
      <Input
        label="Date"
        type="date"
        required
      />
      <Input
        label="Reference (Optional)"
        placeholder="Reference number"
      />

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {type === 'income' ? 'Add Income' : 'Add Expense'}
        </Button>
      </div>
    </form>
  );
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getCategoryLabel(category: string, type: string): string {
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  return categories.find((c) => c.value === category)?.label || category;
}

function getFeeTypeLabel(feeType: string): string {
  const types: Record<string, string> = {
    tuition: 'Tuition Fee',
    admission: 'Admission Fee',
    exam: 'Exam Fee',
    library: 'Library Fee',
    transport: 'Transport Fee',
    lab: 'Lab Fee',
    other: 'Other',
  };
  return types[feeType] || feeType;
}

function getStatusLabel(status: string): string {
  const statuses: Record<string, string> = {
    pending: 'Pending',
    completed: 'Completed',
    failed: 'Failed',
    cancelled: 'Cancelled',
  };
  return statuses[status] || status;
}
