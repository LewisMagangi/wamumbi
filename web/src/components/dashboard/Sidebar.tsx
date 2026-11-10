'use client';
import React from 'react';
import Link from 'next/link';
import { 
  X, ChevronRight, LayoutDashboard, Megaphone, HandHeart, 
  UserCheck, FolderKanban, CalendarDays, BarChart3, Home,
  ImageUp, ShieldCheck, ClipboardCheck, Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { Permission } from '@/lib/rbac/permissions';
import { useUser, useClerk } from '@clerk/nextjs';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

type NavItem = { name: string; href: string; icon: React.ComponentType<{ className?: string }>; description: string; anyOf?: Permission[] };

// Items without `anyOf` are visible to everyone signed in; the server enforces the same rules.
const navigationItems: NavItem[] = [
  { name: 'Home', href: '/', icon: Home, description: 'Back to the website' },
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, description: 'Your dashboard', anyOf: ['dashboard:view'] },
  { name: 'Campaigns', href: '/campaigns', icon: Megaphone, description: 'Manage campaigns', anyOf: ['campaigns:create', 'campaigns:update'] },
  { name: 'Donations', href: '/donations', icon: HandHeart, description: 'Donations and donors', anyOf: ['donations:view_all', 'donations:view_aggregate', 'donations:view_own'] },
  { name: 'Volunteers', href: '/volunteers', icon: UserCheck, description: 'Volunteer management', anyOf: ['volunteers:view', 'volunteers:view_team', 'volunteers:view_anonymized'] },
  { name: 'Projects', href: '/projects', icon: FolderKanban, description: 'Project tracking', anyOf: ['dashboard:view'] },
  { name: 'Events', href: '/events', icon: CalendarDays, description: 'Upcoming and past events' },
  { name: 'Manage events', href: '/dashboard/events', icon: CalendarDays, description: 'Create events, registrations', anyOf: ['events:create', 'events:update', 'registrations:manage', 'registrations:manage_team'] },
  { name: 'Reports', href: '/reports', icon: BarChart3, description: 'Financial reports', anyOf: ['reports:view_financial'] },
  { name: 'Photos', href: '/dashboard/admin?tab=uploads', icon: ImageUp, description: 'Upload event photos', anyOf: ['media:upload', 'media:upload_restricted'] },
  { name: 'Moderation', href: '/dashboard/admin?tab=moderation', icon: ShieldCheck, description: 'Review uploaded photos', anyOf: ['media:moderate'] },
  { name: 'Approvals', href: '/dashboard/admin?tab=approvals', icon: ClipboardCheck, description: 'Approve content to go live', anyOf: ['campaigns:publish', 'events:publish', 'blog:publish'] },
  { name: 'Users & roles', href: '/dashboard/admin?tab=users', icon: Users, description: 'Assign roles', anyOf: ['users:manage'] },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { hasAny, user: appUser } = useAuth();
  const visibleItems = navigationItems.filter((item) => !item.anyOf || hasAny(item.anyOf));

  const handleSignOut = () => {
    signOut({ redirectUrl: '/' });
  };

  const userInitials = user?.firstName?.[0] || user?.lastName?.[0] || 'U';
  const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User' : 'Loading...';
  const userEmail = user?.primaryEmailAddress?.emailAddress || 'Loading...';
  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-secondary bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div
        className={`absolute top-0 left-0 h-full w-80 bg-card shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary rounded-lg">
              <LayoutDashboard className="w-6 h-6 text-background" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Dashboard</h2>
              <p className="text-xs text-muted-foreground">Navigation Menu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-240px)]">
          {visibleItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-accent transition-all group hover:shadow-sm border border-transparent hover:border-border"
            >
              <div className={`p-2 rounded-lg bg-muted group-hover:bg-accent transition-all`}>
                <item.icon className={`w-5 h-5 text-foreground/80 transition-transform group-hover:scale-110`} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground group-hover:text-foreground">
                  {item.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/70 group-hover:text-brand transition-all group-hover:translate-x-1" />
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border bg-card">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-brand-foreground font-bold">
              {userInitials}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{userName}</p>
              <p className="text-xs text-muted-foreground">{appUser?.roleLabel ?? userEmail}</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="w-full py-2 px-4 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
