# BoundaryCore - Relationship Boundary Tracker

## Overview

BoundaryCore is a full-stack web application designed to help users define, track, and reflect on their personal boundaries. The application transforms a traditional boundary tracking journal into an interactive digital experience, enabling users to build healthier relationships through guided self-awareness tools.

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
- July 6, 2025. Fixed critical API query path issues in relationship profile detail component - corrected flags and check-ins data fetching, fixed property mapping for behavioral flags display, and restored working health score calculations with real test data (8 green flags, 3 red flags showing 73% health score for Bet profile)
- July 6, 2025. Created comprehensive public-facing marketing website with mobile-responsive design: landing page with "Know Your Boundaries" hero, interactive demo with pre-populated relationship data and working check-in functionality, detailed pricing page ($12.99/month), comprehensive FAQ with expandable sections, and public routes accessible without authentication
- July 6, 2025. Perfected demo page layout and functionality: moved Relationship Insights & Analytics above Relationships Summary, integrated real EmotionalWeather and BoundaryBuddy components (removed fake UI), updated demo data structure with both flags.green/flags.red and greenFlags/redFlags properties for component compatibility, removed "Add New Relationship" button for simplicity. Demo now shows authentic app experience with working weather system that reflects actual relationship data. Note: Same EmotionalWeather data structure fix needed in main user app.
- July 6, 2025. Completed subscription flow without authentication requirement: removed all free trial language from pricing and FAQ pages, added customer information collection form (email, first/last name), created new API endpoint `/api/create-subscription-with-account` that creates Stripe customer and subscription without authentication, updated FAQ to clarify cancellation policy ("can cancel anytime through account settings, no cancellation fees"), implemented two-step subscription process (customer info → payment form)
- July 6, 2025. Fixed final subscription flow issues: removed "Pro" branding throughout app (now just "BoundaryCore"), corrected subscription success page to guide users to login rather than direct dashboard access, fixed admin user deletion error (corrected table name from friendRequests to friendships), confirmed logout functionality exists for testing subscription flow
- July 7, 2025. Successfully completed comprehensive rebrand from "BoundarySpace" to "BoundaryCore" throughout entire codebase: updated all React components, TypeScript files, marketing website, navigation systems, demo pages, FAQ content, pricing pages, server routes, Shopify integration, documentation files, mobile app specifications, and welcome email templates. All 100+ instances systematically replaced while preserving existing functionality, design, and user experience. Rebrand completed across frontend, backend, and documentation layers.
- July 7, 2025. COMPLETED FINAL REBRAND CLEANUP: Performed systematic final cleanup of all remaining "BoundarySpace" instances across marketing pages (FAQ, landing, homepage), completing the 100% rebrand from "BoundarySpace" to "BoundaryCore" with bash verification confirming zero remaining instances in the active codebase.
- July 22, 2025. BOUNDARY SYSTEM IMPROVEMENTS: Fixed Communication Boundaries TagInput system with visual tags and delete buttons, improved boundary language to clear "Boundary Met/Violated" format in CIT Step 5, enhanced boundary tracking to contribute to green/red flag scoring system, separated boundary types with distinct "Boundary-Baseline Alignment" section for baseline boundaries vs manual boundaries, updated database schema with boundariesMet field for positive boundary tracking, and cleaned up redundant boundary sections for better organization.
- July 22, 2025. COMPREHENSIVE INTERACTION TRACKER FIXES: Resolved critical CIT form data mapping issues by fixing field name mismatches between form inputs and database schema (energyBefore → preEnergyLevel, duration → durationMinutes, etc.), removed redundant boundary testing question from step 2 and made it automatically trigger when boundary violations are selected on step 5, fixed form validation errors with proper array/string field transformations, and verified comprehensive interaction data now saves and displays correctly with full energy impact, anxiety changes, recovery metrics, and boundary testing detection.
- July 22, 2025. UNIFIED WELLNESS ANALYTICS WITH PERSONALIZED RECOMMENDATIONS: Enhanced Analytics tab with comprehensive cross-relationship insights analyzing how different relationship types (workplace, family, romantic) and statuses impact emotional and physical wellness. Built unified data visualization showing wellness scores, energy impacts, physical symptom patterns, and boundary violation rates. Added personalized actionable recommendations system that provides specific strategies for strengthening challenging relationships, energy protection protocols, physical wellness guidelines, and relationship stage pattern analysis. System generates custom advice based on user's actual data patterns rather than generic suggestions.
- July 22, 2025. AUTHENTICATION & ANALYTICS RESTORATION: Fixed critical login issues by completely removing Stripe-related database columns (stripe_customer_id, stripe_subscription_id, subscription_status) from users table and schema. Resolved TypeScript errors in UnifiedWellnessAnalytics component preventing analytics rendering. Fixed EmotionalWeather component to show proper relationship data instead of fake "environments". All admin panel features working: user deletion with proper foreign key handling, feedback system routes, and last active tracking. Core application fully functional with clean authentication system.

## User Preferences

Preferred communication style: Simple, everyday language.

## Future Enhancements for Main User App

From demo page feedback (July 6, 2025):
- **Custom Tags**: Add descriptive tags like "Communicative", "Ambitious" to relationship cards for quick personality insights
- **Status Type Display**: Implement clear relationship status badges on main relationship cards  
- **Flag Count Summaries**: Show green/red flag counts directly on relationship cards for quick health overview
- **Note**: Don't implement these yet - focus on fixing existing functionality first (EmotionalWeather data structure)