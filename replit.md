# CyberSec Toolkit - Project Documentation

## Project Overview
Full-stack cybersecurity analysis toolkit providing 4 professional security tools:
1. Password Strength Analyzer
2. Phishing URL Detector  
3. Network Port Scanner
4. Keylogger Detection System

## Recent Changes (Last Updated: October 19, 2025)

### Database Integration
- ✅ PostgreSQL database configured and working
- ✅ DATABASE_URL environment variable set correctly
- ✅ Tables created: users, sessions, scanResults
- ✅ Ready for IP tracking feature (not yet implemented)

### UI Improvements
- ✅ Sidebar icons resized for better visibility:
  - Desktop: 20-24px icons
  - Mobile: 24-28px icons
  - Collapsed mode: Only arrow button visible (logo/text removed)
- ✅ Responsive design across all device sizes
- ✅ Touch-friendly spacing on mobile

## Technical Architecture

### Frontend
- React 18 + TypeScript
- Tailwind CSS + Radix UI components
- TanStack Query for data fetching
- Wouter for routing
- Client/server on same port (5000)

### Backend
- Express.js + TypeScript
- Local services (no external APIs)
- PostgreSQL database (Neon)
- Security middleware (Helmet, Rate Limiting)
- Input validation (Zod + Express Validator)

### Security Services
All security analysis runs locally on the server:
- Password: Entropy calculation, pattern detection, dictionary checks
- Phishing: 17+ indicators, typosquatting detection, brand database
- Port Scanner: TCP connect scans, service detection, banner grabbing
- Keylogger: Process analysis, entropy calculation, risk scoring

## User Preferences
- No external backend services or third-party APIs
- Privacy-focused: all analysis done locally
- IP address tracking requested but not yet implemented

## Project Structure
```
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   └── lib/           # Utilities
├── server/                # Backend Express app
│   ├── services/          # Security analysis services
│   ├── routes.ts          # API endpoints
│   └── db.ts              # Database connection
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema + Zod validation
└── attached_assets/       # Static assets
```

## API Endpoints
- POST /api/security/password-analysis
- POST /api/security/phishing-analysis
- POST /api/security/port-scan
- POST /api/security/port-scan-quick
- POST /api/security/keylogger-scan
- POST /api/security/terminate-process

## Development Notes
- Port 5000: Frontend and backend served together
- No proxy needed (Vite configured correctly)
- Database migrations: `npm run db:push`
- Dev server: `npm run dev` (auto-restart on file changes)

## Future Features (Requested)
- [ ] IP address tracking for scan results
- [ ] User authentication (if needed)
- [ ] Scan history storage in database

## Known Issues
None - all features working correctly as of October 19, 2025

## Team Members
- Brahamjot Singh
- Manvi
- Satbir Singh

## Important Commands
```bash
npm run dev          # Start development server
npm run db:push      # Push database schema changes
npm run build        # Build for production
npm run start        # Start production server
```
