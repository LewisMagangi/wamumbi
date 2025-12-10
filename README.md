# Wamumbi Charity Management System

A comprehensive digital platform for the Wamumbi Foundation to manage charitable activities, donations, volunteer coordination, and community impact initiatives.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
- [Documentation](#documentation)
- [Usage](#usage)
- [Recent Updates](#recent-updates)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Introduction

Wamumbi is a modern charity management system built to streamline operations for non-profit organizations. The platform enables efficient management of:

- **Donations & Fundraising**: Complete donation processing and campaign management with seeded reference data
- **Volunteer Coordination**: Comprehensive volunteer registration and management with user creation
- **Project Management**: Project tracking and coordination
- **Event Organization**: Full event creation, management, and editing capabilities
- **Impact Reporting**: Reporting on activities and impact metrics
- **User Authentication**: Secure authentication with Clerk integration and proper sign-out functionality

## Features

### 🎯 Core Functionality

- **Advanced User Management**: Admin, Team Leader, Volunteer, and Donor roles with Clerk authentication
- **Campaign Management**: Create, view, and manage fundraising campaigns with seeded categories and urgency levels
- **Donation Processing**: Donation tracking with M-Pesa payment instructions and seeded currencies
- **Volunteer Portal**: Complete volunteer registration with automatic user creation and emergency contact management
- **Project Tracking**: Project management and coordination
- **Event Management**: Full CRUD operations for events with category management
- **Database Seeding**: Comprehensive seed data for all reference tables (currencies, categories, statuses, etc.)

### 💳 Financial Management

- Donation tracking with multiple currency support
- Donation history and reporting
- Campaign progress tracking

### 👥 Community Features

- Volunteer registration and management with user synchronization
- Event creation, editing, and management
- Emergency contact management for volunteers

### 🔧 Technical Features

- **Type-Safe API**: tRPC with automatic type generation
- **Database Integration**: Prisma ORM with Neon PostgreSQL adapter
- **Authentication**: Clerk integration with proper sign-out functionality
- **Form Validation**: Zod schema validation with date coercion
- **Real-time Updates**: TanStack Query for optimistic updates and cache management

## Architecture

Wamumbi is built using modern web technologies with a focus on scalability and maintainability:

### Technology Stack

- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, and Shadcn/UI components
- **Backend**: tRPC with Next.js for type-safe API communication
- **Database**: PostgreSQL with Prisma ORM and Neon serverless adapter
- **Authentication**: Clerk for secure user authentication and authorization
- **State Management**: TanStack Query for server state management
- **Payments**: M-Pesa payment instructions with multi-currency support
- **Deployment**: Vercel (Frontend) with cloud database hosting

### System Architecture

```text
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Layer     │    │   Database      │
│   (Next.js)     │◄──►│   (tRPC)        │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ - Dashboard     │    │ - Auth Routes   │    │ - User Data     │
│ - Campaigns     │    │ - CRUD Operations│    │ - Donations     │
│ - Volunteers    │    │ - Type-Safe APIs │    │ - Projects      │
│ - Events        │    │ - Clerk Integration│    │ - Events        │
│ - Real-time UI  │    │                 │    │ - Seed Data      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Components

- **Database Seeding**: Comprehensive seed data for all reference tables
- **Type Safety**: End-to-end type safety with tRPC and Prisma
- **Authentication**: Clerk integration with proper user management
- **Form Validation**: Zod schemas with automatic date coercion
- **Optimistic Updates**: Real-time UI updates with TanStack Query

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database (Neon recommended)
- Git for version control
- Clerk account for authentication

### Installation

1. **Clone the repository**
  
   ```bash
   git clone https://github.com/LewisMagangi/wamumbi.git
   cd wamumbi
   ```

2. **Install dependencies**
  
   ```bash
   cd web
   npm install
   ```

3. **Set up environment variables**
  
   ```bash
   cp .env.example .env.local
   # Configure your database URL, Clerk keys, and other environment variables
   ```

### Database Setup

1. **Configure Prisma**
  
   ```bash
   npx prisma generate
   ```

2. **Run database migrations**
  
   ```bash
   npx prisma db push --config=prisma/prisma.config.ts
   ```

3. **Seed the database with reference data**
  
   ```bash
   npm run db:seed
   ```

   This will populate all lookup tables with essential data:
   - User roles and statuses
   - Currencies and payment methods
   - Campaign categories and urgency levels
   - Event categories and statuses
   - Volunteer skills and background check statuses

4. **Start the development server**
  
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see the application.

## Documentation

Comprehensive documentation is available in the `docs/` directory:

- 📖 **[API Documentation](docs/api/README.md)** - tRPC procedures and authentication
- 🗄️ **[Database Documentation](docs/database/README.md)** - Schema design and data models
- 🎨 **[Frontend Documentation](docs/frontend/README.md)** - Component architecture and styling
- 🚀 **[Deployment Guide](docs/deployment/README.md)** - Development and production deployment

## Usage

### For Administrators

- Complete user management with Clerk authentication
- Create and manage fundraising campaigns with seeded categories
- View comprehensive donation and impact reports
- Manage volunteers and events with full CRUD operations
- Access seeded reference data for all system entities

### For Team Leaders

- Manage volunteer teams and projects
- Track project progress and impact metrics
- Organize and edit events with category management

### For Volunteers

- Register as volunteers with automatic user account creation
- View volunteer opportunities and manage profiles
- Access emergency contact management

## Recent Updates

### ✅ Database & Seeding

- **Comprehensive Database Seeding**: Created complete seed data for all reference tables including currencies, categories, statuses, skills, and notification types
- **Schema Synchronization**: Fixed database schema sync issues with Prisma db push
- **Neon Adapter Integration**: Proper configuration for Neon serverless PostgreSQL

### ✅ Campaign Management

- **Date Validation Fixes**: Implemented `z.coerce.date()` for proper date handling in forms
- **Campaign Details**: Fixed campaign detail viewing with proper data loading
- **Form Validation**: Enhanced form validation with automatic date coercion

### ✅ Volunteer Management

- **User Creation Integration**: Implemented `createWithUser` mutation for seamless volunteer registration
- **Emergency Contact Management**: Added emergency contact handling during volunteer creation
- **Dynamic UI Updates**: Real-time UI updates with TanStack Query cache invalidation

### ✅ Event Management

- **Full CRUD Operations**: Added complete create, read, update, and delete functionality
- **Event Editing**: Implemented event editing with form pre-population
- **Date Handling**: Fixed date validation issues across all event operations

### ✅ Authentication & UI

- **Sign Out Functionality**: Fixed sidebar sign out button to properly use Clerk's signOut
- **User Display**: Updated sidebar to show actual Clerk user information instead of hardcoded data
- **Real-time Updates**: Implemented optimistic updates and proper cache management

### ✅ Technical Improvements

- **Type Safety**: Enhanced tRPC procedures with proper error handling
- **Form Validation**: Improved Zod schemas with date coercion
- **Error Handling**: Better error messages and user feedback
- **Performance**: Optimized database queries and UI updates

## Contributing

Explain how people can contribute to your project. Include guidelines for submitting issues or pull requests.

## License

This project is licensed under the [MIT License](LICENSE) - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

Give credit to any third-party resources, libraries, or tools that you used or were inspired by during the development of your project.
