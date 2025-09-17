# Backend Requirements Specification

## Overview

This document outlines the technical and functional requirements for the Wamumbi Charity Management System backend. The system is designed to support a comprehensive charity platform with user management, donation processing, campaign management, volunteer coordination, and event organization.

## Table of Contents

- [User Authentication System](#user-authentication-system)
- [Donation Management System](#donation-management-system)
- [Campaign Management System](#campaign-management-system)
- [Volunteer Management System](#volunteer-management-system)
- [Event Management System](#event-management-system)
- [Notification System](#notification-system)
- [Cross-Cutting Requirements](#cross-cutting-requirements)

---

## User Authentication System

### Functional Requirements

#### FR-AUTH-001: User Registration

**Description**: System shall allow new users to register with email and password or social login.

**API Endpoint**: `POST /api/auth/register`

**Input Specifications**:

```json
{
  "email": "string (required, valid email format)",
  "password": "string (required, min 8 chars, complexity rules)",
  "first_name": "string (optional, max 100 chars)",
  "last_name": "string (optional, max 100 chars)",
  "phone": "string (optional, max 20 chars)",
  "profile_image": "string (optional, valid URL)",
  "address": {
    "street_line_1": "string (optional)",
    "street_line_2": "string (optional)",
    "city": "string (optional)",
    "state": "string (optional)",
    "postal_code": "string (optional)",
    "country": "string (optional)"
  },
  "role_id": "integer (required, valid user_roles.id)",
  "two_factor_enabled": "boolean (optional, default: false)"
}
```

**Output Specifications**:

```json
{
  "success": true,
  "data": {
    "id": "integer",
    "email": "string",
    "first_name": "string",
    "last_name": "string",
    "role": {
      "id": "integer",
      "name": "string",
      "permissions": "json"
    },
    "status": {
      "id": "integer",
      "name": "string"
    },
    "email_verified": false,
    "phone_verified": false,
    "two_factor_enabled": false,
    "created_at": "timestamp",
    "last_login": null
  },
  "message": "Registration successful. Please verify your email."
}
```

**Validation Rules**:

- Email must be unique across the system
- Password must contain at least 8 characters with uppercase, lowercase, number, and special character
- Phone number must follow international format (if provided) and be maximum 20 characters
- First name and last name must be maximum 100 characters each (if provided)
- Profile image URL must be valid and accessible (if provided)
- Role ID must reference an existing and active role in user_roles table
- Address fields must follow length restrictions from addresses table (if provided)
- Two-factor authentication setup requires additional verification steps if enabled

**Performance Criteria**:

- Response time: < 500ms
- Concurrent registrations: 100 per second
- Email verification sent within 30 seconds

#### FR-AUTH-002: User Login

**Description**: System shall authenticate users with email/password or social login.

**API Endpoint**: `POST /api/auth/login`

**Input Specifications**:

```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Output Specifications**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "role": "string",
      "status": "string"
    },
    "sessionToken": "string",
    "expiresAt": "ISO8601 datetime"
  }
}
```

**Validation Rules**:

- Account must be verified and active
- Maximum 5 failed login attempts before 15-minute lockout
- Session token expires after 24 hours of inactivity

**Performance Criteria**:

- Response time: < 300ms
- Concurrent logins: 200 per second
- Session creation: < 100ms

#### FR-AUTH-003: Role-Based Access Control

**Description**: System shall enforce role-based permissions for all protected resources.

**Roles and Permissions**:

- **Admin**: Full system access, user management, system configuration
- **Team Leader**: Team management, project oversight, volunteer coordination
- **Volunteer**: Profile management, activity logging, team participation
- **Donor**: Donation management, campaign viewing, donation history

**API Endpoint**: `GET /api/auth/permissions`

**Performance Criteria**:

- Permission check: < 50ms
- Role validation cache TTL: 15 minutes

---

## Donation Management System

### Donation Functional Requirements

#### FR-DON-001: Process Donation

**Description**: System shall process secure donations with multiple payment methods.

**API Endpoint**: `POST /api/donations`

**Input Specifications**:

```json
{
  "campaign_id": "integer (required)",
  "amount": "decimal (required, precision: 10,2)",
  "currency_id": "integer (required, reference to currencies.id)",
  "payment_method_id": "integer (required, reference to payment_methods.id)",
  "is_recurring": "boolean (optional, default: false)",
  "recurring_frequency_id": "integer (required if is_recurring, reference to recurring_frequencies.id)",
  "parent_donation_id": "integer (optional, for recurring donations)",
  "notes": "string (optional)",
  "donor": {
    "user_id": "integer (optional)",
    "first_name": "string (optional)",
    "last_name": "string (optional)",
    "email": "string (optional)",
    "phone": "string (optional, max: 20 chars)",
    "is_anonymous": "boolean (default: true)",
    "address": {
      "street_line_1": "string (optional)",
      "street_line_2": "string (optional)",
      "city": "string (optional)",
      "state": "string (optional)",
      "postal_code": "string (optional)",
      "country": "string (optional)",
      "latitude": "decimal (optional, precision: 10,8)",
      "longitude": "decimal (optional, precision: 11,8)"
    }
  }
}
```

**Output Specifications**:

```json
{
  "success": true,
  "data": {
    "id": "integer",
    "donor": {
      "id": "integer",
      "is_anonymous": "boolean"
    },
    "campaign_id": "integer",
    "amount": "decimal",
    "currency": {
      "id": "integer",
      "code": "string",
      "symbol": "string"
    },
    "payment_method": {
      "id": "integer",
      "name": "string"
    },
    "payment_reference": "string",
    "status": {
      "id": "integer",
      "name": "string"
    },
    "is_recurring": "boolean",
    "recurring_frequency": {
      "id": "integer",
      "name": "string",
      "days_interval": "integer"
    },
    "processing_fee": "decimal",
    "net_amount": "decimal",
    "donation_date": "timestamp",
    "processed_at": "timestamp"
  }
}
```

**Validation Rules**:

- Amount must be a valid decimal with precision (10,2)
- Campaign must exist and be in an active status
- Currency must exist in currencies table and be supported by the payment method
- Payment method must be active and available for use
- Recurring frequency must exist and be active (if donation is recurring)
- Parent donation must exist and be valid (if specified for recurring)
- Processing fee and net amount are calculated based on payment method fees
- Phone numbers must follow the specified format and length (if provided)
- Address fields must follow length restrictions from addresses table (if provided)
- Geographic coordinates must be valid and within precision limits (if provided)

**Performance Criteria**:

- Payment processing: < 3 seconds
- Campaign statistics update: Real-time
- Transaction logging: < 500ms
- Concurrent donations: 50 per second
- Audit log entry creation: < 100ms

#### FR-DON-002: Recurring Donation Management

**Description**: System shall manage automated recurring donations with flexible scheduling.

**API Endpoint**: `POST /api/donations/recurring`

**Input Specifications**:

```json
{
  "originalDonationId": "integer (required)",
  "frequency": "enum (weekly, monthly, quarterly, annually) (required)",
  "endDate": "ISO8601 date (optional)",
  "maxOccurrences": "integer (optional)",
  "amount": "decimal (optional, inherits from original)"
}
```

**Performance Criteria**:

- Recurring setup: < 1 second
- Scheduled processing: 99.9% reliability
- Failure retry: 3 attempts over 48 hours

#### FR-DON-003: Donation Analytics

**Description**: System shall provide real-time donation analytics and reporting.

**API Endpoint**: `GET /api/donations/analytics`

**Query Parameters**:

- `period`: enum (day, week, month, quarter, year)
- `campaignId`: integer (optional)
- `startDate`: ISO8601 date (optional)
- `endDate`: ISO8601 date (optional)

**Output Specifications**:

```json
{
  "success": true,
  "data": {
    "totalAmount": "decimal",
    "totalDonations": "integer",
    "averageDonation": "decimal",
    "uniqueDonors": "integer",
    "recurringDonors": "integer",
    "topCampaigns": "array",
    "donationTrends": "array",
    "geographicBreakdown": "object"
  }
}
```

**Performance Criteria**:

- Analytics query: < 2 seconds
- Real-time updates: < 30 seconds lag
- Data aggregation: Hourly for reports

---

## Campaign Management System

### Campaign Functional Requirements

#### FR-CAM-001: Create Campaign

**Description**: System shall allow authorized users to create fundraising campaigns.

**API Endpoint**: `POST /api/campaigns`

**Input Specifications**:

```json
{
  "title": "string (required, max 200 chars)",
  "description": "string (required)",
  "goal_amount": "decimal (required, precision: 12,2)",
  "currency_id": "integer (required, reference to currencies.id)",
  "category_id": "integer (required, reference to categories.id where type='campaign')",
  "status_id": "integer (required, reference to campaign_statuses.id)",
  "start_date": "date (required)",
  "end_date": "date (optional)",
  "image_url": "string (optional)",
  "target_beneficiaries": "integer (optional)",
  "urgency_level_id": "integer (required, reference to urgency_levels.id)",
  "address": {
    "street_line_1": "string (optional)",
    "street_line_2": "string (optional)",
    "city": "string (optional)",
    "state": "string (optional)",
    "postal_code": "string (optional)",
    "country": "string (optional)",
    "latitude": "decimal (optional, precision: 10,8)",
    "longitude": "decimal (optional, precision: 11,8)"
  }
}
```

**Output Specifications**:

```json
{
  "success": true,
  "data": {
    "id": "integer",
    "title": "string",
    "description": "string",
    "goal_amount": "decimal",
    "currency": {
      "id": "integer",
      "code": "string",
      "symbol": "string"
    },
    "category": {
      "id": "integer",
      "name": "string"
    },
    "status": {
      "id": "integer",
      "name": "string"
    },
    "urgency_level": {
      "id": "integer",
      "name": "string",
      "priority_score": "integer",
      "color_code": "string"
    },
    "statistics": {
      "current_amount": "decimal",
      "donations_count": "integer",
      "unique_donors_count": "integer",
      "average_donation": "decimal",
      "completion_percentage": "decimal",
      "last_donation_date": "timestamp"
    },
    "created_by": {
      "id": "integer",
      "name": "string"
    },
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
}
```

**Validation Rules**:

- Title must be unique within active campaigns and max 200 characters
- Description must be provided and meaningful
- Goal amount must be a valid decimal with precision (12,2)
- Currency must exist in currencies table and be active
- Category must exist and be of type 'campaign'
- Campaign status must be valid and active
- End date must be after start date if provided
- Urgency level must be valid and active
- Address fields must follow length restrictions from addresses table (if provided)
- Geographic coordinates must be valid and within precision limits (if provided)
- Creator must have appropriate permissions based on role

**Performance Criteria**:

- Campaign creation: < 1 second
- Image upload processing: < 5 seconds
- Search indexing: < 30 seconds

#### FR-CAM-002: Campaign Progress Tracking

**Description**: System shall track and update campaign progress in real-time.

**API Endpoint**: `GET /api/campaigns/{id}/progress`

**Output Specifications**:

```json
{
  "success": true,
  "data": {
    "campaignId": "integer",
    "goalAmount": "decimal",
    "currentAmount": "decimal",
    "progressPercentage": "decimal",
    "donationsCount": "integer",
    "uniqueDonors": "integer",
    "averageDonation": "decimal",
    "recentDonations": "array",
    "milestones": "array",
    "daysRemaining": "integer"
  }
}
```

**Performance Criteria**:

- Progress updates: Real-time (< 5 seconds)
- Progress calculation: < 200ms
- Cache refresh: Every 5 minutes

#### FR-CAM-003: Campaign Search and Filtering

**Description**: System shall provide advanced search and filtering capabilities for campaigns.

**API Endpoint**: `GET /api/campaigns/search`

**Query Parameters**:

- `q`: string (search query)
- `category`: enum (filter by category)
- `status`: enum (active, paused, completed, cancelled)
- `location`: string (geographic filter)
- `minGoal`: decimal (minimum goal amount)
- `maxGoal`: decimal (maximum goal amount)
- `sortBy`: enum (newest, oldest, goal_amount, progress, ending_soon)
- `page`: integer (pagination)
- `limit`: integer (items per page, max: 50)

**Performance Criteria**:

- Search response: < 500ms
- Full-text search: Elasticsearch integration
- Results caching: 5 minutes TTL

---

## Volunteer Management System

### Volunteer Functional Requirements

#### FR-VOL-001: Volunteer Registration

**Description**: System shall manage volunteer registration and profile creation.

**API Endpoint**: `POST /api/volunteers`

**Input Specifications**:

```json
{
  "user_id": "integer (required)",
  "availability": "text (required)",
  "emergency_contact": {
    "name": "string (required, max 100 chars)",
    "phone": "string (required, max 20 chars)",
    "email": "string (optional)",
    "relationship": "string (required, max 50 chars)",
    "address": {
      "street_line_1": "string (optional)",
      "street_line_2": "string (optional)",
      "city": "string (optional)",
      "state": "string (optional)",
      "postal_code": "string (optional)",
      "country": "string (optional)"
    }
  },
  "background_check_status_id": "integer (required, reference to background_check_statuses.id)",
  "status_id": "integer (required, reference to volunteer_statuses.id)",
  "skills": [
    {
      "skill_id": "integer (reference to volunteer_skills.id)",
      "proficiency_level": "enum (beginner, intermediate, advanced, expert)",
      "years_experience": "integer"
    }
  ]
}
```

**Output Specifications**:

```json
{
  "success": true,
  "data": {
    "id": "integer",
    "user": {
      "id": "integer",
      "email": "string",
      "first_name": "string",
      "last_name": "string"
    },
    "availability": "text",
    "emergency_contact": {
      "id": "integer",
      "name": "string",
      "phone": "string",
      "relationship": "string"
    },
    "background_check_status": {
      "id": "integer",
      "name": "string",
      "requires_action": "boolean"
    },
    "status": {
      "id": "integer",
      "name": "string",
      "is_active_status": "boolean"
    },
    "skills": [
      {
        "id": "integer",
        "name": "string",
        "proficiency_level": "string",
        "years_experience": "integer"
      }
    ],
    "statistics": {
      "total_hours": "decimal",
      "activities_count": "integer",
      "projects_count": "integer",
      "events_count": "integer",
      "teams_count": "integer",
      "last_activity_date": "timestamp"
    },
    "joined_date": "date",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
}
```

**Validation Rules**:

- User must exist and not already be registered as a volunteer
- Emergency contact information must be complete and valid
- Phone numbers must follow specified format and length
- Background check status must be valid and active
- Volunteer status must be valid and active
- Skills must be from the predefined list in volunteer_skills table
- Proficiency levels must be one of the specified enum values
- Address fields must follow length restrictions (if provided)
- Years of experience must be non-negative integers

**Performance Criteria**:

- Registration processing: < 1 second
- Statistics calculation: < 500ms
- Background check status update: Real-time
- Audit log entry creation: < 100ms

#### FR-VOL-002: Activity Logging

**Description**: System shall track volunteer activities and hours.

**API Endpoint**: `POST /api/volunteers/activities`

**Input Specifications**:

```json
{
  "activityType": "enum (project_work, event_help, administrative, fundraising, other) (required)",
  "description": "string (required, 10-500 chars)",
  "hoursLogged": "decimal (required, min: 0.5, max: 24.0)",
  "activityDate": "ISO8601 date (required)",
  "projectId": "integer (optional)",
  "eventId": "integer (optional)",
  "location": "string (optional)",
  "supervisorNotes": "string (optional)"
}
```

**Validation Rules**:

- Activity date cannot be in the future
- Hours must be reasonable for activity type
- Project or event must exist if referenced
- Maximum 40 hours per week validation

**Performance Criteria**:

- Activity logging: < 500ms
- Hours calculation: Real-time
- Verification workflow: < 24 hours

---

## Event Management System

### Event Functional Requirements

#### FR-EVE-001: Event Creation

**Description**: System shall allow creation and management of charity events.

**API Endpoint**: `POST /api/events`

**Input Specifications**:

```json
{
  "title": "string (required, max 200 chars)",
  "description": "string (required)",
  "event_date": "datetime (required)",
  "address": {
    "street_line_1": "string (required)",
    "street_line_2": "string (optional)",
    "city": "string (required)",
    "state": "string (required)",
    "postal_code": "string (optional)",
    "country": "string (required)",
    "latitude": "decimal (optional, precision: 10,8)",
    "longitude": "decimal (optional, precision: 11,8)"
  },
  "capacity": "integer (required)",
  "ticket_price": "decimal (required, precision: 8,2)",
  "currency_id": "integer (required, reference to currencies.id)",
  "status_id": "integer (required, reference to event_statuses.id)",
  "category_id": "integer (required, reference to categories.id where type='event')",
  "image_url": "string (optional)",
  "registration_deadline": "datetime (optional)"
}
```

**Output Specifications**:

```json
{
  "success": true,
  "data": {
    "id": "integer",
    "title": "string",
    "description": "string",
    "event_date": "datetime",
    "address": {
      "id": "integer",
      "street_line_1": "string",
      "city": "string",
      "state": "string",
      "country": "string"
    },
    "capacity": "integer",
    "ticket_price": "decimal",
    "currency": {
      "id": "integer",
      "code": "string",
      "symbol": "string"
    },
    "status": {
      "id": "integer",
      "name": "string"
    },
    "category": {
      "id": "integer",
      "name": "string"
    },
    "created_by": {
      "id": "integer",
      "name": "string"
    },
    "registration_status": {
      "total_registrations": "integer",
      "available_slots": "integer",
      "is_full": "boolean"
    },
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
}
```

**Validation Rules**:

- Title must be max 200 characters
- Description must be provided and meaningful
- Event date must be in the future
- Registration deadline must be before event date (if provided)
- Address is required with mandatory fields (street_line_1, city, state, country)
- Capacity must be a positive integer
- Ticket price must be a valid decimal with precision (8,2)
- Currency must exist in currencies table and be active
- Status must be valid from event_statuses table
- Category must exist and be of type 'event'
- Geographic coordinates must be valid and within precision limits (if provided)
- Creator must have appropriate permissions based on role

**Performance Criteria**:

- Event creation: < 1 second
- Address validation: < 500ms
- Registration status calculation: Real-time
- Notification dispatch: < 2 seconds
- Audit log entry creation: < 100ms

#### FR-EVE-002: Event Registration

**Description**: System shall manage event registrations and waitlists.

**API Endpoint**: `POST /api/events/{id}/register`

**Input Specifications**:

```json
{
  "userId": "integer (required)",
  "specialRequirements": "string (optional, max: 500 chars)",
  "emergencyContact": "object (optional)",
  "paymentMethod": "object (required if paid event)"
}
```

**Performance Criteria**:

- Registration processing: < 2 seconds
- Waitlist management: Automated
- Confirmation email: < 30 seconds

---

## Notification System

### Notification Functional Requirements

#### FR-NOT-001: Real-time Notifications

**Description**: System shall send real-time notifications for important events.

**API Endpoint**: `POST /api/notifications`

**Notification Types**:

- Donation received
- Campaign milestone reached
- Event registration confirmed
- Volunteer activity approved
- System announcements

**Performance Criteria**:

- Notification delivery: < 5 seconds
- Email delivery: < 2 minutes
- Push notification: < 30 seconds

---

## Cross-Cutting Requirements

### Security Requirements

#### SEC-001: Data Encryption

- All sensitive data encrypted at rest (AES-256)
- Data in transit encrypted (TLS 1.3)
- PII data anonymization for analytics

#### SEC-002: Authentication Security

- JWT tokens with RSA-256 signing
- Session management with secure cookies
- Multi-factor authentication for admin roles

#### SEC-003: Input Validation

- SQL injection prevention
- XSS protection
- CSRF token validation
- Rate limiting on all endpoints

### Performance Requirements

#### PERF-001: Response Times

- API responses: < 500ms (95th percentile)
- Database queries: < 200ms (average)
- File uploads: < 30 seconds (10MB limit)

#### PERF-002: Scalability

- Support 10,000 concurrent users
- Handle 1,000 donations per hour
- Process 100,000 API requests per minute

#### PERF-003: Availability

- System uptime: 99.9%
- Planned maintenance: < 4 hours per month
- Disaster recovery: < 4 hours RTO

### Data Requirements

#### DATA-001: Backup and Recovery

- Daily automated backups
- Point-in-time recovery capability
- Cross-region backup replication

#### DATA-002: Data Retention

- Financial records: 7 years
- User activity logs: 2 years
- System logs: 1 year

#### DATA-003: Compliance

- GDPR compliance for EU users
- PCI DSS compliance for payment processing
- CCPA compliance for California users

### Monitoring and Logging

#### MON-001: Application Monitoring

- Real-time performance metrics
- Error tracking and alerting
- User behavior analytics

#### MON-002: Security Monitoring

- Failed authentication tracking
- Suspicious activity detection
- Compliance audit logging

### Integration Requirements

#### INT-001: Payment Processing

- Paystack integration for credit cards

#### INT-002: Email Services

- Transactional emails via SendGrid
- Marketing emails via Mailchimp
- SMS notifications via Twilio

#### INT-003: External APIs

- Google Maps for location services
- social media APIs for sharing
- Analytics APIs for reporting
