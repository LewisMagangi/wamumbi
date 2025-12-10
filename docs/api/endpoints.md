# tRPC Procedures

This document provides detailed information about all available tRPC procedures in the Wamumbi Charity Management System.

## Table of Contents

- [Authentication](#authentication)
- [Dashboard](#dashboard)
- [Campaigns](#campaigns)
- [Donations](#donations)
- [Teams](#teams)
- [Events](#events)
- [Volunteers](#volunteers)
- [Blog Posts](#blog-posts)

---

## Authentication

### authCallback

**Type:** Mutation

**Description:** Handles user authentication callback from Clerk, creating or updating user in database.

**Input:** None

**Output:**

```typescript
{
  user: {
    id: number;
    clerkId: string;
    email: string;
    firstName: string;
    lastName: string;
    imageUrl?: string;
    // ... other user fields
  }
}
```

---

## Dashboard

### getStats

**Type:** Query

**Description:** Retrieves dashboard statistics including total donations, active campaigns, volunteers, etc.

**Input:** None

**Output:**

```typescript
{
  totalDonations: number;
  totalCampaigns: number;
  activeVolunteers: number;
  totalEvents: number;
  // ... other stats
}
```

---

## Campaigns

### getActive

**Type:** Query

**Description:** Retrieves active campaigns with statistics.

**Input:** None

**Output:** Array of active campaigns with progress information.

### getAll

**Type:** Query

**Description:** Retrieves all campaigns with full details.

**Input:** None

**Output:** Array of all campaigns.

### getById

**Type:** Query

**Description:** Retrieves a specific campaign by ID.

**Input:**

```typescript
{
  id: number;
}
```

**Output:** Campaign details with statistics.

### create

**Type:** Mutation

**Description:** Creates a new campaign.

**Input:** Campaign creation data

**Output:** Created campaign

### update

**Type:** Mutation

**Description:** Updates an existing campaign.

**Input:** Campaign update data with ID

**Output:** Updated campaign

### delete

**Type:** Mutation

**Description:** Deletes a campaign.

**Input:**

```typescript
{
  id: number;
}
```

**Output:** Success confirmation

---

## Donations

### GetAll

**Type:** Query

**Description:** Retrieves all donations with filtering options.

**Input:** Optional filters (campaignId, donorId, etc.)

**Output:** Array of donations

### GetById

**Type:** Query

**Description:** Retrieves a specific donation by ID.

**Input:**

```typescript
{
  id: number;
}
```

**Output:** Donation details

### Create

**Type:** Mutation

**Description:** Creates a new donation.

**Input:** Donation creation data

**Output:** Created donation

### Update

**Type:** Mutation

**Description:** Updates donation status.

**Input:** Donation update data

**Output:** Updated donation

---

## Teams

### getall

**Type:** Query

**Description:** Retrieves all teams.

**Input:** None

**Output:** Array of teams

### GetByid

**Type:** Query

**Description:** Retrieves a specific team by ID.

**Input:**

```typescript
{
  id: number;
}
```

**Output:** Team details with members

### CREATE

**Type:** Mutation

**Description:** Creates a new team.

**Input:** Team creation data

**Output:** Created team

### UPdate

**Type:** Mutation

**Description:** Updates a team.

**Input:** Team update data

**Output:** Updated team

### Delete

**Type:** Mutation

**Description:** Deletes a team.

**Input:**

```typescript
{
  id: number;
}
```

**Output:** Success confirmation

### addMember

**Type:** Mutation

**Description:** Adds a member to a team.

**Input:** Team and user IDs

**Output:** Updated team membership

### removeMember

**Type:** Mutation

**Description:** Removes a member from a team.

**Input:** Team and user IDs

**Output:** Success confirmation

### getCategories

**Type:** Query

**Description:** Retrieves available team categories.

**Input:** None

**Output:** Array of categories

---

## Events

### getUpcoming

**Type:** Query

**Description:** Retrieves upcoming events.

**Input:** None

**Output:** Array of upcoming events

### Getall

**Type:** Query

**Description:** Retrieves all events.

**Input:** None

**Output:** Array of events

### getbyId

**Type:** Query

**Description:** Retrieves a specific event by ID.

**Input:**

```typescript
{
  id: number;
}
```

**Output:** Event details with registrations

### CrEate

**Type:** Mutation

**Description:** Creates a new event.

**Input:** Event creation data

**Output:** Created event

### UPDate

**Type:** Mutation

**Description:** Updates an event.

**Input:** Event update data

**Output:** Updated event

### register

**Type:** Mutation

**Description:** Registers a user for an event.

**Input:** Event ID and registration data

**Output:** Registration confirmation

---

## Volunteers

### getALL

**Type:** Query

**Description:** Retrieves all volunteers.

**Input:** None

**Output:** Array of volunteers

### getByID

**Type:** Query

**Description:** Retrieves a specific volunteer by ID.

**Input:**

```typescript
{
  id: number;
}
```

**Output:** Volunteer details with skills and activities

### CREAte

**Type:** Mutation

**Description:** Registers a new volunteer.

**Input:** Volunteer registration data

**Output:** Created volunteer

### UPDAte

**Type:** Mutation

**Description:** Updates volunteer information.

**Input:** Volunteer update data

**Output:** Updated volunteer

### DELEte

**Type:** Mutation

**Description:** Removes a volunteer.

**Input:**

```typescript
{
  id: number;
}
```

**Output:** Success confirmation

### logActivity

**Type:** Mutation

**Description:** Logs volunteer activity hours.

**Input:** Activity logging data

**Output:** Logged activity

### getSkills

**Type:** Query

**Description:** Retrieves available volunteer skills.

**Input:** None

**Output:** Array of skills

### getStatuses

**Type:** Query

**Description:** Retrieves volunteer status options.

**Input:** None

**Output:** Array of statuses

---

## Blog Posts

### geTALL

**Type:** Query

**Description:** Retrieves all blog posts.

**Input:** Optional filters

**Output:** Array of blog posts

### gEtById

**Type:** Query

**Description:** Retrieves a specific blog post by ID.

**Input:**

```typescript
{
  id: number;
}
```

**Output:** Blog post details

### CREATe

**Type:** Mutation

**Description:** Creates a new blog post.

**Input:** Blog post creation data

**Output:** Created blog post

### UPDATe

**Type:** Mutation

**Description:** Updates a blog post.

**Input:** Blog post update data

**Output:** Updated blog post

### DeletE

**Type:** Mutation

**Description:** Deletes a blog post.

**Input:**

```typescript
{
  id: number;
}
```

**Output:** Success confirmation

---

## Common Patterns

### Filtering and Sorting

Many procedures support filtering and sorting:

### Common Filters

- `status`: Filter by status
- `category`: Filter by category
- `dateFrom` / `dateTo`: Date range filtering
- `search`: Text search in relevant fields

### Sorting

- `sortBy`: Field to sort by
- `sortOrder`: `asc` or `desc`

### Error Handling

All procedures throw `TRPCError` with appropriate codes:

- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `BAD_REQUEST`: Invalid input

### Type Safety

All inputs and outputs are fully typed with TypeScript. The tRPC client provides end-to-end type safety.

``` typescript
**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "profileImage": "/images/new-profile.jpg"
}
```

### Get All Users (Admin Only)

```http
GET /api/users?page=1&limit=20&role=volunteer&status=active
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `role` (optional): Filter by user role
- `status` (optional): Filter by status

---

## DONATIONS

### Create Donation

```http
POST /api/donations
```

**Request Body:**

```json
{
  "campaignId": 123,
  "amount": 100.00,
  "paymentMethod": "credit_card",
  "isAnonymous": false,
  "isRecurring": false,
  "recurringFrequency": null,
  "notes": "Happy to support this cause!"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 456,
    "amount": 100.00,
    "status": "completed",
    "paymentReference": "pi_1234567890",
    "donationDate": "2025-01-20T15:00:00Z"
  }
}
```

### Get Donation History

```http
GET /api/donations?page=1&limit=10&campaignId=123
```

### Get Donation Details

```http
GET /api/donations/{id}
```

### Process Recurring Donation

```http
POST /api/donations/{id}/process-recurring
```

---

## CAMPAIGNS

### Get All Campaigns

```http
GET /api/campaigns?page=1&limit=12&category=water_projects&status=active
```

**Query Parameters:**

- `page` (optional): Page number
- `limit` (optional): Items per page
- `category` (optional): Filter by category
- `status` (optional): Filter by status

**Response:**

```json
{
  "success": true,
  "data": {
    "campaigns": [
      {
        "id": 123,
        "title": "Clean Water for Rural Communities",
        "description": "Providing clean water access to 500 families",
        "goalAmount": 50000.00,
        "currentAmount": 25000.00,
        "category": "water_projects",
        "status": "active",
        "startDate": "2025-01-01",
        "endDate": "2025-06-30",
        "imageUrl": "/images/campaign-123.jpg",
        "progress": 50
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50
    }
  }
}
```

### Create Campaign

```http
POST /api/campaigns
```

**Request Body:**

```json
{
  "title": "Education for All",
  "description": "Supporting education in underserved communities",
  "goalAmount": 30000.00,
  "category": "education",
  "startDate": "2025-02-01",
  "endDate": "2025-08-31",
  "imageUrl": "/images/education-campaign.jpg"
}
```

### Update Campaign

```http
PATCH /api/campaigns/{id}
```

### Delete Campaign

```http
DELETE /api/campaigns/{id}
```

---

## VOLUNTEERS

### Register as Volunteer

```http
POST /api/volunteers
```

**Request Body:**

```json
{
  "skills": "Construction, Project Management, Community Outreach",
  "availability": "Weekends and evenings",
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "+1234567890"
}
```

### Get Volunteer Profile

```http
GET /api/volunteers/profile
```

### Log Volunteer Activity

```http
POST /api/volunteers/activities
```

**Request Body:**

```json
{
  "activityType": "project_work",
  "description": "Helped build water well foundation",
  "hoursLogged": 8.5,
  "activityDate": "2025-01-20",
  "projectId": 456
}
```

### Get Volunteer Activities

```http
GET /api/volunteers/activities?page=1&limit=10
```

### Update Volunteer Status

```http
PATCH /api/volunteers/status
```

**Request Body:**

```json
{
  "status": "active"
}
```

---

## EVENTS

### Get All Events

```http
GET /api/events?page=1&limit=10&status=upcoming
```

**Response:**

```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": 789,
        "title": "Annual Charity Gala",
        "description": "Join us for an evening of celebration and fundraising",
        "eventDate": "2025-03-15T19:00:00Z",
        "location": "Community Center, Main St",
        "capacity": 200,
        "ticketPrice": 50.00,
        "status": "upcoming",
        "imageUrl": "/images/gala-2025.jpg",
        "registeredCount": 85
      }
    ]
  }
}
```

### Create Event

```http
POST /api/events
```

**Request Body:**

```json
{
  "title": "Community Clean-up Day",
  "description": "Join us to clean up the local park",
  "eventDate": "2025-02-28T09:00:00Z",
  "location": "Central Park, East Side",
  "capacity": 50,
  "ticketPrice": 0.00,
  "imageUrl": "/images/cleanup-event.jpg"
}
```

### Register for Event

```http
POST /api/events/{id}/register
```

**Request Body:**

```json
{
  "specialRequirements": "Vegetarian meal option needed"
}
```

### Get Event Registrations (Admin/Organizer)

```http
GET /api/events/{id}/registrations
```

---

## Projects

### Get All Projects

```http
GET /api/projects?page=1&limit=10&status=active&teamId=123
```

**Response:**

```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": 456,
        "title": "Water Well Construction - Village A",
        "description": "Building a new water well to serve 200 families",
        "teamId": 123,
        "campaignId": 789,
        "startDate": "2025-01-15",
        "endDate": "2025-04-15",
        "progressPercentage": 35,
        "status": "active",
        "budget": 15000.00,
        "location": "Village A, Region B"
      }
    ]
  }
}
```

### Create Project

```http
POST /api/projects
```

**Request Body:**

```json
{
  "title": "School Library Setup",
  "description": "Setting up a new library with 1000 books",
  "teamId": 456,
  "campaignId": 789,
  "startDate": "2025-02-01",
  "endDate": "2025-05-01",
  "budget": 8000.00,
  "location": "ABC Elementary School"
}
```

### Update Project Progress

```http
PATCH /api/projects/{id}/progress
```

**Request Body:**

```json
{
  "progressPercentage": 65,
  "notes": "Foundation completed, starting wall construction"
}
```

---

## TEAMS

### Get All Teams

```http
GET /api/teams?page=1&limit=10&category=water_projects
```

### Create Team

```http
POST /api/teams
```

**Request Body:**

```json
{
  "name": "Water Projects Team Alpha",
  "description": "Specialized team for water infrastructure projects",
  "category": "water_projects"
}
```

### Join Team

```http
POST /api/teams/{id}/join
```

### Leave Team

```http
DELETE /api/teams/{id}/leave
```

### Team Communications

```http
POST /api/teams/{id}/communications
```

**Request Body:**

```json
{
  "messageType": "announcement",
  "title": "Project Update",
  "content": "Great progress on the water well project!"
}
```

---

## BLOG Posts

### Get All Blog Posts

```http
GET /api/blog?page=1&limit=10&category=water_projects&status=published
```

### Create Blog Post

```http
POST /api/blog
```

**Request Body:**

```json
{
  "title": "Impact of Clean Water Projects",
  "content": "Full blog post content here...",
  "excerpt": "A brief summary of the impact...",
  "category": "water_projects",
  "featuredImage": "/images/blog-featured.jpg"
}
```

### Publish Blog Post

```http
PATCH /api/blog/{id}/publish
```

---

## Notifications

### Get User Notifications

```http
GET /api/notifications?page=1&limit=20&isRead=false
```

### Mark Notification as Read

```http
PATCH /api/notifications/{id}/read
```

### Mark All Notifications as Read

```http
PATCH /api/notifications/mark-all-read
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Validation failed",
    "details": {
      "field": "email",
      "message": "Email is required"
    }
  }
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

### 403 Forbidden

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions for this operation"
  }
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

### 422 Validation Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input validation failed",
    "details": {
      "amount": "Amount must be greater than 0",
      "email": "Email format is invalid"
    }
  }
}
```

---

## Pagination

Most list endpoints support pagination with the following parameters:

- `page`: Page number (starts from 1)
- `limit`: Number of items per page (default: 20, max: 100)

Response includes pagination metadata:

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 200,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

## Authentication Requirements

All API endpoints are protected using Clerk authentication middleware. For detailed information about:

- Authentication flows
- Session handling
- API protection
- Role-based access control
- Security headers
- Token management

Please refer to [Authentication Documentation](./authentication.md).

## FILTERING AND SORTING

Many endpoints support filtering and sorting:

### COMMON FILTERS

- `status`: Filter by status
- `category`: Filter by category
- `dateFrom` / `dateTo`: Date range filtering
- `search`: Text search in relevant fields

### SORTING

- `sortBy`: Field to sort by
- `sortOrder`: `asc` or `desc`

Example:

```http
GET /api/campaigns?status=active&sortBy=createdAt&sortOrder=desc&search=water
```
