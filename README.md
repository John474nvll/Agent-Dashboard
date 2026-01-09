# Multi-Agent Voice & WhatsApp System

An AI-powered system for business development and sales using Retell AI for real-time voice communication and WhatsApp Business integration.

## Features

- **Multi-Agent Architecture**: Support for specialized agents (BDR, Technical Sales, etc.).
- **Retell AI Integration**: Real-time voice capabilities with low latency and high-quality Spanish voices.
- **WhatsApp Business**: Integrated messaging for each agent.
- **Drizzle ORM & PostgreSQL**: Robust data persistence for agents, calls, and message history.
- **Express.js Backend**: Scalable API for agent management and webhook handling.
- **React Frontend**: Modern UI for monitoring and managing AI agents.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React, Vite, Tailwind CSS, Shadcn UI
- **Database**: PostgreSQL with Drizzle ORM
- **Voice**: Retell AI
- **Messaging**: Twilio / WhatsApp Business API

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - `DATABASE_URL`
   - `RETELL_API_KEY`
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`

3. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `server/`: Express backend and API routes.
- `client/`: React frontend application.
- `shared/`: Shared types and database schema.
- `attached_assets/`: Static assets and generated content.
