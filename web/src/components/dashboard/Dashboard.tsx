import React, { useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, TrendingDown, Users, DollarSign, Heart, Calendar, 
  Target, Plus,
  UserPlus, FileText,
  Briefcase, MapPin, ChevronRight, Bell
} from 'lucide-react';
import { trpc } from '@/app/_trpc/client';
import { formatDate, formatDateTime } from '../../lib/dateUtils';
import './Dashboard.css';

// Type definitions
interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  color: string;
  subtitle?: string;
}

interface QuickActionCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  onClick?: () => void;
  href?: string;
  color: string;
}

interface ModalProps {
  type: string;
  onClose: () => void;
}

// Dashboard data types
interface DashboardProject {
  id: number;
  title: string;
  description: string;
  status: string;
  teamName: string | null;
  creator: string | null;
  startDate: string;
  endDate: string | null;
}

interface DashboardEvent {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  capacity: number;
  registrationsCount: number;
  availableSpots: number;
  imageUrl: string | null;
  status: string;
  category: string;
}

interface DashboardBlogPost {
  id: number;
  title: string;
  excerpt: string | null;
  featuredImage: string | null;
  author: {
    name: string;
    imageUrl: string | null;
  } | null;
  category: string;
  publishedAt: string | null;
}

interface DashboardNotification {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  const utils = trpc.useContext();

  // Fetch dashboard stats from database
  const { data: dashboardStats, isLoading: statsLoading } = trpc.dashboard.getStats.useQuery();
  
  // Fetch active campaigns
  const { data: activeCampaigns, isLoading: campaignsLoading } = trpc.campaigns.getActive.useQuery();

  // Fetch recent donations
  const { data: recentDonations, isLoading: donationsLoading } = trpc.donations.getRecent.useQuery();

  // Fetch active projects
  const { data: activeProjects } = trpc.dashboard.getActiveProjects.useQuery();

  // Fetch upcoming events
  const { data: upcomingEvents } = trpc.dashboard.getUpcomingEvents.useQuery();

  // Fetch recent blog posts
  const { data: recentBlogPosts } = trpc.dashboard.getRecentBlogPosts.useQuery();

  // Fetch notifications
  const { data: notifications } = trpc.dashboard.getNotifications.useQuery();

  // Mutations
  const createCampaign = trpc.campaigns.create.useMutation({
    onSuccess: () => {
      utils.dashboard.getStats.invalidate();
      utils.campaigns.getActive.invalidate();
    }
  });
  const createDonation = trpc.donations.create.useMutation({
    onSuccess: () => {
      utils.dashboard.getStats.invalidate();
      utils.donations.getRecent.invalidate();
      utils.campaigns.getActive.invalidate(); // In case campaign raised amount changed
    }
  });
  const createVolunteer = trpc.volunteers.create.useMutation({
    onSuccess: () => {
      utils.dashboard.getStats.invalidate();
    }
  });
  const createEvent = trpc.events.create.useMutation({
    onSuccess: () => {
      utils.dashboard.getStats.invalidate();
      utils.dashboard.getUpcomingEvents.invalidate();
    }
  });
  const createTeam = trpc.teams.create.useMutation({
    onSuccess: () => {
      utils.teams.getAll.invalidate();
    }
  });

  const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, change, trend, color, subtitle }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className={`flex items-center space-x-1 text-sm font-medium ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{change}</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  const QuickActionCard: React.FC<QuickActionCardProps> = ({ icon: Icon, title, description, onClick, href, color }) => {
    const content = (
      <>
        <div className={`p-3 rounded-lg ${color} w-fit mb-4 group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="mt-3 flex items-center text-sm text-rose-600">
          <span>Get started</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-lg hover:scale-105 transition-all text-left w-full group block"
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        onClick={onClick}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-lg hover:scale-105 transition-all text-left w-full group"
      >
        {content}
      </button>
    );
  };

  // Modal functionality for future use (e.g., quick create forms)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const openModal = (type: string) => {
    setModalType(type);
    setShowModal(true);
  };

  const Modal: React.FC<ModalProps> = ({ type, onClose }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [formData, setFormData] = useState<Record<string, any>>({});

    if (!showModal) return null;

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      try {
        if (type === 'campaign') {
          await createCampaign.mutateAsync({
            title: formData.title,
            description: formData.description,
            goalAmount: parseFloat(formData.goal_amount),
            currencyId: parseInt(formData.currency_id) || 1,
            startDate: new Date(formData.start_date),
            endDate: formData.end_date ? new Date(formData.end_date) : undefined,
            imageUrl: formData.image_url,
            categoryId: parseInt(formData.category_id),
            urgencyLevelId: parseInt(formData.urgency_level_id) || 3,
            targetBeneficiaries: formData.target_beneficiaries ? parseInt(formData.target_beneficiaries) : undefined
          });
          alert('Campaign created successfully!');
        } else if (type === 'donation') {
          // For donations, we need to handle donor creation or lookup
          // For now, assume donor exists or create a simple one
          await createDonation.mutateAsync({
            amount: parseFloat(formData.amount),
            donorId: 1, // This should be looked up or created
            campaignId: parseInt(formData.campaign_id),
            currencyId: parseInt(formData.currency_id) || 1,
            paymentMethodId: parseInt(formData.payment_method_id),
            paymentReference: formData.payment_reference,
            notes: formData.notes,
            isAnonymous: formData.is_anonymous || false
          });
          alert('Donation recorded successfully!');
        } else if (type === 'volunteer') {
          await createVolunteer.mutateAsync({
            userId: 1, // This should be the current user
            availability: formData.availability,
            skillIds: formData.skills || [],
            emergencyContactName: formData.emergency_contact_name,
            emergencyContactPhone: formData.emergency_contact_phone,
            emergencyContactEmail: formData.emergency_contact_email,
            emergencyContactRelationship: formData.emergency_contact_relationship
          });
          alert('Volunteer added successfully!');
        } else if (type === 'event') {
          await createEvent.mutateAsync({
            title: formData.title,
            description: formData.description,
            eventDate: new Date(formData.event_date),
            capacity: parseInt(formData.capacity),
            ticketPrice: parseFloat(formData.ticket_price || '0'),
            currencyId: parseInt(formData.currency_id) || 1,
            categoryId: parseInt(formData.category_id) || 8,
            imageUrl: formData.image_url,
            registrationDeadline: formData.registration_deadline ? new Date(formData.registration_deadline) : undefined
          });
          alert('Event created successfully!');
        } else if (type === 'team') {
          await createTeam.mutateAsync({
            name: formData.name,
            description: formData.description,
            categoryId: parseInt(formData.category_id),
            teamLeaderId: formData.team_leader_id ? parseInt(formData.team_leader_id) : undefined,
            maxMembers: formData.max_members ? parseInt(formData.max_members) : undefined
          });
          alert('Team created successfully!');
        }
        
        onClose();
        setFormData({});
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred. Please try again.');
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const renderCampaignForm = () => (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Title *</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter campaign title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
          <textarea
            name="description"
            required
            value={formData.description || ''}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe your campaign..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Goal Amount *</label>
            <input
              type="number"
              name="goal_amount"
              required
              min="0"
              step="0.01"
              value={formData.goal_amount || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select
              name="currency_id"
              value={formData.currency_id || '1'}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Select currency"
            >
              <option value="1">USD ($)</option>
              <option value="2">KES (KSh)</option>
              <option value="3">EUR (€)</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select
              name="category_id"
              required
              value={formData.category_id || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Select category"
            >
              <option value="">Select category</option>
              <option value="1">Education</option>
              <option value="2">Healthcare</option>
              <option value="3">Food & Nutrition</option>
              <option value="4">Emergency Relief</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
            <select
              name="urgency_level_id"
              value={formData.urgency_level_id || '3'}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Select urgency level"
            >
              <option value="1">Critical</option>
              <option value="2">High</option>
              <option value="3">Medium</option>
              <option value="4">Low</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
            <input
              type="date"
              name="start_date"
              required
              value={formData.start_date || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Campaign start date"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Campaign end date"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Target Beneficiaries</label>
          <input
            type="number"
            name="target_beneficiaries"
            min="0"
            value={formData.target_beneficiaries || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Number of people to help"
            aria-label="Target beneficiaries"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
          <input
            type="url"
            name="image_url"
            value={formData.image_url || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/image.jpg"
            aria-label="Campaign image URL"
          />
        </div>
      </>
    );

    const renderDonationForm = () => (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Donor Name</label>
          <input
            type="text"
            name="donor_name"
            value={formData.donor_name || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Leave empty for anonymous donation"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email (for receipt)</label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="donor@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Campaign *</label>
          <select
            name="campaign_id"
            required
            value={formData.campaign_id || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            aria-label="Select campaign"
          >
            <option value="">Select campaign</option>
            {activeCampaigns ? activeCampaigns.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            )) : []}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
            <input
              type="number"
              name="amount"
              required
              min="0.01"
              step="0.01"
              value={formData.amount || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
            <select
              name="payment_method_id"
              required
              value={formData.payment_method_id || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              aria-label="Select payment method"
            >
              <option value="">Select method</option>
              <option value="1">Credit Card</option>
              <option value="2">M-Pesa</option>
              <option value="3">Bank Transfer</option>
              <option value="4">PayPal</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Reference</label>
          <input
            type="text"
            name="payment_reference"
            value={formData.payment_reference || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Transaction ID or reference number"
            aria-label="Payment reference"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <textarea
            name="notes"
            value={formData.notes || ''}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Any additional notes..."
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="is_anonymous"
            checked={formData.is_anonymous || false}
            onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked })}
            className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            id="is_anonymous"
            aria-label="Make donation anonymous"
          />
          <label htmlFor="is_anonymous" className="ml-2 text-sm text-gray-700">
            Make this donation anonymous
          </label>
        </div>
      </>
    );

    const renderVolunteerForm = () => (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
            <input
              type="text"
              name="first_name"
              required
              value={formData.first_name || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="First name"
              aria-label="Volunteer first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
            <input
              type="text"
              name="last_name"
              required
              value={formData.last_name || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Last name"
              aria-label="Volunteer last name"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="volunteer@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="+1234567890"
            aria-label="Volunteer phone number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
          <textarea
            name="availability"
            value={formData.availability || ''}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="e.g., Weekends, evenings, flexible"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
          <select
            name="skills"
            multiple
            value={formData.skills || []}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, option => option.value);
              setFormData({ ...formData, skills: values });
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            size={4}
            aria-label="Select skills"
          >
            <option value="1">First Aid</option>
            <option value="2">Teaching</option>
            <option value="3">Event Planning</option>
            <option value="4">Construction</option>
            <option value="5">Translation</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name</label>
          <input
            type="text"
            name="emergency_contact_name"
            value={formData.emergency_contact_name || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            aria-label="Emergency contact name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Phone</label>
          <input
            type="tel"
            name="emergency_contact_phone"
            value={formData.emergency_contact_phone || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            aria-label="Emergency contact phone"
          />
        </div>
      </>
    );

    const renderEventForm = () => (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Enter event title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
          <textarea
            name="description"
            required
            value={formData.description || ''}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Describe your event..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Date *</label>
            <input
              type="date"
              name="event_date"
              required
              value={formData.event_date || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              aria-label="Event date"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Time *</label>
            <input
              type="time"
              name="event_time"
              required
              value={formData.event_time || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              aria-label="Event time"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Capacity *</label>
            <input
              type="number"
              name="capacity"
              required
              min="1"
              value={formData.capacity || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Max attendees"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ticket Price</label>
            <input
              type="number"
              name="ticket_price"
              min="0"
              step="0.01"
              value={formData.ticket_price || '0'}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="0.00 for free"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Event venue or 'Online'"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Registration Deadline</label>
          <input
            type="date"
            name="registration_deadline"
            value={formData.registration_deadline || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            aria-label="Event registration deadline"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            name="category_id"
            value={formData.category_id || '8'}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            aria-label="Select event category"
          >
            <option value="8">Community Event</option>
          </select>
        </div>
      </>
    );

    const renderTeamForm = () => (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Team Name *</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Enter team name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Describe the team's purpose..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
          <select
            name="status"
            required
            value={formData.status || 'active'}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            aria-label="Select team status"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </>
    );

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
            <h2 className="text-xl font-bold text-gray-900">
              {type === 'campaign' && '🎯 Create New Campaign'}
              {type === 'donation' && '💰 Record Donation'}
              {type === 'volunteer' && '👥 Add Volunteer'}
              {type === 'event' && '📅 Create Event'}
              {type === 'team' && '👥 Create New Team'}
            </h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              type="button"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
          
          <form className="p-6 space-y-4" onSubmit={handleSubmit}>
            {type === 'campaign' && renderCampaignForm()}
            {type === 'donation' && renderDonationForm()}
            {type === 'volunteer' && renderVolunteerForm()}
            {type === 'event' && renderEventForm()}
            {type === 'team' && renderTeamForm()}
            
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <button 
                type="submit" 
                className={`flex-1 text-white py-3 rounded-lg font-medium transition-colors ${
                  type === 'campaign' ? 'bg-rose-500 hover:bg-rose-600' :
                  type === 'donation' ? 'bg-green-600 hover:bg-green-700' :
                  type === 'volunteer' ? 'bg-gray-600 hover:bg-gray-700' :
                  'bg-rose-400 hover:bg-rose-500'
                }`}
              >
                {type === 'campaign' && 'Create Campaign'}
                {type === 'donation' && 'Record Donation'}
                {type === 'volunteer' && 'Add Volunteer'}
                {type === 'event' && 'Create Event'}
                {type === 'team' && 'Create Team'}
              </button>
              <button 
                type="button" 
                onClick={onClose} 
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <>
          {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard 
                icon={DollarSign} 
                label="Total Donations" 
                value={statsLoading ? "..." : `$${dashboardStats?.totalDonations?.toFixed(2) || "0.00"}`}
                change="+12.5%"
                trend="up"
                color="bg-gradient-to-br from-rose-500 to-rose-600"
                subtitle="All time"
              />
              <StatCard 
                icon={Users} 
                label="Total Volunteers" 
                value={statsLoading ? "..." : (dashboardStats?.totalVolunteers || 0).toString()}
                change="+8.2%"
                trend="up"
                color="bg-gradient-to-br from-gray-700 to-gray-800"
                subtitle="Total registered"
              />
              <StatCard 
                icon={Heart} 
                label="Active Campaigns" 
                value={statsLoading ? "..." : (dashboardStats?.activeCampaigns || 0).toString()}
                color="bg-gradient-to-br from-rose-400 to-rose-500"
                subtitle="Currently running"
              />
              <StatCard 
                icon={Calendar} 
                label="Upcoming Events" 
                value={statsLoading ? "..." : (dashboardStats?.upcomingEvents || 0).toString()}
                change="+15.3%"
                trend="up"
                color="bg-gradient-to-br from-gray-600 to-gray-700"
                subtitle="This month"
              />
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Target className="w-6 h-6 mr-2 text-rose-600" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <QuickActionCard
                  icon={Plus}
                  title="New Campaign"
                  description="Start a new fundraising campaign"
                  href="/campaigns"
                  color="bg-gradient-to-br from-rose-500 to-rose-600"
                />
                <QuickActionCard
                  icon={DollarSign}
                  title="Record Donation"
                  description="Log a new donation"
                  href="/donations"
                  color="bg-gradient-to-br from-green-500 to-green-600"
                />
                <QuickActionCard
                  icon={UserPlus}
                  title="Add Volunteer"
                  description="Register a new volunteer"
                  href="/volunteers"
                  color="bg-gradient-to-br from-gray-600 to-gray-700"
                />
                <QuickActionCard
                  icon={Calendar}
                  title="Create Event"
                  description="Schedule a new event"
                  href="/events"
                  color="bg-gradient-to-br from-rose-400 to-rose-500"
                />
              </div>
            </div>

            {/* Campaign Progress & Recent Donations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Active Campaigns */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-500" />
                    Active Campaigns
                  </h2>
                  <Link href="/campaigns" className="text-rose-600 text-sm hover:underline font-medium">
                    View All →
                  </Link>
                </div>
                <div className="space-y-4">
                  {campaignsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto"></div>
                      <p className="text-gray-500 mt-2">Loading campaigns...</p>
                    </div>
                  ) : activeCampaigns && activeCampaigns.length > 0 ? (
                    activeCampaigns.slice(0, 3).map(campaign => (
                      <div key={campaign.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{campaign.title}</h3>
                            <p className="text-sm text-gray-600">Education</p>
                          </div>
                          <span className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700 font-medium">
                            Active
                          </span>
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600">${campaign.raised.toFixed(2)} raised</span>
                            <span className="font-bold text-rose-600">{campaign.progressPercentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="progress-bar-campaign"
                              ref={(el) => {
                                if (el) {
                                  el.style.width = `${Math.min(campaign.progressPercentage, 100)}%`;
                                }
                              }}
                              role="progressbar"
                              aria-valuenow={Math.min(campaign.progressPercentage, 100)}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            ></div>
                          </div>
                        </div>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>Goal: ${campaign.goal.toFixed(2)}</span>
                          <span>{campaign.donationsCount} donations</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No active campaigns</p>
                      <Link href="/campaigns" className="text-rose-600 hover:underline text-sm mt-2 inline-block">
                        Create your first campaign →
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Donations */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                    Recent Donations
                  </h2>
                  <Link href="/donations" className="text-rose-600 text-sm hover:underline font-medium">
                    View All →
                  </Link>
                </div>
                <div className="space-y-3">
                  {donationsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                      <p className="text-gray-500 mt-2">Loading donations...</p>
                    </div>
                  ) : recentDonations && recentDonations.length > 0 ? (
                    recentDonations.slice(0, 5).map(donation => (
                      <div key={donation.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 rounded-lg transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-md">
                            <DollarSign className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{donation.donorName}</p>
                            <p className="text-sm text-gray-600">{donation.campaignTitle}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${donation.amount.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">{formatDate(donation.donationDate)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No recent donations</p>
                      <Link href="/donations" className="text-rose-600 hover:underline text-sm mt-2 inline-block">
                        Record a donation →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Projects & Events Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Active Projects */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-purple-500" />
                    Active Projects
                  </h2>
                  <Link href="/projects" className="text-rose-600 text-sm hover:underline font-medium">
                    Manage →
                  </Link>
                </div>
                <div className="space-y-4">
                  {activeProjects && activeProjects.length > 0 ? (
                    activeProjects.map((project: DashboardProject) => (
                      <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{project.title}</h3>
                            <p className="text-sm text-gray-600">{project.teamName || 'No team assigned'}</p>
                          </div>
                          <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                            {project.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500">Due: {project.endDate ? formatDate(project.endDate) : 'No deadline'}</span>
                          <span className="text-gray-600">{project.creator || 'Unknown'}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No active projects</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-orange-500" />
                    Upcoming Events
                  </h2>
                  <Link href="/events" className="text-rose-600 text-sm hover:underline font-medium">
                    Calendar →
                  </Link>
                </div>
                <div className="space-y-4">
                  {upcomingEvents && upcomingEvents.length > 0 ? (
                    upcomingEvents.slice(0, 2).map((event: DashboardEvent) => {
                      const eventDate = new Date(event.eventDate);
                      return (
                        <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start space-x-4">
                            <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-xl p-3 text-white text-center min-w-[70px] shadow-md">
                              <p className="text-2xl font-bold">{eventDate.getDate()}</p>
                              <p className="text-xs">{eventDate.toLocaleDateString('en-US', { month: 'short' })}</p>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                              <p className="text-sm text-gray-600 mb-2">
                                <MapPin className="w-3 h-3 inline mr-1" />
                                {event.category}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                  Spots: {event.availableSpots}/{event.capacity}
                                </span>
                                <Link href="/events" className="text-xs text-rose-600 hover:underline font-medium">
                                  View Details →
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No upcoming events</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Latest Blog Posts & Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Latest Blog Posts */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-500" />
                    Latest Updates
                  </h2>
                  <Link href="/reports" className="text-rose-600 text-sm hover:underline font-medium">
                    View All →
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentBlogPosts && recentBlogPosts.length > 0 ? (
                    recentBlogPosts.slice(0, 3).map((post: DashboardBlogPost) => (
                      <div key={post.id} className="border-b border-gray-100 pb-4 last:border-0">
                        <h3 className="font-semibold text-gray-900 mb-1 hover:text-blue-600 cursor-pointer">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>By {post.author?.name || 'Unknown'}</span>
                          <span>{post.publishedAt ? formatDate(post.publishedAt) : ''}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No blog posts yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-red-500" />
                    Recent Notifications
                  </h2>
                  <Link href="/dashboard" className="text-rose-600 text-sm hover:underline font-medium">
                    View All →
                  </Link>
                </div>
                <div className="space-y-3">
                  {notifications && notifications.length > 0 ? (
                    notifications.slice(0, 4).map((notification: DashboardNotification) => (
                      <div key={notification.id} className={`flex items-start space-x-3 p-3 rounded-lg ${
                        notification.isRead ? 'bg-gray-50' : 'bg-blue-50'
                      }`}>
                        <div className={`p-2 rounded-full ${
                          notification.isRead ? 'bg-gray-200' : 'bg-blue-500'
                        }`}>
                          <Bell className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDateTime(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No notifications</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
      </main>

      <Modal type={modalType} onClose={() => setShowModal(false)} />
    </div>
  );
}