import React from 'react';
import { Plus, Calendar } from 'lucide-react';
import { mockEvents, mockEventStatuses, mockAddresses } from '../../../lib/mockData';
import { formatDate, formatTime } from '../../../lib/dateUtils';

interface EventsViewProps {
  openModal?: (type: string) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({ openModal }) => {
  const getStatusName = (statusId: number) => {
    const status = mockEventStatuses.find(s => s.id === statusId);
    return status?.name || 'Unknown';
  };

  const getLocation = (addressId: number) => {
    const address = mockAddresses.find(a => a.id === addressId);
    return address ? `${address.city}, ${address.country}` : 'TBD';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
          <p className="text-gray-600 mt-1">Plan and manage charity events</p>
        </div>
        <button
          onClick={() => openModal?.('event')}
          className="flex items-center space-x-2 bg-rose-400 text-white px-4 py-2 rounded-lg hover:bg-rose-500 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockEvents.map((event) => {
          const statusName = getStatusName(event.status_id);
          const location = getLocation(event.address_id);
          const attendeeCount = 0; // Mock data - would come from registrations
          
          return (
            <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-rose-600" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  statusName === 'Scheduled'
                    ? 'bg-blue-100 text-blue-800'
                    : statusName === 'Ongoing'
                    ? 'bg-green-100 text-green-800'
                    : statusName === 'Completed'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {statusName}
                </span>
              </div>
              
              <h3 className="font-bold text-lg mb-2">{event.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">{formatDate(event.event_date)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium">{formatTime(event.event_date)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium">{location}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Capacity</span>
                  <span className="font-medium">
                    {attendeeCount} / {event.capacity}
                  </span>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Registration</span>
                    <span className="font-medium">
                      {Math.round((attendeeCount / event.capacity) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-rose-600 h-2 rounded-full"
                      style={{ width: `${(attendeeCount / event.capacity) * 100}%` }}
                      role="progressbar"
                      aria-valuenow={Math.round((attendeeCount / event.capacity) * 100)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Event registration: ${Math.round((attendeeCount / event.capacity) * 100)}%`}
                    />
                  </div>
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
