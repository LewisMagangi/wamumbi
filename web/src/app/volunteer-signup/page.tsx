'use client';
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/footer';
import Sidebar from '@/components/dashboard/Sidebar';
import MenuButton from '@/components/dashboard/MenuButton';
import { Calendar, Phone, Mail, User, MapPin } from 'lucide-react';

export default function VolunteerSignupPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    availability: '',
    skills: '',
    experience: '',
    motivation: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Volunteer application submitted:', formData);
    alert('Thank you for your interest! We will review your application and contact you soon.');
    // Here you would send data to your API
  };

  return (
    <>
      <Navbar />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <MenuButton onClick={() => setSidebarOpen(true)} />
      <div className="min-h-screen bg-gray-50 pt-16">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Become a Volunteer</h1>
            <p className="text-xl text-gray-600">
              Join our team and make a difference in the lives of orphaned children
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <User className="w-6 h-6 mr-2 text-rose-600" />
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Mail className="w-6 h-6 mr-2 text-rose-600" />
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="+254 123 456 789"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-6 h-6 mr-2 text-rose-600" />
                  Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        placeholder="Nairobi"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State/County
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        placeholder="Nairobi"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        placeholder="00100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Availability & Skills */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-6 h-6 mr-2 text-rose-600" />
                  Availability & Skills
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability *
                    </label>
                    <textarea
                      name="availability"
                      required
                      value={formData.availability}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="e.g., Weekends, weekday evenings, specific days..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills & Expertise *
                    </label>
                    <textarea
                      name="skills"
                      required
                      value={formData.skills}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="e.g., Teaching, healthcare, fundraising, event planning..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relevant Experience
                    </label>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="Tell us about your relevant volunteer or professional experience..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Why do you want to volunteer with us? *
                    </label>
                    <textarea
                      name="motivation"
                      required
                      value={formData.motivation}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="Share your motivation..."
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Phone className="w-6 h-6 mr-2 text-rose-600" />
                  Emergency Contact
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="emergencyContactName"
                      required
                      value={formData.emergencyContactName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="emergencyContactPhone"
                      required
                      value={formData.emergencyContactPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="+254 987 654 321"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relationship *
                    </label>
                    <input
                      type="text"
                      name="emergencyContactRelationship"
                      required
                      value={formData.emergencyContactRelationship}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="Spouse, Parent, Sibling..."
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                >
                  Submit Application
                </button>
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
