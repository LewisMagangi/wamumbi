'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/footer';
import Sidebar from '@/components/dashboard/Sidebar';
import MenuButton from '@/components/dashboard/MenuButton';
import { Calendar, MapPin, Users, DollarSign, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { mockEvents, mockAddresses, mockEventRegistrations } from '@/lib/mockData';
import { formatDate, formatTime } from '@/lib/dateUtils';

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  
  const idParam = params?.id;
  const eventId = idParam ? parseInt(idParam as string, 10) : NaN;
  const event = mockEvents.find(e => e.id === eventId);
  
  if (!event) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
            <button
              onClick={() => router.push('/events')}
              className="text-rose-600 hover:text-rose-700 font-medium"
            >
              Back to Events
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const address = mockAddresses.find(a => a.id === event.address_id);
  const registrations = mockEventRegistrations.filter(r => r.event_id === eventId);
  const availableTickets = event.capacity - registrations.length;

  const handleBuyTicket = () => {
    // Implement ticket purchase logic
    console.log('Buying', ticketQuantity, 'tickets for event', eventId);
    alert(`Successfully registered for ${ticketQuantity} ticket(s)!`);
    setShowTicketModal(false);
  };

  return (
    <>
      <Navbar />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <MenuButton onClick={() => setSidebarOpen(true)} />
      
      <div className="min-h-screen bg-gray-50 pt-16">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => router.push('/events')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </button>

          {/* Event Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            {event.image_url && (
              <div className="h-96 bg-gradient-to-r from-rose-500 to-purple-600 flex items-center justify-center">
                <ImageIcon className="w-24 h-24 text-white opacity-50" />
              </div>
            )}
            
            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
                  <p className="text-lg text-gray-700 mb-6">{event.description}</p>
                </div>
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Scheduled
                </span>
              </div>

              {/* Event Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-rose-600 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold text-gray-900">{formatDate(event.event_date)}</p>
                    <p className="text-sm text-gray-600">{formatTime(event.event_date)}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-rose-600 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900">{address?.city}, {address?.country}</p>
                    <p className="text-sm text-gray-600">{address?.street_line_1}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Users className="w-5 h-5 text-rose-600 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Capacity</p>
                    <p className="font-semibold text-gray-900">{registrations.length} / {event.capacity}</p>
                    <p className="text-sm text-gray-600">{availableTickets} spots left</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <DollarSign className="w-5 h-5 text-rose-600 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Ticket Price</p>
                    <p className="font-semibold text-gray-900">
                      {event.ticket_price > 0 ? `$${event.ticket_price}` : 'Free'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowTicketModal(true)}
                  disabled={availableTickets === 0}
                  className={`flex-1 py-3 px-6 rounded-lg font-bold transition-colors ${
                    availableTickets === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-rose-500 hover:bg-rose-600 text-white'
                  }`}
                >
                  {availableTickets === 0 ? 'Sold Out' : 'Register for Event'}
                </button>
                <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                  Share Event
                </button>
              </div>
            </div>
          </div>

          {/* Photo Gallery Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-gradient-to-br from-rose-100 to-purple-100 rounded-lg flex items-center justify-center"
                >
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
              <div className="prose max-w-none text-gray-700">
                <p className="mb-4">{event.description}</p>
                <p className="mb-4">
                  Join us for an unforgettable experience that brings together our community
                  in support of a great cause. This event promises to be both impactful and
                  enjoyable for all attendees.
                </p>
                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">What to Expect</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Engaging presentations and activities</li>
                  <li>Networking opportunities with like-minded individuals</li>
                  <li>Refreshments and entertainment</li>
                  <li>Opportunity to make a real difference</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Event Organizer</h3>
                <p className="text-gray-700 mb-2">Wamumbi Foundation</p>
                <p className="text-sm text-gray-600">Bringing hope to orphaned children</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Important Information</h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-rose-600 rounded-full mr-2 mt-1.5"></span>
                    <span>Registration deadline: {event.registration_deadline && formatDate(event.registration_deadline)}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-rose-600 rounded-full mr-2 mt-1.5"></span>
                    <span>Please arrive 15 minutes early</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-rose-600 rounded-full mr-2 mt-1.5"></span>
                    <span>Confirmation email will be sent upon registration</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Ticket Purchase Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Register for Event</h2>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-2">{event.title}</p>
              <p className="text-sm text-gray-600">{formatDate(event.event_date)} at {formatTime(event.event_date)}</p>
            </div>

            <div className="mb-6">
              <label htmlFor="ticketQuantity" className="block text-sm font-medium text-gray-700 mb-2">
                Number of Tickets
              </label>
              <select
                id="ticketQuantity"
                value={ticketQuantity}
                onChange={(e) => setTicketQuantity(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Ticket Price:</span>
                <span className="font-semibold">${event.ticket_price}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Quantity:</span>
                <span className="font-semibold">{ticketQuantity}</span>
              </div>
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">Total:</span>
                  <span className="font-bold text-rose-600">
                    ${(event.ticket_price * ticketQuantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleBuyTicket}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Confirm Registration
              </button>
              <button
                onClick={() => setShowTicketModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}