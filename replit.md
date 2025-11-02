# AI Test Generator

## Overview

AI Test Generator is a web application that helps QA engineers and developers automatically generate comprehensive test cases and Cypress test scripts from natural language requirements. The application uses Google's Gemini AI to analyze test scenarios and produce both manual test case documentation and automated Cypress scripts.

The system consists of a React frontend with shadcn/ui components, an Express.js backend, and flexible data persistence that supports both Firebase Firestore (for production) and in-memory storage (for development).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18+ with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management

**UI Component System**
- shadcn/ui component library (Radix UI primitives with Tailwind CSS)
- Design system inspired by Linear's aesthetic (defined in `design_guidelines.md`)
- Custom theming with light/dark mode support
- Responsive design with mobile-first approach

**Styling Approach**
- Tailwind CSS with custom configuration
- CSS variables for theming (light/dark modes)
- Inter font for UI text, JetBrains Mono for code blocks
- Custom hover and active state utilities (`hover-elevate`, `active-elevate-2`)

**State Management Strategy**
- React Query for server state (API responses, caching)
- React Context for theme management
- Local component state with React hooks
- No global state management library (Redux/Zustand) - keeps things simple

### Backend Architecture

**Server Framework**
- Express.js with TypeScript
- ESM module system (type: "module" in package.json)
- Development mode uses tsx for hot reloading
- Production build bundles with esbuild

**API Design**
- RESTful API endpoints under `/api` prefix
- POST `/api/generate` - Generate test cases from requirements
- GET `/api/history` - Retrieve all saved test generations
- DELETE `/api/history/:id` - Delete specific test generation
- Zod schema validation for request payloads

**AI Integration**
- Google Gemini AI (gemini-2.5-pro model)
- Uses @google/genai SDK (Developer API, not Vertex AI)
- Structured JSON output for test cases and Cypress scripts
- System prompts designed for QA automation expertise

**Data Persistence Strategy**
- Primary: Firebase Firestore (when configured)
- Fallback: In-memory storage (for development/testing)
- Graceful degradation - attempts Firestore first, falls back automatically
- Storage interface pattern (`IStorage`) allows easy swapping

**Database Schema (Firestore/PostgreSQL)**
- `test_generations` collection/table:
  - `id`: UUID primary key
  - `requirement`: Text description of test scenario
  - `manualTestCases`: JSONB array of test case objects
  - `cypressScript`: Complete Cypress test code
  - `createdAt`: Timestamp

**Session Management**
- Uses connect-pg-simple for session store
- Configured for PostgreSQL but not actively used in current implementation
- User authentication schema exists but not implemented in routes

### External Dependencies

**Third-Party Services**
- **Google Gemini AI**: Core AI service for test generation (requires `GEMINI_API_KEY`)
- **Firebase Firestore**: Optional cloud database for production (requires `FIREBASE_SERVICE_ACCOUNT` JSON)
- **Neon Database**: PostgreSQL provider configured via Drizzle ORM (requires `DATABASE_URL`)

**Key Libraries**
- **Drizzle ORM**: Type-safe SQL ORM configured for PostgreSQL
- **Radix UI**: Accessible component primitives for React
- **date-fns**: Date formatting utility
- **Tailwind CSS**: Utility-first CSS framework
- **Zod**: Schema validation for TypeScript

**Development Tools**
- **Replit-specific plugins**: Cartographer, dev banner, runtime error overlay
- **TypeScript**: Strict mode enabled for type safety
- **ESLint/Prettier**: Configured via Tailwind and PostCSS

**Environment Variables Required**
- `GEMINI_API_KEY`: Google Gemini API key (required for core functionality)
- `FIREBASE_SERVICE_ACCOUNT`: JSON credentials for Firebase (optional, falls back to in-memory)
- `DATABASE_URL`: PostgreSQL connection string (referenced but not actively used)
- `NODE_ENV`: Environment mode (development/production)

**API Rate Limits & Considerations**
- Gemini API has usage quotas - handle gracefully with error messages
- Firebase has free tier limitations on reads/writes
- No explicit rate limiting implemented in Express routes