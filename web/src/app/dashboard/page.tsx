'use client';
import React from 'react';
import { mockCampaigns, mockDashboardSummary } from '@/lib/mockData';
import CampaignCard from '@/components/dashboard/CampaignCard';
import DonationStats from '@/components/dashboard/DonationStats';
import { RecentDonations } from '@/components/dashboard/RecentDonations';
import DonationChart from '@/components/dashboard/DonationChart';
import CategoryBreakdown from '@/components/dashboard/CategoryBreakdown';

export default function DashboardPage() {
  const { 
    totalDonations, 
    totalDonors, 
    activeCampaigns, 
    avgDonation,
    topCampaigns,
    monthlyTrend,
    donationsByCategory
  } = mockDashboardSummary;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your campaigns.</p>
        </div>

        {/* Statistics Cards */}
        <DonationStats
          totalDonations={totalDonations}
          totalDonors={totalDonors}
          activeCampaigns={activeCampaigns}
          avgDonation={avgDonation}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            <DonationChart data={monthlyTrend} />
            
            {/* Top Campaigns */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Top Performing Campaigns</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topCampaigns.slice(0, 2).map((campaign) => (
                  <div key={campaign.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                      {campaign.title}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold text-green-600">
                          {campaign.stats.completion_percentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(campaign.stats.completion_percentage, 100)}%` } as React.CSSProperties}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{campaign.stats.donations_count} donations</span>
                        <span>{campaign.stats.unique_donors_count} donors</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Categories and Recent Activity */}
          <div className="space-y-6">
            <CategoryBreakdown data={donationsByCategory} />
            <RecentDonations />
          </div>
        </div>

        {/* Active Campaigns Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Active Campaigns</h2>
            <button 
              type="button"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Campaign
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCampaigns
              .filter(c => c.status_id === 2)
              .map((campaign) => (
                <CampaignCard key={campaign.id} {...campaign} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}