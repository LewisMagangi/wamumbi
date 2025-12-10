'use client';

import React, { useState } from 'react';
import { Download, TrendingUp, Calendar, BarChart3, X, Clock } from 'lucide-react';
import { mockDashboardSummary, formatAmount } from '../../../lib/mockData';

export const ReportsView: React.FC = () => {
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  const handleExportClick = () => {
    setShowComingSoonModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600 mt-1">View insights and export reports</p>
        </div>
        <button 
          onClick={handleExportClick}
          className="flex items-center space-x-2 bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Donations</p>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatAmount(mockDashboardSummary.totalDonations)}</p>
          <p className="text-xs text-green-600 mt-1">+12.5% from last month</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Active Campaigns</p>
            <BarChart3 className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{mockDashboardSummary.activeCampaigns}</p>
          <p className="text-xs text-gray-600 mt-1">{mockDashboardSummary.topCampaigns.length} total campaigns</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Avg. Donation</p>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">${mockDashboardSummary.avgDonation.toFixed(2)}</p>
          <p className="text-xs text-purple-600 mt-1">+8.3% from last month</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Donors</p>
            <Calendar className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{mockDashboardSummary.totalDonors}</p>
          <p className="text-xs text-teal-600 mt-1">+15 new this month</p>
        </div>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-lg mb-4">Financial Reports</h3>
          <div className="space-y-3">
            <button 
              onClick={handleExportClick}
              className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <span className="text-sm font-medium">Monthly Donation Summary</span>
              <Download className="w-4 h-4 text-gray-600" />
            </button>
            <button 
              onClick={handleExportClick}
              className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <span className="text-sm font-medium">Campaign Performance</span>
              <Download className="w-4 h-4 text-gray-600" />
            </button>
            <button 
              onClick={handleExportClick}
              className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <span className="text-sm font-medium">Donor Retention Analysis</span>
              <Download className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-lg mb-4">Operational Reports</h3>
          <div className="space-y-3">
            <button 
              onClick={handleExportClick}
              className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <span className="text-sm font-medium">Volunteer Hours Report</span>
              <Download className="w-4 h-4 text-gray-600" />
            </button>
            <button 
              onClick={handleExportClick}
              className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <span className="text-sm font-medium">Event Attendance Summary</span>
              <Download className="w-4 h-4 text-gray-600" />
            </button>
            <button 
              onClick={handleExportClick}
              className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <span className="text-sm font-medium">Project Status Overview</span>
              <Download className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Trend Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-lg mb-4">Donation Trends (Last 12 Months)</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">Chart visualization will be implemented here</p>
        </div>
      </div>

      {/* Coming Soon Modal */}
      {showComingSoonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 text-center relative">
            <button 
              onClick={() => setShowComingSoonModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              title="Close modal"
              aria-label="Close coming soon modal"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8 text-rose-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
            <p className="text-gray-600 mb-6">
              Report export functionality is coming in <span className="font-semibold text-rose-600">Version 2</span>.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              We&apos;re working on comprehensive reporting features including 
              PDF exports, Excel downloads, and custom date range filtering.
            </p>
            
            <button
              onClick={() => setShowComingSoonModal(false)}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
