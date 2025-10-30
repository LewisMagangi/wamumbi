import React from 'react';
import { mockDashboardSummary, formatAmount } from '@/lib/mockData';
import { TrendingUp, DollarSign, Users, Target, Calendar } from 'lucide-react';

export const StatisticsCards = () => {
  const stats = {
    totalDonations: mockDashboardSummary.totalDonations,
    totalDonors: mockDashboardSummary.totalDonors,
    activeCampaigns: mockDashboardSummary.activeCampaigns,
    avgDonation: mockDashboardSummary.avgDonation,
  };

  const cards = [
    {
      title: 'Total Donations',
      value: formatAmount(stats.totalDonations),
      change: '+12.5%',
      isPositive: true,
      icon: DollarSign,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      borderColor: 'border-green-500',
    },
    {
      title: 'Total Donors',
      value: stats.totalDonors.toString(),
      change: '+8.2%',
      isPositive: true,
      icon: Users,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-500',
    },
    {
      title: 'Active Campaigns',
      value: stats.activeCampaigns.toString(),
      change: 'Live now',
      isPositive: true,
      icon: Target,
      bgColor: 'bg-rose-100',
      iconColor: 'text-rose-600',
      borderColor: 'border-rose-500',
    },
    {
      title: 'Average Donation',
      value: formatAmount(stats.avgDonation),
      change: '+5.3%',
      isPositive: true,
      icon: Calendar,
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div 
            key={index} 
            className={`bg-white rounded-lg shadow-sm border-l-4 ${card.borderColor} p-6 hover:shadow-md transition-shadow`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium mb-2">{card.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{card.value}</h3>
                
                <div className="flex items-center text-sm">
                  {card.isPositive && <TrendingUp className="h-4 w-4 text-green-600 mr-1" />}
                  <span className={`font-medium ${card.isPositive ? 'text-green-600' : 'text-gray-600'}`}>
                    {card.change}
                  </span>
                  {card.change.includes('%') && (
                    <span className="text-gray-500 ml-1">from last month</span>
                  )}
                </div>
              </div>
              
              <div className={`${card.bgColor} h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0`}>
                <Icon className={`h-6 w-6 ${card.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};