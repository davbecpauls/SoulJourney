# Academy of Remembrance - Learning Management System

## Overview

Academy of Remembrance is a mystical-themed learning management system (LMS) that provides two distinct educational experiences: a magical quest-based journey for children and a sacred wisdom path for adults. The platform features a full-stack architecture with a React frontend, Express backend, PostgreSQL database, and comprehensive content management capabilities.

The system allows educators to create and manage structured learning content organized into realms (domains), modules (course sections), and lessons (individual learning units). Students can progress through content, track their achievements, maintain digital journals, and engage with multimedia learning materials.

## Recent Changes

**January 2025** - Fixed all TypeScript compilation errors across the platform:
- Resolved storage layer type issues with proper default value handling for nullable fields
- Fixed Badge component prop issues by removing invalid `size` props throughout the application
- Added proper type interfaces for lesson content structure supporting both child and adult themes
- Ensured all form inputs handle null/undefined values correctly with proper type casting
- The platform now compiles without errors and is ready for deployment

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite for build tooling
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom mystical theming and CSS variables
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state, React Context for theme management
- **Theme System**: Dual-theme architecture supporting both "child" (colorful, magical) and "adult" (sophisticated, mystical) visual experiences

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Development**: Hot reloading with Vite integration in development mode
- **Build Strategy**: ESBuild for production bundling with platform-specific optimizations

### Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema synchronization
- **Session Storage**: PostgreSQL-based session management with connect-pg-simple

### Database Schema Design
The system uses a hierarchical content structure:
- **Users**: Authentication, preferences, and theme settings
- **Realms**: Top-level learning domains (Earth, Water, Fire, Air, Spirit elements)
- **Modules**: Course sections within realms with prerequisite tracking
- **Lessons**: Individual learning units with rich multimedia content stored as JSONB
- **Progress Tracking**: User completion status, scores, and timestamps
- **Achievements**: Gamification system with unlockable rewards
- **Journal Entries**: Personal reflection and note-taking capabilities

### Authentication and Authorization
- **Strategy**: Session-based authentication with secure password handling
- **User Roles**: Basic user/admin role separation with admin content management capabilities
- **Session Management**: Server-side session storage with PostgreSQL backend
- **Security**: Input validation using Zod schemas and SQL injection prevention through parameterized queries

### Content Management System
- **Structure**: Three-tier hierarchy (Realms → Modules → Lessons)
- **Rich Content**: JSONB storage for multimedia lesson content including videos, audio, interactive elements
- **Theme Support**: Dual content presentation supporting both child and adult themes
- **Prerequisites**: Module-level dependency tracking for learning path progression
- **Order Management**: Flexible ordering system for content sequencing

### Performance and Scalability
- **Query Optimization**: TanStack React Query for intelligent caching and background updates
- **Asset Management**: Vite-based asset optimization with proper aliasing
- **Database Performance**: Indexed foreign keys and optimized query patterns
- **Development Experience**: Hot module replacement and error overlay integration

## External Dependencies

### Database and Hosting
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database operations and query building
- **Drizzle Kit**: Database migration and schema management tooling

### UI and Design System
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **shadcn/ui**: Pre-built component library with consistent design patterns
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Lucide React**: Consistent icon system throughout the application
- **Class Variance Authority**: Type-safe component variant management

### Development and Build Tools
- **Vite**: Fast build tool with hot module replacement and optimized bundling
- **TypeScript**: Static type checking across frontend, backend, and shared schemas
- **ESBuild**: High-performance JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind integration

### Data Management and Validation
- **TanStack React Query**: Server state management with caching and synchronization
- **Zod**: Runtime type validation and schema definition
- **React Hook Form**: Form state management with validation integration
- **Hookform Resolvers**: Integration between React Hook Form and Zod validation

### Additional Integrations
- **Wouter**: Lightweight routing solution for single-page application navigation
- **date-fns**: Date manipulation and formatting utilities
- **Replit Integration**: Development environment optimization with cartographer and error overlay plugins