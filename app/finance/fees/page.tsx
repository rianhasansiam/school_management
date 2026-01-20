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
  Avatar,
  Alert,
} from '@/components/ui';
import { DEMO_FEES, DEMO_STUDENTS, DEMO_CLASSES } from '@/lib/demo-data';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { MONTHS } from '@/lib/constants';
import { PaymentStatus } from '@/lib/types';
import {
  Receipt,
  CreditCard,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Printer,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

const FEE_TYPES = [
  { value: 'tuition', label: 'Tuition Fee' },
  { value: 'admission', label: 'Admission Fee' },
  { value: 'exam', label: 'Exam Fee' },
  { value: 'library', label: 'Library Fee' },
  { value: 'transport', label: 'Transport Fee' },
  { value: 'lab', label: 'Lab Fee' },
  { value: 'sports', label: 'Sports Fee' },
  { value: 'other', label: 'Other' },
];

export default function FeesPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [classFilter, setClassFilter] = React.useState<string>('all');
  const [isAddFeeOpen, setIsAddFeeOpen] = React.useState(false);
  const [isCollectFeeOpen, setIsCollectFeeOpen] = React.useState(false);
  const [selectedFee, setSelectedFee] = React.useState<string | null>(null);
  const [showSuccess, setShowSuccess] = React.useState(false);

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

  // Filter fees
  const filteredFees = DEMO_FEES.filter((fee) => {
    const student = DEMO_STUDENTS.find((s) => s.id === fee.studentId);
    const matchesSearch =
      searchQuery === '' ||
      student?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student?.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student?.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || fee.status === statusFilter;
    const matchesClass = classFilter === 'all' || student?.classId === classFilter;
    return matchesSearch && matchesStatus && matchesClass;
  });

  const handleCollectFee = (feeId: string) => {
    setSelectedFee(feeId);
    setIsCollectFeeOpen(true);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Fee Collection"
        description="Manage student fee collection and payments"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Finance', href: '/finance' },
          { label: 'Fee Collection' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setIsAddFeeOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Fee
            </Button>
          </div>
        }
      />

      {/* Success Alert */}
      {showSuccess && (
        <Alert type="success" title="Success!" className="mb-6">
          Fee payment recorded successfully.
        </Alert>
      )}

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
          change={{ value: Math.round((collectedFees / totalFees) * 100), type: 'increase' }}
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
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by student name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div className="w-full lg:w-44">
              <Select
                label="Status"
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'completed', label: 'Completed' },
                ]}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
            </div>
            <div className="w-full lg:w-44">
              <Select
                label="Class"
                options={[
                  { value: 'all', label: 'All Classes' },
                  ...DEMO_CLASSES.map((c) => ({ value: c.id, label: c.name })),
                ]}
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
              />
            </div>
            {(searchQuery || statusFilter !== 'all' || classFilter !== 'all') && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setClassFilter('all');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Fees Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Fee Records
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
                <TableHead>Period</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                      {fee.month && MONTHS.find((m) => m.value === fee.month)?.label}{' '}
                      {fee.academicYear}
                    </TableCell>
                    <TableCell>
                      <span className={cn(isOverdue && 'text-red-600 font-medium')}>
                        {formatDate(fee.dueDate)}
                      </span>
                      {isOverdue && (
                        <Badge variant="danger" className="ml-2">Overdue</Badge>
                      )}
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
                        {fee.status === PaymentStatus.COMPLETED ? 'Paid' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {fee.status === PaymentStatus.PENDING ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleCollectFee(fee.id)}
                          >
                            <CreditCard className="w-4 h-4 mr-1" />
                            Collect
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm">
                            <Printer className="w-4 h-4 mr-1" />
                            Receipt
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Fee Modal */}
      <Modal
        isOpen={isAddFeeOpen}
        onClose={() => setIsAddFeeOpen(false)}
        title="Add New Fee"
        size="md"
      >
        <AddFeeForm onClose={() => setIsAddFeeOpen(false)} />
      </Modal>

      {/* Collect Fee Modal */}
      <Modal
        isOpen={isCollectFeeOpen}
        onClose={() => setIsCollectFeeOpen(false)}
        title="Collect Fee Payment"
        size="md"
      >
        <CollectFeeForm
          feeId={selectedFee}
          onClose={() => {
            setIsCollectFeeOpen(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
          }}
        />
      </Modal>
    </DashboardLayout>
  );
}

// ============================================
// ADD FEE FORM
// ============================================

function AddFeeForm({ onClose }: { onClose: () => void }) {
  return (
    <form className="space-y-4">
      <Select
        label="Student"
        options={DEMO_STUDENTS.map((s) => ({
          value: s.id,
          label: `${s.firstName} ${s.lastName} (${s.studentId})`,
        }))}
        placeholder="Select student"
        required
      />
      <Select
        label="Fee Type"
        options={FEE_TYPES}
        placeholder="Select fee type"
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Month"
          options={MONTHS}
          placeholder="Select month"
        />
        <Input
          label="Academic Year"
          type="text"
          defaultValue="2026"
          required
        />
      </div>
      <Input
        label="Amount"
        type="number"
        placeholder="0.00"
        required
      />
      <Input
        label="Due Date"
        type="date"
        required
      />

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Add Fee
        </Button>
      </div>
    </form>
  );
}

// ============================================
// COLLECT FEE FORM
// ============================================

function CollectFeeForm({ feeId, onClose }: { feeId: string | null; onClose: () => void }) {
  const fee = DEMO_FEES.find((f) => f.id === feeId);
  const student = DEMO_STUDENTS.find((s) => s.id === fee?.studentId);

  if (!fee || !student) return null;

  return (
    <form className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <Avatar
            src={student.avatar}
            alt={`${student.firstName} ${student.lastName}`}
            size="md"
          />
          <div>
            <h3 className="font-semibold">{student.firstName} {student.lastName}</h3>
            <p className="text-sm text-gray-500">{student.studentId}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Fee Type:</span>
            <p className="font-medium">{FEE_TYPES.find((t) => t.value === fee.feeType)?.label}</p>
          </div>
          <div>
            <span className="text-gray-500">Amount:</span>
            <p className="font-medium text-lg">{formatCurrency(fee.amount)}</p>
          </div>
          <div>
            <span className="text-gray-500">Period:</span>
            <p className="font-medium">
              {fee.month && MONTHS.find((m) => m.value === fee.month)?.label} {fee.academicYear}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Due Date:</span>
            <p className="font-medium">{formatDate(fee.dueDate)}</p>
          </div>
        </div>
      </div>

      <Select
        label="Payment Method"
        options={[
          { value: 'cash', label: 'Cash' },
          { value: 'bank', label: 'Bank Transfer' },
          { value: 'card', label: 'Card Payment' },
          { value: 'mobile', label: 'Mobile Banking' },
        ]}
        placeholder="Select payment method"
        required
      />
      <Input
        label="Receipt Number"
        type="text"
        placeholder="Auto-generated"
      />
      <Input
        label="Remarks (Optional)"
        type="text"
        placeholder="Any additional notes"
      />

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" onClick={onClose}>
          <CheckCircle className="w-4 h-4 mr-2" />
          Confirm Payment
        </Button>
      </div>
    </form>
  );
}
