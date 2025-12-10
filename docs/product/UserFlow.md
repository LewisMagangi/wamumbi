# Charity Management System - User Flows

## Table of Contents

1. [Introduction](#introduction)
2. [User Authentication](#user-authentication)
3. [Campaign & Donation Flows](#campaign--donation-flows)
4. [Basic Admin Flows](#basic-admin-flows)

---

## Introduction

This document outlines the user flows for the Charity Management System. The system provides comprehensive functionality for managing charitable activities, including campaigns, donations, events, volunteers, teams, and projects.

### System Features

**Included:**

- User registration and authentication
- Campaign creation, management, and browsing
- Donation processing (anonymous and identified)
- Event creation and registration
- Volunteer registration and activity tracking
- Team management and communications
- Project tracking and management
- Blog posts and content management
- Notifications and communications
- Dashboard and reporting

---

## User Authentication

### 1. User Registration

1. User provides email and password
2. System creates account with default role "User"
3. System sends verification email
4. User clicks verification link
5. Account activated

**Database Tables:**

- `users`
- `user_roles`
- `user_statuses`

---

### 2. Login

1. User enters email and password
2. System validates credentials
3. System creates session
4. User redirected to homepage

---

## Campaign & Donation Flows

### 3. Browse Campaigns

1. User visits campaigns page
2. System displays active campaigns with:
   - Title and image
   - Description (excerpt)
   - Goal amount
   - Current amount raised
   - Progress bar
3. User can filter by category
4. User clicks campaign to view details

**Database Tables:**

- `campaigns`
- `campaign_statistics`
- `categories`
- `currencies`

---

### 4. View Campaign Details

1. User selects campaign
2. System displays:
   - Full description
   - Goal vs current amount
   - Number of donors
   - Progress percentage
   - "Donate Now" button
3. User clicks "Donate Now"

---

### 5. Make Anonymous Donation

1. User enters donation amount
2. User selects payment method
3. User completes payment (no personal info required)
4. System creates anonymous donor record
5. System creates donation record
6. System updates campaign statistics
7. User sees confirmation page

**Database Tables:**

- `donors` (is_anonymous = true)
- `donations`
- `payment_methods`
- `donation_statuses`
- `campaign_statistics`

---

### 6. Make Identified Donation (Optional)

1. User enters donation amount
2. User optionally provides:
   - Name
   - Email (for receipt)
3. User selects payment method
4. User completes payment
5. System creates/updates donor record
6. System sends receipt via email
7. System updates campaign statistics
8. User sees confirmation page

**Database Tables:**

- `donors` (is_anonymous = false)
- `donations`

---

## Basic Admin Flows

### 7. Admin Login

1. Admin logs in with admin credentials
2. System verifies admin role
3. Admin redirected to admin dashboard

**Database Tables:**

- `users` (role_id = admin role)
- `user_roles`

---

### 8. Create Campaign

1. Admin clicks "Create Campaign"
2. Admin fills form:
   - Title (required)
   - Description (required)
   - Goal amount (required)
   - Currency (required)
   - Category (required)
   - Start date (required)
   - End date (optional)
   - Image URL (optional)
3. Admin clicks "Save"
4. System creates campaign with status "Draft"
5. System creates campaign_statistics record

**Database Tables:**

- `campaigns`
- `campaign_statuses`
- `campaign_statistics`
- `categories`
- `currencies`

---

### 9. Publish Campaign

1. Admin views campaign list
2. Admin selects draft campaign
3. Admin clicks "Publish"
4. System updates status to "Active"
5. Campaign now visible to public

---

### 10. View Campaign Analytics

1. Admin clicks on campaign
2. System displays:
   - Total raised
   - Number of donations
   - Number of unique donors
   - Average donation
   - Completion percentage
   - Recent donations list
3. Admin can export data as CSV

**Database Tables:**

- `campaign_statistics`
- `donations`
- `donors`

---

## MVP Database Tables Summary

### Core Tables (11 total)

**Authentication & Users:**

1. `users`
2. `user_roles`
3. `user_statuses`

**Campaigns:**
4. `campaigns`
5. `campaign_statistics`
6. `campaign_statuses`
7. `categories` (filtered for campaigns only)

**Donations:**
8. `donors`
9. `donations`
10. `donation_statuses`
11. `payment_methods`

**Supporting:**
12. `currencies`

---

## MVP Flow Diagram

``` bash
Guest User
    ↓
Browse Campaigns → View Details → Donate (Anonymous)
    ↓                                  ↓
Register (Optional)              Confirmation
    ↓
Login → Browse → Donate (Identified) → Receipt via Email
```

``` bash
Admin User
    ↓
Login → Admin Dashboard
    ↓
Create Campaign → Save as Draft → Publish
    ↓
View Analytics → Export Reports
```

---

## Data Flow

### Donation Process

``` bash
User Selects Amount
    ↓
Payment Gateway
    ↓
Create Donor Record
    ↓
Create Donation Record (Status: Processing)
    ↓
Payment Confirmed
    ↓
Update Donation Status (Status: Completed)
    ↓
Update Campaign Statistics
    ↓
Show Confirmation
```

---

## MVP Features Summary

### User Features

- ✅ Register account
- ✅ Login/logout
- ✅ Browse campaigns
- ✅ View campaign details
- ✅ Make anonymous donations
- ✅ Make identified donations
- ✅ Receive email receipt

### Admin Features

- ✅ Create campaigns
- ✅ Edit campaigns
- ✅ Publish/unpublish campaigns
- ✅ View campaign analytics
- ✅ View donation list
- ✅ Export data

### SYSTEM FEATURES

- ✅ User authentication
- ✅ Payment processing
- ✅ Email notifications
- ✅ Real-time statistics
- ✅ Multi-currency support

---

## Post-MVP Enhancements

**Phase 2:**

- Recurring donations
- User donation history
- Campaign categories and search
- Enhanced analytics

**Phase 3:**

- Events management
- Volunteer system
- Team collaboration
- Projects tracking

**Phase 4:**

- Blog/content system
- Advanced notifications
- Mobile app
- API for integrations

---

## Technical Requirements for MVP

### Required Tables (12)

``` bash
✓ users
✓ user_roles
✓ user_statuses
✓ campaigns
✓ campaign_statuses
✓ campaign_statistics
✓ categories (campaign type only)
✓ donors
✓ donations
✓ donation_statuses
✓ payment_methods
✓ currencies
```

### Optional for MVP (can add later)

``` bash
○ addresses
○ urgency_levels
○ recurring_frequencies
○ audit_logs (recommended for production)
```

---

## MVP User Stories

### As a Visitor

1. I want to browse active campaigns so I can find causes to support
2. I want to view campaign details so I can learn more before donating
3. I want to donate anonymously so I can maintain my privacy
4. I want to receive a confirmation so I know my donation was successful

### As a Donor

1. I want to create an account so I can track my donations
2. I want to provide my email so I can receive receipts
3. I want to see my donation history (future phase)

### As an Admin

1. I want to create campaigns so I can raise funds
2. I want to publish campaigns so donors can see them
3. I want to view donation statistics so I can track progress
4. I want to see who donated so I can thank them (if not anonymous)

---

## Security Considerations (MVP)

1. **Password Security**: Hash passwords using bcrypt
2. **Payment Security**: Use trusted payment gateway (Stripe/PayPal)
3. **Data Privacy**: Support anonymous donations by default
4. **Email Verification**: Verify user emails before full access
5. **Admin Access**: Restrict admin functions to admin role only

---

## MVP Success Metrics

**Key Performance Indicators:**

- Number of campaigns created
- Total donations received
- Number of unique donors
- Average donation amount
- Campaign completion rate
- User registration rate

---

## Conclusion

This MVP focuses on the essential functionality needed to launch a working charity platform. Users can discover campaigns and donate, while admins can manage campaigns and track results. Additional features can be added in future iterations based on user feedback and business priorities.
