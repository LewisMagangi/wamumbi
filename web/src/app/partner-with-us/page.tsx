'use client';
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/footer';
import Sidebar from '@/components/dashboard/Sidebar';
import MenuButton from '@/components/dashboard/MenuButton';
import { Building2, Mail, Phone, Users } from 'lucide-react';

export default function PartnerWithUsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: '',
    contactPerson: '',
    email: '',
    phone: '',
    organizationType: '',
    partnershipInterest: '',
    message: '',
    website: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Partnership inquiry submitted:', formData);
    alert('Thank you for your interest in partnering with us! We will contact you soon to discuss opportunities.');
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Partner With Us</h1>
            <p className="text-xl text-gray-600">
              Join us in creating lasting change for orphaned children
            </p>
          </div>

          {/* Partnership Benefits */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Partner With Wamumbi?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="bg-rose-100 rounded-lg p-3 mr-4">
                  <Users className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Community Impact</h3>
                  <p className="text-gray-600">Make a direct impact on the lives of orphaned children</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-rose-100 rounded-lg p-3 mr-4">
                  <Building2 className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Brand Visibility</h3>
                  <p className="text-gray-600">Showcase your commitment to social responsibility</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-rose-100 rounded-lg p-3 mr-4">
                  <Mail className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Collaborative Projects</h3>
                  <p className="text-gray-600">Work together on meaningful initiatives</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-rose-100 rounded-lg p-3 mr-4">
                  <Phone className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Ongoing Support</h3>
                  <p className="text-gray-600">Dedicated partnership management and reporting</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Organization Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Building2 className="w-6 h-6 mr-2 text-rose-600" />
                  Organization Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      name="organizationName"
                      required
                      value={formData.organizationName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="ABC Corporation"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization Type *
                      </label>
                      <select
                        name="organizationType"
                        required
                        value={formData.organizationType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        aria-label="Select organization type"
                      >
                        <option value="">Select type...</option>
                        <option value="corporate">Corporate</option>
                        <option value="foundation">Foundation</option>
                        <option value="nonprofit">Non-Profit</option>
                        <option value="government">Government Agency</option>
                        <option value="religious">Religious Organization</option>
                        <option value="educational">Educational Institution</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Person */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Users className="w-6 h-6 mr-2 text-rose-600" />
                  Contact Person
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      required
                      value={formData.contactPerson}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
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

              {/* Partnership Interest */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Mail className="w-6 h-6 mr-2 text-rose-600" />
                  Partnership Interest
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type of Partnership *
                    </label>
                    <select
                      name="partnershipInterest"
                      required
                      value={formData.partnershipInterest}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      aria-label="Select type of partnership"
                    >
                      <option value="">Select partnership type...</option>
                      <option value="financial">Financial Sponsorship</option>
                      <option value="inkind">In-Kind Donations</option>
                      <option value="volunteer">Corporate Volunteering</option>
                      <option value="event">Event Collaboration</option>
                      <option value="advocacy">Advocacy Partnership</option>
                      <option value="skills">Skills-Based Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tell us about your partnership goals *
                    </label>
                    <textarea
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="Share your ideas, goals, and how you envision partnering with us..."
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
                  Submit Partnership Inquiry
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
