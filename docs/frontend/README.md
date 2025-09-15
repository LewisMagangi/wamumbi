# Frontend Documentation

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Shadcn/UI Components
- Clerk Authentication

## Project Structure

```text
src/
├── app/              # Next.js app directory
├── components/       # Reusable UI components
├── lib/             # Utility functions
└── middleware.ts    # Authentication middleware
```

## Key Components

- Landing page with hero section
- Dashboard for different user roles
- Donation forms and campaign displays
- Event management interface
- Volunteer portal

## Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

## Styling

Uses Tailwind CSS with custom design system configured in `tailwind.config.ts`.

## UI/UX Design Planning

### Design Goals

The Wamumbi Charity Management System aims to create an intuitive, accessible, and emotionally engaging user experience that encourages charitable giving and volunteer participation. Our design philosophy centers around:

1. **Trust and Transparency** - Clean, professional design that builds donor confidence
2. **Emotional Connection** - Warm, inviting interface that connects users to the cause
3. **Accessibility First** - WCAG 2.1 AA compliant design for all users
4. **Mobile-First Approach** - Responsive design optimized for all device sizes
5. **Conversion Optimization** - Strategic placement of donation and volunteer CTAs

### Key Features Implementation

#### Core User Journeys

- **Donor Experience**: Seamless donation flow with progress tracking and impact visualization
- **Volunteer Portal**: Easy registration, activity logging, and team collaboration tools
- **Admin Dashboard**: Comprehensive campaign and project management interface
- **Event Management**: Event creation, registration, and attendance tracking

#### Priority Features

1. Landing page with compelling hero section and impact statistics
2. Multi-step donation form with payment processing
3. Campaign showcase with real-time progress indicators
4. Volunteer opportunity matching and scheduling
5. Admin analytics dashboard with KPIs and reporting

### Color Styles

Our color palette is built on Shadcn/UI design tokens with HSL values for maximum flexibility:

#### Primary Colors

- **Primary**: `hsl(0 0% 9%)` - Deep black for primary actions and headers
- **Primary Foreground**: `hsl(0 0% 98%)` - Near white for text on primary backgrounds
- **Rose Accent**: `hsl(346 77% 49%)` - Custom rose color for donation CTAs and highlights

#### Neutral Colors

- **Background**: `hsl(0 0% 100%)` - Pure white for main backgrounds
- **Foreground**: `hsl(0 0% 3.9%)` - Near black for body text
- **Muted**: `hsl(0 0% 96.1%)` - Light gray for subtle backgrounds
- **Muted Foreground**: `hsl(0 0% 45.1%)` - Medium gray for secondary text

#### Interactive Colors

- **Secondary**: `hsl(0 0% 96.1%)` - Light gray for secondary buttons
- **Accent**: `hsl(0 0% 96.1%)` - Accent color for highlights
- **Border**: `hsl(0 0% 89.8%)` - Subtle borders and dividers
- **Destructive**: `hsl(0 84.2% 60.2%)` - Red for error states and warnings

#### Chart Colors (for Analytics)

- **Chart 1**: `hsl(12 76% 61%)` - Orange for donation metrics
- **Chart 2**: `hsl(173 58% 39%)` - Teal for volunteer activities
- **Chart 3**: `hsl(197 37% 24%)` - Dark blue for project progress
- **Chart 4**: `hsl(43 74% 66%)` - Yellow for event metrics
- **Chart 5**: `hsl(27 87% 67%)` - Warm orange for campaign data

### Typography

#### Font Families

- **Primary Font**: Geist Sans - Modern, readable sans-serif for body text and UI elements
- **Monospace Font**: Geist Mono - For code blocks, data displays, and technical content

#### Font Weights

- **Light (300)**: Used sparingly for large headings and hero text
- **Regular (400)**: Default weight for body text and paragraphs
- **Medium (500)**: For subheadings and emphasized text
- **Semibold (600)**: For card titles and section headers
- **Bold (700)**: For main headings and important CTAs

#### Font Sizes (Tailwind Scale)

- **xs (12px)**: Captions, fine print, and legal text
- **sm (14px)**: Secondary text and form labels
- **base (16px)**: Default body text and paragraph content
- **lg (18px)**: Lead paragraphs and emphasized content
- **xl (20px)**: Card titles and subsection headers
- **2xl (24px)**: Section headers and page titles
- **3xl (30px)**: Main page headings
- **4xl (36px)**: Hero headings and primary CTAs

### Design Properties Importance

Understanding and documenting design properties from mockups is crucial for:

1. **Consistency**: Ensures uniform spacing, colors, and typography across all components
2. **Developer Handoff**: Provides clear specifications for accurate implementation
3. **Scalability**: Establishes design tokens that can be systematically applied
4. **Accessibility**: Defines contrast ratios, font sizes, and interactive element sizing
5. **Brand Cohesion**: Maintains visual identity across all user touchpoints
6. **Performance**: Optimizes asset usage and reduces design debt

Key properties to extract from mockups:

- Exact color values (HSL/RGB/HEX)
- Font families, weights, and sizes
- Spacing values (margins, padding, gaps)
- Border radius and shadow specifications
- Animation timings and easing functions
- Breakpoint definitions for responsive design

## UI Component Patterns

### Core Navigation Components

#### Navbar Component

**Location**: `src/components/Navbar.tsx`

**Features**:

- Fixed positioning with backdrop blur effect
- Fixed positioning with backdrop blur effect
- Responsive design with mobile hamburger menu
- Integrated Clerk authentication (SignIn/SignUp/UserButton)
- Prominent donation CTA with rose accent color
- Conditional rendering based on authentication state

**Key Design Elements**:

- Backdrop blur for modern glass morphism effect
- Strategic placement of donation button in center
- Mobile-first responsive navigation
- Consistent button styling with variant system

#### Header Component

**Location**: `src/components/Header/`

**Purpose**: Page-specific headers with breadcrumbs and page actions

**Features**:

- Dynamic page titles and descriptions
- Breadcrumb navigation for complex workflows
- Page-specific action buttons (e.g., "Create Campaign")
- User context and role-based content

#### Footer Component

**Location**: `src/components/footer.tsx`

**Features**:

- Multi-column layout with organized links
- Social media integration
- Newsletter signup form
- Legal and compliance information
- Contact details and foundation information

### Layout Components

#### MaxWidthWrapper

**Location**: `src/components/max-width-wrapper.tsx`

**Purpose**: Consistent content width and centering across pages

**Features**:

- Responsive max-width constraints
- Consistent horizontal padding
- Flexible className prop for customization

### Content Components

#### Landing Page

**Location**: `src/components/landing-page.tsx`

**Features**:

- Hero section with compelling messaging
- Impact statistics display
- Featured campaigns showcase
- Call-to-action sections
- Testimonials and success stories

#### Image Slider

**Location**: `src/components/image-slider.tsx`

**Purpose**: Interactive image carousels for campaigns and events

**Features**:

- Touch/swipe gesture support
- Autoplay with pause on hover
- Thumbnail navigation
- Accessibility keyboard controls

### UI Foundation (Shadcn/UI)

#### Base Components

**Location**: `src/components/ui/`

Built on Radix UI primitives with custom styling:

- **Button**: Multiple variants (default, destructive, outline, secondary, ghost)
- **Card**: Container component for content organization
- **Input**: Form input fields with validation states
- **Badge**: Status indicators and tags
- **Dialog**: Modal dialogs for forms and confirmations
- **Dropdown Menu**: Context menus and action menus
- **Sheet**: Slide-out panels for mobile navigation
- **Tabs**: Content organization and navigation
- **Form**: Form handling with React Hook Form integration

### Data Display Components

#### Dashboard Cards

Purpose: KPI and metric display for different user roles

Features:

- Real-time data updates
- Interactive charts and graphs
- Role-based content filtering
- Responsive grid layouts

#### Campaign Cards

Features:

- Progress bars with donation tracking
- Image thumbnails with lazy loading
- Action buttons (Donate, Learn More, Share)
- Category tags and status indicators

#### Event Cards

Features:

- Date and time formatting
- Location information
- Registration status indicators
- Capacity and availability display

### Form Components

#### Donation Forms

Features:

- Multi-step wizard flow
- Payment method selection
- Real-time validation
- Progress indicators
- Success and error states

#### Registration Forms

Features:

- Dynamic field validation
- File upload capabilities
- Multi-column layouts on desktop
- Mobile-optimized input sizing

### Design System Benefits

1. **Consistency**: Unified component library ensures consistent UX
2. **Efficiency**: Reusable components reduce development time
3. **Maintainability**: Centralized styling updates propagate automatically
4. **Accessibility**: Built-in ARIA support and keyboard navigation
5. **Scalability**: Component composition allows for complex UI construction
6. **Performance**: Optimized bundle splitting and lazy loading
