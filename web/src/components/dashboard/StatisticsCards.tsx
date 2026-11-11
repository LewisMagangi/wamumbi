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
      bgColor: 'bg-success/15',
      iconColor: 'text-success',
      borderColor: 'border-success/40',
    },
    {
      title: 'Total Donors',
      value: stats.totalDonors.toString(),
      change: '+8.2%',
      isPositive: true,
      icon: Users,
      bgColor: 'bg-info/15',
      iconColor: 'text-info',
      borderColor: 'border-info/40',
    },
    {
      title: 'Active Campaigns',
      value: stats.activeCampaigns.toString(),
      change: 'Live now',
      isPositive: true,
      icon: Target,
      bgColor: 'bg-brand/10',
      iconColor: 'text-brand',
      borderColor: 'border-brand',
    },
    {
      title: 'Average Donation',
      value: formatAmount(stats.avgDonation),
      change: '+5.3%',
      isPositive: true,
      icon: Calendar,
      bgColor: 'bg-warning/15',
      iconColor: 'text-warning',
      borderColor: 'border-warning/40',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div 
            key={index} 
            className={`bg-card rounded-lg shadow-sm border-l-4 ${card.borderColor} p-6 hover:shadow-md transition-shadow`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground font-medium mb-2">{card.title}</p>
                <h3 className="text-2xl font-bold text-foreground mb-3">{card.value}</h3>
                
                <div className="flex items-center text-sm">
                  {card.isPositive && <TrendingUp className="h-4 w-4 text-success mr-1" />}
                  <span className={`font-medium ${card.isPositive ? 'text-success' : 'text-muted-foreground'}`}>
                    {card.change}
                  </span>
                  {card.change.includes('%') && (
                    <span className="text-muted-foreground ml-1">from last month</span>
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