'use client';
import { DashboardShell } from '@/components/dashboard/shell';
import { TeamsView } from '@/components/dashboard/views';

// Everyone with teams:view can see teams; creating is for team managers, leaders edit their own.
export default function Page() {
  return (
    <DashboardShell anyOf={['teams:view']}>
      <TeamsView />
    </DashboardShell>
  );
}
