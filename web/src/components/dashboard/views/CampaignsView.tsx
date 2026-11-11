'use client';

import { PermissionGate } from '@/components/auth/PermissionGate';
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
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
        <span className="ml-2 text-muted-foreground">Loading campaigns...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12 text-destructive">
        <AlertCircle className="w-6 h-6 mr-2" />
        <span>Error loading campaigns: {error.message}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Campaigns</h2>
          <p className="text-muted-foreground mt-1">Where your gift goes right now</p>
        </div>
        <PermissionGate permission="campaigns:create">
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </button>
        </PermissionGate>
      </div>

      {/* Filters and Search */}
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Search campaigns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
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
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No campaigns found</p>
          </div>
        ) : (
          filteredCampaigns.map((campaign) => (
            <div key={campaign.id} className="bg-card rounded-xl shadow-sm border border-border p-6">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  campaign.status === 'active' 
                    ? 'bg-success/15 text-success' 
                    : campaign.status === 'completed'
                    ? 'bg-info/15 text-info'
                    : 'bg-muted text-foreground/80'
                }`}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleViewDetails(campaign.id)}
                    className="text-muted-foreground/70 hover:text-info"
                    title="View campaign details"
                    aria-label="View campaign details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">{campaign.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{campaign.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{campaign.progressPercentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(campaign.progressPercentage, 100)}%` }}
                    role="progressbar"
                    aria-valuenow={campaign.progressPercentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Campaign progress: ${campaign.progressPercentage.toFixed(0)}%`}
                  />
                </div>
                <div className="flex justify-between text-sm pt-2">
                  <span className="text-muted-foreground">Raised:</span>
                  <span className="font-bold text-brand">{formatAmount(campaign.currentAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Goal:</span>
                  <span className="font-medium">{formatAmount(campaign.goalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Donations:</span>
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
          <div className="bg-card rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card">
              <h2 className="text-xl font-bold text-foreground">Create New Campaign</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-muted-foreground/70 hover:text-foreground"
                title="Close modal"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">
                  Campaign Title <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                  placeholder="Enter campaign title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">
                  Description <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring min-h-[100px]"
                  placeholder="Describe your campaign goals and purpose"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-1">
                    Goal Amount <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.goalAmount}
                    onChange={(e) => setFormData({ ...formData, goalAmount: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                    placeholder="10000"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-1">
                    Currency <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={formData.currencyId}
                    onChange={(e) => setFormData({ ...formData, currencyId: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
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
                  <label className="block text-sm font-medium text-foreground/80 mb-1">
                    Category <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
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
                  <label className="block text-sm font-medium text-foreground/80 mb-1">
                    Urgency Level <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={formData.urgencyLevelId}
                    onChange={(e) => setFormData({ ...formData, urgencyLevelId: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
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
                  <label className="block text-sm font-medium text-foreground/80 mb-1">
                    Start Date <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                    title="Campaign start date"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                    title="Campaign end date"
                    min={formData.startDate}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">
                  Target Beneficiaries
                </label>
                <input
                  type="number"
                  value={formData.targetBeneficiaries}
                  onChange={(e) => setFormData({ ...formData, targetBeneficiaries: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                  placeholder="Number of people to help"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={createCampaign.isPending}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                  className="flex-1 bg-muted hover:bg-accent text-foreground/80 font-bold py-3 px-6 rounded-lg transition-colors"
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
          <div className="bg-card rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card">
              <h2 className="text-xl font-bold text-foreground">Campaign Details</h2>
              <button 
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedCampaignId(null);
                }}
                className="text-muted-foreground/70 hover:text-foreground"
                title="Close modal"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {isLoadingDetail ? (
              <div className="p-6 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-brand" />
                <span className="ml-2">Loading details...</span>
              </div>
            ) : detailError ? (
              <div className="p-6 text-center text-destructive">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p>Error loading campaign: {detailError.message}</p>
              </div>
            ) : selectedCampaign ? (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{selectedCampaign.title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedCampaign.status === 'active' 
                        ? 'bg-success/15 text-success' 
                        : selectedCampaign.status === 'completed'
                        ? 'bg-info/15 text-info'
                        : 'bg-muted text-foreground/80'
                    }`}>
                      {selectedCampaign.status}
                    </span>
                    <span className="px-3 py-1 bg-brand/10 text-brand rounded-full text-xs">
                      {selectedCampaign.category}
                    </span>
                    <span className="px-3 py-1 bg-warning/15 text-warning rounded-full text-xs">
                      {selectedCampaign.urgencyLevel}
                    </span>
                  </div>
                </div>

                <p className="text-foreground/80">{selectedCampaign.description}</p>

                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{selectedCampaign.progressPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full transition-all"
                      style={{ width: `${Math.min(selectedCampaign.progressPercentage, 100)}%` }}
                      role="progressbar"
                      aria-valuenow={selectedCampaign.progressPercentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Campaign progress: ${selectedCampaign.progressPercentage.toFixed(1)}%`}
                    />
                  </div>
                  <div className="flex justify-between mt-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Raised</p>
                      <p className="text-xl font-bold text-brand">
                        {formatAmount(selectedCampaign.currentAmount)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Goal</p>
                      <p className="text-xl font-bold text-foreground">
                        {formatAmount(selectedCampaign.goalAmount)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-info/15 rounded-lg p-4">
                    <p className="text-2xl font-bold text-info">{selectedCampaign.donationsCount}</p>
                    <p className="text-sm text-muted-foreground">Donations</p>
                  </div>
                  <div className="bg-success/15 rounded-lg p-4">
                    <p className="text-2xl font-bold text-success">{selectedCampaign.uniqueDonorsCount}</p>
                    <p className="text-sm text-muted-foreground">Unique Donors</p>
                  </div>
                  <div className="bg-chart-4/15 rounded-lg p-4">
                    <p className="text-2xl font-bold text-chart-4">
                      {formatAmount(selectedCampaign.averageDonation)}
                    </p>
                    <p className="text-sm text-muted-foreground">Avg. Donation</p>
                  </div>
                </div>

                {selectedCampaign.recentDonations.length > 0 && (
                  <div>
                    <h4 className="font-bold text-foreground mb-3">Recent Donations</h4>
                    <div className="space-y-2">
                      {selectedCampaign.recentDonations.slice(0, 5).map((donation) => (
                        <div key={donation.id} className="flex justify-between items-center py-2 border-b border-border">
                          <div>
                            <p className="font-medium text-foreground">{donation.donorName}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(donation.donationDate).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="font-bold text-brand">{formatAmount(donation.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Start Date</p>
                    <p className="font-medium">{new Date(selectedCampaign.startDate).toLocaleDateString()}</p>
                  </div>
                  {selectedCampaign.endDate && (
                    <div>
                      <p className="text-muted-foreground">End Date</p>
                      <p className="font-medium">{new Date(selectedCampaign.endDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {selectedCampaign.targetBeneficiaries && (
                    <div>
                      <p className="text-muted-foreground">Target Beneficiaries</p>
                      <p className="font-medium">{selectedCampaign.targetBeneficiaries}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                Campaign not found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
