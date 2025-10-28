// Mock Data for Charity Management System
// Based on databasechema.dbml

// =============================================================================
// LOOKUP TABLES
// =============================================================================

export const mockCategories = [
  {
    id: 1,
    name: "Education",
    description: "Educational campaigns and initiatives",
    type: "campaign" as const,
    display_order: 1,
    is_active: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date("2024-01-15"),
  },
  {
    id: 2,
    name: "Healthcare",
    description: "Medical and healthcare campaigns",
    type: "campaign" as const,
    display_order: 2,
    is_active: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date("2024-01-15"),
  },
  {
    id: 3,
    name: "Food & Nutrition",
    description: "Feeding programs and nutrition support",
    type: "campaign" as const,
    display_order: 3,
    is_active: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date("2024-01-15"),
  },
  {
    id: 4,
    name: "Emergency Relief",
    description: "Disaster and emergency response",
    type: "campaign" as const,
    display_order: 4,
    is_active: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date("2024-01-15"),
  },
];

export const mockUserRoles = [
  {
    id: 1,
    name: "Admin",
    description: "Full system access",
    permissions: { all: true },
    is_active: true,
    created_at: new Date("2024-01-01"),
  },
  {
    id: 2,
    name: "User",
    description: "Standard user access",
    permissions: { view: true, donate: true },
    is_active: true,
    created_at: new Date("2024-01-01"),
  },
  {
    id: 3,
    name: "Volunteer",
    description: "Volunteer access",
    permissions: { view: true, volunteer: true },
    is_active: true,
    created_at: new Date("2024-01-01"),
  },
];

export const mockCurrencies = [
  {
    id: 1,
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    exchange_rate_to_usd: 1.0,
    is_active: true,
    updated_at: new Date(),
  },
  {
    id: 2,
    code: "KES",
    name: "Kenyan Shilling",
    symbol: "KSh",
    exchange_rate_to_usd: 0.0077,
    is_active: true,
    updated_at: new Date(),
  },
  {
    id: 3,
    code: "EUR",
    name: "Euro",
    symbol: "€",
    exchange_rate_to_usd: 1.09,
    is_active: true,
    updated_at: new Date(),
  },
];

export const mockUrgencyLevels = [
  {
    id: 1,
    name: "Critical",
    description: "Requires immediate attention",
    priority_score: 100,
    color_code: "#dc2626",
    is_active: true,
  },
  {
    id: 2,
    name: "High",
    description: "Urgent but not critical",
    priority_score: 75,
    color_code: "#f59e0b",
    is_active: true,
  },
  {
    id: 3,
    name: "Medium",
    description: "Standard priority",
    priority_score: 50,
    color_code: "#3b82f6",
    is_active: true,
  },
  {
    id: 4,
    name: "Low",
    description: "Low priority",
    priority_score: 25,
    color_code: "#10b981",
    is_active: true,
  },
];

export const mockCampaignStatuses = [
  { id: 1, name: "Draft", description: "Campaign in draft", is_active: true, display_order: 1 },
  { id: 2, name: "Active", description: "Campaign is live", is_active: true, display_order: 2 },
  { id: 3, name: "Paused", description: "Campaign paused", is_active: true, display_order: 3 },
  { id: 4, name: "Completed", description: "Campaign completed", is_active: true, display_order: 4 },
  { id: 5, name: "Cancelled", description: "Campaign cancelled", is_active: true, display_order: 5 },
];

export const mockPaymentMethods = [
  {
    id: 1,
    name: "Credit Card",
    description: "Pay with credit or debit card",
    processing_fee_percentage: 2.9,
    fixed_fee_amount: 0.30,
    is_active: true,
    requires_verification: false,
    supported_currencies: [1, 2, 3],
    created_at: new Date("2024-01-01"),
  },
  {
    id: 2,
    name: "M-Pesa",
    description: "Mobile money payment",
    processing_fee_percentage: 1.5,
    fixed_fee_amount: 0.0,
    is_active: true,
    requires_verification: false,
    supported_currencies: [2],
    created_at: new Date("2024-01-01"),
  },
  {
    id: 3,
    name: "Bank Transfer",
    description: "Direct bank transfer",
    processing_fee_percentage: 0.0,
    fixed_fee_amount: 0.0,
    is_active: true,
    requires_verification: true,
    supported_currencies: [1, 2, 3],
    created_at: new Date("2024-01-01"),
  },
];

export const mockDonationStatuses = [
  { id: 1, name: "Pending", description: "Payment pending", is_final: false, display_order: 1, is_active: true },
  { id: 2, name: "Processing", description: "Payment processing", is_final: false, display_order: 2, is_active: true },
  { id: 3, name: "Completed", description: "Payment completed", is_final: true, display_order: 3, is_active: true },
  { id: 4, name: "Failed", description: "Payment failed", is_final: true, display_order: 4, is_active: true },
  { id: 5, name: "Refunded", description: "Payment refunded", is_final: true, display_order: 5, is_active: true },
];

// =============================================================================
// CAMPAIGNS
// =============================================================================

export const mockCampaigns = [
  {
    id: 1,
    title: "School Supplies for 100 Children",
    description: "Help us provide essential school supplies including books, uniforms, and stationery for 100 orphaned children in rural Kenya. Every child deserves access to quality education.",
    goal_amount: 5000.00,
    currency_id: 1,
    category_id: 1,
    status_id: 2, // Active
    start_date: new Date("2024-10-01"),
    end_date: new Date("2024-12-31"),
    image_url: "/images/education-campaign.jpg",
    target_beneficiaries: 100,
    urgency_level_id: 2, // High
    created_by: 1,
    created_at: new Date("2024-09-25"),
    updated_at: new Date("2024-10-28"),
  },
  {
    id: 2,
    title: "Medical Supplies for Rural Clinic",
    description: "Our rural clinic serves over 500 families but lacks basic medical supplies. Help us stock essential medicines, bandages, and medical equipment.",
    goal_amount: 8000.00,
    currency_id: 1,
    category_id: 2,
    status_id: 2, // Active
    start_date: new Date("2024-09-15"),
    end_date: new Date("2024-11-30"),
    image_url: "/images/healthcare-campaign.jpg",
    target_beneficiaries: 500,
    urgency_level_id: 1, // Critical
    created_by: 1,
    created_at: new Date("2024-09-10"),
    updated_at: new Date("2024-10-28"),
  },
  {
    id: 3,
    title: "Monthly Food Packages for 50 Families",
    description: "Provide monthly food packages containing rice, beans, cooking oil, and vegetables for 50 families caring for orphaned children.",
    goal_amount: 3000.00,
    currency_id: 1,
    category_id: 3,
    status_id: 2, // Active
    start_date: new Date("2024-10-15"),
    end_date: new Date("2025-01-15"),
    image_url: "/images/food-campaign.jpg",
    target_beneficiaries: 50,
    urgency_level_id: 2, // High
    created_by: 1,
    created_at: new Date("2024-10-10"),
    updated_at: new Date("2024-10-28"),
  },
  {
    id: 4,
    title: "Emergency Shelter Repairs",
    description: "Recent storms damaged the roofs of 20 homes housing orphaned children. We need urgent funds to repair and waterproof these shelters before the rainy season.",
    goal_amount: 10000.00,
    currency_id: 1,
    category_id: 4,
    status_id: 2, // Active
    start_date: new Date("2024-10-20"),
    end_date: new Date("2024-11-20"),
    image_url: "/images/emergency-campaign.jpg",
    target_beneficiaries: 80,
    urgency_level_id: 1, // Critical
    created_by: 1,
    created_at: new Date("2024-10-20"),
    updated_at: new Date("2024-10-28"),
  },
];

export const mockCampaignStatistics = [
  {
    id: 1,
    campaign_id: 1,
    current_amount: 3250.00,
    donations_count: 42,
    unique_donors_count: 38,
    average_donation: 77.38,
    completion_percentage: 65.00,
    last_donation_date: new Date("2024-10-27"),
    updated_at: new Date("2024-10-28"),
  },
  {
    id: 2,
    campaign_id: 2,
    current_amount: 5800.00,
    donations_count: 58,
    unique_donors_count: 52,
    average_donation: 100.00,
    completion_percentage: 72.50,
    last_donation_date: new Date("2024-10-28"),
    updated_at: new Date("2024-10-28"),
  },
  {
    id: 3,
    campaign_id: 3,
    current_amount: 1500.00,
    donations_count: 25,
    unique_donors_count: 22,
    average_donation: 60.00,
    completion_percentage: 50.00,
    last_donation_date: new Date("2024-10-26"),
    updated_at: new Date("2024-10-28"),
  },
  {
    id: 4,
    campaign_id: 4,
    current_amount: 2500.00,
    donations_count: 18,
    unique_donors_count: 16,
    average_donation: 138.89,
    completion_percentage: 25.00,
    last_donation_date: new Date("2024-10-28"),
    updated_at: new Date("2024-10-28"),
  },
];

// =============================================================================
// DONATIONS
// =============================================================================

export const mockDonors = [
  {
    id: 1,
    user_id: null,
    first_name: null,
    last_name: null,
    email: null,
    phone: null,
    address_id: null,
    is_anonymous: true,
    created_at: new Date("2024-10-20"),
    updated_at: new Date("2024-10-20"),
  },
  {
    id: 2,
    user_id: 2,
    first_name: "John",
    last_name: "Smith",
    email: "john.smith@example.com",
    phone: "+1234567890",
    address_id: null,
    is_anonymous: false,
    created_at: new Date("2024-10-15"),
    updated_at: new Date("2024-10-15"),
  },
  {
    id: 3,
    user_id: null,
    first_name: "Sarah",
    last_name: "Johnson",
    email: "sarah.j@example.com",
    phone: null,
    address_id: null,
    is_anonymous: false,
    created_at: new Date("2024-10-18"),
    updated_at: new Date("2024-10-18"),
  },
];

export const mockDonations = [
  {
    id: 1,
    donor_id: 1,
    campaign_id: 1,
    amount: 100.00,
    currency_id: 1,
    payment_method_id: 1,
    payment_reference: "REF001",
    status_id: 3, // Completed
    is_recurring: false,
    recurring_frequency_id: null,
    parent_donation_id: null,
    processing_fee: 3.20,
    net_amount: 96.80,
    notes: null,
    donation_date: new Date("2024-10-27"),
    processed_at: new Date("2024-10-27"),
    created_at: new Date("2024-10-27"),
  },
  {
    id: 2,
    donor_id: 2,
    campaign_id: 2,
    amount: 250.00,
    currency_id: 1,
    payment_method_id: 1,
    payment_reference: "REF002",
    status_id: 3, // Completed
    is_recurring: false,
    recurring_frequency_id: null,
    parent_donation_id: null,
    processing_fee: 7.55,
    net_amount: 242.45,
    notes: "Keep up the great work!",
    donation_date: new Date("2024-10-28"),
    processed_at: new Date("2024-10-28"),
    created_at: new Date("2024-10-28"),
  },
  {
    id: 3,
    donor_id: 3,
    campaign_id: 1,
    amount: 50.00,
    currency_id: 1,
    payment_method_id: 2,
    payment_reference: "REF003",
    status_id: 3, // Completed
    is_recurring: false,
    recurring_frequency_id: null,
    parent_donation_id: null,
    processing_fee: 0.75,
    net_amount: 49.25,
    notes: null,
    donation_date: new Date("2024-10-26"),
    processed_at: new Date("2024-10-26"),
    created_at: new Date("2024-10-26"),
  },
  {
    id: 4,
    donor_id: 1,
    campaign_id: 3,
    amount: 75.00,
    currency_id: 1,
    payment_method_id: 1,
    payment_reference: "REF004",
    status_id: 3, // Completed
    is_recurring: false,
    recurring_frequency_id: null,
    parent_donation_id: null,
    processing_fee: 2.48,
    net_amount: 72.52,
    notes: null,
    donation_date: new Date("2024-10-25"),
    processed_at: new Date("2024-10-25"),
    created_at: new Date("2024-10-25"),
  },
  {
    id: 5,
    donor_id: 2,
    campaign_id: 4,
    amount: 500.00,
    currency_id: 1,
    payment_method_id: 3,
    payment_reference: "REF005",
    status_id: 3, // Completed
    is_recurring: false,
    recurring_frequency_id: null,
    parent_donation_id: null,
    processing_fee: 0.00,
    net_amount: 500.00,
    notes: "Emergency support",
    donation_date: new Date("2024-10-28"),
    processed_at: new Date("2024-10-28"),
    created_at: new Date("2024-10-28"),
  },
];

// =============================================================================
// DASHBOARD SUMMARY DATA
// =============================================================================

export const mockDashboardSummary = {
  totalDonations: mockDonations.reduce((sum, d) => sum + d.amount, 0),
  totalDonors: new Set(mockDonations.map(d => d.donor_id)).size,
  activeCampaigns: mockCampaigns.filter(c => c.status_id === 2).length,
  avgDonation: mockDonations.reduce((sum, d) => sum + d.amount, 0) / mockDonations.length,
  recentDonations: mockDonations
    .sort((a, b) => b.donation_date.getTime() - a.donation_date.getTime())
    .slice(0, 5),
  topCampaigns: mockCampaigns
    .map(campaign => ({
      ...campaign,
      stats: mockCampaignStatistics.find(s => s.campaign_id === campaign.id)!,
    }))
    .sort((a, b) => b.stats.current_amount - a.stats.current_amount)
    .slice(0, 3),
  monthlyTrend: [
    { month: "Jun", amount: 8500 },
    { month: "Jul", amount: 12300 },
    { month: "Aug", amount: 15800 },
    { month: "Sep", amount: 18200 },
    { month: "Oct", amount: 13050 },
  ],
  donationsByCategory: [
    { category: "Education", amount: 3250, percentage: 25 },
    { category: "Healthcare", amount: 5800, percentage: 45 },
    { category: "Food & Nutrition", amount: 1500, percentage: 11 },
    { category: "Emergency Relief", amount: 2500, percentage: 19 },
  ],
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export const getCampaignById = (id: number) => {
  return mockCampaigns.find(c => c.id === id);
};

export const getCampaignStats = (campaignId: number) => {
  return mockCampaignStatistics.find(s => s.campaign_id === campaignId);
};

export const getCategoryName = (categoryId: number) => {
  return mockCategories.find(c => c.id === categoryId)?.name || "Unknown";
};

export const getStatusName = (statusId: number) => {
  return mockCampaignStatuses.find(s => s.id === statusId)?.name || "Unknown";
};

export const getUrgencyLevel = (urgencyId: number) => {
  return mockUrgencyLevels.find(u => u.id === urgencyId);
};

export const getCurrencySymbol = (currencyId: number) => {
  return mockCurrencies.find(c => c.id === currencyId)?.symbol || "$";
};

export const formatAmount = (amount: number, currencyId: number = 1) => {
  const symbol = getCurrencySymbol(currencyId);
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const getDonorName = (donorId: number) => {
  const donor = mockDonors.find(d => d.id === donorId);
  if (!donor || donor.is_anonymous) return "Anonymous";
  return `${donor.first_name} ${donor.last_name}`;
};
