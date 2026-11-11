'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/footer';
import Sidebar from '@/components/dashboard/Sidebar';
import MenuButton from '@/components/dashboard/MenuButton';
import { Calendar, MapPin, Users, DollarSign, Image as ImageIcon, ArrowLeft, Loader2, Clock } from 'lucide-react';
import { trpc } from '@/app/_trpc/client';

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  
  const idParam = params?.id;
  const eventId = idParam ? parseInt(idParam as string, 10) : NaN;

  // TanStack Query - Fetch event details
  const { data: event, isLoading, error } = trpc.events.getById.useQuery(
    { id: eventId },
    { enabled: !isNaN(eventId) }
  );

  // TanStack Query utils for cache invalidation
  const utils = trpc.useUtils();

  // TanStack Mutation - Register for event
  const registerMutation = trpc.events.register.useMutation({
    onSuccess: () => {
      utils.events.getById.invalidate({ id: eventId });
      setShowTicketModal(false);
      alert(`Successfully registered for ${ticketQuantity} ticket(s)!`);
    },
    onError: (err) => {
      alert(`Registration failed: ${err.message}`);
    }
  });

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRegister = () => {
    // Using a placeholder userId=1 since auth is not implemented
    registerMutation.mutate({
      eventId,
      userId: 1,
      specialRequirements: ticketQuantity > 1 ? `Quantity: ${ticketQuantity}` : undefined
    });
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-muted/50 pt-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand" />
          <span className="ml-2 text-muted-foreground">Loading event details...</span>
        </div>
        <Footer />
      </>
    );
  }
  
  if (error || !event) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-muted/50 pt-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Event Not Found</h1>
            <p className="text-muted-foreground mb-4">{error?.message || 'The requested event could not be found.'}</p>
            <button
              onClick={() => router.push('/events')}
              className="text-brand hover:text-brand font-medium"
            >
              Back to Events
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const availableTickets = event.availableSpots;

  return (
    <>
      <Navbar />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <MenuButton onClick={() => setSidebarOpen(true)} />
      
      <div className="min-h-screen bg-muted/50 pt-16">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => router.push('/events')}
            className="flex items-center text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </button>

          {/* Event Header */}
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden mb-8">
            {event.imageUrl ? (
              <div className="h-96 bg-brand relative">
                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="h-96 bg-brand flex items-center justify-center">
                <ImageIcon className="w-24 h-24 text-background opacity-50" />
              </div>
            )}
            
            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-foreground mb-4">{event.title}</h1>
                  <p className="text-lg text-foreground/80 mb-6">{event.description}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  event.status === 'scheduled' ? 'bg-info/15 text-info' :
                  event.status === 'ongoing' ? 'bg-success/15 text-success' :
                  event.status === 'completed' ? 'bg-muted text-foreground' :
                  'bg-destructive/15 text-destructive'
                }`}>
                  {event.status}
                </span>
              </div>

              {/* Event Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-brand mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-semibold text-foreground">{formatDate(event.eventDate)}</p>
                    <p className="text-sm text-muted-foreground">{formatTime(event.eventDate)}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-brand mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold text-foreground">
                      {event.address 
                        ? `${event.address.street || ''}, ${event.address.city || ''}`.replace(/^, |, $/g, '') 
                        : 'TBD'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Users className="w-5 h-5 text-brand mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Capacity</p>
                    <p className="font-semibold text-foreground">{event.registrationsCount} / {event.capacity}</p>
                    <p className="text-sm text-muted-foreground">{availableTickets} spots left</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <DollarSign className="w-5 h-5 text-brand mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ticket Price</p>
                    <p className="font-semibold text-foreground">
                      {event.ticketPrice > 0 ? `${event.currency} ${event.ticketPrice.toFixed(2)}` : 'Free'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Registration Deadline */}
              {event.registrationDeadline && (
                <div className="flex items-center mb-6 p-4 bg-warning/15 rounded-lg">
                  <Clock className="w-5 h-5 text-warning mr-3" />
                  <div>
                    <p className="text-sm text-warning">Registration Deadline</p>
                    <p className="font-semibold text-warning">{formatDate(event.registrationDeadline)}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowTicketModal(true)}
                  disabled={availableTickets === 0}
                  className={`flex-1 py-3 px-6 rounded-lg font-bold transition-colors ${
                    availableTickets === 0
                      ? 'bg-muted-foreground/25 text-muted-foreground cursor-not-allowed'
                      : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                  }`}
                >
                  {availableTickets === 0 ? 'Sold Out' : 'Register for Event'}
                </button>
                <button className="px-6 py-3 border border-input rounded-lg hover:bg-accent font-medium">
                  Share Event
                </button>
              </div>
            </div>
          </div>

          {/* Photo Gallery Section */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-8 mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Event Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-brand rounded-lg flex items-center justify-center"
                >
                  <ImageIcon className="w-12 h-12 text-muted-foreground/70" />
                </div>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-card rounded-xl shadow-sm border border-border p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">About This Event</h2>
              <div className="prose max-w-none text-foreground/80">
                <p className="mb-4">{event.description}</p>
                <p className="mb-4">
                  Join us for an unforgettable experience that brings together our community
                  in support of a great cause. This event promises to be both impactful and
                  enjoyable for all attendees.
                </p>
                <h3 className="text-xl font-bold text-foreground mt-6 mb-3">What to Expect</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Engaging presentations and activities</li>
                  <li>Networking opportunities with like-minded individuals</li>
                  <li>Refreshments and entertainment</li>
                  <li>Opportunity to make a real difference</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Event Organizer</h3>
                <p className="text-foreground/80 mb-2">Wamumbi Foundation</p>
                <p className="text-sm text-muted-foreground">Bringing hope to orphaned children</p>
              </div>

              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Event Category</h3>
                <span className="px-3 py-1 bg-brand/10 text-brand rounded-full text-sm">
                  {event.category}
                </span>
              </div>

              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Important Information</h3>
                <ul className="space-y-3 text-sm text-foreground/80">
                  {event.registrationDeadline && (
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2 mt-1.5"></span>
                      <span>Registration deadline: {formatDate(event.registrationDeadline)}</span>
                    </li>
                  )}
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2 mt-1.5"></span>
                    <span>Please arrive 15 minutes early</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2 mt-1.5"></span>
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
          <div className="bg-card rounded-xl shadow-xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Register for Event</h2>
            
            <div className="mb-6">
              <p className="text-foreground/80 mb-2">{event.title}</p>
              <p className="text-sm text-muted-foreground">{formatDate(event.eventDate)} at {formatTime(event.eventDate)}</p>
            </div>

            <div className="mb-6">
              <label htmlFor="ticketQuantity" className="block text-sm font-medium text-foreground/80 mb-2">
                Number of Tickets
              </label>
              <select
                id="ticketQuantity"
                value={ticketQuantity}
                onChange={(e) => setTicketQuantity(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-input rounded-lg"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <div className="mb-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-foreground/80">Ticket Price:</span>
                <span className="font-semibold">${event.ticketPrice}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-foreground/80">Quantity:</span>
                <span className="font-semibold">{ticketQuantity}</span>
              </div>
              <div className="border-t border-input pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-bold text-foreground">Total:</span>
                  <span className="font-bold text-brand">
                    ${(event.ticketPrice * ticketQuantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleRegister}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Confirm Registration
              </button>
              <button
                onClick={() => setShowTicketModal(false)}
                className="flex-1 bg-muted hover:bg-accent text-foreground/80 font-bold py-3 px-6 rounded-lg transition-colors"
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