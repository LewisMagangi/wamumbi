import React from 'react';
import { trpc } from '@/app/_trpc/client';

type DonationStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

const STATUS_MAP: Record<string, { text: string; color: string }> = {
  pending: { text: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  processing: { text: 'Processing', color: 'bg-blue-100 text-blue-800' },
  completed: { text: 'Completed', color: 'bg-green-100 text-green-800' },
  failed: { text: 'Failed', color: 'bg-red-100 text-red-800' },
  refunded: { text: 'Refunded', color: 'bg-gray-100 text-gray-800' },
};

function getStatusBadge(status: string) {
  const normalizedStatus = status.toLowerCase();
  const statusInfo = STATUS_MAP[normalizedStatus] || { text: status, color: 'bg-gray-100 text-gray-800' };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
      {statusInfo.text}
    </span>
  );
}

function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return dateObj.toLocaleDateString();
}

function formatAmount(amount: number, currency: string): string {
  const symbol = currency === 'USD' ? '$' : currency === 'KES' ? 'KSh' : '€';
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export const RecentDonations = () => {
  // Use tRPC query instead of react-query
  const { data: donations, isLoading, error } = trpc.donations.getRecent.useQuery();

  if (isLoading) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3 border-b">Donor</th>
                <th className="px-6 py-3 border-b">Campaign</th>
                <th className="px-6 py-3 border-b">Amount</th>
                <th className="px-6 py-3 border-b">Date</th>
                <th className="px-6 py-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[...Array(4)].map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                      <div className="ml-4">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6">
        <div className="text-red-500 text-sm">
          Error loading donations: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Donations</h2>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {!donations || donations.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No donations yet</p>
        ) : (
          donations.map((donation) => {
            return (
              <div 
                key={donation.id} 
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-gray-900">
                      {donation.donorName}
                    </span>
                    {getStatusBadge(donation.status)}
                  </div>
                  <p className="text-sm text-gray-600">
                    donated to <span className="font-medium">{donation.campaignTitle}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(donation.donationDate)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    {formatAmount(donation.amount, donation.currency)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};