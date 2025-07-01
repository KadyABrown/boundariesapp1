# BoundarySpace - Relationship Boundary Tracker

## Overview

BoundarySpace is a full-stack web application designed to help users define, track, and reflect on their personal boundaries. The application transforms a traditional boundary tracking journal into an interactive digital experience, enabling users to build healthier relationships through guided self-awareness tools.

The system is built as a modern React SPA with an Express.js backend, using PostgreSQL for data persistence and Replit's authentication system for user management.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **UI Framework**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with custom theme variables
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints under `/api` prefix
- **Session Management**: Express sessions with PostgreSQL storage
- **Authentication**: Replit's OpenID Connect (OIDC) integration

### Data Layer
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Schema Management**: Drizzle Kit for migrations
- **Connection**: Neon serverless driver with WebSocket support

## Key Components

### Authentication System
- Replit OIDC integration for secure user authentication
- Session-based authentication with PostgreSQL session storage
- User profile management with email, name, and profile image support
- Protected routes with automatic redirect handling

### Boundary Management
- **Boundary Definitions**: Users can create custom boundary categories (work-life, social-media, personal-space, etc.)
- **Importance Scaling**: 1-10 rating system for boundary prioritization
- **Status Tracking**: Active/inactive boundary management
- **CRUD Operations**: Full create, read, update, delete functionality

### Activity Tracking
- **Daily Entries**: Record boundary experiences with emotional context
- **Status Categories**: Respected, Challenged, Communicated, Violated
- **Emotional Mapping**: 5-point emotional scale with emoji indicators
- **Contextual Notes**: Free-form text for detailed experience capture

### Dating Behavior Checklist
- **Relationship Profiles**: Create detailed profiles for romantic connections with comprehensive metadata and relationship status tracking (Interested → Over)
- **Enhanced Privacy Controls**: Individual relationship-level settings for sharing with friends/therapists, silent notifications, and flag visibility
- **Emotional Safety Check-ins**: Structured questionnaires tracking safety feelings and emotional tone changes over time
- **Behavioral Flag System**: Green/red flag tracking across categories (Communication, Respect, Emotional Consistency, Trust & Reliability)
- **Relationship Analytics**: Health scores, flag counts, safety ratings, and trend analysis
- **Support Preferences**: Customizable prompts for boundaries, conversations, ending relationships, and journaling

### Relationship Pattern Guide (Paired Flag System)
- **Mobile-Friendly Paired Cards**: Display healthy and unhealthy relationship behaviors side-by-side by theme
- **Theme-Based Organization**: Group behaviors by Communication, Trust, Emotional Safety, and other relationship themes
- **Educational Comparison**: Each card shows the green flag (healthy) and red flag (unhealthy) version of the same behavior
- **Comprehensive Details**: Behavior descriptions, real examples, emotional impact explanations, and actionable guidance
- **CSV Import for Paired Data**: Advanced parser handles multi-line cells and complex CSV formats with paired behaviors per row
- **Responsive Design**: Cards stack vertically on mobile, display side-by-side on desktop
- **Search and Filter**: Find patterns by theme or search across behavior descriptions
- **No Judgment Labels**: Removed severity and addressability ratings - users decide what matters for their situation

### Analytics & Insights
- **Dashboard Statistics**: Real-time boundary respect rates and trends
- **Progress Tracking**: Weekly and daily performance metrics
- **Reflection System**: Structured reflection entry system
- **Timeline Views**: Chronological activity visualization

### User Interface
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Component Library**: Consistent design system using Radix UI primitives
- **Navigation**: Sticky header with mobile sheet navigation
- **Toast Notifications**: User feedback for actions and errors
- **Loading States**: Skeleton loaders and loading indicators

## Data Flow

### Client-Server Communication
1. **Authentication Flow**: OIDC redirect → session creation → user profile fetch
2. **Data Fetching**: React Query handles caching, background updates, and error states
3. **Form Submissions**: Optimistic updates with error rollback
4. **Real-time Updates**: Query invalidation triggers automatic re-fetching

### Database Operations
1. **User Management**: Automatic user creation/update on authentication
2. **Boundary CRUD**: Type-safe operations through Drizzle ORM
3. **Entry Logging**: Timestamped activity records with relational integrity
4. **Analytics Queries**: Aggregated statistics with date range filtering

## External Dependencies

### Core Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting
- **Replit Authentication**: OIDC provider for user management
- **Vite Development**: Hot module replacement and fast builds

### UI/UX Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide Icons**: Consistent icon system
- **Date-fns**: Date manipulation and formatting

### Backend Services
- **Express.js**: Web application framework
- **Drizzle ORM**: Type-safe database operations
- **Connect-pg-simple**: PostgreSQL session store
- **Passport.js**: Authentication middleware

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express API proxy
- **Hot Reloading**: Both client and server support hot module replacement
- **Environment Variables**: DATABASE_URL, SESSION_SECRET, REPLIT_DOMAINS
- **Database Management**: Drizzle Kit for schema migrations

### Production Build
- **Client Build**: Vite production build with optimized assets
- **Server Bundle**: ESBuild compilation to single executable
- **Static Assets**: Served from Express with proper caching headers
- **Database**: Neon serverless with connection pooling

### Security Considerations
- **Session Security**: HTTPOnly cookies with secure flags
- **CSRF Protection**: Built into session management
- **Input Validation**: Zod schema validation on API endpoints
- **Database Security**: Parameterized queries through Drizzle ORM

## Friend Circle Privacy System

The app implements a tiered privacy system using friend circles to control relationship data sharing:

### Friend Circle Types & Access Levels:
1. **Close Friends**: Full access to all relationship data
2. **Dating Circle**: Access to dating-related relationships only
3. **Work Friends**: Access to public relationships only  
4. **No Circle**: No access to relationship data

### How It Works:
- Each friend can be assigned to one friend circle via the settings gear icon
- Relationship profiles have privacy settings that specify which circles can view them
- When friends view the "Shared Data" tab, they only see relationships they have permission to access
- Privacy controls are managed individually per relationship profile

### Implementation:
- Friend circles are stored in the `friendCircles` table
- Friendships have a `circleTag` field linking them to circles
- Relationship profiles have sharing settings that correspond to circle permissions
- Backend filters shared data based on friend circle membership

## Changelog

- June 30, 2025. Initial setup
- June 30, 2025. Added Dating Behavior Checklist feature with relationship profiles, emotional check-ins, and behavioral flag tracking
- June 30, 2025. Completed functional relationship tracking system: behavioral flags (+1/-1 scoring), emotional check-ins, real-time health calculations, neutral status language, and full data persistence
- July 1, 2025. Enhanced relationship profiles with comprehensive settings: privacy controls (friend/therapist sharing), emotional tracking preferences, custom tags, relationship status options (Interested → Over), and relationship-level settings dialog for post-creation editing
- July 1, 2025. Added comprehensive Friend System with search capabilities (username/email/phone), friend requests, friend circles, relationship visibility controls, and enhanced user profile system with phone number support
- July 1, 2025. Implemented friend circle management functionality with settings gear icons, friend circle assignment dialog, and documented the tiered privacy system for relationship data sharing

## User Preferences

Preferred communication style: Simple, everyday language.