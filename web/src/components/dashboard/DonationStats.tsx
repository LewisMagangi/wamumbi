import { formatAmount } from '@/lib/mockData';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: string;
}

function StatCard({ title, value, icon, trend, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% vs last month
            </p>
          )}
        </div>
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
          style={{ backgroundColor: `${color}20` } as React.CSSProperties}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

interface DonationStatsProps {
  totalDonations: number;
  totalDonors: number;
  activeCampaigns: number;
  avgDonation: number;
}

export default function DonationStats({
  totalDonations,
  totalDonors,
  activeCampaigns,
  avgDonation,
}: DonationStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Donations"
        value={formatAmount(totalDonations)}
        icon="💰"
        trend={{ value: 12.5, isPositive: true }}
        color="#10b981"
      />
      <StatCard
        title="Total Donors"
        value={totalDonors}
        icon="👥"
        trend={{ value: 8.2, isPositive: true }}
        color="#3b82f6"
      />
      <StatCard
        title="Active Campaigns"
        value={activeCampaigns}
        icon="🎯"
        color="#f59e0b"
      />
      <StatCard
        title="Average Donation"
        value={formatAmount(avgDonation)}
        icon="📊"
        trend={{ value: 3.1, isPositive: true }}
        color="#8b5cf6"
      />
    </div>
  );
}
