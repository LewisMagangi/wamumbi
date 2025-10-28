'use client';
import React from 'react';
import Link from 'next/link';
import { 
  X, ChevronRight, LayoutDashboard, Megaphone, HandHeart, 
  UserCheck, FolderKanban, CalendarDays, BarChart3, Info
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, color: 'rose', description: 'Dashboard overview' },
  { name: 'About Us', href: '/about', icon: Info, color: 'cyan', description: 'Our mission & values' },
  { name: 'Campaigns', href: '/campaigns', icon: Megaphone, color: 'purple', description: 'Manage campaigns' },
  { name: 'Donations', href: '/donations', icon: HandHeart, color: 'green', description: 'Track donations' },
  { name: 'Volunteers', href: '/volunteers', icon: UserCheck, color: 'blue', description: 'Volunteer management' },
  { name: 'Projects', href: '/projects', icon: FolderKanban, color: 'orange', description: 'Project tracking' },
  { name: 'Events', href: '/events', icon: CalendarDays, color: 'teal', description: 'Event management' },
  { name: 'Reports', href: '/reports', icon: BarChart3, color: 'indigo', description: 'Analytics & reports' },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div
        className={`absolute top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-rose-50 to-pink-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-rose-500 rounded-lg">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
              <p className="text-xs text-gray-600">Navigation Menu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-240px)]">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all group hover:shadow-sm border border-transparent hover:border-gray-200"
            >
              <div className={`p-2 rounded-lg bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 transition-all`}>
                <item.icon className={`w-5 h-5 text-${item.color}-500 transition-transform group-hover:scale-110`} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 group-hover:text-gray-900">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500">
                  {item.description}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-rose-500 transition-all group-hover:translate-x-1" />
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white font-bold">
              A
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Admin User</p>
              <p className="text-xs text-gray-600">admin@wamumbi.org</p>
            </div>
          </div>
          <button className="w-full py-2 px-4 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-lg transition-colors">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
