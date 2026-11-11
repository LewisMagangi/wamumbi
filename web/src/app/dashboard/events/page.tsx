'use client';
import { DashboardShell } from '@/components/dashboard/shell';
import { EventsView } from '@/components/dashboard/views';

// Event management. The public /events page shows upcoming and past events.
export default function Page() {
  return (
    <DashboardShell anyOf={['events:create', 'events:update', 'registrations:manage', 'registrations:manage_team']}>
      <EventsView />
    </DashboardShell>
  );
}
