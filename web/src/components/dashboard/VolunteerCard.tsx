import React from 'react';
import { Activity, Award, Edit, Eye, Clock } from 'lucide-react';
import { getUserById, getVolunteerStats } from '../../lib/mockData';
import { formatRelativeDate } from '../../lib/dateUtils';

interface Volunteer {
  id: number;
  user_id: number;
  availability: string;
  emergency_contact_id: number | null;
  background_check_status_id: number;
  background_check_date: Date | null;
  background_check_expiry: Date | null;
  joined_date: Date;
  status_id: number;
  created_at: Date;
  updated_at: Date;
}

interface VolunteerCardProps {
  volunteer: Volunteer;
  onEdit?: () => void;
  onView?: () => void;
}

export default function VolunteerCard({ volunteer, onEdit, onView }: VolunteerCardProps) {
  const user = getUserById(volunteer.user_id);
  const stats = getVolunteerStats(volunteer.id);
  
  if (!user) return null;

  const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`;
  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();

  return (
    <div className="border border-border rounded-xl p-6 hover:shadow-lg transition-all bg-card">
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-4 flex-1">
          <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center text-brand-foreground text-xl font-bold shadow-md">
            {initials}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-bold text-foreground">{fullName}</h3>
              <span className="text-xs px-3 py-1 rounded-full bg-success/15 text-success font-medium">
                Active
              </span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
              <span>📧 {user.email}</span>
              {user.phone && <span>📱 {user.phone}</span>}
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="bg-info/15 rounded-lg p-2">
                <div className="flex items-center space-x-1 text-info mb-1">
                  <Clock className="w-3 h-3" />
                  <p className="text-xs">Hours</p>
                </div>
                <p className="text-lg font-bold text-info">{stats?.total_hours || 0}</p>
              </div>
              <div className="bg-chart-4/15 rounded-lg p-2">
                <div className="flex items-center space-x-1 text-chart-4 mb-1">
                  <Activity className="w-3 h-3" />
                  <p className="text-xs">Activities</p>
                </div>
                <p className="text-lg font-bold text-chart-4">{stats?.activities_count || 0}</p>
              </div>
              <div className="bg-success/15 rounded-lg p-2">
                <div className="flex items-center space-x-1 text-success mb-1">
                  <Award className="w-3 h-3" />
                  <p className="text-xs">Projects</p>
                </div>
                <p className="text-lg font-bold text-success">{stats?.projects_count || 0}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Last active: {formatRelativeDate(stats?.last_activity_date)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={onView}
            className="p-2 text-muted-foreground hover:bg-accent rounded-lg transition-colors"
            title="View Profile"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button 
            onClick={onEdit}
            className="p-2 text-info hover:bg-info/15 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
