import React, { useState, useEffect } from 'react';
import { trpc } from '@/app/_trpc/client';
import { EditPermissionGate } from '../auth/PermissionGate';

interface Campaign {
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