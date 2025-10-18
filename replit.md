# CyberSec Toolkit

## Overview

CyberSec Toolkit is a comprehensive cybersecurity analysis suite built with React, Express, and TypeScript. The application provides multiple security tools including password analysis, phishing detection, port scanning, keylogger detection, and file integrity monitoring. It's designed as a full-stack web application with a modern dark-themed UI and real-time security analysis capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with a dark theme design system and CSS variables
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build System**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with TypeScript using ESM modules
- **Framework**: Express.js for the REST API server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Storage**: In-memory storage implementation with interfaces for future database integration
- **API Design**: RESTful endpoints organized by security tool functionality

### Security Services
The application implements five core security analysis services:
- **Password Service**: Analyzes password strength, entropy, and crack time estimates
- **Phishing Service**: Enhanced heuristic-based phishing detection with 17 comprehensive indicators including brand impersonation, typosquatting, suspicious TLDs, malicious patterns, and URL structure analysis. Operates completely offline without external API dependencies for full privacy
- **Port Service**: Performs network port scanning with service detection
- **Keylogger Service**: Scans running processes for suspicious keylogger behavior
- **File Integrity Service**: Monitors file systems for unauthorized changes

### Database Schema
Uses PostgreSQL with three main tables:
- **Users**: Authentication and user management
- **Scan Results**: Stores all security scan results with timestamps and scores
- **Monitored Files**: Tracks file integrity baselines and change detection

### Development Workflow
- **Development Mode**: Vite dev server with HMR and Express API proxy
- **Production Build**: Static asset generation with server-side bundling using esbuild
- **Type Safety**: Shared TypeScript schemas between client and server using Zod validation

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL database service
- **Drizzle ORM**: Type-safe database operations and migrations
- **Connection**: Uses DATABASE_URL environment variable for database connectivity

### UI Components
- **Radix UI**: Headless component library for accessibility and behavior
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Replit Integration**: Custom plugins for development environment support
- **Vite Plugins**: Runtime error overlay and development tooling
- **TypeScript**: Full-stack type safety with strict mode enabled

### Runtime Dependencies
- **Express Session**: Session management with PostgreSQL store
- **React Query**: Server state synchronization and caching
- **Wouter**: Lightweight routing for single-page application navigation

The application follows a modular architecture with clear separation between security services, API routes, and frontend components, enabling easy extension and maintenance of security tools.