'use client';
import { DashboardShell } from '@/components/dashboard/shell';
import { ProjectsView } from '@/components/dashboard/views';

// Visible to staff; editing is for team managers and team leaders (their own teams).
export default function Page() {
  return (
    <DashboardShell anyOf={['dashboard:view']}>
      <ProjectsView />
    </DashboardShell>
  );
}
