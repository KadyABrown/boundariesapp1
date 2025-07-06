# BoundarySpace - Relationship Boundary Tracker

## Overview

BoundarySpace is a comprehensive relationship health tracking application that automatically analyzes relationship patterns through detailed interaction tracking and personal baseline assessment. The core function is to help users understand how their relationships impact their physical health, emotional well-being, and personal boundaries by comparing real interaction data against their established personal needs and values.

**Decision: Building from Scratch**
July 6, 2025 - After encountering persistent legacy issues with the existing codebase (authentication failures, database connection issues, conflicting dependencies), the decision was made to build a completely new project from scratch to avoid these exact problems and ensure a clean, working foundation.

**Core App Function:**
1. **Personal Baseline Assessment** - Users define their communication style, emotional needs, boundary requirements, and core values
2. **Comprehensive Interaction Tracking (CIT)** - Detailed logging of relationship interactions with pre/post measurements of energy, anxiety, self-worth, and physical symptoms
3. **Automatic Pattern Recognition** - The app analyzes CIT data against the baseline to automatically identify concerning patterns and positive behaviors
4. **Intelligent Health Scoring** - Combines interaction data, baseline compatibility, and pattern analysis for meaningful relationship health scores
5. **Actionable Insights** - Shows how relationships affect physical health, self-esteem, and boundary respect with specific recommendations based on personal baseline

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

## Advanced Relationship Analysis Features

### Comprehensive Interaction Tracking
The app now includes a sophisticated 5-step interaction tracker that captures detailed data for meaningful analysis:

**Step 1: Pre-Interaction State**
- Energy levels (1-10 scale) before interactions
- Anxiety levels with change tracking
- Self-worth measurements over time
- Mood assessment with emoji indicators
- Emotional warning signs identification

**Step 2: Interaction Context**
- Interaction type classification (casual, planned, conflict, etc.)
- Duration tracking in minutes
- Location/setting documentation
- Witness presence tracking
- Boundary testing indicators

**Step 3: Post-Interaction Impact**
- Energy level changes with visual impact display
- Anxiety level fluctuations
- Self-worth impact measurement
- Physical symptoms tracking (15+ symptoms including headaches, tension, fatigue)
- Emotional state assessment (18 different emotional states)

**Step 4: Recovery Analysis**
- Recovery time tracking (minutes/hours to feel normal)
- Recovery strategy effectiveness measurement
- What helped vs. what made it worse identification
- Coping skills usage and effectiveness tracking
- Support system engagement monitoring

**Step 5: Learning & Growth**
- Warning signs recognition and documentation
- Boundaries successfully maintained
- Self-advocacy actions taken
- Key lessons learned capture
- Future preparation strategies

### Trigger Pattern Analysis System
Advanced pattern recognition that identifies conversation topics and situations that lead to boundary violations:

**Trigger Categories:**
- Conversation topics (money, family, work, past relationships)
- Location/setting triggers (private vs public spaces)
- Time-based triggers (time of day, day of week)
- People present (alone vs with others)
- Behavioral triggers (their mood, stress level)
- Emotional state triggers (when you're tired, vulnerable)

**Pattern Intelligence:**
- Violation rate calculation per trigger
- Contextual factor correlation
- Effective response strategy tracking
- Trigger severity assessment
- Historical pattern analysis

### Communication Silence Tracking
Monitors boundary response patterns and communication gaps:

**Boundary Event Logging:**
- Type of boundary set (said no, set limit, called out behavior)
- Their immediate reaction (accepted, pushed back, got angry, silent treatment)
- Severity level assessment
- Response pattern analysis

**Silence Pattern Analysis:**
- Days since last boundary vs. days since last contact
- Typical silence duration calculation
- Normal vs. concerning pattern identification
- Predictive insights based on historical data
- Recovery timeline estimates

### Personal Baseline Assessment
Comprehensive compatibility system that compares relationships against user's core needs:

**Communication Preferences:**
- Communication style (direct, gentle, collaborative, assertive)
- Conflict resolution approach
- Listening needs and deal-breakers
- Feedback preferences

**Emotional Needs Mapping:**
- Emotional support level requirements
- Affection style preferences (love languages)
- Validation needs assessment
- Processing time requirements
- Trigger identification
- Comforting source preferences

**Boundary Requirements:**
- Personal space needs assessment
- Privacy level requirements
- Decision-making style preferences
- Non-negotiable vs. flexible boundaries

**Compatibility Scoring:**
- Overall compatibility percentage (0-100%)
- Communication compatibility score
- Emotional needs alignment
- Boundary respect compatibility
- Time/availability matching
- Values alignment assessment

### Cross-Relationship Comparison
Advanced analytics that compare relationship health across all tracked relationships:

**Relationship Health Metrics:**
- Overall health score (0-100) based on multiple factors
- Energy impact analysis (energizing vs. draining)
- Boundary respect rate calculations
- Communication quality assessment
- Emotional safety measurements
- Recovery time comparisons

**Comparative Analysis:**
- Healthiest vs. most problematic relationship identification
- Most energizing vs. most draining comparison
- Average health score across all relationships
- Growth contributor identification
- Declining relationship alerts

**Visual Analytics:**
- Health score comparison charts
- Multi-metric radar charts
- Detailed comparison tables
- Trend analysis over time
- Risk level categorization

### Time-Based Pattern Analysis
Identifies when boundary violations and relationship issues are most likely to occur:

**Time Pattern Detection:**
- Time of day analysis (morning, afternoon, evening, night)
- Day of week pattern identification
- Hourly violation heat maps
- Location-based risk assessment
- Seasonal trend analysis

**Predictive Insights:**
- Riskiest time periods identification
- Safest interaction windows
- Location risk factors
- Trend analysis (improving vs. declining)
- Proactive warning system

**Actionable Recommendations:**
- High-risk time period alerts
- Problematic day pattern identification
- Location risk factor warnings
- Deteriorating pattern alerts
- Preventive strategy suggestions

## Changelog

- June 30, 2025. Initial setup
- June 30, 2025. Added Dating Behavior Checklist feature with relationship profiles, emotional check-ins, and behavioral flag tracking
- June 30, 2025. Completed functional relationship tracking system: behavioral flags (+1/-1 scoring), emotional check-ins, real-time health calculations, neutral status language, and full data persistence
- July 1, 2025. Enhanced relationship profiles with comprehensive settings: privacy controls (friend/therapist sharing), emotional tracking preferences, custom tags, relationship status options (Interested → Over), and relationship-level settings dialog for post-creation editing
- July 1, 2025. Added comprehensive Friend System with search capabilities (username/email/phone), friend requests, friend circles, relationship visibility controls, and enhanced user profile system with phone number support
- July 1, 2025. Implemented friend circle management functionality with settings gear icons, friend circle assignment dialog, and documented the tiered privacy system for relationship data sharing
- July 1, 2025. Completed friend system with functional circle assignment, cleaned up UI by removing non-functional message icons, and successfully tested privacy controls with test data
- July 1, 2025. Implemented interactive relationship activity timeline visualization with chronological event tracking, expandable details, filtering capabilities, animated transitions, and dual view modes (timeline/list) - successfully tested and working
- July 1, 2025. Implemented comprehensive gamification system with achievement notifications, sound effects, daily challenges, boundary quotes, and streak recovery features
- July 1, 2025. Added advanced relationship analysis features: comprehensive interaction tracker (5-step wizard), mood/energy/physical symptoms tracking, recovery time analysis, trigger pattern identification, communication silence tracking, personal baseline assessment, cross-relationship comparison, and time-based pattern analysis
- July 2, 2025. Restored clean web-only version after mobile app experiment. Removed React Native/Expo mobile components to maintain stable web application. Mobile app development will continue in separate Expo project to preserve web app stability.
- July 5, 2025. Built comprehensive admin dashboard for tracking users, subscriptions, and revenue. Includes user management table, signup analytics, payment status monitoring, and search functionality. Implemented secure admin access control and comprehensive business metrics for subscription management.
- July 5, 2025. Enhanced admin dashboard with account type indicators. Added Account Type column showing "Admin" badges with crown icons for administrators and "User" badges for regular users. Prepared for future "Provider" account type for therapist and coach users.
- July 6, 2025. Successfully restored working backup version after encountering authentication issues with experimental rebuild. All core features now functional: authentication, database connections, API endpoints working properly.
- July 6, 2025. Removed paywall restrictions - all features now completely free. Added comprehensive marketing website with separate pages for unauthenticated users (homepage, pricing, demo, FAQ) while preserving app interface for authenticated users. Marketing site includes features overview, pricing explanation, interactive demos, and comprehensive FAQ section.
- July 6, 2025. Implemented fully functional Stripe payment integration. Successfully replaced Shopify with Stripe for $12.99/month subscription processing. Checkout flow working end-to-end: users can subscribe without authentication, redirected to Stripe's secure checkout, and payment processing confirmed. Subscription model now ready for production deployment.

## Future User Role System Planning

The application will need a tiered permission system to support multiple user types and admin levels:

### Planned User Types:
1. **Admin** - Full system access (currently implemented)
2. **Provider** - Therapists and coaches with specialized interfaces
3. **User** - Regular app users (currently implemented)

### Planned Admin Permission Levels:
1. **Super Admin** - Full system access, user management, business metrics
2. **Developer Admin** - Code deployment, technical settings, limited user data
3. **Marketing Admin** - Analytics, user engagement metrics, limited personal data access
4. **Support Admin** - User support tools, limited system access

This tiered approach will allow controlled backend access for partners while maintaining data security and appropriate access boundaries.

## User Preferences

Preferred communication style: Simple, everyday language.