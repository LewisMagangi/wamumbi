'use client';
import { DashboardShell } from '@/components/dashboard/shell';
import { CampaignsView } from '@/components/dashboard/views';

export default function Page() {
  return (
    <DashboardShell anyOf={['campaigns:create', 'campaigns:update', 'campaigns:publish']}>
      <CampaignsView />
    </DashboardShell>
  );
}
