# FarmGuard - Climate Risk Warning System for Farmers

## Overview

FarmGuard is a full-stack web application designed to help small farmers monitor weather conditions and receive SMS alerts for climate-related risks like droughts, floods, and pest outbreaks. The platform provides real-time weather data, risk detection, field mapping capabilities, crop management, and an AI-powered chatbot assistant to help farmers make informed decisions about their agricultural practices.

**Core Purpose:** Protect small farmers with real-time climate intelligence and proactive risk warnings through SMS notifications in multiple languages.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling:**
- React with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and data fetching

**UI Component System:**
- Shadcn/ui component library (New York style variant)
- Radix UI primitives for accessible, unstyled components
- Tailwind CSS for utility-first styling with custom design tokens
- CSS variables for theming (light/dark mode, multiple color themes)

**Key Features:**
- Multi-language support (English, Spanish, Hindi) with translation system
- Accessibility features (text size adjustment, high contrast mode, reduced motion, screen reader support)
- Responsive design with mobile-first approach
- Interactive map integration using Leaflet for field visualization and drawing
- Data visualization with Recharts for weather trends and analytics
- Real-time chatbot interface powered by OpenAI

**State Management:**
- React Query for async server state
- Local component state with React hooks
- localStorage for persisting user preferences (theme, language, accessibility settings)

### Backend Architecture

**Server Framework:**
- Express.js for REST API endpoints
- TypeScript throughout for type safety
- Custom middleware for request logging and error handling

**API Structure:**
- RESTful endpoints organized by resource (`/api/farmers`, `/api/fields`, `/api/alerts`, `/api/weather`, etc.)
- Service layer pattern separating business logic from route handlers
- Storage abstraction layer (DatabaseStorage class) for database operations

**Key Services:**
- **Weather Service:** Fetches real-time and forecast data from OpenWeatherMap API, with fallback to mock data
- **Risk Detection Service:** Analyzes weather patterns to detect drought, flood, and pest risks with severity levels
- **SMS Service:** Sends multilingual alerts via Twilio API
- **Crop Seed Service:** Provides comprehensive crop database (500+ crops) with growing requirements
- **Companion Plants Service:** Recommends beneficial crop combinations for multicropping

**Design Patterns:**
- Service classes for encapsulated business logic
- Factory pattern for creating mock data when APIs unavailable
- Repository pattern through storage abstraction

### Data Storage

**Database:**
- PostgreSQL (via Neon serverless)
- Drizzle ORM for type-safe database queries and schema management
- Connection pooling with @neondatabase/serverless

**Schema Design:**
- **farmers:** User profiles with location coordinates, phone, language preference
- **fields:** Field polygons with crop assignments and farmer ownership
- **crops:** Comprehensive crop database with growing requirements
- **companionPlants:** Crop relationship data for companion planting recommendations
- **alerts:** Historical SMS alerts with status tracking
- **weatherData:** Cached weather information

**Data Access:**
- Type-safe queries with Drizzle ORM
- Zod schemas for runtime validation matching database schema
- Centralized storage service for all database operations

### Authentication & Authorization

**Current Implementation:**
- No authentication system implemented (designed for farmer enrollment system)
- Session management scaffolding present (connect-pg-simple) but not actively used
- All endpoints currently open access

**Design Decision Rationale:**
- Application designed for farmer outreach program where staff enroll farmers
- SMS-based communication doesn't require farmer login
- Future enhancement: Add admin authentication for staff managing the system

### External Dependencies

**Weather Data:**
- OpenWeatherMap API for current conditions and 7-day forecasts
- Fallback to mock data when API key not configured
- Data includes temperature, humidity, rainfall, and conditions

**SMS Notifications:**
- Twilio API for sending SMS alerts
- Multi-language message templates (English, Spanish, Hindi)
- Graceful degradation (logs messages when Twilio not configured)

**AI Integration:**
- OpenAI GPT-5 via Replit AI Integrations service
- System prompt configured for agricultural advice and FarmGuard feature guidance
- Conversational chatbot interface for farmer support

**Geocoding:**
- OpenCage Geocoding API for address-to-coordinates conversion
- Used in farmer registration when coordinates unknown

**Mapping:**
- Leaflet.js for interactive maps
- Leaflet Draw plugin for polygon field drawing
- OpenStreetMap tiles as base layer

**Development Tools:**
- Replit-specific plugins for runtime error overlay and dev tooling
- ESBuild for production server bundling
- Drizzle Kit for database migrations

### Build & Deployment

**Development:**
- Vite dev server with HMR
- Express backend runs via tsx (TypeScript execution)
- Concurrent client/server development

**Production:**
- Vite builds optimized client bundle to `dist/public`
- ESBuild bundles server code to `dist/index.js`
- Single Node.js process serves both static files and API

**Environment Variables Required:**
- `DATABASE_URL`: PostgreSQL connection string (required)
- `OPENWEATHER_API_KEY`: Weather data API key (optional, falls back to mock)
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`: SMS service (optional, logs when missing)
- `AI_INTEGRATIONS_OPENAI_BASE_URL`, `AI_INTEGRATIONS_OPENAI_API_KEY`: AI chatbot (via Replit)
- `OPENCAGE_API_KEY`: Geocoding service (optional)