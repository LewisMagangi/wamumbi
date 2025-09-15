# Wamumbi Charity Management System

A comprehensive digital platform for the Wamumbi Foundation to manage charitable activities, donations, volunteer coordination, and community impact initiatives.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Documentation](#documentation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Introduction

Wamumbi is a modern charity management system built to streamline operations for non-profit organizations. The platform enables efficient management of:

- **Donations & Fundraising**: Secure donation processing and campaign management
- **Volunteer Coordination**: Volunteer registration, activity tracking, and team management
- **Project Management**: Track charitable projects from planning to completion
- **Event Organization**: Manage charity events and community gatherings
- **Impact Reporting**: Generate reports on charitable activities and outcomes

## Features

### 🎯 Core Functionality

- **Multi-role User Management**: Admin, Team Leader, Volunteer, and Donor roles
- **Campaign Management**: Create and track fundraising campaigns with real-time progress
- **Donation Processing**: Secure payment processing with multiple payment methods
- **Volunteer Portal**: Skills-based volunteer matching and activity logging
- **Project Tracking**: Complete project lifecycle management with team collaboration
- **Event Management**: Event creation, registration, and attendance tracking

### 💳 Financial Management

- Real-time donation tracking and reporting
- Recurring donation support
- Multiple payment gateway integration
- Financial audit trails and reporting

### 👥 Community Features

- Team communication and collaboration tools
- Blog and content management system
- Notification system for stakeholders
- Anonymous donation options

## Architecture

Wamumbi is built using modern web technologies with a focus on scalability and maintainability:

### Technology Stack

- **Frontend**: Next.js 14+ with TypeScript, Tailwind CSS, and Shadcn/UI components
- **Backend**: Next.js API Routes with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk for secure user authentication and authorization
- **Payments**: Integrated payment processing (Stripe/PayPal)
- **Deployment**: Vercel (Frontend) with cloud database hosting

### System Architecture

```text
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Layer     │    │   Database      │
│   (Next.js)     │◄──►│   (API Routes)  │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ - Dashboard     │    │ - Auth Routes   │    │ - User Data     │
│ - Campaigns     │    │ - CRUD APIs     │    │ - Donations     │
│ - Volunteer     │    │ - Payment APIs  │    │ - Projects      │
│ - Events        │    │ - File Upload   │    │ - Events        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database
- Git for version control

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
   # Configure your database, Clerk, and payment provider keys
   ```

4. **Set up the database**
  
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the development server**
  
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see the application.

## Documentation

Comprehensive documentation is available in the `docs/` directory:

- 📖 **[API Documentation](docs/api/README.md)** - REST API endpoints and authentication
- 🗄️ **[Database Documentation](docs/database/README.md)** - Schema design and data models
- 🎨 **[Frontend Documentation](docs/frontend/README.md)** - Component architecture and styling
- 🚀 **[Deployment Guide](docs/deployment/README.md)** - Development and production deployment

## Usage

### For Administrators

- Manage user roles and permissions
- Create and oversee fundraising campaigns
- Generate reports on donations and activities
- Configure system settings

### For Team Leaders

- Manage volunteer teams and projects
- Track project progress and milestones
- Coordinate team communications
- Organize events and activities

### For Volunteers

- View available volunteer opportunities
- Log volunteer hours and activities
- Participate in team discussions
- Track personal contribution history

### For Donors

- Make one-time or recurring donations
- Track donation history
- Support specific campaigns or projects
- Receive impact updates

## Contributing

Explain how people can contribute to your project. Include guidelines for submitting issues or pull requests.

## License

This project is licensed under the [MIT License](LICENSE) - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

Give credit to any third-party resources, libraries, or tools that you used or were inspired by during the development of your project.
