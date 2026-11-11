import type { ComponentType } from "react"
import {
  LayoutDashboard, Megaphone, HandHeart, UserCheck, FolderKanban, CalendarDays, BarChart3, Home, ImageUp, ShieldCheck, ClipboardCheck, Users, Inbox,
} from "lucide-react"
import type { Permission } from "@/lib/rbac/permissions"

export type NavItem = { name: string; href: string; icon: ComponentType<{ className?: string }>; description: string; anyOf?: Permission[] };

// Items without `anyOf` are visible to everyone signed in; the server enforces the same rules.
export const navigationItems: NavItem[] = [
  { name: 'Home', href: '/', icon: Home, description: 'Back to the website' },
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, description: 'Your dashboard', anyOf: ['dashboard:view'] },
  { name: 'Campaigns', href: '/dashboard/campaigns', icon: Megaphone, description: 'Manage campaigns', anyOf: ['campaigns:create', 'campaigns:update', 'campaigns:publish'] },
  { name: 'Donations', href: '/donations', icon: HandHeart, description: 'Donations and donors', anyOf: ['donations:view_all', 'donations:view_aggregate', 'donations:view_own'] },
  { name: 'Volunteers', href: '/volunteers', icon: UserCheck, description: 'Volunteer management', anyOf: ['volunteers:view', 'volunteers:view_team', 'volunteers:view_anonymized'] },
  { name: 'Projects', href: '/projects', icon: FolderKanban, description: 'Project tracking', anyOf: ['dashboard:view'] },
  { name: 'Events', href: '/events', icon: CalendarDays, description: 'Upcoming and past events' },
  { name: 'Manage events', href: '/dashboard/events', icon: CalendarDays, description: 'Create events, registrations', anyOf: ['events:create', 'events:update', 'registrations:manage', 'registrations:manage_team'] },
  { name: 'Reports', href: '/reports', icon: BarChart3, description: 'Financial reports', anyOf: ['reports:view_financial'] },
  { name: 'Photos', href: '/dashboard/admin?tab=uploads', icon: ImageUp, description: 'Upload event photos', anyOf: ['media:upload', 'media:upload_restricted'] },
  { name: 'Moderation', href: '/dashboard/admin?tab=moderation', icon: ShieldCheck, description: 'Review uploaded photos', anyOf: ['media:moderate'] },
  { name: 'Inbox', href: '/dashboard/admin?tab=inbox', icon: Inbox, description: 'Volunteer and partner messages', anyOf: ['volunteers:manage', 'users:manage'] },
  { name: 'Approvals', href: '/dashboard/admin?tab=approvals', icon: ClipboardCheck, description: 'Approve content to go live', anyOf: ['campaigns:publish', 'events:publish', 'blog:publish'] },
  { name: 'Users & roles', href: '/dashboard/admin?tab=users', icon: Users, description: 'Assign roles', anyOf: ['users:manage'] },
];
