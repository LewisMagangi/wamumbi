import React, { useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import { mockDashboardSummary, formatAmount, getCategoryName } from '../../../lib/mockData';

interface CampaignsViewProps {
  openModal?: (type: string) => void;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({ openModal }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const campaigns = mockDashboardSummary.topCampaigns;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Campaign Management</h2>
          <p className="text-gray-600 mt-1">Create and manage your fundraising campaigns</p>
        </div>
        <button
          onClick={() => openModal?.('campaign')}
          className="flex items-center space-x-2 bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Search campaigns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
          title="Filter campaigns"
          aria-label="Filter campaigns by status"
        >
          <option value="all">All Campaigns</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map(({ ...campaign }) => (
          <div key={campaign.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Active
              </span>
              <div className="flex space-x-2">
                <button 
                  className="text-gray-400 hover:text-blue-600"
                  title="View campaign details"
                  aria-label="View campaign details"
                >
                  <FileText className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">{campaign.title}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{campaign.stats.completion_percentage.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-rose-600 h-2 rounded-full transition-all"
                  style={{ width: `${campaign.stats.completion_percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-sm pt-2">
                <span className="text-gray-600">Raised:</span>
                <span className="font-bold text-rose-600">{formatAmount(campaign.stats.current_amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Goal:</span>
                <span className="font-medium">{formatAmount(campaign.goal_amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Donors:</span>
                <span className="font-medium">{campaign.stats.unique_donors_count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
