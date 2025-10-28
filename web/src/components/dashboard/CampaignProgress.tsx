import React from 'react';
import { mockDashboardSummary, formatAmount, getCategoryName, getUrgencyLevel } from '@/lib/mockData';
import { TrendingUp, Target, Users } from 'lucide-react';

export const CampaignProgress = () => {
  const topCampaigns = mockDashboardSummary.topCampaigns;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Top Campaigns</h2>
        <button className="text-sm text-rose-600 hover:text-rose-700 font-medium">
          View all
        </button>
      </div>

      <div className="space-y-6">
        {topCampaigns.map((campaign) => {
          const urgency = getUrgencyLevel(campaign.urgency_level_id);
          const progress = campaign.stats.completion_percentage;

          return (
            <div key={campaign.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900">{campaign.title}</h3>
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
                  <p className="text-xs text-gray-500">
                    {getCategoryName(campaign.category_id)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {formatAmount(campaign.stats.current_amount, campaign.currency_id)}
                  </p>
                  <p className="text-xs text-gray-500">
                    of {formatAmount(campaign.goal_amount, campaign.currency_id)}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-rose-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-600">{progress.toFixed(1)}% funded</span>
                  <span className="text-xs text-gray-600">{campaign.target_beneficiaries} beneficiaries</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  <span>{campaign.stats.unique_donors_count} donors</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-3.5 w-3.5" />
                  <span>{campaign.stats.donations_count} donations</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                  <span className="text-green-600">
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
  id: string;
  title: string;
  goal: number;
  raised: number;
  endDate: string | Date | null;
  startDate: string | Date;
  donationsCount: number;
  progressPercentage: number;
  daysLeft?: number;
  raisedFormatted?: string;
  goalFormatted?: string;
}

export const CampaignProgress = () => {
  // Use tRPC query instead of fetch
  const { data: campaigns, isLoading, error } = trpc.campaigns.getActive.useQuery();

  if (error) {
    console.error('Failed to fetch campaigns:', error);
  }

  // Fallback sample data for development
  const sampleCampaigns: Campaign[] = [
    {
      id: "1",
      title: "Clean Water Initiative",
      goal: 50000,
      raised: 32500,
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      donationsCount: 45,
      progressPercentage: 65
    },
    {
      id: "2",
      title: "Education for All",
      goal: 25000,
      raised: 12800,
      startDate: "2025-02-01",
      endDate: "2025-11-15",
      donationsCount: 28,
      progressPercentage: 51
    },
    {
      id: "3",
      title: "Hunger Relief Program",
      goal: 15000,
      raised: 9300,
      startDate: "2025-03-01",
      endDate: "2025-10-30",
      donationsCount: 18,
      progressPercentage: 62
    }
  ];

  // Use real data if available, otherwise use sample data
  const campaignData = Array.isArray(campaigns) && campaigns.length > 0 ? campaigns : sampleCampaigns;

  // Store client-calculated values in state
  const [clientCampaigns, setClientCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    // Only run on client
    const now = new Date();
    setClientCampaigns(
      campaignData.map((campaign) => {
        const endDate = campaign.endDate ? new Date(campaign.endDate) : null;
        const diffTime = endDate ? endDate.getTime() - now.getTime() : 0;
        const daysLeft = endDate ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
        return {
          ...campaign,
          daysLeft,
          raisedFormatted: campaign.raised.toLocaleString(),
          goalFormatted: campaign.goal.toLocaleString(),
        };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(campaignData)]);

  if (isLoading || clientCampaigns.length === 0) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-10"></div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5"></div>
              <div className="flex justify-between items-center">
                <div className="h-3 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Active Campaigns</h2>
        <div className="flex items-center space-x-2">
          <EditPermissionGate resource="campaigns">
            <button className="text-blue-600 hover:text-blue-800 text-sm">
              <i className="ri-add-line mr-1"></i>Add
            </button>
          </EditPermissionGate>
          <button className="text-sm text-gray-600 hover:text-gray-800 flex items-center">
            View All <i className="ri-arrow-right-s-line ml-1"></i>
          </button>
        </div>
      </div>
      <div className="space-y-6">
        {clientCampaigns.map((campaign) => {
          const percentage = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100);
          return (
            <div key={campaign.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{campaign.title}</h3>
                <span className="text-sm font-medium">{percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all duration-300 progress-bar-${percentage} ${
                    percentage < 30
                      ? 'bg-red-500'
                      : percentage < 70
                      ? 'bg-yellow-400'
                      : 'bg-green-500'
                  }`}
                ></div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="text-gray-600">
                  <span className="font-medium text-green-600">${campaign.raisedFormatted}</span>
                  <span className="mx-1 text-gray-400">of</span>
                  <span className="font-medium">${campaign.goalFormatted}</span>
                </div>
                <div className="flex items-center gap-3">
                  {campaign.donationsCount > 0 && (
                    <div className="flex items-center text-xs text-gray-500">
                      <i className="ri-heart-fill mr-1 text-red-400"></i>
                      <span>{campaign.donationsCount} {campaign.donationsCount === 1 ? 'donor' : 'donors'}</span>
                    </div>
                  )}
                  <div className="flex items-center text-xs">
                    <i className="ri-time-line mr-1 text-gray-500"></i>
                    <span
                      className={`font-medium ${
                        (campaign.daysLeft ?? 0) < 7 ? 'text-red-600' : 'text-gray-600'
                      }`}
                    >
                      {(campaign.daysLeft ?? 0) > 0
                        ? `${campaign.daysLeft} days left`
                        : campaign.daysLeft === 0
                        ? 'Ending today'
                        : 'Campaign ended'}
                    </span>
                  </div>
                </div>
              </div>
              <EditPermissionGate resource="campaigns">
                <div className="flex justify-end mt-2">
                  <button 
                    className="text-gray-500 hover:text-gray-700 text-xs mr-2"
                    title="Edit campaign"
                    aria-label="Edit campaign"
                  >
                    <i className="ri-edit-line mr-1"></i>Edit
                  </button>
                  <button 
                    className="text-gray-500 hover:text-gray-700 text-xs"
                    title="More options"
                    aria-label="More options"
                  >
                    <i className="ri-more-2-line"></i>
                  </button>
                </div>
              </EditPermissionGate>
            </div>
          );
        })}
      </div>
    </div>
  );
};