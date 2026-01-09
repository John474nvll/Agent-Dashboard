# Retell AI Voice Agent Dashboard

A professional dashboard to manage, configure, and deploy Retell AI voice agents, with a specific focus on sales teams in Colombia.

## Features

- **Agent Management**: View and edit configurations for voice agents like "Santi" (BDR) and "Valentina" (Technical Sales).
- **Voice Testing**: Test agents via phone calls with built-in Colombian number validation (+57).
- **Custom Personas**: Create and configure new voice personas with specific identity prompts and voice settings.
- **Call History**: Track recent calls and agent interactions.
- **Modern UI**: Clean dark-mode interface built with Shadcn UI and Framer Motion.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Wouter, TanStack Query, Lucide Icons.
- **Backend**: Node.js, Express.
- **Database**: PostgreSQL with Drizzle ORM.
- **Integrations**: Retell SDK, Twilio (planned/integrated).

## Getting Started

### Prerequisites

- Node.js (v20+)
- PostgreSQL Database

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string.

3. Push the database schema:
   ```bash
   npm run db:push
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Development

- `shared/schema.ts`: Database models and Zod schemas.
- `shared/routes.ts`: API contract definitions.
- `server/routes.ts`: API route implementations.
- `client/src/pages/`: Frontend application pages.
