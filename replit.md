# Replit Agent Project Memory

## Overview
AI Voice Agent Management Dashboard for Retell AI. Allows managing, deploying, and testing voice agents (BDRs, Sales).

## Recent Changes (2026-01-09)
- Implemented core Agent management (CRUD).
- Integrated Retell AI deployment simulation and test call triggers.
- Added Playground for voice simulation and web widget testing.
- Created `USER_MANAGEMENT.md` documentation.
- **Backend Ready**: Added `server/lib/external-services.ts` and endpoints for Twilio, WhatsApp (Meta), and Retell AI.
- **Playground Upgrade**: Added triggers for Real Voice Calls and WhatsApp messages in the playground.

## Project Architecture
- **Backend**: Express.js with Drizzle ORM (PostgreSQL).
- **Frontend**: React + Tailwind CSS + Shadcn UI.
- **Shared**: Zod schemas for API contracts.

## User Preferences
- Language: Spanish.
- Theme: Dark Mode / Professional Tech.
