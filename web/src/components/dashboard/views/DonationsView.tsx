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
          <h2 className="text-2xl font-bold text-gray-900">Donation Management</h2>
          <p className="text-gray-600 mt-1">Track and manage all donations</p>
        </div>
        <button
          onClick={() => openModal?.('donation')}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <Plus className="w-4 h-4" />
          <span>Record Donation</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Donations</p>
          <p className="text-2xl font-bold text-gray-900">{formatAmount(mockDashboardSummary.totalDonations)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Donors</p>
          <p className="text-2xl font-bold text-gray-900">{mockDashboardSummary.totalDonors}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Average Donation</p>
          <p className="text-2xl font-bold text-gray-900">{formatAmount(mockDashboardSummary.avgDonation)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">This Month</p>
          <p className="text-2xl font-bold text-green-600">+12.5%</p>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-bold text-lg">Recent Donations</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {donations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{getDonorName(donation.donor_id)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{getCategoryName(donation.campaign_id)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-green-600">{formatAmount(donation.amount)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{formatDate(donation.donation_date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
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
