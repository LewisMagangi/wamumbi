'use client';
import { DashboardShell } from '@/components/dashboard/shell';
import { Overview, QuickActions } from '@/components/dashboard/overview';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const first = user?.name?.split(' ')[0];
  return (
    <DashboardShell
      title={first ? `Welcome back, ${first}` : 'Dashboard'}
      description={user ? `Signed in as ${user.roleLabel}` : undefined}
      actions={<QuickActions />}
    >
      <Overview />
    </DashboardShell>
  );
}
