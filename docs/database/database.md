# Wamumbi Database Documentation

## Overview

The Wamumbi database is designed to support a charity management system with features for handling donations, campaigns, events, volunteers, and more. The schema follows 3NF normalization principles and implements robust data privacy measures.

## Core Design Principles

### 1. Data Privacy & GDPR Compliance

- Personal data fields are optional where possible
- PII (Personally Identifiable Information) is clearly marked
- Support for data anonymization (e.g., anonymous donations)
- Emergency contact information is optional
- Addresses are stored separately and can be partially filled

### 2. Data Integrity

- Foreign key relationships with appropriate cascade rules
- Lookup tables for common values (categories, roles, statuses)
- Audit logging for tracking changes
- Statistics tables for derived/calculated data
- Unique constraints where appropriate

### 3. Scalability & Performance

- Appropriate indexes on frequently queried columns
- Separation of transactional and analytical data
- Efficient handling of recurring operations
- Support for high-volume operations (donations, events)

## Key Tables & Relationships

### User Management

``` text
users
├── user_roles (role-based access control)
├── user_statuses (account state tracking)
└── addresses (optional location info)
```

### Donation System

``` text
donations
├── donors (supports anonymous donations)
├── campaigns (fundraising targets)
└── payment_methods (payment processing)
```

### Event Management

``` text
events
├── event_categories (event classification)
├── event_registrations (attendance tracking)
└── addresses (location information)
```

### Volunteer System

``` text
volunteers
├── volunteer_skills (skill tracking)
├── volunteer_activities (time tracking)
├── volunteer_statistics (analytics)
└── emergency_contacts (optional)
```

## Lookup Tables

- `categories`: Shared categories for teams, campaigns, and blogs
- `event_categories`: Event-specific classifications
- `user_roles`: Role-based access control
- `user_statuses`: Account status management
- `payment_methods`: Available payment options
- `notification_types`: Message templates
- `entity_types`: Audit logging classification
- `setting_categories`: Configuration grouping
- `setting_data_types`: Configuration validation

## Statistics & Analytics

Dedicated tables for real-time statistics:

- `campaign_statistics`: Donation tracking
- `volunteer_statistics`: Activity metrics
- `project_progress`: Project status tracking

## Security Features

### Access Control

- Role-based permissions stored as JSON
- Activity logging with IP and user agent
- Session tracking
- Encrypted sensitive settings

### Audit Trail

```sql
audit_logs
├── entity_types (what changed)
├── audit_actions (type of change)
└── JSON storage for before/after values
```

## Data Retention & Privacy

### PII Handling

The following tables contain sensitive data:

1. `users`: Personal contact information
2. `donors`: Donation-related personal data
3. `emergency_contacts`: Volunteer emergency contacts
4. `addresses`: Physical location data

### Deletion Behavior

- User deletion is restricted if they have active roles
- Donations preserve history even if donor is anonymized
- Address records can be safely deleted
- Team leaders can be removed without affecting team

## Common Queries

### Donation Analytics

```sql
SELECT 
    c.title,
    cs.current_amount,
    cs.donations_count,
    cs.average_donation
FROM campaigns c
JOIN campaign_statistics cs ON c.id = cs.campaign_id
WHERE c.status = 'active';
```

### Volunteer Availability

```sql
SELECT 
    u.first_name,
    u.last_name,
    v.availability,
    vs.total_hours
FROM volunteers v
JOIN users u ON v.user_id = u.id
JOIN volunteer_statistics vs ON v.id = vs.volunteer_id
WHERE v.status = 'active';
```

## Maintenance Considerations

### Regular Tasks

1. Update campaign statistics
2. Calculate volunteer metrics
3. Clean up expired sessions
4. Archive completed events
5. Update project progress

### Performance Optimization

- Index maintenance for lookup tables
- Archive old audit logs
- Monitor notification deliverability
- Track payment method usage

## Future Enhancements

1. Support for multiple currencies
2. Enhanced geolocation features
3. Improved campaign analytics
4. Advanced volunteer matching
5. Expanded notification channels

## Best Practices

### Working with Personal Data

1. Always use parameterized queries
2. Encrypt sensitive data at rest
3. Log access to PII
4. Implement data retention policies
5. Support data export requests

### Maintaining Data Integrity

1. Use transactions for multi-table updates
2. Validate foreign key constraints
3. Implement proper cascade rules
4. Maintain audit trails
5. Regular backup and verification
