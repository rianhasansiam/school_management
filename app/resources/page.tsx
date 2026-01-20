'use client';

import * as React from 'react';
import Link from 'next/link';
import { DashboardLayout, PageHeader } from '@/components/layout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from '@/components/ui';
import { DEMO_BOOKS, DEMO_BOOK_ISSUANCES, DEMO_ID_CARDS, DEMO_STUDENTS } from '@/lib/demo-data';
import { IssuanceStatus, IDCardStatus } from '@/lib/types';
import {
  BookOpen,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function ResourcesPage() {
  // Books stats
  const totalBooks = DEMO_BOOKS.reduce((sum, b) => sum + b.totalCopies, 0);
  const availableBooks = DEMO_BOOKS.reduce((sum, b) => sum + b.availableCopies, 0);
  const issuedBooks = DEMO_BOOK_ISSUANCES.filter(
    (i) => i.status === IssuanceStatus.ISSUED
  ).length;
  const overdueBooks = DEMO_BOOK_ISSUANCES.filter(
    (i) => i.status === IssuanceStatus.ISSUED && new Date(i.dueDate) < new Date()
  ).length;

  // ID Cards stats
  const totalStudents = DEMO_STUDENTS.length;
  const activeIDCards = DEMO_ID_CARDS.filter(
    (c) => c.status === IDCardStatus.ACTIVE
  ).length;
  const pendingIDCards = DEMO_ID_CARDS.filter(
    (c) => c.status === IDCardStatus.PENDING
  ).length;
  const lostIDCards = DEMO_ID_CARDS.filter(
    (c) => c.status === IDCardStatus.LOST
  ).length;

  return (
    <DashboardLayout>
      <PageHeader
        title="Student Resources"
        description="Manage books and ID cards for students"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Resources' },
        ]}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Total Books</p>
                <p className="text-xl font-bold text-gray-600">{totalBooks}</p>
                <p className="text-xs text-gray-500">{availableBooks} available</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Books Issued</p>
                <p className="text-xl font-bold text-amber-600">{issuedBooks}</p>
                <p className="text-xs text-red-500">{overdueBooks} overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Active ID Cards</p>
                <p className="text-xl font-bold text-green-600">{activeIDCards}</p>
                <p className="text-xs text-gray-500">{totalStudents - activeIDCards} not issued</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Pending Cards</p>
                <p className="text-xl font-bold text-red-600">{pendingIDCards}</p>
                <p className="text-xs text-gray-500">{lostIDCards} lost</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Books Management */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gray-600" />
              Books Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Manage textbooks and library books. Issue books to students, track returns, and manage inventory.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Total Titles</p>
                <p className="text-2xl font-bold text-gray-600">{DEMO_BOOKS.length}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold text-green-600">{availableBooks}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Currently Issued</span>
                <span className="font-medium">{issuedBooks} books</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Overdue</span>
                <span className="font-medium text-red-600">{overdueBooks} books</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Lost/Damaged</span>
                <span className="font-medium">
                  {DEMO_BOOK_ISSUANCES.filter(i => 
                    i.status === IssuanceStatus.LOST || i.status === IssuanceStatus.DAMAGED
                  ).length} books
                </span>
              </div>
            </div>

            <Link href="/resources/books" className="block mt-6">
              <Button className="w-full">
                Manage Books
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* ID Cards Management */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-600" />
              ID Cards Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Issue and manage student ID cards. Track active cards, handle replacements for lost or damaged cards.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-purple-600">{totalStudents}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Cards Issued</p>
                <p className="text-2xl font-bold text-green-600">{activeIDCards}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Active Cards</span>
                <span className="font-medium text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  {activeIDCards}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Pending Issue</span>
                <span className="font-medium text-amber-600 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {pendingIDCards}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Lost/Replaced</span>
                <span className="font-medium text-red-600 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  {lostIDCards}
                </span>
              </div>
            </div>

            <Link href="/resources/id-cards" className="block mt-6">
              <Button className="w-full" variant="outline">
                Manage ID Cards
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Resource Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { type: 'book', action: 'Book issued', student: 'Aminul Islam', item: 'বাংলা সাহিত্য - ষষ্ঠ শ্রেণি', time: '2 hours ago' },
              { type: 'card', action: 'ID Card issued', student: 'Fatema Khatun', item: 'SMS-2026-015', time: '1 day ago' },
              { type: 'book', action: 'Book returned', student: 'Rakib Hassan', item: 'শেখ মুজিবুর রহমানের জীবনী', time: '2 days ago' },
              { type: 'card', action: 'ID Card replaced', student: 'Kamal Hossain', item: 'SMS-2026-010-R1', time: '3 days ago' },
              { type: 'book', action: 'Book issued', student: 'Mita Rani', item: 'মুক্তিযুদ্ধের ইতিহাস', time: '4 days ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'book' ? 'bg-gray-100' : 'bg-purple-100'
                }`}>
                  {activity.type === 'book' ? (
                    <BookOpen className="w-5 h-5 text-gray-600" />
                  ) : (
                    <CreditCard className="w-5 h-5 text-purple-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">
                    {activity.student} • {activity.item}
                  </p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
