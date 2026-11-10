import React from 'react';
import { mockDashboardSummary, formatAmount, getCategoryName, getUrgencyLevel } from '@/lib/mockData';
import { TrendingUp, Target, Users } from 'lucide-react';

export const CampaignProgress = () => {
  const topCampaigns = mockDashboardSummary.topCampaigns;

  return (
    <div className="bg-card rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-foreground">Top Campaigns</h2>
        <button className="text-sm text-brand hover:text-brand font-medium">
          View all
        </button>
      </div>

      <div className="space-y-6">
        {topCampaigns.map((campaign) => {
          const urgency = getUrgencyLevel(campaign.urgency_level_id);
          const progress = campaign.stats.completion_percentage;

          return (
            <div key={campaign.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-foreground">{campaign.title}</h3>
                    {urgency && (
                      <span 
                        className="px-2 py-0.5 text-xs font-medium rounded-full"
                        style={{ 
                          backgroundColor: `${urgency.color_code}20`, 
                          color: urgency.color_code 
                        }}
                      >
                        {urgency.name}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {getCategoryName(campaign.category_id)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">
                    {formatAmount(campaign.stats.current_amount, campaign.currency_id)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    of {formatAmount(campaign.goal_amount, campaign.currency_id)}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Campaign progress: ${progress.toFixed(1)}%`}
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">{progress.toFixed(1)}% funded</span>
                  <span className="text-xs text-muted-foreground">{campaign.target_beneficiaries} beneficiaries</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  <span>{campaign.stats.unique_donors_count} donors</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-3.5 w-3.5" />
                  <span>{campaign.stats.donations_count} donations</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-success" />
                  <span className="text-success">
                    {formatAmount(campaign.stats.average_donation, campaign.currency_id)} avg
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};