'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Users, Eye, Edit, Trash2, Mail, Phone, Loader2 } from 'lucide-react';
import { trpc } from '@/app/_trpc/client';

interface VolunteerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  availability: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactEmail: string;
  emergencyContactRelationship: string;
}

interface Volunteer {
  id: number;
  userId: number;
  name: string;
  email: string;
  phone: string | null;
  profileImage: string | null;
  availability: string | null;
  skills: string[];
  status: string;
  totalHours: number | unknown;
  activitiesCount: number;
  joinedAt: string; // Date comes back as string from API
}

interface VolunteerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  availability: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactEmail: string;
  emergencyContactRelationship: string;
}

export const VolunteersView: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVolunteerId, setSelectedVolunteerId] = useState<number | null>(null);
  const [editingVolunteer, setEditingVolunteer] = useState<Volunteer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<VolunteerFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    availability: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactEmail: '',
    emergencyContactRelationship: 'Family'
  });

  // TanStack Query - Fetch all volunteers
  const { data: volunteers, isLoading, error: fetchError } = trpc.volunteers.getAll.useQuery();
  
  // TanStack Query - Fetch single volunteer details
  const { data: volunteerDetails, isLoading: isLoadingDetails } = trpc.volunteers.getById.useQuery(
    { id: selectedVolunteerId! },
    { enabled: !!selectedVolunteerId && showViewModal }
  );

  // TanStack Query utils for cache invalidation
  const utils = trpc.useUtils();
  const deleteVolunteerMutation = trpc.volunteers.delete.useMutation({
    onSuccess: () => {
      utils.volunteers.getAll.invalidate();
      setError(null);
    },
    onError: (err) => {
      setError(err.message);
    }
  });

  // TanStack Mutation - Update volunteer
  const updateVolunteerMutation = trpc.volunteers.update.useMutation({
    onSuccess: () => {
      utils.volunteers.getAll.invalidate();
      setShowEditModal(false);
      setEditingVolunteer(null);
      setError(null);
    },
    onError: (err) => {
      setError(err.message);
    }
  });

  // TanStack Mutation - Create volunteer with user
  const createVolunteerMutation = trpc.volunteers.createWithUser.useMutation({
    onSuccess: () => {
      utils.volunteers.getAll.invalidate();
      setShowAddModal(false);
      resetForm();
      setError(null);
    },
    onError: (err) => {
      setError(err.message);
    }
  });

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      availability: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactEmail: '',
      emergencyContactRelationship: 'Family'
    });
  };

  const handleAddVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('First name, last name, and email are required');
      return;
    }

    createVolunteerMutation.mutate({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone || undefined,
      availability: formData.availability || undefined,
      emergencyContactName: formData.emergencyContactName || undefined,
      emergencyContactPhone: formData.emergencyContactPhone || undefined,
      emergencyContactEmail: formData.emergencyContactEmail || undefined,
      emergencyContactRelationship: formData.emergencyContactRelationship || undefined
    });
  };

  const handleViewVolunteer = (volunteerId: number) => {
    setSelectedVolunteerId(volunteerId);
    setShowViewModal(true);
  };

  const handleDeleteVolunteer = async (volunteerId: number, volunteerName: string) => {
    if (window.confirm(`Are you sure you want to delete ${volunteerName}? This action cannot be undone.`)) {
      setError(null);
      deleteVolunteerMutation.mutate({ id: volunteerId });
    }
  };

  const handleEditVolunteer = (volunteer: Volunteer) => {
    setEditingVolunteer(volunteer);
    setShowEditModal(true);
  };

  // Calculate stats from data
  const totalVolunteers = volunteers?.length || 0;
  const activeVolunteers = volunteers?.filter(v => v.status === 'active').length || 0;
  const totalHours = volunteers?.reduce((sum, v) => sum + (Number(v.totalHours) || 0), 0) || 0;
  const avgHours = totalVolunteers > 0 ? (totalHours / totalVolunteers).toFixed(1) : '0';

  if (fetchError) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading volunteers: {fetchError.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Volunteer Management</h2>
          <p className="text-muted-foreground mt-1">Manage volunteers and their activities</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          <span>Add Volunteer</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground">Total Volunteers</p>
          <p className="text-2xl font-bold text-foreground">
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : totalVolunteers}
          </p>
        </div>
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground">Active Volunteers</p>
          <p className="text-2xl font-bold text-success">
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : activeVolunteers}
          </p>
        </div>
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground">Total Hours</p>
          <p className="text-2xl font-bold text-chart-4">
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : totalHours.toFixed(1)}
          </p>
        </div>
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <p className="text-sm text-muted-foreground">Avg Hours/Volunteer</p>
          <p className="text-2xl font-bold text-info">
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : avgHours}
          </p>
        </div>
      </div>

      {/* Volunteers Table */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-bold text-lg">All Volunteers</h3>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-chart-4" />
              <span className="ml-2 text-muted-foreground">Loading volunteers...</span>
            </div>
          ) : volunteers && volunteers.length > 0 ? (
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Hours Logged</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Activities</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {volunteers.map((volunteer) => (
                  <tr key={volunteer.id} className="hover:bg-accent">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-chart-4/15 rounded-full flex items-center justify-center mr-3 overflow-hidden">
                          {volunteer.profileImage ? (
                            <Image src={volunteer.profileImage} alt={`${volunteer.name} profile`} width={40} height={40} className="rounded-full object-cover" />
                          ) : (
                            <Users className="w-5 h-5 text-chart-4" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">{volunteer.name}</div>
                          <div className="text-sm text-muted-foreground">ID: {volunteer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-foreground">{volunteer.email}</div>
                      <div className="text-sm text-muted-foreground">{volunteer.phone || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-chart-4">
                        {Number(volunteer.totalHours).toFixed(1)} hrs
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-foreground">{volunteer.activitiesCount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        volunteer.status === 'active' 
                          ? 'bg-success/15 text-success' 
                          : 'bg-muted text-foreground/80'
                      }`}>
                        {volunteer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewVolunteer(volunteer.id)}
                          className="text-info hover:text-info"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditVolunteer(volunteer)}
                          className="text-success hover:text-success" 
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteVolunteer(volunteer.id, volunteer.name)}
                          disabled={deleteVolunteerMutation.isPending}
                          className="text-destructive hover:text-destructive disabled:text-destructive" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground/70 mx-auto mb-4" />
              <p className="text-muted-foreground">No volunteers found</p>
              <p className="text-sm text-muted-foreground mt-1">Add your first volunteer to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Volunteer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Add New Volunteer</h2>

            {error && (
              <div className="mb-4 p-4 bg-warning/15 border border-warning/40 rounded-lg">
                <p className="text-warning">{error}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleAddVolunteer}>
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-foreground/80 mb-2">
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-foreground/80 mb-2">
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-2">
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground/80 mb-2">
                      Phone *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="e.g., +1234567890"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-foreground/80 mb-2">
                  Availability *
                </label>
                <textarea
                  id="availability"
                  value={formData.availability}
                  onChange={(e) => setFormData({...formData, availability: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                  placeholder="e.g., Weekends, weekday evenings..."
                  required
                />
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="emergencyContactName" className="block text-sm font-medium text-foreground/80 mb-2">
                      Name *
                    </label>
                    <input
                      id="emergencyContactName"
                      type="text"
                      placeholder="Full name"
                      value={formData.emergencyContactName}
                      onChange={(e) => setFormData({...formData, emergencyContactName: e.target.value})}
                      className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-foreground/80 mb-2">
                      Phone *
                    </label>
                    <input
                      id="emergencyContactPhone"
                      type="tel"
                      placeholder="e.g., +1234567890"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => setFormData({...formData, emergencyContactPhone: e.target.value})}
                      className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="emergencyContactEmail" className="block text-sm font-medium text-foreground/80 mb-2">
                      Email
                    </label>
                    <input
                      id="emergencyContactEmail"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.emergencyContactEmail}
                      onChange={(e) => setFormData({...formData, emergencyContactEmail: e.target.value})}
                      className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label htmlFor="emergencyContactRelationship" className="block text-sm font-medium text-foreground/80 mb-2">
                      Relationship *
                    </label>
                    <select
                      id="emergencyContactRelationship"
                      value={formData.emergencyContactRelationship}
                      onChange={(e) => setFormData({...formData, emergencyContactRelationship: e.target.value})}
                      className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                      required
                    >
                      <option value="Family">Family</option>
                      <option value="Friend">Friend</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  disabled={createVolunteerMutation.isPending}
                  className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-bold py-3 px-6 rounded-lg flex items-center justify-center"
                >
                  {createVolunteerMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Adding...
                    </>
                  ) : (
                    'Add Volunteer'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setError(null);
                    resetForm();
                  }}
                  className="flex-1 bg-muted hover:bg-accent text-foreground/80 font-bold py-3 px-6 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Volunteer Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-foreground">Volunteer Details</h2>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedVolunteerId(null);
                }}
                className="text-muted-foreground/70 hover:text-foreground"
              >
                ✕
              </button>
            </div>

            {isLoadingDetails ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-chart-4" />
                <span className="ml-2 text-muted-foreground">Loading details...</span>
              </div>
            ) : volunteerDetails ? (
              <>
                {/* Profile Header */}
                <div className="flex items-center mb-8 pb-6 border-b border-border">
                  <div className="w-20 h-20 bg-chart-4/15 rounded-full flex items-center justify-center mr-6 overflow-hidden">
                    {volunteerDetails.profileImage ? (
                      <Image src={volunteerDetails.profileImage} alt={`${volunteerDetails.name} profile`} width={80} height={80} className="rounded-full object-cover" />
                    ) : (
                      <Users className="w-10 h-10 text-chart-4" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{volunteerDetails.name}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center text-muted-foreground">
                        <Mail className="w-4 h-4 mr-2" />
                        {volunteerDetails.email}
                      </span>
                      {volunteerDetails.phone && (
                        <span className="flex items-center text-muted-foreground">
                          <Phone className="w-4 h-4 mr-2" />
                          {volunteerDetails.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                  <div className="bg-chart-4/15 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">Total Hours</p>
                    <p className="text-2xl font-bold text-chart-4">
                      {volunteerDetails.statistics?.total_hours?.toString() ?? '0'}
                    </p>
                  </div>
                  <div className="bg-info/15 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">Activities</p>
                    <p className="text-2xl font-bold text-info">
                      {volunteerDetails.statistics?.activities_count ?? 0}
                    </p>
                  </div>
                  <div className="bg-success/15 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">Projects</p>
                    <p className="text-2xl font-bold text-success">
                      {volunteerDetails.statistics?.projects_count ?? 0}
                    </p>
                  </div>
                  <div className="bg-brand/10 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">Events</p>
                    <p className="text-2xl font-bold text-brand">
                      {volunteerDetails.statistics?.events_count ?? 0}
                    </p>
                  </div>
                </div>

                {/* Skills */}
                {volunteerDetails.skills && volunteerDetails.skills.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-foreground/80 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {volunteerDetails.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-chart-4/15 text-chart-4 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-foreground/80 mb-2">Availability</h4>
                    <p className="text-foreground">{volunteerDetails.availability || 'Not specified'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground/80 mb-2">Status</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      volunteerDetails.status === 'active' 
                        ? 'bg-success/15 text-success' 
                        : 'bg-muted text-foreground/80'
                    }`}>
                      {volunteerDetails.status}
                    </span>
                  </div>
                  {volunteerDetails.emergencyContact && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground/80 mb-2">Emergency Contact</h4>
                      <p className="text-foreground">
                        {volunteerDetails.emergencyContact.name} ({volunteerDetails.emergencyContact.relationship})
                      </p>
                      <p className="text-sm text-muted-foreground">{volunteerDetails.emergencyContact.phone}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-medium text-foreground/80 mb-2">Joined Date</h4>
                    <p className="text-foreground">
                      {new Date(volunteerDetails.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Recent Activities */}
                {volunteerDetails.recentActivities && volunteerDetails.recentActivities.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-foreground/80 mb-3">Recent Activities</h4>
                    <div className="space-y-2">
                      {volunteerDetails.recentActivities.slice(0, 5).map((activity) => (
                        <div key={activity.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-foreground">{activity.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {activity.projectTitle || activity.eventTitle || activity.activityType}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-chart-4">{activity.hoursLogged} hrs</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(activity.activityDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-muted-foreground">Volunteer not found</p>
            )}

            <button
              onClick={() => {
                setShowViewModal(false);
                setSelectedVolunteerId(null);
              }}
              className="w-full mt-8 bg-muted hover:bg-accent text-foreground/80 font-bold py-3 px-6 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Volunteer Modal */}
      {showEditModal && editingVolunteer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Edit Volunteer</h2>

            {error && (
              <div className="mb-4 p-4 bg-warning/15 border border-warning/40 rounded-lg">
                <p className="text-warning">{error}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={(e) => {
              e.preventDefault();
              const availability = (e.target as HTMLFormElement).availability.value || undefined;
              const statusValue = (e.target as HTMLFormElement).status.value;
              
              updateVolunteerMutation.mutate({
                id: editingVolunteer.id,
                availability: availability,
                statusId: statusValue ? parseInt(statusValue) : undefined
              });
            }}>
              {/* Volunteer Info Display */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-foreground mb-2">{editingVolunteer.name}</h3>
                <p className="text-muted-foreground">{editingVolunteer.email}</p>
                <p className="text-muted-foreground">{editingVolunteer.phone || 'No phone'}</p>
              </div>

              {/* Availability */}
              <div>
                <label htmlFor="edit-availability" className="block text-sm font-medium text-foreground/80 mb-2">
                  Availability
                </label>
                <textarea
                  id="edit-availability"
                  name="availability"
                  defaultValue={editingVolunteer.availability || ''}
                  rows={3}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                  placeholder="e.g., Weekends, weekday evenings..."
                />
              </div>

              {/* Status */}
              <div>
                <label htmlFor="edit-status" className="block text-sm font-medium text-foreground/80 mb-2">
                  Status
                </label>
                <select
                  id="edit-status"
                  name="status"
                  defaultValue={editingVolunteer.status === 'active' ? '1' : '2'}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                >
                  <option value="1">Active</option>
                  <option value="2">Inactive</option>
                </select>
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  disabled={updateVolunteerMutation.isPending}
                  className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-bold py-3 px-6 rounded-lg flex items-center justify-center"
                >
                  {updateVolunteerMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    'Update Volunteer'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingVolunteer(null);
                    setError(null);
                  }}
                  className="flex-1 bg-muted hover:bg-accent text-foreground/80 font-bold py-3 px-6 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  ); 
};
