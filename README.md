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

- **Donations & Fundraising**: Basic donation processing and campaign management
- **Volunteer Coordination**: Volunteer registration and basic coordination
- **Project Management**: Basic project tracking
- **Event Organization**: Event creation and management
- **Impact Reporting**: Basic reporting on activities

## Features

### 🎯 Core Functionality

- **Basic User Management**: Admin, Team Leader, Volunteer, and Donor roles
- **Campaign Management**: Create and manage fundraising campaigns
- **Donation Processing**: Basic donation tracking with M-Pesa payment instructions
- **Volunteer Portal**: Volunteer registration and basic management
- **Project Tracking**: Basic project management
- **Event Management**: Event creation and basic tracking

### 💳 Financial Management

- Basic donation tracking with M-Pesa payment instructions
- Donation history and reporting

### 👥 Community Features

- Basic volunteer registration and management
- Event creation and basic attendance tracking

## Architecture

Wamumbi is built using modern web technologies with a focus on scalability and maintainability:

### Technology Stack

- **Frontend**: Next.js 14+ with TypeScript, Tailwind CSS, and Shadcn/UI components
- **Backend**: tRPC with Next.js for type-safe API communication
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk for secure user authentication and authorization
- **Payments**: Basic M-Pesa payment instructions
- **Deployment**: Vercel (Frontend) with cloud database hosting

### System Architecture

```text
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Layer     │    │   Database      │
│   (Next.js)     │◄──►│   (tRPC)        │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ - Dashboard     │    │ - Auth Routes   │    │ - User Data     │
│ - Campaigns     │    │ - tRPC Procedures│    │ - Donations     │
│ - Volunteer     │    │ - Basic APIs     │    │ - Projects      │
│ - Events        │    │                 │    │ - Events        │
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

- 📖 **[API Documentation](docs/api/README.md)** - tRPC procedures and authentication
- 🗄️ **[Database Documentation](docs/database/README.md)** - Schema design and data models
- 🎨 **[Frontend Documentation](docs/frontend/README.md)** - Component architecture and styling
- 🚀 **[Deployment Guide](docs/deployment/README.md)** - Development and production deployment

## Usage

### For Administrators

- Basic user management
- Create and manage fundraising campaigns
- View donation reports
- Basic system oversight

### For Team Leaders

- Manage volunteer teams and projects
- Track basic project progress
- Organize events

### For Volunteers

- Register as volunteers
- View volunteer opportunities

## Contributing

Explain how people can contribute to your project. Include guidelines for submitting issues or pull requests.

## License

This project is licensed under the [MIT License](LICENSE) - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

Give credit to any third-party resources, libraries, or tools that you used or were inspired by during the development of your project.
