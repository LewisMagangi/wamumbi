import React from 'react';
import { Heart, TrendingUp, Users, Edit, Eye, Trash2 } from 'lucide-react';
import { formatAmount, getCategoryName, getCampaignStats } from '../../lib/mockData';
import { formatDate } from '../../lib/dateUtils';

interface Campaign {
  id: number;
  title: string;
  description: string;
  goal_amount: number;
  currency_id: number;
  category_id: number;
  status_id: number;
  start_date: Date;
  end_date: Date | null;
  image_url: string | null;
  address_id: number | null;
  target_beneficiaries: number | null;
  urgency_level_id: number;
  created_by: number | null;
  created_at: Date;
  updated_at: Date;
}

interface CampaignCardProps {
  campaign: Campaign;
  variant?: 'compact' | 'detailed';
  onEdit?: () => void;
  onView?: () => void;
  onDelete?: () => void;
}

export default function CampaignCard({ 
  campaign, 
  variant = 'detailed',
  onEdit,
  onView,
  onDelete 
}: CampaignCardProps) {
  const stats = getCampaignStats(campaign.id);
  const completionPercentage = stats?.completion_percentage || 0;
  
  if (variant === 'compact') {
    return (
      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{campaign.title}</h3>
            <p className="text-sm text-gray-600">{getCategoryName(campaign.category_id)}</p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-medium">
            Active
          </span>
        </div>
        
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">{formatAmount(stats?.current_amount || 0)} raised</span>
            <span className="font-bold text-blue-600">{completionPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(completionPercentage, 100)}%` }}
              role="progressbar"
              aria-valuenow={Math.min(completionPercentage, 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Campaign progress: ${completionPercentage.toFixed(1)}%`}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Goal: {formatAmount(campaign.goal_amount)}</span>
          <button className="text-blue-600 hover:underline font-medium">Details →</button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all bg-white">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-xl font-bold text-gray-900">{campaign.title}</h3>
            <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
              Active
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{campaign.description?.substring(0, 150)}...</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              {getCategoryName(campaign.category_id)}
            </span>
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {stats?.unique_donors_count || 0} donors
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2 ml-4">
          <button 
            onClick={onView}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button 
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button 
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs text-blue-600 mb-1">Raised</p>
          <p className="text-lg font-bold text-blue-900">{formatAmount(stats?.current_amount || 0)}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3">
          <p className="text-xs text-purple-600 mb-1">Goal</p>
          <p className="text-lg font-bold text-purple-900">{formatAmount(campaign.goal_amount)}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-xs text-green-600 mb-1">Progress</p>
          <p className="text-lg font-bold text-green-900">{completionPercentage.toFixed(0)}%</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(completionPercentage, 100)}%` }}
            role="progressbar"
            aria-valuenow={Math.min(completionPercentage, 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Campaign progress: ${completionPercentage.toFixed(1)}%`}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4 text-gray-600">
          <span>🎯 {campaign.target_beneficiaries || 0} beneficiaries</span>
          <span>📅 Ends: {formatDate(campaign.end_date)}</span>
        </div>
        <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
          View Campaign
          <TrendingUp className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
