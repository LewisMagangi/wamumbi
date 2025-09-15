import React from 'react';
import { trpc } from '@/app/_trpc/client';
import { EditPermissionGate } from '../auth/PermissionGate';

export const TeamOverview = () => {
  // Use tRPC query instead of fetch
  const { data: teams, isLoading, error } = trpc.teams.getOverview.useQuery();

  if (error) {
    console.error('Failed to fetch teams:', error);
  }

  if (isLoading) {
    return (
      <div className="card h-full p-6 animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-3 rounded-lg bg-gray-50">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div className="ml-3 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Sample teams data for development
  const sampleTeams = [
    { id: 1, name: "Water Project Team", memberCount: 12, color: "bg-blue-500" },
    { id: 2, name: "Education Team", memberCount: 8, color: "bg-green-500" },
    { id: 3, name: "Hunger Relief Team", memberCount: 15, color: "bg-red-500" },
    { id: 4, name: "Healthcare Team", memberCount: 10, color: "bg-purple-500" }
  ];

  // Use real data if available, otherwise use sample data
  const teamsData = Array.isArray(teams) ? teams : sampleTeams;

  return (
    <div className="card h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Teams</h2>
        <div className="flex items-center space-x-2">
          <EditPermissionGate resource="teams">
            <button className="text-blue-600 hover:text-blue-800 text-sm">
              <i className="ri-add-line mr-1"></i>Add
            </button>
          </EditPermissionGate>
          
          <button className="text-sm text-gray-600 hover:text-gray-800">
            View All <i className="ri-arrow-right-s-line ml-1"></i>
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {teamsData.map((team) => (
          <div 
            key={team.id} 
            className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${team.color}`}
            >
              {team.name.charAt(0)}
            </div>
            
            <div className="ml-3 flex-1">
              <h3 className="font-medium text-gray-800">{team.name}</h3>
              <div className="flex items-center mt-1">
                <div className="flex -space-x-2 mr-2">
                  {/* This would show actual team member avatars in a real app */}
                  {[...Array(Math.min(3, team.memberCount))].map((_, i) => (
                    <div key={i} className="w-5 h-5 rounded-full bg-gray-300 border border-white"></div>
                  ))}
                </div>
                <p className="text-xs text-gray-500">{team.memberCount} members</p>
              </div>
            </div>
            
            <EditPermissionGate resource="teams">
              <button 
                className="text-gray-400 hover:text-gray-600"
                title="Team options"
                aria-label="Team options"
              >
                <i className="ri-more-2-fill"></i>
              </button>
            </EditPermissionGate>
          </div>
        ))}
        
        <EditPermissionGate resource="teams">
          <button className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors text-sm mt-2 flex items-center justify-center">
            <i className="ri-add-line mr-1"></i> Add New Team
          </button>
        </EditPermissionGate>
      </div>
    </div>
  );
};