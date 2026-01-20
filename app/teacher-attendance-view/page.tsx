'use client';

import * as React from 'react';
import { DashboardLayout, PageHeader } from '@/components/layout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Avatar,
  Badge,
} from '@/components/ui';
import { DEMO_TEACHERS } from '@/lib/demo-data';
import { formatDate, cn } from '@/lib/utils';
import { AttendanceStatus, Teacher } from '@/lib/types';
import {
  CheckCircle,
  XCircle,
  Users,
  Calendar,
  UserCheck,
  UserX,
  Clock,
} from 'lucide-react';

// Generate random attendance for today (in real app, this would come from backend)
function generateTodayAttendance(teachers: Teacher[]): Map<string, AttendanceStatus> {
  const attendance = new Map<string, AttendanceStatus>();
  
  teachers.forEach((teacher) => {
    // Generate semi-random attendance based on teacher id for consistency
    const hash = teacher.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const todayDate = new Date().getDate();
    const combined = (hash + todayDate) % 100;
    
    if (combined < 80) {
      attendance.set(teacher.id, AttendanceStatus.PRESENT);
    } else if (combined < 90) {
      attendance.set(teacher.id, AttendanceStatus.LATE);
    } else {
      attendance.set(teacher.id, AttendanceStatus.ABSENT);
    }
  });
  
  return attendance;
}

export default function TeacherAttendanceViewPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<'all' | AttendanceStatus>('all');
  
  // Get only active teachers
  const teachers = DEMO_TEACHERS.filter((t: Teacher) => t.isActive);
  
  // Generate today's attendance
  const todayAttendance = React.useMemo(() => generateTodayAttendance(teachers), []);
  
  // Filter teachers based on search and status filter
  const filteredTeachers = teachers.filter((teacher: Teacher) => {
    const matchesSearch = 
      teacher.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const status = todayAttendance.get(teacher.id);
    const matchesFilter = filterStatus === 'all' || status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });
  
  // Calculate summary
  const summary = {
    total: teachers.length,
    present: teachers.filter((t: Teacher) => todayAttendance.get(t.id) === AttendanceStatus.PRESENT).length,
    absent: teachers.filter((t: Teacher) => todayAttendance.get(t.id) === AttendanceStatus.ABSENT).length,
    late: teachers.filter((t: Teacher) => todayAttendance.get(t.id) === AttendanceStatus.LATE).length,
  };
  
  const getStatusBadge = (status: AttendanceStatus | undefined) => {
    switch (status) {
      case AttendanceStatus.PRESENT:
        return (
          <Badge variant="success" className="flex items-center gap-1 w-fit">
            <CheckCircle className="w-3 h-3" />
            Present
          </Badge>
        );
      case AttendanceStatus.ABSENT:
        return (
          <Badge variant="danger" className="flex items-center gap-1 w-fit">
            <XCircle className="w-3 h-3" />
            Absent
          </Badge>
        );
      case AttendanceStatus.LATE:
        return (
          <Badge variant="warning" className="flex items-center gap-1 w-fit">
            <Clock className="w-3 h-3" />
            Late
          </Badge>
        );
      default:
        return (
          <Badge variant="default" className="w-fit">
            Unknown
          </Badge>
        );
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Today's Teacher Attendance"
        description={`View teacher attendance for ${formatDate(new Date(), 'EEEE, dd MMMM yyyy')}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Teacher Attendance' },
        ]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg shrink-0">
                <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-lg md:text-2xl font-bold text-gray-900">{summary.total}</p>
                <p className="text-xs md:text-sm text-gray-500 truncate">Total Teachers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-green-100 rounded-lg shrink-0">
                <UserCheck className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="text-lg md:text-2xl font-bold text-green-600">{summary.present}</p>
                <p className="text-xs md:text-sm text-gray-500">Present</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-red-100 rounded-lg shrink-0">
                <UserX className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
              </div>
              <div className="min-w-0">
                <p className="text-lg md:text-2xl font-bold text-red-600">{summary.absent}</p>
                <p className="text-xs md:text-sm text-gray-500">Absent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-yellow-100 rounded-lg shrink-0">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
              </div>
              <div className="min-w-0">
                <p className="text-lg md:text-2xl font-bold text-yellow-600">{summary.late}</p>
                <p className="text-xs md:text-sm text-gray-500">Late</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, subject, or employee ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  'block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5',
                  'text-gray-900 placeholder:text-gray-400',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500'
                )}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar-mobile pb-1">
              <button
                onClick={() => setFilterStatus('all')}
                className={cn(
                  'px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap',
                  filterStatus === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                All ({summary.total})
              </button>
              <button
                onClick={() => setFilterStatus(AttendanceStatus.PRESENT)}
                className={cn(
                  'px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap',
                  filterStatus === AttendanceStatus.PRESENT
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                Present ({summary.present})
              </button>
              <button
                onClick={() => setFilterStatus(AttendanceStatus.ABSENT)}
                className={cn(
                  'px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap',
                  filterStatus === AttendanceStatus.ABSENT
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                Absent ({summary.absent})
              </button>
              <button
                onClick={() => setFilterStatus(AttendanceStatus.LATE)}
                className={cn(
                  'px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap',
                  filterStatus === AttendanceStatus.LATE
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                Late ({summary.late})
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teacher Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Teacher Attendance - {formatDate(new Date(), 'dd MMMM yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredTeachers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Employee ID</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Qualification</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher: Teacher) => {
                  const status = todayAttendance.get(teacher.id);
                  return (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium text-gray-600">
                        {teacher.employeeId}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={teacher.avatar}
                            alt={`${teacher.firstName} ${teacher.lastName}`}
                            size="sm"
                          />
                          <div>
                            <span className="font-medium block">
                              {teacher.firstName} {teacher.lastName}
                            </span>
                            <span className="text-xs text-gray-500">{teacher.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="info">{teacher.specialization}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-600">{teacher.qualification}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(status)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No teachers found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
