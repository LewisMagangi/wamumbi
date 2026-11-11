// components/dashboard/DonationProgress.tsx
'use client';
import { FC } from 'react';
import { trpc } from '@/app/_trpc/client';

const DonationProgress: FC = () => {
  const { data: campaigns, isLoading, error } = trpc.campaigns.getAll.useQuery();

  return (
    <div className="bg-card p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Donation Campaigns</h2>
      
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-2 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded-full w-full"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-destructive text-sm">
          Error loading campaigns: {error.message}
        </div>
      ) : (
        <div className="space-y-6">
          {campaigns?.map((campaign) => {
            const percentage = Math.min(campaign.progressPercentage, 100);
            const daysLeft = campaign.createdAt 
              ? Math.ceil((new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
              : null;
            
            return (
              <div key={campaign.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{campaign.title}</h3>
                  <span className="text-sm font-medium">{percentage}%</span>
                </div>
                
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-300 progress-bar-${Math.min(percentage, 100)} ${
                      percentage < 30 ? 'bg-destructive' : percentage < 70 ? 'bg-warning' : 'bg-primary'
                    }`}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${Number(campaign.currentAmount).toLocaleString()} raised</span>
                  <span>Goal: ${Number(campaign.goalAmount).toLocaleString()}</span>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {daysLeft && daysLeft > 0 ? (
                    <span>{daysLeft} days left</span>
                  ) : (
                    <span>Campaign ended</span>
                  )}
                </div>
              </div>
            );
          })}
          
          <button className="mt-4 text-primary-blue hover:text-info text-sm font-medium">
            View All Campaigns <i className="ri-arrow-right-line"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default DonationProgress;