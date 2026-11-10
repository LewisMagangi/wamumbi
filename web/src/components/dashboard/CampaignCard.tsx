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
      <div className="border border-border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">{campaign.title}</h3>
            <p className="text-sm text-muted-foreground">{getCategoryName(campaign.category_id)}</p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-warning/15 text-warning font-medium">
            Active
          </span>
        </div>
        
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">{formatAmount(stats?.current_amount || 0)} raised</span>
            <span className="font-bold text-info">{completionPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-brand h-2 rounded-full transition-all"
              style={{ width: `${Math.min(completionPercentage, 100)}%` }}
              role="progressbar"
              aria-valuenow={Math.min(completionPercentage, 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Campaign progress: ${completionPercentage.toFixed(1)}%`}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>Goal: {formatAmount(campaign.goal_amount)}</span>
          <button className="text-info hover:underline font-medium">Details →</button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-xl p-6 hover:shadow-lg transition-all bg-card">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-xl font-bold text-foreground">{campaign.title}</h3>
            <span className="text-xs px-3 py-1 rounded-full bg-success/15 text-success font-medium">
              Active
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{campaign.description?.substring(0, 150)}...</p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
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
            className="p-2 text-muted-foreground hover:bg-accent rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button 
            onClick={onEdit}
            className="p-2 text-info hover:bg-info/15 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button 
            onClick={onDelete}
            className="p-2 text-destructive hover:bg-destructive/15 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-info/15 rounded-lg p-3">
          <p className="text-xs text-info mb-1">Raised</p>
          <p className="text-lg font-bold text-info">{formatAmount(stats?.current_amount || 0)}</p>
        </div>
        <div className="bg-chart-4/15 rounded-lg p-3">
          <p className="text-xs text-chart-4 mb-1">Goal</p>
          <p className="text-lg font-bold text-chart-4">{formatAmount(campaign.goal_amount)}</p>
        </div>
        <div className="bg-success/15 rounded-lg p-3">
          <p className="text-xs text-success mb-1">Progress</p>
          <p className="text-lg font-bold text-success">{completionPercentage.toFixed(0)}%</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div 
            className="bg-brand h-3 rounded-full transition-all duration-500"
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
        <div className="flex items-center space-x-4 text-muted-foreground">
          <span>🎯 {campaign.target_beneficiaries || 0} beneficiaries</span>
          <span>📅 Ends: {formatDate(campaign.end_date)}</span>
        </div>
        <button className="text-info hover:text-info font-medium flex items-center">
          View Campaign
          <TrendingUp className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
