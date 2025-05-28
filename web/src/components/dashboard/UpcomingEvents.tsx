// src/components/dashboard/UpcomingEvents.tsx
import React from 'react';

export const UpcomingEvents = () => {
  // Sample event data
  const events = [
    {
      id: 1,
      title: "Annual Charity Gala",
      date: "2023-10-15",
      time: "7:00 PM",
      location: "Grand Hotel, New York",
      type: "paid"
    },
    {
      id: 2,
      title: "Community Cleanup Drive",
      date: "2023-09-30",
      time: "9:00 AM",
      location: "Central Park",
      type: "free"
    },
    {
      id: 3,
      title: "Fundraising Workshop",
      date: "2023-10-05",
      time: "2:00 PM",
      location: "Community Center",
      type: "rsvp"
    }
  ];

  // Format date without date-fns
  const formatDate = (dateString: string) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US',);
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Upcoming Events</h2>
        <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
          View All <i className="ri-arrow-right-s-line ml-1"></i>
        </button>
      </div>
      
      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="text-center py-8">
            <i className="ri-calendar-line text-5xl text-gray-300 mb-2"></i>
            <p className="text-gray-500">No upcoming events scheduled</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
              Create Event
            </button>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="flex border rounded-lg overflow-hidden">
              <div className="w-20 flex-shrink-0 bg-blue-100 flex flex-col items-center justify-center p-2 border-r">
                <span className="text-xs font-medium text-blue-700">
                  {formatDate(event.date).split(' ')[0]}
                </span>
                <span className="text-lg font-bold text-blue-800">
                  {new Date(event.date).getDate()}
                </span>
                <span className="text-xs text-blue-700">
                  {formatDate(event.date).split(' ')[1]}
                </span>
              </div>
              
              <div className="flex-1 p-3">
                <h3 className="font-medium">{event.title}</h3>
                
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <i className="ri-time-line mr-1"></i>
                  <span>{event.time}</span>
                  <span className="mx-2">•</span>
                  <i className="ri-map-pin-line mr-1"></i>
                  <span>{event.location}</span>
                </div>
                
                <div className="mt-3">
                  {event.type === 'free' && (
                    <button className="px-3 py-1 bg-green-600 text-white rounded text-xs">
                      Register Now
                    </button>
                  )}
                  
                  {event.type === 'paid' && (
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs">
                      Buy Tickets
                    </button>
                  )}
                  
                  {event.type === 'rsvp' && (
                    <button className="px-3 py-1 bg-red-600 text-white rounded text-xs">
                      RSVP
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};