// web/src/components/dashboard/Modal.tsx - Enhanced with working donation form
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { mockCampaigns, mockCurrencies, mockPaymentMethods } from '@/lib/mockData';

interface ModalProps {
  type: string;
  showModal: boolean;
  onClose: () => void;
}

interface DonationFormData {
  donorFirstName: string;
  donorLastName: string;
  donorEmail: string;
  donorPhone: string;
  campaignId: number;
  amount: number;
  currencyId: number;
  paymentMethodId: number;
  isAnonymous: boolean;
  notes: string;
}

export const Modal: React.FC<ModalProps> = ({ type, showModal, onClose }) => {
  const [donationData, setDonationData] = useState<DonationFormData>({
    donorFirstName: '',
    donorLastName: '',
    donorEmail: '',
    donorPhone: '',
    campaignId: mockCampaigns[0]?.id || 1,
    amount: 0,
    currencyId: 1, // USD by default
    paymentMethodId: 1, // Credit Card by default
    isAnonymous: false,
    notes: ''
  });

  const [campaignData, setCampaignData] = useState({
    title: '',
    description: '',
    goalAmount: 0,
    categoryId: 1,
    startDate: '',
    endDate: '',
    urgencyLevel: 3
  });

  if (!showModal) return null;

  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Recording donation:', donationData);
    
    // Simulate successful donation
    alert(`Donation of $${donationData.amount} recorded successfully!`);
    
    // Reset form
    setDonationData({
      donorFirstName: '',
      donorLastName: '',
      donorEmail: '',
      donorPhone: '',
      campaignId: mockCampaigns[0]?.id || 1,
      amount: 0,
      currencyId: 1,
      paymentMethodId: 1,
      isAnonymous: false,
      notes: ''
    });
    
    onClose();
  };

  const handleCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating campaign:', campaignData);
    alert(`Campaign "${campaignData.title}" created successfully!`);
    
    setCampaignData({
      title: '',
      description: '',
      goalAmount: 0,
      categoryId: 1,
      startDate: '',
      endDate: '',
      urgencyLevel: 3
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-foreground">
            {type === 'donation' && 'Record Donation'}
            {type === 'campaign' && 'Add New Campaign'}
            {type === 'event' && 'Add New Event'}
            {type === 'project' && 'Add New Project'}
            {type === 'volunteer' && 'Add Volunteer'}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground/70 hover:text-foreground transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {type === 'donation' && (
            <form onSubmit={handleDonationSubmit} className="space-y-6">
              {/* Anonymous Donation Toggle */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={donationData.isAnonymous}
                  onChange={(e) => setDonationData({...donationData, isAnonymous: e.target.checked})}
                  className="w-4 h-4 text-success rounded"
                />
                <label htmlFor="anonymous" className="ml-2 text-sm text-foreground/80">
                  Make this an anonymous donation
                </label>
              </div>

              {/* Donor Information (hidden if anonymous) */}
              {!donationData.isAnonymous && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Donor Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={donationData.donorFirstName}
                        onChange={(e) => setDonationData({...donationData, donorFirstName: e.target.value})}
                        className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                        placeholder="Enter first name"
                        required={!donationData.isAnonymous}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={donationData.donorLastName}
                        onChange={(e) => setDonationData({...donationData, donorLastName: e.target.value})}
                        className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                        placeholder="Enter last name"
                        required={!donationData.isAnonymous}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={donationData.donorEmail}
                        onChange={(e) => setDonationData({...donationData, donorEmail: e.target.value})}
                        className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                        placeholder="Enter email address"
                        required={!donationData.isAnonymous}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={donationData.donorPhone}
                        onChange={(e) => setDonationData({...donationData, donorPhone: e.target.value})}
                        className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Donation Details */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Donation Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">
                      Campaign *
                    </label>
                    <select
                      value={donationData.campaignId}
                      onChange={(e) => setDonationData({...donationData, campaignId: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                      title="Campaign"
                      required
                    >
                      {mockCampaigns.map(campaign => (
                        <option key={campaign.id} value={campaign.id}>
                          {campaign.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-2">
                        Amount *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        value={donationData.amount || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          setDonationData({...donationData, amount: isNaN(value) ? 0 : value});
                        }}
                        className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                        placeholder="Enter donation amount"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="currency-select" className="block text-sm font-medium text-foreground/80 mb-2">
                        Currency *
                      </label>
                      <select
                        id="currency-select"
                        value={donationData.currencyId}
                        onChange={(e) => setDonationData({...donationData, currencyId: parseInt(e.target.value)})}
                        className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                        aria-label="Select currency"
                        required
                      >
                        {mockCurrencies.map(currency => (
                          <option key={currency.id} value={currency.id}>
                            {currency.code} ({currency.symbol})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">
                      Payment Method *
                    </label>
                    <select
                      value={donationData.paymentMethodId}
                      onChange={(e) => setDonationData({...donationData, paymentMethodId: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                      aria-label="Select payment method"
                      required
                    >
                      {mockPaymentMethods.map(method => (
                        <option key={method.id} value={method.id}>
                          {method.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={donationData.notes}
                      onChange={(e) => setDonationData({...donationData, notes: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                      placeholder="Any additional notes..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-lg"
                >
                  Record Donation
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-muted hover:bg-accent text-foreground/80 font-bold py-3 px-6 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {type === 'campaign' && (
            <form onSubmit={handleCampaignSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  value={campaignData.title}
                  onChange={(e) => setCampaignData({...campaignData, title: e.target.value})}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                  placeholder="Enter campaign title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Description *
                </label>
                <textarea
                  value={campaignData.description}
                  onChange={(e) => setCampaignData({...campaignData, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                  placeholder="Describe your campaign..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Goal Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={campaignData.goalAmount || ''}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setCampaignData({...campaignData, goalAmount: isNaN(value) ? 0 : value});
                    }}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                    placeholder="Enter goal amount"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Urgency Level *
                  </label>
                  <select
                    value={campaignData.urgencyLevel}
                    onChange={(e) => setCampaignData({...campaignData, urgencyLevel: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                    aria-label="Select urgency level"
                    required
                  >
                    <option value={1}>Critical</option>
                    <option value={2}>High</option>
                    <option value={3}>Medium</option>
                    <option value={4}>Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={campaignData.startDate}
                    onChange={(e) => setCampaignData({...campaignData, startDate: e.target.value})}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                    aria-label="Campaign start date"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={campaignData.endDate}
                    onChange={(e) => setCampaignData({...campaignData, endDate: e.target.value})}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                    aria-label="Campaign end date"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-lg"
                >
                  Create Campaign
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-muted hover:bg-accent text-foreground/80 font-bold py-3 px-6 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {(type === 'event' || type === 'project' || type === 'volunteer') && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Form for {type} will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
