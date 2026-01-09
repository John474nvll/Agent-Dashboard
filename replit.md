# Multi-Agent Voice & WhatsApp System

## Overview

This is an AI-powered business development and sales platform that combines real-time voice communication via Retell AI with WhatsApp Business messaging. The system supports multiple specialized AI agents (like BDR and Technical Sales representatives) that can make outbound calls and handle conversations in Spanish. The platform provides a modern dashboard for monitoring agent performance, managing agent configurations, and tracking call history.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, bundled using Vite
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and caching
- **Styling**: Tailwind CSS with a dark professional theme, using CSS variables for theming
- **Component Library**: Shadcn UI (New York style) built on Radix UI primitives
- **Charts**: Recharts for dashboard analytics visualizations

The frontend follows a page-based structure with shared layout components. Pages include Dashboard (analytics overview), AgentsList (agent management), and AgentDetail (individual agent configuration).

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Pattern**: RESTful API with typed routes defined in `shared/routes.ts`
- **Validation**: Zod schemas for request/response validation
- **Build Process**: esbuild for production bundling with selective dependency bundling for cold start optimization

The server uses a storage abstraction layer (`IStorage` interface) implemented by `DatabaseStorage` class, allowing for potential future storage backend changes.

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Migrations**: Managed via `drizzle-kit push` command

Core entities:
- `agents`: Stores AI agent configurations including Retell AI settings as JSONB
- `calls`: Tracks call history with status, transcripts, and recordings
- `whatsAppMessages`: Stores WhatsApp conversation history

### Shared Code
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts`: Database schema and Zod validation schemas
- `routes.ts`: API route definitions with type-safe request/response schemas

## External Dependencies

### Voice Communication
- **Retell AI**: Primary voice agent platform providing real-time voice capabilities
  - Agents store full Retell configuration in the `config` JSONB field
  - Supports Spanish language voices (es-ES) with ElevenLabs integration
  - Features include voice temperature, speed control, interruption sensitivity

### Messaging
- **Twilio / WhatsApp Business API**: For WhatsApp messaging integration
  - Requires `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` environment variables

### Database
- **PostgreSQL**: Primary data store
  - Requires `DATABASE_URL` environment variable
  - Uses `pg` driver with connection pooling

### Required Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `RETELL_API_KEY`: Retell AI API authentication
- `TWILIO_ACCOUNT_SID`: Twilio account identifier
- `TWILIO_AUTH_TOKEN`: Twilio authentication token