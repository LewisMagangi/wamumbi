// Mock Data for Charity Management System
// Fully aligned with Prisma Schema

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
  {
    id: 5,
    name: "Development Team",
    description: "Software development team",
    type: "team" as const,
    display_order: 1,
    is_active: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date("2024-01-15"),
  },
  {
    id: 6,
    name: "Volunteer Coordination",
    description: "Team coordinating volunteer activities",
    type: "team" as const,
    display_order: 2,
    is_active: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date("2024-01-15"),
  },
  {
    id: 7,
    name: "News & Updates",
    description: "Organization news and updates",
    type: "blog" as const,
    display_order: 1,
    is_active: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date("2024-01-15"),
  },
  {
    id: 8,
    name: "Community Event",
    description: "Community gathering events",
    type: "event" as const,
    display_order: 1,
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
  {
    id: 4,
    name: "Team Leader",
    description: "Team leadership access",
    permissions: { view: true, manage_team: true },
    is_active: true,
    created_at: new Date("2024-01-01"),
  },
];

export const mockUserStatuses = [
  {
    id: 1,
    name: "Active",
    description: "User account is active",
    is_active: true,
    created_at: new Date("2024-01-01"),
  },
  {
    id: 2,
    name: "Inactive",
    description: "User account is inactive",
    is_active: true,
    created_at: new Date("2024-01-01"),
  },
  {
    id: 3,
    name: "Suspended",
    description: "User account is suspended",
    is_active: true,
    created_at: new Date("2024-01-01"),
  },
];

export const mockProjectStatuses = [
  { id: 1, name: "Planning", description: "Project in planning phase", is_active: true, display_order: 1 },
  { id: 2, name: "In Progress", description: "Project is active", is_active: true, display_order: 2 },
  { id: 3, name: "On Hold", description: "Project paused", is_active: true, display_order: 3 },
  { id: 4, name: "Completed", description: "Project completed", is_active: true, display_order: 4 },
  { id: 5, name: "Cancelled", description: "Project cancelled", is_active: true, display_order: 5 },
];

export const mockCampaignStatuses = [
  { id: 1, name: "Draft", description: "Campaign in draft", is_active: true, display_order: 1 },
  { id: 2, name: "Active", description: "Campaign is live", is_active: true, display_order: 2 },
  { id: 3, name: "Paused", description: "Campaign paused", is_active: true, display_order: 3 },
  { id: 4, name: "Completed", description: "Campaign completed", is_active: true, display_order: 4 },
  { id: 5, name: "Cancelled", description: "Campaign cancelled", is_active: true, display_order: 5 },
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

// =============================================================================
// ADDRESS MANAGEMENT
// =============================================================================

export const mockAddresses = [
  {
    id: 1,
    street_line_1: "123 Charity Lane",
    street_line_2: "Suite 100",
    city: "Nairobi",
    state: "Nairobi County",
    postal_code: "00100",
    country: "Kenya",
    latitude: -1.2921,
    longitude: 36.8219,
    is_validated: true,
    created_at: new Date("2024-01-10"),
    updated_at: new Date("2024-01-10"),
  },
  {
    id: 2,
    street_line_1: "456 Hope Street",
    street_line_2: null,
    city: "Kisumu",
    state: "Kisumu County",
    postal_code: "40100",
    country: "Kenya",
    latitude: -0.0917,
    longitude: 34.7680,
    is_validated: true,
    created_at: new Date("2024-01-12"),
    updated_at: new Date("2024-01-12"),
  },
];

// =============================================================================
// USER MANAGEMENT
// =============================================================================

export const mockUsers = [
  {
    id: 1,
    email: "admin@charity.org",
    password_hash: "$2b$10$abcdefghijklmnopqrstuvwxyz123456", // Mock hash
    first_name: "Admin",
    last_name: "User",
    phone: "+254712345678",
    role_id: 1,
    status_id: 1,
    profile_image: "/images/admin.jpg",
    address_id: 1,
    email_verified: true,
    phone_verified: true,
    two_factor_enabled: true,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-10-28"),
    last_login: new Date("2024-10-28"),
  },
  {
    id: 2,
    email: "john.smith@example.com",
    password_hash: "$2b$10$abcdefghijklmnopqrstuvwxyz123456",
    first_name: "John",
    last_name: "Smith",
    phone: "+1234567890",
    role_id: 2,
    status_id: 1,
    profile_image: null,
    address_id: null,
    email_verified: true,
    phone_verified: false,
    two_factor_enabled: false,
    created_at: new Date("2024-02-15"),
    updated_at: new Date("2024-10-27"),
    last_login: new Date("2024-10-27"),
  },
  {
    id: 3,
    email: "sarah.johnson@example.com",
    password_hash: "$2b$10$abcdefghijklmnopqrstuvwxyz123456",
    first_name: "Sarah",
    last_name: "Johnson",
    phone: "+254723456789",
    role_id: 3,
    status_id: 1,
    profile_image: null,
    address_id: 2,
    email_verified: true,
    phone_verified: true,
    two_factor_enabled: false,
    created_at: new Date("2024-03-10"),
    updated_at: new Date("2024-10-26"),
    last_login: new Date("2024-10-26"),
  },
];

// =============================================================================
// PAYMENT METHODS & DONATION STATUSES
// =============================================================================

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
  {
    id: 4,
    name: "PayPal",
    description: "Pay with PayPal",
    processing_fee_percentage: 2.9,
    fixed_fee_amount: 0.30,
    is_active: true,
    requires_verification: false,
    supported_currencies: [1, 3],
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

export const mockRecurringFrequencies = [
  { id: 1, name: "Weekly", description: "Every 7 days", days_interval: 7, display_order: 1, is_active: true },
  { id: 2, name: "Bi-Weekly", description: "Every 14 days", days_interval: 14, display_order: 2, is_active: true },
  { id: 3, name: "Monthly", description: "Every 30 days", days_interval: 30, display_order: 3, is_active: true },
  { id: 4, name: "Quarterly", description: "Every 90 days", days_interval: 90, display_order: 4, is_active: true },
  { id: 5, name: "Annually", description: "Every 365 days", days_interval: 365, display_order: 5, is_active: true },
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
    address_id: 1,
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
    address_id: 2,
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
    address_id: 1,
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
    address_id: 2,
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
  {
    id: 4,
    user_id: 3,
    first_name: "Sarah",
    last_name: "Johnson",
    email: "sarah.johnson@example.com",
    phone: "+254723456789",
    address_id: 2,
    is_anonymous: false,
    created_at: new Date("2024-03-10"),
    updated_at: new Date("2024-03-10"),
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
    is_recurring: true,
    recurring_frequency_id: 3, // Monthly
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
// TEAM MANAGEMENT
// =============================================================================

export const mockTeams = [
  {
    id: 1,
    name: "Development Team",
    description: "Core development team building the platform",
    category_id: 5,
    team_leader_id: 1,
    status: "active" as const,
    max_members: 10,
    created_at: new Date("2024-01-10"),
    updated_at: new Date("2024-10-28"),
  },
  {
    id: 2,
    name: "Volunteer Coordinators",
    description: "Team managing volunteer activities and events",
    category_id: 6,
    team_leader_id: 3,
    status: "active" as const,
    max_members: 15,
    created_at: new Date("2024-02-01"),
    updated_at: new Date("2024-10-28"),
  },
];

export const mockTeamMembers = [
  {
    id: 1,
    team_id: 1,
    user_id: 1,
    joined_at: new Date("2024-01-10"),
    status: "active" as const,
    role: "Leader",
  },
  {
    id: 2,
    team_id: 1,
    user_id: 2,
    joined_at: new Date("2024-02-15"),
    status: "active" as const,
    role: "Developer",
  },
  {
    id: 3,
    team_id: 2,
    user_id: 3,
    joined_at: new Date("2024-02-01"),
    status: "active" as const,
    role: "Coordinator",
  },
];

// =============================================================================
// PROJECT MANAGEMENT
// =============================================================================

export const mockProjects = [
  {
    id: 1,
    title: "School Renovation Project",
    description: "Complete renovation of primary school facilities",
    team_id: 2,
    campaign_id: 1,
    start_date: new Date("2024-11-01"),
    end_date: new Date("2024-12-31"),
    status_id: 2, // In Progress
    budget: 5000.00,
    currency_id: 1,
    address_id: 1,
    created_by: 1,
    created_at: new Date("2024-10-15"),
    updated_at: new Date("2024-10-28"),
  },
  {
    id: 2,
    title: "Medical Equipment Distribution",
    description: "Distribute medical equipment to rural clinics",
    team_id: 2,
    campaign_id: 2,
    start_date: new Date("2024-10-20"),
    end_date: new Date("2024-11-30"),
    status_id: 2, // In Progress
    budget: 8000.00,
    currency_id: 1,
    address_id: 2,
    created_by: 1,
    created_at: new Date("2024-10-10"),
    updated_at: new Date("2024-10-28"),
  },
];

export const mockProjectProgress = [
  {
    id: 1,
    project_id: 1,
    progress_percentage: 35,
    hours_logged: 120.50,
    volunteers_count: 12,
    tasks_completed: 7,
    tasks_total: 20,
    last_update_date: new Date("2024-10-28"),
    updated_at: new Date("2024-10-28"),
  },
  {
    id: 2,
    project_id: 2,
    progress_percentage: 60,
    hours_logged: 85.25,
    volunteers_count: 8,
    tasks_completed: 12,
    tasks_total: 20,
    last_update_date: new Date("2024-10-27"),
    updated_at: new Date("2024-10-27"),
  },
];

// =============================================================================
// EVENT MANAGEMENT
// =============================================================================

export const mockEventStatuses = [
  { id: 1, name: "Scheduled", description: "Event scheduled", display_order: 1, is_active: true },
  { id: 2, name: "Ongoing", description: "Event in progress", display_order: 2, is_active: true },
  { id: 3, name: "Completed", description: "Event completed", display_order: 3, is_active: true },
  { id: 4, name: "Cancelled", description: "Event cancelled", display_order: 4, is_active: true },
];

export const mockEvents = [
  {
    id: 1,
    title: "Annual Charity Gala",
    description: "Join us for our annual fundraising gala with dinner, entertainment, and auctions",
    event_date: new Date("2024-12-15T18:00:00"),
    address_id: 1,
    capacity: 200,
    ticket_price: 50.00,
    currency_id: 1,
    status_id: 1, // Scheduled
    image_url: "/images/gala-event.jpg",
    registration_deadline: new Date("2024-12-10"),
    category_id: 8,
    created_by: 1,
    created_at: new Date("2024-10-01"),
    updated_at: new Date("2024-10-28"),
  },
  {
    id: 2,
    title: "Volunteer Orientation Day",
    description: "New volunteer orientation and training session",
    event_date: new Date("2024-11-05T09:00:00"),
    address_id: 1,
    capacity: 50,
    ticket_price: 0.00,
    currency_id: 1,
    status_id: 1, // Scheduled
    image_url: "/images/volunteer-orientation.jpg",
    registration_deadline: new Date("2024-11-01"),
    category_id: 8,
    created_by: 1,
    created_at: new Date("2024-10-15"),
    updated_at: new Date("2024-10-28"),
  },
];

export const mockRegistrationStatuses = [
  { id: 1, name: "Pending", description: "Registration pending", display_order: 1, is_active: true },
  { id: 2, name: "Confirmed", description: "Registration confirmed", display_order: 2, is_active: true },
  { id: 3, name: "Cancelled", description: "Registration cancelled", display_order: 3, is_active: true },
  { id: 4, name: "Attended", description: "Attended the event", display_order: 4, is_active: true },
];

export const mockPaymentStatuses = [
  { id: 1, name: "Pending", description: "Payment pending", display_order: 1, is_active: true },
  { id: 2, name: "Paid", description: "Payment completed", display_order: 2, is_active: true },
  { id: 3, name: "Refunded", description: "Payment refunded", display_order: 3, is_active: true },
  { id: 4, name: "Waived", description: "Payment waived", display_order: 4, is_active: true },
];

export const mockEventRegistrations = [
  {
    id: 1,
    event_id: 1,
    user_id: 2,
    registration_date: new Date("2024-10-20"),
    status_id: 2, // Confirmed
    payment_status_id: 2, // Paid
    payment_reference: "EVT001",
    special_requirements: null,
  },
  {
    id: 2,
    event_id: 2,
    user_id: 3,
    registration_date: new Date("2024-10-22"),
    status_id: 2, // Confirmed
    payment_status_id: 4, // Waived
    payment_reference: null,
    special_requirements: "Vegetarian meal preference",
  },
  {
    id: 3,
    event_id: 1,
    user_id: 3,
    registration_date: new Date("2024-10-25"),
    status_id: 2, // Confirmed
    payment_status_id: 2, // Paid
    payment_reference: "EVT002",
    special_requirements: "Wheelchair accessible seating",
  },
];

// =============================================================================
// VOLUNTEER MANAGEMENT
// =============================================================================

export const mockEmergencyContacts = [
  {
    id: 1,
    name: "Jane Smith",
    phone: "+1234567891",
    email: "jane.smith@example.com",
    relationship: "Spouse",
    address_id: null,
    created_at: new Date("2024-03-10"),
    updated_at: new Date("2024-03-10"),
  },
  {
    id: 2,
    name: "Michael Johnson",
    phone: "+254723456790",
    email: "michael.j@example.com",
    relationship: "Brother",
    address_id: 2,
    created_at: new Date("2024-03-10"),
    updated_at: new Date("2024-03-10"),
  },
];

export const mockVolunteerSkills = [
  {
    id: 1,
    name: "First Aid",
    description: "Basic and advanced first aid training",
    category: "Medical",
    is_active: true,
    created_at: new Date("2024-01-15"),
  },
  {
    id: 2,
    name: "Teaching",
    description: "Teaching and tutoring skills",
    category: "Education",
    is_active: true,
    created_at: new Date("2024-01-15"),
  },
  {
    id: 3,
    name: "Event Planning",
    description: "Planning and coordinating events",
    category: "Administration",
    is_active: true,
    created_at: new Date("2024-01-15"),
  },
  {
    id: 4,
    name: "Construction",
    description: "Building and renovation skills",
    category: "Technical",
    is_active: true,
    created_at: new Date("2024-01-15"),
  },
  {
    id: 5,
    name: "Translation",
    description: "Language translation services",
    category: "Communication",
    is_active: true,
    created_at: new Date("2024-01-15"),
  },
];

export const mockBackgroundCheckStatuses = [
  { id: 1, name: "Not Started", description: "Check not initiated", requires_action: true, display_order: 1, is_active: true },
  { id: 2, name: "In Progress", description: "Check in progress", requires_action: false, display_order: 2, is_active: true },
  { id: 3, name: "Completed", description: "Check completed successfully", requires_action: false, display_order: 3, is_active: true },
  { id: 4, name: "Failed", description: "Check failed", requires_action: true, display_order: 4, is_active: true },
  { id: 5, name: "Expired", description: "Check expired", requires_action: true, display_order: 5, is_active: true },
];

export const mockVolunteerStatuses = [
  { id: 1, name: "Active", description: "Active volunteer", is_active_status: true, display_order: 1, is_active: true },
  { id: 2, name: "Inactive", description: "Inactive volunteer", is_active_status: false, display_order: 2, is_active: true },
  { id: 3, name: "On Leave", description: "Temporarily on leave", is_active_status: false, display_order: 3, is_active: true },
  { id: 4, name: "Suspended", description: "Suspended from activities", is_active_status: false, display_order: 4, is_active: true },
];

export const mockVolunteers = [
  {
    id: 1,
    user_id: 3,
    availability: "Weekends and evenings",
    emergency_contact_id: 2,
    background_check_status_id: 3, // Completed
    background_check_date: new Date("2024-03-15"),
    background_check_expiry: new Date("2025-03-15"),
    joined_date: new Date("2024-03-10"),
    status_id: 1, // Active
    created_at: new Date("2024-03-10"),
    updated_at: new Date("2024-10-28"),
  },
  {
    id: 2,
    user_id: 2,
    availability: "Flexible schedule",
    emergency_contact_id: 1,
    background_check_status_id: 3, // Completed
    background_check_date: new Date("2024-02-20"),
    background_check_expiry: new Date("2025-02-20"),
    joined_date: new Date("2024-02-15"),
    status_id: 1, // Active
    created_at: new Date("2024-02-15"),
    updated_at: new Date("2024-10-28"),
  },
];

export const mockVolunteerSkillAssignments = [
  {
    id: 1,
    volunteer_id: 1,
    skill_id: 2, // Teaching
    proficiency_level: "intermediate" as const,
    years_experience: 3,
    created_at: new Date("2024-03-10"),
  },
  {
    id: 2,
    volunteer_id: 1,
    skill_id: 3, // Event Planning
    proficiency_level: "advanced" as const,
    years_experience: 5,
    created_at: new Date("2024-03-10"),
  },
  {
    id: 3,
    volunteer_id: 2,
    skill_id: 1, // First Aid
    proficiency_level: "expert" as const,
    years_experience: 8,
    created_at: new Date("2024-02-15"),
  },
  {
    id: 4,
    volunteer_id: 2,
    skill_id: 4, // Construction
    proficiency_level: "intermediate" as const,
    years_experience: 4,
    created_at: new Date("2024-02-15"),
  },
];

export const mockVolunteerStatistics = [
  {
    id: 1,
    volunteer_id: 1,
    total_hours: 156.50,
    activities_count: 24,
    projects_count: 3,
    events_count: 8,
    teams_count: 1,
    last_activity_date: new Date("2024-10-27"),
    updated_at: new Date("2024-10-28"),
  },
  {
    id: 2,
    volunteer_id: 2,
    total_hours: 203.75,
    activities_count: 31,
    projects_count: 4,
    events_count: 6,
    teams_count: 1,
    last_activity_date: new Date("2024-10-28"),
    updated_at: new Date("2024-10-28"),
  },
];

export const mockActivityTypes = [
  {
    id: 1,
    name: "Event Support",
    description: "Helping with event organization and execution",
    requires_verification: false,
    display_order: 1,
    is_active: true,
  },
  {
    id: 2,
    name: "Project Work",
    description: "Working on specific projects",
    requires_verification: true,
    display_order: 2,
    is_active: true,
  },
  {
    id: 3,
    name: "Training",
    description: "Attending training sessions",
    requires_verification: false,
    display_order: 3,
    is_active: true,
  },
  {
    id: 4,
    name: "Community Outreach",
    description: "Engaging with community members",
    requires_verification: true,
    display_order: 4,
    is_active: true,
  },
];

export const mockVolunteerActivities = [
  {
    id: 1,
    volunteer_id: 1,
    activity_type_id: 2, // Project Work
    description: "Helped with school renovation planning and coordination",
    hours_logged: 8.00,
    activity_date: new Date("2024-10-27"),
    project_id: 1,
    event_id: null,
    verified_by: 1,
    verification_date: new Date("2024-10-28"),
    verification_notes: "Excellent work on project planning",
    created_at: new Date("2024-10-27"),
  },
  {
    id: 2,
    volunteer_id: 2,
    activity_type_id: 1, // Event Support
    description: "Assisted with volunteer orientation setup",
    hours_logged: 5.50,
    activity_date: new Date("2024-10-28"),
    project_id: null,
    event_id: 2,
    verified_by: null,
    verification_date: null,
    verification_notes: null,
    created_at: new Date("2024-10-28"),
  },
  {
    id: 3,
    volunteer_id: 1,
    activity_type_id: 4, // Community Outreach
    description: "Conducted survey with beneficiary families",
    hours_logged: 6.00,
    activity_date: new Date("2024-10-25"),
    project_id: 1,
    event_id: null,
    verified_by: 1,
    verification_date: new Date("2024-10-26"),
    verification_notes: "Great engagement with community",
    created_at: new Date("2024-10-25"),
  },
];

// =============================================================================
// CONTENT MANAGEMENT
// =============================================================================

export const mockBlogPostStatuses = [
  { id: 1, name: "Draft", description: "Post is in draft", is_published: false, display_order: 1, is_active: true },
  { id: 2, name: "Published", description: "Post is published", is_published: true, display_order: 2, is_active: true },
  { id: 3, name: "Archived", description: "Post is archived", is_published: false, display_order: 3, is_active: true },
];

export const mockBlogPosts = [
  {
    id: 1,
    title: "New School Supplies Campaign Launch",
    content: "We are excited to announce our latest campaign to provide school supplies for 100 children in rural Kenya. This initiative aims to ensure that every child has access to the educational materials they need to succeed...",
    excerpt: "Launching a new campaign to provide school supplies for 100 orphaned children.",
    category_id: 7,
    status_id: 2, // Published
    featured_image: "/images/blog-education.jpg",
    author_id: 1,
    published_at: new Date("2024-10-01"),
    created_at: new Date("2024-09-28"),
    updated_at: new Date("2024-10-01"),
  },
  {
    id: 2,
    title: "Medical Clinic Receives New Equipment",
    content: "Thanks to the generous donations from our supporters, the rural clinic in Kisumu has received vital medical equipment including diagnostic tools, surgical supplies, and patient monitoring systems...",
    excerpt: "Rural clinic receives much-needed medical equipment through donor support.",
    category_id: 7,
    status_id: 2, // Published
    featured_image: "/images/blog-healthcare.jpg",
    author_id: 1,
    published_at: new Date("2024-10-15"),
    created_at: new Date("2024-10-12"),
    updated_at: new Date("2024-10-15"),
  },
  {
    id: 3,
    title: "Volunteer Spotlight: Sarah Johnson",
    content: "This month we're highlighting Sarah Johnson, one of our most dedicated volunteers who has contributed over 150 hours to our education programs...",
    excerpt: "Meet Sarah Johnson, volunteer coordinator and education advocate.",
    category_id: 7,
    status_id: 2, // Published
    featured_image: "/images/blog-volunteer.jpg",
    author_id: 1,
    published_at: new Date("2024-10-20"),
    created_at: new Date("2024-10-18"),
    updated_at: new Date("2024-10-20"),
  },
];

// =============================================================================
// COMMUNICATION SYSTEM
// =============================================================================

export const mockTeamCommunications = [
  {
    id: 1,
    team_id: 1,
    sender_id: 1,
    message_type: "announcement" as const,
    title: "Platform Update Scheduled",
    content: "We will be performing system maintenance on November 1st from 2-4 AM. Please save your work before this time.",
    is_pinned: true,
    created_at: new Date("2024-10-25"),
    updated_at: new Date("2024-10-25"),
  },
  {
    id: 2,
    team_id: 2,
    sender_id: 3,
    message_type: "discussion" as const,
    title: "Volunteer Event Planning Discussion",
    content: "Let's discuss ideas for the upcoming volunteer orientation event. What activities should we include?",
    is_pinned: false,
    created_at: new Date("2024-10-26"),
    updated_at: new Date("2024-10-26"),
  },
  {
    id: 3,
    team_id: 2,
    sender_id: 3,
    message_type: "poll" as const,
    title: "Best Day for Team Meeting",
    content: "Vote for the best day this week for our team meeting.",
    is_pinned: false,
    created_at: new Date("2024-10-27"),
    updated_at: new Date("2024-10-27"),
  },
];

export const mockTeamPolls = [
  {
    id: 1,
    communication_id: 3,
    question: "Which day works best for our team meeting?",
    is_multiple_choice: false,
    closes_at: new Date("2024-10-31"),
    is_anonymous: false,
    created_at: new Date("2024-10-27"),
  },
];

export const mockTeamPollOptions = [
  {
    id: 1,
    poll_id: 1,
    option_text: "Monday",
    display_order: 1,
    created_at: new Date("2024-10-27"),
  },
  {
    id: 2,
    poll_id: 1,
    option_text: "Wednesday",
    display_order: 2,
    created_at: new Date("2024-10-27"),
  },
  {
    id: 3,
    poll_id: 1,
    option_text: "Friday",
    display_order: 3,
    created_at: new Date("2024-10-27"),
  },
];

export const mockTeamPollVotes = [
  {
    id: 1,
    poll_id: 1,
    user_id: 3,
    option_id: 2, // Wednesday
    voted_at: new Date("2024-10-27"),
  },
  {
    id: 2,
    poll_id: 1,
    user_id: 2,
    option_id: 2, // Wednesday
    voted_at: new Date("2024-10-28"),
  },
];

// =============================================================================
// NOTIFICATION SYSTEM
// =============================================================================

export const mockNotificationTypes = [
  {
    id: 1,
    name: "Donation Received",
    description: "Notification when a donation is received",
    template_subject: "Thank you for your donation!",
    template_body: "Your donation of {amount} has been received.",
    priority: "normal" as const,
    is_active: true,
    created_at: new Date("2024-01-01"),
  },
  {
    id: 2,
    name: "Campaign Update",
    description: "Updates about campaigns",
    template_subject: "Campaign Update: {campaign_name}",
    template_body: "There's an update about {campaign_name}.",
    priority: "normal" as const,
    is_active: true,
    created_at: new Date("2024-01-01"),
  },
  {
    id: 3,
    name: "Event Registration",
    description: "Event registration confirmation",
    template_subject: "Event Registration Confirmed",
    template_body: "Your registration for {event_name} has been confirmed.",
    priority: "high" as const,
    is_active: true,
    created_at: new Date("2024-01-01"),
  },
  {
    id: 4,
    name: "Volunteer Activity",
    description: "Volunteer activity notifications",
    template_subject: "Activity Verified",
    template_body: "Your volunteer activity has been verified.",
    priority: "normal" as const,
    is_active: true,
    created_at: new Date("2024-01-01"),
  },
];

export const mockDeliveryMethods = [
  {
    id: 1,
    name: "Email",
    description: "Send via email",
    is_active: true,
    requires_config: true,
  },
  {
    id: 2,
    name: "SMS",
    description: "Send via SMS",
    is_active: true,
    requires_config: true,
  },
  {
    id: 3,
    name: "In-App",
    description: "In-application notification",
    is_active: true,
    requires_config: false,
  },
  {
    id: 4,
    name: "Push",
    description: "Push notification",
    is_active: true,
    requires_config: true,
  },
];

export const mockNotifications = [
  {
    id: 1,
    user_id: 2,
    notification_type_id: 1,
    title: "Donation Received",
    message: "Your donation of $250.00 to Medical Supplies for Rural Clinic has been processed successfully.",
    is_read: true,
    campaign_id: 2,
    donation_id: 2,
    event_id: null,
    project_id: null,
    team_id: null,
    blog_post_id: null,
    delivery_method_id: 3,
    delivered_at: new Date("2024-10-28"),
    read_at: new Date("2024-10-28"),
    expires_at: null,
    created_at: new Date("2024-10-28"),
  },
  {
    id: 2,
    user_id: 3,
    notification_type_id: 3,
    title: "Event Registration Confirmed",
    message: "Your registration for Volunteer Orientation Day has been confirmed.",
    is_read: false,
    campaign_id: null,
    donation_id: null,
    event_id: 2,
    project_id: null,
    team_id: null,
    blog_post_id: null,
    delivery_method_id: 3,
    delivered_at: new Date("2024-10-22"),
    read_at: null,
    expires_at: new Date("2024-11-05"),
    created_at: new Date("2024-10-22"),
  },
  {
    id: 3,
    user_id: 3,
    notification_type_id: 4,
    title: "Activity Verified",
    message: "Your volunteer activity from October 27th has been verified by Admin User.",
    is_read: false,
    campaign_id: null,
    donation_id: null,
    event_id: null,
    project_id: 1,
    team_id: null,
    blog_post_id: null,
    delivery_method_id: 3,
    delivered_at: new Date("2024-10-28"),
    read_at: null,
    expires_at: null,
    created_at: new Date("2024-10-28"),
  },
];

// =============================================================================
// SETTINGS MANAGEMENT
// =============================================================================

export const mockSettingCategories = [
  {
    id: 1,
    name: "General",
    description: "General application settings",
    display_order: 1,
    is_active: true,
    created_at: new Date("2024-01-01"),
  },
  {
    id: 2,
    name: "Payment",
    description: "Payment and donation settings",
    display_order: 2,
    is_active: true,
    created_at: new Date("2024-01-01"),
  },
  {
    id: 3,
    name: "Notification",
    description: "Notification preferences",
    display_order: 3,
    is_active: true,
    created_at: new Date("2024-01-01"),
  },
];

export const mockSettingDataTypes = [
  {
    id: 1,
    name: "String",
    validation_pattern: null,
    description: "Text string",
    is_active: true,
  },
  {
    id: 2,
    name: "Number",
    validation_pattern: "^[0-9]+$",
    description: "Numeric value",
    is_active: true,
  },
  {
    id: 3,
    name: "Boolean",
    validation_pattern: "^(true|false)$",
    description: "True or false value",
    is_active: true,
  },
  {
    id: 4,
    name: "Email",
    validation_pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    description: "Email address",
    is_active: true,
  },
];

export const mockSettings = [
  {
    id: 1,
    key: "organization_name",
    value: "Hope Charity Foundation",
    description: "Organization name displayed throughout the application",
    category_id: 1,
    data_type_id: 1,
    is_public: true,
    is_encrypted: false,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    id: 2,
    key: "contact_email",
    value: "contact@hopecharity.org",
    description: "Primary contact email address",
    category_id: 1,
    data_type_id: 4,
    is_public: true,
    is_encrypted: false,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    id: 3,
    key: "minimum_donation",
    value: "5.00",
    description: "Minimum donation amount allowed",
    category_id: 2,
    data_type_id: 2,
    is_public: true,
    is_encrypted: false,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    id: 4,
    key: "email_notifications_enabled",
    value: "true",
    description: "Enable email notifications system-wide",
    category_id: 3,
    data_type_id: 3,
    is_public: false,
    is_encrypted: false,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
];

// =============================================================================
// AUDIT SYSTEM
// =============================================================================

export const mockEntityTypes = [
  {
    id: 1,
    name: "User",
    table_name: "users",
    description: "User account entities",
    is_active: true,
  },
  {
    id: 2,
    name: "Campaign",
    table_name: "campaigns",
    description: "Campaign entities",
    is_active: true,
  },
  {
    id: 3,
    name: "Donation",
    table_name: "donations",
    description: "Donation transaction entities",
    is_active: true,
  },
  {
    id: 4,
    name: "Project",
    table_name: "projects",
    description: "Project entities",
    is_active: true,
  },
];

export const mockAuditActions = [
  {
    id: 1,
    name: "Create",
    description: "Entity created",
    severity: "low" as const,
    is_active: true,
  },
  {
    id: 2,
    name: "Update",
    description: "Entity updated",
    severity: "medium" as const,
    is_active: true,
  },
  {
    id: 3,
    name: "Delete",
    description: "Entity deleted",
    severity: "high" as const,
    is_active: true,
  },
  {
    id: 4,
    name: "Login",
    description: "User login",
    severity: "low" as const,
    is_active: true,
  },
  {
    id: 5,
    name: "Permission Change",
    description: "User permissions changed",
    severity: "critical" as const,
    is_active: true,
  },
];

export const mockAuditLogs = [
  {
    id: 1,
    user_id: 1,
    action_id: 1,
    entity_type_id: 2,
    entity_id: 4,
    old_values: null,
    new_values: { title: "Emergency Shelter Repairs", status_id: 1 },
    affected_columns: ["title", "status_id", "created_at"],
    ip_address: "192.168.1.100",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    session_id: "sess_abc123",
    created_at: new Date("2024-10-20"),
  },
  {
    id: 2,
    user_id: 1,
    action_id: 2,
    entity_type_id: 2,
    entity_id: 4,
    old_values: { status_id: 1 },
    new_values: { status_id: 2 },
    affected_columns: ["status_id", "updated_at"],
    ip_address: "192.168.1.100",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    session_id: "sess_abc123",
    created_at: new Date("2024-10-21"),
  },
  {
    id: 3,
    user_id: 2,
    action_id: 4,
    entity_type_id: 1,
    entity_id: 2,
    old_values: null,
    new_values: { last_login: new Date("2024-10-27") },
    affected_columns: ["last_login"],
    ip_address: "192.168.1.50",
    user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    session_id: "sess_xyz789",
    created_at: new Date("2024-10-27"),
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
  totalVolunteers: mockVolunteers.filter(v => v.status_id === 1).length,
  totalVolunteerHours: mockVolunteerStatistics.reduce((sum, s) => sum + parseFloat(s.total_hours.toString()), 0),
  activeProjects: mockProjects.filter(p => p.status_id === 2).length,
  upcomingEvents: mockEvents.filter(e => e.status_id === 1 && e.event_date > new Date()).length,
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
    { month: "Jun", amount: 8500, donors: 45 },
    { month: "Jul", amount: 12300, donors: 62 },
    { month: "Aug", amount: 15800, donors: 78 },
    { month: "Sep", amount: 18200, donors: 89 },
    { month: "Oct", amount: 13050, donors: 71 },
  ],
  donationsByCategory: [
    { category: "Education", amount: 3250, percentage: 25, campaigns: 1 },
    { category: "Healthcare", amount: 5800, percentage: 45, campaigns: 1 },
    { category: "Food & Nutrition", amount: 1500, percentage: 11, campaigns: 1 },
    { category: "Emergency Relief", amount: 2500, percentage: 19, campaigns: 1 },
  ],
  volunteerActivityByMonth: [
    { month: "Jun", hours: 180 },
    { month: "Jul", hours: 220 },
    { month: "Aug", hours: 195 },
    { month: "Sep", hours: 240 },
    { month: "Oct", hours: 360 },
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

export const getCategoryById = (categoryId: number) => {
  return mockCategories.find(c => c.id === categoryId);
};

export const getCategoryName = (categoryId: number) => {
  return mockCategories.find(c => c.id === categoryId)?.name || "Unknown";
};

export const getStatusName = (statusId: number) => {
  return mockCampaignStatuses.find(s => s.id === statusId)?.name || "Unknown";
};

export const getProjectStatusName = (statusId: number) => {
  return mockProjectStatuses.find(s => s.id === statusId)?.name || "Unknown";
};

export const getEventStatusName = (statusId: number) => {
  return mockEventStatuses.find(s => s.id === statusId)?.name || "Unknown";
};

export const getUrgencyLevel = (urgencyId: number) => {
  return mockUrgencyLevels.find(u => u.id === urgencyId);
};

export const getCurrency = (currencyId: number) => {
  return mockCurrencies.find(c => c.id === currencyId);
};

export const getCurrencySymbol = (currencyId: number) => {
  return mockCurrencies.find(c => c.id === currencyId)?.symbol || "$";
};

export const formatAmount = (amount: number, currencyId: number = 1) => {
  const symbol = getCurrencySymbol(currencyId);
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const getDonorById = (donorId: number) => {
  return mockDonors.find(d => d.id === donorId);
};

export const getDonorName = (donorId: number) => {
  const donor = mockDonors.find(d => d.id === donorId);
  if (!donor || donor.is_anonymous) return "Anonymous";
  return `${donor.first_name} ${donor.last_name}`;
};

export const getUserById = (userId: number) => {
  return mockUsers.find(u => u.id === userId);
};

export const getUserFullName = (userId: number) => {
  const user = mockUsers.find(u => u.id === userId);
  if (!user) return "Unknown User";
  return `${user.first_name} ${user.last_name}`;
};

export const getUserRole = (userId: number) => {
  const user = mockUsers.find(u => u.id === userId);
  if (!user) return null;
  return mockUserRoles.find(r => r.id === user.role_id);
};

export const getAddressById = (addressId: number) => {
  return mockAddresses.find(a => a.id === addressId);
};

export const formatAddress = (addressId: number | null) => {
  if (!addressId) return "No address";
  const address = mockAddresses.find(a => a.id === addressId);
  if (!address) return "Unknown location";
  return `${address.city}, ${address.country}`;
};

export const getTeamById = (teamId: number) => {
  return mockTeams.find(t => t.id === teamId);
};

export const getProjectById = (projectId: number) => {
  return mockProjects.find(p => p.id === projectId);
};

export const getProjectProgress = (projectId: number) => {
  return mockProjectProgress.find(p => p.project_id === projectId);
};

export const getEventById = (eventId: number) => {
  return mockEvents.find(e => e.id === eventId);
};

export const getVolunteerById = (volunteerId: number) => {
  return mockVolunteers.find(v => v.id === volunteerId);
};

export const getVolunteerByUserId = (userId: number) => {
  return mockVolunteers.find(v => v.user_id === userId);
};

export const getVolunteerStats = (volunteerId: number) => {
  return mockVolunteerStatistics.find(s => s.volunteer_id === volunteerId);
};

export const getPaymentMethodById = (methodId: number) => {
  return mockPaymentMethods.find(m => m.id === methodId);
};

export const getDonationStatusById = (statusId: number) => {
  return mockDonationStatuses.find(s => s.id === statusId);
};

export const getBlogPostById = (postId: number) => {
  return mockBlogPosts.find(p => p.id === postId);
};

export const getNotificationTypeById = (typeId: number) => {
  return mockNotificationTypes.find(t => t.id === typeId);
};

// =============================================================================
// STATISTICAL HELPER FUNCTIONS
// =============================================================================

export const calculateCampaignProgress = (campaignId: number) => {
  const campaign = getCampaignById(campaignId);
  const stats = getCampaignStats(campaignId);
  if (!campaign || !stats) return 0;
  return (stats.current_amount / campaign.goal_amount) * 100;
};

export const getTotalDonationAmount = () => {
  return mockDonations
    .filter(d => d.status_id === 3) // Only completed donations
    .reduce((sum, d) => sum + d.amount, 0);
};

export const getTotalNetDonationAmount = () => {
  return mockDonations
    .filter(d => d.status_id === 3 && d.net_amount)
    .reduce((sum, d) => sum + (d.net_amount || 0), 0);
};

export const getUniqueDonorCount = () => {
  return new Set(mockDonations.map(d => d.donor_id)).size;
};

export const getActiveCampaignCount = () => {
  return mockCampaigns.filter(c => c.status_id === 2).length;
};

export const getActiveVolunteerCount = () => {
  return mockVolunteers.filter(v => v.status_id === 1).length;
};

export const getTotalVolunteerHours = () => {
  return mockVolunteerStatistics.reduce((sum, s) => sum + parseFloat(s.total_hours.toString()), 0);
};

export const getUpcomingEventsCount = () => {
  const now = new Date();
  return mockEvents.filter(e => e.status_id === 1 && e.event_date > now).length;
};

export const getActiveProjectsCount = () => {
  return mockProjects.filter(p => p.status_id === 2).length;
};

export const getDonationsByDateRange = (startDate: Date, endDate: Date) => {
  return mockDonations.filter(d => 
    d.donation_date >= startDate && 
    d.donation_date <= endDate &&
    d.status_id === 3
  );
};

export const getTopDonors = (limit: number = 5) => {
  const donorTotals = mockDonations
    .filter(d => d.status_id === 3)
    .reduce((acc, donation) => {
      if (!acc[donation.donor_id]) {
        acc[donation.donor_id] = {
          donor_id: donation.donor_id,
          total: 0,
          count: 0
        };
      }
      acc[donation.donor_id].total += donation.amount;
      acc[donation.donor_id].count += 1;
      return acc;
    }, {} as Record<number, { donor_id: number; total: number; count: number }>);

  return Object.values(donorTotals)
    .sort((a, b) => b.total - a.total)
    .slice(0, limit)
    .map(dt => ({
      ...dt,
      donor: getDonorById(dt.donor_id),
      name: getDonorName(dt.donor_id)
    }));
};

export const getTopVolunteers = (limit: number = 5) => {
  return mockVolunteerStatistics
    .sort((a, b) => parseFloat(b.total_hours.toString()) - parseFloat(a.total_hours.toString()))
    .slice(0, limit)
    .map(stat => ({
      ...stat,
      volunteer: getVolunteerById(stat.volunteer_id),
      user: getUserById(getVolunteerById(stat.volunteer_id)?.user_id || 0)
    }));
};

export const getCampaignsByCategory = () => {
  const categoryGroups = mockCampaigns
    .filter(c => c.status_id === 2) // Active campaigns
    .reduce((acc, campaign) => {
      const categoryName = getCategoryName(campaign.category_id);
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(campaign);
      return acc;
    }, {} as Record<string, typeof mockCampaigns>);

  return Object.entries(categoryGroups).map(([category, campaigns]) => ({
    category,
    campaigns,
    count: campaigns.length,
    totalGoal: campaigns.reduce((sum, c) => sum + c.goal_amount, 0),
    totalRaised: campaigns.reduce((sum, c) => {
      const stats = getCampaignStats(c.id);
      return sum + (stats?.current_amount || 0);
    }, 0)
  }));
};

export const getRecentActivities = (limit: number = 10) => {
  const activities = [
    ...mockDonations.map(d => ({
      type: 'donation' as const,
      date: d.donation_date,
      data: d
    })),
    ...mockVolunteerActivities.map(a => ({
      type: 'volunteer_activity' as const,
      date: a.activity_date,
      data: a
    })),
    ...mockEventRegistrations.map(r => ({
      type: 'event_registration' as const,
      date: r.registration_date,
      data: r
    })),
    ...mockBlogPosts.filter(p => p.published_at).map(p => ({
      type: 'blog_post' as const,
      date: p.published_at!,
      data: p
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime())
  .slice(0, limit);

  return activities;
};

export const getUnreadNotificationCount = (userId: number) => {
  return mockNotifications.filter(n => n.user_id === userId && !n.is_read).length;
};

export const getUserNotifications = (userId: number, limit?: number) => {
  const notifications = mockNotifications
    .filter(n => n.user_id === userId)
    .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  
  return limit ? notifications.slice(0, limit) : notifications;
};

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

export const canUserEditCampaign = (userId: number, campaignId: number): boolean => {
  const campaign = getCampaignById(campaignId);
  const user = getUserById(userId);
  if (!campaign || !user) return false;
  
  const role = getUserRole(userId);
  return role?.name === "Admin" || campaign.created_by === userId;
};

export const canUserManageTeam = (userId: number, teamId: number): boolean => {
  const team = getTeamById(teamId);
  const user = getUserById(userId);
  if (!team || !user) return false;
  
  const role = getUserRole(userId);
  return role?.name === "Admin" || team.team_leader_id === userId;
};

export const isVolunteerActive = (volunteerId: number): boolean => {
  const volunteer = getVolunteerById(volunteerId);
  return volunteer?.status_id === 1;
};

export const isCampaignActive = (campaignId: number): boolean => {
  const campaign = getCampaignById(campaignId);
  if (!campaign) return false;
  
  const now = new Date();
  return campaign.status_id === 2 && 
         campaign.start_date <= now && 
         (!campaign.end_date || campaign.end_date >= now);
};

export const canRegisterForEvent = (eventId: number, userId: number): boolean => {
  const event = getEventById(eventId);
  if (!event) return false;
  
  const now = new Date();
  const isBeforeDeadline = !event.registration_deadline || event.registration_deadline >= now;
  const isNotFull = mockEventRegistrations.filter(r => r.event_id === eventId).length < event.capacity;
  const notAlreadyRegistered = !mockEventRegistrations.some(r => r.event_id === eventId && r.user_id === userId);
  
  return event.status_id === 1 && isBeforeDeadline && isNotFull && notAlreadyRegistered;
};

// =============================================================================
// EXPORT ALL DATA
// =============================================================================

export const allMockData = {
  categories: mockCategories,
  userRoles: mockUserRoles,
  userStatuses: mockUserStatuses,
  projectStatuses: mockProjectStatuses,
  campaignStatuses: mockCampaignStatuses,
  urgencyLevels: mockUrgencyLevels,
  currencies: mockCurrencies,
  addresses: mockAddresses,
  users: mockUsers,
  paymentMethods: mockPaymentMethods,
  donationStatuses: mockDonationStatuses,
  recurringFrequencies: mockRecurringFrequencies,
  campaigns: mockCampaigns,
  campaignStatistics: mockCampaignStatistics,
  donors: mockDonors,
  donations: mockDonations,
  teams: mockTeams,
  teamMembers: mockTeamMembers,
  projects: mockProjects,
  projectProgress: mockProjectProgress,
  eventStatuses: mockEventStatuses,
  events: mockEvents,
  registrationStatuses: mockRegistrationStatuses,
  paymentStatuses: mockPaymentStatuses,
  eventRegistrations: mockEventRegistrations,
  emergencyContacts: mockEmergencyContacts,
  volunteerSkills: mockVolunteerSkills,
  backgroundCheckStatuses: mockBackgroundCheckStatuses,
  volunteerStatuses: mockVolunteerStatuses,
  volunteers: mockVolunteers,
  volunteerSkillAssignments: mockVolunteerSkillAssignments,
  volunteerStatistics: mockVolunteerStatistics,
  activityTypes: mockActivityTypes,
  volunteerActivities: mockVolunteerActivities,
  blogPostStatuses: mockBlogPostStatuses,
  blogPosts: mockBlogPosts,
  teamCommunications: mockTeamCommunications,
  teamPolls: mockTeamPolls,
  teamPollOptions: mockTeamPollOptions,
  teamPollVotes: mockTeamPollVotes,
  notificationTypes: mockNotificationTypes,
  deliveryMethods: mockDeliveryMethods,
  notifications: mockNotifications,
  settingCategories: mockSettingCategories,
  settingDataTypes: mockSettingDataTypes,
  settings: mockSettings,
  entityTypes: mockEntityTypes,
  auditActions: mockAuditActions,
  auditLogs: mockAuditLogs,
  dashboardSummary: mockDashboardSummary,
};

export default allMockData;