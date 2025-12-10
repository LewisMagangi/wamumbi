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

**Description:** Creates a new campaign with proper date validation using z.coerce.date().

**Input:**

```typescript
{
  title: string;
  description: string;
  goalAmount: number;
  startDate: Date; // Uses z.coerce.date() for validation
  endDate: Date;   // Uses z.coerce.date() for validation
  categoryId: number;
  urgencyLevelId: number;
  statusId: number;
  imageUrl?: string;
}
```

**Output:** Created campaign with all fields.

### update

**Type:** Mutation

**Description:** Updates an existing campaign with date validation.

**Input:** Campaign update data with ID (same schema as create, plus id)

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

### getAll

**Type:** Query

**Description:** Retrieves all donations with filtering options.

**Input:** Optional filters (campaignId, donorId, etc.)

**Output:** Array of donations

### getById

**Type:** Query

**Description:** Retrieves a specific donation by ID.

**Input:**

```typescript
{
  id: number;
}
```

**Output:** Donation details

### create

**Type:** Mutation

**Description:** Creates a new donation.

**Input:** Donation creation data

**Output:** Created donation

### update

**Type:** Mutation

**Description:** Updates donation status.

**Input:** Donation update data

**Output:** Updated donation

---

## Teams

### getAll

**Type:** Query

**Description:** Retrieves all teams.

**Input:** None

**Output:** Array of teams

### getById

**Type:** Query

**Description:** Retrieves a specific team by ID.

**Input:**

```typescript
{
  id: number;
}
```

**Output:** Team details with members

### create

**Type:** Mutation

**Description:** Creates a new team.

**Input:** Team creation data

**Output:** Created team

### update

**Type:** Mutation

**Description:** Updates a team.

**Input:** Team update data

**Output:** Updated team

### delete

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

### getAll

**Type:** Query

**Description:** Retrieves all events with full details.

**Input:** None

**Output:** Array of events

### getById

**Type:** Query

**Description:** Retrieves a specific event by ID.

**Input:**

```typescript
{
  id: number;
}
```

**Output:** Event details with registrations

### create

**Type:** Mutation

**Description:** Creates a new event with proper date validation using z.coerce.date().

**Input:**

```typescript
{
  title: string;
  description: string;
  eventDate: Date; // Uses z.coerce.date() for validation
  location: string;
  maxAttendees?: number;
  eventTypeId: number;
  categoryId: number;
  statusId: number;
  imageUrl?: string;
}
```

**Output:** Created event

### update

**Type:** Mutation

**Description:** Updates an existing event with date validation.

**Input:** Event update data with ID (same schema as create, plus id)

**Output:** Updated event

### delete

**Type:** Mutation

**Description:** Deletes an event.

**Input:**

```typescript
{
  id: number;
}
```

**Output:** Success confirmation

### register

**Type:** Mutation

**Description:** Registers a user for an event.

**Input:** Event ID and registration data

**Output:** Registration confirmation

---

## Volunteers

### getAll

**Type:** Query

**Description:** Retrieves all volunteers with their details.

**Input:** None

**Output:** Array of volunteers

### getById

**Type:** Query

**Description:** Retrieves a specific volunteer by ID.

**Input:**

```typescript
{
  id: number;
}
```

**Output:** Volunteer details with skills and activities

### create

**Type:** Mutation

**Description:** Registers a new volunteer.

**Input:** Volunteer registration data

**Output:** Created volunteer

### createWithUser

**Type:** Mutation

**Description:** Creates a new user and volunteer with emergency contact in one transaction. Enables seamless volunteer registration without requiring pre-existing users.

**Input:**

```typescript
{
  // User data
  email: string;
  firstName: string;
  lastName: string;
  // Volunteer data
  phoneNumber: string;
  dateOfBirth: Date; // Uses z.coerce.date() for validation
  address: string;
  city: string;
  state: string;
  zipCode: string;
  volunteerRoleId: number;
  skills: number[]; // Array of skill IDs
  availability: string;
  // Emergency contact
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
}
```

**Output:** Created volunteer with user and emergency contact information

### update

**Type:** Mutation

**Description:** Updates volunteer information.

**Input:** Volunteer update data

**Output:** Updated volunteer

### delete

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

### getAll

**Type:** Query

**Description:** Retrieves all blog posts.

**Input:** Optional filters

**Output:** Array of blog posts

### getById

**Type:** Query

**Description:** Retrieves a specific blog post by ID.

**Input:**

```typescript
{
  id: number;
}
```

**Output:** Blog post details

### create

**Type:** Mutation

**Description:** Creates a new blog post.

**Input:** Blog post creation data

**Output:** Created blog post

### update

**Type:** Mutation

**Description:** Updates a blog post.

**Input:** Blog post update data

**Output:** Updated blog post

### delete

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
