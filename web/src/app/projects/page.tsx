'use client';
import { DashboardShell } from '@/components/dashboard/shell';
import { ProjectsView } from '@/components/dashboard/views';

// Staff only: this view still uses sample data.
export default function Page() {
  return (
    <DashboardShell anyOf={['dashboard:view']}>
      <ProjectsView />
    </DashboardShell>
  );
}
