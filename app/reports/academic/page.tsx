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
  Progress,
} from '@/components/ui';
import {
  DEMO_STUDENTS,
  DEMO_CLASSES,
  DEMO_SUBJECTS,
  DEMO_TEACHERS,
  DEMO_ASSIGNMENTS,
} from '@/lib/demo-data';
import { formatDate, cn } from '@/lib/utils';
import { MONTHS } from '@/lib/constants';
import {
  BookOpen,
  Download,
  Printer,
  GraduationCap,
  Award,
  TrendingUp,
  TrendingDown,
  Filter,
  FileText,
  BarChart3,
  Target,
  Users,
  CheckCircle,
} from 'lucide-react';

export default function AcademicReportPage() {
  const [selectedClass, setSelectedClass] = React.useState<string>('all');
  const [selectedSubject, setSelectedSubject] = React.useState<string>('all');
  const [academicYear, setAcademicYear] = React.useState<string>('2026');

  // Get unique subjects
  const uniqueSubjects = [...new Set(DEMO_SUBJECTS.map((s) => s.name))];

  // Generate class-wise performance data
  const classPerformanceData = DEMO_CLASSES.map((cls) => {
    const classStudents = DEMO_STUDENTS.filter((s) => s.classId === cls.id);
    const studentCount = classStudents.length;
    const avgAttendance = Math.floor(Math.random() * 10) + 88; // 88-98%
    const avgExamScore = Math.floor(Math.random() * 20) + 70; // 70-90
    const passRate = Math.floor(Math.random() * 15) + 85; // 85-100%
    const topPerformers = Math.floor(Math.random() * 5) + 3; // 3-8 students
    const teacher = DEMO_TEACHERS.find((t) => t.id === cls.classTeacherId);

    return {
      ...cls,
      studentCount,
      avgAttendance,
      avgExamScore,
      passRate,
      topPerformers,
      classTeacher: teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Not Assigned',
      grade: avgExamScore >= 85 ? 'A' : avgExamScore >= 75 ? 'B' : avgExamScore >= 65 ? 'C' : 'D',
    };
  });

  // Filter by selected class
  const filteredClassData = selectedClass === 'all'
    ? classPerformanceData
    : classPerformanceData.filter((c) => c.id === selectedClass);

  // Generate subject-wise performance data
  const subjectPerformanceData = DEMO_SUBJECTS.map((subject) => {
    const teacher = DEMO_TEACHERS.find((t) => t.id === subject.teacherId);
    const avgScore = Math.floor(Math.random() * 25) + 70; // 70-95
    const passRate = Math.floor(Math.random() * 15) + 80; // 80-95%
    const assignmentCount = Math.floor(Math.random() * 5) + 3; // 3-8

    return {
      ...subject,
      teacher: teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Not Assigned',
      avgScore,
      passRate,
      assignmentCount,
      grade: avgScore >= 85 ? 'A' : avgScore >= 75 ? 'B' : avgScore >= 65 ? 'C' : 'D',
    };
  });

  // Calculate overall stats
  const totalClasses = DEMO_CLASSES.length;
  const totalSubjects = DEMO_SUBJECTS.length;
  const overallAvgScore = Math.round(
    classPerformanceData.reduce((sum, c) => sum + c.avgExamScore, 0) / classPerformanceData.length
  );
  const overallPassRate = Math.round(
    classPerformanceData.reduce((sum, c) => sum + c.passRate, 0) / classPerformanceData.length
  );

  return (
    <DashboardLayout>
      <PageHeader
        title="Academic Report"
        description="Class-wise and subject-wise academic performance analysis"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Reports', href: '/reports' },
          { label: 'Academic Report' },
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
          title="Total Classes"
          value={totalClasses.toString()}
          icon={<BookOpen className="w-6 h-6 text-blue-600" />}
          iconBgColor="bg-blue-100"
        />
        <StatCard
          title="Total Subjects"
          value={totalSubjects.toString()}
          icon={<GraduationCap className="w-6 h-6 text-purple-600" />}
          iconBgColor="bg-purple-100"
        />
        <StatCard
          title="Average Score"
          value={`${overallAvgScore}%`}
          icon={<Target className="w-6 h-6 text-green-600" />}
          iconBgColor="bg-green-100"
          change={{ value: 3.5, type: 'increase' }}
        />
        <StatCard
          title="Overall Pass Rate"
          value={`${overallPassRate}%`}
          icon={<Award className="w-6 h-6 text-yellow-600" />}
          iconBgColor="bg-yellow-100"
          change={{ value: 2.1, type: 'increase' }}
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
              label="Subject"
              options={[
                { value: 'all', label: 'All Subjects' },
                ...uniqueSubjects.map((s) => ({ value: s, label: s })),
              ]}
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="md:w-40"
            />
            <Select
              label="Academic Year"
              options={[
                { value: '2024', label: '2024' },
                { value: '2025', label: '2025' },
                { value: '2026', label: '2026' },
              ]}
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="md:w-32"
            />
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Apply
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Class-wise Performance */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Class-wise Performance
            <Badge variant="info">{academicYear}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead>Class Teacher</TableHead>
                <TableHead className="text-center">Students</TableHead>
                <TableHead className="text-center">Avg. Attendance</TableHead>
                <TableHead className="text-center">Avg. Score</TableHead>
                <TableHead className="text-center">Pass Rate</TableHead>
                <TableHead className="text-center">Top Performers</TableHead>
                <TableHead className="text-center">Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClassData.map((cls) => (
                <TableRow key={cls.id}>
                  <TableCell>
                    <div>
                      <span className="font-medium block">{cls.name}</span>
                      <span className="text-xs text-gray-500">{cls.description}</span>
                    </div>
                  </TableCell>
                  <TableCell>{cls.classTeacher}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default">{cls.studentCount}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Progress value={cls.avgAttendance} className="w-16" />
                      <span className="text-sm">{cls.avgAttendance}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={cn(
                        'font-medium',
                        cls.avgExamScore >= 80 ? 'text-green-600' :
                        cls.avgExamScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                      )}
                    >
                      {cls.avgExamScore}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        cls.passRate >= 90 ? 'success' :
                        cls.passRate >= 75 ? 'warning' : 'danger'
                      }
                    >
                      {cls.passRate}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span>{cls.topPerformers}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        cls.grade === 'A' ? 'success' :
                        cls.grade === 'B' ? 'info' :
                        cls.grade === 'C' ? 'warning' : 'danger'
                      }
                    >
                      {cls.grade}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject-wise Performance */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Subject-wise Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead className="text-center">Avg. Score</TableHead>
                    <TableHead className="text-center">Pass Rate</TableHead>
                    <TableHead className="text-center">Assignments</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjectPerformanceData
                    .filter((s) => selectedSubject === 'all' || s.name === selectedSubject)
                    .slice(0, 10)
                    .map((subject) => (
                      <TableRow key={subject.id}>
                        <TableCell>
                          <div>
                            <span className="font-medium block">{subject.name}</span>
                            <span className="text-xs text-gray-500">{subject.code}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{subject.teacher}</TableCell>
                        <TableCell className="text-center">
                          <span
                            className={cn(
                              'font-medium',
                              subject.avgScore >= 80 ? 'text-green-600' :
                              subject.avgScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                            )}
                          >
                            {subject.avgScore}%
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              subject.passRate >= 90 ? 'success' :
                              subject.passRate >= 75 ? 'warning' : 'danger'
                            }
                          >
                            {subject.passRate}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>{subject.assignmentCount}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              subject.grade === 'A' ? 'success' :
                              subject.grade === 'B' ? 'info' :
                              subject.grade === 'C' ? 'warning' : 'danger'
                            }
                          >
                            {subject.grade}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Grade A (90%+)</span>
                    <span className="font-medium">
                      {classPerformanceData.filter((c) => c.avgExamScore >= 85).length} classes
                    </span>
                  </div>
                  <Progress
                    value={(classPerformanceData.filter((c) => c.avgExamScore >= 85).length / totalClasses) * 100}
                    className="h-2"
                    color="green"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Grade B (75-89%)</span>
                    <span className="font-medium">
                      {classPerformanceData.filter((c) => c.avgExamScore >= 75 && c.avgExamScore < 85).length} classes
                    </span>
                  </div>
                  <Progress
                    value={(classPerformanceData.filter((c) => c.avgExamScore >= 75 && c.avgExamScore < 85).length / totalClasses) * 100}
                    className="h-2"
                    color="blue"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Grade C (65-74%)</span>
                    <span className="font-medium">
                      {classPerformanceData.filter((c) => c.avgExamScore >= 65 && c.avgExamScore < 75).length} classes
                    </span>
                  </div>
                  <Progress
                    value={(classPerformanceData.filter((c) => c.avgExamScore >= 65 && c.avgExamScore < 75).length / totalClasses) * 100}
                    className="h-2"
                    color="yellow"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Below C (&lt;65%)</span>
                    <span className="font-medium">
                      {classPerformanceData.filter((c) => c.avgExamScore < 65).length} classes
                    </span>
                  </div>
                  <Progress
                    value={(classPerformanceData.filter((c) => c.avgExamScore < 65).length / totalClasses) * 100}
                    className="h-2"
                    color="red"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Classes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-green-600">
                <Award className="w-4 h-4" />
                Top Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {classPerformanceData
                  .sort((a, b) => b.avgExamScore - a.avgExamScore)
                  .slice(0, 5)
                  .map((cls, index) => (
                    <div key={cls.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                          index === 0 ? 'bg-yellow-100 text-yellow-700' :
                          index === 1 ? 'bg-gray-100 text-gray-700' :
                          index === 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-50 text-gray-500'
                        )}>
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium">{cls.name}</span>
                      </div>
                      <Badge variant="success">{cls.avgExamScore}%</Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Needs Improvement */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-red-600">
                <TrendingDown className="w-4 h-4" />
                Needs Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {classPerformanceData
                  .sort((a, b) => a.avgExamScore - b.avgExamScore)
                  .slice(0, 3)
                  .map((cls) => (
                    <div key={cls.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{cls.name}</span>
                      <Badge variant="danger">{cls.avgExamScore}%</Badge>
                    </div>
                  ))}
                {classPerformanceData.filter((c) => c.avgExamScore < 70).length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    All classes performing well!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
