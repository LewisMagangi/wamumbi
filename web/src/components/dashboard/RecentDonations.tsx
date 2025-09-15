import React from 'react';
import Image from 'next/image';
import { trpc } from '@/app/_trpc/client';
import { EditPermissionGate, AdminGate } from '../auth/PermissionGate';
import { useAuth } from '../../contexts/AuthContext';

interface DonationData {
  id: string;
  amount: number;
  donationDate: string;
  donorName: string;
  campaignTitle: string;
  paymentMethod: string;
  status: string;
}

export const RecentDonations = () => {
  const { role } = useAuth();
  
  // Use tRPC query instead of react-query
  const { data: donations, isLoading, error } = trpc.donations.getRecent.useQuery();

  // Function to format relative time
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    // Return the date in readable format for older donations
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

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

  // Sample donations data for development
  const defaultAvatarUrl = "https://randomuser.me/api/portraits/men/32.jpg";

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Recent Donations</h2>
        <div className="flex space-x-2">
          <EditPermissionGate resource="donations">
            <button className="text-blue-600 hover:text-blue-800 text-sm mr-3">
              <i className="ri-add-line mr-1"></i>Record Donation
            </button>
          </EditPermissionGate>
          
          <button className="text-sm text-gray-600 hover:text-gray-800 flex items-center">
            View All <i className="ri-arrow-right-s-line ml-1"></i>
          </button>
        </div>
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
          <tbody>
            {donations?.map((donation: DonationData) => (
              <tr key={donation.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <Image
                        className="h-10 w-10 rounded-full object-cover" 
                        src={defaultAvatarUrl}
                        alt={donation.donorName}
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{donation.donorName}</div>
                      
                      {/* Only admins and team leaders can see donor details */}
                      {(role === 'admin' || role === 'team_leader') && (
                        <div className="text-xs text-gray-500">ID: {donation.id}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{donation.campaignTitle}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-green-600">${Number(donation.amount).toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <i className="ri-time-line mr-1"></i>
                    <span>{getTimeAgo(donation.donationDate.toString())}</span>
                  </div>
                </td>
                {/* Only show actions column to admin users */}
                <AdminGate>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button 
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="Send email"
                      aria-label="Send email to donor"
                    >
                      <i className="ri-mail-line"></i>
                    </button>
                    <button 
                      className="text-gray-500 hover:text-gray-900"
                      title="More options"
                      aria-label="More options"
                    >
                      <i className="ri-more-2-line"></i>
                    </button>
                  </td>
                </AdminGate>
              </tr>
            ))}
          </tbody>
        </table>

        {(!donations || donations.length === 0) && (
          <div className="text-center py-8">
            <i className="ri-funds-line text-5xl text-gray-300 mb-2"></i>
            <p className="text-gray-500">No donations recorded yet</p>
            <EditPermissionGate 
              resource="donations"
              fallback={
                <p className="text-sm text-gray-400 mt-2">Donations will appear here once received</p>
              }
            >
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                Record First Donation
              </button>
            </EditPermissionGate>
          </div>
        )}
      </div>
    </div>
  );
};