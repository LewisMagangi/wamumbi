'use client';

import React, { useState } from 'react';
import { Download, TrendingUp, Calendar, BarChart3, X, Clock } from 'lucide-react';
import { mockDashboardSummary, formatAmount } from '../../../lib/mockData';

export const ReportsView: React.FC = () => {
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  const handleExportClick = () => {
    setShowComingSoonModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Reports & Analytics</h2>
          <p className="text-muted-foreground mt-1">View insights and export reports</p>
        </div>
        <button 
          onClick={handleExportClick}
          className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Donations</p>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <p className="text-2xl font-bold text-foreground">{formatAmount(mockDashboardSummary.totalDonations)}</p>
          <p className="text-xs text-success mt-1">+12.5% from last month</p>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Active Campaigns</p>
            <BarChart3 className="w-4 h-4 text-info" />
          </div>
          <p className="text-2xl font-bold text-foreground">{mockDashboardSummary.activeCampaigns}</p>
          <p className="text-xs text-muted-foreground mt-1">{mockDashboardSummary.topCampaigns.length} total campaigns</p>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Avg. Donation</p>
            <TrendingUp className="w-4 h-4 text-chart-4" />
          </div>
          <p className="text-2xl font-bold text-foreground">${mockDashboardSummary.avgDonation.toFixed(2)}</p>
          <p className="text-xs text-chart-4 mt-1">+8.3% from last month</p>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Donors</p>
            <Calendar className="w-4 h-4 text-success" />
          </div>
          <p className="text-2xl font-bold text-foreground">{mockDashboardSummary.totalDonors}</p>
          <p className="text-xs text-success mt-1">+15 new this month</p>
        </div>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <h3 className="font-bold text-lg mb-4">Financial Reports</h3>
          <div className="space-y-3">
            <button 
              onClick={handleExportClick}
              className="w-full flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent"
            >
              <span className="text-sm font-medium">Monthly Donation Summary</span>
              <Download className="w-4 h-4 text-muted-foreground" />
            </button>
            <button 
              onClick={handleExportClick}
              className="w-full flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent"
            >
              <span className="text-sm font-medium">Campaign Performance</span>
              <Download className="w-4 h-4 text-muted-foreground" />
            </button>
            <button 
              onClick={handleExportClick}
              className="w-full flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent"
            >
              <span className="text-sm font-medium">Donor Retention Analysis</span>
              <Download className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <h3 className="font-bold text-lg mb-4">Operational Reports</h3>
          <div className="space-y-3">
            <button 
              onClick={handleExportClick}
              className="w-full flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent"
            >
              <span className="text-sm font-medium">Volunteer Hours Report</span>
              <Download className="w-4 h-4 text-muted-foreground" />
            </button>
            <button 
              onClick={handleExportClick}
              className="w-full flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent"
            >
              <span className="text-sm font-medium">Event Attendance Summary</span>
              <Download className="w-4 h-4 text-muted-foreground" />
            </button>
            <button 
              onClick={handleExportClick}
              className="w-full flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent"
            >
              <span className="text-sm font-medium">Project Status Overview</span>
              <Download className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Trend Chart Placeholder */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <h3 className="font-bold text-lg mb-4">Donation Trends (Last 12 Months)</h3>
        <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg border border-border">
          <p className="text-muted-foreground">Chart visualization will be implemented here</p>
        </div>
      </div>

      {/* Coming Soon Modal */}
      {showComingSoonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl shadow-xl max-w-md w-full p-8 text-center relative">
            <button 
              onClick={() => setShowComingSoonModal(false)}
              className="absolute top-4 right-4 text-muted-foreground/70 hover:text-foreground"
              title="Close modal"
              aria-label="Close coming soon modal"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8 text-brand" />
            </div>
            
            <h2 className="text-2xl font-bold text-foreground mb-2">Coming Soon</h2>
            <p className="text-muted-foreground mb-6">
              Report export functionality is coming in <span className="font-semibold text-brand">Version 2</span>.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              We&apos;re working on comprehensive reporting features including 
              PDF exports, Excel downloads, and custom date range filtering.
            </p>
            
            <button
              onClick={() => setShowComingSoonModal(false)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
