import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { EditPermissionGate, AdminGate } from '../auth/PermissionGate';
import { useAuth } from '../../contexts/AuthContext';

type Donation = {
  id: number;
  donorId: number;
  donorName: string;
  amount: number;
  campaignId: number;
  campaignName: string;
  date: string;
  avatar: string;
};

export const RecentDonations = () => {
  const { role } = useAuth();
  
  const { data: donationsData, isLoading } = useQuery({
  queryKey: ['/api/donations'],
  queryFn: async () => {
    const res = await fetch('/api/donations');
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  },
});

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

  // Sample donations data for development
  const sampleDonations = [
    {
      id: 1,
      donorId: 1,
      donorName: "John Smith",
      amount: 250,
      campaignId: 1,
      campaignName: "Clean Water Initiative",
      date: "2023-09-22T14:30:00Z",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      donorId: 2,
      donorName: "Emily Johnson",
      amount: 500,
      campaignId: 2,
      campaignName: "Education for All",
      date: "2023-09-21T09:15:00Z",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 3,
      donorId: 3,
      donorName: "Michael Chen",
      amount: 100,
      campaignId: 3,
      campaignName: "Hunger Relief Program",
      date: "2023-09-20T16:45:00Z",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg"
    },
    {
      id: 4,
      donorId: 4,
      donorName: "Sarah Williams",
      amount: 75,
      campaignId: 4,
      campaignName: "Healthcare Team",
      date: "2023-09-19T11:20:00Z",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg"
    }
  ];

  // Use real data if available, otherwise use sample data
  const donations = donationsData && donationsData.length > 0 ? 
    donationsData.map((donation: any) => ({
      ...donation,
      donorName: `Donor #${donation.donorId}`, // In a real app, you'd fetch the donor name
      campaignName: `Campaign #${donation.campaignId}`, // In a real app, you'd fetch the campaign name
      avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg` // Placeholder
    })) 
    : sampleDonations;

  // Show only a limited set of donations
  const recentDonations = donations.slice(0, 5);

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
            {recentDonations.map((donation: Donation) => (
              <tr key={donation.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img 
                        className="h-10 w-10 rounded-full object-cover" 
                        src={donation.avatar}
                        alt={donation.donorName} 
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{donation.donorName}</div>
                      
                      {/* Only admins and team leaders can see donor details */}
                      {(role === 'admin' || role === 'team_leader') && (
                        <div className="text-xs text-gray-500">ID: {donation.donorId}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{donation.campaignName}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-green-600">${donation.amount.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <i className="ri-time-line mr-1"></i>
                    <span>{getTimeAgo(donation.date)}</span>
                  </div>
                </td>
                {/* Only show actions column to admin users */}
                <AdminGate>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <i className="ri-mail-line"></i>
                    </button>
                    <button className="text-gray-500 hover:text-gray-900">
                      <i className="ri-more-2-line"></i>
                    </button>
                  </td>
                </AdminGate>
              </tr>
            ))}
          </tbody>
        </table>

        {recentDonations.length === 0 && (
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