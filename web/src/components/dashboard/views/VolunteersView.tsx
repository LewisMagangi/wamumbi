import React, { useState } from 'react';
import { Plus, Users, Eye, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { mockVolunteers, mockVolunteerStatistics, getUserById } from '@/lib/mockData';

interface VolunteerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  availability: string;
  skills: string[];
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export const VolunteersView: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<number | null>(null);
  const [formData, setFormData] = useState<VolunteerFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    availability: '',
    skills: [],
    emergencyContactName: '',
    emergencyContactPhone: ''
  });

  const handleAddVolunteer = () => {
    console.log('Adding volunteer:', formData);
    alert('Volunteer added successfully!');
    setShowAddModal(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      availability: '',
      skills: [],
      emergencyContactName: '',
      emergencyContactPhone: ''
    });
  };

  const handleViewVolunteer = (volunteerId: number) => {
    setSelectedVolunteer(volunteerId);
    setShowViewModal(true);
  };

  const getVolunteerDetails = (volunteerId: number) => {
    const volunteer = mockVolunteers.find(v => v.id === volunteerId);
    if (!volunteer) return null;
    
    const user = getUserById(volunteer.user_id);
    const stats = mockVolunteerStatistics.find(s => s.volunteer_id === volunteerId);
    
    return { volunteer, user, stats };
  };

  const selectedDetails = selectedVolunteer ? getVolunteerDetails(selectedVolunteer) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Volunteer Management</h2>
          <p className="text-gray-600 mt-1">Manage volunteers and their activities</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Volunteer</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Volunteers</p>
          <p className="text-2xl font-bold text-gray-900">{mockVolunteers.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Active This Month</p>
          <p className="text-2xl font-bold text-green-600">{mockVolunteers.filter(v => v.status_id === 1).length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Hours</p>
          <p className="text-2xl font-bold text-purple-600">
            {mockVolunteerStatistics.reduce((sum, s) => sum + parseFloat(s.total_hours.toString()), 0).toFixed(1)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Avg Hours/Volunteer</p>
          <p className="text-2xl font-bold text-blue-600">
            {(mockVolunteerStatistics.reduce((sum, s) => sum + parseFloat(s.total_hours.toString()), 0) / mockVolunteers.length).toFixed(1)}
          </p>
        </div>
      </div>

      {/* Volunteers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-bold text-lg">All Volunteers</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours Logged</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activities</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockVolunteers.map((volunteer) => {
                const user = getUserById(volunteer.user_id);
                const stats = mockVolunteerStatistics.find(s => s.volunteer_id === volunteer.id);
                
                return (
                  <tr key={volunteer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user?.first_name} {user?.last_name}
                          </div>
                          <div className="text-sm text-gray-500">ID: {volunteer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user?.email}</div>
                      <div className="text-sm text-gray-500">{user?.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-purple-600">
                        {stats?.total_hours?.toString() ?? '0'} hrs
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{stats?.activities_count ?? 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewVolunteer(volunteer.id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-800" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Volunteer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Volunteer</h2>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleAddVolunteer(); }}>
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      title="First Name"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      title="Last Name"
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      title="Email address"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      title="Phone number"
                      placeholder="e.g., +1234567890"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
                  Availability *
                </label>
                <textarea
                  id="availability"
                  title="Availability"
                  value={formData.availability}
                  onChange={(e) => setFormData({...formData, availability: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Weekends, weekday evenings..."
                  required
                />
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      id="emergencyContactName"
                      type="text"
                      title="Emergency contact name"
                      placeholder="Full name"
                      value={formData.emergencyContactName}
                      onChange={(e) => setFormData({...formData, emergencyContactName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      id="emergencyContactPhone"
                      type="tel"
                      title="Emergency contact phone"
                      placeholder="e.g., +1234567890"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => setFormData({...formData, emergencyContactPhone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg"
                >
                  Add Volunteer
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Volunteer Modal */}
      {showViewModal && selectedDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Volunteer Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Profile Header */}
            <div className="flex items-center mb-8 pb-6 border-b border-gray-200">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mr-6">
                <Users className="w-10 h-10 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedDetails.user?.first_name} {selectedDetails.user?.last_name}
                </h3>
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {selectedDetails.user?.email}
                  </span>
                  <span className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {selectedDetails.user?.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold text-purple-600">
                  {selectedDetails.stats?.total_hours?.toString() ?? '0'}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">Activities</p>
                <p className="text-2xl font-bold text-blue-600">
                  {selectedDetails.stats?.activities_count ?? 0}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">Projects</p>
                <p className="text-2xl font-bold text-green-600">
                  {selectedDetails.stats?.projects_count ?? 0}
                </p>
              </div>
              <div className="bg-rose-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">Events</p>
                <p className="text-2xl font-bold text-rose-600">
                  {selectedDetails.stats?.events_count ?? 0}
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Availability</h4>
                <p className="text-gray-900">{selectedDetails.volunteer.availability || 'Not specified'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Joined Date</h4>
                <p className="text-gray-900">
                  {new Date(selectedDetails.volunteer.joined_date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowViewModal(false)}
              className="w-full mt-8 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  ); 
};
