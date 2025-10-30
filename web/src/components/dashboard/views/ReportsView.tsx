import React from 'react';
import { Download, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { mockDashboardSummary, formatAmount } from '../../../lib/mockData';

interface ReportsViewProps {
  openModal?: (type: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ openModal }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600 mt-1">View insights and export reports</p>
        </div>
        <button className="flex items-center space-x-2 bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors">
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
            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <span className="text-sm font-medium">Monthly Donation Summary</span>
              <Download className="w-4 h-4 text-gray-600" />
            </button>
            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <span className="text-sm font-medium">Campaign Performance</span>
              <Download className="w-4 h-4 text-gray-600" />
            </button>
            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <span className="text-sm font-medium">Donor Retention Analysis</span>
              <Download className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-lg mb-4">Operational Reports</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <span className="text-sm font-medium">Volunteer Hours Report</span>
              <Download className="w-4 h-4 text-gray-600" />
            </button>
            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <span className="text-sm font-medium">Event Attendance Summary</span>
              <Download className="w-4 h-4 text-gray-600" />
            </button>
            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
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
    </div>
  );
};
