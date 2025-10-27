import React from 'react';
import { trpc } from '@/app/_trpc/client';
import { useAuth } from '../../contexts/AuthContext';
import { AdminGate } from '../auth/PermissionGate';

export const StatisticsCards = () => {
  const { role } = useAuth();
  
  // Use tRPC query instead of fetch
  const { data: stats, isLoading, error } = trpc.dashboard.getStats.useQuery();

  if (error) {
    console.error('Failed to fetch dashboard stats:', error);
  }

  // Default sample stats for development
  const sampleStats = {
    activeVolunteers: {
      count: 128,
      change: 12,
      isPositive: true
    },
    monthlyDonations: {
      amount: 24850,
      change: 8,
      isPositive: true
    },
    upcomingEvents: {
      count: 5,
      thisWeek: 2
    },
    activeProjects: {
      count: 12,
      completionRate: 72
    }
  };

  // Format API response data into the expected structure
  const formattedStats = stats ? {
    activeVolunteers: {
      count: stats.activeVolunteers || 0,
      change: 5,
      isPositive: true
    },
    monthlyDonations: {
      amount: stats.monthlyDonations || 0,
      change: 8,
      isPositive: true
    },
    upcomingEvents: {
      count: stats.upcomingEvents || 0,
      thisWeek: 2
    },
    activeProjects: {
      count: stats.activeProjects || 0,
      completionRate: 72
    }
  } : null;

  // Use formatted data if available, otherwise use sample data
  const statsData = formattedStats || sampleStats;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card border-l-4 border-gray-200 animate-pulse">
            <div className="flex justify-between">
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-16 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-12 w-12 rounded-full bg-gray-200"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Active Volunteers Card - Admin, Team Leader */}
      {(role === 'admin' || role === 'team_leader' || role === 'volunteer') && (
        <div className="card border-l-4 border-primary-blue">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Volunteers</p>
              <h3 className="text-2xl font-bold mt-1">{statsData.activeVolunteers.count}</h3>
              
              <AdminGate>
                <div className="flex items-center mt-3 text-sm">
                  <span className={`font-medium ${statsData.activeVolunteers.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {statsData.activeVolunteers.isPositive ? '↑' : '↓'} {statsData.activeVolunteers.change}%
                  </span>
                  <span className="text-gray-500 ml-1">from last month</span>
                </div>
              </AdminGate>
            </div>
            
            <div className="bg-blue-100 h-12 w-12 rounded-full flex items-center justify-center">
              <i className="ri-user-heart-line text-primary-blue text-xl"></i>
            </div>
          </div>
        </div>
      )}
      
      {/* Monthly Donations Card - For everyone */}
      <div className="card border-l-4 border-primary-green">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Monthly Donations</p>
            <h3 className="text-2xl font-bold mt-1">${statsData.monthlyDonations.amount.toLocaleString()}</h3>
            
            <AdminGate>
              <div className="flex items-center mt-3 text-sm">
                <span className={`font-medium ${statsData.monthlyDonations.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {statsData.monthlyDonations.isPositive ? '↑' : '↓'} {statsData.monthlyDonations.change}%
                </span>
                <span className="text-gray-500 ml-1">from last month</span>
              </div>
            </AdminGate>
          </div>
          
          <div className="bg-green-100 h-12 w-12 rounded-full flex items-center justify-center">
            <i className="ri-money-dollar-circle-line text-primary-green text-xl"></i>
          </div>
        </div>
      </div>
      
      {/* Upcoming Events Card - For everyone */}
      <div className="card border-l-4 border-primary-red">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Upcoming Events</p>
            <h3 className="text-2xl font-bold mt-1">{statsData.upcomingEvents.count}</h3>
            
            <div className="flex items-center mt-3 text-sm">
              <span className="font-medium text-primary-red">{statsData.upcomingEvents.thisWeek}</span>
              <span className="text-gray-500 ml-1">this week</span>
            </div>
          </div>
          
          <div className="bg-red-100 h-12 w-12 rounded-full flex items-center justify-center">
            <i className="ri-calendar-event-line text-primary-red text-xl"></i>
          </div>
        </div>
      </div>
      
      {/* Active Campaigns Card - Admin, Team Leader */}
      {(role === 'admin' || role === 'team_leader') && (
        <div className="card border-l-4 border-amber-500">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Campaigns</p>
              <h3 className="text-2xl font-bold mt-1">{statsData.activeProjects.count}</h3>
              
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500">Avg. progress</span>
                  <span className="font-medium">{statsData.activeProjects.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`bg-amber-500 h-1.5 rounded-full transition-all duration-300 progress-bar-${statsData.activeProjects.completionRate}`}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-100 h-12 w-12 rounded-full flex items-center justify-center">
              <i className="ri-megaphone-line text-amber-500 text-xl"></i>
            </div>
          </div>
        </div>
      )}
      
      {/* Donor-specific stats - Only shown to Donors */}
      {role === 'donor' && (
        <div className="card border-l-4 border-purple-500">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Your Contributions</p>
              <h3 className="text-2xl font-bold mt-1">$2,450</h3>
              
              <div className="flex items-center mt-3 text-sm">
                <span className="font-medium text-purple-600">3</span>
                <span className="text-gray-500 ml-1">campaigns supported</span>
              </div>
            </div>
            
            <div className="bg-purple-100 h-12 w-12 rounded-full flex items-center justify-center">
              <i className="ri-heart-line text-purple-500 text-xl"></i>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};