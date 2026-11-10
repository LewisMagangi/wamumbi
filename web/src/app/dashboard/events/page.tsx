'use client';
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/footer';
import Sidebar from '@/components/dashboard/Sidebar';
import MenuButton from '@/components/dashboard/MenuButton';
import { EventsView } from '@/components/dashboard/views';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Event management (previously at /events). The public /events page now shows upcoming and past events.
export default function ManageEventsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Navbar />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <MenuButton onClick={() => setSidebarOpen(true)} />
      <div className="min-h-screen bg-background pt-16">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProtectedRoute anyOf={['events:create', 'events:update', 'registrations:manage', 'registrations:manage_team']}>
            <EventsView />
          </ProtectedRoute>
        </main>
      </div>
      <Footer />
    </>
  );
}
