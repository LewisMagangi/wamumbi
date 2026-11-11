'use client';
import { DashboardShell } from '@/components/dashboard/shell';
import { ReportsView } from '@/components/dashboard/views';

export default function Page() {
  return (
    <DashboardShell
      title="Reports"
      description="Live figures from the donations ledger."
      anyOf={['reports:view_financial']}
    >
      <ReportsView />
    </DashboardShell>
  );
}
