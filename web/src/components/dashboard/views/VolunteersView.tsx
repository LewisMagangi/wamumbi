import React from 'react';
import { Plus, Users } from 'lucide-react';
import { mockDashboardSummary, getUserFullName } from '../../../lib/mockData';

interface VolunteersViewProps {
  openModal?: (type: string) => void;
}

export const VolunteersView: React.FC<VolunteersViewProps> = ({ openModal }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Volunteer Management</h2>
          <p className="text-gray-600 mt-1">Manage volunteers and their activities</p>
        </div>
        <button
          onClick={() => openModal?.('volunteer')}
          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Volunteer</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Volunteers</p>
          <p className="text-2xl font-bold text-gray-900">{mockDashboardSummary.totalVolunteers}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Hours</p>
          <p className="text-2xl font-bold text-gray-900">{mockDashboardSummary.totalVolunteerHours.toFixed(1)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">This Month</p>
          <p className="text-2xl font-bold text-purple-600">+15.3%</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-lg mb-4">Active Volunteers</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{getUserFullName(3)}</p>
                <p className="text-sm text-gray-600">156.5 hours logged</p>
              </div>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              View Profile
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{getUserFullName(2)}</p>
                <p className="text-sm text-gray-600">203.75 hours logged</p>
              </div>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
