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
  Input,
  Select,
  Modal,
  Alert,
} from '@/components/ui';
import { DEMO_TRANSACTIONS } from '@/lib/demo-data';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { EXPENSE_CATEGORIES } from '@/lib/constants';
import { TransactionType, PaymentStatus } from '@/lib/types';
import {
  TrendingDown,
  Plus,
  Download,
  Search,
  Filter,
  Receipt,
  Building,
  Zap,
  BookOpen,
  Car,
  Wrench,
  ShoppingCart,
  Calendar,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';

const EXPENSE_ICONS: Record<string, React.ReactNode> = {
  salary: <Building className="w-4 h-4" />,
  utilities: <Zap className="w-4 h-4" />,
  stationery: <BookOpen className="w-4 h-4" />,
  transport: <Car className="w-4 h-4" />,
  maintenance: <Wrench className="w-4 h-4" />,
  supplies: <ShoppingCart className="w-4 h-4" />,
  other: <Receipt className="w-4 h-4" />,
};

export default function ExpensesPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');
  const [dateFilter, setDateFilter] = React.useState<string>('all');
  const [isAddExpenseOpen, setIsAddExpenseOpen] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  // Get only expenses
  const expenses = DEMO_TRANSACTIONS.filter((t) => t.type === TransactionType.EXPENSE);

  // Calculate stats
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const thisMonthExpenses = expenses
    .filter((e) => {
      const expenseDate = new Date(e.date);
      const now = new Date();
      return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, e) => sum + e.amount, 0);
  const pendingExpenses = expenses
    .filter((e) => e.status === PaymentStatus.PENDING)
    .reduce((sum, e) => sum + e.amount, 0);

  // Group expenses by category for summary
  const expensesByCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  // Filter expenses
  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      searchQuery === '' ||
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.reference?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <PageHeader
        title="Expense Management"
        description="Track and manage all school expenses"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Finance', href: '/finance' },
          { label: 'Expenses' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setIsAddExpenseOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </div>
        }
      />

      {/* Success Alert */}
      {showSuccess && (
        <Alert type="success" title="Success!" className="mb-6">
          Expense recorded successfully.
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon={<TrendingDown className="w-6 h-6 text-red-600" />}
          iconBgColor="bg-red-100"
        />
        <StatCard
          title="This Month"
          value={formatCurrency(thisMonthExpenses)}
          icon={<Calendar className="w-6 h-6 text-blue-600" />}
          iconBgColor="bg-blue-100"
        />
        <StatCard
          title="Pending Approvals"
          value={formatCurrency(pendingExpenses)}
          icon={<Receipt className="w-6 h-6 text-yellow-600" />}
          iconBgColor="bg-yellow-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Expense List */}
        <div className="lg:col-span-3">
          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search expenses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <Select
                  options={[
                    { value: 'all', label: 'All Categories' },
                    ...EXPENSE_CATEGORIES,
                  ]}
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="md:w-48"
                />
                <Input
                  type="date"
                  className="md:w-40"
                />
              </div>
            </CardContent>
          </Card>

          {/* Expenses Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
                Expense Records
                <span className="text-gray-500 font-normal ml-2">
                  ({filteredExpenses.length} records)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="text-sm">
                        {formatDate(expense.date)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                            {EXPENSE_ICONS[expense.category] || <Receipt className="w-4 h-4" />}
                          </div>
                          <span className="font-medium">{expense.description}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">
                          {EXPENSE_CATEGORIES.find((c) => c.value === expense.category)?.label || expense.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-gray-500">
                        {expense.reference || '-'}
                      </TableCell>
                      <TableCell className="text-right font-medium text-red-600">
                        -{formatCurrency(expense.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            expense.status === PaymentStatus.COMPLETED
                              ? 'success'
                              : expense.status === PaymentStatus.PENDING
                              ? 'warning'
                              : 'danger'
                          }
                        >
                          {expense.status === PaymentStatus.COMPLETED
                            ? 'Paid'
                            : expense.status === PaymentStatus.PENDING
                            ? 'Pending'
                            : expense.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Category Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>By Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(expensesByCategory).map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                        {EXPENSE_ICONS[category] || <Receipt className="w-4 h-4" />}
                      </div>
                      <span className="text-sm font-medium capitalize">{category}</span>
                    </div>
                    <span className="font-semibold text-red-600">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-lg font-bold text-red-600">
                      {formatCurrency(totalExpenses)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Zap className="w-4 h-4 mr-2" />
                Add Utility Bill
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Wrench className="w-4 h-4 mr-2" />
                Add Maintenance
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add Supply Purchase
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Expense Modal */}
      <Modal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        title="Add New Expense"
        size="md"
      >
        <AddExpenseForm
          onClose={() => {
            setIsAddExpenseOpen(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
          }}
        />
      </Modal>
    </DashboardLayout>
  );
}

// ============================================
// ADD EXPENSE FORM
// ============================================

function AddExpenseForm({ onClose }: { onClose: () => void }) {
  return (
    <form className="space-y-4">
      <Select
        label="Category"
        options={EXPENSE_CATEGORIES}
        placeholder="Select category"
        required
      />
      <Input
        label="Description"
        type="text"
        placeholder="Expense description"
        required
      />
      <Input
        label="Amount"
        type="number"
        placeholder="0.00"
        required
      />
      <Input
        label="Date"
        type="date"
        defaultValue={new Date().toISOString().split('T')[0]}
        required
      />
      <Input
        label="Reference/Invoice No."
        type="text"
        placeholder="Optional reference number"
      />
      <Select
        label="Payment Method"
        options={[
          { value: 'cash', label: 'Cash' },
          { value: 'bank', label: 'Bank Transfer' },
          { value: 'cheque', label: 'Cheque' },
          { value: 'card', label: 'Card Payment' },
        ]}
        placeholder="Select payment method"
        required
      />
      <Input
        label="Notes (Optional)"
        type="text"
        placeholder="Additional notes"
      />

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" onClick={onClose}>
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>
    </form>
  );
}
