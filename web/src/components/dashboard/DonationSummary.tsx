import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { EditPermissionGate } from '../auth/PermissionGate';
import { usePermissions } from '../../hooks/usePermissions';

export const DonationSummary = () => {
  // In a real application, this would fetch from the API
  const { data: donationData, isLoading } = useQuery({
    queryKey: ['/api/dashboard/donation-summary'],
    queryFn: async () => {
      // Simulated data for development
      return {
        total: 245680,
        target: 500000,
        categories: [
          { name: 'Water Projects', percentage: 35, color: '#3B82F6' },
          { name: 'Education', percentage: 25, color: '#10B981' },
          { name: 'Hunger Relief', percentage: 20, color: '#EF4444' },
          { name: 'Healthcare', percentage: 15, color: '#8B5CF6' },
          { name: 'Other', percentage: 5, color: '#F59E0B' }
        ],
        monthly: [
          { month: 'Jan', amount: 18500 },
          { month: 'Feb', amount: 21200 },
          { month: 'Mar', amount: 19800 },
          { month: 'Apr', amount: 22900 },
          { month: 'May', amount: 24850 },
          { month: 'Jun', amount: 23600 }
        ]
      };
    },
    enabled: true
  });

  const { canEdit } = usePermissions();

  if (isLoading) {
    return (
      <div className="card h-full p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="h-4 bg-gray-200 rounded mb-3 w-full"></div>
            <div className="h-3 bg-gray-200 rounded-full mb-4 w-full"></div>
            <div className="h-4 bg-gray-200 rounded mb-6 w-2/3"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-200 mr-2"></div>
                  <div className="h-3 bg-gray-200 rounded flex-1"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!donationData) return null;

  const percentage = Math.round((donationData.total / donationData.target) * 100);

  return (
    <div className="card h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Donation Summary</h2>
        
        <EditPermissionGate 
          resource="donations"
          fallback={
            <span className="text-xs text-gray-500">
              <i className="ri-information-line mr-1"></i>
              View-only mode
            </span>
          }
        >
          <button 
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <i className="ri-edit-line mr-1"></i> Edit Goals
          </button>
        </EditPermissionGate>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <h3 className="font-medium">Total Fundraising</h3>
              <span className="text-sm font-medium">{percentage}% of target</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className="h-3 rounded-full bg-blue-600" 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-sm text-gray-600">
              <span>${donationData.total.toLocaleString()} raised</span>
              <span>Goal: ${donationData.target.toLocaleString()}</span>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Donation Distribution</h3>
            <div className="space-y-3">
              {donationData.categories.map((category, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                  <span className="text-sm flex-1">{category.name}</span>
                  <span className="text-sm font-medium">{category.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-3">Monthly Donations</h3>
          <div className="h-64 flex items-end space-x-2">
            {donationData.monthly.map((item, index) => {
              // Calculate bar height as percentage of maximum value
              const maxAmount = Math.max(...donationData.monthly.map(m => m.amount));
              const height = Math.round((item.amount / maxAmount) * 100);
              
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-blue-100 rounded-t-sm relative group"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute inset-0 bg-blue-600 opacity-80 rounded-t-sm"></div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity mb-1 whitespace-nowrap">
                      ${item.amount.toLocaleString()}
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 mt-1">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};