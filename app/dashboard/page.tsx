'use client';

import * as React from 'react';
import { DashboardLayout, PageHeader } from '@/components/layout';
import { useAuthStore } from '@/lib/store';
import { UserRole } from '@/lib/types';
import { AdminDashboard } from '@/components/features/admin-dashboard';
import { TeacherDashboard } from '@/components/features/teacher-dashboard';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <DashboardLayout>
      <PageHeader
        title={`Welcome, ${user?.firstName}!`}
        description="Overview of your school management dashboard"
      />
      
      {user?.role === UserRole.ADMIN ? (
        <AdminDashboard />
      ) : (
        <TeacherDashboard />
      )}
    </DashboardLayout>
  );
}
