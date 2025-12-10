'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Loader2, X, MapPin, Users, DollarSign, Clock, Eye, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/app/_trpc/client';

interface EventFormData {
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  capacity: number;
  ticketPrice: number;
  currencyId: number;
  categoryId: number;
  imageUrl: string;
  registrationDeadline: string;
  location: string;
}

export const EventsView: React.FC = () => {
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    eventDate: '',
    eventTime: '09:00',
    capacity: 50,
    ticketPrice: 0,
    currencyId: 1,
    categoryId: 1,
    imageUrl: '',
    registrationDeadline: '',
    location: ''
  });

  // TanStack Query - Fetch all events
  const { data: events, isLoading, error: fetchError } = trpc.events.getAll.useQuery();

  // TanStack Query - Fetch event details
  const { data: eventDetails, isLoading: isLoadingDetails } = trpc.events.getById.useQuery(
    { id: selectedEventId! },
    { enabled: !!selectedEventId && (showDetailModal || showEditModal) }
  );

  // TanStack Query - Fetch categories for event creation
  const { data: categories } = trpc.events.getCategories.useQuery();

  // TanStack Query utils for cache invalidation
  const utils = trpc.useUtils();

  // TanStack Mutation - Create event
  const createEventMutation = trpc.events.create.useMutation({
    onSuccess: () => {
      utils.events.getAll.invalidate();
      setShowAddModal(false);
      resetForm();
      setError(null);
    },
    onError: (err) => {
      setError(err.message);
    }
  });

  // TanStack Mutation - Update event
  const updateEventMutation = trpc.events.update.useMutation({
    onSuccess: () => {
      utils.events.getAll.invalidate();
      utils.events.getById.invalidate({ id: selectedEventId! });
      setShowEditModal(false);
      resetForm();
      setError(null);
    },
    onError: (err) => {
      setError(err.message);
    }
  });

  // Populate form when editing
  useEffect(() => {
    if (showEditModal && eventDetails) {
      const eventDate = new Date(eventDetails.eventDate);
      setFormData({
        title: eventDetails.title,
        description: eventDetails.description,
        eventDate: eventDate.toISOString().split('T')[0],
        eventTime: eventDate.toTimeString().slice(0, 5),
        capacity: eventDetails.capacity,
        ticketPrice: eventDetails.ticketPrice,
        currencyId: eventDetails.currencyId || 1,
        categoryId: eventDetails.categoryId || 1,
        imageUrl: eventDetails.imageUrl || '',
        registrationDeadline: eventDetails.registrationDeadline 
          ? new Date(eventDetails.registrationDeadline).toISOString().split('T')[0] 
          : '',
        location: ''
      });
    }
  }, [showEditModal, eventDetails]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      eventDate: '',
      eventTime: '09:00',
      capacity: 50,
      ticketPrice: 0,
      currencyId: 1,
      categoryId: 1,
      imageUrl: '',
      registrationDeadline: '',
      location: ''
    });
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Combine date and time
    const eventDateTime = new Date(`${formData.eventDate}T${formData.eventTime}`);
    const registrationDeadline = formData.registrationDeadline 
      ? new Date(formData.registrationDeadline) 
      : undefined;

    createEventMutation.mutate({
      title: formData.title,
      description: formData.description,
      eventDate: eventDateTime,
      capacity: formData.capacity,
      ticketPrice: formData.ticketPrice,
      currencyId: formData.currencyId,
      categoryId: formData.categoryId,
      imageUrl: formData.imageUrl || undefined,
      registrationDeadline
    });
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedEventId) return;

    // Combine date and time
    const eventDateTime = new Date(`${formData.eventDate}T${formData.eventTime}`);
    const registrationDeadline = formData.registrationDeadline 
      ? new Date(formData.registrationDeadline) 
      : undefined;

    updateEventMutation.mutate({
      id: selectedEventId,
      title: formData.title,
      description: formData.description,
      eventDate: eventDateTime,
      capacity: formData.capacity,
      ticketPrice: formData.ticketPrice,
      categoryId: formData.categoryId,
      imageUrl: formData.imageUrl || undefined,
      registrationDeadline
    });
  };

  const handleEditEvent = (eventId: number) => {
    setSelectedEventId(eventId);
    setShowDetailModal(false);
    setShowEditModal(true);
  };

  const handleViewDetails = (eventId: number) => {
    setSelectedEventId(eventId);
    setShowDetailModal(true);
  };

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

  if (fetchError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading events: {fetchError.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
          <p className="text-gray-600 mt-1">Plan and manage charity events</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-rose-400 text-white px-4 py-2 rounded-lg hover:bg-rose-500 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Event</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
          <span className="ml-2 text-gray-600">Loading events...</span>
        </div>
      ) : events && events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => {
            const percentage = Math.round((event.registrationsCount / event.capacity) * 100);

            return (
              <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-rose-600" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    event.status === 'scheduled'
                      ? 'bg-blue-100 text-blue-800'
                      : event.status === 'ongoing'
                      ? 'bg-green-100 text-green-800'
                      : event.status === 'completed'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {event.status}
                  </span>
                </div>

                <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium">{formatDate(event.eventDate)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Time</span>
                    <span className="font-medium">{formatTime(event.eventDate)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium">{event.location || 'TBD'}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Capacity</span>
                    <span className="font-medium">
                      {event.registrationsCount} / {event.capacity}
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Registration</span>
                      <span className="font-medium">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-rose-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                        role="progressbar"
                        aria-valuenow={percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Registration progress: ${percentage}%`}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleViewDetails(event.id)}
                  className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No events found</p>
          <p className="text-sm text-gray-500 mt-1">Create your first event to get started</p>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Add New Event</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setError(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
                title="Close modal"
                aria-label="Close add event modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              <form onSubmit={handleCreateEvent} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                    placeholder="Describe your event..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                      title="Event date"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Time *
                    </label>
                    <input
                      type="time"
                      value={formData.eventTime}
                      onChange={(e) => setFormData({...formData, eventTime: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                      title="Event time"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacity *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.capacity}
                      onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 1})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                      title="Event capacity"
                      placeholder="50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ticket Price
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.ticketPrice}
                      onChange={(e) => setFormData({...formData, ticketPrice: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                      placeholder="0 for free event"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                    title="Event category"
                    required
                  >
                    {categories?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    )) || (
                      <>
                        <option value={1}>Fundraising</option>
                        <option value={2}>Community</option>
                        <option value={3}>Awareness</option>
                        <option value={4}>Volunteer</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.registrationDeadline}
                    onChange={(e) => setFormData({...formData, registrationDeadline: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                    title="Registration deadline date"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                    title="Event image URL"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={createEventMutation.isPending}
                    className="flex-1 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center"
                  >
                    {createEventMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      'Create Event'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setError(null);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Event Details</h2>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedEventId(null);
                }}
                className="text-gray-400 hover:text-gray-600"
                title="Close modal"
                aria-label="Close event details modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {isLoadingDetails ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
                  <span className="ml-2 text-gray-600">Loading event details...</span>
                </div>
              ) : eventDetails ? (
                <>
                  {/* Event Header */}
                  <div className="mb-6">
                    {eventDetails.imageUrl && (
                      <div className="h-48 bg-gradient-to-r from-rose-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
                        <Calendar className="w-16 h-16 text-white opacity-50" />
                      </div>
                    )}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{eventDetails.title}</h3>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                          eventDetails.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-800'
                            : eventDetails.status === 'ongoing'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {eventDetails.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                    <p className="text-gray-600">{eventDetails.description}</p>
                  </div>

                  {/* Event Details Grid */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="flex items-start">
                      <Calendar className="w-5 h-5 text-rose-600 mr-3 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Date & Time</p>
                        <p className="font-semibold text-gray-900">{formatDate(eventDetails.eventDate)}</p>
                        <p className="text-sm text-gray-600">{formatTime(eventDetails.eventDate)}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-rose-600 mr-3 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-semibold text-gray-900">
                          {eventDetails.address 
                            ? `${eventDetails.address.street || ''} ${eventDetails.address.city || ''} ${eventDetails.address.country || ''}`.trim() || 'TBD'
                            : 'TBD'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Users className="w-5 h-5 text-rose-600 mr-3 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Capacity</p>
                        <p className="font-semibold text-gray-900">
                          {eventDetails.registrationsCount} / {eventDetails.capacity} registered
                        </p>
                        <p className="text-sm text-green-600">
                          {eventDetails.availableSpots} spots available
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <DollarSign className="w-5 h-5 text-rose-600 mr-3 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Ticket Price</p>
                        <p className="font-semibold text-gray-900">
                          {eventDetails.ticketPrice > 0 
                            ? `${eventDetails.currency} ${eventDetails.ticketPrice.toFixed(2)}` 
                            : 'Free'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Registration Deadline */}
                  {eventDetails.registrationDeadline && (
                    <div className="flex items-start mb-6">
                      <Clock className="w-5 h-5 text-rose-600 mr-3 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Registration Deadline</p>
                        <p className="font-semibold text-gray-900">
                          {formatDate(eventDetails.registrationDeadline)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Category */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Category</h4>
                    <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm">
                      {eventDetails.category}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleEditEvent(eventDetails.id)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Event
                    </button>
                    <button
                      onClick={() => router.push(`/events/${eventDetails.id}`)}
                      className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-lg"
                    >
                      View Full Details
                    </button>
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        setSelectedEventId(null);
                      }}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg"
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-600">Event not found</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Edit Event</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedEventId(null);
                  setError(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
                title="Close modal"
                aria-label="Close edit event modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {isLoadingDetails ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
                  <span className="ml-2 text-gray-600">Loading event...</span>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleUpdateEvent} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        placeholder="Enter event title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        placeholder="Describe the event"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Event Date *
                        </label>
                        <input
                          type="date"
                          value={formData.eventDate}
                          onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Event Time *
                        </label>
                        <input
                          type="time"
                          value={formData.eventTime}
                          onChange={(e) => setFormData({...formData, eventTime: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Capacity *
                        </label>
                        <input
                          type="number"
                          value={formData.capacity}
                          onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 0})}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          min="1"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ticket Price
                        </label>
                        <input
                          type="number"
                          value={formData.ticketPrice}
                          onChange={(e) => setFormData({...formData, ticketPrice: parseFloat(e.target.value) || 0})}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.categoryId}
                        onChange={(e) => setFormData({...formData, categoryId: parseInt(e.target.value)})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      >
                        {categories?.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Registration Deadline
                      </label>
                      <input
                        type="date"
                        value={formData.registrationDeadline}
                        onChange={(e) => setFormData({...formData, registrationDeadline: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={updateEventMutation.isPending}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {updateEventMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Updating...
                          </>
                        ) : (
                          'Update Event'
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditModal(false);
                          setSelectedEventId(null);
                          setError(null);
                          resetForm();
                        }}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
