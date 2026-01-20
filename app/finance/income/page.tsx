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
import { INCOME_CATEGORIES } from '@/lib/constants';
import { TransactionType, PaymentStatus } from '@/lib/types';
import {
  TrendingUp,
  Plus,
  Download,
  Search,
  DollarSign,
  Receipt,
  GraduationCap,
  BookOpen,
  Bus,
  Calendar,
  Eye,
  Edit,
  Trash2,
  CreditCard,
  Gift,
} from 'lucide-react';

const INCOME_ICONS: Record<string, React.ReactNode> = {
  tuition: <GraduationCap className="w-4 h-4" />,
  admission: <CreditCard className="w-4 h-4" />,
  exam: <BookOpen className="w-4 h-4" />,
  library: <BookOpen className="w-4 h-4" />,
  transport: <Bus className="w-4 h-4" />,
  donation: <Gift className="w-4 h-4" />,
  other: <Receipt className="w-4 h-4" />,
};

export default function IncomePage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');
  const [isAddIncomeOpen, setIsAddIncomeOpen] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  // Get only income transactions
  const incomeList = DEMO_TRANSACTIONS.filter((t) => t.type === TransactionType.INCOME);

  // Calculate stats
  const totalIncome = incomeList.reduce((sum, i) => sum + i.amount, 0);
  const thisMonthIncome = incomeList
    .filter((i) => {
      const incomeDate = new Date(i.date);
      const now = new Date();
      return incomeDate.getMonth() === now.getMonth() && incomeDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, i) => sum + i.amount, 0);
  const pendingIncome = incomeList
    .filter((i) => i.status === PaymentStatus.PENDING)
    .reduce((sum, i) => sum + i.amount, 0);

  // Group income by category for summary
  const incomeByCategory = incomeList.reduce((acc, i) => {
    acc[i.category] = (acc[i.category] || 0) + i.amount;
    return acc;
  }, {} as Record<string, number>);

  // Filter income
  const filteredIncome = incomeList.filter((income) => {
    const matchesSearch =
      searchQuery === '' ||
      income.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      income.reference?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || income.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <PageHeader
        title="Income Management"
        description="Track and manage all school income sources"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Finance', href: '/finance' },
          { label: 'Income' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setIsAddIncomeOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Income
            </Button>
          </div>
        }
      />

      {/* Success Alert */}
      {showSuccess && (
        <Alert type="success" title="Success!" className="mb-6">
          Income recorded successfully.
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          iconBgColor="bg-green-100"
        />
        <StatCard
          title="This Month"
          value={formatCurrency(thisMonthIncome)}
          icon={<Calendar className="w-6 h-6 text-gray-800" />}
          iconBgColor="bg-gray-100"
          change={{ value: 15, type: 'increase' }}
        />
        <StatCard
          title="Pending Collection"
          value={formatCurrency(pendingIncome)}
          icon={<Receipt className="w-6 h-6 text-yellow-600" />}
          iconBgColor="bg-yellow-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Income List */}
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
                      placeholder="Search income records..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
                <Select
                  options={[
                    { value: 'all', label: 'All Categories' },
                    ...INCOME_CATEGORIES,
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

          {/* Income Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Income Records
                <span className="text-gray-500 font-normal ml-2">
                  ({filteredIncome.length} records)
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
                  {filteredIncome.map((income) => (
                    <TableRow key={income.id}>
                      <TableCell className="text-sm">
                        {formatDate(income.date)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            {INCOME_ICONS[income.category] || <DollarSign className="w-4 h-4" />}
                          </div>
                          <span className="font-medium">{income.description}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="success">
                          {INCOME_CATEGORIES.find((c) => c.value === income.category)?.label || income.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-gray-500">
                        {income.reference || '-'}
                      </TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        +{formatCurrency(income.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            income.status === PaymentStatus.COMPLETED
                              ? 'success'
                              : income.status === PaymentStatus.PENDING
                              ? 'warning'
                              : 'danger'
                          }
                        >
                          {income.status === PaymentStatus.COMPLETED
                            ? 'Received'
                            : income.status === PaymentStatus.PENDING
                            ? 'Pending'
                            : income.status}
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
                {Object.entries(incomeByCategory).map(([category, amount]) => (
                  <div key={category} className="flex items-center text-black justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full  bg-green-100 flex items-center justify-center text-green-600">
                        {INCOME_ICONS[category] || <DollarSign className="w-4 h-4" />}
                      </div>
                      <span className="text-sm font-medium capitalize">{category}</span>
                    </div>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(totalIncome)}
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
                <GraduationCap className="w-4 h-4 mr-2" />
                Record Tuition Fee
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="w-4 h-4 mr-2" />
                Record Admission Fee
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Gift className="w-4 h-4 mr-2" />
                Record Donation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Income Modal */}
      <Modal
        isOpen={isAddIncomeOpen}
        onClose={() => setIsAddIncomeOpen(false)}
        title="Add New Income"
        size="md"
      >
        <AddIncomeForm
          onClose={() => {
            setIsAddIncomeOpen(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
          }}
        />
      </Modal>
    </DashboardLayout>
  );
}

// ============================================
// ADD INCOME FORM
// ============================================

function AddIncomeForm({ onClose }: { onClose: () => void }) {
  return (
    <form className="space-y-4">
      <Select
        label="Category"
        options={INCOME_CATEGORIES}
        placeholder="Select category"
        required
      />
      <Input
        label="Description"
        type="text"
        placeholder="Income description"
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
        label="Reference/Receipt No."
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
          { value: 'mobile', label: 'Mobile Banking' },
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
          Add Income
        </Button>
      </div>
    </form>
  );
}
