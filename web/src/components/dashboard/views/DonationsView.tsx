import React from 'react';
import { Plus } from 'lucide-react';
import { mockDashboardSummary, formatAmount, getDonorName, getCategoryName } from '../../../lib/mockData';
import { formatDate } from '../../../lib/dateUtils';

interface DonationsViewProps {
  openModal?: (type: string) => void;
}

export const DonationsView: React.FC<DonationsViewProps> = ({ openModal }) => {
  const donations = mockDashboardSummary.recentDonations;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Donation Management</h2>
          <p className="text-muted-foreground mt-1">Track and manage all donations</p>
        </div>
        <button
          onClick={() => openModal?.('donation')}
          className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          <span>Record Donation</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground">Total Donations</p>
          <p className="text-2xl font-bold text-foreground">{formatAmount(mockDashboardSummary.totalDonations)}</p>
        </div>
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground">Total Donors</p>
          <p className="text-2xl font-bold text-foreground">{mockDashboardSummary.totalDonors}</p>
        </div>
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground">Average Donation</p>
          <p className="text-2xl font-bold text-foreground">{formatAmount(mockDashboardSummary.avgDonation)}</p>
        </div>
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground">This Month</p>
          <p className="text-2xl font-bold text-success">+12.5%</p>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-card rounded-xl shadow-sm border border-border">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-bold text-lg">Recent Donations</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Donor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {donations.map((donation) => (
                <tr key={donation.id} className="hover:bg-accent">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">{getDonorName(donation.donor_id)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-foreground">{getCategoryName(donation.campaign_id)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-success">{formatAmount(donation.amount)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-muted-foreground">{formatDate(donation.donation_date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-success/15 text-success rounded-full text-xs font-medium">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
