'use client';
import { DashboardShell } from '@/components/dashboard/shell';
import { VolunteersView } from '@/components/dashboard/views';

export default function Page() {
  return (
    <DashboardShell anyOf={['volunteers:view', 'volunteers:view_team', 'volunteers:view_anonymized']}>
      <VolunteersView />
    </DashboardShell>
  );
}
