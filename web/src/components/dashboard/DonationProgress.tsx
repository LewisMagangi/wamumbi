// components/dashboard/DonationProgress.tsx
'use client';
import { FC, useEffect, useState } from 'react';

interface Campaign {
  id: number;
  title: string;
  description: string;
  goal: number;
  raised: number;
  endDate: string;
}

const DonationProgress: FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/campaigns');
        const data = await response.json();
        setCampaigns(data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Donation Campaigns</h2>
      
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-2 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded-full w-full"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {campaigns.map((campaign) => {
            const percentage = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100);
            const daysLeft = Math.ceil((new Date(campaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <div key={campaign.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{campaign.title}</h3>
                  <span className="text-sm font-medium">{percentage}%</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      percentage < 30 ? 'bg-red-500' : percentage < 70 ? 'bg-yellow-400' : 'bg-green-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm text-gray-500">
                  <span>${campaign.raised.toLocaleString()} raised</span>
                  <span>Goal: ${campaign.goal.toLocaleString()}</span>
                </div>
                
                <div className="text-xs text-gray-500">
                  {daysLeft > 0 ? (
                    <span>{daysLeft} days left</span>
                  ) : (
                    <span>Campaign ended</span>
                  )}
                </div>
              </div>
            );
          })}
          
          <button className="mt-4 text-primary-blue hover:text-blue-700 text-sm font-medium">
            View All Campaigns <i className="ri-arrow-right-line"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default DonationProgress;