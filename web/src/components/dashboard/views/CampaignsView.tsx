'use client';

import React, { useState } from 'react';
import { Plus, FileText, X, Loader2, Eye, AlertCircle } from 'lucide-react';
import { trpc } from '@/app/_trpc/client';

export const CampaignsView: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);

  const utils = trpc.useUtils();
  
  const { data: campaigns = [], isLoading, error } = trpc.campaigns.getAll.useQuery();
  const { data: categories = [] } = trpc.campaigns.getCategories.useQuery();
  const { data: urgencyLevels = [] } = trpc.campaigns.getUrgencyLevels.useQuery();
  const { data: currencies = [] } = trpc.donations.getCurrencies.useQuery();
  const { data: selectedCampaign, isLoading: isLoadingDetail, error: detailError } = trpc.campaigns.getById.useQuery(
    { id: selectedCampaignId! },
    { enabled: selectedCampaignId !== null }
  );

  // Create campaign mutation
  const createCampaign = trpc.campaigns.create.useMutation({
    onSuccess: () => {
      utils.campaigns.getAll.invalidate();
      setShowCreateModal(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Failed to create campaign:', error);
      alert('Failed to create campaign: ' + error.message);
    }
  });

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goalAmount: '',
    categoryId: '',
    urgencyLevelId: '',
    currencyId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    imageUrl: '',
    targetBeneficiaries: ''
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      goalAmount: '',
      categoryId: '',
      urgencyLevelId: '',
      currencyId: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      imageUrl: '',
      targetBeneficiaries: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.goalAmount || 
        !formData.categoryId || !formData.urgencyLevelId || !formData.currencyId) {
      alert('Please fill in all required fields');
      return;
    }

    createCampaign.mutate({
      title: formData.title,
      description: formData.description,
      goalAmount: parseFloat(formData.goalAmount),
      categoryId: parseInt(formData.categoryId),
      urgencyLevelId: parseInt(formData.urgencyLevelId),
      currencyId: parseInt(formData.currencyId),
      startDate: new Date(formData.startDate),
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      imageUrl: formData.imageUrl || undefined,
      targetBeneficiaries: formData.targetBeneficiaries ? parseInt(formData.targetBeneficiaries) : undefined
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleViewDetails = (campaignId: number) => {
    setSelectedCampaignId(campaignId);
    setShowDetailModal(true);
  };

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesFilter = filter === 'all' || campaign.status.toLowerCase() === filter;
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
        <span className="ml-2 text-gray-600">Loading campaigns...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12 text-red-500">
        <AlertCircle className="w-6 h-6 mr-2" />
        <span>Error loading campaigns: {error.message}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Campaign Management</h2>
          <p className="text-gray-600 mt-1">Create and manage your fundraising campaigns</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Search campaigns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
          title="Filter campaigns"
          aria-label="Filter campaigns by status"
        >
          <option value="all">All Campaigns</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No campaigns found</p>
          </div>
        ) : (
          filteredCampaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  campaign.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : campaign.status === 'completed'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleViewDetails(campaign.id)}
                    className="text-gray-400 hover:text-blue-600"
                    title="View campaign details"
                    aria-label="View campaign details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">{campaign.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{campaign.progressPercentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-rose-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(campaign.progressPercentage, 100)}%` }}
                    role="progressbar"
                    aria-valuenow={campaign.progressPercentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Campaign progress: ${campaign.progressPercentage.toFixed(0)}%`}
                  />
                </div>
                <div className="flex justify-between text-sm pt-2">
                  <span className="text-gray-600">Raised:</span>
                  <span className="font-bold text-rose-600">{formatAmount(campaign.currentAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Goal:</span>
                  <span className="font-medium">{formatAmount(campaign.goalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Donations:</span>
                  <span className="font-medium">{campaign.donationsCount}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">Create New Campaign</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
                title="Close modal"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  placeholder="Enter campaign title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 min-h-[100px]"
                  placeholder="Describe your campaign goals and purpose"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Goal Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.goalAmount}
                    onChange={(e) => setFormData({ ...formData, goalAmount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                    placeholder="10000"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.currencyId}
                    onChange={(e) => setFormData({ ...formData, currencyId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                    title="Select currency"
                    required
                  >
                    <option value="">Select currency</option>
                    {currencies.map((currency) => (
                      <option key={currency.id} value={currency.id}>
                        {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                    title="Select category"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Urgency Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.urgencyLevelId}
                    onChange={(e) => setFormData({ ...formData, urgencyLevelId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                    title="Select urgency level"
                    required
                  >
                    <option value="">Select urgency</option>
                    {urgencyLevels.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                    title="Campaign start date"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                    title="Campaign end date"
                    min={formData.startDate}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Beneficiaries
                </label>
                <input
                  type="number"
                  value={formData.targetBeneficiaries}
                  onChange={(e) => setFormData({ ...formData, targetBeneficiaries: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  placeholder="Number of people to help"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={createCampaign.isPending}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {createCampaign.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Campaign'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Campaign Detail Modal */}
      {showDetailModal && selectedCampaignId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">Campaign Details</h2>
              <button 
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedCampaignId(null);
                }}
                className="text-gray-400 hover:text-gray-600"
                title="Close modal"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {isLoadingDetail ? (
              <div className="p-6 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
                <span className="ml-2">Loading details...</span>
              </div>
            ) : detailError ? (
              <div className="p-6 text-center text-red-500">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p>Error loading campaign: {detailError.message}</p>
              </div>
            ) : selectedCampaign ? (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedCampaign.title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedCampaign.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : selectedCampaign.status === 'completed'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedCampaign.status}
                    </span>
                    <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs">
                      {selectedCampaign.category}
                    </span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                      {selectedCampaign.urgencyLevel}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700">{selectedCampaign.description}</p>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{selectedCampaign.progressPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-rose-600 h-3 rounded-full transition-all"
                      style={{ width: `${Math.min(selectedCampaign.progressPercentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-3">
                    <div>
                      <p className="text-sm text-gray-600">Raised</p>
                      <p className="text-xl font-bold text-rose-600">
                        {formatAmount(selectedCampaign.currentAmount)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Goal</p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatAmount(selectedCampaign.goalAmount)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-2xl font-bold text-blue-600">{selectedCampaign.donationsCount}</p>
                    <p className="text-sm text-gray-600">Donations</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-2xl font-bold text-green-600">{selectedCampaign.uniqueDonorsCount}</p>
                    <p className="text-sm text-gray-600">Unique Donors</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-2xl font-bold text-purple-600">
                      {formatAmount(selectedCampaign.averageDonation)}
                    </p>
                    <p className="text-sm text-gray-600">Avg. Donation</p>
                  </div>
                </div>

                {selectedCampaign.recentDonations.length > 0 && (
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Recent Donations</h4>
                    <div className="space-y-2">
                      {selectedCampaign.recentDonations.slice(0, 5).map((donation) => (
                        <div key={donation.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                          <div>
                            <p className="font-medium text-gray-900">{donation.donorName}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(donation.donationDate).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="font-bold text-rose-600">{formatAmount(donation.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Start Date</p>
                    <p className="font-medium">{new Date(selectedCampaign.startDate).toLocaleDateString()}</p>
                  </div>
                  {selectedCampaign.endDate && (
                    <div>
                      <p className="text-gray-600">End Date</p>
                      <p className="font-medium">{new Date(selectedCampaign.endDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {selectedCampaign.targetBeneficiaries && (
                    <div>
                      <p className="text-gray-600">Target Beneficiaries</p>
                      <p className="font-medium">{selectedCampaign.targetBeneficiaries}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                Campaign not found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
