'use client';
import { DashboardShell } from '@/components/dashboard/shell';
import { HelpView } from '@/components/dashboard/views/HelpView';

// Officials' quick reference; visible to everyone signed in.
export default function Page() {
  return (
    <DashboardShell>
      <HelpView />
    </DashboardShell>
  );
}
