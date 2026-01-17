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
import { DEMO_SALARY_PAYMENTS, DEMO_TEACHERS } from '@/lib/demo-data';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { MONTHS } from '@/lib/constants';
import { PaymentStatus } from '@/lib/types';
import {
  Banknote,
  Users,
  CheckCircle,
  Clock,
  Search,
  Download,
  Plus,
  Printer,
  Calculator,
  Wallet,
  AlertCircle,
} from 'lucide-react';

export default function SalaryPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [monthFilter, setMonthFilter] = React.useState<string>('all');
  const [isPaySalaryOpen, setIsPaySalaryOpen] = React.useState(false);
  const [isGenerateOpen, setIsGenerateOpen] = React.useState(false);
  const [selectedSalary, setSelectedSalary] = React.useState<string | null>(null);
  const [showSuccess, setShowSuccess] = React.useState(false);

  // Calculate stats
  const totalSalaryBudget = DEMO_TEACHERS.filter((t) => t.isActive).reduce((sum, t) => sum + t.salary, 0);
  const paidSalaries = DEMO_SALARY_PAYMENTS
    .filter((s) => s.status === PaymentStatus.COMPLETED)
    .reduce((sum, s) => sum + s.netSalary, 0);
  const pendingSalaries = DEMO_SALARY_PAYMENTS
    .filter((s) => s.status === PaymentStatus.PENDING)
    .reduce((sum, s) => sum + s.netSalary, 0);
  const totalTeachers = DEMO_TEACHERS.filter((t) => t.isActive).length;

  // Filter salary records
  const filteredSalaries = DEMO_SALARY_PAYMENTS.filter((salary) => {
    const teacher = DEMO_TEACHERS.find((t) => t.id === salary.teacherId);
    const matchesSearch =
      searchQuery === '' ||
      teacher?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher?.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher?.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || salary.status === statusFilter;
    const matchesMonth = monthFilter === 'all' || salary.month === parseInt(monthFilter);
    return matchesSearch && matchesStatus && matchesMonth;
  });

  const handlePaySalary = (salaryId: string) => {
    setSelectedSalary(salaryId);
    setIsPaySalaryOpen(true);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Salary Management"
        description="Manage teacher salary payments and payroll"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Finance', href: '/finance' },
          { label: 'Salary Management' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={() => setIsGenerateOpen(true)}>
              <Calculator className="w-4 h-4 mr-2" />
              Generate Payroll
            </Button>
            <Button onClick={() => setIsPaySalaryOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Pay Salary
            </Button>
          </div>
        }
      />

      {/* Success Alert */}
      {showSuccess && (
        <Alert type="success" title="Success!" className="mb-6">
          Salary payment processed successfully.
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Monthly Salary Budget"
          value={formatCurrency(totalSalaryBudget)}
          icon={<Wallet className="w-6 h-6 text-blue-600" />}
          iconBgColor="bg-blue-100"
        />
        <StatCard
          title="Paid This Month"
          value={formatCurrency(paidSalaries)}
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          iconBgColor="bg-green-100"
        />
        <StatCard
          title="Pending Payments"
          value={formatCurrency(pendingSalaries)}
          icon={<Clock className="w-6 h-6 text-yellow-600" />}
          iconBgColor="bg-yellow-100"
        />
        <StatCard
          title="Total Teachers"
          value={totalTeachers.toString()}
          icon={<Users className="w-6 h-6 text-purple-600" />}
          iconBgColor="bg-purple-100"
        />
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by teacher name or employee ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <Select
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'pending', label: 'Pending' },
                { value: 'completed', label: 'Completed' },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="md:w-40"
            />
            <Select
              options={[
                { value: 'all', label: 'All Months' },
                ...MONTHS,
              ]}
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="md:w-40"
            />
          </div>
        </CardContent>
      </Card>

      {/* Salary Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="w-5 h-5" />
            Salary Records
            <span className="text-gray-500 font-normal ml-2">
              ({filteredSalaries.length} records)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Basic Salary</TableHead>
                <TableHead className="text-right">Allowances</TableHead>
                <TableHead className="text-right">Deductions</TableHead>
                <TableHead className="text-right">Net Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSalaries.map((salary) => {
                const teacher = DEMO_TEACHERS.find((t) => t.id === salary.teacherId);
                return (
                  <TableRow key={salary.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={teacher?.avatar}
                          alt={`${teacher?.firstName} ${teacher?.lastName}`}
                          size="sm"
                        />
                        <div>
                          <span className="font-medium block">
                            {teacher?.firstName} {teacher?.lastName}
                          </span>
                          <span className="text-xs text-gray-500">{teacher?.employeeId}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">
                        {MONTHS.find((m) => m.value === salary.month)?.label} {salary.year}
                      </Badge>
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
                        {salary.status === PaymentStatus.COMPLETED ? 'Paid' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {salary.status === PaymentStatus.PENDING ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handlePaySalary(salary.id)}
                          >
                            <Banknote className="w-4 h-4 mr-1" />
                            Pay
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm">
                            <Printer className="w-4 h-4 mr-1" />
                            Slip
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

      {/* Pay Salary Modal */}
      <Modal
        isOpen={isPaySalaryOpen}
        onClose={() => setIsPaySalaryOpen(false)}
        title="Process Salary Payment"
        size="md"
      >
        <PaySalaryForm
          salaryId={selectedSalary}
          onClose={() => {
            setIsPaySalaryOpen(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
          }}
        />
      </Modal>

      {/* Generate Payroll Modal */}
      <Modal
        isOpen={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
        title="Generate Monthly Payroll"
        size="md"
      >
        <GeneratePayrollForm onClose={() => setIsGenerateOpen(false)} />
      </Modal>
    </DashboardLayout>
  );
}

// ============================================
// PAY SALARY FORM
// ============================================

function PaySalaryForm({ salaryId, onClose }: { salaryId: string | null; onClose: () => void }) {
  const salary = DEMO_SALARY_PAYMENTS.find((s) => s.id === salaryId);
  const teacher = DEMO_TEACHERS.find((t) => t.id === salary?.teacherId);

  // If no salary selected, show teacher selection form
  if (!salary) {
    return (
      <form className="space-y-4">
        <Select
          label="Teacher"
          options={DEMO_TEACHERS.filter((t) => t.isActive).map((t) => ({
            value: t.id,
            label: `${t.firstName} ${t.lastName} (${t.employeeId})`,
          }))}
          placeholder="Select teacher"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Month"
            options={MONTHS}
            placeholder="Select month"
            required
          />
          <Input
            label="Year"
            type="number"
            defaultValue="2026"
            required
          />
        </div>
        <Input
          label="Basic Salary"
          type="number"
          placeholder="0.00"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Allowances"
            type="number"
            placeholder="0.00"
          />
          <Input
            label="Deductions"
            type="number"
            placeholder="0.00"
          />
        </div>
        <Select
          label="Payment Method"
          options={[
            { value: 'bank', label: 'Bank Transfer' },
            { value: 'cash', label: 'Cash' },
            { value: 'cheque', label: 'Cheque' },
          ]}
          placeholder="Select payment method"
          required
        />

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Process Payment
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <Avatar
            src={teacher?.avatar}
            alt={`${teacher?.firstName} ${teacher?.lastName}`}
            size="md"
          />
          <div>
            <h3 className="font-semibold">{teacher?.firstName} {teacher?.lastName}</h3>
            <p className="text-sm text-gray-500">{teacher?.employeeId}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Period:</span>
            <p className="font-medium">
              {MONTHS.find((m) => m.value === salary.month)?.label} {salary.year}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Subject:</span>
            <p className="font-medium">{teacher?.specialization}</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Basic Salary</span>
          <span className="font-medium">{formatCurrency(salary.basicSalary)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-green-600">+ Allowances</span>
          <span className="font-medium text-green-600">+{formatCurrency(salary.allowances)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-red-600">- Deductions</span>
          <span className="font-medium text-red-600">-{formatCurrency(salary.deductions)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t pt-2">
          <span>Net Salary</span>
          <span>{formatCurrency(salary.netSalary)}</span>
        </div>
      </div>

      <Select
        label="Payment Method"
        options={[
          { value: 'bank', label: 'Bank Transfer' },
          { value: 'cash', label: 'Cash' },
          { value: 'cheque', label: 'Cheque' },
        ]}
        placeholder="Select payment method"
        required
      />
      <Input
        label="Transaction Reference"
        type="text"
        placeholder="Bank reference number"
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

// ============================================
// GENERATE PAYROLL FORM
// ============================================

function GeneratePayrollForm({ onClose }: { onClose: () => void }) {
  return (
    <form className="space-y-4">
      <Alert type="info" title="Generate Payroll">
        This will generate salary records for all active teachers for the selected month.
      </Alert>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Month"
          options={MONTHS}
          placeholder="Select month"
          required
        />
        <Input
          label="Year"
          type="number"
          defaultValue="2026"
          required
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-3">Payroll Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Teachers</span>
            <span className="font-medium">{DEMO_TEACHERS.filter((t) => t.isActive).length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Basic Salary</span>
            <span className="font-medium">
              {formatCurrency(DEMO_TEACHERS.filter((t) => t.isActive).reduce((sum, t) => sum + t.salary, 0))}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" onClick={onClose}>
          <Calculator className="w-4 h-4 mr-2" />
          Generate Payroll
        </Button>
      </div>
    </form>
  );
}
