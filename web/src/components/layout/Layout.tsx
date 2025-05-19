import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '../../contexts/AuthContext';
import { AdminGate } from '../auth/PermissionGate';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { user, isAuthenticated, logout, role } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation items with role-based access control
  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: 'ri-dashboard-line', roles: ['admin', 'volunteer', 'donor', 'team_leader'] },
    { name: 'Campaigns', path: '/campaigns', icon: 'ri-heart-line', roles: ['admin', 'volunteer', 'donor', 'team_leader'] },
    { name: 'Donations', path: '/donations', icon: 'ri-money-dollar-circle-line', roles: ['admin', 'donor', 'team_leader'] },
    { name: 'Events', path: '/events', icon: 'ri-calendar-event-line', roles: ['admin', 'volunteer', 'donor', 'team_leader'] },
    { name: 'Projects', path: '/projects', icon: 'ri-building-line', roles: ['admin', 'volunteer', 'team_leader'] },
    { name: 'Teams', path: '/teams', icon: 'ri-team-line', roles: ['admin', 'volunteer', 'team_leader'] },
    { name: 'Volunteers', path: '/volunteers', icon: 'ri-user-heart-line', roles: ['admin', 'team_leader'] },
    { name: 'Donors', path: '/donors', icon: 'ri-user-star-line', roles: ['admin', 'team_leader'] },
    { name: 'Blog', path: '/blog', icon: 'ri-article-line', roles: ['admin', 'volunteer', 'donor', 'team_leader'] },
  ];
  
  // Admin-only navigation items
  const adminNavItems = [
    { name: 'Reports', path: '/reports', icon: 'ri-bar-chart-line' },
    { name: 'Settings', path: '/settings', icon: 'ri-settings-line' },
  ];

  // Filter navigation items based on user role
  const filteredNavItems = navigationItems.filter(item => 
    !role || item.roles.includes(role)
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/">
                  <div className="flex items-center cursor-pointer">
                    <i className="ri-heart-fill text-2xl text-red-600 mr-2"></i>
                    <span className="font-bold text-xl">CharityManager</span>
                  </div>
                </Link>
              </div>
            </div>

            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {/* Notification bell */}
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span className="sr-only">View notifications</span>
                <i className="ri-notification-3-line text-xl"></i>
              </button>

              {/* Profile dropdown */}
              <div className="ml-3 relative flex items-center">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-700">
                      <span className="block">Hi, {user?.name}</span>
                      <span className="block text-xs text-gray-500 capitalize">{user?.role}</span>
                    </div>
                    <div className="relative">
                      <button 
                        className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() => logout()}
                      >
                        <img
                          className="h-8 w-8 rounded-full"
                          src={user?.profileImage || "https://ui-avatars.com/api/?name=" + user?.name}
                          alt=""
                        />
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link href="/login">
                    <div className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                      Login
                    </div>
                  </Link>
                )}
              </div>
            </div>

            <div className="-mr-2 flex items-center sm:hidden">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <i className="ri-close-line text-xl"></i>
                ) : (
                  <i className="ri-menu-line text-xl"></i>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
          <div className="pt-2 pb-3 space-y-1">
            {filteredNavItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <div
                  className={`${
                    location === item.path
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer`}
                >
                  <i className={`${item.icon} mr-2`}></i>
                  {item.name}
                </div>
              </Link>
            ))}
            
            <AdminGate>
              {adminNavItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <div
                    className={`${
                      location === item.path
                        ? 'bg-red-50 border-red-500 text-red-700'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer`}
                  >
                    <i className={`${item.icon} mr-2`}></i>
                    {item.name}
                  </div>
                </Link>
              ))}
            </AdminGate>
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user?.profileImage || "https://ui-avatars.com/api/?name=" + user?.name}
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user?.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <Link href="/login">
                  <div className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                    Login
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar Layout for larger screens */}
      <div className="flex flex-1 overflow-hidden">
        <nav className="hidden md:flex md:flex-shrink-0">
          <div className="w-64 flex flex-col border-r border-gray-200 pt-5 pb-4 bg-white">
            <div className="flex-grow flex flex-col">
              <div className="px-3 space-y-1">
                {filteredNavItems.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <div
                      className={`${
                        location === item.path
                          ? 'bg-blue-100 text-blue-800'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer`}
                    >
                      <i className={`${item.icon} text-lg mr-3 ${location === item.path ? 'text-blue-600' : 'text-gray-500'}`}></i>
                      {item.name}
                    </div>
                  </Link>
                ))}
              </div>
              
              <AdminGate>
                <div className="px-3 mt-6">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin</h3>
                  <div className="mt-2 space-y-1">
                    {adminNavItems.map((item) => (
                      <Link key={item.path} href={item.path}>
                        <div
                          className={`${
                            location === item.path
                              ? 'bg-red-100 text-red-800'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          } group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer`}
                        >
                          <i className={`${item.icon} text-lg mr-3 ${location === item.path ? 'text-red-600' : 'text-gray-500'}`}></i>
                          {item.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </AdminGate>
            </div>
            
            {isAuthenticated && (
              <div className="p-3 border-t border-gray-200 flex items-center mt-auto">
                <button 
                  onClick={() => logout()}
                  className="w-full flex items-center justify-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <i className="ri-logout-box-line mr-2"></i>
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}