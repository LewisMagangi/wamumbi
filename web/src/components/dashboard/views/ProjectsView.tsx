import React from 'react';
import { Plus, FolderKanban } from 'lucide-react';
import { mockProjects, mockProjectStatuses, getProjectProgress } from '../../../lib/mockData';
import { formatDate } from '../../../lib/dateUtils';

interface ProjectsViewProps {
  openModal?: (type: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ openModal }) => {
  const getStatusName = (statusId: number) => {
    const status = mockProjectStatuses.find(s => s.id === statusId);
    return status?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Management</h2>
          <p className="text-gray-600 mt-1">Track and manage ongoing projects</p>
        </div>
        <button
          onClick={() => openModal?.('project')}
          className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map((project) => {
          const statusName = getStatusName(project.status_id);
          const progress = getProjectProgress(project.id);
          
          return (
            <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FolderKanban className="w-6 h-6 text-gray-600" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  statusName === 'Active' || statusName === 'In Progress'
                    ? 'bg-green-100 text-green-800'
                    : statusName === 'Planning'
                    ? 'bg-blue-100 text-blue-800'
                    : statusName === 'Completed'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {statusName}
                </span>
              </div>
              
              <h3 className="font-bold text-lg mb-2">{project.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{progress?.progress_percentage || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-rose-600 h-2 rounded-full"
                      style={{ width: `${progress?.progress_percentage || 0}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Team Size</span>
                  <span className="font-medium">{progress?.volunteers_count || 0}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Budget</span>
                  <span className="font-medium">${project.budget.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Deadline</span>
                  <span className="font-medium">{formatDate(project.end_date)}</span>
                </div>
              </div>
              
              <button className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
                View Details
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
