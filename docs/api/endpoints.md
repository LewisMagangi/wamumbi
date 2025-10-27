# API Endpoints

This document provides detailed information about all available API endpoints in the Wamumbi Charity Management System.

## Table of Contents

- [Users](#users)
- [Donations](#donations)
- [Campaigns](#campaigns)
- [Volunteers](#volunteers)
- [Events](#events)
- [Projects](#projects)
- [Teams](#teams)
- [Blog Posts](#blog-posts)
- [Notifications](#notifications)

---

## Users

### Get Current User Profile

```http
GET /api/users/profile
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "role": "volunteer",
    "status": "active",
    "profileImage": "/images/profile.jpg",
    "createdAt": "2025-01-15T10:00:00Z",
    "lastLogin": "2025-01-20T14:30:00Z"
  }
}
```

### Update User Profile

```http
PATCH /api/users/profile
```

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

## Donations

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

## Campaigns

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

## Volunteers

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

## Events

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

## Teams

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

## Blog Posts

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

## Filtering and Sorting

Many endpoints support filtering and sorting:

### Common Filters

- `status`: Filter by status
- `category`: Filter by category
- `dateFrom` / `dateTo`: Date range filtering
- `search`: Text search in relevant fields

### Sorting

- `sortBy`: Field to sort by
- `sortOrder`: `asc` or `desc`

Example:

```http
GET /api/campaigns?status=active&sortBy=createdAt&sortOrder=desc&search=water
```
