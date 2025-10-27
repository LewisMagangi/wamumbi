// src/components/dashboard/UpcomingEvents.tsx
import React from 'react';
import { EditPermissionGate } from '../auth/PermissionGate';

interface Event {
  id: string;
  title: string;
  startDate: Date;
  location: string;
  capacity?: number | null;
}

export const UpcomingEvents = () => {
  // Sample event data - in production this would come from tRPC
  const events: Event[] = [
    {
      id: "1",
      title: "Annual Charity Gala",
      startDate: new Date("2025-11-15T19:00:00"),
      location: "Grand Hotel, New York",
      capacity: 200
    },
    {
      id: "2",
      title: "Community Cleanup Drive",
      startDate: new Date("2025-10-30T09:00:00"),
      location: "Central Park",
      capacity: null
    },
    {
      id: "3",
      title: "Fundraising Workshop",
      startDate: new Date("2025-11-05T14:00:00"),
      location: "Community Center",
      capacity: 50
    }
  ];

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  // Get days until event
  const getDaysUntil = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days < 0) return 'Past';
    return `In ${days} days`;
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Upcoming Events</h2>
        <div className="flex items-center space-x-2">
          <EditPermissionGate resource="events">
            <button className="text-blue-600 hover:text-blue-800 text-sm">
              <i className="ri-add-line mr-1"></i>Create
            </button>
          </EditPermissionGate>
          
          <button className="text-sm text-gray-600 hover:text-gray-800 flex items-center">
            View All <i className="ri-arrow-right-s-line ml-1"></i>
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="text-center py-8">
            <i className="ri-calendar-line text-5xl text-gray-300 mb-2"></i>
            <p className="text-gray-500">No upcoming events scheduled</p>
            <EditPermissionGate resource="events">
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                <i className="ri-add-line mr-1"></i> Create Event
              </button>
            </EditPermissionGate>
          </div>
        ) : (
          events.map((event) => {
            const daysUntil = getDaysUntil(event.startDate);
            const isPast = daysUntil === 'Past';
            
            return (
              <div 
                key={event.id} 
                className={`flex border rounded-lg overflow-hidden hover:shadow-md transition-shadow ${isPast ? 'opacity-60' : ''}`}
              >
                <div className="w-16 flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 flex flex-col items-center justify-center p-2 text-white">
                  <span className="text-xs font-medium uppercase">
                    {event.startDate.toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-2xl font-bold">
                    {event.startDate.getDate()}
                  </span>
                </div>
                
                <div className="flex-1 p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      
                      <div className="flex flex-wrap items-center text-sm text-gray-600 mt-1 gap-x-3 gap-y-1">
                        <span className="flex items-center">
                          <i className="ri-time-line mr-1"></i>
                          {formatTime(event.startDate)}
                        </span>
                        <span className="flex items-center">
                          <i className="ri-map-pin-line mr-1"></i>
                          {event.location}
                        </span>
                        {event.capacity && (
                          <span className="flex items-center">
                            <i className="ri-group-line mr-1"></i>
                            {event.capacity} spots
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          isPast 
                            ? 'bg-gray-100 text-gray-600' 
                            : daysUntil === 'Today' 
                            ? 'bg-red-100 text-red-700'
                            : daysUntil === 'Tomorrow'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          <i className={`${isPast ? 'ri-time-line' : 'ri-calendar-check-line'} mr-1`}></i>
                          {daysUntil}
                        </span>
                      </div>
                    </div>
                    
                    {!isPast && (
                      <button className="ml-3 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap">
                        Register
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      <EditPermissionGate resource="events">
        <button className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors text-sm mt-3 flex items-center justify-center">
          <i className="ri-add-line mr-1"></i> Schedule New Event
        </button>
      </EditPermissionGate>
    </div>
  );
};