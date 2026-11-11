'use client';
import { DashboardShell } from '@/components/dashboard/shell';
import { DonationsView } from '@/components/dashboard/views';

export default function Page() {
  return (
    <DashboardShell
      title="Donations"
      description="Every gift, recorded."
      anyOf={['donations:view_all', 'donations:view_aggregate', 'donations:view_own']}
    >
      <DonationsView />
    </DashboardShell>
  );
}
